export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import {
  users, classrooms, classroomCurriculum, curriculum,
  curriculumDays, curriculumContent, contentItems, studentSessions, schools,
} from '@/lib/db/schema'
import { eq, and, inArray, isNull } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// ── Schema ────────────────────────────────────────────────────────────────────

const bodySchema = z.object({
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  classroomId:  z.string().uuid().optional(),
})

// ── GET /api/v1/teacher/send-report?weekStartDate=YYYY-MM-DD ─────────────────
// Preview — returns match status per student (no Supabase needed).

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  if (session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const weekStartDate = req.nextUrl.searchParams.get('weekStartDate')
  if (!weekStartDate || !/^\d{4}-\d{2}-\d{2}$/.test(weekStartDate)) {
    return apiError('weekStartDate required (YYYY-MM-DD)', 'VALIDATION_ERROR', 400)
  }

  const adminClassroomId = req.nextUrl.searchParams.get('classroomId')
  const [classroom] = session.role === 'admin' && adminClassroomId
    ? await db.select().from(classrooms).where(eq(classrooms.id, adminClassroomId)).limit(1)
    : await db.select().from(classrooms).where(eq(classrooms.teacherId, session.sub)).limit(1)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName, parentName: users.parentName, parentEmail: users.parentEmail })
    .from(users)
    .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))

  const preview = students.map(s => ({
    studentName: (s.displayName ?? s.name).trim(),
    matched:     !!s.parentEmail,
    parentName:  s.parentName ?? null,
    parentEmail: s.parentEmail ?? null,
  }))

  return apiOk({ weekStartDate, preview })
}

// ── POST /api/v1/teacher/send-report ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  if (session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ''
  if (!RESEND_API_KEY) {
    return apiError('RESEND_API_KEY env var is not set.', 'CONFIG_ERROR', 500)
  }

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { weekStartDate, classroomId: adminClassroomId } = parsed.data

  // ── 1. Load classroom ────────────────────────────────────────────────────────
  const [classroom] = session.role === 'admin' && adminClassroomId
    ? await db.select().from(classrooms).where(eq(classrooms.id, adminClassroomId)).limit(1)
    : await db.select().from(classrooms).where(eq(classrooms.teacherId, session.sub)).limit(1)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const [school] = classroom.schoolId
    ? await db.select({ name: schools.name }).from(schools).where(eq(schools.id, classroom.schoolId)).limit(1)
    : [undefined]
  const schoolName = school?.name ?? 'KeenKids'

  // ── 2. Load curriculum for the week ─────────────────────────────────────────
  const [weekRow] = await db
    .select({ curriculumId: classroomCurriculum.curriculumId, title: curriculum.title, theme: curriculum.theme })
    .from(classroomCurriculum)
    .innerJoin(curriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
    .where(and(
      eq(classroomCurriculum.classroomId, classroom.id),
      eq(classroomCurriculum.weekStartDate, weekStartDate),
    ))
    .limit(1)

  if (!weekRow) return apiError('No curriculum assigned for this week', 'NOT_FOUND', 404)

  // ── 3. Load content items for the week ──────────────────────────────────────
  const dayItems = await db
    .select({ subject: curriculumDays.subject, contentItemId: curriculumContent.contentItemId })
    .from(curriculumDays)
    .innerJoin(curriculumContent, eq(curriculumContent.curriculumDayId, curriculumDays.id))
    .where(eq(curriculumDays.curriculumId, weekRow.curriculumId))

  const contentItemIds = dayItems.map(d => d.contentItemId)
  const subjectByItem  = new Map(dayItems.map(d => [d.contentItemId, d.subject]))

  // ── 4. Load students ─────────────────────────────────────────────────────────
  const students = await db
    .select({
      id: users.id, name: users.name, displayName: users.displayName,
      lastActiveAt: users.lastActiveAt, parentName: users.parentName, parentEmail: users.parentEmail,
    })
    .from(users)
    .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))

  if (students.length === 0) return apiError('No students in classroom', 'NOT_FOUND', 404)

  // ── 5. Load student sessions for this week ──────────────────────────────────
  const sessions = contentItemIds.length > 0
    ? await db
        .select({
          studentId:     studentSessions.studentId,
          contentItemId: studentSessions.contentItemId,
          completed:     studentSessions.completed,
          sessionData:   studentSessions.sessionData,
        })
        .from(studentSessions)
        .where(and(
          inArray(studentSessions.studentId, students.map(s => s.id)),
          inArray(studentSessions.contentItemId, contentItemIds),
        ))
    : []

  const sessionsByStudent = new Map<string, Map<string, typeof sessions[0]>>()
  for (const s of sessions) {
    if (!sessionsByStudent.has(s.studentId)) sessionsByStudent.set(s.studentId, new Map())
    sessionsByStudent.get(s.studentId)!.set(s.contentItemId, s)
  }

  // ── 6. Send emails ──────────────────────────────────────────────────────────
  const resend  = new Resend(RESEND_API_KEY)
  const results: { student: string; status: 'sent' | 'no_email' | 'error'; parentEmail?: string }[] = []

  const SUBJECT_LABEL: Record<string, string> = {
    science:         'Science',
    coding:          'Coding',
    math:            'Math',
    public_speaking: 'Speaking',
    build:           'Build',
    arts:            'Arts',
  }

  const weekEnd = new Date(weekStartDate)
  weekEnd.setDate(weekEnd.getDate() + 7)

  for (const student of students) {
    const studentName = (student.displayName ?? student.name).trim()

    if (!student.parentEmail) {
      results.push({ student: studentName, status: 'no_email' })
      continue
    }

    const studentSess = sessionsByStudent.get(student.id) ?? new Map()
    const completed: string[] = []
    const inProgress: string[] = []
    let scienceNotes = ''

    for (const [itemId, subject] of Array.from(subjectByItem.entries())) {
      const sess  = studentSess.get(itemId)
      const label = SUBJECT_LABEL[subject] ?? subject

      if (sess?.completed) {
        if (subject === 'math') {
          const data  = sess.sessionData as Record<string, unknown> | null
          const score = typeof data?.score === 'number' ? data.score : null
          const total = typeof data?.total === 'number' ? data.total : null
          completed.push(score !== null && total !== null ? `Math ${score}/${total} ✅` : 'Math ✅')
        } else if (subject === 'science') {
          const data = sess.sessionData as Record<string, unknown> | null
          if (data) {
            const parts: string[] = []
            if (data.vote)         parts.push(`Prediction: ${data.vote === 'up' ? 'Yes!' : data.vote === 'down' ? 'No' : 'Not sure'}`)
            if (data.observations) parts.push(`Observed: ${data.observations}`)
            if (data.whatHappened) parts.push(`Explained: ${data.whatHappened}`)
            if (data.whatILearned) parts.push(`Learned: ${data.whatILearned}`)
            scienceNotes = parts.join('<br/>')
          }
          completed.push('Science ✅')
        } else {
          completed.push(`${label} ✅`)
        }
      } else if (sess) {
        inProgress.push(`${label} 🔄`)
      }
    }

    const loggedInThisWeek = student.lastActiveAt
      ? new Date(student.lastActiveAt) >= new Date(weekStartDate) && new Date(student.lastActiveAt) < weekEnd
      : false

    const parentGreeting = student.parentName ? `Hi ${student.parentName},` : 'Hi there,'
    const completedHtml  = completed.length  ? `<p><strong>Completed:</strong> ${completed.join(' &nbsp; ')}</p>` : ''
    const progressHtml   = inProgress.length ? `<p><strong>In Progress:</strong> ${inProgress.join(' &nbsp; ')}</p>` : ''
    const scienceHtml    = scienceNotes      ? `<p><strong>Science Notes:</strong><br/>${scienceNotes}</p>` : ''
    const attendanceHtml = `<p><strong>Logged in this week:</strong> ${loggedInThisWeek ? 'Yes ✅' : 'Not yet'}</p>`

    const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="color:#0d9488">KeenKids Weekly Report</h2>
  <p>${parentGreeting}</p>
  <p>Here's <strong>${studentName}</strong>'s progress for <strong>${weekRow.title}</strong> (week of ${weekStartDate}) at ${schoolName}.</p>
  ${completedHtml}
  ${progressHtml}
  ${scienceHtml}
  ${attendanceHtml}
  <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
  <p style="color:#6b7280;font-size:12px">Sent by KeenKids Enrichment. Questions? Reply to your teacher.</p>
</div>`

    try {
      await resend.emails.send({
        from:    'KeenKids <reports@keenkidsenrichment.com>',
        to:      student.parentEmail,
        subject: `${studentName}'s KeenKids Week — ${weekRow.title}`,
        html,
      })
      results.push({ student: studentName, status: 'sent', parentEmail: student.parentEmail })
    } catch (err) {
      console.error(`[send-report] email failed for ${studentName}:`, err)
      results.push({ student: studentName, status: 'error', parentEmail: student.parentEmail })
    }
  }

  return apiOk({
    weekStartDate,
    weekTitle: weekRow.title,
    results,
    sent:    results.filter(r => r.status === 'sent').length,
    noEmail: results.filter(r => r.status === 'no_email').length,
    errors:  results.filter(r => r.status === 'error').length,
  })
}

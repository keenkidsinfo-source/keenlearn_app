export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'
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

  const GMAIL_USER = process.env.GMAIL_USER ?? ''
  const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD ?? ''
  if (!GMAIL_USER || !GMAIL_PASS) {
    return apiError('GMAIL_USER and GMAIL_APP_PASSWORD env vars are not set.', 'CONFIG_ERROR', 500)
  }

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { weekStartDate, classroomId: adminClassroomId } = parsed.data

  // ── 1. Load classroom + teacher email ───────────────────────────────────────
  const [classroom] = session.role === 'admin' && adminClassroomId
    ? await db.select().from(classrooms).where(eq(classrooms.id, adminClassroomId)).limit(1)
    : await db.select().from(classrooms).where(eq(classrooms.teacherId, session.sub)).limit(1)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const [teacher] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, classroom.teacherId!))
    .limit(1)
  const teacherEmail = teacher?.email ?? GMAIL_USER
  const teacherName  = teacher?.name  ?? 'Your Teacher'

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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  })
  const results: { student: string; status: 'sent' | 'no_email' | 'error'; parentEmail?: string; errorMsg?: string }[] = []

  const weekEnd = new Date(weekStartDate)
  weekEnd.setDate(weekEnd.getDate() + 7)

  // Format date nicely e.g. "August 17, 2026"
  const weekLabel = new Date(weekStartDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  function card(emoji: string, title: string, color: string, body: string) {
    return `
    <div style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid ${color};border-radius:8px;padding:14px 16px;margin-bottom:12px">
      <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#111">${emoji} ${title}</p>
      <div style="font-size:14px;color:#374151;line-height:1.6">${body}</div>
    </div>`
  }

  for (const student of students) {
    const studentName = (student.displayName ?? student.name).trim()

    if (!student.parentEmail) {
      results.push({ student: studentName, status: 'no_email' })
      continue
    }

    const studentSess = sessionsByStudent.get(student.id) ?? new Map()
    const cards: string[] = []

    for (const [itemId, subject] of Array.from(subjectByItem.entries())) {
      if (subject === 'math') continue // not loaded yet

      const sess = studentSess.get(itemId)
      const data = sess?.sessionData as Record<string, unknown> | null
      const done = sess?.completed === true
      const started = !!sess && !done

      if (subject === 'build') {
        // G3-4 students self-submit results; shape: { buildResults: { cranksNoLoad, ... } }
        const studentBuildData = data?.buildResults as Record<string, unknown> | undefined
        // Teacher-submitted results have gradeBand at top level
        const teacherSubmitted = done && data && ('gradeBand' in data)
        const hasAnyResults    = teacherSubmitted || !!studentBuildData

        if (hasAnyResults) {
          const gradeBand  = (data?.gradeBand as string) ?? classroom.gradeBand ?? ''
          const buildTitle = (data?.buildTitle as string) ?? 'Build Project'
          if (gradeBand === 'g1-2') {
            const r1  = data!.round1Clips != null ? `Round 1: ${data!.round1Clips} paperclips` : ''
            const r2  = data!.round2Clips != null ? `After improvements: ${data!.round2Clips} paperclips` : ''
            const max = data!.maxClips    != null ? `<strong>Best: ${data!.maxClips} paperclips! 🎉</strong>` : ''
            const note = data!.note ? `<br/><em>${data!.note}</em>` : ''
            cards.push(card('🔨', `Build — ${buildTitle}`, '#f59e0b',
              [r1, r2, max, note].filter(Boolean).join('<br/>') || 'Completed ✅'))
          } else {
            // G3-4: student-submitted (nested under buildResults) or teacher-submitted (flat)
            const src = studentBuildData ?? data!
            const c1  = src.cranksNoLoad   != null ? `Without cargo: ${src.cranksNoLoad} cranks` : ''
            const c2  = src.cranksWithLoad != null ? `With 3-penny load: ${src.cranksWithLoad} cranks` : ''
            const c3  = src.cranksImproved != null ? `<strong>After improvement: ${src.cranksImproved} cranks 🎉</strong>` : ''
            const note = (src.note as string) ? `<br/><em>${src.note}</em>` : ''
            cards.push(card('🔨', `Build — ${buildTitle}`, '#f59e0b',
              [c1, c2, c3, note].filter(Boolean).join('<br/>') || 'Completed ✅'))
          }
        } else {
          cards.push(card('🔨', 'Build', '#d1d5db', started
            ? 'In progress — results will be added by the teacher after class. 🔄'
            : 'Not recorded yet — the teacher will submit build results after class. ⬜'))
        }
      } else if (subject === 'science') {
        if (done && data) {
          const vote = data.vote === 'up' ? '👍 Yes!' : data.vote === 'down' ? '👎 No' : data.vote === 'maybe' ? '🤔 Not sure' : ''
          const rows = [
            vote              ? `<strong>My prediction:</strong> ${vote}` : '',
            data.observations ? `<strong>I observed:</strong> ${data.observations}` : '',
            data.whatHappened ? `<strong>What happened:</strong> ${data.whatHappened}` : '',
            data.whatILearned ? `<strong>I learned:</strong> ${data.whatILearned}` : '',
          ].filter(Boolean).join('<br/>')
          cards.push(card('🔬', 'Science Lab', '#06b6d4', rows || 'Completed ✅'))
        } else {
          cards.push(card('🔬', 'Science Lab', '#d1d5db', started
            ? `Started — waiting for ${studentName} to submit their observations. 🔄`
            : `Not completed yet — ${studentName} will record their observations during class. ⬜`))
        }
      } else if (subject === 'coding') {
        if (done) {
          cards.push(card('💻', 'Coding', '#8b5cf6', `Finished their coding project this week! Great job debugging and creating. ✅`))
        } else {
          cards.push(card('💻', 'Coding', '#d1d5db', started
            ? `In progress — ${studentName} has started but hasn't finished yet. 🔄`
            : `Not started yet — ${studentName} will work on their coding project in class. ⬜`))
        }
      } else if (subject === 'public_speaking') {
        if (done) {
          cards.push(card('🎤', 'Public Speaking', '#ec4899', `Practiced speaking in front of the class this week — a big deal! ✅`))
        } else {
          cards.push(card('🎤', 'Public Speaking', '#d1d5db', started
            ? `In progress. 🔄`
            : `Not recorded yet — the teacher marks this after speaking class. ⬜`))
        }
      }
    }

    const loggedInThisWeek = student.lastActiveAt
      ? new Date(student.lastActiveAt) >= new Date(weekStartDate) && new Date(student.lastActiveAt) < weekEnd
      : false

    const greeting = student.parentName ? `Hi ${student.parentName},` : 'Hi there,'
    const cardsHtml = cards.length
      ? cards.join('')
      : `<p style="color:#6b7280">No activities recorded yet this week.</p>`

    const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0d9488,#0891b2);border-radius:12px;padding:24px;margin-bottom:20px;text-align:center">
    <p style="margin:0;font-size:13px;color:#99f6e4;text-transform:uppercase;letter-spacing:1px">KeenKids Enrichment</p>
    <h1 style="margin:8px 0 4px;font-size:24px;color:#fff">🌟 ${studentName}'s Week</h1>
    <p style="margin:0;font-size:13px;color:#ccfbf1">${weekRow.title} &nbsp;·&nbsp; ${weekLabel}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#ccfbf1">${schoolName}</p>
  </div>

  <!-- Greeting -->
  <p style="margin:0 0 16px;font-size:15px;color:#111">${greeting}</p>
  <p style="margin:0 0 20px;font-size:15px;color:#374151">Here's what <strong>${studentName}</strong> got up to in enrichment this week!</p>

  <!-- Activity cards -->
  ${cardsHtml}

  <!-- Attendance -->
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:14px;color:#166534">
    ${loggedInThisWeek
      ? `✅ <strong>${studentName} logged in this week</strong> — great to see them engaged!`
      : `📅 We didn't see a login this week. Encourage ${studentName} to explore the app at home!`}
  </div>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
  <p style="font-size:12px;color:#9ca3af;margin:0">
    Sent by <strong>KeenKids Enrichment</strong> · ${schoolName}<br/>
    Questions? Reply to this email — it goes straight to ${teacherName}.
  </p>
</div>`

    try {
      await transporter.sendMail({
        from:    `"KeenKids Enrichment" <${GMAIL_USER}>`,
        replyTo: `"${teacherName}" <${teacherEmail}>`,
        to:      student.parentEmail,
        subject: `${studentName}'s KeenKids Week — ${weekRow.title}`,
        html,
      })
      results.push({ student: studentName, status: 'sent', parentEmail: student.parentEmail })
    } catch (err: any) {
      console.error(`[send-report] email failed for ${studentName}:`, err)
      results.push({ student: studentName, status: 'error', parentEmail: student.parentEmail, errorMsg: err?.message ?? String(err) })
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

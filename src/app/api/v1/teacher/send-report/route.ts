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
import { getTeacherClassroom } from '@/lib/teacher-classroom'
import { getLabByWeek } from '@/lib/scienceLabs'

// ── Schema ────────────────────────────────────────────────────────────────────

const bodySchema = z.object({
  weekStartDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  classroomId:    z.string().uuid().optional(),
  photos:         z.array(z.string()).max(6).optional(),
  selectedEmails: z.array(z.string().email()).optional(),
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
  const classroom = await getTeacherClassroom(session.sub, session.role === 'admin' ? adminClassroomId : undefined)
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

  const { weekStartDate, classroomId: adminClassroomId, photos = [], selectedEmails } = parsed.data

  // ── 1. Load classroom + teacher email ───────────────────────────────────────
  const classroom = await getTeacherClassroom(session.sub, session.role === 'admin' ? adminClassroomId : undefined)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  // Use the requesting teacher's own record for name + email
  const [teacher] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1)
  const teacherEmail = teacher?.email ?? GMAIL_USER
  const teacherName  = teacher?.name  ?? 'Your Teacher'

  const [school] = classroom.schoolId
    ? await db.select({ name: schools.name }).from(schools).where(eq(schools.id, classroom.schoolId)).limit(1)
    : [undefined]
  const schoolName = school?.name ?? 'KeenKids'

  // ── 2. Load curriculum for the week ─────────────────────────────────────────
  const [weekRow] = await db
    .select({ curriculumId: classroomCurriculum.curriculumId, title: curriculum.title, theme: curriculum.theme, weekNumber: curriculum.weekNumber })
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

  // ── 3b. Load content item titles + metadata for "this week at a glance" ────
  const itemDetails = contentItemIds.length > 0
    ? await db
        .select({ id: contentItems.id, title: contentItems.title, subject: contentItems.subject, metadata: contentItems.metadata })
        .from(contentItems)
        .where(inArray(contentItems.id, contentItemIds))
    : []

  // Build subject → content item map
  const contentBySubject = new Map<string, typeof itemDetails[0]>()
  for (const item of itemDetails) {
    const subject = subjectByItem.get(item.id)
    if (subject) contentBySubject.set(subject, item)
  }

  // Extract per-subject highlights for the week summary
  const speakingItem    = contentBySubject.get('public_speaking')
  const speakingMeta    = speakingItem?.metadata as Record<string, unknown> | null ?? null
  const speakingPillar  = (speakingMeta?.pillar as string) ?? ''
  const speakingWord    = (speakingMeta?.weekWord as string) ?? ''
  const speakingWordDef = (speakingMeta?.weekWordDef as string) ?? ''

  const codingItem    = contentBySubject.get('coding')
  const codingTitle   = codingItem?.title ?? ''
  const codingMeta    = codingItem?.metadata as Record<string, unknown> | null ?? null
  const codingTagline = (codingMeta?.tagline as string) ?? ''

  const buildItem    = contentBySubject.get('build')
  const buildTitle   = buildItem?.title ?? ''
  const buildMeta    = buildItem?.metadata as Record<string, unknown> | null ?? null
  const buildTagline = (buildMeta?.tagline as string) ?? ''
  // Dynamic result fields — vary per week/project (e.g. Paper Fan uses 'spins'/'speedRating')
  const buildResultFields = (buildMeta?.resultFields ?? null) as {
    a?: { label: string; key: string }
    b?: { label: string; key: string }
    c?: { label: string; key: string }
    unit?: string
  } | null

  const scienceLab    = weekRow.weekNumber != null ? getLabByWeek(weekRow.weekNumber) : null
  const scienceTitle  = scienceLab?.title ?? ''
  const scienceConcept = scienceLab?.conceptShort ?? ''

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
  // pool:true reuses SMTP connections; maxConnections keeps Gmail from throttling
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 3,
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  })
  const results: { student: string; status: 'sent' | 'no_email' | 'error'; parentEmail?: string; errorMsg?: string }[] = []

  const weekEnd = new Date(weekStartDate)
  weekEnd.setDate(weekEnd.getDate() + 7)

  // Format date nicely e.g. "August 17, 2026"
  const weekLabel = new Date(weekStartDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  // Unified card: subject title + description + student result in one block
  function subjectCard(emoji: string, label: string, title: string, desc: string, color: string, result: string) {
    return `<div style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid ${color};border-radius:8px;padding:14px 16px;margin-bottom:12px">
      <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#111">${emoji} ${label}: ${title}</p>
      ${desc ? `<p style="margin:0 0 10px;font-size:13px;color:#6b7280">${desc}</p>` : '<p style="margin:0 0 10px"></p>'}
      <div style="font-size:14px;color:#374151;line-height:1.6;border-top:1px solid #f3f4f6;padding-top:8px">${result}</div>
    </div>`
  }

  // Send all emails in parallel for speed
  await Promise.all(students.map(async (student) => {
    const studentName = (student.displayName ?? student.name).trim()

    if (!student.parentEmail) {
      results.push({ student: studentName, status: 'no_email' })
      return
    }

    // Skip if teacher deselected this student
    if (selectedEmails && !selectedEmails.includes(student.parentEmail)) {
      results.push({ student: studentName, status: 'no_email' })
      return
    }

    const studentSess = sessionsByStudent.get(student.id) ?? new Map()
    const cards: string[] = []

    // Fixed display order: Build → Coding → Speaking → Science
    const SUBJECT_ORDER = ['build', 'coding', 'public_speaking', 'science']
    const sortedItems = Array.from(subjectByItem.entries())
      .filter(([, s]) => s !== 'math')
      .sort(([, a], [, b]) => {
        const ai = SUBJECT_ORDER.indexOf(a)
        const bi = SUBJECT_ORDER.indexOf(b)
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
      })

    for (const [itemId, subject] of sortedItems) {

      const sess = studentSess.get(itemId)
      const data = sess?.sessionData as Record<string, unknown> | null
      const done = sess?.completed === true
      const started = !!sess && !done

      if (subject === 'build') {
        const teacherSubmitted = done && data && ('gradeBand' in data)
        const hasAnyResults    = teacherSubmitted
        const bDesc = buildTagline

        if (hasAnyResults) {
          const bTitleLabel = (data!.buildTitle as string) ?? buildTitle ?? 'Build Project'
          const note = data!.note ? `<em>${data!.note}</em>` : ''

          // Use dynamic resultFields from the content item metadata
          const rows: string[] = []
          if (buildResultFields?.a?.key) {
            const val = data![buildResultFields.a.key]
            if (val != null) rows.push(`${buildResultFields.a.label}: <strong>${val}</strong>`)
          }
          if (buildResultFields?.b?.key) {
            const val = data![buildResultFields.b.key]
            if (val != null) rows.push(`${buildResultFields.b.label}: <strong>${val}</strong>`)
          }
          if (buildResultFields?.c?.key) {
            const val = data![buildResultFields.c.key]
            if (val != null) rows.push(`${buildResultFields.c.label}: <strong>${val} 🎉</strong>`)
          }
          if (note) rows.push(note)

          cards.push(subjectCard('🔨', 'Build', bTitleLabel, bDesc, '#f59e0b',
            rows.join('<br/>') || 'Completed ✅'))
        } else {
          cards.push(subjectCard('🔨', 'Build', buildTitle || 'Build', bDesc, '#f59e0b', started
            ? 'In progress — results will be added by the teacher after class. 🔄'
            : 'Not recorded yet — the teacher will submit build results after class. ⬜'))
        }
      } else if (subject === 'science') {
        const hasAnyData = data && (data.vote || data.observations || data.whatHappened || data.whatILearned)
        if (hasAnyData) {
          const voteMap: Record<string, string> = { up: '👍 Yes!', side: '🤔 Not sure', down: '👎 No' }
          const voteLabel = data!.vote ? (voteMap[data!.vote as string] ?? '') : ''
          const rows = [
            voteLabel          ? `<strong>My prediction:</strong> ${voteLabel}` : '',
            data!.observations ? `<strong>I observed:</strong> ${data!.observations}` : '',
            data!.whatHappened ? `<strong>What I think caused it:</strong> ${data!.whatHappened}` : '',
            data!.whatILearned ? `<strong>I learned:</strong> ${data!.whatILearned}` : '',
          ].filter(Boolean).join('<br/>')
          cards.push(subjectCard('🔬', 'Science', scienceTitle || 'Science Lab', scienceConcept, '#06b6d4', rows || 'Completed ✅'))
        } else {
          cards.push(subjectCard('🔬', 'Science', scienceTitle || 'Science Lab', scienceConcept, '#d1d5db', started
            ? `Started — waiting for ${studentName} to submit their observations. 🔄`
            : `Not completed yet — ${studentName} will record their observations during class. ⬜`))
        }
      } else if (subject === 'coding') {
        if (done) {
          cards.push(subjectCard('💻', 'Coding', codingTitle || 'Coding', codingTagline, '#8b5cf6',
            `Finished their coding project this week! Great job debugging and creating. ✅`))
        } else {
          cards.push(subjectCard('💻', 'Coding', codingTitle || 'Coding', codingTagline, '#d1d5db', started
            ? `In progress — ${studentName} has started but hasn't finished yet. 🔄`
            : `Not started yet — ${studentName} will work on their coding project in class. ⬜`))
        }
      } else if (subject === 'public_speaking') {
        const spLabel = [speakingPillar, speakingWord ? `"${speakingWord}"` : ''].filter(Boolean).join(' · ') || 'Public Speaking'
        const spDesc  = speakingWordDef ? `Week word: ${speakingWordDef}` : ''
        if (done) {
          cards.push(subjectCard('🎤', 'Speaking', spLabel, spDesc, '#ec4899',
            `Practiced speaking in front of the class this week — a big deal! ✅`))
        } else {
          cards.push(subjectCard('🎤', 'Speaking', spLabel, spDesc, '#d1d5db', started
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
    <p style="margin:0;font-size:13px;color:#ccfbf1">Week ${weekRow.weekNumber} &nbsp;·&nbsp; ${weekLabel}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#ccfbf1">${schoolName}</p>
  </div>

  <!-- Greeting -->
  <p style="margin:0 0 16px;font-size:15px;color:#111">${greeting}</p>
  <p style="margin:0 0 16px;font-size:15px;color:#374151">Here's what <strong>${studentName}</strong> got up to in enrichment this week!</p>

  ${cardsHtml}

  <!-- Attendance -->
  ${loggedInThisWeek ? `
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:14px;color:#166534">
    ✅ <strong>${studentName} attended class this week</strong>
  </div>` : ''}

  <!-- Class photos -->
  ${photos.length > 0 ? `
  <div style="margin-bottom:20px">
    <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#111">📸 This Week in Class</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${photos.map((_: string, i: number) => `<img src="cid:photo${i}@keenkids" alt="Class photo ${i + 1}" style="width:${photos.length === 1 ? '100%' : photos.length <= 2 ? 'calc(50% - 4px)' : 'calc(33% - 6px)'};border-radius:8px;object-fit:cover;display:block"/>`).join('')}
    </div>
  </div>` : ''}

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
  <p style="font-size:12px;color:#9ca3af;margin:0">
    Sent by <strong>KeenKids Enrichment</strong> · ${schoolName}<br/>
    Questions? Reply to this email — it goes straight to ${teacherName}.
  </p>
</div>`

    try {
      const attachments = photos.map((dataUrl: string, i: number) => {
        const [header, data] = dataUrl.split(',')
        const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg'
        return {
          filename:    `photo-${i + 1}.jpg`,
          content:     Buffer.from(data, 'base64'),
          contentType: mimeType,
          cid:         `photo${i}@keenkids`,
        }
      })

      // Collapse whitespace to keep email under Gmail's ~102KB clip threshold
      const minHtml = html.replace(/<!--[\s\S]*?-->/g, '').replace(/\s{2,}/g, ' ').replace(/> </g, '><')

      await transporter.sendMail({
        from:    `"KeenKids Enrichment" <${GMAIL_USER}>`,
        replyTo: `"${teacherName}" <${teacherEmail}>`,
        to:      student.parentEmail,
        bcc:     [teacherEmail, GMAIL_USER].filter((e, i, a) => e && a.indexOf(e) === i).join(','),
        subject: `${studentName}'s KeenKids Week ${weekRow.weekNumber} — ${weekLabel}`,
        html: minHtml,
        attachments,
      })
      results.push({ student: studentName, status: 'sent', parentEmail: student.parentEmail })
    } catch (err: any) {
      console.error(`[send-report] email failed for ${studentName}:`, err)
      results.push({ student: studentName, status: 'error', parentEmail: student.parentEmail, errorMsg: err?.message ?? String(err) })
    }
  }))

  transporter.close()

  return apiOk({
    weekStartDate,
    weekTitle: weekRow.title,
    results,
    sent:    results.filter(r => r.status === 'sent').length,
    noEmail: results.filter(r => r.status === 'no_email').length,
    errors:  results.filter(r => r.status === 'error').length,
  })
}

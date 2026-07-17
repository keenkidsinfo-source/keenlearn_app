import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  users, classrooms, classroomCurriculum, curriculum,
  curriculumDays, curriculumContent, contentItems, studentSessions, schools,
} from '@/lib/db/schema'
import { eq, and, inArray, isNull } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// ── Supabase REST helpers ─────────────────────────────────────────────────────
// Uses the service key so we can write to any row regardless of RLS.
// Add SUPABASE_URL and SUPABASE_SERVICE_KEY to your Vercel project env vars.

const SUPABASE_URL          = process.env.SUPABASE_URL ?? ''
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY ?? ''

function supabaseHeaders() {
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'apikey':        SUPABASE_SERVICE_KEY,
    'Prefer':        'resolution=merge-duplicates,return=minimal',
  }
}

async function supabaseFetch(path: string, opts: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: { ...supabaseHeaders(), ...(opts.headers ?? {}) },
  })
}

// ── Name matching ─────────────────────────────────────────────────────────────
// Exact full-name match only (case-insensitive) to avoid sending to wrong family.
// Also filters by school name when available.

function matchChild(
  student: { name: string; displayName: string | null },
  children: { id: string; full_name: string; school_name: string }[],
  schoolName: string,
) {
  const last  = student.name.trim().toLowerCase()
  const first = (student.displayName ?? '').trim().toLowerCase()
  const full  = first ? `${first} ${last}` : last

  // Filter to same school first (loose match — portal school_name may differ slightly)
  const schoolSlug = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const sameSchool = children.filter(c => {
    const cs = c.school_name.toLowerCase().replace(/[^a-z0-9]/g, '')
    return cs.includes(schoolSlug) || schoolSlug.includes(cs.split(' ')[0])
  })
  const pool = sameSchool.length > 0 ? sameSchool : children

  // Exact full-name match only
  return pool.find(c => c.full_name.trim().toLowerCase() === full) ?? null
}

// ── Schema ────────────────────────────────────────────────────────────────────

const bodySchema = z.object({
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

// ── GET /api/v1/teacher/send-report?weekStartDate=YYYY-MM-DD ─────────────────
// Preview only — returns match status per student without writing anything.

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  if (session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return apiError('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are not set.', 'CONFIG_ERROR', 500)
  }

  const weekStartDate = req.nextUrl.searchParams.get('weekStartDate')
  if (!weekStartDate || !/^\d{4}-\d{2}-\d{2}$/.test(weekStartDate)) {
    return apiError('weekStartDate required (YYYY-MM-DD)', 'VALIDATION_ERROR', 400)
  }

  const [classroom] = await db.select().from(classrooms)
    .where(eq(classrooms.teacherId, session.sub)).limit(1)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const [school] = classroom.schoolId
    ? await db.select({ name: schools.name }).from(schools).where(eq(schools.id, classroom.schoolId)).limit(1)
    : [undefined]
  const schoolName = school?.name ?? ''

  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName })
    .from(users)
    .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))

  const childrenRes = await supabaseFetch('/children?select=id,full_name,school_name')
  if (!childrenRes.ok) return apiError('Failed to fetch portal children', 'SUPABASE_ERROR', 502)
  const portalChildren: { id: string; full_name: string; school_name: string }[] = await childrenRes.json()

  const preview = students.map(s => {
    const match = matchChild(s, portalChildren, schoolName)
    const displayName = (s.displayName ?? s.name).trim()
    return {
      studentName: displayName,
      matched:     !!match,
      portalName:  match?.full_name ?? null,
    }
  })

  return apiOk({ weekStartDate, preview })
}

// ── POST /api/v1/teacher/send-report ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  if (session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return apiError(
      'SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are not set.',
      'CONFIG_ERROR', 500
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { weekStartDate } = parsed.data

  // ── 1. Load teacher's classroom ──────────────────────────────────────────────
  const [classroom] = await db.select()
    .from(classrooms)
    .where(eq(classrooms.teacherId, session.sub))
    .limit(1)

  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const [school] = classroom.schoolId
    ? await db.select({ name: schools.name }).from(schools).where(eq(schools.id, classroom.schoolId)).limit(1)
    : [undefined]
  const schoolName = school?.name ?? ''

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

  // ── 3. Load all content items for the week, keyed by subject ────────────────
  const dayItems = await db
    .select({
      subject:       curriculumDays.subject,
      contentItemId: curriculumContent.contentItemId,
    })
    .from(curriculumDays)
    .innerJoin(curriculumContent, eq(curriculumContent.curriculumDayId, curriculumDays.id))
    .where(eq(curriculumDays.curriculumId, weekRow.curriculumId))

  const contentItemIds = dayItems.map(d => d.contentItemId)
  const subjectByItem  = new Map(dayItems.map(d => [d.contentItemId, d.subject]))

  // ── 4. Load all students ─────────────────────────────────────────────────────
  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName, lastActiveAt: users.lastActiveAt })
    .from(users)
    .where(and(
      eq(users.classroomId, classroom.id),
      eq(users.role, 'student'),
      isNull(users.deletedAt),
    ))

  if (students.length === 0) return apiError('No students in classroom', 'NOT_FOUND', 404)

  // ── 5. Load all student sessions for this week's content ────────────────────
  const sessions = contentItemIds.length > 0
    ? await db
        .select({
          studentId:     studentSessions.studentId,
          contentItemId: studentSessions.contentItemId,
          completed:     studentSessions.completed,
          progressPct:   studentSessions.progressPct,
          sessionData:   studentSessions.sessionData,
        })
        .from(studentSessions)
        .where(and(
          inArray(studentSessions.studentId, students.map(s => s.id)),
          inArray(studentSessions.contentItemId, contentItemIds),
        ))
    : []

  // Group sessions by studentId → contentItemId
  const sessionsByStudent = new Map<string, Map<string, typeof sessions[0]>>()
  for (const s of sessions) {
    if (!sessionsByStudent.has(s.studentId)) sessionsByStudent.set(s.studentId, new Map())
    sessionsByStudent.get(s.studentId)!.set(s.contentItemId, s)
  }

  // ── 6. Fetch all children from Supabase portal ──────────────────────────────
  const childrenRes = await supabaseFetch('/children?select=id,full_name,school_name,parent_id')
  if (!childrenRes.ok) {
    return apiError('Failed to fetch children from portal', 'SUPABASE_ERROR', 502)
  }
  const portalChildren: { id: string; full_name: string; school_name: string; parent_id: string }[] = await childrenRes.json()

  // ── 7. Compile a report row per student ─────────────────────────────────────
  const results: { student: string; status: 'sent' | 'no_match' | 'error'; portalName?: string }[] = []

  for (const student of students) {
    const studentName   = (student.displayName ?? student.name).trim()
    const studentLast   = student.name.trim().toLowerCase()
    const studentFirst  = (student.displayName ?? '').trim().toLowerCase()
    const studentSess   = sessionsByStudent.get(student.id) ?? new Map()

    // Exact full-name match only — no fuzzy matching to avoid wrong-family sends
    const match = matchChild(student, portalChildren, schoolName)

    if (!match) {
      results.push({ student: studentName, status: 'no_match' })
      continue
    }

    // ── Build win / fail / notes ─────────────────────────────────────────────
    const completed: string[] = []
    const inProgress: string[] = []
    let scienceNotes = ''
    let mathScore    = ''

    const SUBJECT_LABEL: Record<string, string> = {
      science:        'Science',
      coding:         'Coding',
      math:           'Math',
      public_speaking: 'Speaking',
      build:          'Build',
      arts:           'Arts',
    }

    for (const [itemId, subject] of Array.from(subjectByItem.entries())) {
      const sess = studentSess.get(itemId)
      const label = SUBJECT_LABEL[subject] ?? subject

      if (sess?.completed) {
        // Pull extra data per subject
        if (subject === 'math') {
          const data = sess.sessionData as Record<string, unknown> | null
          const score   = typeof data?.score === 'number' ? data.score : null
          const total   = typeof data?.total === 'number' ? data.total : null
          mathScore = score !== null && total !== null ? `${score}/${total}` : ''
          completed.push(mathScore ? `Math ${mathScore} ✅` : 'Math ✅')
        } else if (subject === 'science') {
          const data = sess.sessionData as Record<string, unknown> | null
          if (data) {
            const parts: string[] = []
            if (data.vote)         parts.push(`Prediction: ${data.vote === 'up' ? 'Yes!' : data.vote === 'down' ? 'No' : 'Not sure'}`)
            if (data.observations) parts.push(`Observed: ${data.observations}`)
            if (data.whatHappened) parts.push(`Explained: ${data.whatHappened}`)
            if (data.whatILearned) parts.push(`Learned: ${data.whatILearned}`)
            scienceNotes = parts.join('\n')
          }
          completed.push('Science ✅')
        } else {
          completed.push(`${label} ✅`)
        }
      } else if (sess) {
        inProgress.push(`${label} 🔄`)
      }
      // no session = not started, omit from both lists
    }

    // Did the student log in this week?
    const weekEnd = new Date(weekStartDate)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const loggedInThisWeek = student.lastActiveAt
      ? new Date(student.lastActiveAt) >= new Date(weekStartDate) && new Date(student.lastActiveAt) < weekEnd
      : false

    const win  = completed.join('  ') || null
    const fail = inProgress.join('  ') || null
    const notes = scienceNotes || null

    // ── Upsert into Supabase progress ────────────────────────────────────────
    // Uses ON CONFLICT on (child_id, week_key) — you may need to add this unique constraint
    // to Supabase if not already present: ALTER TABLE progress ADD UNIQUE (child_id, week_key);
    const progressRow = {
      child_id:   match.id,
      week_theme: weekRow.title,
      week_key:   weekStartDate,
      week_date:  weekStartDate,
      win,
      fail,
      notes,
      attendance: loggedInThisWeek,
    }

    const upsertRes = await supabaseFetch('/progress', {
      method:  'POST',
      body:    JSON.stringify(progressRow),
      headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    })

    if (!upsertRes.ok) {
      const errText = await upsertRes.text().catch(() => '')
      results.push({ student: studentName, status: 'error', portalName: match.full_name })
      console.error(`[send-report] Supabase upsert failed for ${studentName}:`, errText)
    } else {
      results.push({ student: studentName, status: 'sent', portalName: match.full_name })
    }
  }

  return apiOk({
    weekStartDate,
    weekTitle: weekRow.title,
    results,
    sent:     results.filter(r => r.status === 'sent').length,
    noMatch:  results.filter(r => r.status === 'no_match').length,
    errors:   results.filter(r => r.status === 'error').length,
  })
}

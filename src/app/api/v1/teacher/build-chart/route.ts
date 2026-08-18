export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  users, classrooms, schools,
  classroomCurriculum, curriculum, curriculumDays, curriculumContent, studentSessions,
} from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'
import { getTeacherClassroom } from '@/lib/teacher-classroom'

const SUPABASE_URL         = process.env.SUPABASE_URL ?? ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? ''

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

function matchChild(
  student: { name: string; displayName: string | null },
  children: { id: string; full_name: string; school_name: string }[],
  schoolName: string,
) {
  const last  = student.name.trim().toLowerCase()
  const first = (student.displayName ?? '').trim().toLowerCase()
  const full  = first ? `${first} ${last}` : last
  const schoolSlug = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const sameSchool = children.filter(c => {
    const cs = c.school_name.toLowerCase().replace(/[^a-z0-9]/g, '')
    return cs.includes(schoolSlug) || schoolSlug.includes(cs.split(' ')[0])
  })
  const pool = sameSchool.length > 0 ? sameSchool : children
  return pool.find(c => c.full_name.trim().toLowerCase() === full) ?? null
}

const StudentResultSchema = z.object({
  studentId:   z.string(),
  studentName: z.string(),
  /** For G1-2 Cable Car */
  round1Clips: z.number().int().nonnegative().optional(),
  round2Clips: z.number().int().nonnegative().optional(),
  maxClips:    z.number().int().nonnegative().optional(),
  /** For G3-4 Well Pulley */
  cranksNoLoad:    z.number().int().nonnegative().optional(),
  cranksWithLoad:  z.number().int().nonnegative().optional(),
  cranksImproved:  z.number().int().nonnegative().optional(),
  note: z.string().optional(),
})

const bodySchema = z.object({
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  buildTitle:    z.string(),
  gradeBand:     z.enum(['g1-2', 'g3-4']),
  classroomId:   z.string().optional(),
  results:       z.array(StudentResultSchema),
})

export type StudentResult = z.infer<typeof StudentResultSchema>

/**
 * POST /api/v1/teacher/build-chart
 * Accepts student build results and upserts them into the Supabase portal progress table.
 */
export async function POST(req: NextRequest) {
  try {
  const session = await getSession()
  if (!session) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  if (session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return apiError('Invalid request: ' + parsed.error.issues.map(i => i.message).join(', '), 'VALIDATION_ERROR', 400)
  }

  const { weekStartDate, buildTitle, gradeBand, classroomId: bodyClassroomId, results } = parsed.data

  // Load classroom — admins can pass classroomId, teachers can too (to handle multi-classroom case)
  const classroom = await getTeacherClassroom(session.sub, bodyClassroomId ?? undefined)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const [school] = classroom.schoolId
    ? await db.select({ name: schools.name }).from(schools).where(eq(schools.id, classroom.schoolId)).limit(1)
    : [undefined]
  const schoolName = school?.name ?? ''

  // Load students
  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName })
    .from(users)
    .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))

  // ── Save chart results to our own DB (studentSessions) ──────────────────────
  // Find the build content item for this week
  const [weekRow] = await db
    .select({ curriculumId: classroomCurriculum.curriculumId })
    .from(classroomCurriculum)
    .where(and(
      eq(classroomCurriculum.classroomId, classroom.id),
      eq(classroomCurriculum.weekStartDate, weekStartDate),
    ))
    .limit(1)

  if (weekRow) {
    const buildDays = await db
      .select({ contentItemId: curriculumContent.contentItemId })
      .from(curriculumDays)
      .innerJoin(curriculumContent, eq(curriculumContent.curriculumDayId, curriculumDays.id))
      .where(and(
        eq(curriculumDays.curriculumId, weekRow.curriculumId),
        eq(curriculumDays.subject, 'build'),
      ))
      .limit(1)

    const buildItemId = buildDays[0]?.contentItemId
    if (buildItemId) {
      for (const result of results) {
        const student = students.find(s => s.id === result.studentId)
        if (!student) continue
        await db
          .insert(studentSessions)
          .values({
            studentId:     student.id,
            contentItemId: buildItemId,
            completed:     true,
            progressPct:   100,
            sessionData:   { ...result, gradeBand, buildTitle },
          })
          .onConflictDoUpdate({
            target: [studentSessions.studentId, studentSessions.contentItemId],
            set: {
              completed:   true,
              progressPct: 100,
              sessionData: { ...result, gradeBand, buildTitle },
            },
          })
      }
    }
  }

  // If parent portal env vars aren't configured, stop here — DB save already succeeded
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return apiOk({
      weekStartDate,
      buildTitle,
      results: results.map(r => ({ student: r.studentName, status: 'no_match' as const })),
      sent: 0,
      noMatch: results.length,
      errors: 0,
      note: 'Results saved to KeenKids DB. Parent portal sync not configured.',
    })
  }

  // ── Parent portal sync (best-effort — DB save already done above) ────────────
  try {
    const childrenRes = await supabaseFetch('/children?select=id,full_name,school_name')
    if (!childrenRes.ok) {
      console.error('[build-chart] Supabase children fetch failed:', await childrenRes.text().catch(() => ''))
      return apiOk({
        weekStartDate, buildTitle,
        results: results.map(r => ({ student: r.studentName, status: 'no_match' as const })),
        sent: 0, noMatch: results.length, errors: 0,
        note: 'Results saved to KeenKids DB. Parent portal sync unavailable.',
      })
    }
    const portalChildren: { id: string; full_name: string; school_name: string }[] = await childrenRes.json()

    const sentResults: { student: string; status: 'sent' | 'no_match' | 'error'; portalName?: string }[] = []

    for (const result of results) {
      const student = students.find(s => s.id === result.studentId)
      if (!student) {
        sentResults.push({ student: result.studentName, status: 'no_match' })
        continue
      }

      const match = matchChild(student, portalChildren, schoolName)
      if (!match) {
        sentResults.push({ student: result.studentName, status: 'no_match' })
        continue
      }

      let win: string | null = null
      let notes: string | null = null

      if (gradeBand === 'g1-2') {
        const parts: string[] = []
        if (result.maxClips != null) parts.push(`Cable Car max cargo: **${result.maxClips} paperclips** ✅`)
        if (result.round1Clips != null) parts.push(`Round 1: ${result.round1Clips} clips`)
        if (result.round2Clips != null) parts.push(`After improvement: ${result.round2Clips} clips`)
        win = parts[0] ?? null
        notes = parts.slice(1).join('\n') || null
      } else {
        const parts: string[] = []
        if (result.cranksNoLoad != null) parts.push(`Well Pulley — cranks (no cargo): ${result.cranksNoLoad}`)
        if (result.cranksWithLoad != null) parts.push(`Cranks (3-penny load): ${result.cranksWithLoad}`)
        if (result.cranksImproved != null) parts.push(`After improvement: ${result.cranksImproved} cranks ✅`)
        win = result.cranksImproved != null ? `Well Pulley improved to ${result.cranksImproved} cranks ✅` : (parts[0] ?? null)
        notes = parts.join('\n') || null
      }

      if (result.note) notes = notes ? `${notes}\nNote: ${result.note}` : `Note: ${result.note}`

      const progressRow = {
        child_id:   match.id,
        week_theme: buildTitle,
        week_key:   weekStartDate,
        week_date:  weekStartDate,
        win,
        fail:       null,
        notes,
        attendance: true,
      }

      const upsertRes = await supabaseFetch('/progress', {
        method:  'POST',
        body:    JSON.stringify(progressRow),
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      })

      if (!upsertRes.ok) {
        const errText = await upsertRes.text().catch(() => '')
        console.error(`[build-chart] Supabase upsert failed for ${result.studentName}:`, errText)
        sentResults.push({ student: result.studentName, status: 'error', portalName: match.full_name })
      } else {
        sentResults.push({ student: result.studentName, status: 'sent', portalName: match.full_name })
      }
    }

    return apiOk({
      weekStartDate,
      buildTitle,
      results: sentResults,
      sent:    sentResults.filter(r => r.status === 'sent').length,
      noMatch: sentResults.filter(r => r.status === 'no_match').length,
      errors:  sentResults.filter(r => r.status === 'error').length,
    })
  } catch (supaErr: unknown) {
    const msg = supaErr instanceof Error ? supaErr.message : String(supaErr)
    console.error('[build-chart] Supabase sync error (results saved to DB):', supaErr)
    return apiOk({
      weekStartDate, buildTitle,
      results: results.map(r => ({ student: r.studentName, status: 'no_match' as const })),
      sent: 0, noMatch: results.length, errors: 0,
      note: `Results saved to KeenKids DB. Parent portal sync error: ${msg}`,
    })
  }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[build-chart] Unhandled error:', err)
    return apiError(`Build chart error: ${msg}`, 'INTERNAL_ERROR', 500)
  }
}

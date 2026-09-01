export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  users, classrooms, curriculumDays, curriculumContent, contentItems,
  classroomCurriculum, studentSessions,
} from '@/lib/db/schema'
import { eq, and, isNull, inArray } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/build/[dayId]/results
// Returns all classmates' submitted build results for this build day.
// Accessible to any authenticated user (student or teacher) in the classroom.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string }> }
) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

  const { dayId } = await params

  // Load the curriculum day
  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') return apiError('Not found', 'NOT_FOUND', 404)

  // Load the content item
  const [row] = await db
    .select({ item: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .limit(1)

  if (!row) return apiError('Not found', 'NOT_FOUND', 404)

  const item = row.item
  const isG12 = (item.gradeBand ?? 'g1-2') === 'g1-2'

  // Find the requesting user's classroom
  const [requestingUser] = await db
    .select({ classroomId: users.classroomId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!requestingUser?.classroomId) return apiOk([])

  // Load all students in this classroom
  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName })
    .from(users)
    .where(and(
      eq(users.classroomId, requestingUser.classroomId),
      eq(users.role, 'student'),
      isNull(users.deletedAt),
    ))

  if (students.length === 0) return apiOk([])

  // Load their sessions
  const sessions = await db
    .select({ studentId: studentSessions.studentId, sessionData: studentSessions.sessionData })
    .from(studentSessions)
    .where(and(
      inArray(studentSessions.studentId, students.map(s => s.id)),
      eq(studentSessions.contentItemId, item.id),
    ))

  const sessionMap = new Map(sessions.map(s => [s.studentId, s.sessionData as Record<string, any>]))

  const results = students
    .map(s => {
      const sd = sessionMap.get(s.id) ?? {}
      const br = (sd.buildResults ?? {}) as Record<string, any>
      const name = s.displayName ?? s.name

      if (isG12) {
        // G1-2 Cable Car: teacher enters minRocks (a) and maxRocks (b) — no column c
        const a = br.minRocks ?? br.round1Clips ?? null      // minRocks is current key; round1Clips is legacy
        const b = br.maxRocks ?? br.afterFixClips ?? null
        return {
          studentId: s.id,
          name,
          a,
          b,
          c: null,
          note: br.note ?? '',
        }
      } else {
        return {
          studentId: s.id,
          name,
          a: br.cranksNoLoad ?? null,
          b: br.cranksWithLoad ?? null,
          c: br.cranksImproved ?? null,
          note: br.note ?? '',
        }
      }
    })
    // G1-2 has no column c — filter on b (key metric); G3-4 filters on c
    .filter(r => r.c != null || r.b != null)

  return apiOk(results)
}

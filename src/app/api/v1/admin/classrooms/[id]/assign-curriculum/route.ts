export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { classroomCurriculum, curriculum, classrooms } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// POST /api/v1/admin/classrooms/:id/assign-curriculum
// Body: { curriculumId: string; weekStartDate: string }  (YYYY-MM-DD)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id: classroomId } = await params
  const body = await req.json().catch(() => null)
  const { curriculumId, weekStartDate } = body ?? {}

  if (!curriculumId || !weekStartDate) {
    return apiError('curriculumId and weekStartDate are required', 'VALIDATION_ERROR', 400)
  }

  // Validate classroom
  const [cls] = await db.select({ id: classrooms.id })
    .from(classrooms).where(eq(classrooms.id, classroomId)).limit(1)
  if (!cls) return apiError('Classroom not found', 'NOT_FOUND', 404)

  // Validate curriculum
  const [cur] = await db.select({ id: curriculum.id })
    .from(curriculum).where(eq(curriculum.id, curriculumId)).limit(1)
  if (!cur) return apiError('Curriculum not found', 'NOT_FOUND', 404)

  // Upsert: if a row for this classroom+weekStartDate already exists, update it
  const [existing] = await db.select({ id: classroomCurriculum.id })
    .from(classroomCurriculum)
    .where(and(
      eq(classroomCurriculum.classroomId, classroomId),
      eq(classroomCurriculum.weekStartDate, weekStartDate),
    )).limit(1)

  if (existing) {
    await db.update(classroomCurriculum)
      .set({ curriculumId, assignedBy: session.sub, assignedAt: new Date() })
      .where(eq(classroomCurriculum.id, existing.id))
  } else {
    await db.insert(classroomCurriculum).values({
      classroomId,
      curriculumId,
      weekStartDate,
      assignedBy: session.sub,
    })
  }

  return apiOk({ assigned: true })
}

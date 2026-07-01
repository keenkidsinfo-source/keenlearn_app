import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { classroomCurriculum, curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

const schema = z.object({
  classroomId:   z.string().uuid(),
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
})

// POST /api/v1/curriculum/:id/assign
// Teacher assigns a pre-built curriculum week to their classroom
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const role     = req.headers.get('x-role')
  const userId   = req.headers.get('x-user-id')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Only teachers can assign curriculum', 'FORBIDDEN', 403)
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { classroomId, weekStartDate } = parsed.data

  // Verify curriculum exists and is active
  const [week] = await db
    .select()
    .from(curriculum)
    .where(eq(curriculum.id, id))
    .limit(1)

  if (!week || !week.isActive) return apiError('Curriculum not found', 'NOT_FOUND', 404)

  // Upsert — teacher can re-assign a week
  await db
    .insert(classroomCurriculum)
    .values({
      classroomId,
      curriculumId:  id,
      assignedBy:    userId!,
      weekStartDate,
    })
    .onConflictDoUpdate({
      target: [classroomCurriculum.classroomId, classroomCurriculum.weekStartDate],
      set:    { curriculumId: id, assignedBy: userId!, assignedAt: new Date() },
    })

  return apiOk({ assigned: true, curriculumId: id, weekStartDate })
}

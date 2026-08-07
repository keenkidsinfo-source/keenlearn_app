export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms, classroomTeachers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// POST /api/v1/admin/teachers/:id/assign-classroom
// Body: { classroomId: string }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id } = await params
  const body = await req.json().catch(() => null)
  const classroomId: string | null = body?.classroomId ?? null

  // Validate teacher exists
  const [teacher] = await db.select({ id: users.id, role: users.role })
    .from(users).where(eq(users.id, id)).limit(1)
  if (!teacher || teacher.role !== 'teacher') {
    return apiError('Teacher not found', 'NOT_FOUND', 404)
  }

  // Validate classroom if provided
  if (classroomId) {
    const [cls] = await db.select({ id: classrooms.id })
      .from(classrooms).where(eq(classrooms.id, classroomId)).limit(1)
    if (!cls) return apiError('Classroom not found', 'NOT_FOUND', 404)
  }

  // Remove this teacher as primary from any existing classrooms
  await db.update(classrooms).set({ teacherId: null }).where(eq(classrooms.teacherId, id))
  // Remove from junction table (primary rows only; non-primary co-teacher rows are kept)
  await db.delete(classroomTeachers).where(
    eq(classroomTeachers.teacherId, id)
  )

  if (classroomId) {
    // Set primary teacherId on classroom (backward compat)
    await db.update(classrooms).set({ teacherId: id }).where(eq(classrooms.id, classroomId))
    // Upsert into junction table as primary
    await db.insert(classroomTeachers)
      .values({ classroomId, teacherId: id, isPrimary: true })
      .onConflictDoUpdate({
        target: [classroomTeachers.classroomId, classroomTeachers.teacherId],
        set: { isPrimary: true },
      })
  }

  await db.update(users).set({ classroomId: classroomId }).where(eq(users.id, id))

  return apiOk({ assigned: true })
}

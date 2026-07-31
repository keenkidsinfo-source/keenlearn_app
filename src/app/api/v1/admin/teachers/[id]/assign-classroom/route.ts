export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
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

  // A teacher may only own one classroom at a time. Clear any classroom(s)
  // currently pointing at this teacher before (re)assigning, so stale rows
  // never linger and a dashboard lookup by teacherId is always unambiguous.
  await db.update(classrooms)
    .set({ teacherId: null })
    .where(eq(classrooms.teacherId, id))

  if (classroomId) {
    // Set the new classroom's teacherId
    await db.update(classrooms)
      .set({ teacherId: id })
      .where(eq(classrooms.id, classroomId))
  }

  await db.update(users)
    .set({ classroomId: classroomId })
    .where(eq(users.id, id))

  return apiOk({ assigned: true })
}

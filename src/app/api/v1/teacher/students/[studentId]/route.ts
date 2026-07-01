import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import bcrypt from 'bcryptjs'

interface Props { params: { studentId: string } }

// PATCH /api/v1/teacher/students/[studentId] — update name, PIN, or avatar
export async function PATCH(req: NextRequest, { params }: Props) {
  const teacherId = req.headers.get('x-user-id')
  const role      = req.headers.get('x-role')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'FORBIDDEN', 403)
  }

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacherId!))
    .limit(1)

  if (!classroom) return apiError('No classroom found', 'NO_CLASSROOM', 404)

  // Verify student belongs to this classroom
  const [student] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, params.studentId), eq(users.classroomId, classroom.id)))
    .limit(1)

  if (!student) return apiError('Student not found', 'NOT_FOUND', 404)

  const body = await req.json()
  const updates: Record<string, unknown> = {}

  if (body.name?.trim()) {
    updates.name        = body.name.trim()
    updates.displayName = body.name.trim()
  }

  if (body.pin) {
    if (String(body.pin).length !== 4 || isNaN(Number(body.pin))) {
      return apiError('PIN must be 4 digits', 'INVALID_PIN', 400)
    }
    updates.pinHash = await bcrypt.hash(String(body.pin), 10)
  }

  if (body.avatarId) {
    updates.avatarId = body.avatarId
  }

  if (Object.keys(updates).length === 0) {
    return apiError('Nothing to update', 'EMPTY_UPDATE', 400)
  }

  await db.update(users).set(updates).where(eq(users.id, params.studentId))

  return apiOk({ updated: true })
}

// DELETE /api/v1/teacher/students/[studentId] — soft delete
export async function DELETE(req: NextRequest, { params }: Props) {
  const teacherId = req.headers.get('x-user-id')
  const role      = req.headers.get('x-role')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'FORBIDDEN', 403)
  }

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacherId!))
    .limit(1)

  if (!classroom) return apiError('No classroom found', 'NO_CLASSROOM', 404)

  const [student] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, params.studentId), eq(users.classroomId, classroom.id)))
    .limit(1)

  if (!student) return apiError('Student not found', 'NOT_FOUND', 404)

  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.id, params.studentId))

  return apiOk({ deleted: true })
}

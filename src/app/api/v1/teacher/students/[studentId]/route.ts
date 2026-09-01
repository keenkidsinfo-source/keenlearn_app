export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getTeacherClassroom } from '@/lib/teacher-classroom'

interface Props { params: { studentId: string } }

// PATCH /api/v1/teacher/students/[studentId] — update name, PIN, or avatar
export async function PATCH(req: NextRequest, { params }: Props) {
  const teacherId = req.headers.get('x-user-id')
  const role      = req.headers.get('x-role')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'FORBIDDEN', 403)
  }

  // Admins can edit any student; teachers must own the classroom
  if (role !== 'admin') {
    const classroom = await getTeacherClassroom(teacherId!)
    if (!classroom) return apiError('No classroom found', 'NO_CLASSROOM', 404)

    const [studentCheck] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, params.studentId), eq(users.classroomId, classroom.id)))
      .limit(1)

    if (!studentCheck) return apiError('Student not found', 'NOT_FOUND', 404)
  } else {
    const [studentCheck] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.studentId))
      .limit(1)

    if (!studentCheck || studentCheck.role !== 'student') {
      return apiError('Student not found', 'NOT_FOUND', 404)
    }
  }

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
    updates.pin = String(body.pin)
  }

  if (body.avatarId) {
    updates.avatarId = body.avatarId
  }

  if ('parentName' in body) {
    updates.parentName = body.parentName?.trim() || null
  }

  if ('parentEmail' in body) {
    updates.parentEmail = body.parentEmail?.trim().toLowerCase() || null
  }

  if ('parentPhone' in body) {
    updates.parentPhone = body.parentPhone?.trim() || null
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

  // Admins can delete any student directly; teachers must own the classroom
  if (role === 'admin') {
    const [student] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.studentId))
      .limit(1)

    if (!student || student.role !== 'student') {
      return apiError('Student not found', 'NOT_FOUND', 404)
    }

    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, params.studentId))

    return apiOk({ deleted: true })
  }

  const classroom2 = await getTeacherClassroom(teacherId!)
  if (!classroom2) return apiError('No classroom found', 'NO_CLASSROOM', 404)

  const [student] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, params.studentId), eq(users.classroomId, classroom2.id)))
    .limit(1)

  if (!student) return apiError('Student not found', 'NOT_FOUND', 404)

  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.id, params.studentId))

  return apiOk({ deleted: true })
}

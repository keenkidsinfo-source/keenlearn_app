export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import bcrypt from 'bcryptjs'

// POST /api/v1/teacher/students — add a student to teacher's classroom
export async function POST(req: NextRequest) {
  const teacherId = req.headers.get('x-user-id')
  const role      = req.headers.get('x-role')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'FORBIDDEN', 403)
  }

  // Find teacher's classroom
  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacherId!))
    .limit(1)

  if (!classroom) return apiError('No classroom found', 'NO_CLASSROOM', 404)

  const body = await req.json()
  const { name, pin, avatarId } = body

  if (!name?.trim()) return apiError('Name is required', 'MISSING_NAME', 400)
  if (!pin || String(pin).length !== 4 || isNaN(Number(pin))) {
    return apiError('PIN must be 4 digits', 'INVALID_PIN', 400)
  }

  const pinHash = await bcrypt.hash(String(pin), 10)

  const [student] = await db
    .insert(users)
    .values({
      schoolId:    classroom.schoolId,
      classroomId: classroom.id,
      name:        name.trim(),
      displayName: name.trim(),
      role:        'student',
      avatarId:    avatarId ?? 1,
      pinHash,
    })
    .returning({ id: users.id, name: users.name, displayName: users.displayName, avatarId: users.avatarId })

  return apiOk(student, 201)
}

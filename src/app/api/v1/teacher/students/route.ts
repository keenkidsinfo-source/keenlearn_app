export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms, classroomTeachers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import bcrypt from 'bcryptjs'
import { getTeacherClassroom } from '@/lib/teacher-classroom'

// POST /api/v1/teacher/students — add a student to teacher's classroom
export async function POST(req: NextRequest) {
  const teacherId = req.headers.get('x-user-id')
  const role      = req.headers.get('x-role')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'FORBIDDEN', 403)
  }

  const body = await req.json()
  const { name, pin, avatarId, parentName, parentEmail, classroomId: requestedClassroomId } = body

  // If a specific classroomId was requested, validate the teacher is assigned to it
  let classroom = null
  if (requestedClassroomId && role !== 'admin') {
    const [row] = await db
      .select({ classroom: classrooms })
      .from(classroomTeachers)
      .innerJoin(classrooms, eq(classroomTeachers.classroomId, classrooms.id))
      .where(and(eq(classroomTeachers.teacherId, teacherId!), eq(classroomTeachers.classroomId, requestedClassroomId)))
      .limit(1)
    classroom = row?.classroom ?? null
    if (!classroom) return apiError('No access to that classroom', 'FORBIDDEN', 403)
  } else {
    classroom = await getTeacherClassroom(teacherId!, role === 'admin' ? requestedClassroomId : undefined)
  }
  if (!classroom) return apiError('No classroom found', 'NO_CLASSROOM', 404)

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
      parentName:  parentName?.trim() || null,
      parentEmail: parentEmail?.trim().toLowerCase() || null,
    })
    .returning({ id: users.id, name: users.name, displayName: users.displayName, avatarId: users.avatarId, parentName: users.parentName, parentEmail: users.parentEmail })

  return apiOk(student, 201)
}

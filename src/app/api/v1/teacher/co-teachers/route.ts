export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classroomTeachers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'
import { getTeacherClassroom } from '@/lib/teacher-classroom'

// GET /api/v1/teacher/co-teachers — list teachers in the same classroom
export async function GET() {
  const session = await getSession()
  if (!session || session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const classroom = await getTeacherClassroom(session.sub)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, isPrimary: classroomTeachers.isPrimary })
    .from(classroomTeachers)
    .innerJoin(users, eq(classroomTeachers.teacherId, users.id))
    .where(eq(classroomTeachers.classroomId, classroom.id))

  return apiOk(rows)
}

// POST /api/v1/teacher/co-teachers — invite a co-teacher by email
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const classroom = await getTeacherClassroom(session.sub)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const body = await req.json().catch(() => null)
  const email: string = (body?.email ?? '').trim().toLowerCase()
  if (!email) return apiError('email is required', 'VALIDATION_ERROR', 400)

  // Look up teacher by email
  const [teacher] = await db
    .select({ id: users.id, name: users.name, email: users.email, approvedAt: users.approvedAt })
    .from(users)
    .where(and(eq(users.email, email), eq(users.role, 'teacher')))
    .limit(1)

  if (!teacher) return apiError('No teacher account found with that email', 'NOT_FOUND', 404)
  if (!teacher.approvedAt) return apiError('That teacher account is not yet approved by admin', 'NOT_APPROVED', 400)
  if (teacher.id === session.sub) return apiError('That\'s your own account', 'VALIDATION_ERROR', 400)

  await db.insert(classroomTeachers)
    .values({ classroomId: classroom.id, teacherId: teacher.id, isPrimary: false })
    .onConflictDoNothing()

  return apiOk({ added: true, teacher: { id: teacher.id, name: teacher.name, email: teacher.email } })
}

// DELETE /api/v1/teacher/co-teachers?teacherId=xxx — remove a co-teacher
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const classroom = await getTeacherClassroom(session.sub)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const teacherId = req.nextUrl.searchParams.get('teacherId')
  if (!teacherId) return apiError('teacherId required', 'VALIDATION_ERROR', 400)

  // Only allow removing non-primary co-teachers (primary is managed by admin)
  const [row] = await db
    .select({ isPrimary: classroomTeachers.isPrimary })
    .from(classroomTeachers)
    .where(and(eq(classroomTeachers.classroomId, classroom.id), eq(classroomTeachers.teacherId, teacherId)))
    .limit(1)

  if (!row) return apiError('Teacher not found in this classroom', 'NOT_FOUND', 404)
  if (row.isPrimary) return apiError('Cannot remove the primary teacher — contact admin', 'FORBIDDEN', 403)

  await db.delete(classroomTeachers)
    .where(and(eq(classroomTeachers.classroomId, classroom.id), eq(classroomTeachers.teacherId, teacherId)))

  return apiOk({ removed: true })
}

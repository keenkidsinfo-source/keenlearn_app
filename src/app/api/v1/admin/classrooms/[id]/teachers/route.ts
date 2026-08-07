export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms, classroomTeachers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

interface Props { params: Promise<{ id: string }> }

// GET /api/v1/admin/classrooms/[id]/teachers
// Returns all teachers assigned to a classroom.
export async function GET(req: NextRequest, { params }: Props) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id } = await params

  const rows = await db
    .select({
      id:        users.id,
      name:      users.name,
      email:     users.email,
      isPrimary: classroomTeachers.isPrimary,
    })
    .from(classroomTeachers)
    .innerJoin(users, eq(classroomTeachers.teacherId, users.id))
    .where(eq(classroomTeachers.classroomId, id))

  return apiOk(rows)
}

// POST /api/v1/admin/classrooms/[id]/teachers
// Body: { teacherEmail: string }  — adds a co-teacher (isPrimary = false unless classroom has none).
export async function POST(req: NextRequest, { params }: Props) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id: classroomId } = await params
  const body = await req.json().catch(() => null)
  const teacherEmail: string = (body?.teacherEmail ?? '').trim().toLowerCase()

  if (!teacherEmail) return apiError('teacherEmail is required', 'VALIDATION_ERROR', 400)

  // Validate classroom
  const [classroom] = await db.select().from(classrooms).where(eq(classrooms.id, classroomId)).limit(1)
  if (!classroom) return apiError('Classroom not found', 'NOT_FOUND', 404)

  // Find teacher by email
  const [teacher] = await db
    .select({ id: users.id, name: users.name, email: users.email, approvedAt: users.approvedAt })
    .from(users)
    .where(and(eq(users.email, teacherEmail), eq(users.role, 'teacher')))
    .limit(1)

  if (!teacher) return apiError('No approved teacher found with that email', 'NOT_FOUND', 404)
  if (!teacher.approvedAt) return apiError('Teacher account is not yet approved', 'NOT_APPROVED', 400)

  // Check if classroom already has a primary teacher
  const hasPrimary = !!classroom.teacherId

  await db.insert(classroomTeachers)
    .values({ classroomId, teacherId: teacher.id, isPrimary: !hasPrimary })
    .onConflictDoUpdate({
      target: [classroomTeachers.classroomId, classroomTeachers.teacherId],
      set: { isPrimary: !hasPrimary },
    })

  // If first teacher, also set classrooms.teacherId
  if (!hasPrimary) {
    await db.update(classrooms).set({ teacherId: teacher.id }).where(eq(classrooms.id, classroomId))
  }

  return apiOk({ added: true, teacher: { id: teacher.id, name: teacher.name, email: teacher.email } })
}

// DELETE /api/v1/admin/classrooms/[id]/teachers?teacherId=xxx
export async function DELETE(req: NextRequest, { params }: Props) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id: classroomId } = await params
  const teacherId = req.nextUrl.searchParams.get('teacherId')
  if (!teacherId) return apiError('teacherId query param required', 'VALIDATION_ERROR', 400)

  // Check if this teacher is primary
  const [row] = await db
    .select({ isPrimary: classroomTeachers.isPrimary })
    .from(classroomTeachers)
    .where(and(eq(classroomTeachers.classroomId, classroomId), eq(classroomTeachers.teacherId, teacherId)))
    .limit(1)

  if (!row) return apiError('Teacher not assigned to this classroom', 'NOT_FOUND', 404)

  await db.delete(classroomTeachers)
    .where(and(eq(classroomTeachers.classroomId, classroomId), eq(classroomTeachers.teacherId, teacherId)))

  // If was primary, clear classrooms.teacherId (promote another teacher or leave null)
  if (row.isPrimary) {
    const [next] = await db
      .select({ teacherId: classroomTeachers.teacherId })
      .from(classroomTeachers)
      .where(eq(classroomTeachers.classroomId, classroomId))
      .limit(1)

    await db.update(classrooms)
      .set({ teacherId: next?.teacherId ?? null })
      .where(eq(classrooms.id, classroomId))

    if (next) {
      await db.update(classroomTeachers)
        .set({ isPrimary: true })
        .where(and(eq(classroomTeachers.classroomId, classroomId), eq(classroomTeachers.teacherId, next.teacherId)))
    }
  }

  return apiOk({ removed: true })
}

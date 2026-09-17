/**
 * PATCH /api/v1/teacher/classroom
 * Set or clear the active_week override on the teacher's classroom.
 * Body: { activeWeek: number | null }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { classrooms, classroomTeachers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'teacher' && session.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { activeWeek, classroomId: bodyClassroomId } = await req.json()

  // Resolve which classroom to update
  let classroomId: string | null = null

  if (session.role === 'admin' && bodyClassroomId) {
    classroomId = bodyClassroomId
  } else {
    // Teacher — find their classroom via junction table
    const [row] = await db
      .select({ classroomId: classroomTeachers.classroomId })
      .from(classroomTeachers)
      .where(eq(classroomTeachers.teacherId, session.sub))
      .limit(1)
    classroomId = row?.classroomId ?? null
  }

  if (!classroomId) return NextResponse.json({ error: 'No classroom found' }, { status: 404 })

  await db
    .update(classrooms)
    .set({ activeWeek: activeWeek ?? null })
    .where(eq(classrooms.id, classroomId))

  return NextResponse.json({ ok: true, activeWeek: activeWeek ?? null })
}

/**
 * Helpers for resolving which classroom(s) a teacher can access.
 * Uses classroom_teachers junction table — supports multiple teachers per classroom.
 */

import { db } from '@/lib/db'
import { classrooms, classroomTeachers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { Classroom } from '@/lib/db/schema'

/**
 * Returns the first classroom a teacher is assigned to.
 * For admin overrides, pass classroomId directly.
 */
export async function getTeacherClassroom(
  teacherId: string,
  overrideClassroomId?: string | null,
): Promise<Classroom | null> {
  if (overrideClassroomId) {
    const [c] = await db.select().from(classrooms).where(eq(classrooms.id, overrideClassroomId)).limit(1)
    return c ?? null
  }

  const [row] = await db
    .select({ classroom: classrooms })
    .from(classroomTeachers)
    .innerJoin(classrooms, eq(classroomTeachers.classroomId, classrooms.id))
    .where(eq(classroomTeachers.teacherId, teacherId))
    .limit(1)

  return row?.classroom ?? null
}

/**
 * Returns all classrooms a teacher is assigned to.
 */
export async function getTeacherClassrooms(teacherId: string): Promise<Classroom[]> {
  const rows = await db
    .select({ classroom: classrooms })
    .from(classroomTeachers)
    .innerJoin(classrooms, eq(classroomTeachers.classroomId, classrooms.id))
    .where(eq(classroomTeachers.teacherId, teacherId))

  return rows.map(r => r.classroom)
}

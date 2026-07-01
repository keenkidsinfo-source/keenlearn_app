import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, studentSessions, contentItems, classrooms } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/teacher/progress
// Returns class-wide progress summary for the teacher's classroom
export async function GET(req: NextRequest) {
  const role        = req.headers.get('x-role')
  const classroomId = req.headers.get('x-classroom-id')

  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'FORBIDDEN', 403)
  }
  if (!classroomId) return apiError('No classroom assigned', 'NO_CLASSROOM', 400)

  // Get all students in the classroom
  const students = await db
    .select({
      id:          users.id,
      name:        users.name,
      displayName: users.displayName,
      avatarId:    users.avatarId,
      lastActiveAt: users.lastActiveAt,
    })
    .from(users)
    .where(and(
      eq(users.classroomId, classroomId),
      eq(users.role, 'student'),
    ))

  // Get completion counts per student
  const progressData = await Promise.all(
    students.map(async (student) => {
      const [completed] = await db
        .select({ count: count() })
        .from(studentSessions)
        .where(and(
          eq(studentSessions.studentId, student.id),
          eq(studentSessions.completed, true),
        ))

      const [total] = await db
        .select({ count: count() })
        .from(studentSessions)
        .where(eq(studentSessions.studentId, student.id))

      return {
        ...student,
        completedActivities: completed.count,
        totalActivities:     total.count,
        completionRate:      total.count > 0
          ? Math.round((completed.count / total.count) * 100)
          : 0,
      }
    })
  )

  return apiOk({ classroomId, students: progressData })
}

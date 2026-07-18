import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// GET /api/v1/admin/teachers — list all teachers (pending + active)
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const teachers = await db
    .select({
      id:          users.id,
      name:        users.name,
      displayName: users.displayName,
      email:       users.email,
      schoolId:    users.schoolId,
      classroomId: users.classroomId,
      createdAt:   users.createdAt,
      approvedAt:  users.approvedAt,
    })
    .from(users)
    .where(eq(users.role, 'teacher'))
    .orderBy(users.createdAt)

  return apiOk(teachers)
}

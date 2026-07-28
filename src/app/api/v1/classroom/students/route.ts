export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { classrooms, users } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { apiError, apiOk } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase()
  if (!code) return apiError('Missing code', 'MISSING_PARAM', 400)

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.accessCode, code))
    .limit(1)

  if (!classroom) return apiError('Classroom not found', 'NOT_FOUND', 404)

  const studentList = await db
    .select({
      id:          users.id,
      name:        users.name,
      displayName: users.displayName,
      avatarId:    users.avatarId,
    })
    .from(users)
    .where(and(
      eq(users.classroomId, classroom.id),
      eq(users.role, 'student'),
      isNull(users.deletedAt),
    ))
    .orderBy(users.name)

  return apiOk(studentList)
}

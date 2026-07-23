export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { classrooms, schools, users, classroomCurriculum, curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// GET /api/v1/admin/classrooms — list all classrooms with school, teacher, current curriculum
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const rows = await db
    .select({
      id:          classrooms.id,
      name:        classrooms.name,
      gradeLevel:  classrooms.gradeLevel,
      gradeBand:   classrooms.gradeBand,
      accessCode:  classrooms.accessCode,
      schoolId:    classrooms.schoolId,
      teacherId:   classrooms.teacherId,
      schoolName:  schools.name,
    })
    .from(classrooms)
    .leftJoin(schools, eq(classrooms.schoolId, schools.id))
    .orderBy(schools.name, classrooms.gradeLevel)

  // For each classroom, get the assigned teacher name and current curriculum
  const result = await Promise.all(rows.map(async (cls) => {
    const teacher = cls.teacherId
      ? await db.select({ name: users.name, email: users.email })
          .from(users).where(eq(users.id, cls.teacherId)).limit(1)
      : []

    // Most recent curriculum assignment
    const curriculumRows = await db
      .select({
        id:           classroomCurriculum.id,
        weekStartDate: classroomCurriculum.weekStartDate,
        curriculumId: classroomCurriculum.curriculumId,
        title:        curriculum.title,
        weekNumber:   curriculum.weekNumber,
      })
      .from(classroomCurriculum)
      .leftJoin(curriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
      .where(eq(classroomCurriculum.classroomId, cls.id))
      .orderBy(classroomCurriculum.weekStartDate)

    return {
      ...cls,
      teacherName:  teacher[0]?.name ?? null,
      teacherEmail: teacher[0]?.email ?? null,
      curriculum:   curriculumRows,
    }
  }))

  return apiOk(result)
}

// POST /api/v1/admin/classrooms — create a new classroom
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const body = await req.json().catch(() => null)
  const { schoolId, name, gradeLevel, gradeBand } = body ?? {}
  if (!name || !gradeLevel || !gradeBand) {
    return apiError('name, gradeLevel, and gradeBand are required', 'VALIDATION_ERROR', 400)
  }

  // Generate unique 6-char access code
  const accessCode = Math.random().toString(36).slice(2, 8).toUpperCase()

  const [created] = await db.insert(classrooms).values({
    schoolId:   schoolId ?? null,
    name,
    gradeLevel,
    gradeBand,
    accessCode,
  }).returning()

  return apiOk(created)
}

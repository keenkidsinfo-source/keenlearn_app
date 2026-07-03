import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
import { eq, and, ilike, isNull } from 'drizzle-orm'
import { comparePassword } from '@/lib/auth/password'
import { signToken, setTokenCookie } from '@/lib/auth/jwt'
import { apiError, apiOk } from '@/lib/utils'

const studentSchema = z.object({
  type:       z.literal('student'),
  accessCode: z.string().length(6),
  lastName:   z.string().min(1).max(50),
  userId:     z.string().uuid().optional(), // set when disambiguating
})

const teacherSchema = z.object({
  type:     z.literal('teacher'),
  email:    z.string().email(),
  password: z.string().min(8),
})

const schema = z.discriminatedUnion('type', [studentSchema, teacherSchema])

async function issueStudentToken(student: any, classroom: any) {
  const token = await signToken({
    sub:         student.id,
    role:        'student',
    classroomId: classroom.id,
    gradeBand:   classroom.gradeBand as 'g1-2' | 'g3-4',
    name:        student.displayName ?? student.name,
  })
  const res = apiOk({
    id:        student.id,
    name:      student.displayName ?? student.name,
    role:      'student',
    gradeBand: classroom.gradeBand,
  })
  const cookie = setTokenCookie(token, 'student')
  res.headers.set('Set-Cookie',
    `${cookie.name}=${cookie.value}; Path=${cookie.path}; HttpOnly; SameSite=Lax; Max-Age=${cookie.maxAge}${cookie.secure ? '; Secure' : ''}`
  )
  return res
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request body', 'VALIDATION_ERROR', 400)

  const data = parsed.data

  if (data.type === 'student') {
    // 1. Find classroom
    const [classroom] = await db
      .select().from(classrooms)
      .where(eq(classrooms.accessCode, data.accessCode.toUpperCase()))
      .limit(1)
    if (!classroom) return apiError('Invalid class code. Try again!', 'INVALID_ACCESS_CODE', 401)

    // 2. If userId is set (disambiguation chosen), log in directly
    if (data.userId) {
      const [student] = await db.select().from(users)
        .where(and(
          eq(users.id, data.userId),
          eq(users.classroomId, classroom.id),
          eq(users.role, 'student'),
          isNull(users.deletedAt),
        )).limit(1)
      if (!student) return apiError('Student not found', 'STUDENT_NOT_FOUND', 401)
      return issueStudentToken(student, classroom)
    }

    // 3. Match by last name (case-insensitive)
    const matches = await db.select().from(users)
      .where(and(
        eq(users.classroomId, classroom.id),
        eq(users.role, 'student'),
        isNull(users.deletedAt),
        ilike(users.name, data.lastName.trim()),
      ))

    if (matches.length === 0) {
      return apiError('Name not found. Check your last name and try again!', 'STUDENT_NOT_FOUND', 401)
    }

    // 4. Unique match — log in directly
    if (matches.length === 1) {
      return issueStudentToken(matches[0], classroom)
    }

    // 5. Multiple matches — return options for the client to show a picker
    return apiOk({
      needsDisambiguation: true,
      options: matches.map(s => ({
        id:        s.id,
        firstName: s.displayName ?? s.name,
      })),
    })
  }

  // Teacher login
  const [teacher] = await db.select().from(users)
    .where(eq(users.email, data.email.toLowerCase()))
    .limit(1)

  if (!teacher || !teacher.passwordHash || teacher.role === 'student') {
    return apiError('Invalid credentials', 'INVALID_CREDENTIALS', 401)
  }

  const passwordValid = await comparePassword(data.password, teacher.passwordHash)
  if (!passwordValid) return apiError('Invalid credentials', 'INVALID_CREDENTIALS', 401)

  const token = await signToken({
    sub:         teacher.id,
    role:        teacher.role as 'teacher' | 'admin',
    classroomId: teacher.classroomId ?? undefined,
    name:        teacher.name,
  })

  const res = apiOk({ id: teacher.id, name: teacher.name, role: teacher.role, email: teacher.email })
  const cookie = setTokenCookie(token, teacher.role as 'teacher')
  res.headers.set('Set-Cookie',
    `${cookie.name}=${cookie.value}; Path=${cookie.path}; HttpOnly; SameSite=Lax; Max-Age=${cookie.maxAge}${cookie.secure ? '; Secure' : ''}`
  )
  return res
}

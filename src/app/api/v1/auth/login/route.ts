import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { comparePin, comparePassword } from '@/lib/auth/password'
import { signToken, setTokenCookie } from '@/lib/auth/jwt'
import { apiError, apiOk } from '@/lib/utils'

const studentSchema = z.object({
  type:        z.literal('student'),
  accessCode:  z.string().length(6),
  userId:      z.string().uuid(),
  pin:         z.string().length(4),
})

const teacherSchema = z.object({
  type:     z.literal('teacher'),
  email:    z.string().email(),
  password: z.string().min(8),
})

const schema = z.discriminatedUnion('type', [studentSchema, teacherSchema])

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return apiError('Invalid request body', 'VALIDATION_ERROR', 400)
  }

  const data = parsed.data

  if (data.type === 'student') {
    // 1. Find classroom by access code
    const [classroom] = await db
      .select()
      .from(classrooms)
      .where(eq(classrooms.accessCode, data.accessCode.toUpperCase()))
      .limit(1)

    if (!classroom) return apiError('Invalid access code', 'INVALID_ACCESS_CODE', 401)

    // 2. Find student in that classroom
    const [student] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.userId))
      .limit(1)

    if (!student || student.classroomId !== classroom.id || student.role !== 'student') {
      return apiError('Student not found', 'STUDENT_NOT_FOUND', 401)
    }

    if (!student.pinHash) return apiError('No PIN set', 'NO_PIN', 401)

    const pinValid = await comparePin(data.pin, student.pinHash)
    if (!pinValid) return apiError('Incorrect PIN', 'INVALID_PIN', 401)

    // 3. Issue token
    const token = await signToken({
      sub:         student.id,
      role:        'student',
      classroomId: classroom.id,
      gradeBand:   classroom.gradeBand as 'g1-2' | 'g3-4',
      name:        student.displayName ?? student.name,
    })

    const res = apiOk({
      id:         student.id,
      name:       student.displayName ?? student.name,
      avatarId:   student.avatarId,
      role:       'student',
      gradeBand:  classroom.gradeBand,
    })

    const cookie = setTokenCookie(token, 'student')
    res.headers.set('Set-Cookie',
      `${cookie.name}=${cookie.value}; Path=${cookie.path}; HttpOnly; SameSite=Lax; Max-Age=${cookie.maxAge}${cookie.secure ? '; Secure' : ''}`
    )
    return res
  }

  // Teacher login
  const [teacher] = await db
    .select()
    .from(users)
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

  const res = apiOk({
    id:    teacher.id,
    name:  teacher.name,
    role:  teacher.role,
    email: teacher.email,
  })

  const cookie = setTokenCookie(token, teacher.role as 'teacher')
  res.headers.set('Set-Cookie',
    `${cookie.name}=${cookie.value}; Path=${cookie.path}; HttpOnly; SameSite=Lax; Max-Age=${cookie.maxAge}${cookie.secure ? '; Secure' : ''}`
  )
  return res
}

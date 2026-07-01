import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { Role, GradeBand } from '@/lib/db/schema'

export interface JWTPayload {
  sub: string        // user id
  role: Role
  classroomId?: string
  gradeBand?: GradeBand
  name: string
}

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

const STUDENT_EXPIRY = '8h'
const TEACHER_EXPIRY = '24h'

export async function signToken(payload: JWTPayload): Promise<string> {
  const expiry = payload.role === 'student' ? STUDENT_EXPIRY : TEACHER_EXPIRY

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('kk_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function setTokenCookie(token: string, role: Role) {
  const maxAge = role === 'student' ? 60 * 60 * 8 : 60 * 60 * 24 // 8h or 24h
  return {
    name: 'kk_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  }
}

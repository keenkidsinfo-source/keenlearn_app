export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { comparePassword, hashPassword } from '@/lib/auth/password'
import { getSession } from '@/lib/auth/jwt'
import { apiOk, apiError } from '@/lib/utils'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role === 'student') {
    return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('New password must be at least 8 characters.', 'VALIDATION_ERROR', 400)

  const { currentPassword, newPassword } = parsed.data

  const [user] = await db.select({ id: users.id, passwordHash: users.passwordHash })
    .from(users).where(eq(users.id, session.sub)).limit(1)

  if (!user?.passwordHash) return apiError('User not found', 'NOT_FOUND', 404)

  const valid = await comparePassword(currentPassword, user.passwordHash)
  if (!valid) return apiError('Current password is incorrect.', 'WRONG_PASSWORD', 401)

  const newHash = await hashPassword(newPassword)
  await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id))

  return apiOk({ message: 'Password updated.' })
}

export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

const schema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z.string().min(8),
})

// POST /api/v1/admin/admins — create another admin (existing admin only)
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { name, email, password } = parsed.data

  const [existing] = await db.select({ id: users.id, role: users.role }).from(users)
    .where(eq(users.email, email.toLowerCase())).limit(1)

  if (existing) {
    if (existing.role === 'admin') return apiError('Already an admin.', 'ALREADY_ADMIN', 409)
    // Upgrade existing user to admin
    await db.update(users)
      .set({ role: 'admin', approvedAt: new Date(), passwordHash: await hashPassword(password) })
      .where(eq(users.id, existing.id))
    return apiOk({ message: 'User upgraded to admin.' })
  }

  const passwordHash = await hashPassword(password)
  await db.insert(users).values({
    name:       name.trim(),
    email:      email.toLowerCase().trim(),
    passwordHash,
    role:       'admin',
    approvedAt: new Date(),
  })

  return apiOk({ message: 'Admin account created.' })
}

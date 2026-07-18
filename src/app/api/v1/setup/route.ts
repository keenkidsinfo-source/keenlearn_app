import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'
import { apiOk, apiError } from '@/lib/utils'

async function adminExists() {
  const [{ value }] = await db.select({ value: count() }).from(users).where(eq(users.role, 'admin'))
  return Number(value) > 0
}

// GET /api/v1/setup — check if setup is still needed
export async function GET() {
  const needed = !(await adminExists())
  return apiOk({ needed })
}

// POST /api/v1/setup — create first admin (only works if no admins exist yet)
const schema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  if (await adminExists()) {
    return apiError('Setup already complete.', 'ALREADY_SETUP', 403)
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { name, email, password } = parsed.data

  const [existing] = await db.select({ id: users.id }).from(users)
    .where(eq(users.email, email.toLowerCase())).limit(1)
  if (existing) return apiError('Email already in use.', 'EMAIL_TAKEN', 409)

  const passwordHash = await hashPassword(password)
  await db.insert(users).values({
    name:         name.trim(),
    email:        email.toLowerCase().trim(),
    passwordHash,
    role:         'admin',
    approvedAt:   new Date(),
  })

  return apiOk({ message: 'Admin account created.' })
}

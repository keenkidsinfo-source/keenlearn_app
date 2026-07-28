export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { users, schools } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'
import { apiOk, apiError } from '@/lib/utils'

const schema = z.object({
  name:       z.string().min(2).max(80),
  email:      z.string().email(),
  password:   z.string().min(8),
  schoolName: z.string().min(2).max(100),
  gradeLevel: z.string().min(1).max(10),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { name, email, password, schoolName, gradeLevel } = parsed.data

  // Check email not already taken
  const [existing] = await db.select({ id: users.id }).from(users)
    .where(eq(users.email, email.toLowerCase())).limit(1)
  if (existing) return apiError('An account with this email already exists.', 'EMAIL_TAKEN', 409)

  const passwordHash = await hashPassword(password)

  // Try to match to an existing school by name (loose match)
  const allSchools = await db.select().from(schools)
  const matchedSchool = allSchools.find(s =>
    s.name.toLowerCase().includes(schoolName.toLowerCase().split(' ')[0]) ||
    schoolName.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
  )

  await db.insert(users).values({
    name:         name.trim(),
    email:        email.toLowerCase().trim(),
    passwordHash,
    role:         'teacher',
    schoolId:     matchedSchool?.id ?? null,
    // approvedAt is null → pending until admin approves
    // Store school name + grade in displayName temporarily if no school match
    displayName:  matchedSchool ? gradeLevel : `${schoolName} · Grade ${gradeLevel}`,
  })

  return apiOk({ message: 'Account created. Awaiting admin approval.' })
}

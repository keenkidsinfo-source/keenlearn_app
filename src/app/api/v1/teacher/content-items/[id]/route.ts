export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { contentItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth/jwt'
import { apiError, apiOk } from '@/lib/utils'

const schema = z.object({
  title:     z.string().min(1).max(100),
  challenge: z.string().min(1).max(100),
  tagline:   z.string().max(200).default(''),
  language:  z.enum(['scratch', 'python']),
  steps:     z.array(z.string().min(1)).min(1).max(20),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || (session.role !== 'teacher' && session.role !== 'admin')) {
    return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid input', 'VALIDATION_ERROR', 400)

  const { title, challenge, tagline, language, steps } = parsed.data

  const [updated] = await db
    .update(contentItems)
    .set({ title, metadata: { language, challenge, tagline, steps } })
    .where(eq(contentItems.id, id))
    .returning({ id: contentItems.id, title: contentItems.title })

  if (!updated) return apiError('Content item not found', 'NOT_FOUND', 404)

  return apiOk(updated)
}

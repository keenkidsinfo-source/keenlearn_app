export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { studentSessions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/sessions/:contentId
// Returns the current student's progress for a content item
export async function GET(req: NextRequest, { params }: { params: Promise<{ contentId: string }> }) {
  const studentId = req.headers.get('x-user-id')
  if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

  const { contentId } = await params

  const [session] = await db
    .select()
    .from(studentSessions)
    .where(and(
      eq(studentSessions.studentId, studentId),
      eq(studentSessions.contentItemId, contentId),
    ))
    .limit(1)

  return apiOk(session ?? null)
}

const updateSchema = z.object({
  progressPct:   z.number().int().min(0).max(100).optional(),
  lastStepIndex: z.number().int().min(0).optional(),
  completed:     z.boolean().optional(),
  sessionData:   z.record(z.unknown()).optional(),
})

// PUT /api/v1/sessions/:contentId
// Upsert progress for a content item
export async function PUT(req: NextRequest, { params }: { params: Promise<{ contentId: string }> }) {
  const studentId = req.headers.get('x-user-id')
  if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

  const { contentId } = await params
  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { progressPct, lastStepIndex, completed, sessionData } = parsed.data

  const now = new Date()

  await db
    .insert(studentSessions)
    .values({
      studentId,
      contentItemId: contentId,
      progressPct:   progressPct ?? 0,
      lastStepIndex: lastStepIndex ?? 0,
      completed:     completed ?? false,
      completedAt:   completed ? now : undefined,
      lastActiveAt:  now,
      sessionData:   sessionData ?? {},
    })
    .onConflictDoUpdate({
      target: [studentSessions.studentId, studentSessions.contentItemId],
      set: {
        progressPct:   progressPct,
        lastStepIndex: lastStepIndex,
        completed:     completed,
        completedAt:   completed ? now : undefined,
        lastActiveAt:  now,
        sessionData:   sessionData,
      },
    })

  return apiOk({ saved: true })
}

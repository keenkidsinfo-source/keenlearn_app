import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { studentSessions, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

const schema = z.object({
  studentId:     z.string().uuid(),
  contentItemId: z.string().uuid(),
  done:          z.boolean(), // true = mark complete, false = undo
})

// POST /api/v1/teacher/speaking/mark
// Lets a teacher mark a student as having completed a speaking session
export async function POST(req: NextRequest) {
  const role = req.headers.get('x-role')
  if (role !== 'teacher' && role !== 'admin') {
    return apiError('Forbidden', 'INSUFFICIENT_ROLE', 403)
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return apiError('Invalid request', 'VALIDATION_ERROR', 400)

  const { studentId, contentItemId, done } = parsed.data

  // Verify the student exists
  const [student] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, studentId))
    .limit(1)

  if (!student) return apiError('Student not found', 'NOT_FOUND', 404)

  const now = new Date()

  await db
    .insert(studentSessions)
    .values({
      studentId,
      contentItemId,
      progressPct:  done ? 100 : 0,
      completed:    done,
      completedAt:  done ? now : undefined,
      lastActiveAt: now,
      sessionData:  { markedByTeacher: true },
    })
    .onConflictDoUpdate({
      target: [studentSessions.studentId, studentSessions.contentItemId],
      set: {
        progressPct:  done ? 100 : 0,
        completed:    done,
        completedAt:  done ? now : undefined,
        lastActiveAt: now,
        sessionData:  { markedByTeacher: true },
      },
    })

  return apiOk({ saved: true, studentId, done })
}

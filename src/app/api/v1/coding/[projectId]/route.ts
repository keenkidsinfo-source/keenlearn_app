export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { codingProjects, curriculumContent, studentSessions } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

async function upsertCodingSession(studentId: string, curriculumContentId: string) {
  try {
    const [cc] = await db.select({ contentItemId: curriculumContent.contentItemId })
      .from(curriculumContent).where(eq(curriculumContent.id, curriculumContentId)).limit(1)
    if (!cc) return
    await db.insert(studentSessions).values({
      studentId,
      contentItemId: cc.contentItemId,
      progressPct: 50,
      lastActiveAt: new Date(),
      completed: false,
    }).onConflictDoUpdate({
      target: [studentSessions.studentId, studentSessions.contentItemId],
      set: { lastActiveAt: new Date(), progressPct: sql`GREATEST(student_sessions.progress_pct, 50)` },
    })
  } catch (e) {
    console.warn('[upsertCodingSession] failed:', e)
  }
}

// GET /api/v1/coding/:projectId — load a coding project
export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const studentId = req.headers.get('x-user-id')
  if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

  const { projectId } = await params

  const [project] = await db
    .select()
    .from(codingProjects)
    .where(and(
      eq(codingProjects.id, projectId),
      eq(codingProjects.studentId, studentId),
    ))
    .limit(1)

  if (!project) return apiError('Project not found', 'NOT_FOUND', 404)
  return apiOk(project)
}

// PUT /api/v1/coding/:projectId — save a coding project
export async function PUT(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const studentId = req.headers.get('x-user-id')
    if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

    const { projectId } = await params

    const [project] = await db
      .select()
      .from(codingProjects)
      .where(and(
        eq(codingProjects.id, projectId),
        eq(codingProjects.studentId, studentId),
      ))
      .limit(1)

    if (!project) return apiError('Project not found', 'NOT_FOUND', 404)

    const body = await req.json().catch(() => null)
    if (!body?.projectJson) return apiError('Invalid body', 'VALIDATION_ERROR', 400)

    const updates: Record<string, unknown> = { projectData: body.projectJson, lastSavedAt: new Date() }
    // Fix rows that were created without curriculumContentId
    if (body.curriculumContentId && !project.curriculumContentId) {
      updates.curriculumContentId = body.curriculumContentId
    }

    await db
      .update(codingProjects)
      .set(updates as any)
      .where(eq(codingProjects.id, projectId))

    // Upsert student_sessions so teacher dashboard shows coding progress
    const ccId = (updates.curriculumContentId ?? project.curriculumContentId) as string | null
    if (ccId) await upsertCodingSession(studentId, ccId)

    return apiOk({ saved: true, lastSavedAt: new Date().toISOString() })
  } catch (err: any) {
    console.error('[PUT /api/v1/coding/:id] error:', err?.message ?? err)
    return apiError(err?.message ?? 'Internal error', 'INTERNAL_ERROR', 500)
  }
}

// DELETE /api/v1/coding/:projectId — wipe saved data so student starts fresh
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const studentId = req.headers.get('x-user-id')
  if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  const { projectId } = await params
  await db.delete(codingProjects).where(
    and(eq(codingProjects.id, projectId), eq(codingProjects.studentId, studentId))
  )
  return apiOk({ deleted: true })
}

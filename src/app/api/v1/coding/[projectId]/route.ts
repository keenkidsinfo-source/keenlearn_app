import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { codingProjects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { uploadObject, getPresignedUrl, r2Keys } from '@/lib/r2/client'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/coding/:projectId — load a coding project (returns presigned URL to the JSON in R2)
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

  // Generate a presigned URL for the project JSON in R2
  let projectUrl: string | null = null
  if (project.r2Key) {
    try {
      projectUrl = await getPresignedUrl(project.r2Key)
    } catch {
      // File not yet uploaded (new project)
    }
  }

  return apiOk({ ...project, projectUrl })
}

// PUT /api/v1/coding/:projectId — save (auto-save) a coding project
export async function PUT(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
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
  if (!body) return apiError('Invalid body', 'VALIDATION_ERROR', 400)

  // Upload project JSON to R2
  const r2Key = project.r2Key ?? r2Keys.codingProject(studentId, projectId)
  await uploadObject(r2Key, JSON.stringify(body), 'application/json')

  // Update DB with last saved timestamp
  await db
    .update(codingProjects)
    .set({ r2Key, lastSavedAt: new Date() })
    .where(eq(codingProjects.id, projectId))

  return apiOk({ saved: true, lastSavedAt: new Date().toISOString() })
}

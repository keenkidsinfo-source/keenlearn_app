import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { codingProjects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/coding — list all coding projects for the current student
export async function GET(req: NextRequest) {
  const studentId = req.headers.get('x-user-id')
  if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

  const projects = await db
    .select()
    .from(codingProjects)
    .where(eq(codingProjects.studentId, studentId))
    .orderBy(codingProjects.lastSavedAt)

  return apiOk(projects)
}

const createSchema = z.object({
  title:                z.string().min(1).max(100).optional(),
  language:             z.enum(['scratch', 'python', 'blocks']),
  curriculumContentId:  z.string().uuid().optional(),
  projectJson:          z.string().optional(),
})

// POST /api/v1/coding — create a new coding project and upload initial JSON to R2
export async function POST(req: NextRequest) {
  try {
    const studentId = req.headers.get('x-user-id')
    if (!studentId) return apiError('Unauthorized', 'UNAUTHORIZED', 401)

    const body = await req.json().catch(() => null)
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      console.error('[POST /api/v1/coding] validation error', parsed.error.flatten())
      return apiError('Invalid request', 'VALIDATION_ERROR', 400)
    }

    const { title, language, curriculumContentId, projectJson } = parsed.data

    const [project] = await db
      .insert(codingProjects)
      .values({
        studentId,
        title:               title ?? 'My Project',
        language,
        curriculumContentId: curriculumContentId ?? null,
        projectData:         projectJson ?? null,
        lastSavedAt:         new Date(),
      })
      .returning()

    return apiOk(project, 201)
  } catch (err: any) {
    const msg = err?.cause?.message ?? err?.message ?? 'Internal error'
    console.error('[POST /api/v1/coding] error:', msg, err?.cause ?? err)
    return apiError(msg, 'INTERNAL_ERROR', 500)
  }
}

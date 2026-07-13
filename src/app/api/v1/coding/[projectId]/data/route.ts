import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { codingProjects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/v1/coding/[projectId]/data
// Public — fetched directly by TurboWarp's iframe. UUID is the access control.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const [project] = await db
    .select({ projectData: codingProjects.projectData })
    .from(codingProjects)
    .where(eq(codingProjects.id, projectId))
    .limit(1)

  if (!project?.projectData) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(project.projectData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

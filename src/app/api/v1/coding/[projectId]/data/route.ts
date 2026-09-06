export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { codingProjects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { downloadProject } from '@/lib/scratch-storage'

// GET /api/v1/coding/[projectId]/data
// Public — fetched directly by TurboWarp's iframe. UUID is the access control.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const [project] = await db
    .select({ projectData: codingProjects.projectData, r2Key: codingProjects.r2Key })
    .from(codingProjects)
    .where(eq(codingProjects.id, projectId))
    .limit(1)

  if (!project) return new NextResponse('Not found', { status: 404 })

  let data: string | null = null

  // Prefer storage (r2Key) over inline project_data
  if (project.r2Key) {
    data = await downloadProject(project.r2Key)
  } else {
    data = project.projectData ?? null
  }

  if (!data) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

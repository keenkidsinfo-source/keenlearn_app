import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { codingProjects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/v1/coding/[projectId]/data
// Returns raw Scratch project JSON for TurboWarp to load via ?project_url=
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { projectId } = await params

  const [project] = await db
    .select()
    .from(codingProjects)
    .where(and(
      eq(codingProjects.id, projectId),
      eq(codingProjects.studentId, session.sub),
    ))
    .limit(1)

  if (!project) return new NextResponse('Not found', { status: 404 })

  const data = project.projectData
  if (!data) return new NextResponse('No saved data', { status: 404 })

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { schools } from '@/lib/db/schema'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// GET /api/v1/admin/schools — list all schools (admin only)
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const rows = await db.select().from(schools).orderBy(schools.name)
  return apiOk(rows)
}

// POST /api/v1/admin/schools — create a new school
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const body = await req.json().catch(() => null)
  const name: string = body?.name?.trim()
  if (!name) return apiError('School name is required', 'VALIDATION_ERROR', 400)

  // Generate slug from name e.g. "Mattos Elementary" → "mattos-elementary"
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const [created] = await db.insert(schools).values({ name, slug }).returning()
  return apiOk(created)
}

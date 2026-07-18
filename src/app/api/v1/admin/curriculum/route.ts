import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// GET /api/v1/admin/curriculum — list all available curriculum weeks
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const rows = await db
    .select()
    .from(curriculum)
    .where(eq(curriculum.isActive, true))
    .orderBy(curriculum.gradeBand, curriculum.weekNumber)

  return apiOk(rows)
}

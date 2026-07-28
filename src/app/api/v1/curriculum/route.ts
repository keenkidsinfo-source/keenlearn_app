export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { curriculum } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/curriculum?gradeBand=g1-2
// Returns all active pre-built curriculum weeks for a grade band
export async function GET(req: NextRequest) {
  const gradeBand = req.nextUrl.searchParams.get('gradeBand')

  if (!gradeBand) return apiError('gradeBand is required', 'MISSING_PARAM', 400)

  const weeks = await db
    .select()
    .from(curriculum)
    .where(and(
      eq(curriculum.gradeBand, gradeBand),
      eq(curriculum.isActive, true),
    ))
    .orderBy(curriculum.weekNumber)

  return apiOk(weeks)
}

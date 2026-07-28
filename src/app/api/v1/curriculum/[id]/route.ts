export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { curriculum, curriculumDays, curriculumContent, contentItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'

// GET /api/v1/curriculum/:id
// Returns a full curriculum week with days and content items
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [week] = await db
    .select()
    .from(curriculum)
    .where(eq(curriculum.id, id))
    .limit(1)

  if (!week) return apiError('Curriculum not found', 'NOT_FOUND', 404)

  const days = await db
    .select()
    .from(curriculumDays)
    .where(eq(curriculumDays.curriculumId, id))
    .orderBy(curriculumDays.dayOfWeek)

  // Fetch content for each day
  const daysWithContent = await Promise.all(
    days.map(async (day) => {
      const content = await db
        .select({
          id:           curriculumContent.id,
          orderIndex:   curriculumContent.orderIndex,
          contentItem:  contentItems,
        })
        .from(curriculumContent)
        .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
        .where(eq(curriculumContent.curriculumDayId, day.id))
        .orderBy(curriculumContent.orderIndex)

      return { ...day, content }
    })
  )

  return apiOk({ ...week, days: daysWithContent })
}

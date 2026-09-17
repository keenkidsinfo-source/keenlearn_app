/**
 * Given any curriculumDay ID, returns all subject→dayId mappings for that curriculum week.
 * Used to populate the StudentSidebar with correct links.
 */
import { db } from '@/lib/db'
import { curriculumDays } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { Subject } from '@/lib/db/schema'

export interface WeekNav {
  build: string | null
  coding: string | null
  public_speaking: string | null
  science: string | null
  math: string | null
  arts: string | null
  weekNumber: number | null
}

/**
 * Get nav from classroomId.
 * Pass `overrideWeek` (number) to force a specific week — teachers use this for preview.
 * Students always pass undefined/null so they always get the date-based week.
 */
export async function getWeekNavFromClassroom(classroomId: string, overrideWeek?: number | null): Promise<WeekNav> {
  const { db: _db } = await import('@/lib/db')
  const { classroomCurriculum, curriculumDays: cdTable, curriculum: curriculumTable } = await import('@/lib/db/schema')
  const { eq: _eq, and: _and, lte: _lte, desc: _desc } = await import('drizzle-orm')

  const empty: WeekNav = { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null, weekNumber: null }

  let ccRow: { curriculumId: string } | undefined

  if (overrideWeek != null) {
    // Teacher preview: find the pinned week's curriculum directly
    const [pinned] = await _db.select({ curriculumId: classroomCurriculum.curriculumId })
      .from(classroomCurriculum)
      .innerJoin(curriculumTable, _eq(curriculumTable.id, classroomCurriculum.curriculumId))
      .where(_and(
        _eq(classroomCurriculum.classroomId, classroomId),
        _eq(curriculumTable.weekNumber, overrideWeek),
      ) as any)
      .limit(1)
    ccRow = pinned
  } else {
    // Date-based logic (students always take this path): most recent week whose start date ≤ today
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
    const [dated] = await _db.select({ curriculumId: classroomCurriculum.curriculumId })
      .from(classroomCurriculum)
      .where(_and(
        _eq(classroomCurriculum.classroomId, classroomId),
        _lte(classroomCurriculum.weekStartDate, todayStr),
      ) as any)
      .orderBy(_desc(classroomCurriculum.weekStartDate))
      .limit(1)
    ccRow = dated
  }

  if (!ccRow) return empty

  const [currRow] = await _db.select({ weekNumber: curriculumTable.weekNumber })
    .from(curriculumTable).where(_eq(curriculumTable.id, ccRow.curriculumId)).limit(1)
  const weekNumber = currRow?.weekNumber ?? null

  const days = await _db.select({ id: cdTable.id, subject: cdTable.subject })
    .from(cdTable).where(_eq(cdTable.curriculumId, ccRow.curriculumId))

  const map: WeekNav = { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null, weekNumber }
  for (const d of days) { if (d.subject in map) (map as any)[d.subject] = d.id }
  return map
}

export async function getWeekNav(dayId: string): Promise<WeekNav> {
  // Look up the curriculumId for this day
  const [thisDay] = await db.select({ curriculumId: curriculumDays.curriculumId })
    .from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!thisDay) return { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null, weekNumber: null }

  // Fetch all days in this curriculum
  const days = await db.select({ id: curriculumDays.id, subject: curriculumDays.subject })
    .from(curriculumDays).where(eq(curriculumDays.curriculumId, thisDay.curriculumId))

  const map: WeekNav = { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null, weekNumber: null }
  for (const d of days) {
    const s = d.subject as Subject
    if (s in map) (map as any)[s] = d.id
  }
  return map
}

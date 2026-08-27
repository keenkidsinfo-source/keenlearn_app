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
}

/** Get nav from any day's classroomId + current Monday (for pages with no dayId like /science/lab) */
export async function getWeekNavFromClassroom(classroomId: string): Promise<WeekNav> {
  const { db: _db } = await import('@/lib/db')
  const { classroomCurriculum, curriculumDays: cdTable } = await import('@/lib/db/schema')
  const { eq: _eq } = await import('drizzle-orm')

  const today = new Date()
  const diff = today.getDay() === 0 ? -6 : 1 - today.getDay()
  const mon = new Date(today); mon.setDate(today.getDate() + diff)
  const pad = (n: number) => String(n).padStart(2, '0')
  const mondayStr = `${mon.getFullYear()}-${pad(mon.getMonth() + 1)}-${pad(mon.getDate())}`

  const [ccRow] = await _db.select({ curriculumId: classroomCurriculum.curriculumId })
    .from(classroomCurriculum)
    .where(_eq(classroomCurriculum.classroomId, classroomId) as any)
    // pick the row matching current week
    .limit(1)

  if (!ccRow) return { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null }

  const days = await _db.select({ id: cdTable.id, subject: cdTable.subject })
    .from(cdTable).where(_eq(cdTable.curriculumId, ccRow.curriculumId))

  const map: WeekNav = { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null }
  for (const d of days) { if (d.subject in map) (map as any)[d.subject] = d.id }
  return map
}

export async function getWeekNav(dayId: string): Promise<WeekNav> {
  // Look up the curriculumId for this day
  const [thisDay] = await db.select({ curriculumId: curriculumDays.curriculumId })
    .from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!thisDay) return { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null }

  // Fetch all days in this curriculum
  const days = await db.select({ id: curriculumDays.id, subject: curriculumDays.subject })
    .from(curriculumDays).where(eq(curriculumDays.curriculumId, thisDay.curriculumId))

  const map: WeekNav = { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null }
  for (const d of days) {
    const s = d.subject as Subject
    if (s in map) (map as any)[s] = d.id
  }
  return map
}

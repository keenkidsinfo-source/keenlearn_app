export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { getCurrentLab, getLabByWeek } from '@/lib/scienceLabs'
import { ScienceLabClient } from './ScienceLabClient'
import { StudentSidebar } from '@/app/dashboard/StudentSidebar'
import { getWeekNavFromClassroom } from '@/lib/student-week-nav'
import { db } from '@/lib/db'
import { classroomCurriculum, curriculumDays, curriculumContent } from '@/lib/db/schema'
import { eq, and, lte, desc } from 'drizzle-orm'

function getTodayStr(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default async function ScienceLabPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  // Sidebar nav (uses lte+desc — correct week links)
  const nav = session.classroomId
    ? await getWeekNavFromClassroom(session.classroomId)
    : { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null, weekNumber: null }

  // Lab content: prefer date-based (always accurate for current Mon–Fri week)
  // Fall back to DB week number only if no date-matched lab exists (e.g. holiday week)
  const lab = getCurrentLab() ?? (nav.weekNumber != null ? getLabByWeek(nav.weekNumber) : null)
  if (!lab) redirect('/dashboard')

  // Content item lookup: use lte+desc same as dashboard — NOT nav.weekNumber which can be stale.
  // This ensures saves always go to the classroom's actual current-week content item.
  let contentItemId: string | null = null
  if (session.classroomId) {
    try {
      const todayStr = getTodayStr()

      // Most recent classroom week whose start ≤ today
      const [cc] = await db
        .select({ curriculumId: classroomCurriculum.curriculumId })
        .from(classroomCurriculum)
        .where(and(
          eq(classroomCurriculum.classroomId, session.classroomId),
          lte(classroomCurriculum.weekStartDate, todayStr),
        ))
        .orderBy(desc(classroomCurriculum.weekStartDate))
        .limit(1)

      if (cc) {
        const [day] = await db
          .select({ id: curriculumDays.id })
          .from(curriculumDays)
          .where(and(
            eq(curriculumDays.curriculumId, cc.curriculumId),
            eq(curriculumDays.subject, 'science'),
          ))
          .limit(1)

        if (day) {
          const [content] = await db
            .select({ contentItemId: curriculumContent.contentItemId })
            .from(curriculumContent)
            .where(eq(curriculumContent.curriculumDayId, day.id))
            .limit(1)
          contentItemId = content?.contentItemId ?? null
        }
      }
    } catch { /* non-fatal — lab still works, observations just won't persist */ }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar nav={nav} gradeBand={(session.gradeBand as 'g1-2' | 'g3-4') ?? null} name={session.name} />
      <div className="flex-1 overflow-y-auto">
        <ScienceLabClient lab={lab} contentItemId={contentItemId} gradeBand={(session.gradeBand as 'g1-2' | 'g3-4') ?? null} />
      </div>
    </div>
  )
}

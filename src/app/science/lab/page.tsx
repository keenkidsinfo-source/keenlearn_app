export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { getCurrentLab, getLabByWeek } from '@/lib/scienceLabs'
import { ScienceLabClient } from './ScienceLabClient'
import { StudentSidebar } from '@/app/dashboard/StudentSidebar'
import { getWeekNavFromClassroom } from '@/lib/student-week-nav'
import { db } from '@/lib/db'
import { classroomCurriculum, curriculum, curriculumDays, curriculumContent } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export default async function ScienceLabPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  // Prefer week-number-based lookup (matches classroom DB assignment)
  // Fall back to calendar date if no classroom or week not found
  const nav = session.classroomId
    ? await getWeekNavFromClassroom(session.classroomId)
    : { build: null, coding: null, public_speaking: null, science: null, math: null, arts: null, weekNumber: null }

  const lab = (nav.weekNumber != null ? getLabByWeek(nav.weekNumber) : null) ?? getCurrentLab()
  if (!lab) redirect('/dashboard')

  // Look up the real content item ID so student observations are saved to the DB
  // (not just localStorage) and show up in the weekly parent report.
  let contentItemId: string | null = null
  if (session.classroomId && nav.weekNumber != null) {
    try {
      const [cc] = await db
        .select({ curriculumId: classroomCurriculum.curriculumId })
        .from(classroomCurriculum)
        .innerJoin(curriculum, eq(curriculum.id, classroomCurriculum.curriculumId))
        .where(and(
          eq(classroomCurriculum.classroomId, session.classroomId),
          eq(curriculum.weekNumber, nav.weekNumber),
        ))
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
    } catch { /* non-fatal — lab still works, just won't persist to DB */ }
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

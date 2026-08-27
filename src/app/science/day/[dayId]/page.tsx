import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculum, curriculumContent, classrooms } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { scienceLabs } from '@/lib/scienceLabs'
import { ScienceLabClient } from '@/app/science/lab/ScienceLabClient'
import { StudentSidebar } from '@/app/dashboard/StudentSidebar'
import { getWeekNav } from '@/lib/student-week-nav'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ dayId: string }> }

export default async function ScienceDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'science') notFound()

  // Find the week number for this curriculum day so we pick the right lab
  const [curriculumRow] = await db
    .select({ weekNumber: curriculum.weekNumber })
    .from(curriculum)
    .where(eq(curriculum.id, day.curriculumId))
    .limit(1)

  // Content item ID — used to persist observations in student_sessions.session_data
  const [contentRow] = await db
    .select({ contentItemId: curriculumContent.contentItemId })
    .from(curriculumContent)
    .where(eq(curriculumContent.curriculumDayId, dayId))
    .limit(1)

  // Week 1 → lab index 0 (fire extinguisher), Week 2 → lab index 1 (spinning pen)
  const weekNumber = curriculumRow?.weekNumber ?? 1
  const lab = scienceLabs[weekNumber - 1] ?? scienceLabs[0]

  if (!lab) redirect('/dashboard')

  const nav = await getWeekNav(dayId)
  const [classroom] = session.classroomId
    ? await db.select({ gradeBand: classrooms.gradeBand }).from(classrooms).where(eq(classrooms.id, session.classroomId)).limit(1)
    : [undefined]

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar nav={nav} gradeBand={(classroom?.gradeBand as 'g1-2' | 'g3-4') ?? null} name={session.name} />
      <div className="flex-1 overflow-y-auto">
        <ScienceLabClient
          lab={lab}
          contentItemId={contentRow?.contentItemId ?? null}
        />
      </div>
    </div>
  )
}

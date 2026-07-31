export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  users, classrooms, curriculumDays, curriculumContent, contentItems,
  classroomCurriculum,
} from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { getMondayStr } from '@/lib/teacher-dashboard'
import { ChartClient } from './ChartClient'
import type { GradeBand } from '@/lib/db/schema'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildChartPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

  // Load the curriculum day
  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') notFound()

  // Load content item for grade band + title
  const [row] = await db
    .select({ item: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .limit(1)

  if (!row) notFound()

  const item = row.item
  const gradeBand = (item.gradeBand ?? 'g1-2') as GradeBand

  // Load the classroom that matches this content item's grade band.
  // A teacher may have classrooms for multiple grade bands; we pick the one
  // whose grade_band matches the build content so we get the right students.
  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(and(
      eq(classrooms.teacherId, session.sub),
      eq(classrooms.gradeBand, gradeBand),
    ))
    .limit(1)

  if (!classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No classroom found for this teacher.</p>
      </div>
    )
  }

  // Load students
  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName })
    .from(users)
    .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))
    .orderBy(users.name)

  // Determine week start date from the curriculum assignment
  const mondayStr = getMondayStr()
  const [weekRow] = await db
    .select({ weekStartDate: classroomCurriculum.weekStartDate })
    .from(classroomCurriculum)
    .where(and(
      eq(classroomCurriculum.classroomId, classroom.id),
      eq(classroomCurriculum.curriculumId, day.curriculumId),
    ))
    .limit(1)

  const weekStartDate = weekRow?.weekStartDate ?? mondayStr

  return (
    <ChartClient
      students={students}
      gradeBand={gradeBand}
      buildTitle={item.title}
      buildDayId={dayId}
      weekStartDate={weekStartDate}
    />
  )
}

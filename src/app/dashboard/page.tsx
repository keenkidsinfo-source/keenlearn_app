import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'

// Always render fresh — never serve a cached/stale week view from Vercel's edge
export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import {
  classrooms, classroomCurriculum, curriculum,
  curriculumDays, curriculumContent, schoolSchedule, schools, users,
} from '@/lib/db/schema'
import { eq, and, desc, lte } from 'drizzle-orm'
import Link from 'next/link'
import type { Subject } from '@/lib/db/schema'
import { WeekDays } from './WeekDays'
import { StudentSidebar } from './StudentSidebar'

import type { WeekNav } from '@/lib/student-week-nav'

function getTodayStr(): string {
  const today = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'student') redirect('/teacher')

  const { week } = await searchParams
  // Accept ?week=YYYY-MM-DD so students can browse past weeks
  const todayStr = getTodayStr()
  // For ?week= navigation use that date; otherwise use today for lte comparison
  const weekOverride = (week && /^\d{4}-\d{2}-\d{2}$/.test(week)) ? week : null

  // Load student's school name
  const [student] = await db
    .select({ schoolId: users.schoolId })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1)

  const [school] = student?.schoolId
    ? await db.select().from(schools).where(eq(schools.id, student.schoolId)).limit(1)
    : [undefined]

  // Load classroom → school
  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.id, session.classroomId!))
    .limit(1)

  // Load school's day schedule (day_of_week → subject)
  const scheduleRows = classroom?.schoolId
    ? await db
        .select()
        .from(schoolSchedule)
        .where(eq(schoolSchedule.schoolId, classroom.schoolId))
        .orderBy(schoolSchedule.dayOfWeek)
    : []

  const dayToSubject = new Map(scheduleRows.map(r => [r.dayOfWeek, r.subject as Subject]))

  // Find assigned curriculum: most recent week whose start date ≤ today
  // (lte + desc avoids timezone-sensitive exact-match issues)
  const compareDateStr = weekOverride ?? todayStr
  const [assigned] = await db
    .select({
      curriculumId:  classroomCurriculum.curriculumId,
      weekTitle:     curriculum.title,
      theme:         curriculum.theme,
      weekStartDate: classroomCurriculum.weekStartDate,
    })
    .from(classroomCurriculum)
    .innerJoin(curriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
    .where(and(
      eq(classroomCurriculum.classroomId, session.classroomId!),
      lte(classroomCurriculum.weekStartDate, compareDateStr),
    ))
    .orderBy(desc(classroomCurriculum.weekStartDate))
    .limit(1)

  // Load curriculum days keyed by subject
  const currDays = assigned
    ? await db
        .select()
        .from(curriculumDays)
        .where(eq(curriculumDays.curriculumId, assigned.curriculumId))
    : []

  const subjectToDay = new Map(currDays.map(d => [d.subject, d]))

  // DEBUG: log what we found so we can check Vercel function logs
  console.log('[dashboard] week param:', weekOverride, '| assigned curriculumId:', assigned?.curriculumId, '| weekStartDate:', assigned?.weekStartDate)
  console.log('[dashboard] currDays subjects:', currDays.map(d => d.subject))
  console.log('[dashboard] dayToSubject entries:', [...dayToSubject.entries()])

  // Build week view: 5 days using school schedule
  // Note: today-detection moved to WeekDays client component to use browser's local clock
  const weekDays = [1, 2, 3, 4, 5].map(dow => {
    const subject = dayToSubject.get(dow) ?? null
    const currDay = subject ? subjectToDay.get(subject) : undefined
    return { dow, subject, dayId: currDay?.id ?? null, theme: currDay?.theme ?? null }
  })

  // G1-2 students don't self-enter results — teacher handles their data via the chart page
  const canEnterResults = classroom?.gradeBand !== 'g1-2'

  // Find the most recent build day that has already started (weekStartDate <= today's Monday)
  // Don't surface future build weeks before they begin
  const nearestBuildRows = canEnterResults && classroom
    ? await db
        .select({ dayId: curriculumDays.id })
        .from(curriculumDays)
        .innerJoin(curriculumContent, eq(curriculumContent.curriculumDayId, curriculumDays.id))
        .innerJoin(classroomCurriculum, eq(classroomCurriculum.curriculumId, curriculumDays.curriculumId))
        .where(and(
          eq(classroomCurriculum.classroomId, classroom.id),
          eq(curriculumDays.subject, 'build'),
          lte(classroomCurriculum.weekStartDate, todayStr),
        ))
        .orderBy(desc(classroomCurriculum.weekStartDate))
        .limit(1)
    : []
  const nearestBuildDayId = nearestBuildRows[0]?.dayId ?? null

  const nav: WeekNav = {
    build:           subjectToDay.get('build')?.id           ?? null,
    coding:          subjectToDay.get('coding')?.id          ?? null,
    public_speaking: subjectToDay.get('public_speaking')?.id ?? null,
    science:         subjectToDay.get('science')?.id         ?? null,
    math:            subjectToDay.get('math')?.id            ?? null,
    arts:            subjectToDay.get('arts')?.id            ?? null,
    weekNumber:      null,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <StudentSidebar nav={nav} gradeBand={(classroom?.gradeBand as 'g1-2' | 'g3-4') ?? null} name={session.name} />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-keen-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black">
                {school?.name ?? 'KeenKids'}
              </h1>
              <p className="text-keen-200 text-sm mt-0.5">
                {assigned?.weekTitle ?? 'This week'}
              </p>
            </div>
            <Link href="/achievements" className="text-3xl" aria-label="My achievements">🏆</Link>
          </div>
        </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <WeekDays weekDays={weekDays} weekStart={assigned?.weekStartDate ?? todayStr} hasContent={!!assigned || !!nearestBuildDayId} canEnterResults={canEnterResults} />

        {/* Build Day card — only shown when the build day isn't already visible as a tile in the current week */}
        {nearestBuildDayId && !weekDays.some(d => d.subject === 'build' && d.dayId) && (
          <Link
            href={`/build/day/${nearestBuildDayId}/results`}
            className="flex items-center gap-4 bg-teal-600 hover:bg-teal-500 text-white rounded-3xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <span className="text-5xl">📊</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-teal-200 uppercase tracking-wide mb-0.5">🏗️ Build Day</p>
              <h3 className="text-lg font-black">Enter My Results</h3>
              <p className="text-teal-200 text-sm">Submit your numbers to the class chart</p>
            </div>
            <span className="text-2xl shrink-0">→</span>
          </Link>
        )}

      </main>
      </div>
    </div>
  )
}

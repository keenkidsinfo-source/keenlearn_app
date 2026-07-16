import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'

// Always render fresh — never serve a cached/stale week view from Vercel's edge
export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import {
  classrooms, classroomCurriculum, curriculum,
  curriculumDays, schoolSchedule, schools, users,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import type { Subject } from '@/lib/db/schema'
import { WeekDays } from './WeekDays'
import { getLabForDashboard } from '@/lib/scienceLabs'

function getMondayStr(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
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
  const mondayStr = (week && /^\d{4}-\d{2}-\d{2}$/.test(week)) ? week : getMondayStr()

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

  // Find assigned curriculum for this week
  const [assigned] = await db
    .select({
      curriculumId: classroomCurriculum.curriculumId,
      weekTitle:    curriculum.title,
      theme:        curriculum.theme,
    })
    .from(classroomCurriculum)
    .innerJoin(curriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
    .where(and(
      eq(classroomCurriculum.classroomId, session.classroomId!),
      eq(classroomCurriculum.weekStartDate, mondayStr),
    ))
    .limit(1)

  // Load curriculum days keyed by subject
  const currDays = assigned
    ? await db
        .select()
        .from(curriculumDays)
        .where(eq(curriculumDays.curriculumId, assigned.curriculumId))
    : []

  const subjectToDay = new Map(currDays.map(d => [d.subject, d]))

  // Build week view: 5 days using school schedule
  // Note: today-detection moved to WeekDays client component to use browser's local clock
  const weekDays = [1, 2, 3, 4, 5].map(dow => {
    const subject = dayToSubject.get(dow) ?? null
    const currDay = subject ? subjectToDay.get(subject) : undefined
    return { dow, subject, dayId: currDay?.id ?? null, theme: currDay?.theme ?? null }
  })

  const labToShow = getLabForDashboard()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-keen-600 text-white px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center bg-keen-500 text-white text-xs font-black px-2 py-0.5 rounded-lg tracking-wide">KK·LEARN</span>
              <h1 className="text-xl font-black">KeenKids</h1>
            </div>
            <p className="text-keen-200 text-sm mt-0.5">
              {school?.name ?? ''}{assigned?.weekTitle ? ` · ${assigned.weekTitle}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/achievements" className="text-3xl" aria-label="My achievements">🏆</Link>
            <form action="/api/v1/auth/logout" method="POST">
              <button type="submit" className="text-keen-200 hover:text-white text-sm font-semibold">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <WeekDays weekDays={weekDays} weekStart={mondayStr} hasContent={!!assigned} />

        {/* Science Lab card — shown when a lab is current or upcoming */}
        {labToShow && (
          <Link href="/science/lab" className="block">
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-3xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all active:scale-95">
              <span className="text-5xl">{labToShow.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-teal-200 uppercase tracking-wide mb-0.5">🔬 Science Lab</p>
                <h3 className="text-lg font-black truncate">{labToShow.title}</h3>
                <p className="text-teal-200 text-sm truncate">{labToShow.conceptShort}</p>
              </div>
              <span className="text-2xl shrink-0">→</span>
            </div>
          </Link>
        )}
      </main>
    </div>
  )
}

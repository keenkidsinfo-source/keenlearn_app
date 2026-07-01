import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  classrooms, classroomCurriculum, curriculum,
  curriculumDays, schoolSchedule, schools, users,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { SUBJECT_COLORS, SUBJECT_EMOJI, SUBJECT_LABEL, DAY_LABELS } from '@/lib/utils'
import type { Subject } from '@/lib/db/schema'
import Link from 'next/link'

function getMondayStr(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  // Use local date components to avoid UTC-offset shifting the date
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'student') redirect('/teacher')

  const mondayStr = getMondayStr()

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

  const todayDow = new Date().getDay()
  const todayIndex = todayDow === 0 ? 5 : todayDow // clamp Sunday → show Friday

  // Build week view: 5 days using school schedule
  const weekDays = [1, 2, 3, 4, 5].map(dow => {
    const subject = dayToSubject.get(dow)
    const currDay = subject ? subjectToDay.get(subject) : undefined
    return { dow, subject, currDay }
  })

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

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!assigned ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-600">No activities this week yet</h2>
            <p className="text-gray-400 mt-2">Your teacher will assign this week&apos;s plan soon!</p>
          </div>
        ) : (
          <>
            {/* Today's highlight */}
            {weekDays.filter(d => d.dow === todayIndex && d.subject).map(({ dow, subject, currDay }) => {
              const colors = SUBJECT_COLORS[subject!]
              return (
                <div key={dow} className={`${colors.light} border-2 ${colors.border} rounded-3xl p-6 mb-6`}>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Today</p>
                  <Link href={currDay ? `/${subject}/day/${currDay.id}` : '#'} className="block">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{SUBJECT_EMOJI[subject!]}</span>
                      <div>
                        <h2 className={`text-2xl font-black ${colors.text}`}>{SUBJECT_LABEL[subject!]}</h2>
                        {currDay?.theme && <p className="text-gray-600 mt-0.5">{currDay.theme}</p>}
                      </div>
                    </div>
                    <div className={`mt-4 btn-subject ${colors.bg} text-white w-full text-center`}>
                      Let&apos;s go! →
                    </div>
                  </Link>
                </div>
              )
            })}

            {/* Week view */}
            <h2 className="text-lg font-bold text-gray-700 mb-3">This Week</h2>
            <div className="flex flex-col gap-3">
              {weekDays.map(({ dow, subject, currDay }) => {
                if (!subject) return null
                const colors  = SUBJECT_COLORS[subject]
                const isToday = dow === todayIndex
                const isPast  = dow < todayIndex
                return (
                  <Link
                    key={dow}
                    href={currDay ? `/${subject}/day/${currDay.id}` : '#'}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                      ${isToday ? `${colors.light} ${colors.border} shadow-md` : 'bg-white border-gray-100 hover:border-gray-300'}
                      ${isPast ? 'opacity-60' : ''}`}
                  >
                    <span className="text-3xl w-10 text-center">{SUBJECT_EMOJI[subject]}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-700">{DAY_LABELS[dow]}</p>
                      <p className={`font-semibold ${colors.text}`}>{SUBJECT_LABEL[subject]}</p>
                      {currDay?.theme && <p className="text-sm text-gray-400">{currDay.theme}</p>}
                    </div>
                    {isToday && <span className="text-xs font-bold bg-keen-600 text-white px-2 py-1 rounded-full">TODAY</span>}
                    {isPast && <span className="text-xl">✅</span>}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

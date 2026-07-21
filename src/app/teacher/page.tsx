import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  users, classrooms, schools, studentSessions,
  classroomCurriculum, curriculum, curriculumDays, curriculumContent, contentItems,
} from '@/lib/db/schema'
import { eq, and, isNull, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { SUBJECT_EMOJI, SUBJECT_LABEL } from '@/lib/utils'
import type { Subject } from '@/lib/db/schema'
import { StudentManager } from './StudentManager'
import { SendReportButton } from './SendReportButton'

function getMondayStr(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
}

const AVATARS = ['🦊','🐼','🦁','🐸','🦋','🐬','🦄','🐉']

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatWeekLabel(mondayStr: string): string {
  const d = new Date(mondayStr + 'T12:00:00')
  const friday = new Date(d)
  friday.setDate(d.getDate() + 4)
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = friday.toLocaleDateString('en-US', { month: 'short' })
  if (month === endMonth) return `${month} ${d.getDate()}–${friday.getDate()}`
  return `${month} ${d.getDate()} – ${endMonth} ${friday.getDate()}`
}

export default async function TeacherDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; classroomId?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const { week, classroomId: qClassroomId } = await searchParams
  const currentMonday = getMondayStr()
  const mondayStr = (week && /^\d{4}-\d{2}-\d{2}$/.test(week)) ? week : currentMonday
  const isCurrentWeek = mondayStr === currentMonday
  const prevWeek = addDays(mondayStr, -7)
  const nextWeek = addDays(mondayStr, 7)

  // Admins can pick any classroom via ?classroomId=; teachers use their own
  const isAdmin = session.role === 'admin'

  // For admin: load all classrooms with school names for the picker
  const allClassrooms = isAdmin
    ? await db.select({
        id:         classrooms.id,
        name:       classrooms.name,
        gradeLevel: classrooms.gradeLevel,
        schoolName: schools.name,
      })
        .from(classrooms)
        .leftJoin(schools, eq(classrooms.schoolId, schools.id))
        .orderBy(schools.name, classrooms.gradeLevel)
    : []

  // Load classroom
  const [classroom] = isAdmin && qClassroomId
    ? await db.select().from(classrooms).where(eq(classrooms.id, qClassroomId)).limit(1)
    : await db.select().from(classrooms).where(eq(classrooms.teacherId, session.sub)).limit(1)

  const [school] = classroom?.schoolId
    ? await db.select().from(schools).where(eq(schools.id, classroom.schoolId)).limit(1)
    : [undefined]

  // Load students (non-deleted)
  const students = classroom
    ? await db
        .select({ id: users.id, name: users.name, displayName: users.displayName, avatarId: users.avatarId, lastActiveAt: users.lastActiveAt })
        .from(users)
        .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))
        .orderBy(users.name)
    : []

  // Load this week's curriculum assignment
  const [thisWeek] = classroom
    ? await db
        .select({ weekTitle: curriculum.title, theme: curriculum.theme, curriculumId: classroomCurriculum.curriculumId })
        .from(classroomCurriculum)
        .innerJoin(curriculum, eq(classroomCurriculum.curriculumId, curriculum.id))
        .where(and(
          eq(classroomCurriculum.classroomId, classroom.id),
          eq(classroomCurriculum.weekStartDate, mondayStr),
        ))
        .limit(1)
    : [undefined]

  // Build per-subject per-student progress for this week
  type SubjectProgress = { subject: Subject; dayId: string; contentItemId: string }
  let weekSubjects: SubjectProgress[] = []
  // sessionMap: studentId → Set of completed contentItemIds
  const sessionMap = new Map<string, Set<string>>()
  // inProgressMap: studentId → Set of started (not completed) contentItemIds
  const inProgressMap = new Map<string, Set<string>>()

  if (thisWeek && students.length > 0) {
    // Get all curriculum days + content items for this week
    const dayItems = await db
      .select({
        subject:       curriculumDays.subject,
        dayId:         curriculumDays.id,
        contentItemId: curriculumContent.contentItemId,
      })
      .from(curriculumDays)
      .innerJoin(curriculumContent, eq(curriculumContent.curriculumDayId, curriculumDays.id))
      .where(eq(curriculumDays.curriculumId, thisWeek.curriculumId))

    weekSubjects = dayItems as SubjectProgress[]

    if (weekSubjects.length > 0) {
      const contentItemIds = weekSubjects.map(d => d.contentItemId)
      const studentIds     = students.map(s => s.id)

      const sessions = await db
        .select({
          studentId:     studentSessions.studentId,
          contentItemId: studentSessions.contentItemId,
          completed:     studentSessions.completed,
        })
        .from(studentSessions)
        .where(and(
          inArray(studentSessions.studentId, studentIds),
          inArray(studentSessions.contentItemId, contentItemIds),
        ))

      for (const s of sessions) {
        if (s.completed) {
          if (!sessionMap.has(s.studentId)) sessionMap.set(s.studentId, new Set())
          sessionMap.get(s.studentId)!.add(s.contentItemId)
        } else {
          if (!inProgressMap.has(s.studentId)) inProgressMap.set(s.studentId, new Set())
          inProgressMap.get(s.studentId)!.add(s.contentItemId)
        }
      }
    }
  }

  const totalThisWeek   = weekSubjects.length
  const speakingDay     = weekSubjects.find(ws => ws.subject === 'public_speaking')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-keen-700 text-white px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">
              {isAdmin ? '🛡️ Admin · Teacher View' : 'KeenKids Teacher'}
            </h1>
            <p className="text-keen-200 text-sm mt-0.5">
              {school?.name ?? ''}{classroom ? ` · ${classroom.name}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin" className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                ← Admin
              </Link>
            )}
            <Link href="/teacher/curriculum" className="bg-keen-600 hover:bg-keen-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
              📚 Curriculum
            </Link>
            <Link href="/account/password" className="text-keen-200 hover:text-white text-sm font-semibold">
              🔑 Password
            </Link>
            <form action="/api/v1/auth/logout" method="POST">
              <button type="submit" className="text-keen-200 hover:text-white text-sm font-semibold">Sign out</button>
            </form>
          </div>
        </div>

      </header>

      {/* Admin classroom picker — prominent banner */}
      {isAdmin && (
        <div className="bg-yellow-50 border-b-2 border-yellow-200 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-yellow-800 text-xs font-bold uppercase tracking-wide mb-2">🛡️ Admin — Select a classroom to view</p>
            <form method="GET" action="/teacher" className="flex items-center gap-3">
              <select
                name="classroomId"
                defaultValue={qClassroomId ?? ''}
                className="flex-1 bg-white border-2 border-yellow-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-yellow-500"
              >
                <option value="">— Pick a classroom —</option>
                {allClassrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.schoolName ? `${c.schoolName} — ` : ''}{c.name} (Grade {c.gradeLevel})
                  </option>
                ))}
              </select>
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black px-6 py-2.5 rounded-xl text-sm transition-all active:scale-95">
                Load →
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* ── Access Code ── */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-keen-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-keen-600 uppercase tracking-widest mb-1">Class Access Code</p>
            <p className="text-5xl font-black text-keen-800 tracking-[0.2em]">{classroom?.accessCode ?? '—'}</p>
            <p className="text-xs text-gray-400 mt-1">Students enter this code on the login screen</p>
          </div>
          <div className="text-5xl">🔑</div>
        </div>

        {/* ── This Week ── */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link
                href={`/teacher?week=${prevWeek}${qClassroomId ? `&classroomId=${qClassroomId}` : ''}`}
                className="text-gray-400 hover:text-keen-600 font-bold text-lg px-1"
              >←</Link>
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-none">
                  {isCurrentWeek ? 'This Week' : 'Week of'}
                </h2>
                <p className="text-xs text-gray-400">{formatWeekLabel(mondayStr)}</p>
              </div>
              <Link
                href={isCurrentWeek ? '#' : `/teacher?week=${nextWeek}${qClassroomId ? `&classroomId=${qClassroomId}` : ''}`}
                className={`font-bold text-lg px-1 ${isCurrentWeek ? 'text-gray-200 pointer-events-none' : 'text-gray-400 hover:text-keen-600'}`}
              >→</Link>
            </div>
            <Link href="/teacher/curriculum" className="text-keen-600 font-semibold text-sm hover:underline">
              {thisWeek ? 'Change →' : 'Assign →'}
            </Link>
          </div>
          {thisWeek ? (
            <div className="bg-keen-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📅</span>
                <div>
                  <p className="font-black text-gray-800">{thisWeek.weekTitle}</p>
                  {thisWeek.theme && <p className="text-sm text-gray-500">{thisWeek.theme}</p>}
                </div>
              </div>
              {weekSubjects.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {weekSubjects.map(ws => (
                    <span key={ws.contentItemId} className="text-xs bg-white border border-keen-200 text-keen-700 font-bold px-2 py-1 rounded-lg">
                      {SUBJECT_EMOJI[ws.subject as Subject]} {SUBJECT_LABEL[ws.subject as Subject]}
                    </span>
                  ))}
                </div>
              )}
              {speakingDay && (
                <Link
                  href={`/teacher/speaking/${speakingDay.dayId}`}
                  className="mt-3 flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  🎤 Run Speaking Class
                </Link>
              )}
              <Link
                href="/teacher/science"
                className="mt-2 flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                🔬 Science Lab Manual
              </Link>
              <SendReportButton
                weekStartDate={mondayStr}
                weekTitle={thisWeek.weekTitle}
                studentCount={students.length}
              />
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="mb-2">No curriculum assigned for this week yet.</p>
              <Link href="/teacher/curriculum" className="text-keen-600 font-bold hover:underline">Assign now →</Link>
            </div>
          )}
        </div>

        {/* ── Student Progress ── */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            This Week&apos;s Progress
            {totalThisWeek > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({totalThisWeek} {totalThisWeek === 1 ? 'activity' : 'activities'})</span>
            )}
          </h2>

          {students.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">No students yet.</p>
          ) : !thisWeek ? (
            <p className="text-gray-400 text-center py-4 text-sm">Assign a curriculum week to see progress.</p>
          ) : (
            <>
              {/* Class summary strip */}
              {totalThisWeek > 0 && (() => {
                const allDone      = students.filter(s => (sessionMap.get(s.id)?.size ?? 0) >= totalThisWeek).length
                const inProgress   = students.filter(s => {
                  const done = sessionMap.get(s.id)?.size ?? 0
                  const started = (inProgressMap.get(s.id)?.size ?? 0) + done
                  return started > 0 && done < totalThisWeek
                }).length
                const notStarted   = students.length - allDone - inProgress
                const classPct     = students.length > 0
                  ? Math.round((students.reduce((sum, s) => sum + (sessionMap.get(s.id)?.size ?? 0), 0) / (students.length * totalThisWeek)) * 100)
                  : 0

                return (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Class completion</span>
                        <span className="text-sm font-black text-keen-700">{classPct}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2.5 bg-keen-500 rounded-full transition-all"
                          style={{ width: `${classPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs shrink-0">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        <span className="font-bold text-green-700">{allDone}</span>
                        <span className="text-gray-400">done</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                        <span className="font-bold text-yellow-700">{inProgress}</span>
                        <span className="text-gray-400">going</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                        <span className="font-bold text-gray-500">{notStarted}</span>
                        <span className="text-gray-400">not yet</span>
                      </span>
                    </div>
                  </div>
                )
              })()}

              {/* Subject header row */}
              {weekSubjects.length > 0 && (
                <div className="flex items-center gap-2 mb-2 pl-[52px]">
                  {weekSubjects.map(ws => (
                    <div key={ws.contentItemId} className="w-9 text-center" title={SUBJECT_LABEL[ws.subject as Subject]}>
                      <span className="text-xl">{SUBJECT_EMOJI[ws.subject as Subject]}</span>
                    </div>
                  ))}
                  <div className="ml-auto text-xs text-gray-400 font-semibold pr-1">Done</div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {students.map(student => {
                  const completedIds   = sessionMap.get(student.id) ?? new Set<string>()
                  const inProgressIds  = inProgressMap.get(student.id) ?? new Set<string>()
                  const doneCount      = completedIds.size
                  const pct            = totalThisWeek > 0 ? Math.round((doneCount / totalThisWeek) * 100) : 0
                  const neverLoggedIn  = !student.lastActiveAt
                  const isAllDone      = doneCount >= totalThisWeek && totalThisWeek > 0

                  const daysAgo = student.lastActiveAt
                    ? Math.floor((Date.now() - new Date(student.lastActiveAt).getTime()) / 86400000)
                    : null

                  return (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                        ${isAllDone ? 'bg-green-50 border border-green-100' :
                          neverLoggedIn ? 'bg-red-50 border border-red-100' :
                          'bg-gray-50'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0
                        ${isAllDone ? 'bg-green-100' : neverLoggedIn ? 'bg-red-100' : 'bg-keen-100'}`}>
                        {AVATARS[((student.avatarId ?? 1) - 1) % 8]}
                      </div>

                      {/* Name + activity dots */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-800 text-sm truncate">{student.displayName ?? student.name}</p>
                          {isAllDone      && <span className="text-xs text-green-600 font-bold shrink-0">🌟 All done!</span>}
                          {!isAllDone && daysAgo === 0 && <span className="text-xs text-keen-600 font-bold shrink-0">Active today</span>}
                          {!isAllDone && daysAgo === 1 && <span className="text-xs text-gray-400 shrink-0">Yesterday</span>}
                          {!isAllDone && daysAgo !== null && daysAgo > 1 && <span className="text-xs text-orange-500 font-bold shrink-0">{daysAgo}d ago</span>}
                          {neverLoggedIn  && <span className="text-xs text-red-500 font-bold shrink-0">⚠ Never logged in</span>}
                        </div>
                        {weekSubjects.length > 0 ? (
                          <div className="flex items-center gap-2">
                            {weekSubjects.map(ws => {
                              const done  = completedIds.has(ws.contentItemId)
                              const going = inProgressIds.has(ws.contentItemId)
                              return (
                                <div
                                  key={ws.contentItemId}
                                  className="w-9 h-6 rounded-lg flex items-center justify-center text-sm"
                                  title={`${SUBJECT_LABEL[ws.subject as Subject]}: ${done ? 'Done' : going ? 'In Progress' : 'Not started'}`}
                                >
                                  {done ? '✅' : going ? '🟡' : '⬜'}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-keen-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        )}
                      </div>

                      {/* Count */}
                      <div className="text-right flex-shrink-0 w-10">
                        <span className={`text-sm font-black ${isAllDone ? 'text-green-600' : 'text-gray-500'}`}>
                          {doneCount}/{totalThisWeek || '?'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <span>✅ Completed</span>
                <span>🟡 In progress</span>
                <span>⬜ Not started</span>
              </div>
            </>
          )}
        </div>

        {/* ── Manage Students ── */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Students
            <span className="ml-2 text-sm font-normal text-gray-400">({students.length})</span>
          </h2>
          <StudentManager
            initialStudents={students.map(s => ({
              id: s.id,
              name: s.name,
              displayName: s.displayName,
              avatarId: s.avatarId,
            }))}
          />
        </div>

      </main>
    </div>
  )
}

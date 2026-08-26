export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  curriculumDays, curriculum, curriculumContent, contentItems,
  classrooms, users, studentSessions,
} from '@/lib/db/schema'
import { eq, and, inArray, isNull } from 'drizzle-orm'
import Link from 'next/link'
import { SpeakingSession } from './SpeakingSession'
import { getTeacherClassroom } from '@/lib/teacher-classroom'
import { TeacherSidebar } from '../../TeacherSidebar'

interface Props { params: Promise<{ dayId: string }> }

export default async function TeacherSpeakingPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

  // Load the curriculum day
  const [day] = await db
    .select({
      id:           curriculumDays.id,
      subject:      curriculumDays.subject,
      curriculumId: curriculumDays.curriculumId,
    })
    .from(curriculumDays)
    .where(eq(curriculumDays.id, dayId))
    .limit(1)

  if (!day || day.subject !== 'public_speaking') notFound()

  // Load curriculum week info
  const [week] = await db
    .select({ title: curriculum.title, gradeBand: curriculum.gradeBand, weekNumber: curriculum.weekNumber })
    .from(curriculum)
    .where(eq(curriculum.id, day.curriculumId))
    .limit(1)

  // Load the content item for this day
  const items = await db
    .select({ id: contentItems.id, title: contentItems.title, metadata: contentItems.metadata })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .orderBy(curriculumContent.orderIndex)

  if (items.length === 0) notFound()
  const item = items[0]

  // Load teacher's classroom
  const classroom = await getTeacherClassroom(session.sub)
  if (!classroom) redirect('/teacher')

  // Load students
  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName, avatarId: users.avatarId })
    .from(users)
    .where(and(
      eq(users.classroomId, classroom.id),
      eq(users.role, 'student'),
      isNull(users.deletedAt),
    ))
    .orderBy(users.name)

  // Load who has already completed
  const doneRows = students.length > 0
    ? await db
        .select({ studentId: studentSessions.studentId })
        .from(studentSessions)
        .where(and(
          inArray(studentSessions.studentId, students.map(s => s.id)),
          eq(studentSessions.contentItemId, item.id),
          eq(studentSessions.completed, true),
        ))
    : []

  const doneIds = new Set(doneRows.map(r => r.studentId))

  const meta = (item.metadata as any) ?? {}

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-keen-700 text-white px-5 py-4 flex-shrink-0 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-xl leading-tight">🎤 Speaking Class</h1>
          <p className="text-keen-200 text-xs mt-0.5">
            {week ? `Week ${week.weekNumber} · ` : ''}
            {classroom.gradeBand === 'g1-2' ? 'Grades 1–2' : 'Grades 3–4'} · {students.length} students
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <TeacherSidebar activePage="speaking" speakingHref={`/teacher/speaking/${dayId}`} />
        <div className="flex-1 overflow-y-auto bg-teal-50">
          <SpeakingSession
            contentItemId={item.id}
            meta={meta}
            students={students.map(s => ({
              id: s.id,
              name: s.name,
              displayName: s.displayName,
              avatarId: s.avatarId,
            }))}
            initialDoneIds={Array.from(doneIds)}
          />
        </div>
      </div>
    </div>
  )
}

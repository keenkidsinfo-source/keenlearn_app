export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  users, classrooms, classroomTeachers, curriculumDays, curriculumContent, contentItems,
  classroomCurriculum, studentSessions,
} from '@/lib/db/schema'
import { eq, and, isNull, inArray } from 'drizzle-orm'
import { getMondayStr } from '@/lib/teacher-dashboard'
import { ChartClient } from './ChartClient'
import type { GradeBand } from '@/lib/db/schema'
import { getResultFields } from '@/lib/build-result-fields'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildChartPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

  try {
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
    const meta = (item.metadata ?? {}) as Record<string, any>
    const resultFields = getResultFields(meta, gradeBand)

    // Load the classroom via junction table.
    // Try filtering by gradeBand first; fall back to any classroom for this teacher.
    let classroom = null
    const [classroomRow] = await db
      .select({ classroom: classrooms })
      .from(classroomTeachers)
      .innerJoin(classrooms, eq(classroomTeachers.classroomId, classrooms.id))
      .where(and(
        eq(classroomTeachers.teacherId, session.sub),
        eq(classrooms.gradeBand, gradeBand),
      ))
      .limit(1)
    classroom = classroomRow?.classroom ?? null

    // Fallback: maybe the classroom doesn't have gradeBand set — try without that filter
    if (!classroom) {
      const [fallbackRow] = await db
        .select({ classroom: classrooms })
        .from(classroomTeachers)
        .innerJoin(classrooms, eq(classroomTeachers.classroomId, classrooms.id))
        .where(eq(classroomTeachers.teacherId, session.sub))
        .limit(1)
      classroom = fallbackRow?.classroom ?? null
    }

    if (!classroom) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-3">🏫</p>
            <h2 className="font-black text-gray-700 text-lg mb-2">No classroom found</h2>
            <p className="text-gray-500 text-sm">Your account isn&apos;t linked to a classroom yet. Ask your admin to assign you to one.</p>
            <a href="/teacher" className="mt-4 inline-block text-teal-600 font-bold text-sm underline">← Back to dashboard</a>
          </div>
        </div>
      )
    }

    // Load students
    const students = await db
      .select({ id: users.id, name: users.name, displayName: users.displayName })
      .from(users)
      .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))
      .orderBy(users.name)

    // Load any build results students have already submitted
    const studentIds = students.map(s => s.id)
    const existingSessions = studentIds.length > 0
      ? await db
          .select({ studentId: studentSessions.studentId, sessionData: studentSessions.sessionData })
          .from(studentSessions)
          .where(and(
            inArray(studentSessions.studentId, studentIds),
            eq(studentSessions.contentItemId, item.id),
          ))
      : []

    // Build initial rows from student submissions (keys come from resultFields)
    const initialRows: Record<string, { a: string; b: string; c: string; note: string }> = {}
    for (const s of existingSessions) {
      const sd = (s.sessionData ?? {}) as Record<string, any>
      const br = (sd.buildResults ?? {}) as Record<string, any>
      initialRows[s.studentId] = {
        a: br[resultFields.a.key] != null ? String(br[resultFields.a.key]) : '',
        b: br[resultFields.b.key] != null ? String(br[resultFields.b.key]) : '',
        c: br[resultFields.c.key] != null ? String(br[resultFields.c.key]) : '',
        note: br.note ?? '',
      }
    }

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
        resultFields={resultFields}
        initialRows={initialRows}
      />
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[BuildChartPage] server error:', err)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-3">⚠️</p>
          <h2 className="font-black text-gray-700 text-lg mb-2">Something went wrong loading the chart</h2>
          <p className="text-red-600 text-sm font-mono bg-red-50 rounded-xl px-4 py-3 text-left break-words">{message}</p>
          <a href="/teacher" className="mt-4 inline-block text-teal-600 font-bold text-sm underline">← Back to dashboard</a>
        </div>
      </div>
    )
  }
}

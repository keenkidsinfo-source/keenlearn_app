export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  curriculumDays, curriculumContent, contentItems, studentSessions, classrooms,
  type GradeBand,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getResultFields } from '@/lib/build-result-fields'
import { ResultsForm } from './ResultsForm'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildResultsPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  // G1-2 students don't self-enter results — redirect them to dashboard
  if (session.classroomId) {
    const [classroom] = await db.select({ gradeBand: classrooms.gradeBand })
      .from(classrooms).where(eq(classrooms.id, session.classroomId)).limit(1)
    if (classroom?.gradeBand === 'g1-2') redirect('/dashboard')
  }

  const { dayId } = await params

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') notFound()

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

  // Load student's existing submission (for pre-population)
  const [existingSession] = await db
    .select()
    .from(studentSessions)
    .where(and(
      eq(studentSessions.studentId, session.sub),
      eq(studentSessions.contentItemId, item.id),
    ))
    .limit(1)

  const sd = (existingSession?.sessionData ?? {}) as Record<string, any>
  const br = (sd.buildResults ?? {}) as Record<string, any>

  const initial = {
    a: br[resultFields.a.key] != null ? String(br[resultFields.a.key]) : '',
    b: br[resultFields.b.key] != null ? String(br[resultFields.b.key]) : '',
    c: br[resultFields.c.key] != null ? String(br[resultFields.c.key]) : '',
    note: br.note ?? '',
  }

  return (
    <ResultsForm
      contentItemId={item.id}
      dayId={dayId}
      buildTitle={item.title}
      myStudentId={session.sub}
      resultFields={resultFields}
      initial={initial}
    />
  )
}

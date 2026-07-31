export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  curriculumDays, curriculumContent, contentItems, studentSessions,
  type GradeBand,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { ResultsForm } from './ResultsForm'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildResultsPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params

  // Load the day
  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') notFound()

  // Load content item
  const [row] = await db
    .select({ item: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .limit(1)

  if (!row) notFound()

  const item = row.item
  const gradeBand = (item.gradeBand ?? 'g1-2') as GradeBand

  // Load student's existing submission (if any)
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

  const initial = gradeBand === 'g1-2'
    ? {
        a: br.round1Clips != null ? String(br.round1Clips) : '',
        b: br.afterFixClips != null ? String(br.afterFixClips) : '',
        c: br.maxClips != null ? String(br.maxClips) : '',
        note: br.note ?? '',
      }
    : {
        a: br.cranksNoLoad != null ? String(br.cranksNoLoad) : '',
        b: br.cranksWithLoad != null ? String(br.cranksWithLoad) : '',
        c: br.cranksImproved != null ? String(br.cranksImproved) : '',
        note: br.note ?? '',
      }

  return (
    <ResultsForm
      contentItemId={item.id}
      dayId={dayId}
      gradeBand={gradeBand}
      buildTitle={item.title}
      myStudentId={session.sub}
      initial={initial}
    />
  )
}

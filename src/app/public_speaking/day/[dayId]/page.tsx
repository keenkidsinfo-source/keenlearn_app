import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, studentSessions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { SpeakingActivity } from './SpeakingActivity'

interface Props { params: Promise<{ dayId: string }> }

export default async function SpeakingDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params

  const [day] = await db
    .select()
    .from(curriculumDays)
    .where(eq(curriculumDays.id, dayId))
    .limit(1)

  if (!day || day.subject !== 'public_speaking') notFound()

  const items = await db
    .select({ contentItem: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .orderBy(curriculumContent.orderIndex)

  if (items.length === 0) notFound()
  const item = items[0].contentItem

  const [sessionData] = await db
    .select()
    .from(studentSessions)
    .where(and(
      eq(studentSessions.studentId, session.sub),
      eq(studentSessions.contentItemId, item.id),
    ))
    .limit(1)

  const meta = (item.metadata as any) ?? {}

  return (
    <SpeakingActivity
      contentItemId={item.id}
      title={item.title}
      theme={day.theme ?? ''}
      gradeBand={session.gradeBand ?? null}
      completed={sessionData?.completed ?? false}
      meta={meta}
    />
  )
}

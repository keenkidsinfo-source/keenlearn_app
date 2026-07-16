import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, studentSessions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getStepImageUrls } from '@/lib/r2/client'
import { ScienceStepClient } from './ScienceStepClient'

interface Props { params: Promise<{ dayId: string }> }

export default async function ScienceDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'science') notFound()

  const items = await db
    .select({ contentItem: contentItems, order: curriculumContent.orderIndex })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .orderBy(curriculumContent.orderIndex)

  if (items.length === 0) notFound()
  const item = items[0].contentItem

  const [sessionData] = await db
    .select()
    .from(studentSessions)
    .where(and(eq(studentSessions.studentId, session.sub), eq(studentSessions.contentItemId, item.id)))
    .limit(1)

  // Step image URLs from R2 (if any)
  const stepUrls = item.stepCount && item.contentUrl
    ? await getStepImageUrls(item.contentUrl.replace(/\/$/, ''), item.stepCount)
    : []

  // Text steps from metadata (populated by seed-science.mjs)
  const meta = item.metadata as any
  const textSteps = (meta?.steps ?? []).map((s: any) => ({
    emoji: s.emoji ?? '🔬',
    title: s.title ?? '',
    text:  s.text  ?? '',
    tip:   s.tip,
  }))

  return (
    <ScienceStepClient
      contentItemId={item.id}
      title={item.title}
      description={item.description ?? ''}
      theme={day.theme ?? ''}
      stepUrls={stepUrls}
      steps={textSteps.length > 0 ? textSteps : undefined}
      initialStep={sessionData?.lastStepIndex ?? 0}
      completed={sessionData?.completed ?? false}
      gradeBand={session.gradeBand ?? null}
    />
  )
}

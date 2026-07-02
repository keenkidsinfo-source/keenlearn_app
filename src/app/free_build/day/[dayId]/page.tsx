import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, studentSessions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getStepImageUrls } from '@/lib/r2/client'
import { StepViewer } from '@/app/build/day/[dayId]/StepViewer'

interface Props { params: { dayId: string } }

export default async function FreeBuildDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, params.dayId)).limit(1)
  if (!day || day.subject !== 'free_build') notFound()

  const items = await db
    .select({ contentItem: contentItems, orderIndex: curriculumContent.orderIndex })
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

  const stepUrls = item.stepCount && item.contentUrl
    ? await getStepImageUrls(item.contentUrl.replace(/\/$/, ''), item.stepCount)
    : []

  return (
    <StepViewer
      contentItemId={item.id}
      title={item.title}
      theme={day.theme ?? ''}
      stepUrls={stepUrls}
      initialStep={sessionData?.lastStepIndex ?? 0}
      completed={sessionData?.completed ?? false}
      gradeBand={session.gradeBand ?? null}
    />
  )
}

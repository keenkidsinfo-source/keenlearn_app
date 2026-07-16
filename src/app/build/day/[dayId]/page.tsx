import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  curriculumDays, curriculumContent, contentItems, studentSessions,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getStepImageUrls } from '@/lib/r2/client'
import { StepViewer, type StepData } from './StepViewer'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params

  // Load the day
  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') notFound()

  // Load content items for this day
  const items = await db
    .select({ contentItem: contentItems, orderIndex: curriculumContent.orderIndex })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .orderBy(curriculumContent.orderIndex)

  if (items.length === 0) notFound()

  const item = items[0].contentItem

  // Load existing session progress
  const [sessionData] = await db
    .select()
    .from(studentSessions)
    .where(and(
      eq(studentSessions.studentId, session.sub),
      eq(studentSessions.contentItemId, item.id),
    ))
    .limit(1)

  const lastStep = sessionData?.lastStepIndex ?? 0

  // Load text steps from metadata
  const meta = item.metadata as any
  const textSteps: StepData[] = (meta?.steps ?? []).map((s: any) => ({
    emoji: s.emoji,
    title: s.title,
    text: s.text,
    tip: s.tip,
  }))
  // Step image URLs: prefer metadata image paths, fall back to R2
  const metaImageUrls: string[] = (meta?.steps ?? []).map((s: any) => s.image ?? '')
  const stepCount = item.stepCount ?? 0
  const r2Key = item.contentUrl ?? ''
  const r2Urls = stepCount > 0 && r2Key
    ? await getStepImageUrls(r2Key.replace(/\/$/, ''), stepCount)
    : []
  const stepUrls = metaImageUrls.some(u => u) ? metaImageUrls : r2Urls

  return (
    <StepViewer
      contentItemId={item.id}
      title={item.title}
      theme={day.theme ?? ''}
      stepUrls={stepUrls}
      steps={textSteps.length > 0 ? textSteps : undefined}
      initialStep={lastStep}
      completed={sessionData?.completed ?? false}
      gradeBand={session.gradeBand ?? null}
    />
  )
}

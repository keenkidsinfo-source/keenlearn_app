export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculum, curriculumDays, curriculumContent, contentItems, codingProjects, studentSessions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { CodingSandbox } from './CodingSandbox'

interface Props { params: Promise<{ dayId: string }> }

export default async function CodingDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'coding') notFound()

  const items = await db
    .select({ curriculumContentId: curriculumContent.id, contentItem: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .orderBy(curriculumContent.orderIndex)

  if (items.length === 0) notFound()
  const { curriculumContentId, contentItem: item } = items[0]

  const [project] = await db
    .select()
    .from(codingProjects)
    .where(and(
      eq(codingProjects.studentId, session.sub),
      eq(codingProjects.curriculumContentId, curriculumContentId),
    ))
    .limit(1)

  // Load saved step position (same mechanism as build page)
  const [sessionData] = await db
    .select()
    .from(studentSessions)
    .where(and(
      eq(studentSessions.studentId, session.sub),
      eq(studentSessions.contentItemId, item.id),
    ))
    .limit(1)

  // Language from metadata, fall back to grade band
  const meta = item.metadata as any
  const language: 'scratch' | 'python' = meta?.language ?? (session.gradeBand === 'g3-4' ? 'python' : 'scratch')

  const projectUrl = (language === 'scratch' && project && (project.projectData || project.r2Key))
    ? `/api/v1/coding/${project.id}/data`
    : null
  const savedCode = (language === 'python' && project?.projectData)
    ? project.projectData
    : null

  // If no saved project for this week and it's Scratch, try to use the previous week's
  // project as the starter so students continue building on their prior work.
  // Previous week takes priority over the generic starterUrl in metadata.
  let starterUrl: string | null = meta?.starterUrl ?? null
  if (!project && language === 'scratch') {
    const [thisCurriculum] = await db
      .select({ weekNumber: curriculum.weekNumber, gradeBand: curriculum.gradeBand })
      .from(curriculum)
      .where(eq(curriculum.id, day.curriculumId))
      .limit(1)

    if (thisCurriculum && thisCurriculum.weekNumber > 1) {
      // Find the previous week's coding day
      const [prevDay] = await db
        .select({ id: curriculumDays.id })
        .from(curriculumDays)
        .innerJoin(curriculum, eq(curriculum.id, curriculumDays.curriculumId))
        .where(and(
          eq(curriculum.weekNumber, thisCurriculum.weekNumber - 1),
          eq(curriculum.gradeBand, thisCurriculum.gradeBand),
          eq(curriculumDays.subject, 'coding'),
        ))
        .limit(1)

      if (prevDay) {
        const [prevContent] = await db
          .select({ id: curriculumContent.id })
          .from(curriculumContent)
          .where(eq(curriculumContent.curriculumDayId, prevDay.id))
          .limit(1)

        if (prevContent) {
          const [prevProject] = await db
            .select()
            .from(codingProjects)
            .where(and(
              eq(codingProjects.studentId, session.sub),
              eq(codingProjects.curriculumContentId, prevContent.id),
            ))
            .limit(1)

          if (prevProject && (prevProject.projectData || prevProject.r2Key)) {
            starterUrl = `/api/v1/coding/${prevProject.id}/data`
          }
        }
      }
    }
  }

  return (
    <CodingSandbox
      contentItemId={curriculumContentId}
      sessionContentItemId={item.id}
      title={item.title}
      theme={day.theme ?? ''}
      language={language}
      projectId={project?.id ?? null}
      projectUrl={projectUrl}
      starterUrl={starterUrl}
      savedCode={savedCode}
      gradeBand={session.gradeBand ?? null}
      challenge={meta?.challenge}
      tagline={meta?.tagline}
      steps={meta?.steps}
      initialStep={sessionData?.lastStepIndex ?? 0}
    />
  )
}

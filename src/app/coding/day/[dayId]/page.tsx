import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, codingProjects } from '@/lib/db/schema'
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

  // Language from metadata, fall back to grade band
  const meta = item.metadata as any
  const language: 'scratch' | 'python' = meta?.language ?? (session.gradeBand === 'g3-4' ? 'python' : 'scratch')

  const projectUrl = (language === 'scratch' && project?.projectData)
    ? `/api/v1/coding/${project.id}/data`
    : null
  const savedCode = (language === 'python' && project?.projectData)
    ? project.projectData
    : null

  return (
    <CodingSandbox
      contentItemId={curriculumContentId}
      title={item.title}
      theme={day.theme ?? ''}
      language={language}
      projectId={project?.id ?? null}
      projectUrl={projectUrl}
      savedCode={savedCode}
      gradeBand={session.gradeBand ?? null}
      challenge={meta?.challenge}
      tagline={meta?.tagline}
      steps={meta?.steps}
    />
  )
}

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, codingProjects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getPresignedUrl } from '@/lib/r2/client'
import { CodingSandbox } from './CodingSandbox'

interface Props { params: { dayId: string } }

export default async function CodingDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, params.dayId)).limit(1)
  if (!day || day.subject !== 'coding') notFound()

  const items = await db
    .select({ contentItem: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .orderBy(curriculumContent.orderIndex)

  if (items.length === 0) notFound()
  const item = items[0].contentItem

  // Find or indicate no project yet (create via API on first save)
  const [project] = await db
    .select()
    .from(codingProjects)
    .where(and(
      eq(codingProjects.studentId, session.sub),
      eq(codingProjects.curriculumContentId, item.id),
    ))
    .limit(1)

  const projectUrl = project?.r2Key
    ? await getPresignedUrl(project.r2Key)
    : null

  // Determine language from gradeBand
  const language: 'scratch' | 'python' = session.gradeBand === 'g3-4' ? 'python' : 'scratch'

  return (
    <CodingSandbox
      contentItemId={item.id}
      title={item.title}
      theme={day.theme ?? ''}
      language={language}
      projectId={project?.id ?? null}
      projectUrl={projectUrl}
      gradeBand={session.gradeBand}
      turbowarpUrl={process.env.NEXT_PUBLIC_TURBOWARP_URL ?? 'https://turbowarp.org'}
    />
  )
}

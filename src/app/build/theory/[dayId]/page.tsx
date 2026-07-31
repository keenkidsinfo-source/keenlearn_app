import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getTheoryDeck } from '@/lib/theory-slides'
import { TheoryViewer } from './TheoryViewer'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildTheoryPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  // Teachers and admins only — students go to the build page directly
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

  // Load the day and its content item to get grade band
  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') notFound()

  const items = await db
    .select({ contentItem: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .limit(1)

  if (items.length === 0) notFound()

  const item = items[0].contentItem
  const gradeBand = item.gradeBand ?? 'g1-2'
  const deck = getTheoryDeck(gradeBand)

  if (!deck) notFound()

  return <TheoryViewer deck={deck} buildDayId={dayId} />
}

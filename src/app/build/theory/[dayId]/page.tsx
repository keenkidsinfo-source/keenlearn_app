import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getTheoryDeck } from '@/lib/theory-slides'
import { TheoryViewer } from './TheoryViewer'
import { TeacherSidebar } from '@/app/teacher/TeacherSidebar'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildTheoryPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  // Teachers and admins only — students go to the build page directly
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

  // Load the day and its content item to get grade band + week number
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

  // Look up week number so we can show the correct theory deck
  const [curriculumRow] = await db
    .select({ weekNumber: curriculum.weekNumber })
    .from(curriculum)
    .where(eq(curriculum.id, day.curriculumId))
    .limit(1)
  const weekNumber = curriculumRow?.weekNumber ?? 1

  const deck = getTheoryDeck(gradeBand, weekNumber)
  // No theory deck for this week yet — redirect back to the build page
  if (!deck) redirect(`/teacher/build`)

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar activePage="build" buildDayId={dayId} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <TheoryViewer deck={deck} buildDayId={dayId} />
      </div>
    </div>
  )
}

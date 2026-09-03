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

  // Single joined query: day → curriculum (week number) + content item (grade band)
  const rows = await db
    .select({
      dayId:      curriculumDays.id,
      subject:    curriculumDays.subject,
      weekNumber: curriculum.weekNumber,
      gradeBand:  contentItems.gradeBand,
    })
    .from(curriculumDays)
    .innerJoin(curriculum, eq(curriculum.id, curriculumDays.curriculumId))
    .innerJoin(curriculumContent, eq(curriculumContent.curriculumDayId, curriculumDays.id))
    .innerJoin(contentItems, eq(contentItems.id, curriculumContent.contentItemId))
    .where(eq(curriculumDays.id, dayId))
    .limit(1)

  if (rows.length === 0) notFound()
  const row = rows[0]
  if (row.subject !== 'build') notFound()

  const gradeBand = row.gradeBand ?? 'g1-2'
  const weekNumber = row.weekNumber

  const deck = getTheoryDeck(gradeBand, weekNumber)
  // No theory deck for this week yet — show debug info instead of silent redirect
  if (!deck) {
    return (
      <div className="p-8 font-mono text-sm bg-red-50">
        <p className="text-red-700 font-bold mb-2">No theory deck found</p>
        <p>dayId: {dayId}</p>
        <p>gradeBand: {gradeBand}</p>
        <p>weekNumber: {weekNumber}</p>
        <p>rowCount: {rows.length}</p>
      </div>
    )
  }

  // DEBUG — remove after confirming
  const debugInfo = `${gradeBand} W${weekNumber}`

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar activePage="build" buildDayId={dayId} email={session.email} />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 font-mono">[debug] {debugInfo}</div>
        <TheoryViewer deck={deck} buildDayId={dayId} />
      </div>
    </div>
  )
}

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getCodingTheoryDeck } from '@/lib/coding-theory-slides'
import { CodingTheoryViewer } from './CodingTheoryViewer'
import { TeacherSidebar } from '@/app/teacher/TeacherSidebar'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ dayId: string }> }

export default async function CodingTheoryPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

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
  if (row.subject !== 'coding') notFound()

  const gradeBand = row.gradeBand ?? 'g1-2'
  const weekNumber = row.weekNumber

  const deck = getCodingTheoryDeck(gradeBand, weekNumber)
  if (!deck) {
    return (
      <div className="p-8 font-mono text-sm bg-red-50">
        <p className="text-red-700 font-bold mb-2">No coding theory deck found</p>
        <p>dayId: {dayId}</p>
        <p>gradeBand: {gradeBand}</p>
        <p>weekNumber: {weekNumber}</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar activePage="coding" buildDayId={dayId} email={session.email} />
      <div className="flex-1 overflow-y-auto">
        <CodingTheoryViewer deck={deck} codingDayId={dayId} />
      </div>
    </div>
  )
}

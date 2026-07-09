import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  curriculum, classroomCurriculum, classrooms,
  curriculumDays, curriculumContent, contentItems,
} from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { CurriculumBrowser } from './CurriculumBrowser'

export default async function TeacherCurriculumPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.teacherId, session.sub))
    .limit(1)

  if (!classroom) redirect('/teacher')

  const gradeBand = classroom.gradeBand

  const weeks = await db
    .select()
    .from(curriculum)
    .where(eq(curriculum.isActive, true))
    .orderBy(curriculum.weekNumber)

  const filtered = weeks.filter(w => w.gradeBand === gradeBand || w.gradeBand === 'both')

  const assignments = await db
    .select()
    .from(classroomCurriculum)
    .where(eq(classroomCurriculum.classroomId, classroom.id))

  const assignedMap = new Map(assignments.map(a => [a.curriculumId, a.weekStartDate]))

  // Load coding content items for each week
  const codingRows = filtered.length > 0
    ? await db
        .select({
          curriculumId: curriculum.id,
          contentItemId: contentItems.id,
          title: contentItems.title,
          metadata: contentItems.metadata,
        })
        .from(contentItems)
        .innerJoin(curriculumContent, eq(curriculumContent.contentItemId, contentItems.id))
        .innerJoin(curriculumDays, eq(curriculumDays.id, curriculumContent.curriculumDayId))
        .innerJoin(curriculum, eq(curriculum.id, curriculumDays.curriculumId))
        .where(and(
          eq(contentItems.subject, 'coding'),
          inArray(curriculum.id, filtered.map(w => w.id)),
        ))
    : []

  const codingMap = Object.fromEntries(
    codingRows.map(r => [r.curriculumId, {
      contentItemId: r.contentItemId,
      title: r.title,
      metadata: r.metadata as any,
    }])
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-keen-700 text-white px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/teacher" className="text-keen-200 text-2xl">←</Link>
          <div>
            <h1 className="text-2xl font-black">📚 Curriculum Library</h1>
            <p className="text-keen-200 text-sm mt-0.5">
              {gradeBand === 'g1-2' ? 'Grades 1–2' : 'Grades 3–4'} · {filtered.length} weeks available
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <CurriculumBrowser
          weeks={filtered}
          assignedMap={Object.fromEntries(assignedMap)}
          classroomId={classroom.id}
          codingMap={codingMap}
        />
      </main>
    </div>
  )
}

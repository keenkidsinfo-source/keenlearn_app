import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculumContent, contentItems, studentSessions } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { MathActivity } from './MathActivity'
import { StudentSidebar } from '@/app/dashboard/StudentSidebar'
import { getWeekNav } from '@/lib/student-week-nav'

interface Props { params: { dayId: string } }

export default async function MathDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, params.dayId)).limit(1)
  if (!day || day.subject !== 'math') notFound()

  const items = await db
    .select({ contentItem: contentItems })
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

  // sessionData.sessionData holds { questions: [...], answers: [...] } as JSONB
  const existing = (sessionData?.sessionData as any) ?? null

  const questions = (item.metadata as any)?.questions ?? []
  const nav = await getWeekNav(params.dayId)

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar nav={nav} gradeBand={(session.gradeBand as 'g1-2' | 'g3-4') ?? null} name={session.name} />
      <div className="flex-1 overflow-y-auto">
        <MathActivity
          contentItemId={item.id}
          title={item.title}
          description={item.description ?? ''}
          theme={day.theme ?? ''}
          gradeBand={session.gradeBand ?? null}
          completed={sessionData?.completed ?? false}
          existingSession={existing}
          questions={questions}
        />
      </div>
    </div>
  )
}

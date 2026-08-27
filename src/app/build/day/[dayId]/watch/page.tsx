export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import {
  curriculumDays, curriculumContent, contentItems, classrooms,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { StudentSidebar } from '@/app/dashboard/StudentSidebar'
import { getWeekNav } from '@/lib/student-week-nav'

interface Props { params: Promise<{ dayId: string }> }

export default async function BuildWatchPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Only G1-2 students — G3-4 go to results
  if (session.classroomId) {
    const [classroom] = await db.select({ gradeBand: classrooms.gradeBand })
      .from(classrooms).where(eq(classrooms.id, session.classroomId)).limit(1)
    if (classroom?.gradeBand !== 'g1-2') redirect(`/build/day/${(await params).dayId}/results`)
  }

  const { dayId } = await params

  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'build') notFound()

  const [row] = await db
    .select({ item: contentItems })
    .from(curriculumContent)
    .innerJoin(contentItems, eq(curriculumContent.contentItemId, contentItems.id))
    .where(eq(curriculumContent.curriculumDayId, day.id))
    .limit(1)

  const title = row?.item.title ?? 'Build Day'
  const nav = await getWeekNav(dayId)

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar nav={nav} gradeBand="g1-2" name={session.name} />
      <div className="flex-1 overflow-y-auto bg-orange-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl mb-6 animate-bounce">🏗️</div>
      <h1 className="text-4xl font-black text-orange-700 mb-3">It&apos;s Build Day!</h1>
      <p className="text-2xl font-bold text-orange-500 mb-6">{title}</p>
      <div className="bg-white rounded-3xl shadow-md p-6 max-w-sm w-full mb-8">
        <p className="text-5xl mb-3">👀</p>
        <p className="text-lg font-bold text-gray-700">Watch the big screen</p>
        <p className="text-gray-500 mt-1">Your teacher will show you what to build. Follow along and have fun!</p>
      </div>
      <div className="bg-orange-100 rounded-2xl p-4 max-w-sm w-full">
        <p className="text-orange-700 font-semibold text-sm">
          🌟 Your teacher will record your score on the class chart!
        </p>
      </div>
      <Link href="/dashboard" className="mt-8 text-orange-400 font-bold text-sm hover:text-orange-600">
        ← Back to Home
      </Link>
      </div>
    </div>
  )
}

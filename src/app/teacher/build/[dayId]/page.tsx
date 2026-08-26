export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays, curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { TeacherSidebar } from '../../TeacherSidebar'

interface Props { params: Promise<{ dayId: string }> }

export default async function TeacherBuildHubPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  const { dayId } = await params

  const [day] = await db
    .select({ id: curriculumDays.id, subject: curriculumDays.subject, curriculumId: curriculumDays.curriculumId })
    .from(curriculumDays)
    .where(eq(curriculumDays.id, dayId))
    .limit(1)

  if (!day || day.subject !== 'build') notFound()

  const [week] = await db
    .select({ title: curriculum.title, weekNumber: curriculum.weekNumber })
    .from(curriculum)
    .where(eq(curriculum.id, day.curriculumId))
    .limit(1)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-keen-700 text-white px-6 py-4 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="font-black text-xl leading-tight">🔧 Build Day</h1>
          {week && (
            <p className="text-keen-200 text-xs mt-0.5">Week {week.weekNumber} · {week.title}</p>
          )}
        </div>
        <Link href="/teacher" className="text-keen-200 hover:text-white text-sm font-semibold">
          ← Dashboard
        </Link>
      </header>

      <div className="flex flex-1">
        <TeacherSidebar activePage="build" buildHref={`/teacher/build/${dayId}`} />
        <main className="flex-1 bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 py-10">
          <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">Launch activity</p>

          <Link
            href={`/build/theory/${dayId}`}
            className="flex items-center justify-center gap-3 w-full max-w-md bg-purple-600 hover:bg-purple-500 text-white font-bold py-5 rounded-2xl text-lg transition-all shadow"
          >
            📖 Theory Slides <span className="text-purple-200 text-sm font-normal">(show first)</span>
          </Link>

          <Link
            href={`/build/day/${dayId}`}
            className="flex items-center justify-center gap-3 w-full max-w-md bg-orange-500 hover:bg-orange-400 text-white font-bold py-5 rounded-2xl text-lg transition-all shadow"
          >
            🏗️ View Build Steps
          </Link>

          <Link
            href={`/teacher/build/chart/${dayId}`}
            className="flex items-center justify-center gap-3 w-full max-w-md bg-teal-600 hover:bg-teal-500 text-white font-bold py-5 rounded-2xl text-lg transition-all shadow"
          >
            📊 Class Results Chart
          </Link>
        </main>
      </div>
    </div>
  )
}

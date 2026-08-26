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
        <TeacherSidebar activePage="build" buildDayId={dayId} />
        <main className="flex-1 bg-gray-50 px-6 py-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">

            <Link
              href={`/build/day/${dayId}`}
              className="flex items-center justify-center gap-3 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-sm"
            >
              ⚙️ Setup <span className="text-gray-300 text-sm font-normal">(do this before students arrive)</span>
            </Link>

            <Link
              href={`/build/theory/${dayId}`}
              className="flex items-center justify-center gap-3 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-sm"
            >
              📖 Theory Slides <span className="text-purple-200 text-sm font-normal">(show first)</span>
            </Link>

            <Link
              href={`/build/day/${dayId}`}
              className="flex items-center justify-center gap-3 w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-sm"
            >
              🏗️ View Build Steps
            </Link>

            <Link
              href={`/teacher/build/chart/${dayId}`}
              className="flex items-center justify-center gap-3 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-2xl text-base transition-all shadow-sm"
            >
              📊 Class Results Chart
            </Link>

          </div>
        </main>
      </div>
    </div>
  )
}

import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { curriculumDays } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ dayId: string }> }

export default async function FreeBuildDayPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { dayId } = await params
  const [day] = await db.select().from(curriculumDays).where(eq(curriculumDays.id, dayId)).limit(1)
  if (!day || day.subject !== 'free_build') notFound()

  const isG12 = session.gradeBand === 'g1-2'

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <header className="bg-orange-500 text-white px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-orange-200 text-2xl">←</Link>
        <div>
          <h1 className="font-black text-lg">🛠️ Free Build Friday</h1>
          {day.theme && <p className="text-orange-200 text-xs">{day.theme}</p>}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="text-8xl animate-bounce">🛠️</div>
        <div>
          <h2 className={`font-black text-orange-800 mb-2 ${isG12 ? 'text-3xl' : 'text-2xl'}`}>
            Coming Soon!
          </h2>
          <p className={`text-orange-700 max-w-xs mx-auto leading-relaxed ${isG12 ? 'text-lg' : 'text-base'}`}>
            Your teacher will tell you what you&apos;re building today. Get ready to create something amazing! 🚀
          </p>
        </div>
        <Link
          href="/dashboard"
          className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-3 rounded-2xl text-lg active:scale-95 transition-all shadow"
        >
          ← Back to Dashboard
        </Link>
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { achievements, studentSessions } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import Link from 'next/link'

const BADGE_META: Record<string, { emoji: string; label: string; desc: string }> = {
  first_activity:   { emoji: '🌟', label: 'First Step',      desc: 'Completed your first activity!' },
  science_5:        { emoji: '🔬', label: 'Lab Explorer',    desc: 'Finished 5 science experiments' },
  coding_5:         { emoji: '💻', label: 'Code Wizard',     desc: 'Completed 5 coding projects' },
  build_5:          { emoji: '🔨', label: 'Builder Pro',     desc: 'Built 5 awesome things' },
  math_5:           { emoji: '🔢', label: 'Math Champ',      desc: 'Aced 5 math activities' },
  arts_5:           { emoji: '🎨', label: 'Creative Star',   desc: 'Completed 5 art projects' },
  week_complete:    { emoji: '🏆', label: 'Week Champion',   desc: 'Finished all 5 days in a week' },
  perfect_math:     { emoji: '⭐', label: 'Perfect Score',   desc: 'Got 100% on a math quiz' },
  streak_3:         { emoji: '🔥', label: '3-Day Streak',    desc: 'Logged in 3 days in a row' },
}

export default async function AchievementsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const earned = await db
    .select()
    .from(achievements)
    .where(eq(achievements.studentId, session.sub))
    .orderBy(achievements.earnedAt)

  const [{ total }] = await db
    .select({ total: count() })
    .from(studentSessions)
    .where(eq(studentSessions.studentId, session.sub))

  const earnedTypes = new Set(earned.map(a => a.badgeType))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-keen-600 text-white px-4 py-5">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-keen-200 text-2xl">←</Link>
          <h1 className="text-2xl font-black">🏆 My Achievements</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-keen-600">{earned.length}</p>
            <p className="text-sm text-gray-500 font-semibold mt-1">Badges earned</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-keen-600">{total}</p>
            <p className="text-sm text-gray-500 font-semibold mt-1">Activities started</p>
          </div>
        </div>

        {/* Badge grid */}
        <h2 className="text-lg font-bold text-gray-700 mb-3">All Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(BADGE_META).map(([type, meta]) => {
            const isEarned = earnedTypes.has(type)
            return (
              <div
                key={type}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all
                  ${isEarned ? 'bg-white border-keen-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-50'}`}
              >
                <span className={`text-4xl ${!isEarned ? 'grayscale' : ''}`}>{meta.emoji}</span>
                <span className={`text-xs font-bold leading-tight ${isEarned ? 'text-gray-800' : 'text-gray-400'}`}>
                  {meta.label}
                </span>
                {isEarned && (
                  <span className="text-[10px] text-gray-400 leading-tight">{meta.desc}</span>
                )}
              </div>
            )
          })}
        </div>

        {earned.length === 0 && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-gray-500 font-semibold">Complete activities to earn badges!</p>
          </div>
        )}
      </main>
    </div>
  )
}

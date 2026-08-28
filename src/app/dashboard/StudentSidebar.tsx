'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { WeekNav } from '@/lib/student-week-nav'

interface Props {
  nav: WeekNav
  gradeBand: 'g1-2' | 'g3-4' | null
  name?: string | null
}

const ITEMS = [
  { key: 'home',            label: 'Home',     emoji: '🏠' },
  { key: 'build',           label: 'Build Day', emoji: '🔧' },
  { key: 'public_speaking', label: 'Speaking',  emoji: '🎤' },
  { key: 'science',         label: 'Science',   emoji: '🔬' },
  { key: 'coding',          label: 'Coding',    emoji: '💻' },
] as const

function getHref(key: string, nav: WeekNav, gradeBand: 'g1-2' | 'g3-4' | null): string | null {
  if (key === 'home') return '/dashboard'
  if (key === 'build') {
    if (!nav.build) return null
    return gradeBand === 'g1-2' ? `/build/day/${nav.build}/watch` : `/build/day/${nav.build}/results`
  }
  if (key === 'public_speaking') return nav.public_speaking ? `/public_speaking/day/${nav.public_speaking}` : null
  if (key === 'science') return '/science/lab'
  if (key === 'coding') return nav.coding ? `/coding/day/${nav.coding}` : null
  if (key === 'math') return nav.math ? `/math/day/${nav.math}` : null
  return null
}

function isActive(key: string, pathname: string): boolean {
  if (key === 'home') return pathname === '/dashboard'
  if (key === 'build') return pathname.includes('/build/day/')
  if (key === 'public_speaking') return pathname.includes('/public_speaking/')
  if (key === 'science') return pathname.includes('/science/')
  if (key === 'coding') return pathname.includes('/coding/')
  if (key === 'math') return pathname.includes('/math/')
  return false
}

export function StudentSidebar({ nav, gradeBand, name }: Props) {
  const pathname = usePathname()
  const firstName = name?.split(' ')[0] ?? null

  return (
    <aside className="w-20 md:w-48 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo + name + sign out */}
      <div className="px-3 py-3 border-b border-gray-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-keen-600 shrink-0">KK</span>
          <span className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">Learn</span>
        </div>
        {firstName && (
          <p className="hidden md:block text-base font-bold text-gray-800 truncate">Hi, {firstName}! 👋</p>
        )}
        <form action="/api/v1/auth/logout" method="POST">
          <button
            type="submit"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-all"
          >
            <span>🚪</span>
            <span>Sign out</span>
          </button>
          {/* Icon-only on small sidebar */}
          <button
            type="submit"
            className="md:hidden text-base text-gray-400 hover:text-red-500 transition-all"
          >
            🚪
          </button>
        </form>
      </div>

      <nav className="flex-1 py-3 flex flex-col gap-1 px-2">
        {ITEMS.map(({ key, label, emoji }) => {
          const href = getHref(key, nav, gradeBand)
          const active = isActive(key, pathname)
          const disabled = !href

          if (disabled) {
            return (
              <div key={key} className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-30 cursor-not-allowed">
                <span className="text-xl w-6 text-center">{emoji}</span>
                <span className="hidden md:block text-xs font-semibold text-gray-400">{label}</span>
              </div>
            )
          }

          return (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                active
                  ? 'bg-keen-100 text-keen-700 font-black'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold'
              )}
            >
              <span className="text-xl w-6 text-center">{emoji}</span>
              <span className="hidden md:block text-xs">{label}</span>
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}

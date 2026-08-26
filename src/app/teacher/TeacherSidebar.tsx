'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type TeacherPage = 'dashboard' | 'build' | 'science' | 'speaking' | 'coding' | 'students' | 'curriculum'

interface Props {
  activePage: TeacherPage
  speakingHref?: string | null
  buildDayId?: string | null
}

const NAV_ITEMS: { key: TeacherPage; label: string; emoji: string; staticHref: string | null }[] = [
  { key: 'dashboard',  label: 'Dashboard',  emoji: '🏠', staticHref: '/teacher' },
  { key: 'build',      label: 'Build Day',  emoji: '🔧', staticHref: null },
  { key: 'science',    label: 'Science',    emoji: '🔬', staticHref: '/teacher/science' },
  { key: 'speaking',   label: 'Speaking',   emoji: '🎤', staticHref: null },
  { key: 'coding',     label: 'Coding',     emoji: '💻', staticHref: '/teacher' },
  { key: 'students',   label: 'Students',   emoji: '👥', staticHref: '/teacher#students' },
  { key: 'curriculum', label: 'Curriculum', emoji: '📚', staticHref: '/teacher/curriculum' },
]

const BUILD_SUB: { label: string; emoji: string; getHref: (id: string) => string; pathMatch: string }[] = [
  { label: 'Setup',         emoji: '⚙️',  getHref: id => `/build/day/${id}`,            pathMatch: '' },
  { label: 'Theory Slides', emoji: '📖', getHref: id => `/build/theory/${id}`,          pathMatch: '/build/theory/' },
  { label: 'Build Steps',   emoji: '🏗️', getHref: id => `/build/day/${id}`,            pathMatch: '/build/day/' },
  { label: 'Results Chart', emoji: '📊', getHref: id => `/teacher/build/chart/${id}`,   pathMatch: '/teacher/build/chart/' },
]

export function TeacherSidebar({ activePage, speakingHref, buildDayId }: Props) {
  const pathname = usePathname()
  const isBuildSection = activePage === 'build'

  return (
    <nav className="w-[112px] bg-[#023e6b] flex flex-col flex-shrink-0 self-stretch">
      {NAV_ITEMS.map(item => {
        if (item.key === 'build') {
          const mainHref = buildDayId ? `/build/day/${buildDayId}` : '/teacher'
          const active = isBuildSection

          return (
            <div key="build">
              <Link
                href={mainHref}
                className={[
                  'flex items-center gap-2 px-3 py-[9px] text-[10.5px] font-bold border-l-[3px] transition-colors',
                  active ? 'bg-[#0284c7] text-white border-[#38bdf8]' : 'text-[#7dd3fc] border-transparent hover:bg-white/10',
                ].join(' ')}
              >
                <span className="text-sm leading-none" aria-hidden="true">🔧</span>
                Build Day
              </Link>

              {isBuildSection && buildDayId && (
                <div className="bg-[#012d4e]">
                  {BUILD_SUB.map(sub => {
                    const href = sub.getHref(buildDayId)
                    const isActive = sub.pathMatch ? pathname.includes(sub.pathMatch) : pathname.includes('/build/day/') && !pathname.includes('/teacher/build/chart/')
                    return (
                      <Link
                        key={sub.label}
                        href={href}
                        className={[
                          'flex items-center gap-1.5 pl-5 pr-2 py-[7px] text-[9.5px] font-bold border-l-[3px] transition-colors',
                          isActive ? 'bg-[#0369a1] text-white border-[#38bdf8]' : 'text-[#7dd3fc] border-transparent hover:bg-white/10',
                        ].join(' ')}
                      >
                        <span className="text-xs leading-none" aria-hidden="true">{sub.emoji}</span>
                        {sub.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }

        let href = item.staticHref ?? '/teacher'
        if (item.key === 'speaking' && speakingHref) href = speakingHref
        const active = item.key === activePage

        return (
          <Link
            key={item.key}
            href={href}
            className={[
              'flex items-center gap-2 px-3 py-[9px] text-[10.5px] font-bold border-l-[3px] transition-colors',
              active ? 'bg-[#0284c7] text-white border-[#38bdf8]' : 'text-[#7dd3fc] border-transparent hover:bg-white/10',
            ].join(' ')}
          >
            <span className="text-sm leading-none" aria-hidden="true">{item.emoji}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

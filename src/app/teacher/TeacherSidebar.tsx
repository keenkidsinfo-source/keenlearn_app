'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type TeacherPage = 'dashboard' | 'build' | 'science' | 'speaking' | 'coding' | 'students' | 'curriculum'
export type ActivitySubject = 'build' | 'science' | 'speaking' | 'coding'

interface Props {
  activePage: TeacherPage
  speakingHref?: string | null
  buildDayId?: string | null
  /** Order of the 4 activity subjects for this school's schedule */
  subjectOrder?: ActivitySubject[]
  email?: string | null
}

// Fixed top/bottom items
const TOP_ITEM = { key: 'dashboard' as TeacherPage, label: 'Dashboard', emoji: '🏠', staticHref: '/teacher' }
const BOTTOM_ITEMS: { key: TeacherPage; label: string; emoji: string; staticHref: string }[] = [
  { key: 'students',   label: 'Students',   emoji: '👥', staticHref: '/teacher#students' },
  { key: 'curriculum', label: 'Curriculum', emoji: '📚', staticHref: '/teacher/curriculum' },
]

// Activity items — reordered per school (coding removed from sidebar)
const ACTIVITY_ITEMS: { key: ActivitySubject; label: string; emoji: string; staticHref: string | null }[] = [
  { key: 'build',    label: 'Build Day', emoji: '🔧', staticHref: null },
  { key: 'speaking', label: 'Speaking',  emoji: '🎤', staticHref: null },
  { key: 'science',  label: 'Science',   emoji: '🔬', staticHref: '/teacher/science' },
]

const DEFAULT_ORDER: ActivitySubject[] = ['build', 'speaking', 'science']

const BUILD_SUB: { label: string; emoji: string; getHref: (id: string) => string; pathMatch: string }[] = [
  { label: 'Setup',         emoji: '⚙️',  getHref: id => `/build/day/${id}`,                pathMatch: '' },
  { label: 'Theory Slides', emoji: '📖', getHref: id => `/build/theory/${id}`,              pathMatch: '/build/theory/' },
  { label: 'Build Steps',   emoji: '🏗️', getHref: id => `/build/day/${id}?view=steps`,     pathMatch: '/build/day/' },
  { label: 'Results Chart', emoji: '📊', getHref: id => `/teacher/build/chart/${id}`,       pathMatch: '/teacher/build/chart/' },
]

export function TeacherSidebar({ activePage, speakingHref, buildDayId, subjectOrder, email }: Props) {
  const pathname = usePathname()
  const isBuildSection = activePage === 'build'

  // Sort activity items by school schedule; any not in subjectOrder go at the end
  const order = subjectOrder ?? DEFAULT_ORDER
  const sortedActivities = [
    ...order.map(s => ACTIVITY_ITEMS.find(a => a.key === s)!).filter(Boolean),
    ...ACTIVITY_ITEMS.filter(a => !order.includes(a.key)),
  ]

  const linkClass = (active: boolean) => [
    'flex items-center gap-2 px-3 py-[9px] text-[10.5px] font-bold border-l-[3px] transition-colors',
    active ? 'bg-[#0284c7] text-white border-[#38bdf8]' : 'text-[#7dd3fc] border-transparent hover:bg-white/10',
  ].join(' ')

  return (
    <nav className="w-[112px] bg-[#023e6b] flex flex-col flex-shrink-0 self-stretch">

      {/* Dashboard */}
      <Link href={TOP_ITEM.staticHref} className={linkClass(activePage === 'dashboard')}>
        <span className="text-sm leading-none" aria-hidden="true">{TOP_ITEM.emoji}</span>
        {TOP_ITEM.label}
      </Link>

      {/* Activity items — school-ordered */}
      {sortedActivities.map(item => {
        if (item.key === 'build') {
          const active = isBuildSection
          return (
            <div key="build">
              {/* Build Day — label only when sub-items are available, link otherwise */}
              {buildDayId ? (
                <div className={linkClass(active)}>
                  <span className="text-sm leading-none" aria-hidden="true">🔧</span>
                  Build Day
                </div>
              ) : (
                <Link href="/teacher" className={linkClass(false)}>
                  <span className="text-sm leading-none" aria-hidden="true">🔧</span>
                  Build Day
                </Link>
              )}

              {/* Sub-nav always visible when buildDayId is set */}
              {buildDayId && (
                <div className="bg-[#012d4e]">
                  {BUILD_SUB.map(sub => {
                    const href = sub.getHref(buildDayId)
                    const isActive = sub.pathMatch
                      ? pathname.includes(sub.pathMatch)
                      : pathname.includes('/build/day/') && !pathname.includes('/teacher/build/chart/')
                    return (
                      <Link key={sub.label} href={href} className={[
                        'flex items-center gap-1.5 pl-5 pr-2 py-[7px] text-[9.5px] font-bold border-l-[3px] transition-colors',
                        isActive ? 'bg-[#0369a1] text-white border-[#38bdf8]' : 'text-[#7dd3fc] border-transparent hover:bg-white/10',
                      ].join(' ')}>
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

        return (
          <Link key={item.key} href={href} className={linkClass(item.key === activePage)}>
            <span className="text-sm leading-none" aria-hidden="true">{item.emoji}</span>
            {item.label}
          </Link>
        )
      })}

      {/* Fixed bottom items */}
      {BOTTOM_ITEMS.map(item => (
        <Link key={item.key} href={item.staticHref} className={linkClass(item.key === activePage)}>
          <span className="text-sm leading-none" aria-hidden="true">{item.emoji}</span>
          {item.label}
        </Link>
      ))}

      {/* Email + sign out */}
      <div className="mt-auto border-t border-white/10 px-3 py-3 flex flex-col gap-1">
        {email && (
          <p className="text-[9px] text-[#7dd3fc] font-semibold truncate" title={email}>{email}</p>
        )}
        <form action="/api/v1/auth/logout" method="POST">
          <button type="submit" className="flex items-center gap-1.5 text-[10px] font-bold text-[#7dd3fc] hover:text-white transition-colors">
            <span aria-hidden="true">🚪</span> Sign out
          </button>
        </form>
      </div>

    </nav>
  )
}

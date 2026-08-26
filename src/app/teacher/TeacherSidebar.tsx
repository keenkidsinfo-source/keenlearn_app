'use client'

import Link from 'next/link'

export type TeacherPage = 'dashboard' | 'speaking' | 'science' | 'build' | 'coding' | 'curriculum'

interface Props {
  activePage: TeacherPage
  speakingHref?: string | null
  buildHref?: string | null
}

const ITEMS: { key: TeacherPage; label: string; emoji: string; staticHref: string | null }[] = [
  { key: 'dashboard',  label: 'Dashboard',  emoji: '🏠', staticHref: '/teacher' },
  { key: 'speaking',   label: 'Speaking',   emoji: '🎤', staticHref: null },
  { key: 'science',    label: 'Science',    emoji: '🔬', staticHref: '/teacher/science' },
  { key: 'build',      label: 'Build Day',  emoji: '🔧', staticHref: null },
  { key: 'coding',     label: 'Coding',     emoji: '💻', staticHref: '/teacher' },
  { key: 'curriculum', label: 'Curriculum', emoji: '📚', staticHref: '/teacher/curriculum' },
]

export function TeacherSidebar({ activePage, speakingHref, buildHref }: Props) {
  return (
    <nav className="w-[112px] bg-[#023e6b] flex flex-col flex-shrink-0 self-stretch">
      {ITEMS.map(item => {
        let href = item.staticHref ?? '/teacher'
        if (item.key === 'speaking' && speakingHref) href = speakingHref
        if (item.key === 'build'    && buildHref)    href = buildHref
        const active = item.key === activePage
        return (
          <Link
            key={item.key}
            href={href}
            className={[
              'flex items-center gap-2 px-3 py-[9px] text-[10.5px] font-bold border-l-[3px] transition-colors',
              active
                ? 'bg-[#0284c7] text-white border-[#38bdf8]'
                : 'text-[#7dd3fc] border-transparent hover:bg-white/10',
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

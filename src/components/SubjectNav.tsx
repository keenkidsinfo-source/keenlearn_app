'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SUBJECT_EMOJI, SUBJECT_LABEL } from '@/lib/utils'
import type { Subject } from '@/lib/db/schema'

const SUBJECTS: Subject[] = ['science', 'coding', 'build', 'math', 'arts']

export function SubjectNav({ dayId }: { dayId: string }) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 safe-area-pb">
      <div className="flex justify-around max-w-lg mx-auto">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors
            ${pathname === '/dashboard' ? 'text-keen-600 bg-keen-50' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <span className="text-xl">🏠</span>
          Home
        </Link>
        {SUBJECTS.map(s => (
          <Link
            key={s}
            href={`/${s}/day/${dayId}`}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors
              ${pathname.startsWith(`/${s}`) ? 'text-keen-600 bg-keen-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span className="text-xl">{SUBJECT_EMOJI[s]}</span>
            {SUBJECT_LABEL[s].split(' ')[0]}
          </Link>
        ))}
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { SUBJECT_COLORS, SUBJECT_EMOJI, SUBJECT_LABEL, DAY_LABELS } from '@/lib/utils'
import type { Subject } from '@/lib/db/schema'

interface WeekDay {
  dow: number      // 1=Mon … 5=Fri
  subject: string | null
  dayId: string | null
  theme: string | null
}

interface Props {
  weekDays: WeekDay[]
}

export function WeekDays({ weekDays }: Props) {
  // Use browser's local clock — avoids Vercel UTC vs user timezone mismatch
  const localDow    = new Date().getDay()           // 0=Sun … 6=Sat
  const todayIndex  = localDow === 0 ? 5 : localDow // clamp Sunday → show Friday

  return (
    <>
      {/* Today's highlight */}
      {weekDays
        .filter(d => d.dow === todayIndex && d.subject)
        .map(({ dow, subject, dayId, theme }) => {
          const colors = SUBJECT_COLORS[subject as Subject]
          return (
            <div key={dow} className={`${colors.light} border-2 ${colors.border} rounded-3xl p-6 mb-6`}>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Today</p>
              <Link href={dayId ? `/${subject}/day/${dayId}` : '#'} className="block">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{SUBJECT_EMOJI[subject as Subject]}</span>
                  <div>
                    <h2 className={`text-2xl font-black ${colors.text}`}>{SUBJECT_LABEL[subject as Subject]}</h2>
                    {theme && <p className="text-gray-600 mt-0.5">{theme}</p>}
                  </div>
                </div>
                <div className={`mt-4 btn-subject ${colors.bg} text-white w-full text-center`}>
                  Let&apos;s go! →
                </div>
              </Link>
            </div>
          )
        })}

      {/* Week list */}
      <h2 className="text-lg font-bold text-gray-700 mb-3">This Week</h2>
      <div className="flex flex-col gap-3">
        {weekDays.map(({ dow, subject, dayId, theme }) => {
          if (!subject) return null
          const colors  = SUBJECT_COLORS[subject as Subject]
          const isToday = dow === todayIndex
          const isPast  = dow < todayIndex
          return (
            <Link
              key={dow}
              href={dayId ? `/${subject}/day/${dayId}` : '#'}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                ${isToday ? `${colors.light} ${colors.border} shadow-md` : 'bg-white border-gray-100 hover:border-gray-300'}
                ${isPast ? 'opacity-60' : ''}`}
            >
              <span className="text-3xl w-10 text-center">{SUBJECT_EMOJI[subject as Subject]}</span>
              <div className="flex-1">
                <p className="font-bold text-gray-700">{DAY_LABELS[dow]}</p>
                <p className={`font-semibold ${colors.text}`}>{SUBJECT_LABEL[subject as Subject]}</p>
                {theme && <p className="text-sm text-gray-400">{theme}</p>}
              </div>
              {isToday && <span className="text-xs font-bold bg-keen-600 text-white px-2 py-1 rounded-full">TODAY</span>}
              {isPast && <span className="text-xl">✅</span>}
            </Link>
          )
        })}
      </div>
    </>
  )
}

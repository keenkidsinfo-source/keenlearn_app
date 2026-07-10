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
  weekStart: string   // YYYY-MM-DD Monday passed from server
  hasContent: boolean
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00') // noon to avoid DST edge cases
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function getCurrentMondayStr(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
}

function formatWeekLabel(mondayStr: string): string {
  const d = new Date(mondayStr + 'T12:00:00')
  const friday = new Date(d)
  friday.setDate(d.getDate() + 4)
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = friday.toLocaleDateString('en-US', { month: 'short' })
  if (month === endMonth) {
    return `${month} ${d.getDate()}–${friday.getDate()}`
  }
  return `${month} ${d.getDate()} – ${endMonth} ${friday.getDate()}`
}

export function WeekDays({ weekDays, weekStart, hasContent }: Props) {
  // Use browser's local clock — avoids Vercel UTC vs user timezone mismatch
  const localDow    = new Date().getDay()           // 0=Sun … 6=Sat
  const todayIndex  = localDow === 0 ? 5 : localDow // clamp Sunday → show Friday

  const currentMonday = getCurrentMondayStr()
  const isCurrentWeek = weekStart === currentMonday
  const prevWeek = addDays(weekStart, -7)
  const nextWeek = addDays(weekStart, 7)

  return (
    <>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href={`/dashboard?week=${prevWeek}`}
          className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-keen-600 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
        >
          ← Prev week
        </Link>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            {isCurrentWeek ? 'This Week' : 'Week of'}
          </p>
          <p className="text-sm font-bold text-gray-700">{formatWeekLabel(weekStart)}</p>
        </div>
        <Link
          href={isCurrentWeek ? '#' : `/dashboard?week=${nextWeek}`}
          className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-xl transition-all
            ${isCurrentWeek
              ? 'text-gray-300 cursor-default pointer-events-none'
              : 'text-gray-500 hover:text-keen-600 hover:bg-gray-100'}`}
          aria-disabled={isCurrentWeek}
        >
          Next week →
        </Link>
      </div>

      {!hasContent ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-xl font-bold text-gray-500">No activities for this week</p>
          <Link href="/dashboard" className="mt-4 inline-block text-keen-600 font-bold text-sm hover:underline">
            Go to current week →
          </Link>
        </div>
      ) : (
        <>
          {/* Today's highlight — only shown on current week */}
          {isCurrentWeek && weekDays
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
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            {isCurrentWeek ? 'This Week' : 'Activities'}
          </h2>
          <div className="flex flex-col gap-3">
            {weekDays.map(({ dow, subject, dayId, theme }) => {
              if (!subject) return null
              const colors  = SUBJECT_COLORS[subject as Subject]
              const isToday = isCurrentWeek && dow === todayIndex
              // Past days: earlier this week, OR any day in a past week
              const isPast  = isCurrentWeek ? (dow < todayIndex) : true
              return (
                <Link
                  key={dow}
                  href={dayId ? `/${subject}/day/${dayId}` : '#'}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                    ${isToday ? `${colors.light} ${colors.border} shadow-md` : 'bg-white border-gray-100 hover:border-gray-300'}
                    ${isPast && !isToday ? 'opacity-60' : ''}`}
                >
                  <span className="text-3xl w-10 text-center">{SUBJECT_EMOJI[subject as Subject]}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-700">{DAY_LABELS[dow]}</p>
                    <p className={`font-semibold ${colors.text}`}>{SUBJECT_LABEL[subject as Subject]}</p>
                    {theme && <p className="text-sm text-gray-400">{theme}</p>}
                  </div>
                  {isToday && <span className="text-xs font-bold bg-keen-600 text-white px-2 py-1 rounded-full">TODAY</span>}
                  {isPast && !isToday && <span className="text-xl">✅</span>}
                </Link>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

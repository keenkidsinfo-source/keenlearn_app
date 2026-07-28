'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/db/schema'

interface SpeakingMeta {
  weekWord?: string
  weekWordDef?: string
  prompt?: string
  timeLimit?: number   // seconds
  structure?: string[]
  tip?: string
  tipIcon?: string
}

interface Props {
  contentItemId: string
  title: string
  theme: string
  gradeBand: GradeBand | null
  completed: boolean
  meta: SpeakingMeta
}

function fmt(secs: number) {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
}

export function SpeakingActivity({ title, theme, gradeBand, completed, meta }: Props) {
  const router    = useRouter()
  const timeLimit = meta.timeLimit ?? (gradeBand === 'g3-4' ? 90 : 60)

  const [timerSecs, setTimerSecs] = useState(timeLimit)
  const [running, setRunning]     = useState(false)
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null)

  const prompt    = meta.prompt    ?? title
  const structure = meta.structure ?? ['Say your opening line', 'Share your main idea', 'Finish with a strong closing']
  const tip       = meta.tip       ?? 'Pause instead of saying "um" — silence sounds confident!'
  const tipIcon   = meta.tipIcon   ?? '💡'

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(prev => {
          if (prev <= 1) { setRunning(false); return 0 }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  function startTimer() { setTimerSecs(timeLimit); setRunning(true) }
  function stopTimer()  { setRunning(false); setTimerSecs(timeLimit) }

  // ── Completed state ──
  if (completed) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">🎤</div>
        <h2 className="text-3xl font-black text-teal-700 mb-2">Great job speaking up!</h2>
        <p className="text-teal-600">Your teacher marked you as presented.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 bg-teal-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-teal-500 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const timerColor = timerSecs <= 10
    ? 'text-red-500'
    : timerSecs <= 20
    ? 'text-orange-400'
    : 'text-teal-600'

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/dashboard')} className="text-teal-200 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">🎤 {title}</h1>
          {theme && <p className="text-teal-200 text-xs">{theme}</p>}
        </div>
        <form action="/api/v1/auth/logout" method="POST">
          <button type="submit" className="text-teal-300 hover:text-white text-xs font-semibold">Sign out</button>
        </form>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-4">

        {/* Word of the Day */}
        {meta.weekWord && (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-teal-100 p-4">
            <p className="text-xs font-black text-teal-500 uppercase tracking-wide mb-1">📖 Word of the Day</p>
            <p className="text-2xl font-black text-gray-800">{meta.weekWord}</p>
            {meta.weekWordDef && <p className="text-gray-500 text-sm italic mt-0.5">"{meta.weekWordDef}"</p>}
          </div>
        )}

        {/* Today's Prompt */}
        <div className="bg-teal-600 rounded-2xl p-5 text-white">
          <p className="text-xs font-black text-teal-200 uppercase tracking-wide mb-2">💬 Today's Prompt</p>
          <p className="text-xl font-black leading-snug">{prompt}</p>
          <p className="text-teal-200 text-xs mt-3">
            ⏱ {fmt(timeLimit)} to speak
          </p>
        </div>

        {/* Speaking Structure */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">Your Speaking Plan</p>
          <div className="space-y-2">
            {structure.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="bg-teal-100 text-teal-700 font-black text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-2xl shrink-0">{tipIcon}</span>
          <p className="text-yellow-800 text-sm font-semibold leading-snug">{tip}</p>
        </div>

        {/* Practice Timer */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">Practice Timer</p>
          <div className={`text-5xl font-black text-center mb-4 tabular-nums ${timerColor}`}>
            {fmt(timerSecs)}
          </div>
          {!running ? (
            <button
              onClick={startTimer}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-3 rounded-xl text-lg active:scale-95 transition-all"
            >
              {timerSecs === 0 ? '🔄 Try Again' : '▶ Practice!'}
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-xl"
            >
              Stop
            </button>
          )}
        </div>

        {/* Teacher marks done note */}
        <div className="text-center pb-2">
          <p className="text-gray-400 text-sm">
            When you're done presenting, your teacher will mark you complete. 🎤
          </p>
        </div>

      </main>
    </div>
  )
}

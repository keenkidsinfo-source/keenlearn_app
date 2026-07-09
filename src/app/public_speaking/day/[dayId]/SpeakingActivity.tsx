'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/db/schema'

interface SpeakingMeta {
  topic?: string
  prompt?: string
  timeLimit?: string
  outline?: string[]
  tips?: string[]
  checklist?: string[]
}

interface Props {
  contentItemId: string
  title: string
  theme: string
  gradeBand: GradeBand | null
  completed: boolean
  meta: SpeakingMeta
}

export function SpeakingActivity({ contentItemId, title, theme, gradeBand, completed, meta }: Props) {
  const router = useRouter()
  const [checked, setChecked]   = useState<Set<number>>(new Set())
  const [isDone, setIsDone]     = useState(completed)
  const [saving, setSaving]     = useState(false)
  const [practicing, setPracticing] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const checklist  = meta.checklist  ?? ['Make eye contact with the audience', 'Speak clearly and loud enough', 'Stand up straight', 'Use your outline — don\'t just read it word for word', 'Start with a strong opening sentence']
  const outline    = meta.outline    ?? ['Introduction — Tell us your topic', 'Body — Your main points (2–3 ideas)', 'Closing — What you want us to remember']
  const tips       = meta.tips       ?? ['Take a deep breath before you start', 'Practice once quietly to yourself first', 'It\'s OK to pause — pauses make you sound confident!']
  const timeLimit  = meta.timeLimit  ?? '2 minutes'
  const prompt     = meta.prompt     ?? title

  const timeLimitSecs = parseInt(timeLimit) * 60 || 120

  const save = useCallback(async (done: boolean) => {
    setSaving(true)
    try {
      await fetch(`/api/v1/sessions/${contentItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressPct: done ? 100 : 50, completed: done }),
      })
    } finally {
      setSaving(false)
    }
  }, [contentItemId])

  function toggleCheck(i: number) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function startTimer() {
    setPracticing(true)
    setTimeLeft(timeLimitSecs)
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) { clearInterval(interval); setPracticing(false); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  async function markDone() {
    setIsDone(true)
    await save(true)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  const allChecked = checked.size === checklist.length

  if (isDone) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">🎤</div>
        <h2 className="text-3xl font-black text-teal-700 mb-2">Great presentation!</h2>
        <p className="text-teal-600 text-lg">You did it — speaking takes courage!</p>
      </div>
    )
  }

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

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">

        {/* Topic card */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-teal-200 p-5">
          <p className="text-xs font-black text-teal-500 uppercase tracking-wide mb-1">Today's Topic</p>
          <h2 className="text-2xl font-black text-gray-800 leading-tight">{prompt}</h2>
          <p className="text-teal-600 text-sm mt-2 font-semibold">⏱ Time limit: {timeLimit}</p>
        </div>

        {/* Outline */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-black text-gray-700 mb-3">📋 Your Outline</h3>
          <div className="space-y-2">
            {outline.map((point, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="bg-teal-100 text-teal-700 font-black text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-gray-700 text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <h3 className="font-black text-yellow-800 mb-2">💡 Presentation Tips</h3>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-yellow-800 text-sm flex gap-2">
                <span>•</span><span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Practice timer */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-black text-gray-700 mb-3">🎯 Practice Run</h3>
          {timeLeft !== null && (
            <div className={`text-5xl font-black text-center mb-4 ${timeLeft < 30 ? 'text-red-500' : 'text-teal-600'}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          )}
          {!practicing ? (
            <button
              onClick={startTimer}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-3 rounded-xl text-lg active:scale-95 transition-all"
            >
              {timeLeft === 0 ? '🔄 Try Again' : '▶ Start Practice Timer'}
            </button>
          ) : (
            <button
              onClick={() => { setPracticing(false); setTimeLeft(null) }}
              className="w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-xl"
            >
              Stop Timer
            </button>
          )}
        </div>

        {/* Delivery checklist */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-black text-gray-700 mb-3">✅ Delivery Checklist <span className="text-gray-400 font-normal text-sm">({checked.size}/{checklist.length})</span></h3>
          <div className="space-y-2">
            {checklist.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  checked.has(i)
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'border-gray-100 hover:border-teal-200'
                }`}
              >
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-black ${
                  checked.has(i) ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300'
                }`}>
                  {checked.has(i) ? '✓' : ''}
                </span>
                <span className="text-sm">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mark done */}
        <button
          onClick={markDone}
          disabled={saving}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 ${
            allChecked
              ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {saving ? 'Saving…' : allChecked ? '🎤 I Presented! Mark Complete' : `Check all ${checklist.length} boxes first`}
        </button>

      </main>
    </div>
  )
}

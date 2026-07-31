'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/db/schema'

interface Props {
  contentItemId: string
  dayId: string
  gradeBand: GradeBand
  buildTitle: string
  myStudentId: string
  initial: {
    a: string
    b: string
    c: string
    note: string
  }
}

interface LeaderEntry {
  studentId: string
  name: string
  a: number | null
  b: number | null
  c: number | null
  note: string
}

export function ResultsForm({ contentItemId, dayId, gradeBand, buildTitle, myStudentId, initial }: Props) {
  const router = useRouter()
  const isG12 = gradeBand === 'g1-2'

  const [a, setA] = useState(initial.a)
  const [b, setB] = useState(initial.b)
  const [c, setC] = useState(initial.c)
  const [note, setNote] = useState(initial.note)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!initial.c)
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])

  const colA = isG12 ? 'Round 1 — paperclips carried' : 'No cargo — how many cranks?'
  const colB = isG12 ? 'After your fix — clips carried' : '3 pennies in bucket — cranks?'
  const colC = isG12 ? 'Your BEST — maximum paperclips 🏆' : 'After improvement — cranks 🏆'
  const unit = isG12 ? 'clips' : 'cranks'

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/build/${dayId}/results`)
      if (!res.ok) return
      const json = await res.json()
      const entries: LeaderEntry[] = json.data ?? []
      // Sort: G1-2 more = better; G3-4 fewer = better
      entries.sort((a, b) =>
        isG12
          ? (b.c ?? 0) - (a.c ?? 0)
          : (a.c ?? 999) - (b.c ?? 999)
      )
      setLeaderboard(entries)
    } catch {}
  }, [dayId, isG12])

  useEffect(() => {
    if (saved && !isG12) {
      fetchLeaderboard()
      // Poll every 10s while on the page so new submissions appear
      const id = setInterval(fetchLeaderboard, 10000)
      return () => clearInterval(id)
    }
  }, [saved, fetchLeaderboard])

  async function submit() {
    setSaving(true)
    try {
      const buildResults = isG12
        ? { round1Clips: parseInt(a) || null, afterFixClips: parseInt(b) || null, maxClips: parseInt(c) || null, note }
        : { cranksNoLoad: parseInt(a) || null, cranksWithLoad: parseInt(b) || null, cranksImproved: parseInt(c) || null, note }

      await fetch(`/api/v1/sessions/${contentItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionData: { buildResults } }),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const maxMetric = Math.max(...leaderboard.map(e => e.c ?? 0), 1)
  const medal = ['🥇', '🥈', '🥉']

  if (saved) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col">
        <header className="bg-teal-700 text-white px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.push(`/build/day/${dayId}`)} className="text-teal-200 text-2xl">←</button>
          <div>
            <h1 className="font-black text-lg">📊 Class Results</h1>
            <p className="text-teal-200 text-sm">{buildTitle}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">

          {/* My result */}
          <div className="bg-teal-600 text-white rounded-2xl p-5 text-center shadow">
            <p className="text-teal-200 text-sm font-semibold mb-1">Your result</p>
            <p className="text-5xl font-black">{c || '—'}</p>
            <p className="text-teal-200 text-sm mt-1">{unit}</p>
            {note && <p className="text-teal-100 text-xs mt-2 italic">"{note}"</p>}
          </div>

          {/* Leaderboard — G3-4 only */}
          {!isG12 && leaderboard.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-teal-50 border-b border-teal-100 px-4 py-3">
                <h2 className="font-black text-teal-800 text-sm">
                  {isG12 ? '🏆 Most Paperclips' : '🏆 Fewest Cranks'} — Class Leaderboard
                </h2>
                <p className="text-teal-500 text-xs">Updates live as classmates submit</p>
              </div>
              <div className="flex flex-col divide-y divide-gray-50">
                {leaderboard.map((entry, i) => {
                  const isMe = entry.studentId === myStudentId
                  const pct = isG12
                    ? Math.max(8, Math.round(((entry.c ?? 0) / maxMetric) * 100))
                    : Math.max(8, Math.round((1 - ((entry.c ?? 0) / Math.max(maxMetric, 1))) * 94) + 8)
                  const barColor = i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : i === 2 ? 'bg-orange-300' : 'bg-teal-200'

                  return (
                    <div key={entry.studentId} className={`px-4 py-3 ${isMe ? 'bg-teal-50' : ''}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg w-7 text-center">{medal[i] ?? `${i + 1}.`}</span>
                        <span className={`flex-1 text-sm font-bold truncate ${isMe ? 'text-teal-700' : 'text-gray-700'}`}>
                          {entry.name}{isMe ? ' (you)' : ''}
                        </span>
                        <span className={`text-sm font-black ${isMe ? 'text-teal-600' : 'text-gray-600'}`}>
                          {entry.c} {unit}
                        </span>
                      </div>
                      <div className="ml-9 h-4 bg-gray-100 rounded overflow-hidden">
                        <div
                          className={`h-full rounded transition-all duration-700 ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {entry.note && (
                        <p className="ml-9 text-xs text-gray-400 italic mt-1">"{entry.note}"</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : !isG12 ? (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-400">
              <p className="text-2xl mb-2">⏳</p>
              <p className="text-sm">Waiting for classmates to submit…</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 pb-4">
            <button
              onClick={() => setSaved(false)}
              className="w-full py-3 rounded-2xl border-2 border-teal-300 text-teal-700 font-bold text-sm"
            >
              ✏️ Update my numbers
            </button>
            <button
              onClick={() => router.push(`/build/day/${dayId}`)}
              className="w-full py-3 rounded-2xl bg-orange-500 text-white font-black"
            >
              ← Back to Build Steps
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      <header className="bg-teal-700 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push(`/build/day/${dayId}`)} className="text-teal-200 text-2xl">←</button>
        <div>
          <h1 className="font-black text-lg">📊 My Results</h1>
          <p className="text-teal-200 text-sm">{buildTitle}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">

        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm text-gray-500">Enter your numbers — your teacher will see them on the class chart.</p>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">{colA}</label>
            <input
              type="number" min="0" inputMode="numeric"
              value={a} onChange={e => setA(e.target.value)}
              onFocus={e => e.currentTarget.select()}
              placeholder={unit}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl font-black text-center focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">{colB}</label>
            <input
              type="number" min="0" inputMode="numeric"
              value={b} onChange={e => setB(e.target.value)}
              onFocus={e => e.currentTarget.select()}
              placeholder={unit}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl font-black text-center focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-teal-700 mb-1">{colC}</label>
            <input
              type="number" min="0" inputMode="numeric"
              value={c} onChange={e => setC(e.target.value)}
              onFocus={e => e.currentTarget.select()}
              placeholder={unit}
              className="w-full border-2 border-teal-400 rounded-xl px-4 py-3 text-2xl font-black text-center focus:outline-none focus:border-teal-600 bg-teal-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Note (optional)</label>
            <input
              type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="e.g. I used a longer strip!"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-300"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={saving || !c}
          className="w-full min-h-[56px] rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-lg disabled:opacity-40 shadow transition-all"
        >
          {saving ? '📤 Saving…' : '📊 Submit & See Class Results'}
        </button>

        <p className="text-xs text-center text-gray-400">
          You can update your numbers anytime before class ends.
        </p>
      </main>
    </div>
  )
}

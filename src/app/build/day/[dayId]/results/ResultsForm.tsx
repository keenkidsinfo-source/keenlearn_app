'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ResultFields } from '@/lib/build-result-fields'

interface Props {
  contentItemId: string
  dayId: string
  buildTitle: string
  myStudentId: string
  resultFields: ResultFields
  initial: { a: string; b: string; c: string; note: string }
}

interface LeaderEntry {
  studentId: string
  name: string
  a: number | null
  b: number | null
  c: number | null
  note: string
}

export function ResultsForm({ contentItemId, dayId, buildTitle, myStudentId, resultFields, initial }: Props) {
  const router = useRouter()
  const { unit, leaderboard: leaderDir, showLeaderboard } = resultFields
  const hasC = !!resultFields.c

  const [a, setA] = useState(initial.a)
  const [b, setB] = useState(initial.b)
  const [c, setC] = useState(initial.c)
  const [note, setNote] = useState(initial.note)
  const [saving, setSaving] = useState(false)
  // Consider saved if any primary field has data
  const [saved, setSaved] = useState(!!(initial.a || initial.b || initial.c))
  const [board, setBoard] = useState<LeaderEntry[]>([])

  // Key metric for leaderboard: c if present, else b
  const myMetric = hasC ? c : b

  const fetchBoard = useCallback(async () => {
    if (!showLeaderboard) return
    try {
      const res = await fetch(`/api/v1/build/${dayId}/results`)
      if (!res.ok) return
      const json = await res.json()
      const entries: LeaderEntry[] = json.data ?? []
      entries.sort((x, y) =>
        leaderDir === 'more'
          ? (y.c ?? y.b ?? 0) - (x.c ?? x.b ?? 0)
          : (x.c ?? x.b ?? 999) - (y.c ?? y.b ?? 999)
      )
      setBoard(entries)
    } catch {}
  }, [dayId, leaderDir, showLeaderboard])

  useEffect(() => {
    if (saved && showLeaderboard) {
      fetchBoard()
      const id = setInterval(fetchBoard, 10000)
      return () => clearInterval(id)
    }
  }, [saved, showLeaderboard, fetchBoard])

  async function submit() {
    setSaving(true)
    try {
      const buildResults: Record<string, any> = {
        [resultFields.a.key]: parseInt(a) || null,
        [resultFields.b.key]: parseInt(b) || null,
        note,
      }
      if (hasC && resultFields.c) {
        buildResults[resultFields.c.key] = parseInt(c) || null
      }
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

  // Fields to render — always A and B, C only when defined
  type FieldKey = 'a' | 'b' | 'c'
  const fields: Array<[FieldKey, string, React.Dispatch<React.SetStateAction<string>>]> = [
    ['a', a, setA],
    ['b', b, setB],
    ...(hasC ? [['c', c, setC] as [FieldKey, string, React.Dispatch<React.SetStateAction<string>>]] : []),
  ]

  const maxMetric = Math.max(...board.map(e => e.c ?? e.b ?? 0), 1)
  const medal = ['🥇', '🥈', '🥉']

  if (saved) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col">
        <header className="bg-teal-700 text-white px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-teal-200 text-2xl">←</button>
          <div>
            <h1 className="font-black text-lg">📊 Class Results</h1>
            <p className="text-teal-200 text-sm">{buildTitle}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">

          {/* My result */}
          <div className="bg-teal-600 text-white rounded-2xl p-5 text-center shadow">
            <p className="text-teal-200 text-sm font-semibold mb-1">Your result</p>
            <p className="text-5xl font-black">{myMetric || '—'}</p>
            <p className="text-teal-200 text-sm mt-1">{unit}</p>
            {note && <p className="text-teal-100 text-xs mt-2 italic">&ldquo;{note}&rdquo;</p>}
          </div>

          {/* Leaderboard — only shown if showLeaderboard is true */}
          {showLeaderboard && (
            board.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-teal-50 border-b border-teal-100 px-4 py-3">
                  <h2 className="font-black text-teal-800 text-sm">
                    🏆 {leaderDir === 'more' ? 'Most' : 'Fewest'} {unit} — Class Leaderboard
                  </h2>
                  <p className="text-teal-500 text-xs">Updates live as classmates submit</p>
                </div>
                <div className="flex flex-col divide-y divide-gray-50">
                  {board.map((entry, i) => {
                    const metric = entry.c ?? entry.b ?? 0
                    const isMe = entry.studentId === myStudentId
                    const pct = leaderDir === 'more'
                      ? Math.max(8, Math.round((metric / maxMetric) * 100))
                      : Math.max(8, Math.round((1 - (metric / Math.max(maxMetric, 1))) * 94) + 8)
                    const barColor = i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : i === 2 ? 'bg-orange-300' : 'bg-teal-200'
                    return (
                      <div key={entry.studentId} className={`px-4 py-3 ${isMe ? 'bg-teal-50' : ''}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg w-7 text-center">{medal[i] ?? `${i + 1}.`}</span>
                          <span className={`flex-1 text-sm font-bold truncate ${isMe ? 'text-teal-700' : 'text-gray-700'}`}>
                            {entry.name}{isMe ? ' (you)' : ''}
                          </span>
                          <span className={`text-sm font-black ${isMe ? 'text-teal-600' : 'text-gray-600'}`}>
                            {metric} {unit}
                          </span>
                        </div>
                        <div className="ml-9 h-4 bg-gray-100 rounded overflow-hidden">
                          <div className={`h-full rounded transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        {entry.note && <p className="ml-9 text-xs text-gray-400 italic mt-1">&ldquo;{entry.note}&rdquo;</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-400">
                <p className="text-2xl mb-2">⏳</p>
                <p className="text-sm">Waiting for classmates to submit…</p>
              </div>
            )
          )}

          <div className="flex flex-col gap-2 pb-4">
            <button onClick={() => setSaved(false)} className="w-full py-3 rounded-2xl border-2 border-teal-300 text-teal-700 font-bold text-sm">
              ✏️ Update my numbers
            </button>
            <button onClick={() => router.push('/dashboard')} className="w-full py-3 rounded-2xl bg-orange-500 text-white font-black">
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      <header className="bg-teal-700 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-teal-200 text-2xl">←</button>
        <div>
          <h1 className="font-black text-lg">📊 My Results</h1>
          <p className="text-teal-200 text-sm">{buildTitle}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm text-gray-500">Enter your numbers — your teacher will see them on the class chart.</p>

          {fields.map(([field, val, setter]) => (
            <div key={field}>
              <label className={`block text-sm font-bold mb-1 ${field === 'c' ? 'text-teal-700' : 'text-gray-600'}`}>
                {resultFields[field]!.label}
              </label>
              <input
                type="number" min="0" inputMode="numeric"
                value={val} onChange={e => setter(e.target.value)}
                onFocus={e => e.currentTarget.select()}
                placeholder={unit}
                className={`w-full border-2 rounded-xl px-4 py-3 font-black text-center focus:outline-none transition-colors
                  ${field === 'c'
                    ? 'border-teal-400 text-2xl bg-teal-50 focus:border-teal-600'
                    : 'border-gray-200 text-xl focus:border-teal-400'}`}
              />
            </div>
          ))}

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
          disabled={saving || !(a || b || c)}
          className="w-full min-h-[56px] rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-lg disabled:opacity-40 shadow transition-all"
        >
          {saving ? '📤 Saving…' : showLeaderboard ? '📊 Submit & See Class Results' : '📊 Submit My Results'}
        </button>

        <p className="text-xs text-center text-gray-400">You can update your numbers anytime before class ends.</p>
      </main>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import type { GradeBand } from '@/lib/db/schema'

interface Student {
  id: string
  name: string
  displayName: string | null
}

interface G12Result {
  round1Clips: string
  round2Clips: string
  maxClips: string
  note: string
}

interface G34Result {
  cranksNoLoad: string
  cranksWithLoad: string
  cranksImproved: string
  note: string
}

type Result = G12Result | G34Result

interface Props {
  students: Student[]
  gradeBand: GradeBand
  buildTitle: string
  buildDayId: string
  weekStartDate: string
}

function displayName(s: Student) {
  return s.displayName ?? s.name
}

function safeInt(v: string): number | undefined {
  const n = parseInt(v, 10)
  return isNaN(n) ? undefined : Math.max(0, n)
}

export function ChartClient({ students, gradeBand, buildTitle, buildDayId, weekStartDate }: Props) {
  const isG12 = gradeBand === 'g1-2'

  // Initialize result map
  const emptyResult = (): Result =>
    isG12
      ? { round1Clips: '', round2Clips: '', maxClips: '', note: '' }
      : { cranksNoLoad: '', cranksWithLoad: '', cranksImproved: '', note: '' }

  const [results, setResults] = useState<Record<string, Result>>(
    () => Object.fromEntries(students.map(s => [s.id, emptyResult()]))
  )

  const [sending, setSending] = useState(false)
  const [sentStatus, setSentStatus] = useState<{ sent: number; noMatch: number; errors: number } | null>(null)
  const [showPrint, setShowPrint] = useState(false)

  function update(studentId: string, field: string, value: string) {
    setResults(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }))
  }

  // Live leaderboard sorted by key metric
  const leaderboard = useMemo(() => {
    return students
      .map(s => {
        const r = results[s.id]
        const metric = isG12
          ? safeInt((r as G12Result).maxClips)
          : safeInt((r as G34Result).cranksImproved ?? (r as G34Result).cranksNoLoad)
        return { student: s, metric }
      })
      .filter(x => x.metric != null)
      .sort((a, b) =>
        isG12
          ? (b.metric ?? 0) - (a.metric ?? 0)   // more clips = better for G1-2
          : (a.metric ?? 999) - (b.metric ?? 999) // fewer cranks = better for G3-4
      )
  }, [results, students, isG12])

  const maxMetric = leaderboard[0]?.metric ?? 1

  async function sendToParents() {
    setSending(true)
    try {
      const payload = {
        weekStartDate,
        buildTitle,
        gradeBand,
        results: students.map(s => {
          const r = results[s.id]
          const base = { studentId: s.id, studentName: displayName(s) }
          if (isG12) {
            const g = r as G12Result
            return { ...base, round1Clips: safeInt(g.round1Clips), round2Clips: safeInt(g.round2Clips), maxClips: safeInt(g.maxClips), note: g.note || undefined }
          } else {
            const g = r as G34Result
            return { ...base, cranksNoLoad: safeInt(g.cranksNoLoad), cranksWithLoad: safeInt(g.cranksWithLoad), cranksImproved: safeInt(g.cranksImproved), note: g.note || undefined }
          }
        }).filter(r => {
          if (isG12) return (r as any).maxClips != null || (r as any).round1Clips != null
          return (r as any).cranksNoLoad != null || (r as any).cranksImproved != null
        }),
      }
      const res = await fetch('/api/v1/teacher/build-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.ok) {
        setSentStatus({ sent: data.data.sent, noMatch: data.data.noMatch, errors: data.data.errors })
      } else {
        alert('Error: ' + (data.error ?? 'Unknown error'))
      }
    } finally {
      setSending(false)
    }
  }

  if (showPrint) {
    return <PrintView students={students} results={results} isG12={isG12} buildTitle={buildTitle} onBack={() => setShowPrint(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-700 text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">📊 Class Results Chart</h1>
            <p className="text-teal-200 text-sm">{buildTitle} · {isG12 ? 'Grades 1–2' : 'Grades 3–4'}</p>
          </div>
          <a href={`/teacher`} className="text-teal-200 text-sm hover:text-white">← Dashboard</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Live leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-black text-gray-800 text-lg mb-3">
              {isG12 ? '🏆 Max Paperclips Leaderboard' : '🏆 Fewest Cranks Leaderboard'}
            </h2>
            <div className="flex flex-col gap-2">
              {leaderboard.map((entry, i) => {
                const pct = Math.max(8, Math.round(((entry.metric ?? 0) / Math.max(maxMetric, 1)) * 100))
                const barColor = i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : i === 2 ? 'bg-orange-300' : 'bg-teal-200'
                return (
                  <div key={entry.student.id} className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-black text-gray-400">{i + 1}</span>
                    <span className="w-28 text-sm font-semibold text-gray-700 truncate">{displayName(entry.student)}</span>
                    <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      >
                        <span className="text-xs font-black text-gray-700">{entry.metric}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Data entry table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 px-5 py-3">
            <h2 className="font-black text-teal-800 text-base">
              {isG12 ? '📎 Enter Paperclip Counts' : '🔩 Enter Crank Counts'}
            </h2>
            <p className="text-teal-600 text-xs mt-0.5">
              {isG12 ? 'Fill in each student\'s max cargo — leaderboard updates live.' : 'Fill in crank counts — leaderboard updates live as you type.'}
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {students.map(student => {
              const r = results[student.id]
              return (
                <div key={student.id} className="px-4 py-4">
                  <p className="font-bold text-gray-800 text-sm mb-2">{displayName(student)}</p>
                  {isG12 ? (
                    <div className="grid grid-cols-3 gap-2">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-semibold">Round 1 🔁</span>
                        <input
                          type="number" min="0" inputMode="numeric"
                          value={(r as G12Result).round1Clips}
                          onChange={e => update(student.id, 'round1Clips', e.target.value)}
                          placeholder="clips"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-teal-400"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-semibold">After Fix 🔧</span>
                        <input
                          type="number" min="0" inputMode="numeric"
                          value={(r as G12Result).round2Clips}
                          onChange={e => update(student.id, 'round2Clips', e.target.value)}
                          placeholder="clips"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-teal-400"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-teal-700">Max 🏆</span>
                        <input
                          type="number" min="0" inputMode="numeric"
                          value={(r as G12Result).maxClips}
                          onChange={e => update(student.id, 'maxClips', e.target.value)}
                          placeholder="clips"
                          className="border-2 border-teal-300 rounded-lg px-2 py-1.5 text-sm w-full font-bold focus:outline-none focus:border-teal-500"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-semibold">No cargo 🪣</span>
                        <input
                          type="number" min="0" inputMode="numeric"
                          value={(r as G34Result).cranksNoLoad}
                          onChange={e => update(student.id, 'cranksNoLoad', e.target.value)}
                          placeholder="cranks"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-teal-400"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-semibold">3 pennies 🪙</span>
                        <input
                          type="number" min="0" inputMode="numeric"
                          value={(r as G34Result).cranksWithLoad}
                          onChange={e => update(student.id, 'cranksWithLoad', e.target.value)}
                          placeholder="cranks"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-teal-400"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-teal-700">Improved 🏆</span>
                        <input
                          type="number" min="0" inputMode="numeric"
                          value={(r as G34Result).cranksImproved}
                          onChange={e => update(student.id, 'cranksImproved', e.target.value)}
                          placeholder="cranks"
                          className="border-2 border-teal-300 rounded-lg px-2 py-1.5 text-sm w-full font-bold focus:outline-none focus:border-teal-500"
                        />
                      </label>
                    </div>
                  )}
                  <input
                    type="text"
                    value={(r as any).note}
                    onChange={e => update(student.id, 'note', e.target.value)}
                    placeholder="Optional note (e.g. great improvement!)"
                    className="mt-2 w-full border border-gray-100 rounded-lg px-2 py-1 text-xs text-gray-500 focus:outline-none focus:border-teal-300"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {sentStatus ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-green-800 font-black text-lg">✅ Sent to parents!</p>
              <p className="text-green-700 text-sm mt-1">
                {sentStatus.sent} sent · {sentStatus.noMatch} no portal match · {sentStatus.errors} errors
              </p>
            </div>
          ) : (
            <button
              onClick={sendToParents}
              disabled={sending}
              className="w-full min-h-[56px] rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-lg transition-all disabled:opacity-50 shadow"
            >
              {sending ? '📤 Sending…' : '📧 Send Results to Parents'}
            </button>
          )}

          <button
            onClick={() => setShowPrint(true)}
            className="w-full min-h-[48px] rounded-2xl border-2 border-gray-300 text-gray-600 font-bold text-base transition-all hover:border-gray-400"
          >
            🖨️ Print Chart
          </button>
        </div>

      </main>
    </div>
  )
}

// ── Print view ────────────────────────────────────────────────────────────────

function PrintView({
  students, results, isG12, buildTitle, onBack,
}: {
  students: Student[]
  results: Record<string, Result>
  isG12: boolean
  buildTitle: string
  onBack: () => void
}) {
  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="print:hidden mb-4 flex gap-3">
        <button onClick={onBack} className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm">← Back</button>
        <button onClick={() => window.print()} className="bg-teal-600 text-white font-bold px-6 py-2 rounded-xl text-sm">🖨️ Print</button>
      </div>
      <h1 className="text-2xl font-black text-gray-800 mb-1">{buildTitle} — Class Results</h1>
      <p className="text-gray-500 text-sm mb-6">KeenKids STEAM · {isG12 ? 'Grades 1–2' : 'Grades 3–4'} · {new Date().toLocaleDateString()}</p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Student</th>
            {isG12 ? (
              <>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-700">Round 1 (clips)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-700">After Fix (clips)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-700">MAX (clips) 🏆</th>
              </>
            ) : (
              <>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-700">No Cargo (cranks)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-700">3 Pennies (cranks)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-700">Improved 🏆</th>
              </>
            )}
            <th className="border border-gray-300 px-3 py-2 text-left font-bold text-gray-700">Notes</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => {
            const r = results[s.id]
            return (
              <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-200 px-3 py-2 font-semibold">{displayName(s)}</td>
                {isG12 ? (
                  <>
                    <td className="border border-gray-200 px-3 py-2 text-center">{(r as G12Result).round1Clips || '—'}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{(r as G12Result).round2Clips || '—'}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center font-black">{(r as G12Result).maxClips || '—'}</td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-200 px-3 py-2 text-center">{(r as G34Result).cranksNoLoad || '—'}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{(r as G34Result).cranksWithLoad || '—'}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center font-black">{(r as G34Result).cranksImproved || '—'}</td>
                  </>
                )}
                <td className="border border-gray-200 px-3 py-2 text-gray-500 text-xs">{(r as any).note || ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import type { GradeBand } from '@/lib/db/schema'
import type { ResultFields } from '@/lib/build-result-fields'

interface Student {
  id: string
  name: string
  displayName: string | null
}

// G1-2 Cable Car: rounds 1 + 2 + max clips
// G3-4 Well Pulley: no-load + with-load + improved cranks
interface Row {
  a: string   // Round 1 clips  /  Cranks no-load
  b: string   // After fix clips /  Cranks with-load
  c: string   // Max clips       /  Cranks improved ← the KEY metric
  note: string
}

interface Props {
  students: Student[]
  gradeBand: GradeBand
  buildTitle: string
  buildDayId: string
  weekStartDate: string
  resultFields: ResultFields
  initialRows?: Record<string, { a: string; b: string; c: string; note: string }>
}

function display(s: Student) { return s.displayName ?? s.name }
function safeInt(v: string) { const n = parseInt(v, 10); return isNaN(n) ? undefined : Math.max(0, n) }

export function ChartClient({ students, gradeBand, buildTitle, buildDayId, weekStartDate, resultFields, initialRows = {} }: Props) {
  const isG12 = gradeBand === 'g1-2'

  const [rows, setRows] = useState<Record<string, Row>>(
    () => Object.fromEntries(students.map(s => [s.id, initialRows[s.id] ?? { a: '', b: '', c: '', note: '' }]))
  )
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; noMatch: number; errors: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPrint, setShowPrint] = useState(false)
  const tableRef = useRef<HTMLTableElement>(null)

  function set(id: string, field: keyof Row, value: string) {
    setRows(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  // Keyboard navigation: Enter/Tab moves to next input in reading order
  const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const inputs = tableRef.current?.querySelectorAll<HTMLInputElement>('input[data-nav]')
    if (!inputs) return
    const arr = Array.from(inputs)
    const idx = arr.indexOf(e.currentTarget)
    arr[idx + 1]?.focus()
  }, [])

  // Live leaderboard sorted by key metric (c)
  const leaderboard = useMemo(() => {
    return students
      .map(s => ({ student: s, metric: safeInt(rows[s.id].c) }))
      .filter(x => x.metric != null)
      .sort((a, b) =>
        resultFields.leaderboard === 'more'
          ? (b.metric ?? 0) - (a.metric ?? 0)
          : (a.metric ?? 999) - (b.metric ?? 999)
      )
  }, [rows, students, isG12])

  const maxMetric = Math.max(...leaderboard.map(x => x.metric ?? 0), 1)

  async function sendToParents() {
    setSending(true)
    setErrorMsg(null)
    try {
      const payload = {
        weekStartDate,
        buildTitle,
        gradeBand,
        results: students
          .map(s => {
            const r = rows[s.id]
            const base = { studentId: s.id, studentName: display(s) }
            if (isG12) {
              return { ...base, round1Clips: safeInt(r.a), round2Clips: safeInt(r.b), maxClips: safeInt(r.c), note: r.note || undefined }
            } else {
              return { ...base, cranksNoLoad: safeInt(r.a), cranksWithLoad: safeInt(r.b), cranksImproved: safeInt(r.c), note: r.note || undefined }
            }
          })
          .filter(r => isG12
            ? (r as any).maxClips != null || (r as any).round1Clips != null
            : (r as any).cranksImproved != null || (r as any).cranksNoLoad != null
          ),
      }

      const res = await fetch('/api/v1/teacher/build-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let json: any
      try { json = await res.json() } catch { json = null }

      if (res.ok && json?.data) {
        setSendResult({ sent: json.data.sent, noMatch: json.data.noMatch, errors: json.data.errors })
      } else {
        setErrorMsg(json?.error ?? `Server error ${res.status}`)
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Network error — check your connection')
    } finally {
      setSending(false)
    }
  }

  if (showPrint) return (
    <PrintView
      students={students} rows={rows} isG12={isG12}
      buildTitle={buildTitle} onBack={() => setShowPrint(false)}
    />
  )

  const colA = resultFields.a.label
  const colB = resultFields.b.label
  const colC = resultFields.c.label
  const unit  = resultFields.unit

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-700 text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">📊 Class Results Chart</h1>
            <p className="text-teal-200 text-sm">{buildTitle} · {isG12 ? 'Grades 1–2' : 'Grades 3–4'}</p>
          </div>
          <a href="/teacher" className="text-teal-200 text-sm hover:text-white">← Dashboard</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">

        {/* Live leaderboard bar chart */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-black text-gray-700 text-sm mb-3 uppercase tracking-wide">
              {isG12 ? '🏆 Most Paperclips' : '🏆 Fewest Cranks'}
            </h2>
            <div className="flex flex-col gap-1.5">
              {leaderboard.map((entry, i) => {
                const pct = isG12
                  ? Math.max(6, Math.round(((entry.metric ?? 0) / maxMetric) * 100))
                  : Math.max(6, Math.round((1 - (entry.metric ?? 0) / Math.max(maxMetric, 1)) * 100) + 10)
                const barColor = i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : i === 2 ? 'bg-orange-300' : 'bg-teal-200'
                return (
                  <div key={entry.student.id} className="flex items-center gap-2">
                    <span className="w-5 text-xs font-black text-gray-400 text-right">{i + 1}</span>
                    <span className="w-24 text-xs font-semibold text-gray-600 truncate">{display(entry.student)}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                      <div className={`h-full rounded flex items-center justify-end pr-2 transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }}>
                        <span className="text-xs font-black text-gray-700">{entry.metric}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Compact data-entry table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 px-4 py-2.5 flex items-center justify-between">
            <div>
              <p className="font-black text-teal-800 text-sm">
                {isG12 ? '📎 Enter Paperclip Counts' : '🔩 Enter Crank Counts'}
              </p>
              <p className="text-teal-500 text-xs">Press <kbd className="bg-teal-100 px-1 rounded">Enter</kbd> to jump to next field</p>
            </div>
            <span className="text-xs text-teal-500 font-semibold">{students.length} students</span>
          </div>

          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 w-32">Student</th>
                  <th className="text-center px-2 py-2 text-xs font-bold text-gray-400 w-24">{colA}</th>
                  <th className="text-center px-2 py-2 text-xs font-bold text-gray-400 w-24">{colB}</th>
                  <th className="text-center px-2 py-2 text-xs font-bold text-teal-600 w-24">{colC}</th>
                  <th className="text-left px-3 py-2 text-xs font-bold text-gray-400">Note (optional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(student => {
                  const r = rows[student.id]
                  const hasData = r.a || r.b || r.c
                  return (
                    <tr key={student.id} className={hasData ? 'bg-teal-50/30' : ''}>
                      <td className="px-4 py-2 font-semibold text-gray-800 text-sm whitespace-nowrap">{display(student)}</td>
                      {(['a', 'b', 'c'] as const).map(field => (
                        <td key={field} className="px-2 py-1.5 text-center">
                          <input
                            data-nav
                            type="number" min="0" inputMode="numeric"
                            value={r[field]}
                            onChange={e => set(student.id, field, e.target.value)}
                            onFocus={e => e.currentTarget.select()}
                            onKeyDown={handleKey}
                            placeholder={unit}
                            className={`w-20 text-center border rounded-lg px-1 py-1 text-sm focus:outline-none transition-colors
                              ${field === 'c'
                                ? 'border-teal-300 font-bold focus:border-teal-500 bg-teal-50'
                                : 'border-gray-200 focus:border-teal-300'}`}
                          />
                        </td>
                      ))}
                      <td className="px-3 py-1.5">
                        <input
                          data-nav
                          type="text"
                          value={r.note}
                          onChange={e => set(student.id, 'note', e.target.value)}
                          onKeyDown={handleKey}
                          placeholder="e.g. great improvement!"
                          className="w-full border border-gray-100 rounded-lg px-2 py-1 text-xs text-gray-500 focus:outline-none focus:border-teal-300"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Column legend */}
          <div className="border-t border-gray-100 px-4 py-2 flex gap-6 text-xs text-gray-400">
            <span><strong className="text-gray-500">{colA}:</strong> {isG12 ? 'First run, no changes' : 'No weight in bucket'}</span>
            <span><strong className="text-gray-500">{colB}:</strong> {isG12 ? 'After student improved their build' : '3 pennies in bucket'}</span>
            <span><strong className="text-teal-600">{colC}:</strong> {isG12 ? 'Their personal best — goes to parents' : 'After improvement — goes to parents'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}
          {sendResult ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-green-800 font-black text-lg">✅ Sent to parents!</p>
              <p className="text-green-700 text-sm mt-1">
                {sendResult.sent} sent · {sendResult.noMatch} no portal match · {sendResult.errors} errors
              </p>
              <button onClick={() => setSendResult(null)} className="mt-2 text-green-600 text-xs underline">Send again</button>
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
            className="w-full min-h-[44px] rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm transition-all hover:border-gray-300"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

      </main>
    </div>
  )
}

// ── Print view ────────────────────────────────────────────────────────────────

function PrintView({ students, rows, isG12, buildTitle, onBack }: {
  students: Student[]
  rows: Record<string, Row>
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
      <p className="text-gray-500 text-sm mb-5">KeenKids STEAM · {isG12 ? 'Grades 1–2' : 'Grades 3–4'} · {new Date().toLocaleDateString()}</p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Student</th>
            <th className="border border-gray-300 px-3 py-2 text-center">{isG12 ? 'Round 1 (clips)' : 'No Cargo (cranks)'}</th>
            <th className="border border-gray-300 px-3 py-2 text-center">{isG12 ? 'After Fix (clips)' : '3 Pennies (cranks)'}</th>
            <th className="border border-gray-300 px-3 py-2 text-center font-black">{isG12 ? 'MAX 🏆' : 'Improved 🏆'}</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => {
            const r = rows[s.id]
            const name = s.displayName ?? s.name
            return (
              <tr key={s.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                <td className="border border-gray-200 px-3 py-2 font-semibold">{name}</td>
                <td className="border border-gray-200 px-3 py-2 text-center">{r.a || '—'}</td>
                <td className="border border-gray-200 px-3 py-2 text-center">{r.b || '—'}</td>
                <td className="border border-gray-200 px-3 py-2 text-center font-black">{r.c || '—'}</td>
                <td className="border border-gray-200 px-3 py-2 text-gray-500 text-xs">{r.note}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

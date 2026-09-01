'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import type { GradeBand } from '@/lib/db/schema'
import type { ResultFields } from '@/lib/build-result-fields'

interface Student {
  id: string
  name: string
  displayName: string | null
}

interface Row {
  a: string
  b: string
  c: string   // empty string when c is not used
  note: string
}

interface Props {
  students: Student[]
  gradeBand: GradeBand
  buildTitle: string
  buildDayId: string
  weekStartDate: string
  classroomId: string
  resultFields: ResultFields
  initialRows?: Record<string, { a: string; b: string; c: string; note: string }>
}

function display(s: Student) { return s.displayName ?? s.name }
function safeInt(v: string) { const n = parseInt(v, 10); return isNaN(n) ? undefined : Math.max(0, n) }

export function ChartClient({ students, gradeBand, buildTitle, buildDayId, weekStartDate, classroomId, resultFields, initialRows = {} }: Props) {
  const isG12 = gradeBand === 'g1-2'

  // Derive column labels — must be before any useMemo that references them
  const colA  = resultFields.a.label
  const colB  = resultFields.b.label
  const colC  = resultFields.c?.label ?? null   // null = hide the C column
  const unit  = resultFields.unit
  const hasC  = colC !== null

  const [rows, setRows] = useState<Record<string, Row>>(
    () => Object.fromEntries(students.map(s => [s.id, initialRows[s.id] ?? { a: '', b: '', c: '', note: '' }]))
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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

  // Live leaderboard sorted by key metric (c if present, else b)
  const leaderboard = useMemo(() => {
    return students
      .map(s => ({ student: s, metric: safeInt(hasC ? rows[s.id].c : rows[s.id].b) }))
      .filter(x => x.metric != null)
      .sort((a, b) =>
        resultFields.leaderboard === 'more'
          ? (b.metric ?? 0) - (a.metric ?? 0)
          : (a.metric ?? 999) - (b.metric ?? 999)
      )
  }, [rows, students, hasC, resultFields.leaderboard])

  const maxMetric = Math.max(...leaderboard.map(x => x.metric ?? 0), 1)

  async function saveResults() {
    setSaving(true)
    setSaved(false)
    setErrorMsg(null)
    try {
      const payload = {
        weekStartDate,
        buildTitle,
        gradeBand,
        classroomId,
        results: students
          .map(s => {
            const r = rows[s.id]
            const base = { studentId: s.id, studentName: display(s) }
            const result: Record<string, any> = {
              ...base,
              [resultFields.a.key]: safeInt(r.a),
              [resultFields.b.key]: safeInt(r.b),
              note: r.note || undefined,
            }
            if (hasC && resultFields.c) {
              result[resultFields.c.key] = safeInt(r.c)
            }
            return result
          })
          .filter(r => {
            const aVal = r[resultFields.a.key]
            const bVal = r[resultFields.b.key]
            const cVal = hasC && resultFields.c ? r[resultFields.c.key] : undefined
            return aVal != null || bVal != null || cVal != null
          }),
      }

      const res = await fetch('/api/v1/teacher/build-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let json: any
      try { json = await res.json() } catch { json = null }

      if (res.ok) {
        setSaved(true)
      } else {
        setErrorMsg(json?.error ?? `Server error ${res.status}`)
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Network error — check your connection')
    } finally {
      setSaving(false)
    }
  }

  if (showPrint) return (
    <PrintView
      students={students} rows={rows} hasC={hasC}
      colA={colA} colB={colB} colC={colC}
      buildTitle={buildTitle} onBack={() => setShowPrint(false)}
      isG12={isG12}
    />
  )

  if (students.length === 0) return (
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
      <main className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <p className="text-5xl">👥</p>
        <h2 className="font-black text-gray-700 text-xl">No students yet</h2>
        <p className="text-gray-500 text-sm max-w-xs">Add students to your classroom first, then come back here to enter their results.</p>
        <a href="/teacher#students" className="mt-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-500 transition-all">
          + Add Students →
        </a>
      </main>
    </div>
  )

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
              {resultFields.leaderboard === 'more' ? '🏆 Most' : '🏆 Fewest'} {unit}
            </h2>
            <div className="flex flex-col gap-1.5">
              {leaderboard.map((entry, i) => {
                const pct = resultFields.leaderboard === 'more'
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
                {isG12 ? '📎 Enter Paperclip Counts' : '🪨 Enter Rock Counts'}
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
                  {hasC && <th className="text-center px-2 py-2 text-xs font-bold text-teal-600 w-24">{colC}</th>}
                  <th className="text-left px-3 py-2 text-xs font-bold text-gray-400">Note (optional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(student => {
                  const r = rows[student.id]
                  const hasData = r.a || r.b || (hasC && r.c)
                  return (
                    <tr key={student.id} className={hasData ? 'bg-teal-50/30' : ''}>
                      <td className="px-4 py-2 font-semibold text-gray-800 text-sm whitespace-nowrap">{display(student)}</td>
                      {/* Column A */}
                      <td className="px-2 py-1.5 text-center">
                        <input
                          data-nav
                          type="number" min="0" inputMode="numeric"
                          value={r.a}
                          onChange={e => set(student.id, 'a', e.target.value)}
                          onFocus={e => e.currentTarget.select()}
                          onKeyDown={handleKey}
                          placeholder={unit}
                          className="w-20 text-center border border-gray-200 rounded-lg px-1 py-1 text-sm focus:outline-none focus:border-teal-300 transition-colors"
                        />
                      </td>
                      {/* Column B */}
                      <td className="px-2 py-1.5 text-center">
                        <input
                          data-nav
                          type="number" min="0" inputMode="numeric"
                          value={r.b}
                          onChange={e => set(student.id, 'b', e.target.value)}
                          onFocus={e => e.currentTarget.select()}
                          onKeyDown={handleKey}
                          placeholder={unit}
                          className="w-20 text-center border border-gray-200 rounded-lg px-1 py-1 text-sm focus:outline-none focus:border-teal-300 transition-colors"
                        />
                      </td>
                      {/* Column C — only shown when hasC */}
                      {hasC && (
                        <td className="px-2 py-1.5 text-center">
                          <input
                            data-nav
                            type="number" min="0" inputMode="numeric"
                            value={r.c}
                            onChange={e => set(student.id, 'c', e.target.value)}
                            onFocus={e => e.currentTarget.select()}
                            onKeyDown={handleKey}
                            placeholder={unit}
                            className="w-20 text-center border border-teal-300 font-bold rounded-lg px-1 py-1 text-sm focus:outline-none focus:border-teal-500 bg-teal-50 transition-colors"
                          />
                        </td>
                      )}
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
          <div className="border-t border-gray-100 px-4 py-2 flex flex-wrap gap-4 text-xs text-gray-400">
            <span><strong className="text-gray-500">{colA}:</strong> first measurement</span>
            <span><strong className="text-gray-500">{colB}:</strong> after adjustment</span>
            {hasC && colC && (
              <span><strong className="text-teal-600">{colC}:</strong> key metric — goes to parents</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold text-center">
              ✅ Results saved — they&apos;ll appear in this week&apos;s parent email.
            </div>
          )}
          <button
            onClick={saveResults}
            disabled={saving}
            className="w-full min-h-[56px] rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-lg transition-all disabled:opacity-50 shadow"
          >
            {saving ? '💾 Saving…' : '💾 Save Results'}
          </button>
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

function PrintView({ students, rows, hasC, colA, colB, colC, buildTitle, onBack, isG12 }: {
  students: Student[]
  rows: Record<string, Row>
  hasC: boolean
  colA: string
  colB: string
  colC: string | null
  buildTitle: string
  onBack: () => void
  isG12: boolean
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
            <th className="border border-gray-300 px-3 py-2 text-center">{colA}</th>
            <th className="border border-gray-300 px-3 py-2 text-center">{colB}</th>
            {hasC && <th className="border border-gray-300 px-3 py-2 text-center font-black">{colC} 🏆</th>}
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
                {hasC && <td className="border border-gray-200 px-3 py-2 text-center font-black">{r.c || '—'}</td>}
                <td className="border border-gray-200 px-3 py-2 text-gray-500 text-xs">{r.note}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

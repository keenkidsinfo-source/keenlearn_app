'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

interface Student {
  id: string
  name: string
  displayName: string | null
  avatarId: number | null
  parentName: string | null
  parentEmail: string | null
}

interface ParsedRow {
  studentName: string
  parentName: string
  parentEmail: string
}

interface Props {
  students: Student[]
  onSaved: (updated: Student[]) => void
  onClose: () => void
}

export function BulkParentForm({ students, onSaved, onClose }: Props) {
  const [step, setStep]       = useState<'upload' | 'review' | 'done'>('upload')
  const [rows, setRows]       = useState<ParsedRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const fileRef               = useRef<HTMLInputElement>(null)

  // ── Parse uploaded file ───────────────────────────────────────────────────
  function handleFile(file: File) {
    setError('')
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data     = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet    = workbook.Sheets[workbook.SheetNames[0]]
        const json: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (json.length === 0) { setError('Spreadsheet appears empty.'); return }

        // Auto-detect columns — look for headers containing "student", "parent", "email"
        const headers = Object.keys(json[0])
        const findCol = (...keywords: string[]) =>
          headers.find(h => keywords.some(k => h.toLowerCase().includes(k))) ?? ''

        const studentCol = findCol('student', 'name', 'child', 'kid')
        const parentCol  = findCol('parent', 'guardian', 'contact')
        const emailCol   = findCol('email', 'mail')

        if (!studentCol || !emailCol) {
          setError(`Could not find required columns. Found: ${headers.join(', ')}. Make sure your spreadsheet has a "Student Name" column and an "Email" column.`)
          return
        }

        const parsed: ParsedRow[] = json.map(row => ({
          studentName: String(row[studentCol] ?? '').trim(),
          parentName:  String(row[parentCol]  ?? '').trim(),
          parentEmail: String(row[emailCol]   ?? '').trim().toLowerCase(),
        })).filter(r => r.studentName)

        if (parsed.length === 0) { setError('No rows found after parsing.'); return }
        setRows(parsed)
        setStep('review')
      } catch {
        setError('Could not read file. Please use .xlsx or .csv format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  function updateRow(i: number, field: 'studentName' | 'parentName' | 'parentEmail', value: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  // ── Save to DB ────────────────────────────────────────────────────────────
  async function saveAll() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/v1/teacher/students/bulk-parents', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ rows }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data?.error ?? `Error ${res.status}`); return }

      // Merge new values back into student list
      const rowMap = new Map(rows.map(r => [r.studentName.toLowerCase(), r]))
      const updated = students.map(s => {
        const key = (s.displayName ?? s.name).toLowerCase()
        const row = rowMap.get(key) ?? rowMap.get(s.name.toLowerCase())
        return row ? { ...s, parentName: row.parentName || null, parentEmail: row.parentEmail || null } : s
      })
      onSaved(updated)
      setStep('done')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-green-700 text-lg">Parent contacts saved!</p>
        <button onClick={onClose} className="mt-4 text-sm text-green-600 underline">Done</button>
      </div>
    )
  }

  // ── UPLOAD ────────────────────────────────────────────────────────────────
  if (step === 'upload') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-gray-800">Upload Parent Contacts</h3>
            <p className="text-xs text-gray-500 mt-0.5">Upload an Excel or Google Sheets export (.xlsx or .csv)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Template hint */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4 text-sm text-indigo-700">
          <p className="font-bold mb-1">Your spreadsheet should have these columns:</p>
          <div className="bg-white rounded-lg overflow-hidden border border-indigo-100 text-xs mt-2">
            <table className="w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-3 py-1.5 text-left font-bold">Student Name</th>
                  <th className="px-3 py-1.5 text-left font-bold">Parent Name</th>
                  <th className="px-3 py-1.5 text-left font-bold">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-indigo-50">
                  <td className="px-3 py-1.5 text-gray-500">Alice Smith</td>
                  <td className="px-3 py-1.5 text-gray-500">Jane Smith</td>
                  <td className="px-3 py-1.5 text-gray-500">jane@example.com</td>
                </tr>
                <tr className="border-t border-indigo-50">
                  <td className="px-3 py-1.5 text-gray-500">Bob Jones</td>
                  <td className="px-3 py-1.5 text-gray-500">Mark Jones</td>
                  <td className="px-3 py-1.5 text-gray-500">mark@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-indigo-500 mt-2">Column names don&apos;t need to match exactly &mdash; we&apos;ll detect them automatically.</p>
        </div>

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        >
          <div className="text-4xl mb-2">📊</div>
          <p className="font-bold text-gray-700">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">.xlsx or .csv</p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button onClick={onClose} className="mt-4 w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 text-sm">
          Cancel
        </button>
      </div>
    )
  }

  // ── REVIEW ────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-gray-800">Review & Save</h3>
          <p className="text-xs text-gray-500 mt-0.5">Edit any row before saving.</p>
        </div>
        <button onClick={() => setStep('upload')} className="text-xs text-indigo-600 underline">← Back</button>
      </div>

      <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left font-bold text-gray-600 text-xs">Student</th>
              <th className="px-3 py-2 text-left font-bold text-gray-600 text-xs">Parent Name</th>
              <th className="px-3 py-2 text-left font-bold text-gray-600 text-xs">Parent Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => {
              const matched = students.some(s =>
                (s.displayName ?? s.name).toLowerCase() === row.studentName.toLowerCase() ||
                s.name.toLowerCase() === row.studentName.toLowerCase()
              )
              return (
                <tr key={i} className={!matched ? 'bg-orange-50' : ''}>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      {!matched && <span title="No matching student found" className="text-orange-400 text-xs">⚠</span>}
                      <input
                        type="text"
                        value={row.studentName}
                        onChange={e => updateRow(i, 'studentName', e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="text"
                      value={row.parentName}
                      onChange={e => updateRow(i, 'parentName', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:border-indigo-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="email"
                      value={row.parentEmail}
                      onChange={e => updateRow(i, 'parentEmail', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:border-indigo-400 focus:outline-none"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setStep('upload')}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 text-sm"
        >
          Re-upload
        </button>
        <button
          onClick={saveAll}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-60 text-sm"
        >
          {loading ? 'Saving…' : `Save ${rows.length} rows`}
        </button>
      </div>
    </div>
  )
}

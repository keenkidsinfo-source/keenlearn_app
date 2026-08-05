'use client'

import { useState } from 'react'

interface Props {
  weekStartDate: string
  weekTitle: string
  studentCount: number
  classroomId?: string
}

type PreviewRow = {
  studentName: string
  matched: boolean
  parentName: string | null
  parentEmail: string | null
}

type ResultRow = {
  student: string
  status: 'sent' | 'no_email' | 'error'
  parentEmail?: string
}

type SendResult = {
  weekTitle: string
  sent: number
  noEmail: number
  errors: number
  results: ResultRow[]
}

export function SendReportButton({ weekStartDate, weekTitle, studentCount, classroomId }: Props) {
  const [state, setState]     = useState<'idle' | 'previewing' | 'preview' | 'sending' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState<PreviewRow[]>([])
  const [result, setResult]   = useState<SendResult | null>(null)
  const [errMsg, setErrMsg]   = useState('')

  async function loadPreview() {
    setState('previewing')
    try {
      const qs = new URLSearchParams({ weekStartDate, ...(classroomId ? { classroomId } : {}) })
      const res = await fetch(`/api/v1/teacher/send-report?${qs}`)
      const data = await res.json()
      if (!res.ok) { setErrMsg(data?.error ?? `Error ${res.status}`); setState('error'); return }
      setPreview(data.data.preview)
      setState('preview')
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Network error')
      setState('error')
    }
  }

  async function send() {
    setState('sending')
    try {
      const res = await fetch('/api/v1/teacher/send-report', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ weekStartDate, ...(classroomId ? { classroomId } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data?.error ?? `Error ${res.status}`); setState('error'); return }
      setResult(data.data)
      setState('done')
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Network error')
      setState('error')
    }
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (state === 'idle') {
    return (
      <button
        onClick={loadPreview}
        className="mt-2 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95"
      >
        📤 Send Weekly Report to Parents
      </button>
    )
  }

  // ── Loading preview ────────────────────────────────────────────────────────
  if (state === 'previewing') {
    return (
      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
        <p className="text-indigo-600 text-sm animate-pulse">Loading student emails…</p>
      </div>
    )
  }

  // ── Preview ───────────────────────────────────────────────────────────────
  if (state === 'preview') {
    const emailCount = preview.filter(p => p.matched).length
    const missing    = preview.filter(p => !p.matched)
    return (
      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="font-bold text-indigo-800 text-sm mb-1">📤 Ready to send — {weekTitle}</p>
        <p className="text-indigo-600 text-xs mb-3">
          {emailCount} of {preview.length} students have a parent email on file.
        </p>

        <div className="flex flex-col gap-1.5 mb-4">
          {preview.map((row, i) => (
            <div key={i} className="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2 border border-indigo-100">
              <span className="text-base">{row.matched ? '✅' : '📧'}</span>
              <span className="font-semibold text-gray-800 flex-1">{row.studentName}</span>
              {row.matched
                ? <span className="text-green-600 font-medium">{row.parentEmail}</span>
                : <span className="text-orange-500">No email on file</span>}
            </div>
          ))}
        </div>

        {missing.length > 0 && (
          <p className="text-orange-600 text-xs mb-3">
            {missing.map(r => r.studentName).join(', ')} {missing.length === 1 ? 'has' : 'have'} no parent email — add it in your student list to include them.
          </p>
        )}

        {emailCount === 0 ? (
          <p className="text-orange-600 text-xs font-semibold mb-3">
            No parent emails on file yet — edit each student to add one.
          </p>
        ) : null}

        <div className="flex gap-2">
          <button
            onClick={send}
            disabled={emailCount === 0}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-all"
          >
            Send to {emailCount} {emailCount === 1 ? 'parent' : 'parents'} →
          </button>
          <button
            onClick={() => setState('idle')}
            className="flex-1 border border-indigo-200 text-indigo-600 font-semibold py-2 rounded-xl text-sm hover:bg-white transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Sending ───────────────────────────────────────────────────────────────
  if (state === 'sending') {
    return (
      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
        <p className="text-indigo-700 text-sm font-semibold animate-pulse">📤 Sending emails…</p>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 font-bold text-sm mb-1">⚠ Something went wrong</p>
        <p className="text-red-600 text-xs mb-3">{errMsg}</p>
        <button onClick={() => setState('idle')} className="text-red-600 text-xs underline">Try again</button>
      </div>
    )
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (state === 'done' && result) {
    return (
      <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">✅</span>
          <p className="font-bold text-green-800 text-sm">
            {result.sent} {result.sent === 1 ? 'email' : 'emails'} sent to parents
          </p>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          {result.results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span>{r.status === 'sent' ? '✅' : r.status === 'no_email' ? '📧' : '⚠️'}</span>
              <span className="font-semibold text-gray-700">{r.student}</span>
              {r.status === 'sent'     && <span className="text-green-600">sent to {r.parentEmail}</span>}
              {r.status === 'no_email' && <span className="text-orange-500">skipped — no email</span>}
              {r.status === 'error'    && <span className="text-red-500">failed</span>}
            </div>
          ))}
        </div>

        <button onClick={() => setState('idle')} className="text-green-700 text-xs underline">Done</button>
      </div>
    )
  }

  return null
}

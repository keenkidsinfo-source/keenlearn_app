'use client'

import { useState } from 'react'

interface Props {
  weekStartDate: string
  weekTitle: string
  studentCount: number
}

type ResultRow = {
  student: string
  status: 'sent' | 'no_match' | 'error'
  portalName?: string
}

type SendResult = {
  weekTitle: string
  sent: number
  noMatch: number
  errors: number
  results: ResultRow[]
}

export function SendReportButton({ weekStartDate, weekTitle, studentCount }: Props) {
  const [state, setState]     = useState<'idle' | 'confirm' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult]   = useState<SendResult | null>(null)
  const [errMsg, setErrMsg]   = useState('')

  async function send() {
    setState('sending')
    try {
      const res = await fetch('/api/v1/teacher/send-report', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ weekStartDate }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data?.error ?? `Error ${res.status}`)
        setState('error')
        return
      }
      setResult(data.data)
      setState('done')
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Network error')
      setState('error')
    }
  }

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('confirm')}
        className="mt-2 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
      >
        📤 Send Weekly Report to Parents
      </button>
    )
  }

  if (state === 'confirm') {
    return (
      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="font-bold text-indigo-800 text-sm mb-1">📤 Send weekly report to parents?</p>
        <p className="text-indigo-700 text-xs mb-3">
          This will push <strong>{weekTitle}</strong> progress for <strong>{studentCount} students</strong> to the parent portal
          — science observations, coding, math scores, and speaking.
        </p>
        <div className="flex gap-2">
          <button
            onClick={send}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-all"
          >
            Yes, send it →
          </button>
          <button
            onClick={() => setState('idle')}
            className="flex-1 border border-indigo-200 text-indigo-600 font-semibold py-2 rounded-xl text-sm hover:bg-indigo-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (state === 'sending') {
    return (
      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
        <p className="text-indigo-700 text-sm font-semibold animate-pulse">📤 Sending to parent portal…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 font-bold text-sm mb-1">⚠ Send failed</p>
        <p className="text-red-600 text-xs mb-3">{errMsg}</p>
        <button onClick={() => setState('idle')} className="text-red-600 text-xs underline">Try again</button>
      </div>
    )
  }

  // done
  if (state === 'done' && result) {
    const allGood = result.noMatch === 0 && result.errors === 0
    return (
      <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{allGood ? '✅' : '⚠️'}</span>
          <p className="font-bold text-green-800 text-sm">
            {result.sent} of {result.sent + result.noMatch + result.errors} reports sent
          </p>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          {result.results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span>
                {r.status === 'sent'     ? '✅' :
                 r.status === 'no_match' ? '🔍' : '⚠️'}
              </span>
              <span className="font-semibold text-gray-700">{r.student}</span>
              {r.status === 'sent'     && <span className="text-green-600">→ {r.portalName}</span>}
              {r.status === 'no_match' && <span className="text-orange-500">No matching child in portal</span>}
              {r.status === 'error'    && <span className="text-red-500">Failed to write</span>}
            </div>
          ))}
        </div>

        {result.noMatch > 0 && (
          <p className="text-xs text-orange-600 mb-2">
            🔍 {result.noMatch} student{result.noMatch > 1 ? 's' : ''} had no matching child record in the portal.
            Check that the child&apos;s name in the portal matches the student&apos;s name here.
          </p>
        )}

        <button onClick={() => setState('idle')} className="text-green-700 text-xs underline">Done</button>
      </div>
    )
  }

  return null
}

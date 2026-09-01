'use client'

import { useState, useRef } from 'react'

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
  errorMsg?: string
}

type SendResult = {
  weekTitle: string
  sent: number
  noEmail: number
  errors: number
  results: ResultRow[]
}

/** Compress a File to a base64 JPEG, max 900px on the longest side */
function compressImage(file: File, maxDim = 900, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

export function SendReportButton({ weekStartDate, weekTitle, studentCount, classroomId }: Props) {
  const [state, setState]     = useState<'idle' | 'previewing' | 'preview' | 'sending' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState<PreviewRow[]>([])
  const [result, setResult]   = useState<SendResult | null>(null)
  const [errMsg, setErrMsg]   = useState('')
  const [photos, setPhotos]     = useState<string[]>([])   // base64 data URLs
  const [photoLoading, setPhotoLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set()) // selected parent emails
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function loadPreview() {
    setState('previewing')
    try {
      const qs = new URLSearchParams({ weekStartDate, ...(classroomId ? { classroomId } : {}) })
      const res = await fetch(`/api/v1/teacher/send-report?${qs}`)
      const data = await res.json()
      if (!res.ok) { setErrMsg(data?.error ?? `Error ${res.status}`); setState('error'); return }
      const rows: PreviewRow[] = data.data.preview
      setPreview(rows)
      // Select all matched students by default
      setSelected(new Set(rows.filter(r => r.matched && r.parentEmail).map(r => r.parentEmail!)))
      setState('preview')
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Network error')
      setState('error')
    }
  }

  function toggleStudent(email: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(email) ? next.delete(email) : next.add(email)
      return next
    })
  }

  function toggleAll(matched: PreviewRow[]) {
    const emails = matched.map(r => r.parentEmail!)
    const allSelected = emails.every(e => selected.has(e))
    setSelected(allSelected ? new Set() : new Set(emails))
  }

  async function handlePhotoFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = 6 - photos.length
    if (remaining <= 0) return
    setPhotoLoading(true)
    try {
      const toProcess = Array.from(files).slice(0, remaining)
      const compressed = await Promise.all(toProcess.map(f => compressImage(f)))
      setPhotos(prev => [...prev, ...compressed].slice(0, 6))
    } catch {
      // silently skip failed images
    } finally {
      setPhotoLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removePhoto(idx: number) {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  async function send() {
    setState('sending')
    try {
      const res = await fetch('/api/v1/teacher/send-report', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          weekStartDate,
          ...(classroomId ? { classroomId } : {}),
          photos:         photos.length > 0 ? photos : undefined,
          selectedEmails: Array.from(selected),
        }),
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
    const matched    = preview.filter(p => p.matched && p.parentEmail)
    const missing    = preview.filter(p => !p.matched)
    const allChecked = matched.length > 0 && matched.every(r => selected.has(r.parentEmail!))
    const sendCount  = selected.size
    return (
      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="font-bold text-indigo-800 text-sm mb-1">📤 Ready to send — {weekTitle}</p>
        <p className="text-indigo-600 text-xs mb-3">
          {matched.length} of {preview.length} students have a parent email on file.
        </p>

        {/* Student list with checkboxes */}
        {matched.length > 0 && (
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-xs text-gray-500">{sendCount} selected</span>
            <button
              onClick={() => toggleAll(matched)}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              {allChecked ? 'Deselect all' : 'Select all'}
            </button>
          </div>
        )}
        <div className="flex flex-col gap-1.5 mb-4">
          {preview.map((row, i) => (
            <div
              key={i}
              onClick={() => row.matched && row.parentEmail && toggleStudent(row.parentEmail)}
              className={`flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2 border transition-colors
                ${row.matched ? 'border-indigo-100 cursor-pointer hover:border-indigo-300' : 'border-gray-100 opacity-60'}`}
            >
              {row.matched && row.parentEmail ? (
                <input
                  type="checkbox"
                  checked={selected.has(row.parentEmail)}
                  onChange={() => toggleStudent(row.parentEmail!)}
                  onClick={e => e.stopPropagation()}
                  className="accent-indigo-600 shrink-0"
                />
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <span className="font-semibold text-gray-800 flex-1">{row.studentName}</span>
              {row.matched
                ? <span className="text-green-600 font-medium truncate max-w-[140px]">{row.parentEmail}</span>
                : <span className="text-orange-500">No email on file</span>}
            </div>
          ))}
        </div>

        {/* Photo upload */}
        <div className="bg-white border border-indigo-100 rounded-xl p-3 mb-4">
          <p className="text-xs font-bold text-gray-700 mb-2">
            📸 Add class photos <span className="font-normal text-gray-400">(optional, up to 6)</span>
          </p>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {photos.map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center leading-none hover:bg-black/80"
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length < 6 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photoLoading}
              className="w-full border-2 border-dashed border-indigo-200 rounded-lg py-2 text-xs text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 transition-colors disabled:opacity-50"
            >
              {photoLoading ? 'Compressing…' : `+ Add photo${photos.length > 0 ? ` (${6 - photos.length} left)` : 's'}`}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handlePhotoFiles(e.target.files)}
          />
        </div>

        {missing.length > 0 && (
          <p className="text-orange-600 text-xs mb-3">
            {missing.map(r => r.studentName).join(', ')} {missing.length === 1 ? 'has' : 'have'} no parent email — add it in your student list to include them.
          </p>
        )}

        {matched.length === 0 && (
          <p className="text-orange-600 text-xs font-semibold mb-3">
            No parent emails on file yet — edit each student to add one.
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={send}
            disabled={sendCount === 0}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-all"
          >
            Send to {sendCount} {sendCount === 1 ? 'parent' : 'parents'} →
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
              {r.status === 'error'    && <span className="text-red-500">failed{r.errorMsg ? ` — ${r.errorMsg}` : ''}</span>}
            </div>
          ))}
        </div>

        <button onClick={() => setState('idle')} className="text-green-700 text-xs underline">Done</button>
      </div>
    )
  }

  return null
}

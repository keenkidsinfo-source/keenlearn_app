'use client'

import { useState, useEffect } from 'react'

interface CoTeacher {
  id: string
  name: string
  email: string
  isPrimary: boolean
}

export function CoTeacherPanel() {
  const [coTeachers, setCoTeachers] = useState<CoTeacher[]>([])
  const [email, setEmail]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [fetching, setFetching]     = useState(true)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [open, setOpen]             = useState(false)

  useEffect(() => {
    if (!open) return
    setFetching(true)
    fetch('/api/v1/teacher/co-teachers')
      .then(r => r.json())
      .then(d => setCoTeachers(d?.data ?? []))
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [open])

  async function add() {
    if (!email.trim()) return
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/v1/teacher/co-teachers', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data?.error ?? `Error ${res.status}`); return }
      setSuccess(`${data.data.teacher.name} added!`)
      setEmail('')
      setCoTeachers(prev => [...prev, { ...data.data.teacher, isPrimary: false }])
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  async function remove(teacherId: string) {
    try {
      const res = await fetch(`/api/v1/teacher/co-teachers?teacherId=${teacherId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setError(data?.error ?? `Error ${res.status}`); return }
      setCoTeachers(prev => prev.filter(t => t.id !== teacherId))
    } catch { setError('Network error') }
  }

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>👥 Co-Teachers</span>
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {fetching ? (
            <p className="text-xs text-gray-400 animate-pulse">Loading…</p>
          ) : (
            <>
              {coTeachers.length === 0 ? (
                <p className="text-xs text-gray-400">No co-teachers assigned yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {coTeachers.map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded-lg px-3 py-2">
                      <span className="flex-1 font-semibold text-gray-700">{t.name}</span>
                      <span className="text-gray-400">{t.email}</span>
                      {t.isPrimary
                        ? <span className="text-indigo-500 font-semibold">Primary</span>
                        : <button onClick={() => remove(t.id)} className="text-red-400 hover:text-red-600 font-semibold">Remove</button>
                      }
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && add()}
                  placeholder="Co-teacher email address"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400"
                />
                <button
                  onClick={add}
                  disabled={loading || !email.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold px-3 py-2 rounded-lg text-xs transition-all"
                >
                  {loading ? '…' : 'Add'}
                </button>
              </div>

              {error   && <p className="text-red-500 text-xs">{error}</p>}
              {success && <p className="text-green-600 text-xs">{success}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (next !== confirm) { setError('New passwords don\'t match.'); return }
    if (next.length < 8)  { setError('New password must be at least 8 characters.'); return }

    setLoading(true)
    try {
      const res  = await fetch('/api/v1/auth/change-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Something went wrong.'); return }
      setDone(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-keen-100 to-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-black text-keen-700 mb-2">Password updated!</h1>
        <p className="text-gray-500 mb-6">Your new password is active.</p>
        <button
          onClick={() => router.back()}
          className="bg-keen-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-keen-500 transition-all"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-keen-100 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 bg-keen-600 text-white text-sm font-black px-3 py-1 rounded-xl mb-3 tracking-wide">KK·LEARN</div>
          <h1 className="text-3xl font-black text-keen-700">Change Password</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-center text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Current Password</label>
              <input
                type="password" value={current} onChange={e => setCurrent(e.target.value)}
                placeholder="Your current password" required autoFocus
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">New Password</label>
              <input
                type="password" value={next} onChange={e => setNext(e.target.value)}
                placeholder="At least 8 characters" required minLength={8}
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Confirm New Password</label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Same as above" required minLength={8}
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="bg-keen-600 hover:bg-keen-500 text-white font-black py-4 rounded-2xl text-lg mt-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? 'Updating…' : 'Update Password →'}
            </button>
          </form>

          <button
            onClick={() => router.back()}
            className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600"
          >
            ← Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

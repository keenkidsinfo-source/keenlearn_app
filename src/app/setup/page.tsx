'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [needed,   setNeeded]   = useState(false)
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  useEffect(() => {
    fetch('/api/v1/setup')
      .then(r => r.json())
      .then(j => { setNeeded(j.data?.needed); setChecking(false) })
      .catch(() => setChecking(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/v1/setup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
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

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">Checking…</div>
    )
  }

  if (!needed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-black text-gray-700 mb-2">Setup already complete</h1>
        <p className="text-gray-500 mb-6">An admin account already exists. Log in normally.</p>
        <button onClick={() => router.push('/login')}
          className="bg-keen-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-keen-500 transition-all">
          Go to Login →
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-gray-700 mb-2">Admin account created!</h1>
        <p className="text-gray-500 mb-6">You can now log in and access the admin dashboard.</p>
        <button onClick={() => router.push('/login')}
          className="bg-keen-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-keen-500 transition-all">
          Go to Login →
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-keen-100 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 bg-keen-600 text-white text-sm font-black px-3 py-1 rounded-xl mb-3 tracking-wide">KK·LEARN</div>
          <h1 className="text-3xl font-black text-keen-700">First-time Setup</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your KeenKids admin account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-center text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Anjana" required
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@keenkids.com" required
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters" required minLength={8}
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-keen-600 hover:bg-keen-500 text-white font-black py-4 rounded-2xl text-lg mt-2 disabled:opacity-50 transition-all active:scale-95">
              {loading ? 'Creating…' : 'Create Admin Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

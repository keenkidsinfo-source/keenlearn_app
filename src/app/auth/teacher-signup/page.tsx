'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SCHOOLS = [
  'Mattos Elementary',
  'Sinnott Elementary',
  'Other',
]

export default function TeacherSignupPage() {
  const router = useRouter()
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [done, setDone]             = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/teacher-signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password, schoolName, gradeLevel }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Something went wrong.'); return }
      setDone(true)
    } catch {
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-keen-100 to-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-black text-keen-700 mb-2">You&apos;re registered!</h1>
        <p className="text-gray-600 max-w-sm mb-6">
          Your account is pending approval. A KeenKids admin will review your application and you&apos;ll be able to log in once approved.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="bg-keen-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-keen-500 transition-all"
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-keen-100 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 bg-keen-600 text-white text-sm font-black px-3 py-1 rounded-xl mb-3 tracking-wide">KK·LEARN</div>
          <h1 className="text-3xl font-black text-keen-700">Teacher Sign Up</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your account — we&apos;ll approve it shortly</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-center text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jane@school.edu"
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400"
                required minLength={8}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">School</label>
              <select
                value={schoolName} onChange={e => setSchoolName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400 bg-white"
                required
              >
                <option value="">Select your school…</option>
                {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Grade you teach</label>
              <select
                value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 text-base focus:outline-none focus:border-keen-400 bg-white"
                required
              >
                <option value="">Select grade…</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
              </select>
            </div>

            <button
              type="submit" disabled={loading}
              className="bg-keen-600 hover:bg-keen-500 text-white font-black py-4 rounded-2xl text-lg mt-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-5">
            Already have an account?{' '}
            <a href="/login" className="text-keen-600 font-semibold hover:underline">Sign in →</a>
          </p>
        </div>
      </div>
    </div>
  )
}

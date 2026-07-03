'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

type LoginStep = 'select-type' | 'access-code' | 'enter-name' | 'disambiguate' | 'teacher-form'

interface NameOption { id: string; firstName: string }

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep]           = useState<LoginStep>('select-type')
  const [accessCode, setAccessCode] = useState('')
  const [lastName, setLastName]   = useState('')
  const [options, setOptions]     = useState<NameOption[]>([])
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  // Teacher form
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')

  // Pre-fill access code from URL ?code=KEEN01
  useEffect(() => {
    const code = searchParams.get('code')
    if (code && code.length === 6) {
      setAccessCode(code.toUpperCase())
      setStep('enter-name')
    }
  }, [searchParams])

  async function handleNameSubmit() {
    if (!lastName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'student', accessCode, lastName: lastName.trim() }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Something went wrong.'); return }

      if (json.data?.needsDisambiguation) {
        setOptions(json.data.options)
        setStep('disambiguate')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  async function handleDisambiguate(userId: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'student', accessCode, lastName: lastName.trim(), userId }),
      })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Something went wrong.'); return }
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  async function handleTeacherLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'teacher', email, password }),
      })
      if (!res.ok) { setError('Invalid email or password.'); return }
      router.push('/teacher')
    } catch {
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-keen-100 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 bg-keen-600 text-white text-sm font-black px-3 py-1 rounded-xl mb-3 tracking-wide">KK·LEARN</div>
          <h1 className="text-4xl font-black text-keen-700">KeenKids</h1>
          <p className="text-gray-500 mt-1">Learn something awesome today!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        {/* ── Step: select type ── */}
        {step === 'select-type' && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setStep('access-code')}
              className="subject-card bg-keen-50 border-2 border-keen-200 hover:border-keen-400">
              <span className="text-4xl">👦👧</span>
              <span className="text-xl font-bold text-keen-700">I&apos;m a Student</span>
            </button>
            <button onClick={() => setStep('teacher-form')}
              className="subject-card bg-gray-50 border-2 border-gray-200 hover:border-gray-400">
              <span className="text-4xl">👩‍🏫</span>
              <span className="text-xl font-bold text-gray-700">I&apos;m a Teacher</span>
            </button>
          </div>
        )}

        {/* ── Step: access code ── */}
        {step === 'access-code' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Enter your class code</h2>
            <input
              type="text"
              maxLength={6}
              value={accessCode}
              onChange={e => setAccessCode(e.target.value.toUpperCase())}
              placeholder="e.g. KEEN01"
              className="w-full text-center text-3xl font-black tracking-[0.3em] border-4 border-keen-200 rounded-2xl p-4 focus:outline-none focus:border-keen-500 uppercase"
              autoFocus
            />
            <button
              onClick={() => { setError(''); setStep('enter-name') }}
              disabled={accessCode.length !== 6}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              Next →
            </button>
            <button onClick={() => setStep('select-type')} className="w-full mt-3 text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {/* ── Step: enter last name ── */}
        {step === 'enter-name' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">What&apos;s your last name?</h2>
            <p className="text-center text-gray-400 text-sm mb-6">Type it exactly as your teacher wrote it</p>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Smith"
              className="w-full text-center text-3xl font-bold border-4 border-keen-200 rounded-2xl p-4 focus:outline-none focus:border-keen-500"
              autoCapitalize="words"
              autoComplete="off"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
            />
            <button
              onClick={handleNameSubmit}
              disabled={!lastName.trim() || loading}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Log In →'}
            </button>
            <button onClick={() => { setStep('access-code'); setLastName('') }} className="w-full mt-3 text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {/* ── Step: disambiguate ── */}
        {step === 'disambiguate' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Which one are you?</h2>
            <p className="text-center text-gray-400 text-sm mb-6">Tap your first name</p>
            <div className="flex flex-col gap-3">
              {options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleDisambiguate(opt.id)}
                  disabled={loading}
                  className="w-full py-5 text-2xl font-black text-keen-700 bg-keen-50 border-2 border-keen-200 hover:border-keen-500 hover:bg-keen-100 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {opt.firstName}
                </button>
              ))}
            </div>
            <button onClick={() => { setStep('enter-name'); setOptions([]) }} className="w-full mt-4 text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {/* ── Step: teacher form ── */}
        {step === 'teacher-form' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Teacher Login</h2>
            <form onSubmit={handleTeacherLogin} className="flex flex-col gap-4">
              <input type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl p-4 text-lg focus:outline-none focus:border-keen-400" required />
              <input type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl p-4 text-lg focus:outline-none focus:border-keen-400" required />
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <button onClick={() => setStep('select-type')} className="w-full mt-4 text-gray-400 text-sm">← Back</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

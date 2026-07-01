'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type LoginStep = 'select-type' | 'access-code' | 'pick-avatar' | 'enter-pin' | 'teacher-form'

interface Student {
  id: string
  name: string
  displayName: string | null
  avatarId: number | null
}

// Simple avatar display using emoji + colors (replace with real illustrations later)
const AVATARS = [
  { id: 1, emoji: '🦊', bg: 'bg-orange-100' },
  { id: 2, emoji: '🐼', bg: 'bg-gray-100' },
  { id: 3, emoji: '🦁', bg: 'bg-yellow-100' },
  { id: 4, emoji: '🐸', bg: 'bg-green-100' },
  { id: 5, emoji: '🦋', bg: 'bg-purple-100' },
  { id: 6, emoji: '🐬', bg: 'bg-blue-100' },
  { id: 7, emoji: '🦄', bg: 'bg-pink-100' },
  { id: 8, emoji: '🐉', bg: 'bg-red-100' },
]

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep]               = useState<LoginStep>('select-type')
  const [accessCode, setAccessCode]   = useState('')
  const [students, setStudents]       = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [pin, setPin]                 = useState('')
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  // Teacher form state
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  async function handleAccessCode() {
    if (accessCode.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/v1/classroom/students?code=${accessCode.toUpperCase()}`)
      const json = await res.json()
      if (!res.ok) { setError('Invalid classroom code. Try again!'); return }
      setStudents(json.data)
      setStep('pick-avatar')
    } catch {
      setError('Something went wrong. Try again!')
    } finally {
      setLoading(false)
    }
  }

  async function handlePinSubmit(fullPin?: string) {
    const pinToUse = fullPin ?? pin
    if (!selectedStudent || pinToUse.length !== 4) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'student', accessCode, userId: selectedStudent.id, pin: pinToUse }),
      })
      const json = await res.json()
      if (!res.ok) { setError('Wrong PIN! Try again.'); setPin(''); return }
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

  function handlePinDigit(digit: string) {
    if (pin.length < 4) {
      const next = pin + digit
      setPin(next)
      if (next.length === 4) setTimeout(() => handlePinSubmit(next), 200)
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
            <button
              onClick={() => setStep('access-code')}
              className="subject-card bg-keen-50 border-2 border-keen-200 hover:border-keen-400"
            >
              <span className="text-4xl">👦👧</span>
              <span className="text-xl font-bold text-keen-700">I&apos;m a Student</span>
            </button>
            <button
              onClick={() => setStep('teacher-form')}
              className="subject-card bg-gray-50 border-2 border-gray-200 hover:border-gray-400"
            >
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
              placeholder="e.g. KEEN42"
              className="w-full text-center text-3xl font-black tracking-[0.3em] border-4 border-keen-200 rounded-2xl p-4 focus:outline-none focus:border-keen-500 uppercase"
            />
            <button
              onClick={handleAccessCode}
              disabled={accessCode.length !== 6 || loading}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Next →'}
            </button>
            <button onClick={() => setStep('select-type')} className="w-full mt-3 text-gray-400 text-sm">
              ← Back
            </button>
          </div>
        )}

        {/* ── Step: pick avatar ── */}
        {step === 'pick-avatar' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Who are you?</h2>
            <div className="grid grid-cols-3 gap-3">
              {students.map(student => {
                const avatar = AVATARS.find(a => a.id === student.avatarId) ?? AVATARS[0]
                return (
                  <button
                    key={student.id}
                    onClick={() => { setSelectedStudent(student); setStep('enter-pin') }}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                      avatar.bg, 'border-transparent hover:border-keen-400 active:scale-95'
                    )}
                  >
                    <span className="text-4xl">{avatar.emoji}</span>
                    <span className="font-bold text-sm text-center leading-tight">
                      {student.displayName ?? student.name}
                    </span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep('access-code')} className="w-full mt-4 text-gray-400 text-sm">
              ← Back
            </button>
          </div>
        )}

        {/* ── Step: enter PIN ── */}
        {step === 'enter-pin' && selectedStudent && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">
              Hi {selectedStudent.displayName ?? selectedStudent.name}! 👋
            </h2>
            <p className="text-center text-gray-500 mb-6">Enter your 4-digit PIN</p>

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-8">
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className={cn(
                    'w-5 h-5 rounded-full transition-all',
                    i < pin.length ? 'bg-keen-600 scale-110' : 'bg-gray-200'
                  )}
                />
              ))}
            </div>

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-3">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                <button
                  key={i}
                  onClick={() => d === '⌫' ? setPin(p => p.slice(0,-1)) : d && handlePinDigit(d)}
                  disabled={!d && d !== '0'}
                  className={cn(
                    'h-16 rounded-2xl text-2xl font-bold transition-all active:scale-95',
                    d ? 'bg-gray-100 hover:bg-keen-100 text-gray-800' : 'opacity-0 pointer-events-none'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>

            {loading && <p className="text-center text-keen-600 mt-4 font-semibold">Logging in...</p>}

            <button onClick={() => { setStep('pick-avatar'); setPin('') }} className="w-full mt-4 text-gray-400 text-sm">
              ← Back
            </button>
          </div>
        )}

        {/* ── Step: teacher form ── */}
        {step === 'teacher-form' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Teacher Login</h2>
            <form onSubmit={handleTeacherLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl p-4 text-lg focus:outline-none focus:border-keen-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border-2 border-gray-200 rounded-2xl p-4 text-lg focus:outline-none focus:border-keen-400"
                required
              />
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <button onClick={() => setStep('select-type')} className="w-full mt-4 text-gray-400 text-sm">
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

type Phase = 'warmup' | 'session'

interface Student {
  id: string
  name: string
  displayName: string | null
  avatarId: number | null
}

interface ImprovGame {
  name: string
  description: string
  instructions: string[]
}

interface SpeakingMeta {
  weekWord?: string
  weekWordDef?: string
  prompt?: string
  timeLimit?: number   // seconds
  structure?: string[]
  improvGame?: ImprovGame
  tip?: string
  tipIcon?: string
}

interface Props {
  contentItemId: string
  meta: SpeakingMeta
  students: Student[]
  initialDoneIds: string[]
}

const AVATARS = ['🦊','🐼','🦁','🐸','🦋','🐬','🦄','🐉']

function fmt(secs: number) {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
}

export function SpeakingSession({ contentItemId, meta, students, initialDoneIds }: Props) {
  const [phase, setPhase]           = useState<Phase>('warmup')
  const [doneIds, setDoneIds]       = useState<Set<string>>(new Set(initialDoneIds))
  const [saving, setSaving]         = useState<string | null>(null) // studentId being saved
  const [timerSecs, setTimerSecs]   = useState<number>(meta.timeLimit ?? 60)
  const [running, setRunning]       = useState(false)
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null)

  const timeLimit = meta.timeLimit ?? 60
  const doneCount = doneIds.size
  const total     = students.length

  // ── Timer ──
  function startTimer() {
    setTimerSecs(timeLimit)
    setRunning(true)
  }

  function stopTimer() {
    setRunning(false)
    setTimerSecs(timeLimit)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(prev => {
          if (prev <= 1) {
            setRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  // ── Mark student done / undo ──
  const toggleDone = useCallback(async (studentId: string) => {
    const nowDone = !doneIds.has(studentId)
    setSaving(studentId)

    // Optimistic update
    setDoneIds(prev => {
      const next = new Set(prev)
      nowDone ? next.add(studentId) : next.delete(studentId)
      return next
    })

    try {
      await fetch('/api/v1/teacher/speaking/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, contentItemId, done: nowDone }),
      })
    } catch {
      // Revert on error
      setDoneIds(prev => {
        const next = new Set(prev)
        nowDone ? next.delete(studentId) : next.add(studentId)
        return next
      })
    } finally {
      setSaving(null)
    }
  }, [doneIds, contentItemId])

  // ── Timer color ──
  const timerColor = timerSecs <= 10
    ? 'text-red-500'
    : timerSecs <= 20
    ? 'text-orange-400'
    : 'text-teal-600'

  return (
    <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">

      {/* ── Phase tabs ── */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-teal-100">
        <button
          onClick={() => setPhase('warmup')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-black transition-all',
            phase === 'warmup'
              ? 'bg-teal-600 text-white shadow'
              : 'text-gray-500 hover:bg-teal-50'
          )}
        >
          🎭 Warm-Up
        </button>
        <button
          onClick={() => setPhase('session')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-black transition-all',
            phase === 'session'
              ? 'bg-teal-600 text-white shadow'
              : 'text-gray-500 hover:bg-teal-50'
          )}
        >
          🎤 Session
        </button>
      </div>

      {/* ════════════════════ WARM-UP ════════════════════ */}
      {phase === 'warmup' && (
        <>
          {meta.improvGame ? (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="mb-4">
                <p className="text-xs font-black text-teal-500 uppercase tracking-wide mb-1">Today's Warm-Up Game</p>
                <h2 className="text-2xl font-black text-gray-800">{meta.improvGame.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{meta.improvGame.description}</p>
              </div>

              <div className="bg-teal-50 rounded-xl p-4">
                <p className="text-xs font-black text-teal-600 uppercase tracking-wide mb-3">How to run it</p>
                <ol className="space-y-3">
                  {meta.improvGame.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="bg-teal-600 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-gray-400">
              <p>No warm-up game set for this week.</p>
            </div>
          )}

          <button
            onClick={() => setPhase('session')}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-3.5 rounded-2xl text-base active:scale-95 transition-all"
          >
            Ready — Start Speaking Session →
          </button>
        </>
      )}

      {/* ════════════════════ SESSION ════════════════════ */}
      {phase === 'session' && (
        <>
          {/* Word of the Day */}
          {meta.weekWord && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-xs font-black text-teal-500 uppercase tracking-wide mb-2">📖 Word of the Day</p>
              <p className="text-4xl font-black text-gray-800 tracking-wide mb-1">{meta.weekWord.toUpperCase()}</p>
              {meta.weekWordDef && (
                <p className="text-gray-500 text-sm italic">"{meta.weekWordDef}"</p>
              )}
            </div>
          )}

          {/* Tip + Prompt */}
          <div className="bg-teal-600 rounded-2xl p-5 text-white">
            {meta.tip && (
              <div className="flex items-start gap-2 mb-4 bg-teal-700 rounded-xl p-3">
                <span className="text-xl shrink-0">{meta.tipIcon ?? '💡'}</span>
                <p className="text-sm font-semibold leading-snug">{meta.tip}</p>
              </div>
            )}
            <p className="text-xs font-black text-teal-200 uppercase tracking-wide mb-2">💬 Today's Prompt</p>
            <p className="text-xl font-black leading-snug">{meta.prompt ?? 'No prompt set.'}</p>
            <p className="text-teal-200 text-xs mt-3 font-semibold">
              ⏱ {Math.floor(timeLimit / 60) > 0 ? `${Math.floor(timeLimit / 60)} min ` : ''}{timeLimit % 60 > 0 ? `${timeLimit % 60} sec` : ''} per student
            </p>
          </div>

          {/* Speaking Structure */}
          {meta.structure && meta.structure.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">Students follow this structure</p>
              <div className="space-y-2">
                {meta.structure.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="bg-teal-100 text-teal-700 font-black text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timer */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className={cn('text-6xl font-black text-center mb-4 tabular-nums', timerColor)}>
              {fmt(timerSecs)}
            </div>
            {!running ? (
              <button
                onClick={startTimer}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-3 rounded-xl text-lg active:scale-95 transition-all"
              >
                {timerSecs === 0 ? '🔄 Reset & Start' : '▶ Start Timer'}
              </button>
            ) : (
              <button
                onClick={stopTimer}
                className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-black py-3 rounded-xl text-lg active:scale-95 transition-all"
              >
                ⏹ Stop
              </button>
            )}
          </div>

          {/* Student Roster */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide">Students — tap to mark presented</p>
              <span className={cn(
                'text-sm font-black px-3 py-1 rounded-full',
                doneCount === total && total > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              )}>
                {doneCount}/{total}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {students.map(student => {
                const done    = doneIds.has(student.id)
                const loading = saving === student.id
                const avatar  = AVATARS[((student.avatarId ?? 1) - 1) % 8]

                return (
                  <button
                    key={student.id}
                    onClick={() => toggleDone(student.id)}
                    disabled={loading}
                    className={cn(
                      'flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all active:scale-95',
                      done
                        ? 'bg-teal-50 border-teal-300'
                        : 'border-gray-100 hover:border-teal-200 hover:bg-teal-50',
                      loading ? 'opacity-60' : ''
                    )}
                  >
                    <span className="text-xl shrink-0">{avatar}</span>
                    <span className={cn(
                      'text-sm font-bold flex-1 truncate',
                      done ? 'text-teal-700' : 'text-gray-700'
                    )}>
                      {student.displayName ?? student.name}
                    </span>
                    <span className={cn(
                      'text-base shrink-0',
                      done ? 'text-teal-500' : 'text-gray-200'
                    )}>
                      {loading ? '…' : done ? '✓' : '○'}
                    </span>
                  </button>
                )
              })}
            </div>

            {doneCount === total && total > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-green-700 font-black text-sm">🎉 Everyone has presented!</p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}

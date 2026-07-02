'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { GradeBand } from '@/lib/db/schema'

interface Question {
  id: number
  prompt: string
  choices: string[]
  answer: number   // index of correct choice
  phase: 'concrete' | 'pictorial' | 'abstract'
  emoji?: string
}

const FALLBACK_QUESTIONS: Question[] = [
  { id: 1, phase: 'concrete', emoji: '🍎', prompt: 'If you have 3 apples and get 2 more, how many do you have?', choices: ['4', '5', '6', '7'], answer: 1 },
  { id: 2, phase: 'pictorial', emoji: '🟡', prompt: '🟡🟡🟡 + 🟡🟡 = ?', choices: ['4', '5', '6', '7'], answer: 1 },
  { id: 3, phase: 'abstract', emoji: '✏️', prompt: '3 + 2 = ?', choices: ['4', '5', '6', '7'], answer: 1 },
]

const PHASE_LABELS = { concrete: '🧱 Hands-On', pictorial: '🎨 Picture', abstract: '✏️ Symbol' }
const PHASE_COLORS = { concrete: 'bg-amber-100 text-amber-800', pictorial: 'bg-blue-100 text-blue-800', abstract: 'bg-math-100 text-math-800' }

interface Props {
  contentItemId: string
  title: string
  description: string
  theme: string
  gradeBand: GradeBand | null
  completed: boolean
  existingSession: any
  questions?: Question[]
}

export function MathActivity({ contentItemId, title, description, theme, gradeBand, completed, existingSession, questions: propQuestions }: Props) {
  const router = useRouter()
  const questions = propQuestions?.length ? propQuestions : FALLBACK_QUESTIONS
  const [qIndex, setQIndex]     = useState(existingSession?.lastQ ?? 0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked]   = useState(false)
  const [score, setScore]       = useState(existingSession?.score ?? 0)
  const [isDone, setIsDone]     = useState(completed)
  const [saving, setSaving]     = useState(false)

  const current = questions[qIndex]
  const isG12   = gradeBand === 'g1-2'

  const save = useCallback(async (done: boolean, finalScore: number) => {
    setSaving(true)
    try {
      await fetch(`/api/v1/sessions/${contentItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressPct: Math.round(((qIndex + 1) / questions.length) * 100),
          lastStepIndex: qIndex,
          completed: done,
          sessionData: { lastQ: qIndex, score: finalScore },
        }),
      })
    } finally {
      setSaving(false)
    }
  }, [contentItemId, qIndex, questions.length])

  function check() {
    if (selected === null) return
    setChecked(true)
    if (selected === current.answer) setScore((s: number) => s + 1)
  }

  async function next() {
    const nextScore = selected === current.answer ? score + (checked ? 0 : 1) : score
    if (qIndex < questions.length - 1) {
      const n = qIndex + 1
      await save(false, nextScore)
      setQIndex(n); setSelected(null); setChecked(false)
    } else {
      await save(true, nextScore)
      setIsDone(true)
    }
  }

  if (isDone) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-math-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">{pct >= 80 ? '⭐' : '📚'}</div>
        <h1 className="text-3xl font-black text-math-700 mb-2">Math complete!</h1>
        <p className="text-gray-600 mb-2">You scored <strong>{score}/{questions.length}</strong></p>
        {pct >= 80 && <p className="text-math-600 font-bold mb-6">Amazing work! 🎉</p>}
        {pct < 80  && <p className="text-gray-500 mb-6">Keep practicing — you're getting it!</p>}
        <button onClick={() => router.push('/dashboard')} className="btn-primary bg-math-600">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-math-50 flex flex-col">
      <header className="bg-math-600 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-math-100 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">🔢 {title}</h1>
          {theme && <p className="text-math-200 text-xs">{theme}</p>}
        </div>
        <span className="text-math-100 font-bold text-sm">{qIndex + 1}/{questions.length}</span>
      </header>

      {/* Progress */}
      <div className="h-2 bg-math-100 flex">
        {questions.map((_, i) => (
          <div key={i} className={cn('flex-1', i < qIndex ? 'bg-math-700' : i === qIndex ? 'bg-math-400' : 'bg-math-100')} />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center p-4 max-w-lg mx-auto w-full gap-4">
        {/* Phase badge */}
        <span className={cn('self-start px-3 py-1 rounded-full text-xs font-bold', PHASE_COLORS[current.phase])}>
          {PHASE_LABELS[current.phase]}
        </span>

        {/* Question card */}
        <div className="w-full bg-white rounded-3xl shadow-md p-6">
          <div className="text-5xl text-center mb-4">{current.emoji}</div>
          <p className={cn('text-center font-bold text-gray-800', isG12 ? 'text-2xl' : 'text-xl')}>
            {current.prompt}
          </p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {current.choices.map((choice, i) => {
            const isCorrect = i === current.answer
            const isSelected = selected === i
            return (
              <button
                key={i}
                onClick={() => { if (!checked) { setSelected(i); setChecked(false) } }}
                className={cn(
                  'min-h-[64px] rounded-2xl font-bold text-xl transition-all active:scale-95 border-2',
                  !checked && isSelected ? 'border-math-500 bg-math-100 text-math-800' : '',
                  !checked && !isSelected ? 'border-gray-200 bg-white text-gray-800 hover:border-math-300' : '',
                  checked && isCorrect ? 'border-green-500 bg-green-100 text-green-800' : '',
                  checked && isSelected && !isCorrect ? 'border-red-400 bg-red-100 text-red-700' : '',
                  checked && !isSelected && !isCorrect ? 'border-gray-200 bg-white text-gray-400' : '',
                )}
              >
                {choice}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {checked && (
          <div className={cn('w-full rounded-2xl p-4 text-center font-bold text-lg',
            selected === current.answer ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-700'
          )}>
            {selected === current.answer ? '✅ Correct! Great job!' : `❌ The answer is ${current.choices[current.answer]}`}
          </div>
        )}
      </main>

      <footer className="p-4 pb-8 flex gap-3 max-w-lg mx-auto w-full">
        {!checked ? (
          <button
            onClick={check}
            disabled={selected === null}
            className="flex-1 min-h-[56px] rounded-2xl bg-math-600 text-white font-bold text-lg disabled:opacity-40 active:scale-95 transition-all"
          >
            Check ✓
          </button>
        ) : (
          <button
            onClick={next}
            className="flex-1 min-h-[56px] rounded-2xl bg-math-600 text-white font-bold text-lg active:scale-95 transition-all"
          >
            {qIndex === questions.length - 1 ? '🏁 Finish!' : 'Next →'}
          </button>
        )}
      </footer>
    </div>
  )
}

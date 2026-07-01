'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { GradeBand } from '@/lib/db/schema'

interface Props {
  contentItemId: string
  title: string
  description: string
  theme: string
  stepUrls: string[]
  initialStep: number
  completed: boolean
  gradeBand: GradeBand | null
}

export function ArtsActivity({ contentItemId, title, description, theme, stepUrls, initialStep, completed, gradeBand }: Props) {
  const router  = useRouter()
  const [step, setStep]     = useState(Math.max(0, initialStep))
  const [isDone, setIsDone] = useState(completed)
  const [saving, setSaving] = useState(false)
  const totalSteps          = stepUrls.length || 1

  const saveProgress = useCallback(async (stepIndex: number, done: boolean) => {
    setSaving(true)
    try {
      await fetch(`/api/v1/sessions/${contentItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastStepIndex: stepIndex,
          progressPct: Math.round((stepIndex / Math.max(totalSteps - 1, 1)) * 100),
          completed: done,
        }),
      })
    } finally {
      setSaving(false)
    }
  }, [contentItemId, totalSteps])

  async function goNext() {
    if (step < totalSteps - 1) {
      const n = step + 1; setStep(n); await saveProgress(n, false)
    } else {
      setIsDone(true); await saveProgress(step, true)
    }
  }
  async function goPrev() {
    if (step > 0) { const p = step - 1; setStep(p); await saveProgress(p, false) }
  }

  if (isDone) {
    return (
      <div className="min-h-screen bg-arts-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">🎨</div>
        <h1 className="text-3xl font-black text-arts-700 mb-2">Beautiful work!</h1>
        <p className="text-gray-600 mb-8">You completed <strong>{title}</strong></p>
        <button onClick={() => router.push('/dashboard')} className="btn-primary bg-arts-500">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arts-50 flex flex-col">
      <header className="bg-arts-500 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-arts-100 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">🎨 {title}</h1>
          {theme && <p className="text-arts-200 text-xs">{theme}</p>}
        </div>
        <span className="text-arts-100 font-bold text-sm">{step + 1}/{totalSteps}</span>
      </header>

      <div className="h-2 bg-arts-100 flex">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className={cn('flex-1', i < step ? 'bg-arts-700' : i === step ? 'bg-arts-400' : 'bg-arts-100')} />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center p-4 gap-4">
        <div className="w-full max-w-lg">
          <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-md overflow-hidden relative">
            {stepUrls[step] ? (
              <Image src={stepUrls[step]} alt={`Step ${step + 1}`} fill className="object-cover" priority />
            ) : (
              <div className="flex items-center justify-center h-full text-arts-200 text-6xl">🎨</div>
            )}
            <div className="absolute top-3 left-3 bg-arts-500 text-white font-black px-3 py-1 rounded-full text-sm">
              Step {step + 1}
            </div>
          </div>
        </div>

        {step === 0 && description && gradeBand === 'g3-4' && (
          <div className="w-full max-w-lg bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
          </div>
        )}
      </main>

      <footer className="p-4 pb-8 flex gap-3 max-w-lg mx-auto w-full">
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="flex-1 min-h-[56px] rounded-2xl border-2 border-arts-300 text-arts-700 font-bold text-lg disabled:opacity-30 active:scale-95 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          style={{ flex: 2 }}
          className="min-h-[56px] rounded-2xl bg-arts-500 text-white font-bold text-lg active:scale-95 transition-all shadow"
        >
          {step === totalSteps - 1 ? '✅ Done!' : 'Next →'}
        </button>
      </footer>
    </div>
  )
}

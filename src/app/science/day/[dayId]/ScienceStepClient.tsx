'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { GradeBand } from '@/lib/db/schema'

interface StepData {
  emoji: string
  title: string
  text: string
  tip?: string
}

interface Props {
  contentItemId: string
  title: string
  description: string
  theme: string
  stepUrls: string[]
  steps?: StepData[]
  initialStep: number
  completed: boolean
  gradeBand: GradeBand | null
}

export function ScienceStepClient({
  contentItemId, title, description, theme, stepUrls, steps,
  initialStep, completed, gradeBand,
}: Props) {
  const router = useRouter()
  const [step, setStep]     = useState(Math.max(0, initialStep))
  const [isDone, setIsDone] = useState(completed)
  const [saving, setSaving] = useState(false)

  const totalSteps = steps?.length ?? stepUrls.length

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

  async function startOver() {
    setStep(0); setIsDone(false); await saveProgress(0, false)
  }

  if (isDone) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">🔬</div>
        <h1 className="text-3xl font-black text-teal-700 mb-2">Experiment Done!</h1>
        <p className="text-gray-600 mb-6">You completed <strong>{title}</strong></p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => router.push('/dashboard')} className="btn-primary bg-teal-600">
            Back to Home
          </button>
          <button onClick={startOver} className="text-teal-600 font-bold text-sm underline">
            Start over from Step 1
          </button>
        </div>
      </div>
    )
  }

  const currentUrl  = stepUrls[step]
  const currentStep = steps?.[step]
  const isG12       = gradeBand === 'g1-2'

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-teal-100 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
              {isG12 ? 'Grades 1–2' : 'Grades 3–4'}
            </span>
          </div>
          <h1 className={`font-black truncate ${isG12 ? 'text-xl' : 'text-lg'}`}>🔬 {title}</h1>
          {theme && <p className="text-teal-200 text-sm">{theme}</p>}
        </div>
        <span className="text-teal-100 font-bold whitespace-nowrap text-sm">
          {step + 1} / {totalSteps}
        </span>
      </header>

      {/* Progress strip */}
      <div className="h-2 bg-teal-100 flex">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 transition-all duration-300',
              i < step ? 'bg-teal-700' : i === step ? 'bg-teal-400' : 'bg-teal-100'
            )}
          />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center p-4 gap-3 max-w-lg mx-auto w-full">

        {/* Step image — plain <img> so SVGs work in production */}
        {currentUrl && (
          <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={currentUrl}
              alt={`Step ${step + 1}`}
              className="w-full object-contain p-2"
              style={{ maxHeight: 240 }}
            />
          </div>
        )}

        {/* Text step card */}
        {currentStep ? (
          <div className="w-full bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentStep.emoji}</span>
              <div>
                <p className="text-xs font-bold text-teal-500 uppercase tracking-wide">Step {step + 1}</p>
                <h2 className={`font-black text-gray-800 ${isG12 ? 'text-xl' : 'text-lg'}`}>{currentStep.title}</h2>
              </div>
            </div>
            <p className={`text-gray-700 leading-relaxed ${isG12 ? 'text-base' : 'text-sm'}`}>{currentStep.text}</p>
            {currentStep.tip && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                <p className="text-teal-700 text-sm font-semibold">💡 {currentStep.tip}</p>
              </div>
            )}
          </div>
        ) : !currentUrl ? (
          <div className="w-full bg-white rounded-2xl shadow-md flex items-center justify-center aspect-[4/3]">
            <p className="text-teal-300 text-xl">Step {step + 1}</p>
          </div>
        ) : null}

        {saving && <p className="text-teal-400 text-sm">Saving…</p>}
      </main>

      {/* Navigation */}
      <footer className="p-4 pb-8 flex gap-3 max-w-lg mx-auto w-full">
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="flex-1 min-h-[56px] rounded-2xl border-2 border-teal-300 text-teal-700 font-bold text-lg disabled:opacity-30 active:scale-95 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          className="flex-1 min-h-[56px] px-8 rounded-2xl bg-teal-600 text-white font-bold text-lg active:scale-95 transition-all shadow"
          style={{ flex: 2 }}
        >
          {step === totalSteps - 1 ? '🎉 Finish!' : 'Next →'}
        </button>
      </footer>
    </div>
  )
}

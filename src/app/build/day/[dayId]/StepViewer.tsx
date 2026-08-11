'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { GradeBand } from '@/lib/db/schema'

export interface StepData {
  emoji: string
  title: string
  text: string
  tip?: string
}

interface Props {
  contentItemId: string
  dayId: string
  title: string
  theme: string
  stepUrls: string[]
  steps?: StepData[]
  initialStep: number
  completed: boolean
  gradeBand: GradeBand | null
}

// Instructor prep data keyed by title keyword
const PREP_INFO: Record<string, { image: string; steps: string[]; warning: string }> = {
  'Cable Car': {
    image: '/images/build/cable-car/zipline_setup.png',
    warning: '⚠️ Set up zip lines BEFORE kids arrive. String must be pulled TIGHT — no sag!',
    steps: [
      'Set up 2 zip lines. HIGH end: tie string to the very top of the tall brown dining chair back.',
      'LOW end: tie string to the seat of the small pink kids chair. Big height difference is essential.',
      'Pull string TIGHT — no sag at all. A saggy line = cups that stop halfway.',
      'Thread 7 wide straws onto EACH line BEFORE tying the far end.',
      'Test with rocks: add one at a time until cup slides all the way. Note the minimum count as your class threshold.',
      'Have your demo cable car built and ready. 2 groups of 6–7 kids per zip line.',
    ],
  },
  'Well Pulley': {
    image: '/images/build/well-pulley/setup.svg',
    warning: '⚠️ Pre-cut ALL materials before kids arrive — cutting cardboard mid-class kills momentum!',
    steps: [
      'Cut 2 large corrugated cardboard pieces (~20×30 cm) per group of 2–3 students.',
      'Cut 1 flat cardboard square (~15×15 cm) per group for the base.',
      'Cut string to 40 cm per group. Cut crank strips: 2 cm × 15 cm from cardstock.',
      'Cut small corrugated pieces (~8×12 cm) for the bucket, one per group.',
      'Bag materials per group and place on desks. Have pennies, tape & scissors accessible.',
      'Build one complete demo well yourself so you can troubleshoot (skewer must spin freely!).',
      'Write a 2-column crank-count chart on the board: "Empty" and "3 Pennies" columns.',
    ],
  },
}

export function StepViewer({ contentItemId, dayId, title, theme, stepUrls, steps, initialStep, completed, gradeBand }: Props) {
  const router = useRouter()
  const [step, setStep]         = useState(Math.max(0, initialStep))
  const [isDone, setIsDone]     = useState(completed)
  const [saving, setSaving]     = useState(false)
  // Detect if this build has instructor prep
  const prepKey = Object.keys(PREP_INFO).find(k => title.includes(k))
  const prep = prepKey ? PREP_INFO[prepKey] : null

  // Auto-open setup panel on first load if this build has prep info
  const [showPrep, setShowPrep] = useState(!!prep)

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
      const next = step + 1
      setStep(next)
      await saveProgress(next, false)
    } else {
      setIsDone(true)
      await saveProgress(step, true)
    }
  }

  async function goPrev() {
    if (step > 0) {
      const prev = step - 1
      setStep(prev)
      await saveProgress(prev, false)
    }
  }

  async function startOver() {
    setStep(0)
    setIsDone(false)
    await saveProgress(0, false)
  }

  if (isDone) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-3xl font-black text-orange-700 mb-2">Amazing Build!</h1>
        <p className="text-gray-600 mb-6">You completed <strong>{title}</strong></p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => router.push('/dashboard')} className="btn-primary bg-orange-500">
            Back to Home
          </button>
          <button onClick={startOver} className="text-orange-500 font-bold text-sm underline">
            Start over from Step 1
          </button>
        </div>
      </div>
    )
  }

  const currentUrl = stepUrls[step]
  const currentStep = steps?.[step]
  const isG12 = gradeBand === 'g1-2'

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-orange-100 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold bg-orange-400 text-white px-2 py-0.5 rounded-full">
              {isG12 ? 'Grades 1–2' : 'Grades 3–4'}
            </span>
            <button
              onClick={() => router.push(`/build/theory/${dayId}`)}
              className="text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full hover:bg-purple-500 transition-all"
              title="Show theory slides"
            >
              📖 Theory
            </button>
            {prep && (
              <button
                onClick={() => setShowPrep(o => !o)}
                className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-full transition-all',
                  showPrep ? 'bg-yellow-300 text-yellow-900' : 'bg-yellow-500 text-white hover:bg-yellow-400'
                )}
                title="Instructor setup"
              >
                🔧 Setup
              </button>
            )}
          </div>
          <h1 className={`font-black truncate ${isG12 ? 'text-xl' : 'text-lg'}`}>🔨 {title}</h1>
          {theme && <p className="text-orange-200 text-sm">{theme}</p>}
        </div>
        <span className="text-orange-100 font-bold whitespace-nowrap text-sm">
          {step + 1} / {totalSteps}
        </span>
      </header>

      {/* Progress strip */}
      <div className="h-2 bg-orange-100 flex">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 transition-all duration-300',
              i < step ? 'bg-orange-600' : i === step ? 'bg-orange-400' : 'bg-orange-100'
            )}
          />
        ))}
      </div>

      {/* Instructor Prep panel — takes over the full content area when open */}
      {prep && showPrep && (
        <div className="flex-1 overflow-y-auto bg-yellow-50 px-4 py-4">
          <div className="max-w-lg mx-auto space-y-3 pb-4">
            <div className="bg-yellow-400 text-yellow-900 rounded-xl px-4 py-2 font-bold text-sm text-center">
              {prep.warning}
            </div>
            {/* Setup image */}
            <div className="w-full bg-white rounded-xl shadow overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={prep.image} alt="Setup diagram" className="w-full object-contain" />
            </div>
            {/* Setup steps */}
            <ol className="space-y-2">
              {prep.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white font-black text-xs flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-800 leading-snug">{s}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setShowPrep(false)}
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow"
            >
              ✅ Setup done — show build steps
            </button>
          </div>
        </div>
      )}

      <main className={cn('flex-1 overflow-y-auto flex flex-col items-center p-4 gap-3 max-w-lg mx-auto w-full', prep && showPrep && 'hidden')}>

        {/* Illustration image — use plain <img> so SVGs aren't routed through Next.js
            image optimizer (which refuses SVGs in production) */}
        {currentUrl && (
          <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt={`Step ${step + 1}`}
              className="w-full object-contain p-2"
              style={{ maxHeight: 260 }}
            />
          </div>
        )}

        {/* Text card — shown always if step data exists */}
        {currentStep ? (
          <div className="w-full bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentStep.emoji}</span>
              <div>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wide">Step {step + 1}</p>
                <h2 className={`font-black text-gray-800 ${isG12 ? 'text-xl' : 'text-lg'}`}>{currentStep.title}</h2>
              </div>
            </div>
            <p className={`text-gray-700 leading-relaxed ${isG12 ? 'text-base' : 'text-sm'}`}>{currentStep.text}</p>
            {currentStep.tip && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <p className="text-orange-700 text-sm font-semibold">💡 {currentStep.tip}</p>
              </div>
            )}
          </div>
        ) : !currentUrl ? (
          <div className="w-full bg-white rounded-2xl shadow-md flex items-center justify-center aspect-[4/3]">
            <p className="text-orange-300 text-xl">Step {step + 1}</p>
          </div>
        ) : null}

        {saving && <p className="text-orange-400 text-sm">Saving…</p>}
      </main>

      {/* Navigation — hidden while setup panel is open */}
      <footer className={cn('p-4 pb-8 flex gap-3 max-w-lg mx-auto w-full', prep && showPrep && 'hidden')}>
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="flex-1 min-h-[56px] rounded-2xl border-2 border-orange-300 text-orange-600 font-bold text-lg disabled:opacity-30 active:scale-95 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          className="flex-2 min-h-[56px] px-8 rounded-2xl bg-orange-500 text-white font-bold text-lg active:scale-95 transition-all shadow"
          style={{ flex: 2 }}
        >
          {step === totalSteps - 1 ? '🎉 Finish!' : 'Next →'}
        </button>
      </footer>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

type Phase = 'plan' | 'warmup' | 'session'

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

interface PlanStep {
  time: string
  action: string
}

interface SessionSegment {
  startMin: number
  endMin: number
  label: string
  emoji: string
  title?: string
  steps?: PlanStep[]
}

interface PictureCard {
  name: string
  emoji: string
  use: string
}

interface SpeakingMeta {
  pillar?: string
  objectives?: string[]
  weekWord?: string
  weekWordDef?: string
  prompt?: string
  timeLimit?: number   // seconds
  structure?: string[]
  improvGame?: ImprovGame
  tip?: string
  tipIcon?: string
  sessionPlan?: SessionSegment[]
  pictureCards?: PictureCard[]
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

// Parse "DO ... "SAY" ... DO" format — split quoted parts as SAY, rest as DO
function parseAction(action: string) {
  const parts: { kind: 'say' | 'do'; text: string }[] = []
  const re = /"([^"]+)"/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(action)) !== null) {
    const before = action.slice(last, m.index).replace(/^\s*[-–:]\s*/, '').trim()
    if (before) parts.push({ kind: 'do', text: before })
    parts.push({ kind: 'say', text: m[1] })
    last = m.index + m[0].length
  }
  const after = action.slice(last).replace(/^\s*[-–:]\s*/, '').trim()
  if (after) parts.push({ kind: 'do', text: after })
  if (parts.length === 0) parts.push({ kind: 'do', text: action })
  return parts
}

// Segment color theme
type SegColor = { bg: string; light: string; border: string; text: string; timebg: string }
function segColorFor(label: string): SegColor {
  if (label === 'WARM-UP')     return { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', timebg: 'bg-orange-100' }
  if (label === 'MAIN ACTIVITY') return { bg: 'bg-teal-600',   light: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700',   timebg: 'bg-teal-100'   }
  return                               { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', timebg: 'bg-purple-100' }
}

// Reusable step renderer used in both Warm-Up and Session tabs
function SessionPlanSegments({ segments }: { segments: SessionSegment[] }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="space-y-3">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full text-xs font-black text-gray-400 uppercase tracking-wide text-left flex items-center gap-1.5"
      >
        <span>{collapsed ? '▶' : '▼'}</span>
        {collapsed ? 'Show session plan steps' : 'Hide session plan steps'}
      </button>
      {!collapsed && segments.map((seg, si) => {
        const c = segColorFor(seg.label)
        const duration = seg.endMin - seg.startMin
        return (
          <div key={si} className={cn('rounded-2xl border-2 overflow-hidden', c.border)}>
            <div className={cn('px-4 py-3 flex items-center justify-between', c.bg)}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{seg.emoji}</span>
                <div>
                  <p className="text-white font-black text-sm">{seg.label}</p>
                  {seg.title && <p className="text-white/80 text-xs">{seg.title}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/90 text-xs font-bold tabular-nums">min {seg.startMin} – {seg.endMin}</p>
                <p className="text-white/60 text-xs">{duration} min</p>
              </div>
            </div>
            {seg.steps && seg.steps.length > 0 && (
              <div className={cn('p-3 space-y-3', c.light)}>
                {seg.steps.map((step, ti) => {
                  const parsed = parseAction(step.action)
                  return (
                    <div key={ti} className="flex gap-2.5 items-start">
                      <div className="shrink-0 text-center">
                        <span className={cn('text-xs font-black px-1.5 py-0.5 rounded block tabular-nums', c.timebg, c.text)}>
                          {step.time}
                        </span>
                        <span className="text-gray-300 text-xs">min</span>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        {parsed.map((part, pi) =>
                          part.kind === 'say' ? (
                            <div key={pi} className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-start gap-2">
                              <span className="text-xs font-black text-teal-600 uppercase tracking-wide shrink-0 mt-0.5 leading-none">SAY</span>
                              <p className="text-gray-800 text-sm leading-snug italic">&ldquo;{part.text}&rdquo;</p>
                            </div>
                          ) : (
                            <div key={pi} className="flex items-start gap-2">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-wide shrink-0 mt-0.5 leading-none">DO</span>
                              <p className="text-gray-600 text-sm leading-snug">{part.text}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const PILLAR_COLOR: Record<string, string> = {
  'Voice': 'bg-teal-600',
  'Body':  'bg-purple-600',
  'Mind':  'bg-amber-500',
}

// ── Card content for fullscreen projection ────────────────────────────────────
const CARD_CONTENT: Record<string, { bg: string; lines: string[] }> = {
  'Three Pillars Poster': {
    bg: 'bg-teal-600',
    lines: ['THE THREE PILLARS', '🎙 VOICE', 'Volume · Pace · Clarity · Expression', '', '🧍 BODY', 'Posture · Eye Contact · Gestures · Space', '', '🧠 MIND', 'Courage · Preparation · Focus · Purpose'],
  },
  'Voice Dial': {
    bg: 'bg-sky-600',
    lines: ['🎚 VOICE DIAL', '', '1 — Whisper', '2 — Quiet (indoors)', '3 — Normal conversation', '4 — Speaking to the class ✅', '5 — Outside / projecting'],
  },
  'Hook Types Card': {
    bg: 'bg-amber-500',
    lines: ['🎣 THE 3 HOOK TYPES', '', '1️⃣  ASK A QUESTION', '"Have you ever wondered…?"', '', '2️⃣  WOW FACT', '"Did you know…?"', '', '3️⃣  TINY STORY', '"One morning I woke up and…"'],
  },
  'Three-Part Train': {
    bg: 'bg-purple-600',
    lines: ['🚂 THE SPEECH TRAIN', '', '🚂  HOOK (engine)', '', '🚃  THING 1', '🚃  THING 2', '🚃  THING 3', '', '🚃  BIG FINISH (caboose)'],
  },
  'Story Mountain': {
    bg: 'bg-green-600',
    lines: ['⛰ STORY MOUNTAIN', '', '🌄  BEGINNING — who, where, when', '⚡  PROBLEM — something goes wrong', '💪  ACTION — what happened next', '🏁  END — how it resolved', '💭  SO WHAT — what you learned'],
  },
  'Brave Breathing Card': {
    bg: 'bg-indigo-600',
    lines: ['🌬 BRAVE BREATHING', '', 'IN  · · · 2 · · · 3 · · · 4', '', 'HOLD · 2 · · · 3 · · · 4', '', 'OUT · · 2 · · · 3 · · · 4 · · · 5 · · · 6', '', 'Repeat × 3'],
  },
  'Pre-Speech Ritual Card': {
    bg: 'bg-teal-700',
    lines: ['✨ PRE-SPEECH RITUAL', '', '1️⃣  Brave Breath × 1', '2️⃣  Power Pose — 5 seconds', '3️⃣  "I know my speech. I am ready."', '4️⃣  Walk up · Plant feet · Pause · Begin'],
  },
  'Body Check Card': {
    bg: 'bg-purple-700',
    lines: ['🧍 BODY CHECK', '', '👟  FEET — hip-width, planted', '💪  CORE — tall, not stiff', '✋  HANDS — loose at your sides', '😊  FACE — open, forward', '👁  EYES — scanning the room'],
  },
  'Power 4 Card': {
    bg: 'bg-purple-600',
    lines: ['💥 POWER 4', '', '1️⃣  STAND TALL', '2️⃣  HANDS READY', '3️⃣  EYES OUT', '4️⃣  TAKE UP SPACE'],
  },
  'Feedback Sandwich Card': {
    bg: 'bg-orange-500',
    lines: ['🥪 FEEDBACK SANDWICH', '', '🍞  TOP BREAD', '"What I liked was… [specific thing] because [why it worked]"', '', '🥬  FILLING', '"One thing to try next time: [one suggestion]"', '', '🍞  BOTTOM BREAD', '"I\'m excited to see you…"'],
  },
  'Hook Types Card (G3-4)': {
    bg: 'bg-amber-500',
    lines: ['🎣 HOOK TYPES', '', '❓  QUESTION — make them think', '📊  WOW FACT — surprise them', '📖  TINY STORY — pull them in', '🎭  BOLD STATEMENT — take a position', '🔮  SCENARIO — "Imagine if…"'],
  },
  'PIE Card': {
    bg: 'bg-blue-600',
    lines: ['🥧 PIE PARAGRAPH', '', '📌  POINT', 'State your argument clearly', '', '📖  ILLUSTRATE', 'Give a specific fact, story, or example', '', '💡  EXPLAIN', '"This shows that [Your Point]…"'],
  },
  'Conclusion Formula Card': {
    bg: 'bg-green-700',
    lines: ['🏁 CONCLUSION FORMULA', '', '🔄  Echo the Hook — close the loop', '📌  Restate Your Point — rephrase it', '📋  Remind Your Plan — "We have seen…"', '💥  Lasting Impression — challenge / vision / call to action'],
  },
  'PREP Framework Card': {
    bg: 'bg-teal-700',
    lines: ['⚡ PREP FRAMEWORK', '', '📌  P — POINT', 'Take a position in sentence 1', '', '💡  R — REASON', '"The reason I believe this is…"', '', '📖  E — EXAMPLE', '"For instance…"', '', '🔁  P — POINT again (with a twist)'],
  },
  'Persuasion Triangle': {
    bg: 'bg-red-600',
    lines: ['🔺 PERSUASION TRIANGLE', '', '🎓  ETHOS — credibility', '"I know this because…"', '', '❤️  PATHOS — emotion', '"Imagine feeling…"', '', '📊  LOGOS — logic', '"Studies show… / The data reveals…"'],
  },
  'C-R-C Model Card': {
    bg: 'bg-orange-600',
    lines: ['🥪 C-R-C EVALUATION', '', '⭐  COMMENDATION', '"What you did well — specifically — and WHY it worked"', '', '💡  RECOMMENDATION', '"One thing to try — and HOW to do it"', '', '⭐  COMMENDATION', '"What I\'m excited to see you do next"'],
  },
  'Evaluator\'s Checklist': {
    bg: 'bg-slate-700',
    lines: ['🔍 EVALUATOR CHECKLIST', '', '🎙  VOICE — volume, pace, expression', '🧍  BODY — posture, eye contact, gesture', '🗺  STRUCTURE — all parts present?', '💡  CONTENT — specific evidence?', '💥  IMPACT — did it move you?'],
  },
  'Showcase Checklist': {
    bg: 'bg-teal-700',
    lines: ['✅ SHOWCASE CHECKLIST', '', '🎣  Hook — grabbed attention?', '📌  Three Things — clear structure?', '👁  Eye Contact — connected with audience?', '🔊  Volume — heard from the back?', '🏁  Big Finish — stuck the landing?'],
  },
  'Sensory Detail Card': {
    bg: 'bg-green-600',
    lines: ['🔬 SENSORY DETAILS', '', '👁  SIGHT — what did it look like?', '👂  SOUND — what did you hear?', '👃  SMELL — what was in the air?', '👅  TASTE — was there a flavour?', '✋  TOUCH — what did it feel like?', '', 'Use at least 3 senses per story.'],
  },
  'Comedic Techniques Card': {
    bg: 'bg-yellow-500',
    lines: ['😂 COMEDIC TECHNIQUES', '', '3️⃣  RULE OF THREE', '"I need: food, water, and excellent Wi-Fi."', '', '🔁  CALLBACK', 'Return to your opening — with a twist', '', '😐  UNDERSTATEMENT', 'Describe something extreme as minor'],
  },
  'Pause Power Card': {
    bg: 'bg-slate-800',
    lines: ['⏸ THE PAUSE', '', 'The pause is the punchline.', '', 'Say the funny line.', '', 'STOP.', '', 'Wait for the room.', '', 'THEN continue.'],
  },
  'Inform vs. Persuade Card': {
    bg: 'bg-blue-700',
    lines: ['🎯 INFORM vs. PERSUADE', '', '📚  INFORM', 'Hook → Facts × 3 → Conclusion', 'Goal: CLARITY', '', '📣  PERSUADE', 'Hook → Point → Logos → Pathos → Ethos → Call to Action', 'Goal: ACTION'],
  },
  'Full Speech Map': {
    bg: 'bg-slate-700',
    lines: ['🗺 FULL FORMAL SPEECH', '', '🎣  Hook', '📌  Your Point', '📋  Your Plan', '🥧  PIE 1 — Logos', '🥧  PIE 2 — Pathos', '🥧  PIE 3 — Ethos', '🏁  Conclusion'],
  },
  'Feeling Faces': {
    bg: 'bg-pink-500',
    lines: ['😊 FEELING FACES', '', '😄  Happy / Excited', '😢  Sad / Upset', '😤  Angry / Frustrated', '😰  Scared / Nervous', '😮  Surprised / Amazed', '😌  Calm / Proud', '😂  Silly / Funny', '🤔  Curious / Puzzled'],
  },
  'Voice Toolkit': {
    bg: 'bg-sky-700',
    lines: ['🎙 THE VOICE TOOLKIT', '', '📢  VOLUME', 'Aim at the back wall — not the front row', '', '🐢  PACE', 'Slow on key words · faster on lists', '', '⏸  PAUSE', '2 seconds of silence = "this matters"', '', '🎵  PITCH', 'Vary it — monotone loses the room', '', '🔤  CLARITY', 'Over-enunciate consonants; never swallow endings'],
  },
}

function PictureCardsPanel({ cards }: { cards: { name: string; emoji: string; use: string }[] }) {
  const [projecting, setProjecting] = useState<{ name: string; emoji: string; use: string } | null>(null)

  useEffect(() => {
    if (!projecting) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setProjecting(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [projecting])

  const content = projecting ? CARD_CONTENT[projecting.name] : null

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">📇 Picture Cards This Week</p>
        <div className="space-y-2">
          {cards.map((card, ci) => (
            <div key={ci} className="flex items-start gap-3 p-2.5 bg-yellow-50 rounded-xl border border-yellow-200">
              <span className="text-2xl shrink-0">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-gray-800">{card.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.use}</p>
              </div>
              <button
                onClick={() => setProjecting(card)}
                className="shrink-0 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white px-2.5 py-1 rounded-lg active:scale-95 transition-all"
              >
                🖥 Project
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen projection overlay */}
      {projecting && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          style={{ backgroundColor: content ? undefined : '#1e293b' }}
          onClick={() => setProjecting(null)}
        >
          <div className={`w-full h-full flex flex-col items-center justify-center p-12 ${content?.bg ?? 'bg-slate-800'}`}>
            <div className="text-center max-w-3xl w-full">
              <div className="text-8xl mb-6">{projecting.emoji}</div>
              {content ? (
                <div className="space-y-2">
                  {content.lines.map((line, i) => {
                    if (line === '') return <div key={i} className="h-3" />
                    const isTitle = i === 0
                    const isSubhead = !isTitle && (line.charCodeAt(0) > 127)
                    return (
                      <p
                        key={i}
                        className={`text-white leading-snug ${
                          isTitle   ? 'text-4xl font-black mb-2' :
                          isSubhead ? 'text-2xl font-black mt-3' :
                                      'text-xl text-white/75'
                        }`}
                      >
                        {line}
                      </p>
                    )
                  })}
                </div>
              ) : (
                <>
                  <p className="text-5xl font-black text-white mb-4">{projecting.name}</p>
                  <p className="text-2xl text-white/80">{projecting.use}</p>
                </>
              )}
              <p className="text-white/40 text-sm mt-12">Tap or press Esc to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function SpeakingSession({ contentItemId, meta, students, initialDoneIds }: Props) {
  const [phase, setPhase]           = useState<Phase>('plan')
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
      <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 shadow-sm border border-teal-100">
        <button
          onClick={() => setPhase('plan')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-black transition-all',
            phase === 'plan'
              ? 'bg-teal-600 text-white shadow'
              : 'text-gray-500 hover:bg-teal-50'
          )}
        >
          📋 Plan
        </button>
        <button
          onClick={() => setPhase('warmup')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-black transition-all',
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
            'flex-1 py-2.5 rounded-xl text-xs font-black transition-all',
            phase === 'session'
              ? 'bg-teal-600 text-white shadow'
              : 'text-gray-500 hover:bg-teal-50'
          )}
        >
          🎤 Session
        </button>
      </div>

      {/* ════════════════════ SESSION PLAN ════════════════════ */}
      {phase === 'plan' && (
        <>
          {/* Pillar badge + objectives */}
          {(meta.pillar || meta.objectives) && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              {meta.pillar && (
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('text-white text-xs font-black px-3 py-1 rounded-full', PILLAR_COLOR[meta.pillar] ?? 'bg-teal-600')}>
                    Pillar: {meta.pillar}
                  </span>
                </div>
              )}
              {meta.objectives && meta.objectives.length > 0 && (
                <>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">Today&apos;s Goals</p>
                  <div className="space-y-1.5">
                    {meta.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-sm shrink-0 mt-0.5">🎯</span>
                        <p className="text-gray-700 text-sm">{obj}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Teacher tip banner */}
          {meta.tip && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl shrink-0">{meta.tipIcon ?? '💡'}</span>
              <div>
                <p className="text-xs font-black text-amber-700 uppercase tracking-wide mb-0.5">Teacher Tip</p>
                <p className="text-sm text-amber-900">{meta.tip}</p>
              </div>
            </div>
          )}

          {/* Warm-up activity description */}
          {meta.improvGame && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl shrink-0">🎭</span>
              <div>
                <p className="text-xs font-black text-orange-700 uppercase tracking-wide mb-0.5">Warm-Up: {meta.improvGame.name}</p>
                <p className="text-sm text-orange-900">{meta.improvGame.description}</p>
                <p className="text-xs text-orange-600 mt-1">Full instructions are in the Warm-Up tab.</p>
              </div>
            </div>
          )}

          {/* Minute-by-minute plan */}
          {meta.sessionPlan && meta.sessionPlan.length > 0 ? (
            <div className="space-y-3">
              {meta.sessionPlan.map((seg: SessionSegment, si: number) => {
                const c = segColorFor(seg.label)
                const duration = seg.endMin - seg.startMin
                return (
                  <div key={si} className={cn('rounded-2xl border-2 overflow-hidden', c.border)}>
                    {/* Segment header */}
                    <div className={cn('px-4 py-3 flex items-center justify-between', c.bg)}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{seg.emoji}</span>
                        <div>
                          <p className="text-white font-black text-sm">{seg.label}</p>
                          {seg.title && <p className="text-white/80 text-xs">{seg.title}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/90 text-xs font-bold tabular-nums">
                          min {seg.startMin} – {seg.endMin}
                        </p>
                        <p className="text-white/60 text-xs">{duration} min</p>
                      </div>
                    </div>

                    {/* Steps */}
                    {seg.steps && seg.steps.length > 0 && (
                      <div className={cn('p-3 space-y-3', c.light)}>
                        {seg.steps.map((step: PlanStep, ti: number) => {
                          const parsed = parseAction(step.action)
                          return (
                            <div key={ti} className="flex gap-2.5 items-start">
                              {/* Minute badge */}
                              <div className="shrink-0 text-center">
                                <span className={cn('text-xs font-black px-1.5 py-0.5 rounded block tabular-nums', c.timebg, c.text)}>
                                  {step.time}
                                </span>
                                <span className="text-gray-300 text-xs">min</span>
                              </div>
                              {/* Action parts */}
                              <div className="space-y-1.5 flex-1">
                                {parsed.map((part, pi) =>
                                  part.kind === 'say' ? (
                                    <div key={pi} className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-start gap-2">
                                      <span className="text-xs font-black text-teal-600 uppercase tracking-wide shrink-0 mt-0.5 leading-none">SAY</span>
                                      <p className="text-gray-800 text-sm leading-snug italic">&ldquo;{part.text}&rdquo;</p>
                                    </div>
                                  ) : (
                                    <div key={pi} className="flex items-start gap-2">
                                      <span className="text-xs font-black text-gray-400 uppercase tracking-wide shrink-0 mt-0.5 leading-none">DO</span>
                                      <p className="text-gray-600 text-sm leading-snug">{part.text}</p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-gray-400">
              <p className="text-sm">No session plan set for this week.</p>
            </div>
          )}

          {/* Picture cards */}
          {meta.pictureCards && meta.pictureCards.length > 0 && (
            <PictureCardsPanel cards={meta.pictureCards} />
          )}

          {meta.bonusActivities && meta.bonusActivities.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⭐</span>
                <span className="font-bold text-yellow-800 text-sm">BONUS — If you finish early</span>
              </div>
              {meta.bonusActivities.map((b: any, i: number) => (
                <div key={i} className="mb-3">
                  <div className="font-bold text-yellow-900 text-sm">{b.emoji} {b.name} <span className="font-normal text-yellow-700">({b.duration})</span></div>
                  <div className="text-xs text-yellow-700 mb-1 italic">{b.when}</div>
                  <ol className="list-decimal list-inside space-y-0.5">
                    {b.instructions.map((step: string, j: number) => (
                      <li key={j} className="text-xs text-yellow-900">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setPhase('warmup')}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3.5 rounded-2xl text-base active:scale-95 transition-all"
          >
            Start Warm-Up →
          </button>
        </>
      )}

      {/* ════════════════════ WARM-UP ════════════════════ */}
      {phase === 'warmup' && (
        <>
          {/* Quick reference card */}
          {meta.improvGame && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl shrink-0">🎭</span>
              <div>
                <p className="text-xs font-black text-orange-700 uppercase tracking-wide mb-0.5">{meta.improvGame.name}</p>
                <p className="text-sm text-orange-900">{meta.improvGame.description}</p>
              </div>
            </div>
          )}

          {/* Timed plan steps for WARM-UP segment */}
          {(() => {
            const warmupSeg = meta.sessionPlan?.find((s: SessionSegment) => s.label === 'WARM-UP')
            if (!warmupSeg) return (
              <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-gray-400">
                <p className="text-sm">No warm-up steps set for this week.</p>
              </div>
            )
            return (
              <div className="rounded-2xl border-2 border-orange-200 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between bg-orange-500">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{warmupSeg.emoji}</span>
                    <div>
                      <p className="text-white font-black text-sm">WARM-UP</p>
                      {warmupSeg.title && <p className="text-white/80 text-xs">{warmupSeg.title}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-xs font-bold tabular-nums">min {warmupSeg.startMin} – {warmupSeg.endMin}</p>
                    <p className="text-white/60 text-xs">{warmupSeg.endMin - warmupSeg.startMin} min</p>
                  </div>
                </div>
                {warmupSeg.steps && warmupSeg.steps.length > 0 && (
                  <div className="p-3 space-y-3 bg-orange-50">
                    {warmupSeg.steps.map((step: PlanStep, ti: number) => {
                      const parsed = parseAction(step.action)
                      return (
                        <div key={ti} className="flex gap-2.5 items-start">
                          <div className="shrink-0 text-center">
                            <span className="text-xs font-black px-1.5 py-0.5 rounded block tabular-nums bg-orange-100 text-orange-700">
                              {step.time}
                            </span>
                            <span className="text-gray-300 text-xs">min</span>
                          </div>
                          <div className="space-y-1.5 flex-1">
                            {parsed.map((part, pi) =>
                              part.kind === 'say' ? (
                                <div key={pi} className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-start gap-2">
                                  <span className="text-xs font-black text-teal-600 uppercase tracking-wide shrink-0 mt-0.5 leading-none">SAY</span>
                                  <p className="text-gray-800 text-sm leading-snug italic">&ldquo;{part.text}&rdquo;</p>
                                </div>
                              ) : (
                                <div key={pi} className="flex items-start gap-2">
                                  <span className="text-xs font-black text-gray-400 uppercase tracking-wide shrink-0 mt-0.5 leading-none">DO</span>
                                  <p className="text-gray-600 text-sm leading-snug">{part.text}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })()}

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
          {/* Main Activity + Wrap-Up steps from session plan */}
          {meta.sessionPlan && meta.sessionPlan.filter((s: SessionSegment) => s.label !== 'WARM-UP').length > 0 && (
            <SessionPlanSegments segments={meta.sessionPlan.filter((s: SessionSegment) => s.label !== 'WARM-UP')} />
          )}

          {/* Word of the Day */}
          {meta.weekWord && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-xs font-black text-teal-500 uppercase tracking-wide mb-2">📖 Word of the Day</p>
              <p className="text-4xl font-black text-gray-800 tracking-wide mb-1">{meta.weekWord.toUpperCase()}</p>
              {meta.weekWordDef && (
                <p className="text-gray-500 text-sm italic">&quot;{meta.weekWordDef}&quot;</p>
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
            <p className="text-xs font-black text-teal-200 uppercase tracking-wide mb-2">💬 Today&apos;s Prompt</p>
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

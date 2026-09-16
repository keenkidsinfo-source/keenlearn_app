'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ScienceLab } from '@/lib/scienceLabs'

// ── Animated illustration: Fire Extinguisher ──────────────────────────────────
function FireAnimation() {
  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 200 }}>
      <style>{`
        @keyframes flicker {
          0%,100% { transform: scaleY(1) scaleX(1); opacity:1 }
          25% { transform: scaleY(1.12) scaleX(0.9); opacity:.9 }
          50% { transform: scaleY(0.88) scaleX(1.1); opacity:1 }
          75% { transform: scaleY(1.08) scaleX(0.95); opacity:.95 }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity:.8 }
          100% { transform: translateY(-40px) scale(1.4); opacity:0 }
        }
        @keyframes pour {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(-55deg); }
          80% { transform: rotate(-55deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes co2 {
          0% { opacity:0; transform: scaleX(0.5) translateY(0); }
          30% { opacity:0.35; }
          70% { opacity:0.25; transform: scaleX(1.2) translateY(6px); }
          100% { opacity:0; transform: scaleX(1.4) translateY(12px); }
        }
        .flame { animation: flicker 0.7s ease-in-out infinite; transform-origin: bottom center; }
        .flame2 { animation: flicker 0.85s ease-in-out infinite 0.15s; transform-origin: bottom center; }
        .flame3 { animation: flicker 0.6s ease-in-out infinite 0.3s; transform-origin: bottom center; }
        .bubble1 { animation: bubble 1.4s ease-out infinite; }
        .bubble2 { animation: bubble 1.1s ease-out infinite 0.4s; }
        .bubble3 { animation: bubble 1.6s ease-out infinite 0.8s; }
        .pour-bowl { animation: pour 4s ease-in-out infinite 1s; transform-origin: right center; }
        .co2-cloud { animation: co2 4s ease-in-out infinite 1s; }
      `}</style>
      <svg viewBox="0 0 320 200" width="300" height="188" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="170" width="280" height="8" rx="4" fill="#d1d5db"/>
        <rect x="55" y="140" width="18" height="35" rx="3" fill="#fef3c7"/>
        <rect x="63" y="136" width="2" height="8" rx="1" fill="#6b7280"/>
        <g className="flame" style={{transformOrigin:'64px 136px'}}>
          <ellipse cx="64" cy="128" rx="6" ry="10" fill="#f97316" opacity="0.9"/>
          <ellipse cx="64" cy="131" rx="4" ry="6" fill="#fbbf24"/>
          <ellipse cx="64" cy="134" rx="2" ry="3" fill="#fef08a"/>
        </g>
        <rect x="100" y="145" width="18" height="30" rx="3" fill="#fce7f3"/>
        <rect x="108" y="141" width="2" height="8" rx="1" fill="#6b7280"/>
        <g className="flame2" style={{transformOrigin:'109px 141px'}}>
          <ellipse cx="109" cy="133" rx="6" ry="10" fill="#f97316" opacity="0.9"/>
          <ellipse cx="109" cy="136" rx="4" ry="6" fill="#fbbf24"/>
          <ellipse cx="109" cy="139" rx="2" ry="3" fill="#fef08a"/>
        </g>
        <rect x="145" y="138" width="18" height="37" rx="3" fill="#dbeafe"/>
        <rect x="153" y="134" width="2" height="8" rx="1" fill="#6b7280"/>
        <g className="flame3" style={{transformOrigin:'154px 134px'}}>
          <ellipse cx="154" cy="126" rx="6" ry="10" fill="#f97316" opacity="0.9"/>
          <ellipse cx="154" cy="129" rx="4" ry="6" fill="#fbbf24"/>
          <ellipse cx="154" cy="132" rx="2" ry="3" fill="#fef08a"/>
        </g>
        <g className="pour-bowl" style={{transformOrigin:'260px 145px'}}>
          <ellipse cx="255" cy="145" rx="38" ry="16" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
          <rect x="217" y="130" width="76" height="18" rx="6" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2"/>
          <ellipse cx="255" cy="134" rx="28" ry="8" fill="#fef9c3" opacity="0.8"/>
          <circle cx="248" cy="132" r="3" fill="white" opacity="0.7" className="bubble1"/>
          <circle cx="258" cy="128" r="2.5" fill="white" opacity="0.8" className="bubble2"/>
          <circle cx="264" cy="133" r="2" fill="white" opacity="0.6" className="bubble3"/>
        </g>
        <ellipse cx="110" cy="162" rx="80" ry="12" fill="#93c5fd" opacity="0" className="co2-cloud"/>
        <text x="64" y="192" textAnchor="middle" fontSize="10" fill="#6b7280">candles</text>
        <text x="255" y="192" textAnchor="middle" fontSize="10" fill="#6b7280">mystery bowl</text>
      </svg>
    </div>
  )
}

// ── Animated illustration: Spinning Magnetic Pen ──────────────────────────────
function MagnetAnimation() {
  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 200 }}>
      <style>{`
        @keyframes spin { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(180deg); } 100% { transform: translateY(0px) rotate(360deg); } }
        @keyframes force-up { 0%,100% { opacity:0.3; transform: scaleY(1); } 50% { opacity:0.7; transform: scaleY(1.2); } }
        @keyframes force-down { 0%,100% { opacity:0.2; } 50% { opacity:0.5; } }
        .pen-group { animation: spin 3s linear infinite; transform-origin: 160px 100px; }
        .force-arrow-up { animation: force-up 1.5s ease-in-out infinite; transform-origin: center; }
        .force-arrow-down { animation: force-down 1.5s ease-in-out infinite 0.75s; transform-origin: center; }
      `}</style>
      <svg viewBox="0 0 320 200" width="300" height="188" xmlns="http://www.w3.org/2000/svg">
        <rect x="120" y="152" width="80" height="14" rx="5" fill="#9ca3af"/>
        <rect x="130" y="146" width="60" height="12" rx="5" fill="#3b82f6" opacity="0.85"/>
        <text x="160" y="156" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">N</text>
        <g className="force-arrow-up">
          <line x1="145" y1="140" x2="145" y2="118" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" opacity="0.5"/>
          <polygon points="145,112 141,120 149,120" fill="#3b82f6" opacity="0.5"/>
          <line x1="175" y1="140" x2="175" y2="118" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" opacity="0.5"/>
          <polygon points="175,112 171,120 179,120" fill="#3b82f6" opacity="0.5"/>
        </g>
        <g className="force-arrow-down">
          <line x1="160" y1="78" x2="160" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" opacity="0.4"/>
          <polygon points="160,106 156,98 164,98" fill="#ef4444" opacity="0.4"/>
        </g>
        <g className="pen-group">
          <rect x="150" y="84" width="20" height="18" rx="3" fill="#7c3aed"/>
          <ellipse cx="160" cy="84" rx="5" ry="3" fill="#a78bfa"/>
          <text x="160" y="97" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">S</text>
        </g>
        <text x="212" y="108" fontSize="10" fill="#3b82f6">repel ↑</text>
        <text x="212" y="88" fontSize="10" fill="#ef4444">gravity ↓</text>
        <text x="160" y="190" textAnchor="middle" fontSize="9" fill="#6b7280">same poles push apart → pen floats!</text>
      </svg>
    </div>
  )
}

// ── Animated illustration: Water Balloon Over Flame ──────────────────────────
function WaterBalloonAnimation() {
  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 200 }}>
      <style>{`
        @keyframes flicker2 {
          0%,100% { transform: scaleY(1) scaleX(1); opacity:1 }
          25% { transform: scaleY(1.15) scaleX(0.88); opacity:.9 }
          50% { transform: scaleY(0.9) scaleX(1.1); opacity:1 }
          75% { transform: scaleY(1.1) scaleX(0.92); opacity:.95 }
        }
        @keyframes heatRise {
          0% { opacity:0; transform: translateY(0) scaleX(1); }
          40% { opacity:0.4; }
          100% { opacity:0; transform: translateY(-28px) scaleX(1.3); }
        }
        @keyframes sootGrow {
          0%,40% { opacity:0; }
          60%,100% { opacity:0.55; }
        }
        .balloon-flame { animation: flicker2 0.65s ease-in-out infinite; transform-origin: bottom center; }
        .heat-wave1 { animation: heatRise 1.2s ease-out infinite; }
        .heat-wave2 { animation: heatRise 1.2s ease-out infinite 0.4s; }
        .heat-wave3 { animation: heatRise 1.2s ease-out infinite 0.8s; }
        .soot { animation: sootGrow 3s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 320 200" width="300" height="188" xmlns="http://www.w3.org/2000/svg">
        {/* Table */}
        <rect x="20" y="172" width="280" height="7" rx="3" fill="#d1d5db"/>
        {/* Candle */}
        <rect x="148" y="148" width="24" height="26" rx="3" fill="#fef9c3" stroke="#e5e7eb" strokeWidth="1"/>
        <rect x="158" y="144" width="4" height="8" rx="1" fill="#9ca3af"/>
        {/* Candle flame */}
        <g className="balloon-flame" style={{transformOrigin:'160px 142px'}}>
          <ellipse cx="160" cy="134" rx="7" ry="11" fill="#f97316" opacity="0.9"/>
          <ellipse cx="160" cy="138" rx="4.5" ry="6" fill="#fbbf24"/>
          <ellipse cx="160" cy="141" rx="2.5" ry="3" fill="#fef08a"/>
        </g>
        {/* Heat waves rising */}
        <ellipse cx="155" cy="118" rx="4" ry="7" fill="#f97316" opacity="0" className="heat-wave1"/>
        <ellipse cx="163" cy="112" rx="3" ry="6" fill="#fb923c" opacity="0" className="heat-wave2"/>
        <ellipse cx="158" cy="108" rx="3.5" ry="5" fill="#fbbf24" opacity="0" className="heat-wave3"/>
        {/* Balloon — water inside */}
        <ellipse cx="160" cy="72" rx="42" ry="48" fill="#93c5fd" opacity="0.7" stroke="#3b82f6" strokeWidth="1.5"/>
        {/* Water fill inside balloon */}
        <ellipse cx="160" cy="88" rx="36" ry="26" fill="#60a5fa" opacity="0.5"/>
        {/* Balloon knot */}
        <rect x="156" y="118" width="8" height="6" rx="2" fill="#3b82f6"/>
        {/* Soot mark at bottom of balloon where flame touches */}
        <ellipse cx="160" cy="117" rx="10" ry="4" fill="#374151" opacity="0" className="soot"/>
        {/* Heat arrows going INTO water */}
        <text x="200" y="96" fontSize="9" fill="#ef4444" fontWeight="bold">🔥→💧</text>
        <text x="160" y="192" textAnchor="middle" fontSize="9" fill="#6b7280">water absorbs the heat — balloon survives!</text>
        {/* Labels */}
        <text x="90" y="75" fontSize="8" fill="#3b82f6">💧 water</text>
        <text x="90" y="88" fontSize="8" fill="#3b82f6">inside</text>
      </svg>
    </div>
  )
}

// ── Animated illustration: Upside-Down Water Bottle ───────────────────────────
function WaterBottleAnimation() {
  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 200 }}>
      <style>{`
        @keyframes drip {
          0% { opacity:0; transform: translateY(0); }
          20% { opacity:0.8; }
          100% { opacity:0; transform: translateY(30px); }
        }
        @keyframes toothpickFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes airPush {
          0%,100% { opacity:0.2; transform: scaleY(1); }
          50% { opacity:0.5; transform: scaleY(1.15); }
        }
        .drip1 { animation: drip 2.5s ease-in infinite 0.5s; }
        .drip2 { animation: drip 2.5s ease-in infinite 1.4s; }
        .toothpick-anim { animation: toothpickFloat 2s ease-in-out infinite; }
        .air-arrow { animation: airPush 1.8s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 320 200" width="300" height="188" xmlns="http://www.w3.org/2000/svg">
        {/* Table surface */}
        <rect x="20" y="175" width="280" height="8" rx="3" fill="#d1d5db"/>
        {/* Upside-down bottle body */}
        <rect x="118" y="55" width="64" height="90" rx="8" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" opacity="0.85"/>
        {/* Water fill inside bottle */}
        <rect x="120" y="57" width="60" height="85" rx="6" fill="#60a5fa" opacity="0.45"/>
        {/* Bottle neck (at bottom since upside-down) */}
        <rect x="133" y="143" width="34" height="18" rx="4" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2"/>
        {/* Mesh over neck */}
        <rect x="131" y="158" width="38" height="5" rx="2" fill="#6b7280" opacity="0.7"/>
        <line x1="135" y1="158" x2="135" y2="163" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="142" y1="158" x2="142" y2="163" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="149" y1="158" x2="149" y2="163" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="156" y1="158" x2="156" y2="163" stroke="#9ca3af" strokeWidth="1"/>
        <line x1="163" y1="158" x2="163" y2="163" stroke="#9ca3af" strokeWidth="1"/>
        {/* Air pressure arrows pushing UP */}
        <g className="air-arrow">
          <line x1="100" y1="172" x2="100" y2="155" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2"/>
          <polygon points="100,150 96,158 104,158" fill="#10b981"/>
          <line x1="220" y1="172" x2="220" y2="155" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2"/>
          <polygon points="220,150 216,158 224,158" fill="#10b981"/>
        </g>
        {/* Toothpick floating UP toward bottle bottom */}
        <g className="toothpick-anim">
          <line x1="140" y1="100" x2="180" y2="88" stroke="#d97706" strokeWidth="3" strokeLinecap="round"/>
        </g>
        {/* Labels */}
        <text x="75" y="148" fontSize="8" fill="#10b981" fontWeight="bold">air pressure</text>
        <text x="160" y="48" textAnchor="middle" fontSize="9" fill="#3b82f6">water stays in! 🙃</text>
        <text x="160" y="194" textAnchor="middle" fontSize="9" fill="#6b7280">mesh + air pressure hold the water</text>
      </svg>
    </div>
  )
}

const colorMap: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  green:  'bg-green-100 text-green-800 border-green-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  red:    'bg-red-100 text-red-800 border-red-200',
}

// ── Phases of the lab session ─────────────────────────────────────────────────
type Phase = 'predict' | 'observe' | 'reflect'

export function ScienceLabClient({
  lab,
  contentItemId,
  gradeBand,
}: {
  lab: ScienceLab
  contentItemId: string | null
  gradeBand?: 'g1-2' | 'g3-4' | null
}) {
  const router = useRouter()
  const storageKey = `kk_science_${lab.id}`
  const isG12 = gradeBand === 'g1-2'

  const isFireLab      = lab.title.toLowerCase().includes('fire') || lab.title.toLowerCase().includes('extinguisher')
  const isWaterBalloon = lab.title.toLowerCase().includes('balloon')
  const isWaterBottle  = !isWaterBalloon && (lab.title.toLowerCase().includes('water') || lab.title.toLowerCase().includes('bottle'))
  // any other lab falls through to magnet defaults

  // Load saved state from localStorage
  const [phase, setPhase]               = useState<Phase>('predict')
  const [vote, setVote]                 = useState<'up' | 'side' | 'down' | null>(null)
  const [observations, setObservations] = useState('')
  const [whatHappened, setWhatHappened] = useState('')
  const [whatILearned, setWhatILearned] = useState('')
  const [expandedVocab, setExpandedVocab] = useState<number | null>(null)
  const [showExplain, setShowExplain]   = useState(false)

  // Load: first from localStorage (instant), then sync from server (authoritative)
  // Note: phase is intentionally NOT restored — always start at predict
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
      if (saved.vote)         setVote(saved.vote)
      if (saved.observations) setObservations(saved.observations)
      if (saved.whatHappened) setWhatHappened(saved.whatHappened)
      if (saved.whatILearned) setWhatILearned(saved.whatILearned)
    } catch {}
  }, [storageKey])

  // Sync from server (overwrites localStorage with server truth)
  useEffect(() => {
    if (!contentItemId) return
    fetch(`/api/v1/sessions/${contentItemId}`)
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        const data = res?.data?.sessionData
        if (!data) return
        // phase intentionally not restored — always start at predict
        if (data.vote)         setVote(data.vote)
        if (data.observations) setObservations(data.observations)
        if (data.whatHappened) setWhatHappened(data.whatHappened)
        if (data.whatILearned) setWhatILearned(data.whatILearned)
        localStorage.setItem(storageKey, JSON.stringify(data))
      })
      .catch(() => {})
  }, [contentItemId, storageKey])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function save(updates: Record<string, unknown>) {
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
      const merged = { ...existing, ...updates }
      localStorage.setItem(storageKey, JSON.stringify(merged))

      if (contentItemId) {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
          const latest = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
          fetch(`/api/v1/sessions/${contentItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              progressPct: latest.phase === 'reflect' ? 100 : latest.phase === 'observe' ? 50 : 10,
              completed: latest.phase === 'reflect' && !!latest.whatILearned,
              sessionData: latest,
            }),
          }).catch(() => {})
        }, 800)
      }
    } catch {}
  }

  function handleVote(v: 'up' | 'side' | 'down') { setVote(v); save({ vote: v }) }
  function handleObservations(val: string) { setObservations(val); save({ observations: val }) }
  function handleWhatHappened(val: string) { setWhatHappened(val); save({ whatHappened: val }) }
  function handleWhatILearned(val: string) { setWhatILearned(val); save({ whatILearned: val }) }
  function goToPhase(p: Phase) { setPhase(p); save({ phase: p }) }

  // ── Per-lab content (direct if/else — no object key lookup) ─────────────────
  let labAnimation: React.ReactNode
  let setupCaption: string
  let predictionQ: string
  let voteUp:   { emoji: string; label: string }
  let voteSide: { emoji: string; label: string }
  let voteDown: { emoji: string; label: string }
  let observePlaceholder: string
  let causePlaceholder: string
  let learnedPlaceholder: string
  let predictionCorrectIsDown = false   // for water bottle: "stays in" = down vote

  if (isFireLab) {
    labAnimation       = <FireAnimation />
    setupCaption       = 'The teacher will tilt the mystery bowl toward the lit candles. Watch carefully!'
    predictionQ        = isG12 ? 'What do you think will happen to the candles?' : 'When CO₂ gas pours over the candles, what will happen and why?'
    voteUp             = { emoji: '🔥', label: 'They stay lit!' }
    voteSide           = { emoji: '🤔', label: "I'm not sure…" }
    voteDown           = { emoji: '💨', label: 'They go out' }
    observePlaceholder = 'e.g. The candles went out one by one when the bowl was tilted…'
    causePlaceholder   = 'e.g. I think the gas pushed the air away from the flames…'
    learnedPlaceholder = "e.g. I learned that CO₂ is heavier than air and that's why fire extinguishers work…"
  } else if (isWaterBalloon) {
    labAnimation       = <WaterBalloonAnimation />
    setupCaption       = 'The teacher will hold a water-filled balloon over a candle flame. Watch carefully — will it pop?'
    predictionQ        = isG12
      ? 'What will happen when the teacher holds the water balloon over the flame?'
      : 'Will the water balloon pop over the flame? What do you think will happen to the heat — where will it go?'
    voteUp             = { emoji: '💥', label: 'It will POP!' }
    voteSide           = { emoji: '🤔', label: "I'm not sure…" }
    voteDown           = { emoji: '🎈', label: 'It stays whole!' }
    observePlaceholder = 'e.g. The water balloon did not pop! I saw a black soot mark at the bottom but it stayed whole…'
    causePlaceholder   = isG12
      ? 'e.g. I think the water inside stopped the balloon from getting too hot…'
      : 'e.g. I think the water absorbed the heat energy before the rubber could get hot enough to burst…'
    learnedPlaceholder = isG12
      ? 'e.g. I learned that water absorbs heat and can protect things from fire!'
      : 'e.g. I learned that water has a high specific heat capacity — it absorbs a lot of heat energy before its temperature rises much…'
    predictionCorrectIsDown = true
  } else if (isWaterBottle) {
    labAnimation       = <WaterBottleAnimation />
    setupCaption       = isG12 ? 'Watch the teacher flip the water bottle upside down. Will the water fall out?' : 'The teacher will flip a bottle of water upside down with mesh over the opening. Predict what happens!'
    predictionQ        = isG12 ? 'What will happen when the teacher flips the bottle upside down?' : 'When the bottle is flipped, will the water fall out? What force do you think holds it in?'
    voteUp             = { emoji: '💧', label: 'Water falls out' }
    voteSide           = { emoji: '🤔', label: "I'm not sure…" }
    voteDown           = { emoji: '🙃', label: 'Water stays in!' }
    observePlaceholder = 'e.g. The water stayed inside even upside down! The toothpick floated up…'
    causePlaceholder   = isG12 ? 'e.g. I think the screen kept the water from falling out…' : 'e.g. I think air pressure pushing up through the mesh holds the water in against gravity…'
    learnedPlaceholder = isG12 ? 'e.g. I learned that air can hold water up!' : 'e.g. I learned that air pressure pushes in all directions and surface tension seals tiny holes…'
    predictionCorrectIsDown = true
  } else {
    // magnet / fallback
    labAnimation       = <MagnetAnimation />
    setupCaption       = 'The teacher will hold a pen between two ring magnets without touching. Watch closely!'
    predictionQ        = isG12 ? 'Can a pen really float in mid-air using only magnets?' : 'Can magnets repel strongly enough to overcome gravity? What would need to be true?'
    voteUp             = { emoji: '👍', label: 'Yes — it will float!' }
    voteSide           = { emoji: '🤔', label: "I'm not sure…" }
    voteDown           = { emoji: '👎', label: 'No, it will fall' }
    observePlaceholder = 'e.g. The pen stayed between the magnets without falling…'
    causePlaceholder   = 'e.g. I think the magnets pushing against each other keep it in the air…'
    learnedPlaceholder = 'e.g. I learned that like poles of magnets push each other away…'
  }

  const voteOptions = { up: voteUp, side: voteSide, down: voteDown }

  // G1-2 sees first 3 vocab words; G3-4 sees all
  const vocabToShow = isG12 ? lab.vocab.slice(0, 3) : lab.vocab
  // G1-2 sees first 2 discussion questions; G3-4 sees all
  const questionsToShow = isG12 ? lab.discussionQuestions.slice(0, 2) : lab.discussionQuestions

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white px-4 py-4 flex items-center gap-3 shrink-0">
        <button onClick={() => router.back()} className="text-teal-200 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">🔬 {lab.title}</h1>
          <p className="text-teal-200 text-xs">{lab.conceptShort}</p>
        </div>
        {gradeBand && (
          <span className="text-xs font-bold bg-teal-500 px-2 py-1 rounded-xl shrink-0">
            {gradeBand.toUpperCase()}
          </span>
        )}
      </header>

      {/* Phase tabs */}
      <div className="flex bg-teal-700 px-4 gap-1 shrink-0">
        {([
          { id: 'predict', label: '🤔 Predict', },
          { id: 'observe', label: '👀 Observe', },
          { id: 'reflect', label: '💡 Reflect', },
        ] as { id: Phase; label: string }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => goToPhase(tab.id)}
            className={`flex-1 py-2.5 text-xs font-black rounded-t-xl transition-all
              ${phase === tab.id
                ? 'bg-teal-50 text-teal-700'
                : 'text-teal-300 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-4 overflow-y-auto">

        {/* ── PREDICT phase ─────────────────────────────────────────────────── */}
        {phase === 'predict' && (
          <>
            {/* Animation preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
              {labAnimation}
              <p className="text-xs text-center text-gray-500 pb-3 px-4">
                {setupCaption}
              </p>
            </div>

            {/* Prediction vote */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <p className="font-black text-gray-800 mb-1">Make your prediction!</p>
              <p className="text-sm text-gray-600 mb-4">{predictionQ}</p>
              <div className="flex gap-2">
                {(['up', 'side', 'down'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => handleVote(v)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all active:scale-95
                      ${vote === v
                        ? 'border-teal-500 bg-teal-50 text-teal-700 scale-105'
                        : 'border-gray-200 text-gray-500 hover:border-teal-300'}`}
                  >
                    <span className="text-2xl">{voteOptions[v].emoji}</span>
                    <span className="leading-tight text-center px-1">{voteOptions[v].label}</span>
                  </button>
                ))}
              </div>
              {vote && (
                <p className="mt-3 text-center text-sm text-teal-600 font-semibold">
                  Great prediction! Remember it for after the demo 🎯
                </p>
              )}
            </div>

            {/* Vocab preview — G1-2 gets 3 words, G3-4 gets all */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <p className="font-black text-gray-800 mb-3">
                📚 {isG12 ? 'Science words' : 'Science words to know'}
              </p>
              <div className="flex flex-col gap-2">
                {vocabToShow.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setExpandedVocab(expandedVocab === i ? null : i)}
                    className={`text-left rounded-xl border px-3 py-2.5 transition-all ${colorMap[v.color] ?? colorMap.blue}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{v.word}</span>
                      <span className="text-xs opacity-60">{expandedVocab === i ? '▲' : '▼'}</span>
                    </div>
                    {expandedVocab === i && (
                      <p className="text-xs mt-1 leading-relaxed opacity-80">{v.definition}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => goToPhase('observe')}
              className="bg-teal-600 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all shadow"
            >
              Ready for the demo! 👀
            </button>
          </>
        )}

        {/* ── OBSERVE phase ─────────────────────────────────────────────────── */}
        {phase === 'observe' && (
          <>
            <div className="bg-teal-100 border border-teal-300 rounded-2xl px-4 py-3">
              <p className="text-teal-800 text-sm font-bold">
                {isG12 ? '👀 Watch and tell us what you see!' : '👀 Watch the demo carefully — then fill this in!'}
              </p>
              {vote && (
                <p className="text-teal-700 text-xs mt-1">
                  Your prediction: {voteOptions[vote].emoji} {voteOptions[vote].label}
                </p>
              )}
            </div>

            {/* Observation notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <label className="block font-black text-gray-800 mb-2">
                🔭 {isG12 ? 'What did you see?' : 'What did you see happen?'}
              </label>
              {!isG12 && (
                <p className="text-xs text-gray-500 mb-2">Write down exactly what you observed — even the small details!</p>
              )}
              <textarea
                value={observations}
                onChange={e => handleObservations(e.target.value)}
                placeholder=""
                rows={isG12 ? 3 : 4}
                className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* What caused it — G3-4 only gets the deeper "why" prompt */}
            {!isG12 && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
                <label className="block font-black text-gray-800 mb-2">
                  🤔 What do you think caused it?
                </label>
                <p className="text-xs text-gray-500 mb-2">Try to explain in your own words — it&apos;s OK if you&apos;re not sure yet!</p>
                <textarea
                  value={whatHappened}
                  onChange={e => handleWhatHappened(e.target.value)}
                  placeholder=""
                  rows={4}
                  className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            )}

            {/* G1-2 gets a simpler "why" prompt */}
            {isG12 && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
                <label className="block font-black text-gray-800 mb-2">
                  🤔 Why do you think that happened?
                </label>
                <textarea
                  value={whatHappened}
                  onChange={e => handleWhatHappened(e.target.value)}
                  placeholder=""
                  rows={3}
                  className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            )}

            <button
              onClick={() => goToPhase('reflect')}
              className="bg-teal-600 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all shadow"
            >
              See the explanation 💡
            </button>
          </>
        )}

        {/* ── REFLECT phase ─────────────────────────────────────────────────── */}
        {phase === 'reflect' && (
          <>
            {/* Was your prediction right? */}
            {vote && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
                <p className="font-black text-gray-800 mb-2">🎯 Your prediction</p>
                <div className={`rounded-xl px-4 py-3 border-2 ${
                  (predictionCorrectIsDown ? vote === 'down' : vote === 'up')
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : vote === 'side'
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                    : 'bg-orange-50 border-orange-300 text-orange-800'
                }`}>
                  <p className="font-bold text-sm">{voteOptions[vote].emoji} {voteOptions[vote].label}</p>
                  <p className="text-xs mt-1">
                    {(predictionCorrectIsDown ? vote === 'down' : vote === 'up')
                      ? '✅ You were right! Great scientific instincts.'
                      : vote === 'side'
                      ? '🙌 You kept an open mind — that\'s what scientists do!'
                      : '🤩 It surprised you! That\'s science — it doesn\'t always do what we expect.'}
                  </p>
                </div>
              </div>
            )}

            {/* The science */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
              <button
                onClick={() => setShowExplain(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-black text-gray-800">
                  {isG12 ? '🧠 What really happened?' : '🧠 The Science Explained'}
                </span>
                <span className="text-teal-500 text-xl">{showExplain ? '▲' : '▼'}</span>
              </button>
              {showExplain && (
                <div className="px-5 pb-5 border-t border-teal-50">
                  <p className="text-gray-700 text-sm leading-relaxed mt-3">{lab.kidExplanation}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {lab.realWorld.map((r, i) => (
                      <div key={i} className="text-sm text-gray-600 bg-teal-50 rounded-xl px-3 py-2">{r}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* What I learned */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <label className="block font-black text-gray-800 mb-2">
                ✏️ {isG12 ? 'What did you learn?' : 'What did you learn today?'}
              </label>
              {!isG12 && (
                <p className="text-xs text-gray-500 mb-2">Write one or two sentences — in your own words!</p>
              )}
              <textarea
                value={whatILearned}
                onChange={e => handleWhatILearned(e.target.value)}
                placeholder=""
                rows={isG12 ? 2 : 4}
                className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* Discussion questions — G1-2 gets 2, G3-4 gets all */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <p className="font-black text-gray-800 mb-3">💬 Think about these questions!</p>
              <div className="flex flex-col gap-2">
                {questionsToShow.map((q, i) => (
                  <div key={i} className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
                    <p className="text-sm text-gray-700 font-semibold">{i + 1}. {q.question}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="bg-teal-600 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all shadow"
            >
              ← Back to Dashboard
            </button>
          </>
        )}
      </main>
    </div>
  )
}

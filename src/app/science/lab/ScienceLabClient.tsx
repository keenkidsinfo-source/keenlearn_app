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
        <text x="255" y="192" textAnchor="middle" fontSize="10" fill="#6b7280">bowl + CO₂</text>
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

const colorMap: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  green:  'bg-green-100 text-green-800 border-green-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  red:    'bg-red-100 text-red-800 border-red-200',
}

// ── Phases of the lab session ─────────────────────────────────────────────────
type Phase = 'predict' | 'observe' | 'reflect'

export function ScienceLabClient({ lab, contentItemId }: { lab: ScienceLab; contentItemId: string | null }) {
  const router = useRouter()
  const storageKey = `kk_science_${lab.id}`

  // Load saved state from localStorage
  const [phase, setPhase]               = useState<Phase>('predict')
  const [vote, setVote]                 = useState<'up' | 'side' | 'down' | null>(null)
  const [observations, setObservations] = useState('')
  const [whatHappened, setWhatHappened] = useState('')
  const [whatILearned, setWhatILearned] = useState('')
  const [expandedVocab, setExpandedVocab] = useState<number | null>(null)
  const [showExplain, setShowExplain]   = useState(false)

  // Load: first from localStorage (instant), then sync from server (authoritative)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
      if (saved.phase)        setPhase(saved.phase)
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
        if (data.phase)        setPhase(data.phase)
        if (data.vote)         setVote(data.vote)
        if (data.observations) setObservations(data.observations)
        if (data.whatHappened) setWhatHappened(data.whatHappened)
        if (data.whatILearned) setWhatILearned(data.whatILearned)
        // Sync back to localStorage so it's available offline
        localStorage.setItem(storageKey, JSON.stringify(data))
      })
      .catch(() => {})
  }, [contentItemId, storageKey])

  // Debounced server save — fire-and-forget, 800ms after last change
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function save(updates: Record<string, unknown>) {
    // 1. Persist to localStorage immediately
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
      const merged = { ...existing, ...updates }
      localStorage.setItem(storageKey, JSON.stringify(merged))

      // 2. Debounce server save
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

  function handleVote(v: 'up' | 'side' | 'down') {
    setVote(v)
    save({ vote: v })
  }

  function handleObservations(val: string) {
    setObservations(val)
    save({ observations: val })
  }

  function handleWhatHappened(val: string) {
    setWhatHappened(val)
    save({ whatHappened: val })
  }

  function handleWhatILearned(val: string) {
    setWhatILearned(val)
    save({ whatILearned: val })
  }

  function goToPhase(p: Phase) {
    setPhase(p)
    save({ phase: p })
  }

  const isFireLab = lab.id.includes('fire')
  const predictionQ = isFireLab
    ? 'Will the invisible gas put out the candles?'
    : 'Can a pen really float in mid-air using only magnets?'
  const voteOptions = {
    up:   { emoji: '👍', label: isFireLab ? 'Yes — the candles will go out!' : 'Yes — it will float!' },
    side: { emoji: '🤔', label: "I'm not sure…" },
    down: { emoji: '👎', label: isFireLab ? 'Nothing will happen' : 'No, it will fall' },
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white px-4 py-4 flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/dashboard')} className="text-teal-200 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">🔬 {lab.title}</h1>
          <p className="text-teal-200 text-xs">{lab.conceptShort}</p>
        </div>
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
            {/* Animated preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
              <div className="px-4 pt-4 pb-1">
                <p className="text-xs font-bold text-teal-500 uppercase tracking-wide">Watch what happens in class today</p>
                <p className="text-sm font-black text-gray-800 mt-0.5">✨ {lab.wowFactor}</p>
              </div>
              {isFireLab ? <FireAnimation /> : <MagnetAnimation />}
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

            {/* Vocab preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <p className="font-black text-gray-800 mb-3">📚 Science words to know</p>
              <div className="flex flex-col gap-2">
                {lab.vocab.map((v, i) => (
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
              <p className="text-teal-800 text-sm font-bold">👀 Watch the demo carefully — then fill this in!</p>
              {vote && (
                <p className="text-teal-700 text-xs mt-1">
                  Your prediction: {voteOptions[vote].emoji} {voteOptions[vote].label}
                </p>
              )}
            </div>

            {/* Observation notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <label className="block font-black text-gray-800 mb-2">
                🔭 What did you see happen?
              </label>
              <p className="text-xs text-gray-500 mb-2">Write down exactly what you observed — even the small details!</p>
              <textarea
                value={observations}
                onChange={e => handleObservations(e.target.value)}
                placeholder="e.g. The candles went out one by one when the bowl was tilted…"
                rows={4}
                className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* What happened + why */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <label className="block font-black text-gray-800 mb-2">
                🤔 What do you think caused it?
              </label>
              <p className="text-xs text-gray-500 mb-2">Try to explain in your own words — it's OK if you're not sure yet!</p>
              <textarea
                value={whatHappened}
                onChange={e => handleWhatHappened(e.target.value)}
                placeholder="e.g. I think the gas pushed the air away from the flames…"
                rows={4}
                className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

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
                  vote === 'up' ? 'bg-green-50 border-green-300 text-green-800'
                  : vote === 'down' ? 'bg-orange-50 border-orange-300 text-orange-800'
                  : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                }`}>
                  <p className="font-bold text-sm">{voteOptions[vote].emoji} {voteOptions[vote].label}</p>
                  <p className="text-xs mt-1">
                    {vote === 'up' ? '✅ You were right! Great scientific instincts.' : vote === 'down' ? '🤩 It surprised you! That\'s science — it doesn\'t always do what we expect.' : '🙌 You kept an open mind — that\'s what scientists do!'}
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
                <span className="font-black text-gray-800">🧠 The Science Explained</span>
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
                ✏️ What did you learn today?
              </label>
              <p className="text-xs text-gray-500 mb-2">Write one or two sentences — in your own words!</p>
              <textarea
                value={whatILearned}
                onChange={e => handleWhatILearned(e.target.value)}
                placeholder="e.g. I learned that CO₂ is heavier than air and that's why fire extinguishers work…"
                rows={4}
                className="w-full border-2 border-teal-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* Discussion questions (student view — no answers shown) */}
            <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
              <p className="font-black text-gray-800 mb-3">💬 Discussion questions — think about these!</p>
              <div className="flex flex-col gap-2">
                {lab.discussionQuestions.map((q, i) => (
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ScienceLab } from '@/lib/scienceLabs'

const VOTE_LABELS = {
  up:   { emoji: '👍', label: 'Yes — the candles will go out!' },
  side: { emoji: '🤔', label: "I'm not sure…" },
  down: { emoji: '👎', label: 'Nothing will happen' },
}
const VOTE_LABELS_PEN = {
  up:   { emoji: '👍', label: 'Yes — it will float!' },
  side: { emoji: '🤔', label: "I'm not sure…" },
  down: { emoji: '👎', label: 'No, it will fall down' },
}

// ── Animated illustration: Fire Extinguisher ─────────────────────────────────
function FireAnimation() {
  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 220 }}>
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
      <svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
        {/* Base surface */}
        <rect x="20" y="170" width="280" height="8" rx="4" fill="#d1d5db"/>

        {/* Candle 1 */}
        <rect x="55" y="140" width="18" height="35" rx="3" fill="#fef3c7"/>
        <rect x="63" y="136" width="2" height="8" rx="1" fill="#6b7280"/>
        <g className="flame" style={{transformOrigin:'64px 136px'}}>
          <ellipse cx="64" cy="128" rx="6" ry="10" fill="#f97316" opacity="0.9"/>
          <ellipse cx="64" cy="131" rx="4" ry="6" fill="#fbbf24"/>
          <ellipse cx="64" cy="134" rx="2" ry="3" fill="#fef08a"/>
        </g>

        {/* Candle 2 */}
        <rect x="100" y="145" width="18" height="30" rx="3" fill="#fce7f3"/>
        <rect x="108" y="141" width="2" height="8" rx="1" fill="#6b7280"/>
        <g className="flame2" style={{transformOrigin:'109px 141px'}}>
          <ellipse cx="109" cy="133" rx="6" ry="10" fill="#f97316" opacity="0.9"/>
          <ellipse cx="109" cy="136" rx="4" ry="6" fill="#fbbf24"/>
          <ellipse cx="109" cy="139" rx="2" ry="3" fill="#fef08a"/>
        </g>

        {/* Candle 3 */}
        <rect x="145" y="138" width="18" height="37" rx="3" fill="#dbeafe"/>
        <rect x="153" y="134" width="2" height="8" rx="1" fill="#6b7280"/>
        <g className="flame3" style={{transformOrigin:'154px 134px'}}>
          <ellipse cx="154" cy="126" rx="6" ry="10" fill="#f97316" opacity="0.9"/>
          <ellipse cx="154" cy="129" rx="4" ry="6" fill="#fbbf24"/>
          <ellipse cx="154" cy="132" rx="2" ry="3" fill="#fef08a"/>
        </g>

        {/* Bowl with fizzing */}
        <g className="pour-bowl" style={{transformOrigin:'260px 145px'}}>
          <ellipse cx="255" cy="145" rx="38" ry="16" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
          <rect x="217" y="130" width="76" height="18" rx="6" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2"/>
          {/* vinegar fizz */}
          <ellipse cx="255" cy="134" rx="28" ry="8" fill="#fef9c3" opacity="0.8"/>
          <circle cx="248" cy="132" r="3" fill="white" opacity="0.7" className="bubble1"/>
          <circle cx="258" cy="128" r="2.5" fill="white" opacity="0.8" className="bubble2"/>
          <circle cx="264" cy="133" r="2" fill="white" opacity="0.6" className="bubble3"/>
        </g>

        {/* CO2 invisible gas cloud */}
        <ellipse cx="110" cy="162" rx="80" ry="12" fill="#93c5fd" opacity="0" className="co2-cloud"/>

        {/* Labels */}
        <text x="64" y="192" textAnchor="middle" fontSize="10" fill="#6b7280">candles</text>
        <text x="255" y="192" textAnchor="middle" fontSize="10" fill="#6b7280">bowl + CO₂</text>
      </svg>
    </div>
  )
}

// ── Animated illustration: Spinning Magnetic Pen ─────────────────────────────
function MagnetAnimation() {
  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 220 }}>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        @keyframes force-up {
          0%,100% { opacity:0.3; transform: scaleY(1); }
          50% { opacity:0.7; transform: scaleY(1.2); }
        }
        @keyframes force-down {
          0%,100% { opacity:0.2; }
          50% { opacity:0.5; }
        }
        .pen-group { animation: spin 3s linear infinite; transform-origin: 160px 100px; }
        .force-arrow-up { animation: force-up 1.5s ease-in-out infinite; transform-origin: center; }
        .force-arrow-down { animation: force-down 1.5s ease-in-out infinite 0.75s; transform-origin: center; }
      `}</style>
      <svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
        {/* Base */}
        <rect x="120" y="152" width="80" height="14" rx="5" fill="#9ca3af"/>
        <rect x="130" y="146" width="60" height="12" rx="5" fill="#3b82f6" opacity="0.85"/>
        <text x="160" y="156" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">N</text>

        {/* Force arrows up */}
        <g className="force-arrow-up">
          <line x1="145" y1="140" x2="145" y2="118" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" opacity="0.5"/>
          <polygon points="145,112 141,120 149,120" fill="#3b82f6" opacity="0.5"/>
          <line x1="175" y1="140" x2="175" y2="118" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" opacity="0.5"/>
          <polygon points="175,112 171,120 179,120" fill="#3b82f6" opacity="0.5"/>
        </g>

        {/* Gravity arrow down */}
        <g className="force-arrow-down">
          <line x1="160" y1="78" x2="160" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" opacity="0.4"/>
          <polygon points="160,106 156,98 164,98" fill="#ef4444" opacity="0.4"/>
        </g>

        {/* Floating pen (spinning) */}
        <g className="pen-group">
          <rect x="148" y="88" width="24" height="7" rx="3" fill="#7c3aed"/>
          <rect x="155" y="80" width="10" height="12" rx="2" fill="#6d28d9"/>
          <ellipse cx="160" cy="100" rx="14" ry="4" fill="#8b5cf6" opacity="0.7"/>
          <rect x="150" y="84" width="20" height="18" rx="3" fill="#7c3aed"/>
          <ellipse cx="160" cy="84" rx="5" ry="3" fill="#a78bfa"/>
          <text x="160" y="97" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">S</text>
        </g>

        {/* Labels */}
        <text x="212" y="108" fontSize="10" fill="#3b82f6">repel ↑</text>
        <text x="212" y="88" fontSize="10" fill="#ef4444">gravity ↓</text>
        <text x="160" y="190" textAnchor="middle" fontSize="10" fill="#6b7280">same poles push apart → pen floats!</text>
      </svg>
    </div>
  )
}

// ── Vocab badge ───────────────────────────────────────────────────────────────
const colorMap = {
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  green:  'bg-green-100 text-green-800 border-green-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  red:    'bg-red-100 text-red-800 border-red-200',
}

// ── Main component ────────────────────────────────────────────────────────────
export function ScienceLabClient({ lab }: { lab: ScienceLab }) {
  const router = useRouter()
  const [vote, setVote]           = useState<'up' | 'side' | 'down' | null>(null)
  const [showExplain, setShowExplain] = useState(false)
  const [expandedVocab, setExpandedVocab] = useState<number | null>(null)

  const isFireLab = lab.id.includes('fire')
  const voteLabels = isFireLab ? VOTE_LABELS : VOTE_LABELS_PEN
  const predictionQ = isFireLab
    ? 'Will the invisible gas put out the candles?'
    : 'Can a pen really float in mid-air using only magnets?'

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white px-4 py-4 flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/dashboard')} className="text-teal-200 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">🔬 Science Lab</h1>
          <p className="text-teal-200 text-xs">August {new Date(lab.date).getDate()} · Instructor demo day</p>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-5">

        {/* Title card */}
        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5 text-center">
          <div className="text-5xl mb-2">{lab.emoji}</div>
          <h2 className="text-2xl font-black text-teal-700">{lab.title}</h2>
          <p className="text-teal-500 text-sm mt-1">{lab.conceptShort}</p>
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <p className="text-yellow-800 text-sm font-semibold">✨ {lab.wowFactor}</p>
          </div>
        </div>

        {/* Animation */}
        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
          <div className="bg-teal-50 px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-teal-500 uppercase tracking-wide">Watch what happens</p>
          </div>
          {isFireLab ? <FireAnimation /> : <MagnetAnimation />}
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-400 text-center">Your instructor will do this demo live in class!</p>
          </div>
        </div>

        {/* Prediction vote */}
        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
          <p className="font-black text-gray-800 mb-1">🤔 Make your prediction!</p>
          <p className="text-sm text-gray-600 mb-4">{predictionQ}</p>
          <div className="flex gap-3">
            {(['up', 'side', 'down'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVote(v)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95
                  ${vote === v
                    ? 'border-teal-500 bg-teal-50 text-teal-700 scale-105'
                    : 'border-gray-200 text-gray-500 hover:border-teal-300'}`}
              >
                <span className="text-2xl">{voteLabels[v].emoji}</span>
                <span className="text-xs leading-tight text-center px-1">{voteLabels[v].label}</span>
              </button>
            ))}
          </div>
          {vote && (
            <p className="mt-3 text-center text-sm text-teal-600 font-semibold animate-bounce">
              Great prediction! Remember it — find out if you were right in class! 🎯
            </p>
          )}
        </div>

        {/* Explanation toggle */}
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

        {/* Vocabulary */}
        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5">
          <p className="font-black text-gray-800 mb-3">📚 Science Words</p>
          <div className="flex flex-col gap-2">
            {lab.vocab.map((v, i) => (
              <button
                key={i}
                onClick={() => setExpandedVocab(expandedVocab === i ? null : i)}
                className={`text-left rounded-xl border px-3 py-2.5 transition-all ${colorMap[v.color]}`}
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

        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-teal-600 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 transition-all shadow"
        >
          ← Back to Dashboard
        </button>
      </main>
    </div>
  )
}

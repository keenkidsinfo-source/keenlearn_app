'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { CodingTheoryDeck } from '@/lib/coding-theory-slides'

interface Props { deck: CodingTheoryDeck; codingDayId: string }

// ── Scratch block colors (authentic) ──────────────────────────────────────────
const BLOCK = {
  event:    '#ffab19',
  motion:   '#4c97ff',
  control:  '#ffab19',
  sensing:  '#5cb1d6',
  variable: '#ff8c1a',
  looks:    '#9966ff',
  operator: '#59c059',
}

// ── G1-2 · Week 1 ─────────────────────────────────────────────────────────────
function SvgScratchUI() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#1e293b" rx="14"/>
      <text x="380" y="26" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">The Scratch Editor 🖥️</text>

      {/* Block Library panel */}
      <rect x="12" y="40" width="160" height="270" rx="10" fill="#7c3aed"/>
      <text x="92" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">Block Library 🧩</text>
      {[
        ['#ffab19', 'Motion'],['#4c97ff', 'Events'],['#ffab19', 'Control'],
        ['#5cb1d6', 'Sensing'],['#9966ff', 'Looks'],['#ff8c1a', 'Variables'],
      ].map(([col, name], i) => (
        <g key={i}>
          <rect x="22" y={76 + i * 36} width="140" height="26" rx="7" fill={col}/>
          <text x="92" y={93 + i * 36} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{name}</text>
        </g>
      ))}

      {/* Code Area */}
      <rect x="184" y="40" width="260" height="270" rx="10" fill="#334155"/>
      <text x="314" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#e2e8f0">Code Area 💻</text>
      {/* Stacked blocks */}
      <rect x="204" y="78" width="200" height="32" rx="7" fill={BLOCK.event}/>
      <text x="304" y="99" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">when 🚩 clicked</text>
      <rect x="214" y="110" width="180" height="30" rx="7" fill={BLOCK.motion}/>
      <text x="304" y="130" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">go to x: 0  y: -130</text>
      <rect x="214" y="140" width="180" height="30" rx="7" fill={BLOCK.looks}/>
      <text x="304" y="160" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">set size to 50 %</text>
      <text x="314" y="205" textAnchor="middle" fontSize="28" fill="#64748b">+</text>
      <text x="314" y="232" textAnchor="middle" fontSize="11" fill="#94a3b8">Drag more blocks here</text>

      {/* Stage */}
      <rect x="456" y="40" width="292" height="200" rx="10" fill="#dbeafe"/>
      <text x="602" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">STAGE 🎬</text>
      {/* Simple rocket sprite */}
      <polygon points="602,95 585,150 619,150" fill="#64748b"/>
      <rect x="591" y="145" width="22" height="16" rx="3" fill="#475569"/>
      <ellipse cx="602" cy="95" rx="10" ry="12" fill="#94a3b8"/>
      <text x="602" y="175" textAnchor="middle" fontSize="10" fill="#1e40af">Sprite on stage!</text>

      {/* Sprite list */}
      <rect x="456" y="248" width="134" height="64" rx="10" fill="#1e40af"/>
      <text x="523" y="268" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Sprite List</text>
      <rect x="466" y="276" width="42" height="28" rx="6" fill="#3b82f6"/>
      <text x="487" y="294" textAnchor="middle" fontSize="18">🚀</text>

      {/* Labels */}
      <rect x="596" y="248" width="152" height="64" rx="10" fill="#0f172a"/>
      <text x="672" y="265" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">✅ Today&apos;s flow:</text>
      <text x="672" y="281" textAnchor="middle" fontSize="10" fill="#e2e8f0">1. Pick sprite from library</text>
      <text x="672" y="295" textAnchor="middle" fontSize="10" fill="#e2e8f0">2. Drag blocks to Code Area</text>
      <text x="672" y="309" textAnchor="middle" fontSize="10" fill="#e2e8f0">3. Click 🚩 to run!</text>
    </svg>
  )
}

function SvgBlocksSnap() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f8fafc" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">Snap blocks together — like LEGO! 🧩</text>

      {/* Block 1: Events */}
      <rect x="220" y="55" width="320" height="50" rx="10" fill={BLOCK.event} stroke="#d97706" strokeWidth="2"/>
      <text x="380" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">EVENTS (yellow)</text>
      <text x="380" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">when 🚩 clicked</text>

      {/* snap connector visual */}
      <polygon points="310,105 340,105 340,118 310,118" fill={BLOCK.motion} opacity="0.6"/>
      <polygon points="420,105 450,105 450,118 420,118" fill={BLOCK.motion} opacity="0.6"/>
      <text x="380" y="116" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1d4ed8">↕ SNAP!</text>

      {/* Block 2: Motion */}
      <rect x="220" y="118" width="320" height="50" rx="10" fill={BLOCK.motion} stroke="#1d4ed8" strokeWidth="2"/>
      <text x="380" y="138" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e3a8a">MOTION (blue)</text>
      <text x="380" y="157" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">move 10 steps</text>

      {/* Block 3: Looks */}
      <rect x="220" y="168" width="320" height="50" rx="10" fill={BLOCK.looks} stroke="#7c3aed" strokeWidth="2"/>
      <text x="380" y="188" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4c1d95">LOOKS (purple)</text>
      <text x="380" y="207" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">set size to 50 %</text>

      {/* Result */}
      <rect x="180" y="238" width="400" height="70" rx="12" fill="#1e293b"/>
      <text x="380" y="262" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24">Click 🚩 → runs top to bottom, in order!</text>
      <text x="380" y="282" textAnchor="middle" fontSize="12" fill="#e2e8f0">1. Flag clicked  →  2. Move  →  3. Change size</text>
      <text x="380" y="300" textAnchor="middle" fontSize="11" fill="#94a3b8">Bigger numbers in move = bigger jump!</text>
    </svg>
  )
}

// ── G1-2 · Week 2 ─────────────────────────────────────────────────────────────
function SvgRepeatVsForever() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f0f9ff" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">Two Types of Loops 🔁</text>

      {/* REPEAT panel */}
      <rect x="20" y="45" width="340" height="230" rx="12" fill="white" stroke="#f59e0b" strokeWidth="3"/>
      <rect x="20" y="45" width="340" height="42" rx="12" fill={BLOCK.control}/>
      <rect x="20" y="73" width="340" height="14" fill={BLOCK.control}/>
      <text x="190" y="72" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">repeat (10)</text>

      {/* inner block */}
      <rect x="50" y="100" width="280" height="36" rx="8" fill={BLOCK.motion}/>
      <text x="190" y="123" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">move 10 steps</text>

      {/* repeat close bar */}
      <rect x="20" y="148" width="340" height="20" rx="0" fill={BLOCK.control}/>
      <rect x="20" y="160" width="340" height="8" rx="8" fill={BLOCK.control}/>

      <text x="190" y="200" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#92400e">✅ Runs move 10× then STOPS</text>
      <text x="190" y="222" textAnchor="middle" fontSize="12" fill="#374151">Use when you want exactly</text>
      <text x="190" y="240" textAnchor="middle" fontSize="12" fill="#374151">N repetitions</text>
      <text x="190" y="264" textAnchor="middle" fontSize="24">🔢</text>

      {/* FOREVER panel */}
      <rect x="400" y="45" width="340" height="230" rx="12" fill="white" stroke="#ef4444" strokeWidth="3"/>
      <rect x="400" y="45" width="340" height="42" rx="12" fill="#ff6680"/>
      <rect x="400" y="73" width="340" height="14" fill="#ff6680"/>
      <text x="570" y="72" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">forever ♾️</text>

      {/* inner block */}
      <rect x="430" y="100" width="280" height="36" rx="8" fill={BLOCK.motion}/>
      <text x="570" y="123" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">move 10 steps</text>
      <rect x="430" y="140" width="280" height="36" rx="8" fill="#5cb1d6"/>
      <text x="570" y="162" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">if on edge, bounce</text>

      {/* No closing bar = runs forever */}
      <text x="570" y="200" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626">♾️ NEVER STOPS on its own!</text>
      <text x="570" y="222" textAnchor="middle" fontSize="12" fill="#374151">Use for things that run</text>
      <text x="570" y="240" textAnchor="middle" fontSize="12" fill="#374151">for the whole game</text>
      <text x="570" y="264" textAnchor="middle" fontSize="24">🔴 Stop button ends it</text>
    </svg>
  )
}

function SvgBounce() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#e0f2fe" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">if on edge, bounce! ↩️</text>

      {/* Stage area */}
      <rect x="30" y="44" width="700" height="200" rx="12" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="3"/>

      {/* Left wall */}
      <rect x="30" y="44" width="8" height="200" fill="#1d4ed8"/>
      {/* Right wall */}
      <rect x="722" y="44" width="8" height="200" fill="#1d4ed8"/>

      {/* Sprite moving right */}
      <circle cx="140" cy="144" r="28" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
      <text x="140" y="150" textAnchor="middle" fontSize="20">😺</text>
      {/* Motion arrow right */}
      <line x1="172" y1="144" x2="340" y2="144" stroke="#1d4ed8" strokeWidth="4" strokeDasharray="12,6"/>
      <polygon points="338,135 360,144 338,153" fill="#1d4ed8"/>
      <text x="270" y="132" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1d4ed8">move →</text>

      {/* Bounce at wall */}
      <text x="620" y="144" textAnchor="middle" fontSize="40">💥</text>
      <text x="620" y="175" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">hits wall!</text>

      {/* Arrow bouncing back */}
      <line x1="590" y1="185" x2="430" y2="210" stroke="#dc2626" strokeWidth="4" strokeDasharray="10,6"/>
      <polygon points="432,200 408,217 425,226" fill="#dc2626"/>
      <text x="510" y="208" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#dc2626">bounces ←</text>

      {/* Sprite bouncing back */}
      <circle cx="390" cy="228" r="28" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
      <text x="390" y="234" textAnchor="middle" fontSize="20">😺</text>

      {/* Code block at bottom */}
      <rect x="130" y="260" width="500" height="56" rx="12" fill="#ff6680"/>
      <text x="380" y="283" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">forever</text>
      <rect x="160" y="292" width="440" height="18" rx="6" fill={BLOCK.motion}/>
      <text x="380" y="305" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">move 5 steps   +   if on edge, bounce</text>
    </svg>
  )
}

// ── G1-2 · Week 3 ─────────────────────────────────────────────────────────────
function SvgTouchingConcept() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#fef9c3" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">Sensing = Touching! 👆</text>

      {/* NOT touching */}
      <rect x="20" y="44" width="340" height="210" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="190" y="66" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#64748b">NOT touching</text>
      {/* Two sprites apart */}
      <circle cx="100" cy="140" r="34" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
      <text x="100" y="147" textAnchor="middle" fontSize="26">⚡</text>
      <text x="100" y="194" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">Pikachu</text>
      <circle cx="280" cy="140" r="30" fill="#22c55e" stroke="#15803d" strokeWidth="3"/>
      <text x="280" y="147" textAnchor="middle" fontSize="22">🐛</text>
      <text x="280" y="190" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803d">Caterpie</text>
      {/* X mark */}
      <text x="190" y="148" textAnchor="middle" fontSize="28" fill="#ef4444">✗</text>
      <rect x="60" y="220" width="260" height="24" rx="8" fill="#e2e8f0"/>
      <text x="190" y="236" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">touching? → NO → nothing happens</text>

      {/* IS touching */}
      <rect x="400" y="44" width="340" height="210" rx="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="3"/>
      <text x="570" y="66" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">IS touching! ✅</text>
      {/* Sprites overlapping */}
      <circle cx="510" cy="140" r="34" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
      <text x="510" y="147" textAnchor="middle" fontSize="26">⚡</text>
      <circle cx="570" cy="140" r="30" fill="#22c55e" stroke="#15803d" strokeWidth="3"/>
      <text x="570" y="147" textAnchor="middle" fontSize="22">🐛</text>
      {/* Glow effect */}
      <circle cx="540" cy="140" r="48" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8,4" opacity="0.7"/>
      <text x="650" y="148" textAnchor="middle" fontSize="28" fill="#22c55e">✓</text>
      <rect x="410" y="220" width="320" height="24" rx="8" fill="#16a34a"/>
      <text x="570" y="236" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">touching? → YES → change Score by 1 ⭐</text>

      {/* Code block at bottom */}
      <rect x="160" y="270" width="440" height="50" rx="12" fill={BLOCK.sensing}/>
      <text x="380" y="288" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">if  &lt; touching [Caterpie ▾] ? &gt;  then</text>
      <rect x="190" y="298" width="380" height="16" rx="6" fill="#ff8c1a"/>
      <text x="380" y="310" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change Score by 1</text>
    </svg>
  )
}

function SvgPokemonCatch() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#0f172a"/>
        </radialGradient>
      </defs>
      <rect width="760" height="330" fill="url(#skyGrad)" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">Pokémon Catcher! ⚡</text>

      {/* Stars */}
      {[[80,60],[200,45],[350,55],[500,42],[650,58],[720,70],[40,110],[700,100]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="white" opacity="0.7"/>
      ))}

      {/* Ground / forest floor */}
      <rect x="0" y="260" width="760" height="70" rx="0" fill="#14532d"/>
      {/* Trees */}
      {[40,120,680,720].map((x,i) => (
        <g key={i}>
          <rect x={x+6} y="230" width="8" height="40" fill="#92400e"/>
          <polygon points={`${x},230 ${x+20},230 ${x+10},200`} fill="#15803d"/>
        </g>
      ))}

      {/* Pikachu (bottom left) */}
      <ellipse cx="160" cy="230" rx="36" ry="30" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
      <circle cx="148" cy="218" r="6" fill="#1e293b"/>
      <circle cx="172" cy="218" r="6" fill="#1e293b"/>
      <path d="M148,232 Q160,242 172,232" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
      {/* Pikachu ears */}
      <polygon points="140,205 148,182 162,205" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      <polygon points="178,205 186,182 174,205" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      {/* Pikachu tail zigzag */}
      <path d="M195,225 L210,215 L205,205 L220,195" fill="none" stroke="#fbbf24" strokeWidth="4"/>
      <text x="160" y="270" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Pikachu</text>
      {/* Arrow keys */}
      <text x="160" y="290" textAnchor="middle" fontSize="11" fill="#94a3b8">← → arrow keys</text>

      {/* Pokeball flying */}
      <circle cx="380" cy="150" r="24" fill="#ef4444" stroke="white" strokeWidth="3"/>
      <line x1="356" y1="150" x2="404" y2="150" stroke="white" strokeWidth="3"/>
      <circle cx="380" cy="150" r="8" fill="white" stroke="#374151" strokeWidth="2"/>
      {/* Flight path */}
      <path d="M196,225 Q280,80 350,135" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8,5" opacity="0.6"/>
      <text x="380" y="130" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">PokéBall!</text>

      {/* Caterpie (top right) */}
      <ellipse cx="590" cy="100" rx="40" ry="24" fill="#4ade80" stroke="#15803d" strokeWidth="3"/>
      <circle cx="572" cy="95" r="6" fill="#1e293b"/>
      <circle cx="594" cy="93" r="6" fill="#1e293b"/>
      <path d="M572,108 Q583,116 594,108" fill="none" stroke="#1e293b" strokeWidth="2"/>
      {/* Caterpie bumps */}
      {[545,562,579,596,613,630].map((x,i) => (
        <ellipse key={i} cx={x} cy="106" rx="9" ry="11" fill="#4ade80" stroke="#15803d" strokeWidth="2"/>
      ))}
      <text x="590" y="136" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4ade80">Caterpie</text>

      {/* Score box */}
      <rect x="600" y="44" width="140" height="40" rx="10" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      <text x="670" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">Score</text>
      <text x="670" y="78" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">3 ⭐</text>
    </svg>
  )
}

// ── G1-2 · Week 4 ─────────────────────────────────────────────────────────────
function SvgHarryFire() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#0f172a" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">Harry vs Voldemort! ⚡</text>
      {/* Stars */}
      {[[60,55],[180,44],[300,60],[500,45],[640,55],[720,80],[100,90]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2" fill="white" opacity="0.5"/>
      ))}

      {/* Harry */}
      <circle cx="140" cy="160" r="24" fill="#fde68a" stroke="#d97706" strokeWidth="2"/>
      <line x1="140" y1="72" x2="140" y2="60" stroke="#1f2937" strokeWidth="3"/>
      <rect x="116" y="52" width="48" height="18" rx="3" fill="#1f2937"/>
      {/* Glasses */}
      <circle cx="130" cy="162" r="6" fill="none" stroke="#374151" strokeWidth="2"/>
      <circle cx="150" cy="162" r="6" fill="none" stroke="#374151" strokeWidth="2"/>
      <line x1="136" y1="162" x2="144" y2="162" stroke="#374151" strokeWidth="1.5"/>
      {/* Robe */}
      <polygon points="116,184 164,184 170,250 110,250" fill="#1d4ed8"/>
      {/* Wand */}
      <line x1="164" y1="180" x2="210" y2="160" stroke="#92400e" strokeWidth="4"/>
      <circle cx="212" cy="158" r="5" fill="#fbbf24"/>
      <text x="140" y="278" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#93c5fd">Harry</text>
      <rect x="90" y="288" width="100" height="22" rx="8" fill="#1d4ed8"/>
      <text x="140" y="303" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">SPACE to shoot!</text>

      {/* Lightning bolt (multiple zig-zags) */}
      <path d="M220,160 L280,135 L260,155 L330,130 L310,150 L380,125 L360,145 L440,120 L420,140 L490,118"
        fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M220,160 L280,135 L260,155 L330,130 L310,150 L380,125 L360,145 L440,120 L420,140 L490,118"
        fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <text x="355" y="108" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">⚡ LIGHTNING!</text>

      {/* Voldemort */}
      <ellipse cx="620" cy="158" rx="26" ry="28" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/>
      {/* No nose! */}
      <circle cx="610" cy="154" r="5" fill="#4b5563"/>
      <circle cx="630" cy="154" r="5" fill="#4b5563"/>
      <path d="M606,168 Q620,178 634,168" fill="none" stroke="#4b5563" strokeWidth="2"/>
      {/* Dark cloak */}
      <polygon points="594,186 646,186 660,270 580,270" fill="#111827"/>
      {/* Wand pointing left */}
      <line x1="594" y1="180" x2="540" y2="158" stroke="#92400e" strokeWidth="4"/>
      <text x="620" y="288" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#9ca3af">Voldemort</text>

      {/* Score box */}
      <rect x="300" y="44" width="160" height="50" rx="10" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      <text x="380" y="65" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">Score</text>
      <text x="380" y="84" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">7 ⭐</text>

      {/* Timer */}
      <rect x="580" y="44" width="120" height="50" rx="10" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
      <text x="640" y="65" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Timer</text>
      <text x="640" y="84" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">⏱ 18</text>
    </svg>
  )
}

function SvgCountdownTimer() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#fff7ed" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">30-Second Timer ⏱️</text>

      {/* Code block */}
      <rect x="20" y="44" width="300" height="184" rx="12" fill={BLOCK.control}/>
      <text x="170" y="68" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">repeat (30)</text>
      <rect x="50" y="80" width="240" height="32" rx="8" fill="#1d4ed8"/>
      <text x="170" y="100" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">wait (1) secs</text>
      <rect x="50" y="118" width="240" height="32" rx="8" fill="#ff8c1a"/>
      <text x="170" y="138" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">change Timer by (-1)</text>
      <rect x="20" y="214" width="300" height="14" rx="8" fill={BLOCK.control}/>

      <rect x="50" y="240" width="240" height="32" rx="8" fill="#ef4444"/>
      <text x="170" y="261" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">say [Time&apos;s Up! 💥] for 2 secs</text>
      <rect x="50" y="280" width="240" height="32" rx="8" fill="#ef4444"/>
      <text x="170" y="301" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">stop [all ▾]</text>

      {/* Timer display sequence */}
      {[['30', '#22c55e'],['20', '#86efac'],['10', '#fbbf24'],['5', '#f97316'],['0 💥', '#ef4444']].map(([num, col], i) => (
        <g key={i}>
          <rect x={350 + i * 80} y="80" width="72" height="80" rx="12" fill={col} stroke="white" strokeWidth="2"/>
          <text x={386 + i * 80} y="130" textAnchor="middle" fontSize="26" fontWeight="bold" fill="white">{num}</text>
        </g>
      ))}
      {[398,478,558,638].map((x,i) => (
        <text key={i} x={x} y="126" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
      ))}
      <text x="570" y="185" textAnchor="middle" fontSize="12" fill="#374151">Timer counts DOWN each second</text>
      <rect x="350" y="210" width="380" height="50" rx="12" fill="#1e293b"/>
      <text x="540" y="233" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">How many lightning bolts can you fire</text>
      <text x="540" y="251" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">in 30 seconds? Challenge a friend! 🏆</text>

      {/* Arrow between code and display */}
      <text x="330" y="130" textAnchor="middle" fontSize="26" fill="#64748b">→</text>
    </svg>
  )
}

// ── G1-2 · Week 5 ─────────────────────────────────────────────────────────────
function SvgForeverCatch() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f0f9ff" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">The Forever + If Combo ♾️</text>

      {/* Forever block (big C) */}
      <rect x="30" y="44" width="340" height="246" rx="12" fill="#ff6680"/>
      <text x="200" y="68" textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">forever  ♾️</text>
      <rect x="30" y="276" width="340" height="14" rx="8" fill="#ff6680"/>

      {/* Repeat-until block inside forever */}
      <rect x="60" y="80" width="280" height="100" rx="10" fill={BLOCK.control}/>
      <text x="200" y="100" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">repeat until  y position &lt; -150</text>
      {/* inner */}
      <rect x="90" y="112" width="220" height="26" rx="7" fill={BLOCK.motion}/>
      <text x="200" y="129" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change y by (-5)</text>
      <rect x="60" y="168" width="280" height="10" rx="6" fill={BLOCK.control}/>

      {/* if-touching block */}
      <rect x="60" y="188" width="280" height="80" rx="10" fill={BLOCK.sensing}/>
      <text x="200" y="208" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">if  &lt; touching [Rocketship ▾] ? &gt;  then</text>
      <rect x="90" y="218" width="220" height="24" rx="7" fill="#ff8c1a"/>
      <text x="200" y="234" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change Score by 1</text>
      <rect x="60" y="254" width="280" height="10" rx="6" fill={BLOCK.sensing}/>

      {/* Annotation arrows */}
      <text x="420" y="138" textAnchor="start" fontSize="12" fontWeight="bold" fill="#1d4ed8">① Asteroid falls</text>
      <text x="420" y="156" textAnchor="start" fontSize="11" fill="#374151">  change y by -5 every frame</text>
      <line x1="395" y1="130" x2="350" y2="122" stroke="#1d4ed8" strokeWidth="2"/>

      <text x="420" y="218" textAnchor="start" fontSize="12" fontWeight="bold" fill="#15803d">② Rocket catches it!</text>
      <text x="420" y="236" textAnchor="start" fontSize="11" fill="#374151">  Score goes up by 1</text>
      <line x1="395" y1="225" x2="350" y2="230" stroke="#15803d" strokeWidth="2"/>

      <rect x="390" y="260" width="350" height="54" rx="10" fill="#1e293b"/>
      <text x="565" y="282" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">③ Loop restarts → asteroid jumps</text>
      <text x="565" y="300" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">to a new random spot at the top!</text>
    </svg>
  )
}

function SvgSpaceCatch() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#0f172a" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">Space Catcher! 🚀</text>

      {/* Stars */}
      {[[60,55],[150,44],[290,60],[440,45],[580,55],[700,70],[80,120],[350,100],[620,115],[200,85],[730,100],[30,160]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?2:1.5} fill="white" opacity={0.5+0.3*(i%2)}/>
      ))}

      {/* Multiple asteroids falling at different positions */}
      <circle cx="200" cy="80" r="22" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <circle cx="193" cy="73" r="5" fill="#57534e"/>
      <circle cx="210" cy="82" r="4" fill="#a8a29e"/>
      {/* falling path */}
      <line x1="200" y1="102" x2="200" y2="175" stroke="#78716c" strokeWidth="2" strokeDasharray="8,6" opacity="0.5"/>
      <polygon points="193,175 207,175 200,188" fill="#78716c" opacity="0.6"/>

      <circle cx="480" cy="55" r="18" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <line x1="480" y1="73" x2="480" y2="150" stroke="#78716c" strokeWidth="2" strokeDasharray="8,6" opacity="0.5"/>
      <polygon points="473,150 487,150 480,163" fill="#78716c" opacity="0.6"/>

      <circle cx="680" cy="70" r="20" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <line x1="680" y1="90" x2="640" y2="180" stroke="#78716c" strokeWidth="2" strokeDasharray="8,6" opacity="0.5"/>
      <polygon points="633,177 647,183 640,192" fill="#78716c" opacity="0.6"/>

      {/* Catching animation — asteroid near rocket */}
      <circle cx="360" cy="185" r="22" fill="#f59e0b" stroke="#d97706" strokeWidth="3"/>
      <text x="360" y="165" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">CATCH! ✨</text>

      {/* Rocket at bottom center */}
      {/* body */}
      <rect x="330" y="220" width="60" height="55" rx="8" fill="#475569"/>
      {/* nose */}
      <polygon points="330,220 390,220 360,185" fill="#94a3b8"/>
      {/* fins */}
      <polygon points="330,265 315,285 330,275" fill="#334155"/>
      <polygon points="390,265 405,285 390,275" fill="#334155"/>
      {/* window */}
      <circle cx="360" cy="238" r="10" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2"/>
      {/* flame */}
      <ellipse cx="360" cy="278" rx="15" ry="22" fill="#f97316" opacity="0.8"/>
      <ellipse cx="360" cy="275" rx="8" ry="14" fill="#fbbf24" opacity="0.9"/>

      {/* Arrow keys */}
      <rect x="290" y="305" width="40" height="22" rx="6" fill="#374151"/>
      <text x="310" y="321" textAnchor="middle" fontSize="14" fill="white">←</text>
      <rect x="430" y="305" width="40" height="22" rx="6" fill="#374151"/>
      <text x="450" y="321" textAnchor="middle" fontSize="14" fill="white">→</text>
      <text x="380" y="320" textAnchor="middle" fontSize="10" fill="#94a3b8">move rocket</text>

      {/* Score */}
      <rect x="20" y="44" width="110" height="42" rx="10" fill="#fbbf24"/>
      <text x="75" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">Score</text>
      <text x="75" y="79" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1e293b">4 ⭐</text>
    </svg>
  )
}

// ── G1-2 Week 5 SVGs ──────────────────────────────────────────────────────────
function SvgSpaceShooterGameW5() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#0f0f2e" rx="14"/>
      {/* Stars */}
      {[{cx:80,cy:30},{cx:200,cy:55},{cx:460,cy:22},{cx:600,cy:48},{cx:700,cy:20},{cx:140,cy:80},{cx:340,cy:45},{cx:550,cy:75},{cx:680,cy:90},{cx:40,cy:110},{cx:720,cy:130}].map((s,i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={Math.random()<0.5?2:1.5} fill="white" opacity="0.7"/>
      ))}
      {/* Score */}
      <rect x="20" y="14" width="110" height="32" fill="#1e1e50" rx="8"/>
      <text x="75" y="35" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">Score: 3</text>
      {/* Title */}
      <text x="380" y="34" textAnchor="middle" fill="white" fontSize="19" fontWeight="bold">🚀 Space Shooter</text>
      {/* Asteroid */}
      <circle cx="280" cy="118" r="32" fill="#6b3a1e" stroke="#a0522d" strokeWidth="2"/>
      <text x="280" y="126" textAnchor="middle" fontSize="24">🪨</text>
      <text x="280" y="163" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold">↓ falling down</text>
      {/* Bullet trail */}
      <line x1="382" y1="65" x2="382" y2="148" stroke="#facc15" strokeWidth="2" strokeDasharray="5,4"/>
      <rect x="375" y="148" width="14" height="26" fill="#facc15" rx="6"/>
      <text x="410" y="110" fill="#facc15" fontSize="13" fontWeight="bold">↑ bullet</text>
      {/* Rocket */}
      <text x="382" y="296" textAnchor="middle" fontSize="38">🚀</text>
      {/* Controls */}
      <rect x="110" y="296" width="100" height="28" fill="#2563eb" rx="6"/>
      <text x="160" y="314" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">← → move</text>
      <rect x="560" y="296" width="100" height="28" fill="#7c3aed" rx="6"/>
      <text x="610" y="314" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">SPACE fire</text>
      {/* Side labels */}
      <text x="80" y="180" textAnchor="middle" fill="#94a3b8" fontSize="11">y = +170</text>
      <text x="80" y="195" textAnchor="middle" fill="#94a3b8" fontSize="11">(top edge)</text>
      <text x="80" y="270" textAnchor="middle" fill="#94a3b8" fontSize="11">y = -150</text>
      <text x="80" y="285" textAnchor="middle" fill="#94a3b8" fontSize="11">(bottom edge)</text>
    </svg>
  )
}

function SvgAllBlocksW5() {
  const cats = [
    { y: 65,  color: '#ffab19', label: 'EVENTS',  ex: 'when 🚩 clicked  ·  when [space] pressed' },
    { y: 120, color: '#4c97ff', label: 'MOTION',  ex: 'go to [Rocket]  ·  change x by 15  ·  change y by 15' },
    { y: 175, color: '#ff8c1a', label: 'CONTROL', ex: 'forever  ·  repeat until  ·  if-then' },
    { y: 230, color: '#9966ff', label: 'LOOKS',   ex: 'show  ·  hide' },
    { y: 285, color: '#5cb1d6', label: 'SENSING', ex: 'touching [Asteroid]?  →  change Score by 1' },
  ]
  return (
    <svg viewBox="0 0 760 345" className="w-full h-full">
      <rect width="760" height="345" fill="#f8fafc" rx="14"/>
      <text x="380" y="38" textAnchor="middle" fontSize="19" fontWeight="bold" fill="#1e293b">All 5 Block Categories — All used in Week 5! 🗂️</text>
      {cats.map(c => (
        <g key={c.label}>
          <rect x="40" y={c.y} width="680" height="44" fill={c.color} rx="10"/>
          <rect x="40" y={c.y} width="130" height="44" fill={c.color} rx="10"/>
          <text x="106" y={c.y+27} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">{c.label}</text>
          <text x="200" y={c.y+27} fill="white" fontSize="13">{c.ex}</text>
        </g>
      ))}
    </svg>
  )
}

function SvgBulletPatternW5() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f8fafc" rx="14"/>
      <text x="380" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">The Bullet Fire Pattern 🔫</text>
      {/* Column 1 — at start */}
      <text x="155" y="58" textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="bold">① When flag clicked:</text>
      <rect x="40" y="66" width="230" height="38" fill="#ffab19" rx="9"/>
      <text x="155" y="90" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">when 🚩 clicked</text>
      <rect x="40" y="110" width="230" height="38" fill="#9966ff" rx="9"/>
      <text x="155" y="134" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🟣 hide</text>
      <text x="155" y="168" textAnchor="middle" fontSize="12" fill="#64748b">(bullet invisible at start)</text>
      {/* Arrow */}
      <text x="357" y="145" textAnchor="middle" fill="#94a3b8" fontSize="32">→</text>
      {/* Column 2 — when space */}
      <text x="570" y="58" textAnchor="middle" fontSize="13" fill="#64748b" fontWeight="bold">② When SPACE pressed:</text>
      <rect x="420" y="66" width="300" height="38" fill="#ffab19" rx="9"/>
      <text x="570" y="90" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">when [space] pressed</text>
      <rect x="420" y="110" width="300" height="38" fill="#4c97ff" rx="9"/>
      <text x="570" y="134" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🔵 go to [Rocket]</text>
      <rect x="420" y="154" width="300" height="38" fill="#9966ff" rx="9"/>
      <text x="570" y="178" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🟣 show</text>
      <rect x="420" y="198" width="300" height="38" fill="#ff8c1a" rx="9"/>
      <text x="570" y="222" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🟠 repeat until y &gt; 170</text>
      <rect x="445" y="242" width="275" height="38" fill="#4c97ff" rx="9"/>
      <text x="582" y="266" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🔵   change y by 15</text>
      <rect x="420" y="286" width="300" height="38" fill="#9966ff" rx="9"/>
      <text x="570" y="310" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🟣 hide</text>
    </svg>
  )
}

function SvgTwoSpritesW5() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f0f9ff" rx="14"/>
      <text x="380" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">Two Sprites, Two Jobs ⬆️⬇️</text>
      {/* Y-axis */}
      <line x1="380" y1="50" x2="380" y2="305" stroke="#cbd5e1" strokeWidth="2"/>
      <polygon points="380,44 374,62 386,62" fill="#cbd5e1"/>
      <text x="380" y="40" textAnchor="middle" fill="#94a3b8" fontSize="11">+y = UP</text>
      <text x="380" y="320" textAnchor="middle" fill="#94a3b8" fontSize="11">-y = DOWN</text>
      <line x1="360" y1="175" x2="400" y2="175" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,4"/>
      <text x="395" y="172" fill="#94a3b8" fontSize="10">y = 0</text>
      {/* Asteroid panel */}
      <rect x="30" y="62" width="310" height="220" fill="#fff1f2" rx="12" stroke="#fca5a5" strokeWidth="2"/>
      <text x="185" y="88" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#991b1b">ASTEROID (Rocks sprite)</text>
      <text x="185" y="135" textAnchor="middle" fontSize="36">🪨</text>
      <rect x="65" y="152" width="240" height="36" fill="#ff8c1a" rx="8"/>
      <text x="185" y="174" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">forever → change y by -5</text>
      <text x="185" y="215" textAnchor="middle" fontSize="36" fill="#ef4444">↓</text>
      <text x="185" y="252" textAnchor="middle" fontSize="13" fill="#991b1b">Falls DOWN  (negative y)</text>
      {/* Bullet panel */}
      <rect x="420" y="62" width="310" height="220" fill="#eff6ff" rx="12" stroke="#93c5fd" strokeWidth="2"/>
      <text x="575" y="88" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1d4ed8">BULLET sprite</text>
      <text x="575" y="135" textAnchor="middle" fontSize="36">💛</text>
      <rect x="455" y="152" width="240" height="36" fill="#ff8c1a" rx="8"/>
      <text x="575" y="174" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">repeat until y&gt;170: +15</text>
      <text x="575" y="215" textAnchor="middle" fontSize="36" fill="#3b82f6">↑</text>
      <text x="575" y="252" textAnchor="middle" fontSize="13" fill="#1d4ed8">Shoots UP  (positive y)</text>
      <text x="380" y="335" textAnchor="middle" fontSize="12" fill="#475569">Each sprite runs its own code — click the right sprite in the sprite list!</text>
    </svg>
  )
}



// ── G3-4 · Week 1 ─────────────────────────────────────────────────────────────
function SvgArrowCodeStacks() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f8fafc" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">4 Arrow Keys = 4 Separate Code Stacks 🎮</text>

      {/* 4 stacks */}
      {[
        { x: 20,  key: '← Left',  dx: '-15', dir: '← move LEFT',  col: '#3b82f6' },
        { x: 205, key: '→ Right', dx:  '15', dir: '→ move RIGHT', col: '#22c55e' },
        { x: 390, key: '↑ Up',    dx:  '10', dir: '↑ move UP',    col: '#f59e0b', cy: true },
        { x: 575, key: '↓ Down',  dx: '-10', dir: '↓ move DOWN',  col: '#ef4444', cy: true },
      ].map(({ x, key, dx, dir, col, cy }) => (
        <g key={x}>
          <rect x={x} y="44" width="170" height="36" rx="8" fill={BLOCK.event}/>
          <text x={x+85} y="66" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">when [{key}] key pressed</text>
          <rect x={x} y="86" width="170" height="36" rx="8" fill={BLOCK.motion}/>
          <text x={x+85} y="108" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
            {cy ? `change y by ${dx}` : `change x by ${dx}`}
          </text>
          {/* Result box */}
          <rect x={x} y="138" width="170" height="32" rx="8" fill={col}/>
          <text x={x+85} y="158" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{dir}</text>

          {/* Mini car showing direction */}
          <rect x={x+40} y="190" width="90" height="50" rx="8" fill="#1e40af"/>
          <circle cx={x+55} cy={236} r="9" fill="#374151" stroke="#94a3b8" strokeWidth="2"/>
          <circle cx={x+115} cy={236} r="9" fill="#374151" stroke="#94a3b8" strokeWidth="2"/>
          <rect x={x+52} y="198" width="56" height="28" rx="5" fill="#3b82f6"/>
          <text x={x+85} y="218" textAnchor="middle" fontSize="18">{
            { '-15': '←', '15': '→', '10': '↑', '-10': '↓' }[dx]
          }</text>
        </g>
      ))}

      <rect x="20" y="290" width="720" height="32" rx="10" fill="#1e293b"/>
      <text x="380" y="311" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24">Each arrow key has its OWN separate code stack — they all run independently!</text>
    </svg>
  )
}

function SvgCarRoad() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f0fdf4" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">Paint Your World — the Backdrop Editor 🎨</text>

      {/* Painted stage result */}
      <rect x="20" y="44" width="440" height="240" rx="12" fill="#87ceeb" stroke="#3b82f6" strokeWidth="2"/>
      <text x="240" y="64" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">Your Painted Stage</text>
      {/* Road */}
      <rect x="20" y="140" width="440" height="80" fill="#6b7280"/>
      {/* Lane markings */}
      {[60,120,180,240,300,360,420].map((x,i)=>(
        <rect key={i} x={20+x} y="176" width="40" height="8" rx="2" fill="white" opacity="0.8"/>
      ))}
      {/* Car on road */}
      <rect x="170" y="148" width="70" height="40" rx="8" fill="#1d4ed8"/>
      <circle cx="185" cy="192" r="9" fill="#374151" stroke="#94a3b8" strokeWidth="2"/>
      <circle cx="225" cy="192" r="9" fill="#374151" stroke="#94a3b8" strokeWidth="2"/>
      <rect x="178" y="155" width="54" height="26" rx="4" fill="#60a5fa"/>
      {/* Obstacle */}
      <rect x="320" y="148" width="44" height="40" rx="6" fill="#ef4444"/>
      <text x="342" y="173" textAnchor="middle" fontSize="16">🪨</text>
      <text x="342" y="210" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">OBSTACLE!</text>

      {/* Grass / scenery */}
      <rect x="20" y="44" width="440" height="96" fill="#86efac"/>
      <rect x="20" y="220" width="440" height="64" rx="0" fill="#86efac"/>

      {/* Paint editor panel */}
      <rect x="476" y="44" width="264" height="240" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <rect x="476" y="44" width="264" height="36" rx="12" fill="#7c3aed"/>
      <rect x="476" y="68" width="264" height="12" fill="#7c3aed"/>
      <text x="608" y="66" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">🎨 Backdrop Paint Editor</text>

      {/* Tool icons */}
      <rect x="486" y="90" width="244" height="36" rx="8" fill="#f3f4f6"/>
      {['▭ Rect','/ Line','● Fill','🖌️ Brush'].map((t,i)=>(
        <g key={i}>
          <rect x={496 + i*60} y="95" width="54" height="26" rx="6" fill={i===0?'#7c3aed':'#e5e7eb'}/>
          <text x={523 + i*60} y="112" textAnchor="middle" fontSize="9" fontWeight="bold" fill={i===0?'white':'#374151'}>{t}</text>
        </g>
      ))}

      {/* Color swatch */}
      {['#6b7280','#86efac','#fbbf24','#3b82f6','#ef4444'].map((col,i)=>(
        <circle key={i} cx={496 + i*24} cy={148} r="9" fill={col} stroke="white" strokeWidth="2"/>
      ))}

      {/* Steps */}
      <text x="608" y="178" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">① Click backdrops icon</text>
      <text x="608" y="196" textAnchor="middle" fontSize="11" fill="#374151">② Click Paint (bottom)</text>
      <text x="608" y="214" textAnchor="middle" fontSize="11" fill="#374151">③ Rectangle → grey → draw road</text>
      <text x="608" y="232" textAnchor="middle" fontSize="11" fill="#374151">④ White lines → draw dashes</text>
      <text x="608" y="256" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">Your road is YOURS — get creative!</text>

      <rect x="20" y="292" width="720" height="30" rx="10" fill="#1e293b"/>
      <text x="380" y="312" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">Same Paint editor for sprites: click Paint near the sprite icon to draw your own obstacle!</text>
    </svg>
  )
}

// ── G3-4 · Week 2 ─────────────────────────────────────────────────────────────
function SvgParallelStacks() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f5f3ff" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">Parallel Code — Two Things at Once! 🚩</text>

      {/* Single flag at top center */}
      <rect x="338" y="44" width="84" height="32" rx="8" fill={BLOCK.event}/>
      <text x="380" y="65" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">when 🚩 clicked</text>

      {/* Arrows going left and right */}
      <line x1="340" y1="76" x2="220" y2="108" stroke="#374151" strokeWidth="3" strokeDasharray="8,4"/>
      <polygon points="216,101 228,116 222,103" fill="#374151"/>
      <line x1="420" y1="76" x2="540" y2="108" stroke="#374151" strokeWidth="3" strokeDasharray="8,4"/>
      <polygon points="544,101 532,116 538,103" fill="#374151"/>

      {/* LEFT: Car code */}
      <rect x="30" y="110" width="300" height="180" rx="12" fill="white" stroke="#3b82f6" strokeWidth="3"/>
      <rect x="30" y="110" width="300" height="36" rx="12" fill="#1d4ed8"/>
      <rect x="30" y="134" width="300" height="12" fill="#1d4ed8"/>
      <text x="180" y="132" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">🏎️ CAR Code</text>
      <rect x="50" y="160" width="260" height="26" rx="7" fill={BLOCK.event}/>
      <text x="180" y="177" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">when [→] key pressed</text>
      <rect x="70" y="192" width="220" height="22" rx="6" fill={BLOCK.motion}/>
      <text x="180" y="207" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change x by 15</text>
      <rect x="50" y="222" width="260" height="26" rx="7" fill={BLOCK.event}/>
      <text x="180" y="239" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">when [←] key pressed</text>
      <rect x="70" y="254" width="220" height="22" rx="6" fill={BLOCK.motion}/>
      <text x="180" y="269" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change x by -15</text>

      {/* AT THE SAME TIME */}
      <rect x="340" y="155" width="80" height="80" rx="10" fill="#1e293b"/>
      <text x="380" y="185" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">AT THE</text>
      <text x="380" y="200" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">SAME</text>
      <text x="380" y="215" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">TIME!</text>
      <text x="380" y="235" textAnchor="middle" fontSize="18">⚡</text>

      {/* RIGHT: Dancer code */}
      <rect x="430" y="110" width="300" height="180" rx="12" fill="white" stroke="#ec4899" strokeWidth="3"/>
      <rect x="430" y="110" width="300" height="36" rx="12" fill="#db2777"/>
      <rect x="430" y="134" width="300" height="12" fill="#db2777"/>
      <text x="580" y="132" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">💃 DANCER Code</text>
      {/* forever block */}
      <rect x="450" y="160" width="260" height="110" rx="8" fill="#ff6680"/>
      <text x="580" y="180" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">forever</text>
      <rect x="475" y="190" width="210" height="22" rx="6" fill={BLOCK.looks}/>
      <text x="580" y="205" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">next costume</text>
      <rect x="475" y="218" width="210" height="22" rx="6" fill="#1d4ed8"/>
      <text x="580" y="233" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">wait (0.2) secs</text>
      <rect x="450" y="248" width="260" height="12" rx="6" fill="#ff6680"/>

      <rect x="20" y="300" width="720" height="24" rx="8" fill="#1e293b"/>
      <text x="380" y="317" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">Same flag → two sprites → different jobs — this is PARALLEL CODE! 🎉</text>
    </svg>
  )
}

function SvgCostumeCycle() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#fdf4ff" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">Costumes + forever = Animation! 🎭</text>

      {/* 3 costume frames */}
      {[
        { x: 50,  label: 'Costume 1', pose: '🕺', bg: '#ede9fe' },
        { x: 290, label: 'Costume 2', pose: '💃', bg: '#fce7f3' },
        { x: 530, label: 'Costume 3', pose: '🕺', bg: '#ede9fe' },
      ].map(({ x, label, pose, bg }) => (
        <g key={x}>
          <rect x={x} y="44" width="180" height="160" rx="14" fill={bg} stroke="#a855f7" strokeWidth="3"/>
          <text x={x+90} y="66" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">{label}</text>
          <text x={x+90} y="140" textAnchor="middle" fontSize="64">{pose}</text>
        </g>
      ))}

      {/* Arrows between costumes */}
      {[238, 478].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="124" x2={x+42} y2="124" stroke="#7c3aed" strokeWidth="4"/>
          <polygon points={`${x+40},116 ${x+56},124 ${x+40},132`} fill="#7c3aed"/>
          <text x={x+21} y="110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">next!</text>
        </g>
      ))}

      {/* Circular arrow from 3 back to 1 */}
      <path d="M710,124 Q760,230 380,240 Q0,250 50,124" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="10,5"/>
      <polygon points="50,116 66,124 50,132" fill="#7c3aed"/>
      <text x="380" y="258" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">cycles back to Costume 1 → animation loop! ♾️</text>

      {/* Code block */}
      <rect x="140" y="272" width="480" height="48" rx="12" fill="#ff6680"/>
      <text x="380" y="292" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">forever</text>
      <rect x="170" y="300" width="420" height="16" rx="6" fill={BLOCK.looks}/>
      <text x="380" y="312" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">next costume   +   wait (0.2) secs   →   smoother animation!</text>
    </svg>
  )
}

// ── G3-4 · Week 3 ─────────────────────────────────────────────────────────────
function SvgThreeVariables() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#0f172a" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="white">Variables Track Your Entire Game 🎮</text>

      {/* HP variable */}
      <rect x="20" y="48" width="220" height="130" rx="12" fill="#1e1e2e" stroke="#ef4444" strokeWidth="3"/>
      <text x="130" y="72" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ef4444">HP 🩸</text>
      <text x="130" y="100" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">100</text>
      {/* HP bar */}
      <rect x="40" y="112" width="180" height="18" rx="6" fill="#374151"/>
      <rect x="40" y="112" width="180" height="18" rx="6" fill="#22c55e"/>
      <text x="130" y="148" textAnchor="middle" fontSize="11" fill="#94a3b8">starts at 100 → goes down</text>
      <text x="130" y="165" textAnchor="middle" fontSize="11" fill="#94a3b8">when hit by Pokémon</text>

      {/* Score variable */}
      <rect x="270" y="48" width="220" height="130" rx="12" fill="#1e1e2e" stroke="#fbbf24" strokeWidth="3"/>
      <text x="380" y="72" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24">Score ⭐</text>
      <text x="380" y="100" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">0</text>
      <text x="380" y="126" textAnchor="middle" fontSize="24" fill="#fbbf24">→ → → 5</text>
      <text x="380" y="150" textAnchor="middle" fontSize="11" fill="#94a3b8">goes UP each time</text>
      <text x="380" y="165" textAnchor="middle" fontSize="11" fill="#94a3b8">you land a Poké Ball</text>

      {/* Timer variable */}
      <rect x="520" y="48" width="220" height="130" rx="12" fill="#1e1e2e" stroke="#3b82f6" strokeWidth="3"/>
      <text x="630" y="72" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#3b82f6">Timer ⏱</text>
      <text x="630" y="100" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">30</text>
      <text x="630" y="126" textAnchor="middle" fontSize="24" fill="#3b82f6">→ → → 0</text>
      <text x="630" y="150" textAnchor="middle" fontSize="11" fill="#94a3b8">counts DOWN each second</text>
      <text x="630" y="165" textAnchor="middle" fontSize="11" fill="#94a3b8">battle ends at 0!</text>

      {/* Variable blocks */}
      <text x="380" y="202" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#94a3b8">VARIABLES tab → Make a Variable → name it → it appears on stage!</text>

      {/* Code snippets */}
      <rect x="20" y="218" width="220" height="52" rx="10" fill="#ff8c1a"/>
      <text x="130" y="238" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">set HP to (100)</text>
      <text x="130" y="256" textAnchor="middle" fontSize="10" fill="#fef3c7">→ when 🚩 clicked</text>
      <text x="130" y="268" textAnchor="middle" fontSize="10" fill="#fef3c7">   reset at start</text>

      <rect x="270" y="218" width="220" height="52" rx="10" fill="#ff8c1a"/>
      <text x="380" y="238" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change Score by (1)</text>
      <text x="380" y="256" textAnchor="middle" fontSize="10" fill="#fef3c7">→ inside if-touching block</text>
      <text x="380" y="268" textAnchor="middle" fontSize="10" fill="#fef3c7">   each catch = +1</text>

      <rect x="520" y="218" width="220" height="52" rx="10" fill="#ff8c1a"/>
      <text x="630" y="238" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">change Timer by (-1)</text>
      <text x="630" y="256" textAnchor="middle" fontSize="10" fill="#fef3c7">→ inside repeat 30</text>
      <text x="630" y="268" textAnchor="middle" fontSize="10" fill="#fef3c7">   + wait 1 secs</text>

      <rect x="20" y="282" width="720" height="34" rx="10" fill="#fbbf24"/>
      <text x="380" y="304" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#78350f">3 variables → HP tracker + score counter + countdown clock = full game system! 🏆</text>
    </svg>
  )
}

function SvgConditionalLogic() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#fef9c3" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">If-Then = Game Logic 🧠</text>

      {/* Big if-then block */}
      <rect x="30" y="48" width="400" height="200" rx="14" fill={BLOCK.sensing}/>
      <text x="230" y="76" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">if  &lt; touching [Pikachu ▾] ? &gt;  then</text>

      {/* inner blocks */}
      <rect x="70" y="90" width="320" height="34" rx="8" fill="#ff8c1a"/>
      <text x="230" y="111" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">change Score by (1)</text>
      <rect x="70" y="132" width="320" height="34" rx="8" fill="#ff8c1a"/>
      <text x="230" y="153" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">change HP by (-10)</text>
      <rect x="70" y="174" width="320" height="34" rx="8" fill={BLOCK.motion}/>
      <text x="230" y="195" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">go to x: random  y: random</text>

      <rect x="30" y="224" width="400" height="16" rx="8" fill={BLOCK.sensing}/>

      {/* What it means */}
      <rect x="450" y="48" width="290" height="190" rx="14" fill="white" stroke="#5cb1d6" strokeWidth="3"/>
      <text x="595" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0284c7">What this means:</text>
      <text x="595" y="96" textAnchor="middle" fontSize="12" fill="#374151">Every frame Scratch asks:</text>
      <text x="595" y="116" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">&quot;Is Pikachu touching me?&quot;</text>
      <rect x="460" y="128" width="270" height="30" rx="8" fill="#22c55e"/>
      <text x="595" y="148" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">YES → Score+1, HP-10, teleport</text>
      <rect x="460" y="164" width="270" height="30" rx="8" fill="#e2e8f0"/>
      <text x="595" y="179" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">NO  → do nothing, wait...</text>
      <text x="595" y="210" textAnchor="middle" fontSize="11" fill="#374151">Scratch checks this 30×</text>
      <text x="595" y="226" textAnchor="middle" fontSize="11" fill="#374151">per second inside forever!</text>

      <rect x="30" y="256" width="720" height="60" rx="12" fill="#1e293b"/>
      <text x="380" y="278" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">The if-then block IS the game!</text>
      <text x="380" y="298" textAnchor="middle" fontSize="12" fill="#e2e8f0">Without it, nothing reacts — your whole game is made of if-then blocks</text>
    </svg>
  )
}

// ── G3-4 · Week 4 ─────────────────────────────────────────────────────────────
function SvgDuelScene() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#0f172a" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="white">The Dueling Championship! ⚡</text>

      {/* Harry left */}
      <circle cx="150" cy="160" r="30" fill="#fde68a" stroke="#d97706" strokeWidth="2"/>
      <rect x="120" y="60" width="60" height="22" rx="4" fill="#1f2937"/>
      <line x1="150" y1="72" x2="150" y2="62" stroke="#1f2937" strokeWidth="3"/>
      <circle cx="138" cy="162" r="7" fill="none" stroke="#374151" strokeWidth="2"/>
      <circle cx="162" cy="162" r="7" fill="none" stroke="#374151" strokeWidth="2"/>
      <line x1="145" y1="162" x2="155" y2="162" stroke="#374151" strokeWidth="1.5"/>
      <polygon points="120,190 180,190 190,260 110,260" fill="#1d4ed8"/>
      <line x1="180" y1="185" x2="230" y2="165" stroke="#92400e" strokeWidth="5"/>
      <circle cx="232" cy="163" r="6" fill="#fbbf24"/>
      <text x="150" y="282" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#93c5fd">Harry</text>
      <text x="150" y="298" textAnchor="middle" fontSize="10" fill="#64748b">you control!</text>

      {/* Harry HP bar */}
      <text x="90" y="46" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">HP</text>
      <rect x="20" y="50" width="260" height="16" rx="6" fill="#374151"/>
      <rect x="20" y="50" width="195" height="16" rx="6" fill="#22c55e"/>
      <text x="150" y="63" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">75 / 100</text>

      {/* VS */}
      <rect x="342" y="140" width="76" height="44" rx="8" fill="#7c3aed"/>
      <text x="380" y="168" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white">VS</text>

      {/* Harry lightning bolt */}
      <path d="M238,163 L290,140 L275,158 L330,135 L315,153 L360,132"
        fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round"/>
      <path d="M238,163 L290,140 L275,158 L330,135 L315,153 L360,132"
        fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>

      {/* Voldemort dark curse going the other way */}
      <path d="M522,173 L470,150 L490,168 L430,145 L447,163 L400,142"
        fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" strokeDasharray="10,4"/>

      {/* Voldemort right */}
      <ellipse cx="610" cy="158" rx="30" ry="32" fill="#d1d5db" stroke="#6b7280" strokeWidth="2"/>
      <circle cx="598" cy="154" r="6" fill="#4b5563"/>
      <circle cx="622" cy="154" r="6" fill="#4b5563"/>
      <path d="M596,170 Q610,178 624,170" fill="none" stroke="#4b5563" strokeWidth="2"/>
      <polygon points="580,190 640,190 655,268 565,268" fill="#111827"/>
      <line x1="580" y1="184" x2="528" y2="162" stroke="#92400e" strokeWidth="5"/>
      <circle cx="526" cy="160" r="5" fill="#a855f7"/>
      <text x="610" y="288" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#9ca3af">Voldemort</text>
      <text x="610" y="304" textAnchor="middle" fontSize="10" fill="#64748b">AI — chases you!</text>

      {/* Voldemort HP bar */}
      <text x="670" y="46" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">HP</text>
      <rect x="480" y="50" width="260" height="16" rx="6" fill="#374151"/>
      <rect x="480" y="50" width="104" height="16" rx="6" fill="#ef4444"/>
      <text x="610" y="63" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">40 / 100</text>

      <rect x="20" y="310" width="720" height="16" rx="6" fill="#fbbf24"/>
      <text x="380" y="323" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">Voldemort uses &quot;point towards Harry&quot; + &quot;move&quot; → AI chases you automatically!</text>
    </svg>
  )
}

function SvgBroadcast() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#faf5ff" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">Broadcast = Sprites Talking to Each Other 📡</text>

      {/* 3 step boxes */}
      {[
        { x: 20,  title: '① Harry sends', block: 'broadcast [hit! ▾]', bg: BLOCK.event, desc: 'sends a message' },
        { x: 280, title: '② Message travels', block: '📡  ·  ·  ·  →', bg: '#7c3aed', desc: 'instantly, same frame' },
        { x: 540, title: '③ Voldemort reacts', block: 'when I receive [hit! ▾]', bg: BLOCK.event, desc: 'plays "Ouch!" anim' },
      ].map(({ x, title, block, bg, desc }) => (
        <g key={x}>
          <rect x={x} y="52" width="220" height="140" rx="12" fill="white" stroke="#a855f7" strokeWidth="3"/>
          <text x={x+110} y="76" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">{title}</text>
          <rect x={x+10} y="88" width="200" height="38" rx="8" fill={bg}/>
          <text x={x+110} y="112" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{block}</text>
          <text x={x+110} y="148" textAnchor="middle" fontSize="11" fill="#374151">{desc}</text>
        </g>
      ))}

      {/* React block for Voldemort */}
      <rect x="540" y="200" width="220" height="28" rx="8" fill="#9966ff"/>
      <text x="650" y="218" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">say [Ouch! ⚡] for 1 secs</text>

      {/* Chain arrows */}
      <text x="260" y="128" textAnchor="middle" fontSize="28" fill="#7c3aed">→</text>
      <text x="520" y="128" textAnchor="middle" fontSize="28" fill="#7c3aed">→</text>

      {/* Why use it */}
      <rect x="20" y="210" width="500" height="100" rx="12" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2"/>
      <text x="270" y="232" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7c3aed">Why use broadcast?</text>
      <text x="270" y="254" textAnchor="middle" fontSize="12" fill="#374151">✅ Different sprites can react to the SAME event</text>
      <text x="270" y="272" textAnchor="middle" fontSize="12" fill="#374151">✅ You don&apos;t need sensing — sprites call each other</text>
      <text x="270" y="292" textAnchor="middle" fontSize="12" fill="#374151">✅ Clean code — each reaction in its own block stack</text>

      <rect x="20" y="316" width="720" height="12" rx="4" fill="#7c3aed" opacity="0.5"/>
    </svg>
  )
}

// ── G3-4 · Week 5 ─────────────────────────────────────────────────────────────
function SvgCloningBullets() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#eff6ff" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1e293b">Cloning = One Sprite, Unlimited Copies! 🧬</text>

      {/* Original sprite */}
      <rect x="40" y="80" width="160" height="160" rx="12" fill="white" stroke="#3b82f6" strokeWidth="3"/>
      <text x="120" y="108" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3b82f6">ORIGINAL Bullet</text>
      <rect x="105" y="118" width="30" height="80" rx="6" fill="#94a3b8" stroke="#64748b" strokeWidth="2"/>
      <circle cx="120" cy="118" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      <text x="120" y="214" textAnchor="middle" fontSize="10" fill="#64748b">stays hidden</text>
      <text x="120" y="228" textAnchor="middle" fontSize="10" fill="#64748b">(show: hide)</text>

      {/* Clone code */}
      <rect x="40" y="252" width="160" height="60" rx="10" fill="#ff6680"/>
      <text x="120" y="274" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">when [space ▾] pressed</text>
      <rect x="60" y="282" width="120" height="24" rx="6" fill={BLOCK.control}/>
      <text x="120" y="298" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">create clone of [myself ▾]</text>

      {/* Arrow to clones */}
      <text x="240" y="172" textAnchor="middle" fontSize="20" fill="#374151">→</text>
      <rect x="222" y="180" width="80" height="20" rx="6" fill="#1e293b"/>
      <text x="262" y="194" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fbbf24">press SPACE 3×</text>

      {/* 3 clones flying up */}
      {[
        { x: 330, y: 200, delay: '0.3s' },
        { x: 440, y: 140, delay: '0.1s' },
        { x: 560, y: 80,  delay: '0s'   },
      ].map(({ x, y, delay }, i) => (
        <g key={i}>
          <rect x={x-15} y={y} width="30" height="80" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" opacity={0.9 - i*0.15}/>
          <circle cx={x} cy={y} r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
          {/* upward arrow */}
          <line x1={x} y1={y-8} x2={x} y2={y-38} stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,4"/>
          <polygon points={`${x-6},${y-36} ${x+6},${y-36} ${x},${y-50}`} fill="#3b82f6"/>
          <text x={x} y={y+100} textAnchor="middle" fontSize="9" fill="#1d4ed8">Clone {i+1}</text>
          <text x={x} y={y+112} textAnchor="middle" fontSize="8" fill="#94a3b8">independent!</text>
        </g>
      ))}

      {/* When-start-as-clone block */}
      <rect x="600" y="80" width="150" height="110" rx="10" fill={BLOCK.control}/>
      <text x="675" y="102" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">when I start</text>
      <text x="675" y="118" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">as a clone</text>
      <rect x="616" y="128" width="118" height="22" rx="6" fill={BLOCK.looks}/>
      <text x="675" y="143" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">show</text>
      <rect x="616" y="155" width="118" height="22" rx="6" fill={BLOCK.motion}/>
      <text x="675" y="170" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">change y by 20</text>

      <rect x="20" y="310" width="720" height="16" rx="6" fill="#1e293b"/>
      <text x="380" y="323" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Every clone runs its own &quot;when I start as a clone&quot; code independently — rapid fire! 🚀</text>
    </svg>
  )
}

function SvgSpaceShooterGame() {
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#0f172a" rx="14"/>
      <text x="380" y="28" textAnchor="middle" fontSize="17" fontWeight="bold" fill="white">Space Shooter! 🚀</text>
      {/* Stars */}
      {[[60,55],[150,44],[290,70],[440,45],[580,55],[700,70],[80,120],[350,100],[620,115],[200,85],[730,100],[30,160],[500,88]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?2:1.5} fill="white" opacity={0.4+0.3*(i%2)}/>
      ))}

      {/* Falling asteroid clones */}
      <circle cx="150" cy="75" r="22" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <circle cx="143" cy="68" r="6" fill="#57534e"/>
      <line x1="150" y1="97" x2="150" y2="170" stroke="#78716c" strokeWidth="2" strokeDasharray="8,6" opacity="0.5"/>

      <circle cx="400" cy="60" r="18" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <line x1="400" y1="78" x2="400" y2="150" stroke="#78716c" strokeWidth="2" strokeDasharray="8,6" opacity="0.5"/>

      <circle cx="640" cy="80" r="20" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <line x1="630" y1="100" x2="610" y2="170" stroke="#78716c" strokeWidth="2" strokeDasharray="8,6" opacity="0.5"/>

      {/* Bullet clones flying up */}
      {[260, 370, 510].map((x,i) => (
        <g key={i}>
          <rect x={x-5} y={100 + i*20} width="10" height="40" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1={x} y1={100 + i*20} x2={x} y2={70 + i*20} stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,4" opacity="0.7"/>
        </g>
      ))}

      {/* Collision explosion */}
      <circle cx="400" cy="140" r="28" fill="#fbbf24" opacity="0.3"/>
      <text x="400" y="145" textAnchor="middle" fontSize="32">💥</text>
      <text x="400" y="178" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Score +1!</text>

      {/* Rocket at bottom */}
      <polygon points="350,248 410,248 380,210" fill="#94a3b8"/>
      <rect x="350" y="248" width="60" height="48" rx="8" fill="#475569"/>
      <circle cx="380" cy="260" r="10" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2"/>
      <polygon points="350,280 336,300 350,292" fill="#334155"/>
      <polygon points="410,280 424,300 410,292" fill="#334155"/>
      <ellipse cx="380" cy="298" rx="14" ry="18" fill="#f97316" opacity="0.8"/>

      {/* Lives */}
      <rect x="20" y="50" width="120" height="38" rx="10" fill="#ef4444"/>
      <text x="80" y="67" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Lives</text>
      <text x="80" y="83" textAnchor="middle" fontSize="14" fill="white">♥ ♥ ♥</text>

      {/* Score */}
      <rect x="310" y="50" width="140" height="38" rx="10" fill="#22c55e"/>
      <text x="380" y="67" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Score</text>
      <text x="380" y="83" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">8</text>

      {/* Personal Best */}
      <rect x="620" y="50" width="120" height="38" rx="10" fill="#fbbf24"/>
      <text x="680" y="67" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">Personal Best</text>
      <text x="680" y="83" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">12 🏆</text>

      {/* Arrow keys */}
      <rect x="330" y="305" width="36" height="22" rx="6" fill="#374151"/>
      <text x="348" y="321" textAnchor="middle" fontSize="14" fill="white">←</text>
      <rect x="394" y="305" width="36" height="22" rx="6" fill="#374151"/>
      <text x="412" y="321" textAnchor="middle" fontSize="14" fill="white">→</text>
      <rect x="456" y="305" width="60" height="22" rx="6" fill="#374151"/>
      <text x="486" y="321" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">SPACE</text>
    </svg>
  )
}

// ── VISUALS map ──────────────────────────────────────────────────────────────
const VISUALS: Record<string, Record<number, () => JSX.Element>> = {
  'g1-2-1': { 0: SvgScratchUI,         1: SvgBlocksSnap },
  'g1-2-2': { 0: SvgRepeatVsForever,   1: SvgBounce },
  'g1-2-3': { 0: SvgTouchingConcept,   1: SvgPokemonCatch },
  'g1-2-4': { 0: SvgHarryFire,         1: SvgCountdownTimer },
  'g1-2-5': { 0: SvgSpaceShooterGameW5, 1: SvgAllBlocksW5, 2: SvgBulletPatternW5, 3: SvgTwoSpritesW5 },
  'g3-4-1': { 0: SvgArrowCodeStacks,   2: SvgCarRoad },
  'g3-4-2': { 0: SvgParallelStacks,    1: SvgCostumeCycle },
  'g3-4-3': { 0: SvgThreeVariables,    1: SvgConditionalLogic },
  'g3-4-4': { 0: SvgDuelScene,         1: SvgBroadcast },
  'g3-4-5': { 0: SvgCloningBullets,    1: SvgSpaceShooterGame },
}

// ── Main component ────────────────────────────────────────────────────────────
export function CodingTheoryViewer({ deck, codingDayId }: Props) {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)

  const total = deck.slides.length
  const current = deck.slides[slide]
  const isLast = slide === total - 1

  const Visual = VISUALS[`${deck.gradeBand}-${deck.weekNumber}`]?.[slide]
  const headerStyle = { backgroundColor: deck.color }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header
        className="text-white px-4 py-2.5 flex items-center gap-3"
        style={headerStyle}
      >
        <button onClick={() => router.push('/teacher')} className="text-white/70 text-xl leading-none">←</button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-base truncate">{deck.title}</p>
          <p className="text-white/70 text-xs truncate">{current.subtitle ?? ''}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => router.push(`/coding/day/${codingDayId}`)}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full transition-all"
          >
            💻 Coding
          </button>
        </div>
        {/* Dot nav */}
        <div className="flex gap-1.5 shrink-0">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => { setSlide(i); setNotesOpen(false) }}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                i === slide ? 'bg-white scale-125' : 'bg-white/40',
              )}
            />
          ))}
        </div>
        <span className="text-white/50 text-xs shrink-0">{slide + 1}/{total}</span>
      </header>

      {/* Slide */}
      <div className={cn(
        'flex-1 flex flex-col items-center p-4 overflow-y-auto gap-3',
        Visual != null ? 'bg-white' : 'bg-gray-50',
      )}>
        {/* SVG visual */}
        {Visual != null && (
          <div className="w-full max-w-4xl">
            <Visual />
          </div>
        )}

        {/* Title (shown when no visual) */}
        {Visual == null && (
          <div className="w-full max-w-2xl rounded-2xl p-5 border-2 border-gray-200">
            <p className="text-2xl font-black text-center leading-snug text-gray-800">{current.title}</p>
            {current.subtitle && (
              <p className="text-sm text-center text-gray-500 mt-1">{current.subtitle}</p>
            )}
          </div>
        )}

        {/* Body bullets */}
        <div className={cn('w-full space-y-2', Visual != null ? 'max-w-4xl' : 'max-w-2xl')}>
          {current.body.map((point, i) => (
            <div key={i} className="rounded-xl px-4 py-2.5 border border-gray-200 bg-gray-50">
              <span className="text-sm leading-snug text-gray-700">{point}</span>
            </div>
          ))}

          {/* Vocab */}
          {current.vocab && current.vocab.map((v, i) => (
            <div key={i} className="rounded-xl px-4 py-2.5 flex items-start gap-3 bg-indigo-50 border border-indigo-200">
              <span className="text-xs font-black uppercase tracking-widest mt-0.5 shrink-0 text-indigo-600">WORD</span>
              <div>
                <p className="font-black text-sm text-indigo-900">{v.term}</p>
                <p className="text-xs text-indigo-700">{v.def}</p>
              </div>
            </div>
          ))}

          {/* Try this */}
          {current.tryThis && (
            <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-2.5">
              <p className="text-yellow-800 text-sm font-semibold">🙋 Try this: {current.tryThis}</p>
            </div>
          )}

          {/* Challenge */}
          {current.challenge && (
            <div className="rounded-xl bg-amber-50 border-2 border-amber-400 px-4 py-2.5">
              <p className="text-amber-900 text-sm font-bold">🔬 {current.challenge}</p>
            </div>
          )}
        </div>
      </div>

      {/* Speaker notes */}
      <div className="bg-gray-800 border-t border-gray-700">
        <button
          onClick={() => setNotesOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
        >
          <span>📝 Speaker notes {notesOpen ? '▲' : '▼'}</span>
          <span className="text-gray-600 text-xs">tap to {notesOpen ? 'hide' : 'show'}</span>
        </button>

        {notesOpen && current.speakerNotes && (
          <div className="px-4 pb-3">
            <p className="text-gray-200 text-xs leading-snug">{current.speakerNotes}</p>
          </div>
        )}
        {notesOpen && !current.speakerNotes && (
          <div className="px-4 pb-3">
            <p className="text-gray-600 text-xs italic">No notes for this slide.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-gray-900 px-4 py-3 flex gap-3">
        <button
          onClick={() => { setSlide(s => Math.max(0, s - 1)); setNotesOpen(false) }}
          disabled={slide === 0}
          className="flex-1 min-h-[48px] rounded-xl border-2 border-gray-700 text-gray-300 font-bold disabled:opacity-20 active:scale-95 transition-all"
        >
          ← Back
        </button>
        {isLast ? (
          <button
            onClick={() => router.push(`/coding/day/${codingDayId}`)}
            className="min-h-[48px] px-8 rounded-xl text-white font-bold active:scale-95 transition-all shadow"
            style={{ flex: 2, backgroundColor: deck.color }}
          >
            💻 Start Coding!
          </button>
        ) : (
          <button
            onClick={() => { setSlide(s => s + 1); setNotesOpen(false) }}
            className="min-h-[48px] px-8 rounded-xl text-white font-bold active:scale-95 transition-all shadow"
            style={{ flex: 2, backgroundColor: deck.color }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

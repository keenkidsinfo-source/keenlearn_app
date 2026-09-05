'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { TheoryDeck } from '@/lib/theory-slides'
import { SLIDE_COLORS } from '@/lib/theory-slides'

interface Props { deck: TheoryDeck; buildDayId: string }

// ── Inline SVG diagrams ────────────────────────────────────────────────────────

// G1-2 slides — updated to match PPTX KeenKids_CableCar_Theory_G12_v4
function SvgWhatDidWeBuild() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#eff6ff" rx="16"/>
      <text x="380" y="34" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">What Did We Build? 🚡</text>

      {/* ZIP LINE scene: tall chair left, short chair right */}
      {/* Tall chair (high end) */}
      <rect x="42" y="80" width="18" height="120" rx="4" fill="#92400e"/>
      <rect x="30" y="200" width="42" height="14" rx="3" fill="#92400e"/>
      <rect x="32" y="214" width="8" height="40" rx="3" fill="#78350f"/>
      <rect x="62" y="214" width="8" height="40" rx="3" fill="#78350f"/>
      <rect x="30" y="72" width="42" height="12" rx="3" fill="#92400e"/>
      <text x="51" y="265" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400e">HIGH</text>

      {/* Short chair (low end) */}
      <rect x="700" y="130" width="30" height="10" rx="3" fill="#ec4899"/>
      <rect x="698" y="140" width="8" height="30" rx="2" fill="#db2777"/>
      <rect x="724" y="140" width="8" height="30" rx="2" fill="#db2777"/>
      <rect x="694" y="170" width="40" height="8" rx="2" fill="#ec4899"/>
      <text x="714" y="220" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#db2777">LOW</text>

      {/* String / zip line */}
      <line x1="51" y1="80" x2="714" y2="130" stroke="#374151" strokeWidth="3" strokeDasharray="8,4"/>

      {/* Straw on string */}
      <rect x="330" y="95" width="90" height="16" rx="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
      <text x="375" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#15803d">STRAW</text>

      {/* Strings from straw to cup */}
      <line x1="348" y1="111" x2="348" y2="150" stroke="#6b7280" strokeWidth="2"/>
      <line x1="402" y1="111" x2="402" y2="150" stroke="#6b7280" strokeWidth="2"/>

      {/* Cup */}
      <polygon points="338,150 412,150 400,198 350,198" fill="#d4956a" stroke="#92400e" strokeWidth="2"/>
      <line x1="338" y1="150" x2="412" y2="150" stroke="#92400e" strokeWidth="2"/>
      {/* rocks in cup */}
      <circle cx="360" cy="178" r="8" fill="#78716c" stroke="#57534e" strokeWidth="1.5"/>
      <circle cx="376" cy="182" r="7" fill="#57534e" stroke="#57534e" strokeWidth="1.5"/>
      <circle cx="391" cy="176" r="7" fill="#78716c" stroke="#57534e" strokeWidth="1.5"/>

      {/* 4 labeled callout cards */}
      <rect x="30" y="270" width="155" height="56" rx="10" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1.5"/>
      <text x="107" y="291" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">① STRING</text>
      <text x="107" y="308" textAnchor="middle" fontSize="11" fill="#bfdbfe">zip line between</text>
      <text x="107" y="322" textAnchor="middle" fontSize="11" fill="#bfdbfe">two chairs</text>

      <rect x="200" y="270" width="155" height="56" rx="10" fill="#16a34a" stroke="#15803d" strokeWidth="1.5"/>
      <text x="277" y="291" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">② STRAW</text>
      <text x="277" y="308" textAnchor="middle" fontSize="11" fill="#bbf7d0">slides along the</text>
      <text x="277" y="322" textAnchor="middle" fontSize="11" fill="#bbf7d0">string = PULLEY</text>

      <rect x="370" y="270" width="155" height="56" rx="10" fill="#d97706" stroke="#b45309" strokeWidth="1.5"/>
      <text x="447" y="291" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">③ CUP</text>
      <text x="447" y="308" textAnchor="middle" fontSize="11" fill="#fef3c7">paper cup hangs</text>
      <text x="447" y="322" textAnchor="middle" fontSize="11" fill="#fef3c7">below the straw</text>

      <rect x="540" y="270" width="185" height="56" rx="10" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1.5"/>
      <text x="632" y="291" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">④ ROCKS</text>
      <text x="632" y="308" textAnchor="middle" fontSize="11" fill="#e9d5ff">small rocks = cargo</text>
      <text x="632" y="322" textAnchor="middle" fontSize="11" fill="#e9d5ff">weight inside cup</text>
    </svg>
  )
}

function SvgPulleyRealWorld() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fff7ed" rx="16"/>
      <text x="380" y="32" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">What is a Pulley? 🔄</text>
      <text x="380" y="54" textAnchor="middle" fontSize="14" fill="#64748b">A wheel that helps things move along a rope or string</text>

      {/* 3 real world examples */}
      {/* Cable Car */}
      <rect x="20" y="70" width="220" height="185" rx="14" fill="white" stroke="#f97316" strokeWidth="3"/>
      <rect x="20" y="70" width="220" height="38" rx="14" fill="#f97316"/>
      <rect x="20" y="94" width="220" height="14" fill="#f97316"/>
      <text x="130" y="96" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">🚡 Cable Car</text>
      {/* mini cable car drawing */}
      <line x1="40" y1="140" x2="220" y2="175" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5,3"/>
      <rect x="108" y="132" width="44" height="12" rx="6" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
      <polygon points="113,144 151,144 146,168 118,168" fill="#d4956a" stroke="#92400e" strokeWidth="2"/>
      <line x1="113" y1="144" x2="151" y2="144" stroke="#92400e" strokeWidth="2"/>
      <text x="130" y="200" textAnchor="middle" fontSize="11" fill="#374151">Carries people up</text>
      <text x="130" y="215" textAnchor="middle" fontSize="11" fill="#374151">steep hills in SF</text>
      <text x="130" y="232" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#f97316">since 1873!</text>

      {/* Ski Gondola */}
      <rect x="270" y="70" width="220" height="185" rx="14" fill="white" stroke="#3b82f6" strokeWidth="3"/>
      <rect x="270" y="70" width="220" height="38" rx="14" fill="#3b82f6"/>
      <rect x="270" y="94" width="220" height="14" fill="#3b82f6"/>
      <text x="380" y="96" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">⛷️ Ski Gondola</text>
      {/* mini gondola */}
      <line x1="290" y1="130" x2="470" y2="165" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5,3"/>
      <rect x="355" y="122" width="50" height="12" rx="6" fill="#60a5fa" stroke="#2563eb" strokeWidth="2"/>
      <rect x="358" y="134" width="44" height="26" rx="4" fill="#93c5fd" stroke="#2563eb" strokeWidth="2"/>
      <text x="380" y="200" textAnchor="middle" fontSize="11" fill="#374151">Carries skiers up</text>
      <text x="380" y="215" textAnchor="middle" fontSize="11" fill="#374151">mountains worldwide</text>

      {/* Flagpole */}
      <rect x="520" y="70" width="220" height="185" rx="14" fill="white" stroke="#22c55e" strokeWidth="3"/>
      <rect x="520" y="70" width="220" height="38" rx="14" fill="#22c55e"/>
      <rect x="520" y="94" width="220" height="14" fill="#22c55e"/>
      <text x="630" y="96" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">🏳️ Flagpole</text>
      {/* mini flagpole */}
      <line x1="610" y1="115" x2="610" y2="240" stroke="#64748b" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="610" cy="120" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
      <path d="M610,120 Q610,105 605,105 Q605,115 610,115" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,2"/>
      <rect x="610" y="128" width="40" height="26" fill="#ef4444"/>
      <text x="630" y="200" textAnchor="middle" fontSize="11" fill="#374151">Pulley raises and</text>
      <text x="630" y="215" textAnchor="middle" fontSize="11" fill="#374151">lowers the flag</text>

      {/* Bottom callout */}
      <rect x="60" y="272" width="640" height="56" rx="12" fill="#1e293b"/>
      <text x="380" y="296" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">In our cable car:</text>
      <text x="380" y="317" textAnchor="middle" fontSize="14" fill="white">The STRAW is the pulley wheel · The STRING is the rope! 🌟</text>
    </svg>
  )
}

function SvgGravity() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f0fdf4" rx="16"/>
      <text x="380" y="34" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">Force #1: GRAVITY 🌍</text>
      <text x="380" y="56" textAnchor="middle" fontSize="14" fill="#15803d">Gravity pulls EVERYTHING downward — it is our cable car&apos;s engine!</text>

      {/* 4 falling objects */}
      {[100, 250, 430, 600].map((x, i) => {
        const items = [
          { icon: '🍎', label: 'Apple falls', sub: 'from tree' },
          { icon: '⚽', label: 'Ball drops', sub: 'to ground' },
          { icon: '🌧️', label: 'Rain falls', sub: 'downward' },
          { icon: '🚡', label: 'Cable car', sub: 'slides DOWN' },
        ]
        const it = items[i]
        return (
          <g key={i}>
            <text x={x} y={105} textAnchor="middle" fontSize="42">{it.icon}</text>
            <line x1={x} y1={115} x2={x} y2={198} stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4"/>
            <polygon points={`${x-9},196 ${x+9},196 ${x},213`} fill="#ef4444"/>
            <text x={x} y={232} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">{it.label}</text>
            <text x={x} y={248} textAnchor="middle" fontSize="12" fill="#64748b">{it.sub}</text>
          </g>
        )
      })}

      {/* Earth at bottom */}
      <ellipse cx="380" cy="278" rx="340" ry="22" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
      <text x="380" y="285" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">🌍  EARTH — gravity always pulls toward here</text>

      {/* Key insight */}
      <rect x="100" y="305" width="560" height="30" rx="10" fill="#1e293b"/>
      <text x="380" y="325" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24">More rocks = MORE gravity pulling the cup down the string!</text>
    </svg>
  )
}

function SvgFriction() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fef2f2" rx="16"/>
      <text x="380" y="32" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">Force #2: FRICTION 🛑</text>
      <text x="380" y="54" textAnchor="middle" fontSize="13" fill="#64748b">Friction slows things down when two surfaces rub together</text>

      {/* 3 friction examples */}
      {/* Socks on carpet — SLOW */}
      <rect x="18" y="68" width="220" height="192" rx="14" fill="white" stroke="#ef4444" strokeWidth="2.5"/>
      <text x="128" y="96" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">🧦 Socks on Carpet</text>
      {/* carpet lines */}
      <rect x="38" y="175" width="180" height="18" rx="4" fill="#d1d5db"/>
      {[45,60,75,90,105,120,135,150,155,165,175,185,195,200,205].map((x,i) => (
        <line key={i} x1={x} y1={175} x2={x} y2={193} stroke="#9ca3af" strokeWidth="1.5"/>
      ))}
      {/* foot / sock */}
      <ellipse cx="128" cy="168" rx="28" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      {/* SLOW badge */}
      <rect x="68" y="210" width="120" height="32" rx="10" fill="#ef4444"/>
      <text x="128" y="231" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">= SLOW</text>
      <text x="128" y="248" textAnchor="middle" fontSize="11" fill="#64748b">lots of friction!</text>

      {/* Ice skates — FAST */}
      <rect x="270" y="68" width="220" height="192" rx="14" fill="white" stroke="#22c55e" strokeWidth="2.5"/>
      <text x="380" y="96" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">⛸️ Ice Skates on Ice</text>
      {/* ice surface */}
      <rect x="290" y="172" width="180" height="16" rx="4" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.5"/>
      {/* skate blade */}
      <ellipse cx="380" cy="172" rx="35" ry="6" fill="#94a3b8" stroke="#64748b" strokeWidth="2"/>
      <rect x="370" y="148" width="20" height="24" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* speed lines */}
      <line x1="310" y1="162" x2="283" y2="158" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
      <line x1="312" y1="172" x2="284" y2="170" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      {/* FAST badge */}
      <rect x="320" y="210" width="120" height="32" rx="10" fill="#22c55e"/>
      <text x="380" y="231" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">= FAST</text>
      <text x="380" y="248" textAnchor="middle" fontSize="11" fill="#64748b">less friction!</text>

      {/* Straw on string — our cable car */}
      <rect x="522" y="68" width="220" height="192" rx="14" fill="#fff7ed" stroke="#f97316" strokeWidth="3"/>
      <rect x="522" y="68" width="220" height="30" rx="14" fill="#f97316"/>
      <rect x="522" y="84" width="220" height="14" fill="#f97316"/>
      <text x="632" y="90" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">🚡 Straw on String</text>
      {/* zip line + straw stopped */}
      <line x1="542" y1="130" x2="722" y2="170" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6,3"/>
      <rect x="588" y="122" width="60" height="14" rx="7" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"/>
      {/* stop icon */}
      <text x="618" y="115" textAnchor="middle" fontSize="20">🛑</text>
      {/* cup */}
      <polygon points="600,136 636,136 630,158 606,158" fill="#d4956a" stroke="#92400e" strokeWidth="1.5"/>
      <line x1="600" y1="136" x2="636" y2="136" stroke="#92400e" strokeWidth="1.5"/>
      <text x="632" y="195" textAnchor="middle" fontSize="11" fill="#374151">Straw rubs on string</text>
      <text x="632" y="210" textAnchor="middle" fontSize="11" fill="#374151">= friction slows cup!</text>
      {/* SLOW badge */}
      <rect x="572" y="222" width="120" height="28" rx="9" fill="#f97316"/>
      <text x="632" y="241" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">= SLOW or STOP</text>

      {/* Bottom summary */}
      <rect x="40" y="277" width="680" height="52" rx="12" fill="#1e293b"/>
      <text x="380" y="298" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">In our cable car: if FRICTION beats GRAVITY → cup stops before the end!</text>
      <text x="380" y="320" textAnchor="middle" fontSize="13" fill="#e2e8f0">We need enough rocks so gravity wins!</text>
    </svg>
  )
}

function SvgBigDiscovery() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#faf5ff" rx="16"/>
      <text x="380" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">Our Big Discovery! 🏆</text>

      {/* 3 states side by side */}
      {/* State 1: Empty cup — friction wins */}
      <rect x="18" y="48" width="218" height="218" rx="14" fill="white" stroke="#ef4444" strokeWidth="3"/>
      <rect x="18" y="48" width="218" height="36" rx="14" fill="#ef4444"/>
      <rect x="18" y="70" width="218" height="14" fill="#ef4444"/>
      <text x="127" y="73" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">😢 Empty Cup</text>
      <text x="127" y="94" textAnchor="middle" fontSize="11" fill="#374151">No rocks</text>
      {/* mini zip line, straw stopped at start */}
      <line x1="30" y1="130" x2="225" y2="168" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5,3"/>
      <rect x="40" y="122" width="48" height="12" rx="6" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"/>
      <text x="64" y="118" textAnchor="middle" fontSize="16">🛑</text>
      <polygon points="46,134 82,134 78,154 50,154" fill="#d4956a" stroke="#92400e" strokeWidth="1.5"/>
      <line x1="46" y1="134" x2="82" y2="134" stroke="#92400e" strokeWidth="1.5"/>
      {/* GRAVITY WEAK */}
      <rect x="28" y="175" width="200" height="22" rx="6" fill="#fee2e2"/>
      <text x="128" y="190" textAnchor="middle" fontSize="11" fill="#dc2626">GRAVITY = weak</text>
      <rect x="28" y="200" width="200" height="22" rx="6" fill="#dcfce7"/>
      <text x="128" y="215" textAnchor="middle" fontSize="11" fill="#15803d">FRICTION = wins! 🏆</text>
      <rect x="38" y="232" width="178" height="26" rx="8" fill="#ef4444"/>
      <text x="127" y="249" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">STOPS in middle</text>

      {/* State 2: Few rocks — tied */}
      <rect x="271" y="48" width="218" height="218" rx="14" fill="white" stroke="#f59e0b" strokeWidth="3"/>
      <rect x="271" y="48" width="218" height="36" rx="14" fill="#f59e0b"/>
      <rect x="271" y="70" width="218" height="14" fill="#f59e0b"/>
      <text x="380" y="73" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">😐 Few Rocks</text>
      <text x="380" y="94" textAnchor="middle" fontSize="11" fill="#374151">1–2 rocks</text>
      {/* straw halfway */}
      <line x1="283" y1="130" x2="478" y2="168" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5,3"/>
      <rect x="365" y="143" width="48" height="12" rx="6" fill="#fde68a" stroke="#d97706" strokeWidth="2"/>
      <polygon points="372,155 408,155 404,175 376,175" fill="#d4956a" stroke="#92400e" strokeWidth="1.5"/>
      <line x1="372" y1="155" x2="408" y2="155" stroke="#92400e" strokeWidth="1.5"/>
      <circle cx="384" cy="168" r="5" fill="#78716c" stroke="#57534e" strokeWidth="1"/>
      {/* TIED */}
      <rect x="281" y="175" width="200" height="22" rx="6" fill="#fef3c7"/>
      <text x="381" y="190" textAnchor="middle" fontSize="11" fill="#92400e">GRAVITY = medium</text>
      <rect x="281" y="200" width="200" height="22" rx="6" fill="#fef3c7"/>
      <text x="381" y="215" textAnchor="middle" fontSize="11" fill="#92400e">FRICTION = tied!</text>
      <rect x="291" y="232" width="178" height="26" rx="8" fill="#f59e0b"/>
      <text x="380" y="249" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">MIGHT stop halfway</text>

      {/* State 3: Enough rocks — gravity wins! */}
      <rect x="524" y="48" width="218" height="218" rx="14" fill="#f0fdf4" stroke="#16a34a" strokeWidth="4"/>
      <rect x="524" y="48" width="218" height="36" rx="14" fill="#16a34a"/>
      <rect x="524" y="70" width="218" height="14" fill="#16a34a"/>
      <text x="633" y="73" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">🎉 Enough Rocks!</text>
      <text x="633" y="94" textAnchor="middle" fontSize="11" fill="#374151">minimum threshold</text>
      {/* straw at low end */}
      <line x1="536" y1="130" x2="731" y2="168" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5,3"/>
      <rect x="682" y="160" width="48" height="12" rx="6" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
      <polygon points="688,172 724,172 720,192 692,192" fill="#d4956a" stroke="#92400e" strokeWidth="1.5"/>
      <line x1="688" y1="172" x2="724" y2="172" stroke="#92400e" strokeWidth="1.5"/>
      <circle cx="700" cy="183" r="5" fill="#78716c" stroke="#57534e" strokeWidth="1"/>
      <circle cx="712" cy="185" r="4" fill="#57534e" stroke="#57534e" strokeWidth="1"/>
      <circle cx="706" cy="177" r="4" fill="#6b7280" stroke="#57534e" strokeWidth="1"/>
      {/* speed lines */}
      <line x1="626" y1="155" x2="596" y2="151" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
      <line x1="628" y1="163" x2="597" y2="161" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      <text x="633" y="190" textAnchor="middle" fontSize="11" fill="#15803d">GRAVITY = strong!</text>
      <rect x="534" y="175" width="200" height="22" rx="6" fill="#dcfce7"/>
      <text x="634" y="190" textAnchor="middle" fontSize="11" fill="#15803d">GRAVITY = strong! 💪</text>
      <rect x="534" y="200" width="200" height="22" rx="6" fill="#fee2e2"/>
      <text x="634" y="215" textAnchor="middle" fontSize="11" fill="#dc2626">FRICTION = loses!</text>
      <rect x="544" y="232" width="178" height="26" rx="8" fill="#16a34a"/>
      <text x="633" y="249" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">SLIDES ALL THE WAY! 🚀</text>

      {/* Bottom callout */}
      <rect x="30" y="282" width="700" height="48" rx="12" fill="#1e293b"/>
      <text x="380" y="303" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">💡 Once gravity beats friction, MORE rocks = even FASTER!</text>
      <text x="380" y="322" textAnchor="middle" fontSize="12" fill="#e2e8f0">The cup NEVER stops once you have enough weight on a taut zip line.</text>
    </svg>
  )
}

// G3-4 slides
function SvgSimpleMachinesG34() {
  const machines = [
    { name: 'Lever', x: 60, y: 60 },
    { name: 'Wheel & Axle', x: 220, y: 60 },
    { name: 'Pulley', x: 380, y: 60 },
    { name: 'Inclined Plane', x: 540, y: 60 },
    { name: 'Wedge', x: 140, y: 190 },
    { name: 'Screw', x: 460, y: 190 },
  ]
  return (
    <svg viewBox="0 0 760 330" className="w-full h-full">
      <rect width="760" height="330" fill="#f5f3ff" rx="16"/>
      <text x="380" y="32" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">6 Simple Machines</text>

      {/* WHEEL & AXLE — highlighted */}
      <rect x="170" y="48" width="160" height="115" rx="12" fill="#ede9fe" stroke="#7c3aed" strokeWidth="4"/>
      <rect x="170" y="48" width="160" height="26" rx="12" fill="#7c3aed"/>
      <text x="250" y="66" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">⭐ WHEEL &amp; AXLE</text>
      <text x="250" y="84" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">← Today!</text>
      <circle cx="250" cy="124" r="32" fill="none" stroke="#7c3aed" strokeWidth="5"/>
      <circle cx="250" cy="124" r="10" fill="#c4b5fd"/>
      <line x1="220" y1="124" x2="280" y2="124" stroke="#4c1d95" strokeWidth="4"/>
      <line x1="250" y1="92" x2="250" y2="156" stroke="#4c1d95" strokeWidth="4"/>

      {/* Lever */}
      <rect x="10" y="48" width="145" height="115" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="82" y="68" textAnchor="middle" fontSize="12" fill="#64748b">Lever</text>
      <line x1="20" y1="130" x2="140" y2="130" stroke="#64748b" strokeWidth="4" strokeLinecap="round"/>
      <polygon points="80,90 70,130 90,130" fill="#94a3b8"/>
      <rect x="18" y="108" width="20" height="20" rx="3" fill="#3b82f6"/>

      {/* Pulley */}
      <rect x="345" y="48" width="145" height="115" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="417" y="68" textAnchor="middle" fontSize="12" fill="#64748b">Pulley</text>
      <circle cx="417" cy="110" r="26" fill="none" stroke="#94a3b8" strokeWidth="4"/>
      <circle cx="417" cy="110" r="8" fill="#e2e8f0"/>
      <line x1="391" y1="110" x2="375" y2="152" stroke="#3b82f6" strokeWidth="3"/>
      <line x1="443" y1="110" x2="459" y2="152" stroke="#3b82f6" strokeWidth="3"/>
      <rect x="451" y="148" width="14" height="14" rx="2" fill="#3b82f6"/>

      {/* Inclined Plane */}
      <rect x="505" y="48" width="145" height="115" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="577" y="68" textAnchor="middle" fontSize="12" fill="#64748b">Inclined Plane</text>
      <polygon points="520,150 640,150 640,90" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>
      <rect x="630" y="82" width="16" height="16" rx="3" fill="#22c55e"/>

      {/* Wedge */}
      <rect x="60" y="178" width="180" height="115" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="150" y="198" textAnchor="middle" fontSize="12" fill="#64748b">Wedge</text>
      <polygon points="150,218 100,268 200,268" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>

      {/* Screw */}
      <rect x="410" y="178" width="180" height="115" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="500" y="198" textAnchor="middle" fontSize="12" fill="#64748b">Screw</text>
      <ellipse cx="500" cy="240" rx="18" ry="30" fill="none" stroke="#94a3b8" strokeWidth="3"/>
      <line x1="500" y1="210" x2="500" y2="270" stroke="#64748b" strokeWidth="4"/>
      {[220,232,244,256,268].map((y,i) => (
        <path key={i} d={`M${482},${y} Q${500},${y-6} ${518},${y}`} fill="none" stroke="#94a3b8" strokeWidth="2"/>
      ))}
    </svg>
  )
}

function SvgWheelAxle() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f5f3ff" rx="16"/>
      {/* Small force on big wheel */}
      <text x="175" y="36" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#7c3aed">SMALL FORCE on big wheel</text>
      {/* Big wheel */}
      <circle cx="175" cy="170" r="100" fill="#ede9fe" stroke="#7c3aed" strokeWidth="6"/>
      <circle cx="175" cy="170" r="20" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="4"/>
      {/* spokes */}
      {[0,60,120,180,240,300].map(deg => {
        const rad = deg * Math.PI / 180
        return <line key={deg} x1={175 + 20*Math.cos(rad)} y1={170 + 20*Math.sin(rad)} x2={175 + 98*Math.cos(rad)} y2={170 + 98*Math.sin(rad)} stroke="#7c3aed" strokeWidth="3"/>
      })}
      {/* crank handle */}
      <line x1="175" y1="70" x2="220" y2="55" stroke="#4c1d95" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="220" cy="55" r="10" fill="#7c3aed"/>
      {/* force arrow */}
      <path d="M240,30 Q260,20 255,55" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arr2)"/>
      <defs><marker id="arr2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444"/></marker></defs>
      <text x="270" y="38" fontSize="13" fontWeight="bold" fill="#ef4444">SMALL</text>
      <text x="270" y="54" fontSize="13" fontWeight="bold" fill="#ef4444">FORCE</text>

      {/* AXLE */}
      <rect x="270" y="155" width="200" height="30" rx="8" fill="#94a3b8" stroke="#64748b" strokeWidth="3"/>
      <text x="370" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">AXLE</text>

      {/* Big force on small axle */}
      <text x="590" y="36" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#22c55e">BIG FORCE on small axle</text>
      {/* Small axle circle */}
      <circle cx="590" cy="170" r="30" fill="#dcfce7" stroke="#22c55e" strokeWidth="5"/>
      <circle cx="590" cy="170" r="8" fill="#86efac"/>
      {/* string wound */}
      <path d="M590,140 Q620,140 620,170 Q620,200 590,200 Q560,200 560,185" fill="none" stroke="#3b82f6" strokeWidth="4"/>
      {/* bucket hanging */}
      <line x1="560" y1="185" x2="560" y2="240" stroke="#3b82f6" strokeWidth="3"/>
      <path d="M545,240 Q545,280 552,285 L568,285 Q575,280 575,240 Z" fill="#d4956a" stroke="#92400e" strokeWidth="3"/>
      <line x1="545" y1="240" x2="575" y2="240" stroke="#92400e" strokeWidth="3"/>
      {/* force arrow down on bucket */}
      <path d="M590,244 L590,284" stroke="#22c55e" strokeWidth="5" markerEnd="url(#arr3)"/>
      <defs><marker id="arr3" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22c55e"/></marker></defs>
      <text x="600" y="262" fontSize="13" fontWeight="bold" fill="#22c55e">BIG</text>
      <text x="600" y="278" fontSize="13" fontWeight="bold" fill="#22c55e">FORCE</text>

      {/* summary */}
      <rect x="100" y="296" width="560" height="34" rx="10" fill="#1e293b"/>
      <text x="380" y="318" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">Big wheel (crank) → small axle (skewer) → FORCE MULTIPLIED!</text>
    </svg>
  )
}

function SvgCrankWell() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f0fdf4" rx="16"/>
      {/* Well cylinder body */}
      <ellipse cx="380" cy="265" rx="120" ry="25" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>
      <rect x="260" y="95" width="240" height="170" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3"/>
      <ellipse cx="380" cy="95" rx="120" ry="25" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>

      {/* Left upright */}
      <rect x="270" y="38" width="18" height="70" rx="4" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      {/* Right upright */}
      <rect x="472" y="38" width="18" height="70" rx="4" fill="#78716c" stroke="#57534e" strokeWidth="2"/>

      {/* SKEWER = AXLE */}
      <rect x="265" y="64" width="230" height="12" rx="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      <text x="380" y="58" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400e">SKEWER = AXLE</text>

      {/* String wound on skewer */}
      <path d="M370,70 Q380,60 390,70 Q400,80 380,80 Q360,80 370,70" fill="none" stroke="#3b82f6" strokeWidth="3"/>

      {/* String going down */}
      <line x1="380" y1="78" x2="380" y2="200" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,4"/>

      {/* CRANK on right — cardstock strip */}
      <line x1="490" y1="70" x2="550" y2="70" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round"/>
      <line x1="550" y1="70" x2="550" y2="30" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="550" cy="30" r="12" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="3"/>
      {/* Label: cardstock strip */}
      <rect x="558" y="18" width="190" height="44" rx="8" fill="#7c3aed"/>
      <text x="653" y="36" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">CARDSTOCK STRIP</text>
      <text x="653" y="52" textAnchor="middle" fontSize="11" fill="#ddd6fe">= your CRANK handle</text>

      {/* Bucket */}
      <path d="M360,200 Q360,235 368,240 L392,240 Q400,235 400,200 Z" fill="#d4956a" stroke="#92400e" strokeWidth="3"/>
      <line x1="360" y1="200" x2="400" y2="200" stroke="#92400e" strokeWidth="3"/>
      <rect x="155" y="206" width="100" height="26" rx="8" fill="#3b82f6"/>
      <text x="205" y="222" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">BUCKET rises!</text>
      <line x1="255" y1="219" x2="360" y2="219" stroke="#3b82f6" strokeWidth="2"/>

      {/* Rotation arrow */}
      <path d="M495,48 Q510,20 525,38" fill="none" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrO)"/>
      <defs><marker id="arrO" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f97316"/></marker></defs>
      <text x="494" y="18" fontSize="12" fontWeight="bold" fill="#f97316">TURN crank</text>

      {/* Summary */}
      <rect x="70" y="290" width="620" height="36" rx="10" fill="#1e293b"/>
      <text x="380" y="312" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">Turn crank → axle winds string → string lifts bucket 🪣</text>
    </svg>
  )
}

function SvgMechanicalAdvantage() {
  // Helper: mini well + crank
  const Well = ({ x, cranks, crankLen, label, labelColor, bgColor, borderColor, pennies }: {
    x: number; cranks: number; crankLen: number; label: string; labelColor: string; bgColor: string; borderColor: string; pennies: number
  }) => (
    <g>
      {/* Card */}
      <rect x={x} y={50} width={210} height={270} rx="14" fill={bgColor} stroke={borderColor} strokeWidth="3"/>
      {/* Header */}
      <rect x={x} y={50} width={210} height={36} rx="14" fill={borderColor}/>
      <rect x={x} y={72} width={210} height={14} fill={borderColor}/>
      <text x={x+105} y={73} textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">{label}</text>

      {/* Well barrel */}
      <rect x={x+75} y={110} width={60} height={55} rx="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
      {/* Uprights */}
      <rect x={x+70} y={98} width={7} height={22} rx="3" fill="#92400e"/>
      <rect x={x+133} y={98} width={7} height={22} rx="3" fill="#92400e"/>
      {/* Axle */}
      <rect x={x+60} y={108} width={90} height={7} rx="3" fill="#c49a4a"/>
      {/* Crank arm */}
      <line x1={x+105} y1={108} x2={x+105+crankLen} y2={108-crankLen} stroke="#7c3aed" strokeWidth="5" strokeLinecap="round"/>
      <circle cx={x+105+crankLen} cy={108-crankLen} r="7" fill="#8b5cf6"/>
      {/* String + bucket */}
      <line x1={x+105} y1={115} x2={x+105} y2={155} stroke="#64748b" strokeWidth="2" strokeDasharray="3,3"/>
      <rect x={x+85} y={155} width={40} height={24} rx="5" fill="#fed7aa" stroke="#92400e" strokeWidth="2"/>
      {/* Pennies on bucket */}
      {Array.from({length: pennies}).map((_,i) => (
        <circle key={i} cx={x+95+i*10} cy={152} r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      ))}

      {/* Crank count badge */}
      <rect x={x+30} y={192} width={150} height={44} rx="10" fill={borderColor}/>
      <text x={x+105} y={210} textAnchor="middle" fontSize="11" fill="white">CRANKS NEEDED</text>
      <text x={x+105} y={230} textAnchor="middle" fontSize="22" fontWeight="black" fill="white">{cranks}</text>

      {/* Result label */}
      <text x={x+105} y={265} textAnchor="middle" fontSize="12" fontWeight="bold" fill={labelColor}>
        {cranks <= 6 ? '✅ Great!' : cranks <= 10 ? '🙂 OK' : '😓 Hmm...'}
      </text>
      <text x={x+105} y={283} textAnchor="middle" fontSize="11" fill="#64748b">
        {pennies === 0 ? 'empty bucket' : pennies === 3 ? '3 pennies' : 'longer crank!'}
      </text>
      <text x={x+105} y={300} textAnchor="middle" fontSize="11" fill="#94a3b8">(example only)</text>
    </g>
  )

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fdf4ff" rx="16"/>
      <text x="380" y="32" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">Count Your Cranks — This Is Your Experiment!</text>

      <Well x={20}  cranks={10} crankLen={14} label="① Empty Bucket"    labelColor="#92400e" bgColor="#fffbeb" borderColor="#f59e0b" pennies={0}/>
      <Well x={275} cranks={16} crankLen={14} label="② Add 3 Pennies"   labelColor="#dc2626" bgColor="#fff1f2" borderColor="#ef4444" pennies={3}/>
      <Well x={530} cranks={6}  crankLen={30} label="③ Longer Crank!"   labelColor="#15803d" bgColor="#f0fdf4" borderColor="#22c55e" pennies={3}/>

      {/* Arrows */}
      <text x={248} y={190} textAnchor="middle" fontSize="22" fill="#94a3b8">→</text>
      <text x={503} y={190} textAnchor="middle" fontSize="22" fill="#94a3b8">→</text>

      {/* Bottom bar */}
      <rect x={30} y={315} width={700} height={22} rx="8" fill="#7c3aed"/>
      <text x={380} y={330} textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">Skewer (axle) stays the same — only the cardstock strip length changes!</text>
    </svg>
  )
}

function SvgRealWorld() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fff7ed" rx="16"/>
      <text x="380" y="32" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">Wheel &amp; Axle in Real Life</text>

      {/* 4 examples in 2×2 grid */}
      {/* Fishing Reel */}
      <rect x="30" y="55" width="330" height="120" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="50" y="80" fontSize="38">🎣</text>
      <text x="110" y="78" fontSize="15" fontWeight="bold" fill="#1e293b">Fishing Reel</text>
      <text x="110" y="98" fontSize="12" fill="#64748b">Crank (wheel) winds fishing</text>
      <text x="110" y="114" fontSize="12" fill="#64748b">line on the axle spool.</text>
      <text x="110" y="134" fontSize="12" fontWeight="bold" fill="#f97316">Big crank → reel in big fish!</text>
      <rect x="30" y="160" width="330" height="6" rx="3" fill="#f97316"/>

      {/* Steering Wheel */}
      <rect x="400" y="55" width="330" height="120" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="420" y="80" fontSize="38">🚗</text>
      <text x="480" y="78" fontSize="15" fontWeight="bold" fill="#1e293b">Steering Wheel</text>
      <text x="480" y="98" fontSize="12" fill="#64748b">Big steering wheel (wheel)</text>
      <text x="480" y="114" fontSize="12" fill="#64748b">turns the tiny steering shaft.</text>
      <text x="480" y="134" fontSize="12" fontWeight="bold" fill="#7c3aed">Tiny hand move → huge wheel turn!</text>
      <rect x="400" y="160" width="330" height="6" rx="3" fill="#7c3aed"/>

      {/* Screwdriver */}
      <rect x="30" y="188" width="330" height="120" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="50" y="212" fontSize="38">🔩</text>
      <text x="110" y="210" fontSize="15" fontWeight="bold" fill="#1e293b">Screwdriver</text>
      <text x="110" y="230" fontSize="12" fill="#64748b">Wide handle = wheel.</text>
      <text x="110" y="246" fontSize="12" fill="#64748b">Thin shaft = axle.</text>
      <text x="110" y="266" fontSize="12" fontWeight="bold" fill="#22c55e">Grip the wide handle → drive the screw!</text>
      <rect x="30" y="298" width="330" height="6" rx="3" fill="#22c55e"/>

      {/* Your Well! */}
      <rect x="400" y="188" width="330" height="120" rx="14" fill="#fff7ed" stroke="#f97316" strokeWidth="3"/>
      <text x="420" y="212" fontSize="38">🪣</text>
      <text x="480" y="210" fontSize="15" fontWeight="bold" fill="#f97316">Your Well Pulley!</text>
      <text x="480" y="230" fontSize="12" fill="#64748b">Crank = wheel.</text>
      <text x="480" y="246" fontSize="12" fill="#64748b">Skewer = axle.</text>
      <text x="480" y="266" fontSize="12" fontWeight="bold" fill="#f97316">YOU built a real simple machine! 🎉</text>
      <rect x="400" y="298" width="330" height="6" rx="3" fill="#f97316"/>
    </svg>
  )
}

function SvgBigBattle() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fff1f2" rx="16"/>
      <text x="380" y="32" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">The Big Battle! ⚔️</text>
      <text x="380" y="54" textAnchor="middle" fontSize="13" fill="#64748b">Whoever wins decides what our cable car does!</text>

      {/* GRAVITY side — left */}
      <rect x="20" y="68" width="300" height="195" rx="16" fill="#fef2f2" stroke="#ef4444" strokeWidth="3"/>
      <rect x="20" y="68" width="300" height="44" rx="16" fill="#ef4444"/>
      <rect x="20" y="98" width="300" height="14" fill="#ef4444"/>
      <text x="170" y="98" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">🌍 GRAVITY</text>
      <text x="170" y="126" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626">WANTS TO...</text>
      <text x="170" y="148" textAnchor="middle" fontSize="14" fill="#374151">Pull the cup</text>
      <text x="170" y="168" textAnchor="middle" fontSize="14" fill="#374151">DOWN the zip line</text>
      <line x1="170" y1="178" x2="170" y2="222" stroke="#ef4444" strokeWidth="5"/>
      <polygon points="158,220 182,220 170,236" fill="#ef4444"/>
      <text x="170" y="254" textAnchor="middle" fontSize="28">🚡💨</text>

      {/* VS */}
      <text x="380" y="178" textAnchor="middle" fontSize="40" fontWeight="black" fill="#7c3aed">VS</text>

      {/* FRICTION side — right */}
      <rect x="440" y="68" width="300" height="195" rx="16" fill="#fff7ed" stroke="#f97316" strokeWidth="3"/>
      <rect x="440" y="68" width="300" height="44" rx="16" fill="#f97316"/>
      <rect x="440" y="98" width="300" height="14" fill="#f97316"/>
      <text x="590" y="98" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">🛑 FRICTION</text>
      <text x="590" y="126" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ea580c">WANTS TO...</text>
      <text x="590" y="148" textAnchor="middle" fontSize="14" fill="#374151">Hold the straw in</text>
      <text x="590" y="168" textAnchor="middle" fontSize="14" fill="#374151">place and STOP it</text>
      <text x="590" y="220" textAnchor="middle" fontSize="40">✋</text>

      {/* Bottom outcome boxes */}
      <rect x="20" y="278" width="340" height="50" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2"/>
      <text x="190" y="299" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">Gravity wins →</text>
      <text x="190" y="318" textAnchor="middle" fontSize="13" fill="#15803d">Cup slides ALL THE WAY! 🎉</text>

      <rect x="400" y="278" width="340" height="50" rx="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="2"/>
      <text x="570" y="299" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626">Friction wins →</text>
      <text x="570" y="318" textAnchor="middle" fontSize="13" fill="#dc2626">Cup stops in the middle 😢</text>
    </svg>
  )
}

function SvgRealWorldCableCars() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#eff6ff" rx="16"/>
      <text x="380" y="30" textAnchor="middle" fontSize="19" fontWeight="bold" fill="#1e293b">Real World Cable Cars! 🌎</text>
      <text x="380" y="50" textAnchor="middle" fontSize="13" fill="#64748b">The same science YOU discovered is used in real engineering!</text>

      {/* San Francisco */}
      <rect x="18" y="62" width="348" height="118" rx="14" fill="white" stroke="#f97316" strokeWidth="2.5"/>
      <text x="50" y="94" fontSize="36">🚡</text>
      <text x="100" y="88" fontSize="14" fontWeight="bold" fill="#1e293b">San Francisco</text>
      <text x="100" y="108" fontSize="12" fill="#64748b">Famous cable cars carry people</text>
      <text x="100" y="124" fontSize="12" fill="#64748b">up steep hills since</text>
      <text x="100" y="140" fontSize="14" fontWeight="bold" fill="#f97316">1873! 🎉</text>

      {/* Ski Resorts */}
      <rect x="394" y="62" width="348" height="118" rx="14" fill="white" stroke="#3b82f6" strokeWidth="2.5"/>
      <text x="426" y="94" fontSize="36">⛷️</text>
      <text x="476" y="88" fontSize="14" fontWeight="bold" fill="#1e293b">Ski Resorts</text>
      <text x="476" y="108" fontSize="12" fill="#64748b">Gondola lifts carry skiers up</text>
      <text x="476" y="124" fontSize="12" fill="#64748b">mountains all around</text>
      <text x="476" y="140" fontSize="14" fontWeight="bold" fill="#3b82f6">the world! 🏔️</text>

      {/* Swiss Alps */}
      <rect x="18" y="196" width="348" height="118" rx="14" fill="white" stroke="#7c3aed" strokeWidth="2.5"/>
      <text x="50" y="228" fontSize="36">🏔️</text>
      <text x="100" y="222" fontSize="14" fontWeight="bold" fill="#1e293b">Swiss Alps</text>
      <text x="100" y="242" fontSize="12" fill="#64748b">The longest cable car in the</text>
      <text x="100" y="258" fontSize="12" fill="#64748b">world is</text>
      <text x="100" y="274" fontSize="14" fontWeight="bold" fill="#7c3aed">30 km long! 😲</text>

      {/* Zip Lines */}
      <rect x="394" y="196" width="348" height="118" rx="14" fill="white" stroke="#16a34a" strokeWidth="2.5"/>
      <text x="426" y="228" fontSize="36">🎢</text>
      <text x="476" y="222" fontSize="14" fontWeight="bold" fill="#1e293b">Theme Parks &amp; Zip Lines</text>
      <text x="476" y="242" fontSize="12" fill="#64748b">Zip lines use the exact same</text>
      <text x="476" y="258" fontSize="12" fill="#64748b">pulley + gravity science</text>
      <text x="476" y="274" fontSize="14" fontWeight="bold" fill="#16a34a">that YOU learned! 🚀</text>
    </svg>
  )
}

function SvgNewWords() {
  const words = [
    { word: 'PULLEY', line1: 'A wheel that helps things', line2: 'move along a rope or string', color: '#f97316', bg: '#fff7ed' },
    { word: 'GRAVITY', line1: 'An invisible force that pulls', line2: 'everything downward', color: '#16a34a', bg: '#f0fdf4' },
    { word: 'FRICTION', line1: 'A force that slows things down', line2: 'when surfaces rub together', color: '#ef4444', bg: '#fef2f2' },
    { word: 'LOAD', line1: 'The cargo or weight', line2: 'that is being carried', color: '#3b82f6', bg: '#eff6ff' },
    { word: 'FORCE', line1: 'A push or pull that makes', line2: 'things move or stop', color: '#7c3aed', bg: '#f5f3ff' },
  ]
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f8fafc" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="19" fontWeight="bold" fill="#1e293b">New Words We Learned! 📚</text>
      {words.map((w, i) => {
        const x = i < 3 ? 12 + i * 246 : 135 + (i - 3) * 246
        const y = i < 3 ? 44 : 196
        return (
          <g key={i}>
            <rect x={x} y={y} width={234} height={128} rx="12" fill={w.bg} stroke={w.color} strokeWidth="2.5"/>
            <rect x={x} y={y} width={234} height={34} rx="12" fill={w.color}/>
            <rect x={x} y={y + 20} width={234} height={14} fill={w.color}/>
            <text x={x + 117} y={y + 23} textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{w.word}</text>
            <text x={x + 117} y={y + 62} textAnchor="middle" fontSize="12" fill="#374151">{w.line1}</text>
            <text x={x + 117} y={y + 80} textAnchor="middle" fontSize="12" fill="#374151">{w.line2}</text>
          </g>
        )
      })}
    </svg>
  )
}

function SvgReview() {
  const qa = [
    { q: 'What simple machine did the STRAW act as?', a: 'A PULLEY!', color: '#f97316' },
    { q: 'What force pulled our cup DOWN the string?', a: 'GRAVITY!', color: '#16a34a' },
    { q: 'What force tried to STOP our cup sliding?', a: 'FRICTION!', color: '#ef4444' },
    { q: 'Why did MORE rocks make it slide further?', a: 'More weight = more gravity = beats friction!', color: '#7c3aed' },
  ]
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fffbeb" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="19" fontWeight="bold" fill="#1e293b">{"Let's Review! 🙋"}</text>
      {qa.map((item, i) => {
        const y = 48 + i * 72
        return (
          <g key={i}>
            <rect x="18" y={y} width="724" height="62" rx="12" fill="white" stroke={item.color} strokeWidth="2"/>
            <rect x="18" y={y} width="36" height="62" rx="12" fill={item.color}/>
            <rect x="42" y={y} width="12" height="62" fill={item.color}/>
            <text x="36" y={y + 37} textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">?</text>
            <text x="68" y={y + 22} fontSize="12" fill="#374151">{item.q}</text>
            <text x="68" y={y + 44} fontSize="14" fontWeight="bold" fill={item.color}>{"→ " + item.a}</text>
          </g>
        )
      })}
    </svg>
  )
}

function SvgEngineers() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#1e293b" rx="16"/>
      <text x="380" y="44" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#fbbf24">You are ENGINEERS! 🔬</text>
      <text x="380" y="70" textAnchor="middle" fontSize="14" fill="#94a3b8">You built it. You tested it. You figured out WHY. {"That's"} science!</text>

      {[
        { icon: '🔄', label: 'PULLEY', desc: 'A wheel that helps', desc2: 'things move', color: '#f97316' },
        { icon: '🌍', label: 'GRAVITY', desc: 'Pulls things down —', desc2: 'our engine', color: '#22c55e' },
        { icon: '🛑', label: 'FRICTION', desc: 'Slows things down —', desc2: 'our challenge', color: '#ef4444' },
        { icon: '🏆', label: 'DISCOVERY', desc: 'More weight =', desc2: 'gravity wins = slides!', color: '#a855f7' },
      ].map((item, i) => {
        const x = 18 + i * 183
        return (
          <g key={i}>
            <rect x={x} y={90} width={170} height={160} rx="14" fill="#0f172a" stroke={item.color} strokeWidth="2.5"/>
            <text x={x + 85} y={137} textAnchor="middle" fontSize="40">{item.icon}</text>
            <text x={x + 85} y={168} textAnchor="middle" fontSize="13" fontWeight="bold" fill={item.color}>{item.label}</text>
            <text x={x + 85} y={188} textAnchor="middle" fontSize="11" fill="#94a3b8">{item.desc}</text>
            <text x={x + 85} y={204} textAnchor="middle" fontSize="11" fill="#94a3b8">{item.desc2}</text>
          </g>
        )
      })}

      <rect x="60" y="268" width="640" height="56" rx="14" fill="#fbbf24"/>
      <text x="380" y="291" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1e293b">Tell someone at home:</text>
      <text x="380" y="312" textAnchor="middle" fontSize="13" fill="#1e293b">{'"I built a cable car and discovered that gravity beats friction!"'}</text>
    </svg>
  )
}

// ── G1-2 Week 2 — Seesaw slides ───────────────────────────────────────────────

// Helper: draws a seesaw (beam+fulcrum+seats) with optional tilt and optional objects
function SeesawDiagram({ cx, cy, tilt = 0, leftObjs = 0, rightObjs = 0, balanced = false }: {
  cx: number; cy: number; tilt?: number; leftObjs?: number; rightObjs?: number; balanced?: boolean
}) {
  const beamW = 280, beamH = 14, halfBeam = beamW / 2
  const rad = (tilt * Math.PI) / 180
  // beam endpoints relative to pivot
  const lx = cx - halfBeam * Math.cos(rad), ly = cy - halfBeam * Math.sin(rad)
  const rx = cx + halfBeam * Math.cos(rad), ry = cy + halfBeam * Math.sin(rad)
  return (
    <g>
      {/* fulcrum triangle */}
      <polygon points={`${cx},${cy} ${cx - 22},${cy + 46} ${cx + 22},${cy + 46}`} fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
      {/* base */}
      <rect x={cx - 38} y={cy + 46} width={76} height={10} rx="5" fill="#ea580c"/>
      {/* beam */}
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#92400e" strokeWidth={beamH} strokeLinecap="round"/>
      {/* left seat */}
      <rect x={lx - 22} y={ly - 26} width={44} height={20} rx="5" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
      {/* right seat */}
      <rect x={rx - 22} y={ry - 26} width={44} height={20} rx="5" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
      {/* left objects (coins) */}
      {Array.from({ length: leftObjs }).map((_, i) => (
        <circle key={`l${i}`} cx={lx - 8 + i * 10} cy={ly - 36} r={8} fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
      ))}
      {/* right objects */}
      {Array.from({ length: rightObjs }).map((_, i) => (
        <circle key={`r${i}`} cx={rx - 8 + i * 10} cy={ry - 36} r={8} fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
      ))}
      {/* balanced label */}
      {balanced && <text x={cx} y={cy - 50} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#16a34a">BALANCED ✓</text>}
    </g>
  )
}

function SvgSeesawBuild() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fff7ed" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">What Did We Build? 🪜</text>
      {/* Main seesaw diagram — raised so labels have room */}
      <SeesawDiagram cx={380} cy={175} tilt={-8} leftObjs={2} rightObjs={0}/>
      {/* ① BEAM — top centre, arrow to beam midpoint */}
      <line x1="460" y1="115" x2="420" y2="152" stroke="#92400e" strokeWidth="2"/>
      <rect x="420" y="95" width="100" height="24" rx="8" fill="#92400e"/>
      <text x="470" y="111" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">① BEAM</text>
      {/* ② FULCRUM — below the triangle */}
      <line x1="380" y1="240" x2="380" y2="226" stroke="#ea580c" strokeWidth="2"/>
      <rect x="330" y="242" width="100" height="24" rx="8" fill="#ea580c"/>
      <text x="380" y="258" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">② FULCRUM</text>
      {/* ③ SEAT — far left, arrow to left seat */}
      <line x1="174" y1="182" x2="214" y2="192" stroke="#16a34a" strokeWidth="2"/>
      <rect x="82" y="170" width="94" height="24" rx="8" fill="#16a34a"/>
      <text x="129" y="186" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">③ SEAT</text>
      {/* ④ LOAD — upper left, arrow to coins */}
      <line x1="168" y1="125" x2="236" y2="150" stroke="#d97706" strokeWidth="2"/>
      <rect x="76" y="113" width="94" height="24" rx="8" fill="#d97706"/>
      <text x="123" y="129" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">④ LOAD</text>
      {/* bottom info cards */}
      <rect x="18" y="290" width="340" height="40" rx="10" fill="#1d4ed8"/>
      <text x="188" y="307" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">The HEAVIER side goes DOWN</text>
      <text x="188" y="323" textAnchor="middle" fontSize="11" fill="#bfdbfe">Beam tips around the fulcrum</text>
      <rect x="402" y="290" width="340" height="40" rx="10" fill="#15803d"/>
      <text x="572" y="307" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">Add objects to test WEIGHT</text>
      <text x="572" y="323" textAnchor="middle" fontSize="11" fill="#bbf7d0">Coins, erasers, rocks — anything!</text>
    </svg>
  )
}

function SvgSeesawLever() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#eff6ff" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">What is a Lever? ⚖️</text>
      {/* Central diagram showing BEAM + FULCRUM + LOAD */}
      <rect x="190" y="105" width="380" height="18" rx="9" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
      {/* Left LOAD */}
      <rect x="195" y="75" width="50" height="30" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2"/>
      <text x="220" y="94" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">LOAD</text>
      {/* Fulcrum */}
      <polygon points="380,123 354,166 406,166" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
      <rect x="344" y="166" width="72" height="10" rx="5" fill="#ea580c"/>
      <text x="380" y="185" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ea580c">FULCRUM</text>
      {/* Right LOAD */}
      <rect x="515" y="75" width="60" height="30" rx="6" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2"/>
      <text x="545" y="94" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">LOAD</text>
      {/* BEAM label */}
      <text x="380" y="100" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">BEAM</text>
      {/* 3 real-world examples */}
      <rect x="18" y="200" width="220" height="120" rx="14" fill="white" stroke="#f97316" strokeWidth="2.5"/>
      <text x="128" y="228" textAnchor="middle" fontSize="36">🪜</text>
      <text x="128" y="262" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">Seesaw</text>
      <text x="128" y="280" textAnchor="middle" fontSize="11" fill="#64748b">Fulcrum in the middle</text>
      <text x="128" y="296" textAnchor="middle" fontSize="11" fill="#64748b">Load on both ends</text>
      <rect x="270" y="200" width="220" height="120" rx="14" fill="white" stroke="#3b82f6" strokeWidth="2.5"/>
      <text x="380" y="228" textAnchor="middle" fontSize="36">✂️</text>
      <text x="380" y="262" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">Scissors</text>
      <text x="380" y="280" textAnchor="middle" fontSize="11" fill="#64748b">Two levers joined</text>
      <text x="380" y="296" textAnchor="middle" fontSize="11" fill="#64748b">at the fulcrum!</text>
      <rect x="522" y="200" width="220" height="120" rx="14" fill="white" stroke="#22c55e" strokeWidth="2.5"/>
      <text x="632" y="228" textAnchor="middle" fontSize="36">🦾</text>
      <text x="632" y="262" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">Crowbar</text>
      <text x="632" y="280" textAnchor="middle" fontSize="11" fill="#64748b">Lever that lifts</text>
      <text x="632" y="296" textAnchor="middle" fontSize="11" fill="#64748b">very heavy things!</text>
    </svg>
  )
}

function SvgSeesawFulcrum() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f0fdf4" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">Key Word: FULCRUM 🔺</text>
      {/* Left panel: centred fulcrum = balanced */}
      <rect x="18" y="48" width="340" height="240" rx="16" fill="white" stroke="#16a34a" strokeWidth="3"/>
      <rect x="18" y="48" width="340" height="36" rx="16" fill="#16a34a"/>
      <rect x="18" y="70" width="340" height="14" fill="#16a34a"/>
      <text x="188" y="72" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">✅ Fulcrum in the CENTRE</text>
      {/* centred seesaw - balanced */}
      <rect x="48" y="148" width="280" height="14" rx="7" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
      <polygon points="188,162 164,206 212,206" fill="#16a34a" stroke="#15803d" strokeWidth="2"/>
      <rect x="148" y="206" width="80" height="10" rx="5" fill="#15803d"/>
      <rect x="52" y="126" width="44" height="22" rx="5" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
      <rect x="280" y="126" width="44" height="22" rx="5" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
      <circle cx="73" cy="118" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
      <circle cx="302" cy="118" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
      <text x="188" y="240" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#16a34a">Can tip EITHER way! ↕</text>
      <text x="188" y="258" textAnchor="middle" fontSize="12" fill="#64748b">Fair measurement!</text>
      {/* Right panel: off-centre = always tilts */}
      <rect x="402" y="48" width="340" height="240" rx="16" fill="white" stroke="#ef4444" strokeWidth="3"/>
      <rect x="402" y="48" width="340" height="36" rx="16" fill="#ef4444"/>
      <rect x="402" y="70" width="340" height="14" fill="#ef4444"/>
      <text x="572" y="72" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">❌ Fulcrum OFF-CENTRE</text>
      {/* off-centre seesaw - tilted right */}
      <line x1="420" y1="175" x2="720" y2="155" stroke="#92400e" strokeWidth="14" strokeLinecap="round"/>
      <polygon points="610,155 586,199 634,199" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
      <rect x="570" y="199" width="80" height="10" rx="5" fill="#dc2626"/>
      <rect x="422" y="153" width="44" height="22" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"/>
      <rect x="676" y="133" width="44" height="22" rx="5" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"/>
      <text x="572" y="240" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ef4444">ALWAYS tilts one way!</text>
      <text x="572" y="258" textAnchor="middle" fontSize="12" fill="#64748b">Wrong results!</text>
      {/* bottom tip */}
      <rect x="50" y="300" width="660" height="32" rx="10" fill="#1e293b"/>
      <text x="380" y="320" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24">💡 Mark the CENTRE of your beam — the fulcrum must sit exactly there!</text>
    </svg>
  )
}

function SvgSeesawBalance() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fef2f2" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">The Rule of Balance ⬇️</text>
      <text x="380" y="50" textAnchor="middle" fontSize="13" fill="#64748b">The HEAVIER side ALWAYS goes down — equal weight = level beam</text>
      {/* 3 states */}
      {/* State 1: Left heavy → left down */}
      <rect x="12" y="64" width="222" height="228" rx="14" fill="white" stroke="#ef4444" strokeWidth="3"/>
      <rect x="12" y="64" width="222" height="34" rx="14" fill="#ef4444"/>
      <rect x="12" y="84" width="222" height="14" fill="#ef4444"/>
      <text x="123" y="86" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">Left side heavier</text>
      <SeesawDiagram cx={123} cy={172} tilt={12} leftObjs={2} rightObjs={0}/>
      <rect x="22" y="255" width="202" height="16" rx="6" fill="#fee2e2"/>
      <text x="123" y="266" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">LEFT goes DOWN ⬇</text>
      <text x="123" y="283" textAnchor="middle" fontSize="11" fill="#64748b">Right goes UP ⬆</text>
      {/* State 2: Equal → balanced */}
      <rect x="269" y="64" width="222" height="228" rx="14" fill="white" stroke="#16a34a" strokeWidth="3"/>
      <rect x="269" y="64" width="222" height="34" rx="14" fill="#16a34a"/>
      <rect x="269" y="84" width="222" height="14" fill="#16a34a"/>
      <text x="380" y="86" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">Equal on both sides</text>
      <SeesawDiagram cx={380} cy={172} tilt={0} leftObjs={1} rightObjs={1} balanced/>
      <rect x="279" y="255" width="202" height="16" rx="6" fill="#dcfce7"/>
      <text x="380" y="266" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#15803d">BEAM STAYS LEVEL ↔</text>
      <text x="380" y="283" textAnchor="middle" fontSize="11" fill="#64748b">That is BALANCE!</text>
      {/* State 3: Right heavy → right down */}
      <rect x="526" y="64" width="222" height="228" rx="14" fill="white" stroke="#3b82f6" strokeWidth="3"/>
      <rect x="526" y="64" width="222" height="34" rx="14" fill="#3b82f6"/>
      <rect x="526" y="84" width="222" height="14" fill="#3b82f6"/>
      <text x="637" y="86" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">Right side heavier</text>
      <SeesawDiagram cx={637} cy={172} tilt={-12} leftObjs={0} rightObjs={2}/>
      <rect x="536" y="255" width="202" height="16" rx="6" fill="#dbeafe"/>
      <text x="637" y="266" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d4ed8">RIGHT goes DOWN ⬇</text>
      <text x="637" y="283" textAnchor="middle" fontSize="11" fill="#64748b">Left goes UP ⬆</text>
      {/* Bottom */}
      <rect x="50" y="302" width="660" height="34" rx="12" fill="#1e293b"/>
      <text x="380" y="318" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24">Your seesaw is a MEASURING MACHINE — it tells you which side is heavier!</text>
      <text x="380" y="332" textAnchor="middle" fontSize="12" fill="#e2e8f0">More reliable than your eyes 👁️</text>
    </svg>
  )
}

function SvgSeesawSizeWeight() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f5f3ff" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">Size vs. Weight 🔍</text>
      <text x="380" y="50" textAnchor="middle" fontSize="13" fill="#7c3aed">A BIG object is NOT always heavier — your seesaw tells the truth!</text>
      {/* Left example: small stone vs big foam */}
      <rect x="18" y="62" width="340" height="200" rx="16" fill="white" stroke="#7c3aed" strokeWidth="3"/>
      <text x="188" y="88" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7c3aed">Small stone vs Big foam cube</text>
      {/* seesaw tilted left (stone side down) */}
      <SeesawDiagram cx={188} cy={172} tilt={14} leftObjs={0} rightObjs={0}/>
      {/* stone on left seat (small, dark) */}
      <circle cx="110" cy="138" r="16" fill="#78716c" stroke="#57534e" strokeWidth="2"/>
      <text x="110" y="143" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">stone</text>
      {/* foam cube on right seat (big, light) */}
      <rect x="228" y="102" width="40" height="40" rx="4" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
      <text x="248" y="126" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">foam</text>
      <text x="188" y="240" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7c3aed">Stone goes DOWN — it is denser!</text>
      <text x="188" y="258" textAnchor="middle" fontSize="11" fill="#64748b">The big cube looks heavier but is NOT</text>
      {/* Right example: balloon vs marble */}
      <rect x="402" y="62" width="340" height="200" rx="16" fill="white" stroke="#f97316" strokeWidth="3"/>
      <text x="572" y="88" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#f97316">Big balloon vs Tiny marble</text>
      {/* seesaw tilted right (marble side down) */}
      <SeesawDiagram cx={572} cy={172} tilt={-14} leftObjs={0} rightObjs={0}/>
      {/* balloon on left (big, light) */}
      <circle cx="490" cy="118" r="28" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"/>
      <text x="490" y="123" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7f1d1d">balloon</text>
      <line x1="490" y1="146" x2="490" y2="155" stroke="#ef4444" strokeWidth="2"/>
      {/* marble on right (tiny, heavy) */}
      <circle cx="656" cy="125" r="10" fill="#6366f1" stroke="#4338ca" strokeWidth="2"/>
      <text x="656" y="129" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">marble</text>
      <text x="572" y="240" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f97316">Marble goes DOWN — more matter inside!</text>
      <text x="572" y="258" textAnchor="middle" fontSize="11" fill="#64748b">The big balloon is almost weightless</text>
      {/* Bottom */}
      <rect x="50" y="278" width="660" height="50" rx="12" fill="#1e293b"/>
      <text x="380" y="298" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">SIZE = how big something LOOKS</text>
      <text x="380" y="318" textAnchor="middle" fontSize="13" fill="#e2e8f0">WEIGHT (Mass) = how much MATTER is inside — what your seesaw measures!</text>
    </svg>
  )
}

function SvgSeesawRealWorld() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#eff6ff" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="19" fontWeight="bold" fill="#1e293b">Levers in the Real World! 🌍</text>
      <text x="380" y="48" textAnchor="middle" fontSize="13" fill="#64748b">Levers are everywhere — from your kitchen to construction sites!</text>
      <rect x="18" y="60" width="342" height="118" rx="14" fill="white" stroke="#f97316" strokeWidth="2.5"/>
      <text x="50" y="92" fontSize="38">🪜</text>
      <text x="108" y="88" fontSize="15" fontWeight="bold" fill="#1e293b">Playground Seesaw</text>
      <text x="108" y="108" fontSize="12" fill="#64748b">Beam + fulcrum in the middle</text>
      <text x="108" y="124" fontSize="12" fill="#64748b">+ two loads on each end.</text>
      <text x="108" y="142" fontSize="12" fontWeight="bold" fill="#f97316">Just like YOUR build! 🎉</text>
      <rect x="400" y="60" width="342" height="118" rx="14" fill="white" stroke="#3b82f6" strokeWidth="2.5"/>
      <text x="432" y="92" fontSize="38">✂️</text>
      <text x="490" y="88" fontSize="15" fontWeight="bold" fill="#1e293b">Scissors</text>
      <text x="490" y="108" fontSize="12" fill="#64748b">Two levers joined at the</text>
      <text x="490" y="124" fontSize="12" fill="#64748b">fulcrum (the screw).</text>
      <text x="490" y="142" fontSize="12" fontWeight="bold" fill="#3b82f6">Squeeze = effort. Cut = load!</text>
      <rect x="18" y="192" width="342" height="118" rx="14" fill="white" stroke="#22c55e" strokeWidth="2.5"/>
      <text x="50" y="224" fontSize="38">⚖️</text>
      <text x="108" y="220" fontSize="15" fontWeight="bold" fill="#1e293b">Balance Scale</text>
      <text x="108" y="240" fontSize="12" fill="#64748b">Same as your seesaw —</text>
      <text x="108" y="256" fontSize="12" fill="#64748b">used in science labs for</text>
      <text x="108" y="272" fontSize="14" fontWeight="bold" fill="#22c55e">5,000 years! 🏛️</text>
      <rect x="400" y="192" width="342" height="118" rx="14" fill="white" stroke="#7c3aed" strokeWidth="2.5"/>
      <text x="432" y="224" fontSize="38">🦾</text>
      <text x="490" y="220" fontSize="15" fontWeight="bold" fill="#1e293b">Crowbar</text>
      <text x="490" y="240" fontSize="12" fill="#64748b">A lever that multiplies</text>
      <text x="490" y="256" fontSize="12" fill="#64748b">your push to lift</text>
      <text x="490" y="272" fontSize="14" fontWeight="bold" fill="#7c3aed">VERY heavy loads! 💪</text>
    </svg>
  )
}

function SvgSeesawDiscovery() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#faf5ff" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">Our Big Discovery! 🏆</text>
      {/* 4 discovery cards */}
      {[
        { x: 18,  y: 46, color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', emoji: '⬇️', title: 'Heavier side', sub: 'ALWAYS goes DOWN' },
        { x: 390, y: 46, color: '#16a34a', bg: '#f0fdf4', border: '#86efac', emoji: '↔️', title: 'Equal weight', sub: 'BEAM stays LEVEL' },
        { x: 18,  y: 172, color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', emoji: '🪨', title: 'Big ≠ heavy', sub: 'SIZE and WEIGHT differ' },
        { x: 390, y: 172, color: '#f97316', bg: '#fff7ed', border: '#fdba74', emoji: '⚖️', title: 'Your seesaw', sub: 'is a MEASURING MACHINE' },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={348} height={110} rx="14" fill={c.bg} stroke={c.border} strokeWidth="2.5"/>
          <text x={c.x + 44} y={c.y + 58} textAnchor="middle" fontSize="40">{c.emoji}</text>
          <text x={c.x + 196} y={c.y + 46} fontSize="15" fontWeight="bold" fill={c.color}>{c.title}</text>
          <text x={c.x + 196} y={c.y + 68} fontSize="12" fill="#374151">{c.sub}</text>
        </g>
      ))}
      {/* Bottom */}
      <rect x="40" y="297" width="680" height="34" rx="12" fill="#1e293b"/>
      <text x="380" y="319" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">You discovered this by TESTING, not by being told. That is real science! 🔬</text>
    </svg>
  )
}

function SvgSeesawReview() {
  const qa = [
    { q: 'What simple machine is a seesaw?', a: 'A LEVER!', color: '#f97316' },
    { q: 'What is the pivot point called?', a: 'THE FULCRUM!', color: '#16a34a' },
    { q: 'Which side of the seesaw goes DOWN?', a: 'THE HEAVIER SIDE!', color: '#ef4444' },
    { q: 'If both sides are level — what does that tell us?', a: 'EQUAL WEIGHT = BALANCE!', color: '#7c3aed' },
  ]
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fffbeb" rx="16"/>
      <text x="380" y="28" textAnchor="middle" fontSize="19" fontWeight="bold" fill="#1e293b">{"Let's Review! 🙋"}</text>
      {qa.map((item, i) => {
        const y = 46 + i * 70
        return (
          <g key={i}>
            <rect x="18" y={y} width="724" height="60" rx="12" fill="white" stroke={item.color} strokeWidth="2"/>
            <rect x="18" y={y} width="36" height="60" rx="12" fill={item.color}/>
            <rect x="42" y={y} width="12" height="60" fill={item.color}/>
            <text x="36" y={y + 36} textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">?</text>
            <text x="68" y={y + 22} fontSize="12" fill="#374151">{item.q}</text>
            <text x="68" y={y + 44} fontSize="14" fontWeight="bold" fill={item.color}>{'→ ' + item.a}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Map "gradeBand-weekNumber" + slideIndex → SVG component
const VISUALS: Record<string, Record<number, () => JSX.Element>> = {
  'g1-2-1': {
    0: SvgWhatDidWeBuild,
    1: SvgPulleyRealWorld,
    2: SvgGravity,
    3: SvgFriction,
    4: SvgBigBattle,
    5: SvgBigDiscovery,
    6: SvgRealWorldCableCars,
    7: SvgNewWords,
    8: SvgReview,
    9: SvgEngineers,
  },
  'g3-4-1': {
    0: SvgSimpleMachinesG34,
    1: SvgWheelAxle,
    2: SvgCrankWell,
    3: SvgMechanicalAdvantage,
    4: SvgRealWorld,
  },
  // G1-2 Week 2 — Seesaw (all 8 slides)
  'g1-2-2': {
    0: SvgSeesawBuild,
    1: SvgSeesawLever,
    2: SvgSeesawFulcrum,
    3: SvgSeesawBalance,
    4: SvgSeesawSizeWeight,
    5: SvgSeesawRealWorld,
    6: SvgSeesawDiscovery,
    7: SvgSeesawReview,
  },
  // g3-4-2 (Balance Scale) still uses text fallback — no custom SVGs yet
}

// ── Main component ─────────────────────────────────────────────────────────────

export function TheoryViewer({ deck, buildDayId }: Props) {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)

  const total = deck.slides.length
  const current = deck.slides[slide]
  const colors = SLIDE_COLORS[current.color]
  const isLast = slide === total - 1

  const Visual = VISUALS[`${deck.gradeBand}-${deck.weekNumber}`]?.[slide]

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Thin header */}
      <header className={cn('text-white px-4 py-2.5 flex items-center gap-3', colors.badge)}>
        <button onClick={() => router.push('/teacher')} className="text-white/70 text-xl leading-none">←</button>
        <p className="flex-1 font-black text-base truncate">{current.emoji} {current.title}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => router.push(`/build/day/${buildDayId}`)} className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full transition-all">⚙️ Setup</button>
          <button onClick={() => router.push(`/build/day/${buildDayId}?view=steps`)} className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full transition-all">🏗️ Steps</button>
          <button onClick={() => router.push(`/teacher/build/chart/${buildDayId}`)} className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full transition-all">📊 Results</button>
        </div>
        {/* Dot nav */}
        <div className="flex gap-1.5 shrink-0">
          {Array.from({ length: total }, (_, i) => (
            <button key={i} onClick={() => { setSlide(i); setNotesOpen(false) }}
              className={cn('w-2.5 h-2.5 rounded-full transition-all', i === slide ? 'bg-white scale-125' : 'bg-white/40')}
            />
          ))}
        </div>
        <span className="text-white/50 text-xs shrink-0">{slide + 1}/{total}</span>
      </header>

      {/* SLIDE — SVG or text card */}
      <div className={cn('flex-1 flex items-center justify-center p-4 overflow-y-auto', Visual != null ? 'bg-white' : colors.bg)}>
        {Visual != null ? (
          <div className="w-full max-w-4xl">
            <Visual />
          </div>
        ) : (
          /* Text layout for slides without a custom SVG (e.g. W2 Seesaw / Balance Scale) */
          <div className="w-full max-w-2xl space-y-4">
            {/* Emoji + headline */}
            <div className={cn('rounded-2xl p-5 border-2', colors.border)}>
              <div className="text-6xl text-center mb-3">{current.emoji}</div>
              <p className={cn('text-xl font-black text-center leading-snug', colors.text)}>{current.headline}</p>
            </div>
            {/* Vocab word */}
            {current.vocab && (
              <div className={cn('rounded-xl px-4 py-3 flex items-start gap-3', colors.headlineBg, 'border', colors.border)}>
                <span className={cn('text-xs font-black uppercase tracking-widest mt-0.5 shrink-0', colors.text)}>WORD</span>
                <div>
                  <p className={cn('font-black text-base', colors.text)}>{current.vocab.word}</p>
                  <p className={cn('text-sm', colors.text)}>{current.vocab.definition}</p>
                </div>
              </div>
            )}
            {/* Bullet points */}
            <div className="space-y-2">
              {current.bullets.map((b, i) => (
                <div key={i} className={cn('rounded-xl px-4 py-3 border', colors.headlineBg, colors.border)}>
                  <span
                    className={cn('text-sm leading-snug', colors.text)}
                    dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }}
                  />
                </div>
              ))}
            </div>
            {/* Try this */}
            {current.tryThis && (
              <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3">
                <p className="text-yellow-800 text-sm font-semibold">🙋 {current.tryThis}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Speaker notes — collapsed by default, teacher taps to peek */}
      <div className="bg-gray-800 border-t border-gray-700">
        <button
          onClick={() => setNotesOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
        >
          <span>📝 Speaker notes {notesOpen ? '▲' : '▼'}</span>
          <span className="text-gray-600 text-xs">tap to {notesOpen ? 'hide' : 'show'}</span>
        </button>

        {notesOpen && (
          <div className="px-4 pb-3 space-y-1.5">
            {current.speakerNotes ? (
              /* Dedicated speaker notes — what to SAY aloud */
              <ul className="space-y-1.5">
                {current.speakerNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-200 text-xs leading-snug">
                    <span className="text-blue-400 shrink-0 mt-0.5 font-bold">{i + 1}.</span>
                    <span dangerouslySetInnerHTML={{ __html: note.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
                  </li>
                ))}
              </ul>
            ) : (
              /* Fallback: show headline + bullets */
              <>
                <p className="text-white font-bold text-sm">{current.headline}</p>
                <ul className="space-y-1">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-xs leading-snug">
                      <span className="text-gray-500 shrink-0 mt-0.5">•</span>
                      <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {current.tryThis && (
              <p className="text-yellow-300 text-xs font-semibold border border-yellow-700 rounded px-2 py-1 mt-1">
                🙋 Ask: {current.tryThis}
              </p>
            )}
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
            onClick={() => router.push(`/build/day/${buildDayId}?view=steps`)}
            className={cn('min-h-[48px] px-8 rounded-xl text-white font-bold active:scale-95 transition-all shadow', colors.badge)}
            style={{ flex: 2 }}
          >
            🔨 Start Building!
          </button>
        ) : (
          <button
            onClick={() => { setSlide(s => s + 1); setNotesOpen(false) }}
            className={cn('min-h-[48px] px-8 rounded-xl text-white font-bold active:scale-95 transition-all shadow', colors.badge)}
            style={{ flex: 2 }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { TheoryDeck } from '@/lib/theory-slides'
import { SLIDE_COLORS } from '@/lib/theory-slides'

interface Props { deck: TheoryDeck; buildDayId: string }

// ── Inline SVG diagrams ────────────────────────────────────────────────────────

// G1-2 slides
function SvgSimpleMachines() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f0f4ff" rx="16"/>
      {/* Title */}
      <text x="380" y="36" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">6 Types of Simple Machines</text>

      {/* LEVER */}
      <g transform="translate(50,70)">
        <rect x="0" y="0" width="110" height="100" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="2"/>
        <text x="55" y="18" textAnchor="middle" fontSize="11" fill="#64748b">Lever</text>
        <line x1="10" y1="70" x2="100" y2="70" stroke="#64748b" strokeWidth="4" strokeLinecap="round"/>
        <polygon points="55,45 45,70 65,70" fill="#94a3b8"/>
        <rect x="8" y="52" width="18" height="18" rx="3" fill="#3b82f6"/>
      </g>

      {/* WHEEL & AXLE */}
      <g transform="translate(180,70)">
        <rect x="0" y="0" width="110" height="100" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="2"/>
        <text x="55" y="18" textAnchor="middle" fontSize="11" fill="#64748b">Wheel &amp; Axle</text>
        <circle cx="55" cy="60" r="28" fill="none" stroke="#64748b" strokeWidth="4"/>
        <circle cx="55" cy="60" r="9" fill="#94a3b8"/>
        <line x1="55" y1="32" x2="55" y2="88" stroke="#475569" strokeWidth="3"/>
        <line x1="27" y1="60" x2="83" y2="60" stroke="#475569" strokeWidth="3"/>
      </g>

      {/* PULLEY — highlighted */}
      <g transform="translate(310,55)">
        <rect x="0" y="0" width="130" height="120" rx="12" fill="#fff7ed" stroke="#f97316" strokeWidth="4"/>
        <rect x="0" y="0" width="130" height="26" rx="12" fill="#f97316"/>
        <text x="65" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">⭐ PULLEY</text>
        <text x="65" y="36" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ea580c">← Today!</text>
        <circle cx="65" cy="78" r="28" fill="none" stroke="#f97316" strokeWidth="5"/>
        <circle cx="65" cy="78" r="9" fill="#fed7aa"/>
        <line x1="65" y1="50" x2="65" y2="34" stroke="#64748b" strokeWidth="3"/>
        <path d="M37,78 Q37,50 65,50" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4,3"/>
        <path d="M93,78 Q93,106 100,115" fill="none" stroke="#3b82f6" strokeWidth="3"/>
        <rect x="93" y="108" width="16" height="16" rx="3" fill="#3b82f6"/>
      </g>

      {/* INCLINED PLANE */}
      <g transform="translate(465,70)">
        <rect x="0" y="0" width="110" height="100" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="2"/>
        <text x="55" y="18" textAnchor="middle" fontSize="11" fill="#64748b">Inclined Plane</text>
        <polygon points="10,85 100,85 100,35" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>
        <rect x="90" y="28" width="16" height="16" rx="3" fill="#22c55e"/>
      </g>

      {/* WEDGE */}
      <g transform="translate(595,70)">
        <rect x="0" y="0" width="110" height="100" rx="10" fill="white" stroke="#cbd5e1" strokeWidth="2"/>
        <text x="55" y="18" textAnchor="middle" fontSize="11" fill="#64748b">Wedge &amp; Screw</text>
        <polygon points="55,35 30,80 80,80" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>
        <line x1="55" y1="35" x2="55" y2="80" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,2"/>
      </g>

      {/* Bottom label */}
      <text x="380" y="315" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#f97316">Today we use the PULLEY! 🚡</text>
    </svg>
  )
}

function SvgPulleyDiagram() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#eff6ff" rx="16"/>
      {/* ZIP LINE */}
      <line x1="60" y1="60" x2="700" y2="180" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round"/>
      {/* support posts */}
      <line x1="60" y1="60" x2="60" y2="320" stroke="#78716c" strokeWidth="8" strokeLinecap="round"/>
      <line x1="700" y1="180" x2="700" y2="320" stroke="#78716c" strokeWidth="8" strokeLinecap="round"/>
      {/* STRAW = pulley */}
      <ellipse cx="380" cy="120" rx="30" ry="11" fill="#4ade80" stroke="#16a34a" strokeWidth="3"/>
      <text x="380" y="108" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#16a34a">STRAW = PULLEY</text>
      {/* arrow on straw */}
      <path d="M380,131 L380,195" stroke="#3b82f6" strokeWidth="4" strokeDasharray="5,3"/>
      {/* Cup */}
      <path d="M355,195 Q355,245 365,250 L395,250 Q405,245 405,195 Z" fill="#d4956a" stroke="#92400e" strokeWidth="3"/>
      <line x1="355" y1="195" x2="405" y2="195" stroke="#92400e" strokeWidth="3"/>
      {/* paperclips */}
      <text x="380" y="232" textAnchor="middle" fontSize="20">📎📎📎</text>
      {/* LOAD label */}
      <rect x="415" y="205" width="90" height="28" rx="8" fill="#3b82f6"/>
      <text x="460" y="223" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">LOAD</text>
      <line x1="405" y1="225" x2="415" y2="220" stroke="#3b82f6" strokeWidth="2"/>
      {/* GRAVITY arrow */}
      <line x1="310" y1="195" x2="310" y2="260" stroke="#ef4444" strokeWidth="4" markerEnd="url(#arr)"/>
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444"/></marker></defs>
      <rect x="210" y="225" width="90" height="28" rx="8" fill="#ef4444"/>
      <text x="255" y="243" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">GRAVITY</text>
      <line x1="300" y1="235" x2="310" y2="235" stroke="#ef4444" strokeWidth="2"/>
      {/* direction arrows */}
      <text x="380" y="300" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">Straw rolls along string → cup glides to the bottom!</text>
    </svg>
  )
}

function SvgGravity() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#f0fdf4" rx="16"/>
      {/* Earth */}
      <circle cx="380" cy="290" r="55" fill="#22c55e" stroke="#16a34a" strokeWidth="4"/>
      <text x="380" y="297" textAnchor="middle" fontSize="28">🌍</text>
      {/* Objects falling */}
      {[120, 240, 380, 520, 640].map((x, i) => {
        const icons = ['🍎', '🪣', '📎', '🎒', '🔧']
        return (
          <g key={i}>
            <text x={x} y={70} textAnchor="middle" fontSize="36">{icons[i]}</text>
            <line x1={x} y1={105} x2={x} y2={220} stroke="#ef4444" strokeWidth="3" strokeDasharray="6,4"/>
            <polygon points={`${x-8},218 ${x+8},218 ${x},232`} fill="#ef4444"/>
          </g>
        )
      })}
      {/* Label */}
      <rect x="100" y="138" width="560" height="40" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="380" y="162" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e293b">Everything falls DOWN toward Earth</text>
      {/* Key insight */}
      <rect x="155" y="245" width="450" height="34" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2"/>
      <text x="380" y="267" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#15803d">💡 Cup always hangs straight down — even on a diagonal zip line!</text>
    </svg>
  )
}

function SvgFriction() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fff7ed" rx="16"/>
      {/* Left: smooth = wins */}
      <rect x="30" y="20" width="330" height="300" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="195" y="50" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#16a34a">✅ SMOOTH STRAW + STRING</text>
      {/* zip line */}
      <line x1="55" y1="110" x2="330" y2="200" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="300" cy="194" rx="18" ry="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
      <path d="M285,202 Q285,230 292,235 L308,235 Q315,230 315,202 Z" fill="#d4956a" stroke="#92400e" strokeWidth="2"/>
      <text x="300" y="225" textAnchor="middle" fontSize="14">📎📎📎📎📎</text>
      {/* speed lines */}
      <line x1="250" y1="178" x2="230" y2="172" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
      <line x1="255" y1="188" x2="233" y2="184" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
      <text x="195" y="270" textAnchor="middle" fontSize="24">🏁</text>
      <rect x="75" y="278" width="240" height="28" rx="8" fill="#22c55e"/>
      <text x="195" y="296" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">Makes it all the way! 🎉</text>

      {/* Right: heavy = stops */}
      <rect x="400" y="20" width="330" height="300" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
      <text x="565" y="50" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ef4444">❌ TOO MUCH WEIGHT</text>
      {/* zip line */}
      <line x1="425" y1="110" x2="700" y2="200" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"/>
      {/* straw stopped halfway */}
      <ellipse cx="540" cy="152" rx="18" ry="8" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"/>
      <path d="M525,160 Q525,188 532,193 L548,193 Q555,188 555,160 Z" fill="#d4956a" stroke="#92400e" strokeWidth="2"/>
      <text x="540" y="182" textAnchor="middle" fontSize="11">📎📎📎📎📎📎📎📎</text>
      {/* STOP sign */}
      <text x="540" y="110" textAnchor="middle" fontSize="30">🛑</text>
      <rect x="445" y="278" width="240" height="28" rx="8" fill="#ef4444"/>
      <text x="565" y="296" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">Friction wins → stops early!</text>

      {/* VS */}
      <text x="380" y="175" textAnchor="middle" fontSize="22" fontWeight="black" fill="#f97316">VS</text>
    </svg>
  )
}

function SvgCableCarFull() {
  return (
    <svg viewBox="0 0 760 340" className="w-full h-full">
      <rect width="760" height="340" fill="#fff7ed" rx="16"/>
      {/* Title */}
      <text x="380" y="32" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">The Science of Your Cable Car</text>
      {/* ZIP LINE */}
      <line x1="80" y1="80" x2="680" y2="230" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round"/>
      <line x1="80" y1="80" x2="80" y2="310" stroke="#78716c" strokeWidth="10" strokeLinecap="round"/>
      <line x1="680" y1="230" x2="680" y2="310" stroke="#78716c" strokeWidth="10" strokeLinecap="round"/>
      {/* STRAW */}
      <ellipse cx="360" cy="155" rx="32" ry="12" fill="#4ade80" stroke="#16a34a" strokeWidth="3"/>
      {/* string */}
      <line x1="360" y1="167" x2="360" y2="210" stroke="#3b82f6" strokeWidth="3"/>
      {/* CUP */}
      <path d="M338,210 Q338,250 346,256 L374,256 Q382,250 382,210 Z" fill="#d4956a" stroke="#92400e" strokeWidth="3"/>
      <line x1="338" y1="210" x2="382" y2="210" stroke="#92400e" strokeWidth="3"/>
      <text x="360" y="242" textAnchor="middle" fontSize="16">📎📎</text>

      {/* Label: PULLEY */}
      <rect x="190" y="128" width="100" height="26" rx="8" fill="#16a34a"/>
      <text x="240" y="144" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">PULLEY (straw)</text>
      <line x1="330" y1="152" x2="292" y2="147" stroke="#16a34a" strokeWidth="2"/>

      {/* Label: GRAVITY */}
      <line x1="430" y1="210" x2="430" y2="260" stroke="#ef4444" strokeWidth="4"/>
      <polygon points="422,258 438,258 430,272" fill="#ef4444"/>
      <rect x="440" y="228" width="90" height="26" rx="8" fill="#ef4444"/>
      <text x="485" y="244" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">GRAVITY ↓</text>

      {/* Label: FRICTION */}
      <rect x="470" y="128" width="95" height="26" rx="8" fill="#f97316"/>
      <text x="517" y="144" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">FRICTION ≈</text>
      <line x1="470" y1="142" x2="395" y2="155" stroke="#f97316" strokeWidth="2"/>

      {/* Label: LOAD */}
      <rect x="190" y="235" width="80" height="26" rx="8" fill="#3b82f6"/>
      <text x="230" y="251" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">LOAD 📎</text>
      <line x1="270" y1="248" x2="338" y2="240" stroke="#3b82f6" strokeWidth="2"/>

      {/* bottom summary */}
      <rect x="80" y="288" width="600" height="36" rx="10" fill="#1e293b"/>
      <text x="380" y="310" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">PULLEY + GRAVITY + FRICTION + LOAD → your experiment!</text>
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

// Map grade+slideIndex → SVG component
const VISUALS: Record<string, Record<number, () => JSX.Element>> = {
  'g1-2': {
    0: SvgSimpleMachines,
    1: SvgPulleyDiagram,
    2: SvgGravity,
    3: SvgFriction,
    4: SvgCableCarFull,
  },
  'g3-4': {
    0: SvgSimpleMachinesG34,
    1: SvgWheelAxle,
    2: SvgCrankWell,
    3: SvgMechanicalAdvantage,
    4: SvgRealWorld,
  },
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

  const Visual = VISUALS[deck.gradeBand]?.[slide]

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Thin header */}
      <header className={cn('text-white px-4 py-2.5 flex items-center gap-3', colors.badge)}>
        <button onClick={() => router.push(`/build/day/${buildDayId}`)} className="text-white/70 text-xl leading-none">←</button>
        <p className="flex-1 font-black text-base truncate">{current.emoji} {current.title}</p>
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

      {/* SLIDE — SVG takes the whole screen */}
      <div className="flex-1 bg-white flex items-center justify-center p-2">
        {Visual ? (
          <div className="w-full max-w-4xl">
            <Visual />
          </div>
        ) : (
          <div className="text-9xl text-center">{current.emoji}</div>
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
            <p className="text-white font-bold text-sm">{current.headline}</p>
            <ul className="space-y-1">
              {current.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-xs leading-snug">
                  <span className="text-gray-500 shrink-0 mt-0.5">•</span>
                  <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
                </li>
              ))}
            </ul>
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
            onClick={() => router.push(`/build/day/${buildDayId}`)}
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

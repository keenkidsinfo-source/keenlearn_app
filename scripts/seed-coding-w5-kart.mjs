/**
 * seed-coding-w5-kart.mjs
 * Seeds Week 5 coding — Kart Racer
 *
 * G1-2: Steps 1–7 (rotation steering, finish line, 30s timer)
 * G3-4: Steps 1–10 (same core + bounce, 60s timer, Personal Best)
 *        g12StopAfter: 7 marks where G1-2 stops in the teacher view
 *
 * Run: node scripts/seed-coding-w5-kart.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL)

// ── Shared steps 1–7 (everyone does these) ───────────────────────────────────
const coreSteps = [
  `🏎️ Set up your kart!

① Click the sprite icon (bottom right) → "Choose a Sprite"
② Search "Car" → click it → rename it "Kart"
③ Delete the Cat sprite (right-click → delete)
④ Click the backdrop icon → "Choose a Backdrop" → search "Neon Tunnel" → click it
⑤ EVENTS → "when 🚩 clicked"
   LOOKS → "set size to 50 %"

✅ Your kart is on a cool track!`,

  `➡️ Turn right!

Click KART — drag to the white area:
① EVENTS → "when [right arrow] key pressed"
② MOTION → "turn ↻ 15 degrees"

✅ Press right arrow — kart turns right!`,

  `⬅️ Turn left!

Still on KART — drag to an EMPTY spot:
① EVENTS → "when [left arrow] key pressed"
② MOTION → "turn ↺ 15 degrees"

✅ Press both arrows — kart turns left and right!`,

  `🚀 Drive forward!

Still on KART — drag to an EMPTY spot:
① EVENTS → "when [up arrow] key pressed"
② MOTION → "move 10 steps"

✅ Press up arrow — kart drives in the direction it's facing!`,

  `🏆 Make a Laps counter!

Still on KART:
① VARIABLES → "Make a Variable" → type "Laps" → OK
② Find your "when 🚩 clicked" stack
③ Add: VARIABLES → "set Laps to 0"

✅ Laps counter appears on screen!`,

  `🏁 Cross the finish line!

① Click sprite icon → "Paint" → draw a wide stripe across the track
② Name it "FinishLine"
③ Click KART — new stack:
   EVENTS "when 🚩 clicked" + CONTROL "forever"
   Inside: if SENSING "touching [FinishLine]?"
   VARIABLES "change Laps by 1"
   CONTROL "wait 1 secs" (stops counting twice)

✅ Cross the line — Laps goes up!`,

  `⏱️ 30-second timer — race!

Still on KART:
① VARIABLES → "Make a Variable" → "Timer"
② New stack: EVENTS "when 🚩 clicked"
   VARIABLES "set Timer to 30"
③ CONTROL "repeat until Timer < 1"
   Inside: CONTROL "wait 1 secs"
   Inside: VARIABLES "change Timer by -1"
④ LOOKS "say [Time's up! 🏁] for 2 secs"
   CONTROL "stop [all]"

✅ 30 seconds — how many laps can you get?`,
]

// ── G3-4 challenge steps 8–10 ─────────────────────────────────────────────────
const challengeSteps = [
  `🔄 Bounce off the edges!

Click KART — find your "when 🚩 clicked + forever" stack:
① Inside the forever, add:
   MOTION → "if on edge, bounce"

✅ Kart bounces back instead of going off-screen!`,

  `⏱️ Race for 60 seconds!

Find your timer stack:
① Change "set Timer to 30" → change 30 to 60

✅ Twice the time — twice the laps!`,

  `🏆 Personal Best!

Still on KART:
① VARIABLES → "Make a Variable" → "PersonalBest"
② After the timer loop (before "stop all"), add:
   CONTROL "if" + OPERATORS "Laps > PersonalBest"
   Inside: VARIABLES "set PersonalBest to Laps"
   LOOKS "say [New Record! 🏆] for 2 secs"

✅ Beat your record every round!`,
]

// ── Update G1-2 content item ──────────────────────────────────────────────────
const [g12Item] = await sql`
  SELECT ci.id
  FROM content_items ci
  JOIN curriculum_content cc ON cc.content_item_id = ci.id
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE ci.subject = 'coding' AND ci.grade_band = 'g1-2' AND c.week_number = 5
  LIMIT 1
`

if (!g12Item) { console.error('❌ G1-2 W5 coding item not found — run seed-w5.mjs first'); process.exit(1) }

const g12Meta = {
  challenge: 'Kart Racer!',
  tagline: 'Drive your kart around the track — how many laps in 30 seconds?',
  steps: coreSteps,
}

await sql`
  UPDATE content_items
  SET metadata = ${g12Meta}, step_count = ${coreSteps.length}
  WHERE id = ${g12Item.id}
`
console.log(`✅ G1-2 Kart Racer: ${coreSteps.length} steps seeded`)

// ── Update G3-4 content item ──────────────────────────────────────────────────
const [g34Item] = await sql`
  SELECT ci.id
  FROM content_items ci
  JOIN curriculum_content cc ON cc.content_item_id = ci.id
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE ci.subject = 'coding' AND ci.grade_band = 'g3-4' AND c.week_number = 5
  LIMIT 1
`

if (!g34Item) { console.error('❌ G3-4 W5 coding item not found — run seed-w5.mjs first'); process.exit(1) }

const allSteps = [...coreSteps, ...challengeSteps]

const g34Meta = {
  challenge: 'Kart Racer!',
  tagline: 'Drive your kart, count laps, and beat your Personal Best!',
  g12StopAfter: coreSteps.length, // step number (1-based) where G1-2 finish
  steps: allSteps,
}

await sql`
  UPDATE content_items
  SET metadata = ${g34Meta}, step_count = ${allSteps.length}
  WHERE id = ${g34Item.id}
`
console.log(`✅ G3-4 Kart Racer: ${allSteps.length} steps seeded (G1-2 stop after step ${coreSteps.length})`)

await sql.end()

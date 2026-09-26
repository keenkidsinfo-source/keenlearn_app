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

① Bottom-right: click the 🐱 Cat sprite → right-click → Delete
② Click the sprite icon (bottom-right, looks like a face with +) → Choose a Sprite → search "Car" → click it
③ Click the name "Car" below the sprite → type "Kart" → press Enter
④ Click the backdrop icon (bottom-right, looks like a photo with +) → Choose a Backdrop → search "Neon Tunnel" → click it
⑤ Click Kart in the sprite list → drag these blocks to the code area on the right:
   EVENTS "when 🚩 clicked"
   LOOKS "set size to 50 %"

✅ Press the green flag — kart appears on the track!`,

  `➡️ Turn right!

① Click Kart in the sprite list
② Drag these two blocks to the code area — they snap together:
   EVENTS "when [right arrow] key pressed"
   MOTION "turn ↻ 15 degrees"

✅ Press the right arrow key — kart turns right!`,

  `⬅️ Turn left!

① Still on Kart — drag to a NEW empty spot in the code area (not touching the last stack):
   EVENTS "when [left arrow] key pressed"
   MOTION "turn ↺ 15 degrees"

✅ Press left and right arrows — kart turns both ways!`,

  `🚀 Drive forward + stay on screen!

① Still on Kart — drag to a NEW empty spot:
   EVENTS "when [up arrow] key pressed"
   MOTION "move 10 steps"

② Find your "when 🚩 clicked" stack from Step 1.
   Add at the bottom:
   MOTION "if on edge, bounce"
   Wait — that won't work there. Instead, do this:

③ Drag to yet another NEW empty spot:
   EVENTS "when 🚩 clicked"
   CONTROL "forever"
   Inside the forever: MOTION "if on edge, bounce"

✅ Press ↑ to drive. Kart bounces back instead of disappearing off screen!`,

  `🏆 Make a Laps counter!

① Still on Kart → VARIABLES → "Make a Variable" → type "Laps" → click OK
② Find your "when 🚩 clicked + set size to 50%" stack from Step 1
③ Snap onto the bottom: VARIABLES "set Laps to 0"

✅ A "Laps 0" counter appears on the screen!`,

  `🏁 Draw the finish line!

① In the sprite list, click the sprite icon (face with +) → Paint (the paint brush)
② A blank white canvas opens — use the Rectangle tool to draw a wide stripe across the middle
③ Click the blue "Costume" tab at the top → click the name field that says "costume1" → type "FinishLine" → press Enter

Now add the code:
④ Click Kart in the sprite list → drag to a NEW empty spot:
   EVENTS "when 🚩 clicked"
   CONTROL "forever"

⑤ Inside the forever, add:
   CONTROL "if < > then" ← the block with a pointy gap
   Inside the pointy gap: SENSING "touching [FinishLine v]?"
   Inside the if-then mouth: VARIABLES "change Laps by 1"
   Below that (still inside): CONTROL "wait 1 secs"

✅ Drive over the stripe — the Laps number goes up by 1!`,

  `⏱️ 30-second race!

① Still on Kart → VARIABLES → "Make a Variable" → type "Timer" → OK
② Drag to a NEW empty spot:
   EVENTS "when 🚩 clicked"
   VARIABLES "set Timer to 30"
③ Snap on: CONTROL "repeat until < >"
   Inside the gap: OPERATORS "[ ] < [ ]" → left box: VARIABLES "Timer", right box: type 1
   Inside the repeat: CONTROL "wait 1 secs"
   Inside the repeat: VARIABLES "change Timer by -1"
④ After the repeat (outside it):
   LOOKS "say [ ] for [ ] secs" → type "Time's up! 🏁" → 2 secs
   CONTROL "stop [all v]"

✅ Press the green flag — Timer counts down from 30. How many laps can you get?`,
]

// ── G3-4 challenge steps 8–10 ─────────────────────────────────────────────────
const challengeSteps = [
  `⏱️ Race for 60 seconds!

① Find your timer stack — the one with "set Timer to 30"
② Click the number 30 → change it to 60

✅ Now you have twice as long — go for more laps!`,

  `🏆 Personal Best!

① Still on Kart → VARIABLES → "Make a Variable" → type "PersonalBest" → OK
② Find your timer stack. After the repeat loop ends (outside it, before "stop all"), add:
   CONTROL "if < > then"
   Inside the gap: OPERATORS "[ ] > [ ]" → left: VARIABLES "Laps", right: VARIABLES "PersonalBest"
   Inside the if-then mouth: VARIABLES "set PersonalBest to Laps"
   Below that (still inside): LOOKS "say [ ] for [ ] secs" → type "New Record! 🏆" → 2 secs

✅ If your laps beat your record, the kart says "New Record!"`,

  `🎉 Challenge: Make it harder!

Pick one (or all!) to try:
① Make the kart faster: find "move 10 steps" → change 10 to 15
② Make it harder to turn: find "turn 15 degrees" → change 15 to 10
③ Add a second finish line on the other side of the track — does it count double?

✅ Share your best lap count with the class!`,
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

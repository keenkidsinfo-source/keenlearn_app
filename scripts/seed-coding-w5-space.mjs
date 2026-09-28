/**
 * seed-coding-w5-space.mjs
 * Updates Week 5 coding to Space Shooter (replaces Kart Racer)
 *
 * G1-2 (7 steps): One asteroid, one laser, no cloning — 30-second timer
 * G3-4 (10 steps): Cloned asteroids, cloned bullets, lives, speed boost, Personal Best
 *
 * Run: node scripts/seed-coding-w5-space.mjs
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

// ── G1-2 steps (5) — catch the asteroid, no laser ──────────────────────────
const g12Steps = [
  `🚀 Set up your rocket!

① Right-click the Cat sprite on the stage → Delete
② Click the sprite icon (bottom-right) → Choose a Sprite → search "Rocketship" → click it
③ Click the backdrop icon → Choose a Backdrop → search "Stars" → click it
④ Click Rocketship in the sprite list → drag to the code area:
   EVENTS "when 🚩 clicked"
   MOTION "go to x: 0 y: -130"
   LOOKS "set size to 50 %"

✅ Green flag → rocket at the bottom of a starry sky!`,

  `⬅️➡️ Move left and right!

① Still on Rocketship — drag to a NEW empty spot:
   EVENTS "when [left arrow v] key pressed"
   MOTION "change x by -15"

② Another new empty spot:
   EVENTS "when [right arrow v] key pressed"
   MOTION "change x by 15"

✅ Arrow keys move the rocket — try it!`,

  `⭐ Add a Score counter!

① Still on Rocketship → VARIABLES → "Make a Variable" → type "Score" → OK
② Find your "when 🚩 clicked" stack → snap on at the bottom:
   VARIABLES "set Score to 0"

✅ Score 0 appears in the corner — ready to count catches!`,

  `☄️ Make a falling asteroid!

① Click the sprite icon → Choose a Sprite → search "Rocks" → click it
② Click Rocks in the sprite list → drag to the code area:
   EVENTS "when 🚩 clicked"
   LOOKS "set size to 50 %"
   CONTROL "forever"
③ INSIDE the forever:
   MOTION "go to x: (pick random -180 to 180) y: 180"
   CONTROL "repeat until" → OPERATORS "[ ] < [ ]"
   Drag MOTION "y position" into the LEFT gap → type -150 in the RIGHT gap
   INSIDE the repeat: MOTION "change y by -5"

✅ Green flag → asteroid falls from the top! (it disappears at the bottom — fix that next!)`,

  `🎯 Catch the asteroid — score goes up!

① Still on Rocks — find your forever loop
② INSIDE the repeat (right after "change y by -5"), add:
   CONTROL "if < > then"
   Inside the pointy gap: SENSING "touching [Rocketship v]?"
   Inside the if-then: VARIABLES "change Score by 1"

That's it! When y < -150 OR the rocket catches it, the forever loop restarts
and the asteroid jumps back to the top at a new random x position.

✅ Move your rocket to catch falling asteroids — Score goes up each time!
Can you get 5 in a row? 🚀`,
]

// ── G3-4 steps (10) — advanced, with cloning ────────────────────────────────
const g34Steps = [
  `🚀 Set up your rocket!

① Click the Cat sprite → right-click → Delete
② Click the sprite icon → Choose a Sprite → search "Rocketship" → click it
③ Click the name below the sprite → type "Rocket" → press Enter
④ Click the backdrop icon → Choose a Backdrop → search "Stars" → click it
⑤ Click Rocket → drag to the code area:
   EVENTS "when 🚩 clicked"
   MOTION "go to x: 0 y: -130"
   LOOKS "set size to 50 %"

✅ Green flag → rocket at the bottom of a starry sky!`,

  `⬅️➡️ Move left and right!

① Still on Rocket — drag to a NEW empty spot:
   EVENTS "when [left arrow v] key pressed"
   MOTION "change x by -15"

② Another new empty spot:
   EVENTS "when [right arrow v] key pressed"
   MOTION "change x by 15"

✅ Arrow keys move the rocket!`,

  `🏆 Score and Lives!

① Still on Rocket → VARIABLES → "Make a Variable" → "Score" → OK
② VARIABLES → "Make a Variable" → "Lives" → OK
③ Find your "when 🚩 clicked" stack → snap on the bottom:
   VARIABLES "set Score to 0"
   VARIABLES "set Lives to 3"

✅ Score 0 and Lives 3 appear on screen!`,

  `☄️ Falling asteroids — using clones!

① Click the sprite icon → Choose a Sprite → search "Rocks" → click it
② Rename it "Asteroid"
③ Click Asteroid → drag to code area:
   EVENTS "when 🚩 clicked"
   LOOKS "hide"
   CONTROL "forever"
   Inside the forever:
     CONTROL "create clone of [myself v]"
     CONTROL "wait (pick random 1 to 2) secs"

④ New empty spot:
   CONTROL "when I start as a clone"
   MOTION "go to x: (pick random -200 to 200) y: 180"
   LOOKS "show"
   CONTROL "forever"
   Inside the forever: MOTION "change y by -4"

✅ Green flag → asteroids keep spawning and falling!`,

  `💀 Asteroid hits rocket = lose a life!

① Still on Asteroid — find your "when I start as a clone" script
② Inside the inner forever (after "change y by -4"), add:
   CONTROL "if < > then"
   Inside the gap: SENSING "touching [Rocket v]?"
   Inside the if-then: VARIABLES "change Lives by -1"
   Still inside: CONTROL "delete this clone"

③ Also add (still inside the forever):
   CONTROL "if < > then"
   Inside the gap: OPERATORS "[ ] < [ ]" → MOTION "y position" on left, -180 on right
   Inside the if-then: CONTROL "delete this clone"
   (Deletes clones that fall off screen)

✅ Asteroid hits the rocket → Lives goes down by 1!`,

  `🔫 Shoot laser bullets — using clones!

① Click the sprite icon → Paint → draw a short vertical line → name it "Bullet"
② Click Bullet → drag to code area:
   EVENTS "when 🚩 clicked"
   LOOKS "hide"

③ New empty spot:
   EVENTS "when [space v] key pressed"
   CONTROL "create clone of [myself v]"

④ New empty spot:
   CONTROL "when I start as a clone"
   MOTION "go to [Rocket v]"
   LOOKS "show"
   CONTROL "forever"
   Inside the forever: MOTION "change y by 20"
   Also inside: CONTROL "if < > then"
   Inside the gap: OPERATORS "[ ] > [ ]" → MOTION "y position" on left, 180 on right
   Inside the if-then: CONTROL "delete this clone"

✅ Press Space — a bullet shoots up! Press it fast for rapid fire!`,

  `🎯 Bullet hits asteroid = score!

① Still on Asteroid — find your "when I start as a clone" script
② Inside the inner forever, add another if-then:
   CONTROL "if < > then"
   Inside the gap: SENSING "touching [Bullet v]?"
   Inside the if-then: VARIABLES "change Score by 1"
   Still inside: CONTROL "delete this clone"

③ Click Bullet → find "when I start as a clone" → inside the forever add:
   CONTROL "if < > then"
   Inside the gap: SENSING "touching [Asteroid v]?"
   Inside the if-then: CONTROL "delete this clone"

✅ Bullet hits asteroid → Score goes up, both disappear!`,

  `💥 Game Over when Lives = 0!

① Click Rocket → drag to a NEW empty spot:
   EVENTS "when 🚩 clicked"
   CONTROL "forever"
   Inside the forever:
   CONTROL "if < > then"
   Inside the gap: OPERATORS "[ ] = [ ]" → VARIABLES "Lives" on left, 0 on right
   Inside the if-then: LOOKS "say [Game Over! 💥] for 2 secs"
   Still inside: CONTROL "stop [all v]"

✅ When all 3 lives are gone — Game Over!`,

  `⚡ Speed up over time!

① Click Asteroid → find your "when 🚩 clicked" stack
② Before the "create clone" line, change "wait (pick random 1 to 2) secs" to "wait (pick random 0.5 to 1.5) secs" after 20 seconds

Or add a proper speed boost:
① VARIABLES → "Make a Variable" → "Speed" → OK
② New empty spot on Asteroid:
   EVENTS "when 🚩 clicked"
   VARIABLES "set Speed to 4"
   CONTROL "forever"
   Inside: CONTROL "wait 10 secs"
   Inside: VARIABLES "change Speed by 1"
③ In "when I start as a clone", change "change y by -4" to "change y by (0 - Speed)"
   Use OPERATORS "[ ] - [ ]" → 0 on left, VARIABLES "Speed" on right

✅ Every 10 seconds asteroids fall faster — can you keep up?`,

  `🏆 Personal Best!

① Click Rocket → VARIABLES → "Make a Variable" → "PersonalBest" → OK
② Find your game-over if-then. Before "stop all", add:
   CONTROL "if < > then"
   Inside the gap: OPERATORS "[ ] > [ ]" → VARIABLES "Score" on left, VARIABLES "PersonalBest" on right
   Inside the if-then: VARIABLES "set PersonalBest to Score"
   Still inside: LOOKS "say [New Record! 🏆] for 2 secs"

✅ Beat your top score and the rocket celebrates!`,
]

// ── Find and update G1-2 Week 5 coding content item ─────────────────────────
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

// Update curriculum_days theme (use subquery — PostgreSQL UPDATE...FROM doesn't support JOIN)
await sql`
  UPDATE curriculum_days
  SET theme = 'Space Shooter!'
  WHERE id IN (
    SELECT curriculum_day_id FROM curriculum_content
    WHERE content_item_id = ${g12Item.id}
  )
`

const g12Meta = {
  language: 'scratch',
  challenge: 'Space Catcher!',
  tagline: 'Catch falling asteroids with your rocket — how many can you grab?',
  steps: g12Steps,
}

await sql`
  UPDATE content_items
  SET metadata = ${g12Meta}, title = 'Space Catcher', step_count = ${g12Steps.length}
  WHERE id = ${g12Item.id}
`
console.log(`✅ G1-2 Space Catcher: ${g12Steps.length} steps seeded`)

// ── Find and update G3-4 Week 5 coding content item ─────────────────────────
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

// Update curriculum_days theme
await sql`
  UPDATE curriculum_days
  SET theme = 'Space Shooter!'
  WHERE id IN (
    SELECT curriculum_day_id FROM curriculum_content
    WHERE content_item_id = ${g34Item.id}
  )
`

const g34Meta = {
  language: 'scratch',
  challenge: 'Space Shooter!',
  tagline: 'Dodge, aim, and blast — survive as long as you can and beat your Personal Best!',
  g12StopAfter: g12Steps.length,
  steps: g34Steps,
}

await sql`
  UPDATE content_items
  SET metadata = ${g34Meta}, title = 'Space Shooter', step_count = ${g34Steps.length}
  WHERE id = ${g34Item.id}
`
console.log(`✅ G3-4 Space Shooter: ${g34Steps.length} steps seeded`)

await sql.end()
console.log('\n✅ Done — Space Shooter replaces Kart Racer for Week 5')

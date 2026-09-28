/**
 * seed-coding-w5-space.mjs
 * Updates Week 5 coding to Space Shooter (replaces Kart Racer)
 *
 * G1-2 (5 steps): Rocket, movement, asteroid, bullet, scoring — basic game done
 * G3-4 (10 steps): Same 5 shared steps, then 5 upgrades — Lives, clones, speed ramp, Personal Best
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

// ── G1-2 steps (5) — simple Space Shooter, no clones ───────────────────────
const g12Steps = [
  `🚀 Set up your rocket!

① Right-click the Cat sprite on the stage → Delete
② Click the sprite icon (bottom-right) → Choose a Sprite → search "Rocketship" → click it
③ Click the backdrop icon → Choose a Backdrop → search "Stars" → click it
④ Click Rocketship in the sprite list → drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   MOTION  ▸ "go to x: 0  y: -130"
   LOOKS   ▸ "set size to 50 %"

✅ Green flag → rocket at the bottom of a starry sky!`,

  `⬅️➡️ Move left and right + add Score!

① VARIABLES → "Make a Variable" → type "Score" → OK
   Find the "when 🚩 clicked" stack → snap at the bottom:
   VARIABLES  ▸ "set Score to 0"

② Same stack — snap below "set Score to 0":
   CONTROL ▸ "forever"
   INSIDE the forever, add TWO "if < > then" blocks:

   First if:
     — hexagon: SENSING "key [left arrow] pressed?"
     INSIDE: MOTION ▸ "change x by -15"

   Second if (snap below the first, still inside forever):
     — hexagon: SENSING "key [right arrow] pressed?"
     INSIDE: MOTION ▸ "change x by 15"

✅ Hold left/right arrow — rocket moves smoothly! Score shows 0!
⚠️ This is different from "when key pressed" — SENSING checks every frame!`,

  `☄️ Make a falling asteroid!

① Click the sprite icon → Choose a Sprite → search "Rocks" → click it
② Click Rocks in the sprite list. Drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "set size to 50 %"
   LOOKS   ▸ "show"
   CONTROL ▸ "forever"   ← this is the big mouth block

③ INSIDE the forever mouth, add:
   MOTION  ▸ "go to x: ( ) y: 180"
     — in the x gap, OPERATORS ▸ "pick random -180 to 180"
       (drag it in — don't type a number!)

④ Still INSIDE forever, snap below:
   CONTROL ▸ "repeat until < >"
     — inside the hexagon: OPERATORS ▸ "[ ] < [ ]"
       drag MOTION "y position" into the LEFT box
       type -150 in the RIGHT box
       ⚠️ Use < (less than), not > (greater than)!

⑤ INSIDE the repeat-until mouth:
   MOTION  ▸ "change y by -5"
   ⚠️ That's y — NOT x. y moves the sprite up and down!

✅ Green flag → asteroid spawns at the top and falls to the bottom, then resets!`,

  `🔫 Paint a bullet and fire it!

① Click the PAINT icon (brush, bottom-right near sprite icon)
   Draw a short tall line — that's your bullet
② Click "Sprite1" name → rename it "Bullet" → Enter
③ Click Bullet in the sprite list. Drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "hide"
   (bullet starts invisible every game)

④ NEW empty spot — drag a second stack:
   EVENTS  ▸ "when [space] key pressed"
   MOTION  ▸ "go to [Rocketship]"
   LOOKS   ▸ "show"
   CONTROL ▸ "repeat until < >"
     — inside hexagon: OPERATORS "[ ] > [ ]"
       drag MOTION "y position" into LEFT box → type 170 RIGHT
   INSIDE the repeat mouth:
   MOTION  ▸ "change y by 15"   ← goes UP (positive y = up)

⑤ AFTER the repeat block (snap it BELOW, outside the mouth):
   LOOKS   ▸ "hide"
   ⚠️ The "hide" goes BELOW and OUTSIDE the repeat — not inside!

✅ Press Space → bullet shoots up from the rocket and disappears at the top!`,

  `🎯 Bullet hits asteroid — Score goes up!

① Click Bullet in the sprite list
② Find your "when [space] key pressed" stack
③ INSIDE the repeat-until loop, after "change y by 15", add:
   CONTROL ▸ "if < > then"
     — inside the hexagon: SENSING "touching [ ]?"
       click the dropdown → choose "Rocks"
       ⚠️ Pick "Rocks" — NOT Rocketship or anything else!
   INSIDE the if-then mouth:
     VARIABLES ▸ "change Score by 1"
     LOOKS     ▸ "hide"

✅ Press Space — aim at the asteroid. Each hit adds 1 to Score!
Can you get 5 hits? 🚀`,
]

// ── G3-4 steps — starts with the same 5 steps as G1-2 (taught together),
//   then 5 advanced upgrade steps G3-4 does while G1-2 is finished.
//   g12StopAfter = g12Steps.length marks where G1-2 stops.
const g34Steps = [
  // ── Shared steps 1-5 (identical to g12Steps) ────────────────────────────
  ...g12Steps,

  // ── G3-4 advanced steps 6-10 ────────────────────────────────────────────
  `⬆️ G3-4 UPGRADE: Add Lives + Game Over!

① Click Rocketship in the sprite list
② VARIABLES → "Make a Variable" → type "Lives" → OK
   Find the "when 🚩 clicked" stack → snap at the bottom:
   VARIABLES  ▸ "set Lives to 3"

③ NEW empty spot on Rocketship:
   EVENTS  ▸ "when 🚩 clicked"
   CONTROL ▸ "forever"
   INSIDE the forever:
     CONTROL ▸ "if < > then"
       — hexagon: OPERATORS "[ ] = [ ]"
         drag VARIABLES "Lives" into LEFT → type 0 in RIGHT
     INSIDE the if-then:
       LOOKS  ▸ "say [Game Over! 💥] for 2 secs"
       CONTROL ▸ "stop [all]"

✅ Lives shows 3. Hit 0 → Game Over! (We'll make the asteroid reduce Lives next.)`,

  `☄️ G3-4 UPGRADE: Clone the asteroid for multiple at once!

① Click Rocks in the sprite list
② DELETE all your existing Rocks code (right-click each stack → Delete)
③ Start fresh — drag NEW code to the code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "hide"
   CONTROL ▸ "forever"
   INSIDE the forever:
     CONTROL ▸ "create clone of [myself]"
     CONTROL ▸ "wait (1) secs"
       — replace 1 with OPERATORS "pick random 0.5 to 1.5"

④ NEW empty spot:
   CONTROL ▸ "when I start as a clone"
   MOTION  ▸ "go to x: ( ) y: 180"
     — x gap: OPERATORS "pick random -180 to 180"
   LOOKS   ▸ "show"
   CONTROL ▸ "forever"
   INSIDE the forever:
     MOTION  ▸ "change y by -5"
     CONTROL ▸ "if < > then"
       — hexagon: SENSING "touching [Rocketship]?"
       INSIDE: VARIABLES "change Lives by -1"
       INSIDE: CONTROL "delete this clone"
     CONTROL ▸ "if < > then"
       — hexagon: OPERATORS "y position < -170"
       INSIDE: CONTROL "delete this clone"

✅ Multiple asteroids fall at once — and they reduce Lives on hit!`,

  `🔫 G3-4 UPGRADE: Clone the bullet for rapid fire!

① Click Bullet in the sprite list
② DELETE your existing "when [space] pressed" stack
③ Keep the "when 🚩 clicked → hide" stack — leave that

④ NEW empty spot:
   EVENTS  ▸ "when [space] key pressed"
   CONTROL ▸ "create clone of [myself]"
   (That's it — the clone does all the work!)

⑤ NEW empty spot:
   CONTROL ▸ "when I start as a clone"
   MOTION  ▸ "go to [Rocketship]"
   LOOKS   ▸ "show"
   CONTROL ▸ "forever"
   INSIDE the forever:
     MOTION  ▸ "change y by 20"
     CONTROL ▸ "if < > then"
       — hexagon: SENSING "touching [Rocks]?"
       INSIDE: VARIABLES "change Score by 1"
       INSIDE: CONTROL "delete this clone"
     CONTROL ▸ "if < > then"
       — hexagon: OPERATORS "y position > 175"
       INSIDE: CONTROL "delete this clone"

✅ Press SPACE fast — rapid fire! Each hit scores. Bullets clean up automatically.`,

  `⚡ G3-4 UPGRADE: Speed ramp — gets harder over time!

① Click Rocks in the sprite list
② VARIABLES → "Make a Variable" → "Speed" → OK
   Check "For this sprite only" so each clone has its own speed

③ Find your "when I start as a clone" stack
   Find "change y by -5" → replace -5 with VARIABLES "Speed" (put a "-" before it)
   — Use OPERATORS "[ ] - [ ]" → type 0 in LEFT → VARIABLES "Speed" in RIGHT
   — Or just type: OPERATORS negative 0 minus Speed

Actually the simplest way:
   Replace "change y by -5" with:
   MOTION ▸ "change y by (0 - Speed)"
   — OPERATORS ▸ "[ ] - [ ]", 0 on left, VARIABLES "Speed" on right

④ Find "when I start as a clone" → at the very top (before forever), add:
   VARIABLES ▸ "set Speed to 5"

⑤ NEW empty spot on Rocks:
   EVENTS  ▸ "when 🚩 clicked"
   CONTROL ▸ "forever"
   INSIDE: CONTROL "wait 10 secs"
   INSIDE: VARIABLES "change Speed by 1"

✅ Every 10 seconds asteroids fall 1 pixel faster. How long can you survive?`,

  `🏆 G3-4 UPGRADE: Personal Best tracker!

① VARIABLES → "Make a Variable" → "PersonalBest" → OK

② Click Rocketship → find the forever loop with the Game Over check
   INSIDE the if-then (before "stop all"), add:
   CONTROL ▸ "if < > then"
     — hexagon: OPERATORS "[ ] > [ ]"
       VARIABLES "Score" in LEFT → VARIABLES "PersonalBest" in RIGHT
     INSIDE this new if-then:
       VARIABLES ▸ "set PersonalBest to Score"
       LOOKS     ▸ "say [New Record! 🏆] for 2 secs"

✅ PersonalBest stays on screen between games.
Can you beat your own high score? 🚀`,
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
  challenge: 'Space Shooter!',
  tagline: 'Paint a bullet, press Space to fire, and blast the asteroids!',
  steps: g12Steps,
}

await sql`
  UPDATE content_items
  SET metadata = ${g12Meta}, title = 'Space Shooter', step_count = ${g12Steps.length}
  WHERE id = ${g12Item.id}
`
console.log(`✅ G1-2 Space Shooter: ${g12Steps.length} steps seeded`)

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
  g12StopAfter: g12Steps.length,  // G1-2 finishes after step 5; G3-4 continues with upgrades
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

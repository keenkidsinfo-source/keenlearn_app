/**
 * patch-w5-g34-steps.mjs
 * Re-seeds G3-4 W5 Space Shooter with the corrected step structure:
 *   Steps 1-5: same as G1-2 (taught together in class)
 *   Steps 6-10: G3-4 advanced upgrades (Lives, clones, speed, Personal Best)
 *   g12StopAfter: 5 — banner shows "G1-2 done, G3-4 keep going!" after step 5
 *
 * Run: node scripts/patch-w5-g34-steps.mjs
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

// ── G1-2 shared steps (1-5) ──────────────────────────────────────────────────
const sharedSteps = [
  `🚀 Set up your rocket!

① Right-click the Cat sprite on the stage → Delete
② Click the sprite icon (bottom-right) → Choose a Sprite → search "Rocketship" → click it
③ Click the backdrop icon → Choose a Backdrop → search "Stars" → click it
④ Click Rocketship in the sprite list. Drag to code area:
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

// ── G3-4 advanced upgrade steps (6-10) ───────────────────────────────────────
const advancedSteps = [
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
       — hexagon: OPERATORS "[ ] < [ ]" → "y position" LEFT, -170 RIGHT
       INSIDE: CONTROL "delete this clone"

✅ Multiple asteroids fall at once — and they reduce Lives on hit!`,

  `🔫 G3-4 UPGRADE: Clone the bullet for rapid fire!

① Click Bullet in the sprite list
② DELETE your "when [space] pressed" stack
   Keep the "when 🚩 clicked → hide" stack

③ NEW empty spot:
   EVENTS  ▸ "when [space] key pressed"
   CONTROL ▸ "create clone of [myself]"

④ NEW empty spot:
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
       — hexagon: OPERATORS "[ ] > [ ]" → "y position" LEFT, 175 RIGHT
       INSIDE: CONTROL "delete this clone"

✅ Press SPACE fast — rapid fire! Each hit scores. Bullets clean up automatically.`,

  `⚡ G3-4 UPGRADE: Speed ramp — gets harder over time!

① Click Rocks in the sprite list
② VARIABLES → "Make a Variable" → "Speed" → OK

③ Find your "when I start as a clone" stack
   Find "change y by -5" → replace -5 with:
   OPERATORS ▸ "[ ] - [ ]" → 0 in LEFT, VARIABLES "Speed" in RIGHT
   (This calculates 0 − Speed which gives a negative number)

④ At the top of "when I start as a clone" (before the forever), add:
   VARIABLES ▸ "set Speed to 5"

⑤ NEW empty spot on Rocks:
   EVENTS  ▸ "when 🚩 clicked"
   CONTROL ▸ "forever"
   INSIDE: CONTROL "wait 10 secs"
   INSIDE: VARIABLES "change Speed by 1"

✅ Every 10 seconds asteroids fall faster. How long can you survive?`,

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

const g34Steps = [...sharedSteps, ...advancedSteps]

// ── Update G3-4 W5 content item ───────────────────────────────────────────────
const [item] = await sql`
  SELECT ci.id, ci.metadata
  FROM content_items ci
  INNER JOIN curriculum_content cc ON cc.content_item_id = ci.id
  INNER JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  INNER JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE c.grade_band = 'g3-4'
    AND c.week_number = 5
    AND cd.subject = 'coding'
  LIMIT 1
`

if (!item) {
  console.error('❌ G3-4 W5 coding item not found — run seed-w5.mjs first')
  await sql.end()
  process.exit(1)
}

const meta = typeof item.metadata === 'string'
  ? JSON.parse(item.metadata)
  : (item.metadata ?? {})

meta.steps = g34Steps
meta.g12StopAfter = sharedSteps.length   // banner after step 5
meta.noStarterFallback = true            // don't load Harry Potter as starter

await sql`
  UPDATE content_items
  SET metadata = ${JSON.stringify(meta)}, step_count = ${g34Steps.length}
  WHERE id = ${item.id}
`

console.log(`✅ G3-4 W5 updated: ${g34Steps.length} steps (${sharedSteps.length} shared + ${advancedSteps.length} advanced), g12StopAfter=${sharedSteps.length}`)
await sql.end()

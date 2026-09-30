/**
 * patch-coding-w6.mjs
 * Seeds Week 6 coding — Kart Smash! (SmashKarts-inspired arena battle)
 *
 * New model:
 *   steps     → teacher-only, projected on screen, walk class through together
 *   challenges → student-facing, unlocked one at a time by teacher tap
 *
 * Base game (5 steps, same for G1-2 and G3-4):
 *   1. Kart + arena setup
 *   2. Steer and drive (rotation movement)
 *   3. Enemy kart that bounces around
 *   4. Fire a cannonball
 *   5. Hit detection + Score
 *
 * Challenges (5, teacher-unlocks per student):
 *   C1. Lives — enemy hits you = lose a life, game over at 0
 *   C2. Clone enemies — 3 enemy karts at once
 *   C3. Chaser — a second enemy that hunts you down
 *   C4. Turbo boost — down arrow = speed burst
 *   C5. 2-player mode — WASD vs arrows, first to 5 wins
 *
 * Run: node scripts/patch-coding-w6.mjs
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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

// ── Base steps (teacher-projected, NOT shown to students) ─────────────────────
const steps = [
  `🏎️ Step 1 — Set up your kart + arena!

① Right-click the Cat sprite → Delete
② Click the backdrop icon → Choose a Backdrop → pick "Colorful City" or "Wall 1"
   (anything that looks like an arena or road)
③ Click the sprite icon → Choose a Sprite → search "Convertible" → click it
   Rename it "Kart" (right-click → Rename)
④ Click Kart → drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "set size to 40 %"
   MOTION  ▸ "go to x: 0  y: 0"
   MOTION  ▸ "point in direction 90"

✅ Green flag → kart appears in the center facing right!`,

  `🕹️ Step 2 — Steer and drive!

① Click Kart → find your "when 🚩 clicked" stack → snap at the bottom:
   CONTROL ▸ "forever"

② INSIDE the forever, add THREE "if < > then" blocks:

   First if:
     — hexagon: SENSING "key [left arrow] pressed?"
     INSIDE: MOTION ▸ "turn ↺ 10 degrees"

   Second if (snap below first, still inside forever):
     — hexagon: SENSING "key [right arrow] pressed?"
     INSIDE: MOTION ▸ "turn ↻ 10 degrees"

   Third if (snap below second):
     — hexagon: SENSING "key [up arrow] pressed?"
     INSIDE: MOTION ▸ "move 5 steps"

③ Still inside forever, snap below all three ifs:
   MOTION ▸ "if on edge, bounce"
   ⚠️ This stops the kart flying off the screen!

✅ Green flag → left/right arrows TURN the kart, up arrow DRIVES it forward!
⭐ This is real rotation movement — the kart steers like a real car!`,

  `🚙 Step 3 — Add a bouncing enemy kart!

① Click the sprite icon → Choose a Sprite → search "Convertible" again → click it
   Rename it "Enemy" (right-click → Rename)
② Go to Costumes tab → change the color so it looks different from your kart
   (paint bucket tool → pick a different color)

③ Click Enemy → drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "set size to 40 %"
   MOTION  ▸ "go to x: (pick random -150 to 150)  y: (pick random -100 to 100)"
     — use OPERATORS ▸ "pick random" for both x and y
   MOTION  ▸ "point in direction (pick random 1 to 360)"
     — use OPERATORS ▸ "pick random 1 to 360" in the direction slot
   CONTROL ▸ "forever"
   INSIDE the forever:
     MOTION ▸ "move 3 steps"
     MOTION ▸ "if on edge, bounce"

✅ Green flag → enemy kart bounces around the arena!
⚠️ It doesn't do anything yet — that's Step 5!`,

  `💣 Step 4 — Fire a cannonball!

① Click the PAINT icon (brush, bottom-right) → draw a small filled circle
   → rename it "Ball"
② Click Ball → drag to code area:
   EVENTS ▸ "when 🚩 clicked"
   LOOKS  ▸ "hide"

③ NEW empty spot — second stack:
   EVENTS ▸ "when [space] key pressed"
   MOTION ▸ "go to [Kart]"
     — click the dropdown → choose "Kart"
   MOTION ▸ "point in direction (direction of Kart)"
     — MOTION ▸ "direction" block from Kart: right-click "Kart" → drag its direction reporter
     — OR: use MOTION ▸ "direction" reporter (shows Kart's current angle)
   LOOKS  ▸ "show"
   CONTROL ▸ "repeat until < >"
     — hexagon: SENSING "touching [edge]?"
   INSIDE the repeat:
     MOTION ▸ "move 10 steps"
   AFTER the repeat (outside, below):
   LOOKS  ▸ "hide"

✅ Press Space → cannonball fires in whatever direction the kart is facing!`,

  `🎯 Step 5 — Hit the enemy + Score!

① VARIABLES → "Make a Variable" → "Score" → OK
② Click Kart → find the "when 🚩 clicked" stack → snap at very top:
   VARIABLES ▸ "set Score to 0"

③ Click Ball → find "when [space] pressed" stack
   INSIDE the repeat loop, after "move 10 steps", add:
   CONTROL ▸ "if < > then"
     — hexagon: SENSING "touching [Enemy]?"
     INSIDE the if:
       VARIABLES ▸ "change Score by 1"
       LOOKS     ▸ "hide"
       ⚠️ The hide stops the ball after it hits!

✅ Drive, aim, press Space — hit the enemy kart to score!
🎮 You built a working arena game! Can you get 10 hits?`,
]

// ── Challenges (student-facing, unlocked one at a time by teacher) ─────────────
const challenges = [
  {
    id: 'c1-lives',
    title: '❤️ Challenge 1 — Lives',
    hint: 'Make the enemy dangerous! If it touches your kart, you lose a life. Reach 0 lives → Game Over.',
    blocks: [
      'VARIABLES → "Make a Variable" → "Lives" → OK',
      'Click Kart → "when 🚩 clicked" → set Lives to 3',
      'Click Enemy → inside its forever loop, add:',
      '  if <touching [Kart]?> → change Lives by -1 → go to random x/y position',
      'Click Kart → NEW stack:',
      '  "when 🚩 clicked" → forever → if <Lives = 0> → say "Game Over! 💥" 2 secs → stop all',
    ],
  },
  {
    id: 'c2-clones',
    title: '👾 Challenge 2 — Clone Enemies',
    hint: 'One enemy is too easy! Use clones to fill the arena with enemy karts.',
    blocks: [
      'Click Enemy → DELETE all existing Enemy code',
      'NEW stack: "when 🚩 clicked" → hide → create clone of [myself] → create clone of [myself] → create clone of [myself]',
      'NEW stack: "when I start as a clone" → go to random x/y → point random direction → show → forever:',
      '  move 3 steps → if on edge, bounce',
      '  if <touching [Kart]?> → change Lives by -1 → go to random x/y position',
      'Also update Ball: inside its repeat, change "touching [Enemy]?" to still work with clones ✓',
    ],
  },
  {
    id: 'c3-chaser',
    title: '😈 Challenge 3 — Chaser Enemy',
    hint: 'Add a SECOND enemy that hunts you down — it always points toward your kart and chases!',
    blocks: [
      'Add a new sprite → search "Bat" or "Ghost" → rename it "Chaser"',
      'set size to 40% → go to x: -150 y: 150 (corner of arena)',
      '"when 🚩 clicked" → forever:',
      '  point toward [Kart]',
      '  move 2 steps',
      '  if <touching [Kart]?> → change Lives by -1 → go to x: -150 y: 150',
      'Also update Ball: add "if touching [Chaser]? → change Score by 2 → go to x:-150 y:150" (worth more points!)',
    ],
  },
  {
    id: 'c4-turbo',
    title: '⚡ Challenge 4 — Turbo Boost',
    hint: 'Press DOWN ARROW for a speed burst — but turbo only lasts 1 second!',
    blocks: [
      'Click Kart → inside the forever loop, add a FOURTH if block:',
      '  if <key [down arrow] pressed?>:',
      '    move 15 steps  ← faster than normal!',
      '    wait 0.1 secs',
      'OPTIONAL: Add a "Turbo!" speech bubble so kids know it fired:',
      '  say [⚡ Turbo!] for 0.5 secs  (inside the if, before move)',
    ],
  },
  {
    id: 'c5-twoplayer',
    title: '🎮 Challenge 5 — 2-Player Mode',
    hint: 'Add a second kart controlled by WASD keys. First player to 5 hits wins!',
    blocks: [
      'Add another Convertible sprite → rename "Kart2" → paint it a different color',
      '"when 🚩 clicked" → set size 40% → go to x: 100 y: 0 → point direction 270',
      'Forever loop:',
      '  if <key [a] pressed?> → turn ↺ 10',
      '  if <key [d] pressed?> → turn ↻ 10',
      '  if <key [w] pressed?> → move 5 steps',
      '  if on edge, bounce',
      'VARIABLES → "Score2" → set to 0 on green flag',
      'Paint a second ball → "Ball2" → fire with [f] key → pointing toward [Kart2]',
      'Ball2 hit detection: if touching [Enemy] or [Chaser] → change Score2 by 1',
      'Win condition on Kart: if Score = 5 → say "Player 1 Wins! 🏆" → stop all',
      'Win condition on Kart2: if Score2 = 5 → say "Player 2 Wins! 🏆" → stop all',
    ],
  },
]

// ── Metadata ──────────────────────────────────────────────────────────────────
const meta = {
  language: 'scratch',
  challenge: 'Kart Smash!',
  tagline: 'Drive, aim, and blast — build your own arena battle game!',
  teacherOnly: true,       // steps are hidden from students in new UI
  steps,
  challenges,
  step_count: steps.length,
}

// ── Update both G1-2 and G3-4 W6 coding content items ────────────────────────
for (const gradeBand of ['g1-2', 'g3-4']) {
  const [item] = await sql`
    SELECT ci.id, ci.title
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd    ON cd.id = cc.curriculum_day_id
    JOIN curriculum c          ON c.id  = cd.curriculum_id
    WHERE ci.subject    = 'coding'
      AND ci.grade_band = ${gradeBand}
      AND c.week_number = 6
      AND c.grade_band  = ${gradeBand}
    LIMIT 1
  `

  if (!item) {
    console.warn(`⚠️  Not found: ${gradeBand} W6 coding — has seed-w6.mjs been run?`)
    continue
  }

  await sql`
    UPDATE content_items
    SET title      = 'Kart Smash!',
        step_count = ${steps.length},
        metadata   = ${meta}
    WHERE id = ${item.id}
  `

  // Update curriculum_days theme
  await sql`
    UPDATE curriculum_days
    SET theme = 'Kart Smash!'
    WHERE id IN (
      SELECT curriculum_day_id FROM curriculum_content
      WHERE content_item_id = ${item.id}
    )
  `

  console.log(`✅ ${gradeBand} W6: "Kart Smash!" — ${steps.length} steps + ${challenges.length} challenges`)
}

await sql.end()
console.log('\n✅ Done — Kart Smash! seeded for W6 (both grades, same game).')

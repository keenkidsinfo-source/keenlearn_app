/**
 * seed-coding-w1-w2-rewrite.mjs
 * Rewrites W1 and W2 coding steps for G1-2 and G3-4.
 *
 * Changes:
 *  - G1-2 W1: tighten to ①②③ format, add ✅ checkpoints
 *  - G1-2 W2: same format pass
 *  - G3-4 W1: cut from 15 → 8 steps, use ①②③ format
 *  - G3-4 W2: reformat \n1.\n2. to ①②③ (no content change)
 *
 * Run: node scripts/seed-coding-w1-w2-rewrite.mjs
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

// ── G1-2 Week 1: Welcome to Scratch! ──────────────────────────────────────────
const g12W1Steps = [
  `🐱 Welcome to Scratch!
The orange cat is a SPRITE — a character you can move.
The white area is the STAGE — where everything happens.`,

  `🟡 Find "Events" (yellow) on the left panel.
① Drag "when 🚩 clicked" into the middle (the code area).`,

  `🔵 Find "Motion" (blue) on the left panel.
① Drag "move 10 steps"
② Snap it UNDER the flag block — they click together!

✅ You have your first code!`,

  `🚩 Click the GREEN FLAG above the stage.
Did the cat move? Click it again — it moves again!
Each click = one move.`,

  `🔢 See the number "10" inside your move block?
① Click the number "10"
② Type "50" → press Enter
③ Click the green flag — bigger number = bigger move!`,

  `🐾 Pick YOUR OWN sprite!
① Click the cat face icon (bottom-right corner)
② Click "Choose a Sprite"
③ Pick any animal or character → click it`,

  `🖼️ Pick a backdrop!
① Click the picture icon (very bottom-right corner)
② Click "Choose a Backdrop"
③ Pick any scene → click it

✅ Done — show your teacher! 🎉`,
]

// ── G1-2 Week 2: Make it move! ────────────────────────────────────────────────
const g12W2Steps = [
  `🚩 Click the green flag — your sprite moves! Good.
Today we learn LOOPS. A loop does the same thing over and over and over...`,

  `🔁 Add a REPEAT loop!
① Click "Control" (orange) on the left
② Drag "repeat 10" into your code
③ Wrap it AROUND your move block
④ Click the green flag — moves 10 times!

✅ That's a loop!`,

  `↩️ Make it bounce back!
① Click "Motion" (blue)
② Drag "if on edge, bounce"
③ Drop it INSIDE the repeat, after the move block
④ Click the green flag

✅ Walks back and forth — stays on screen!`,

  `💃 CHALLENGE: Make it dance!
Try ONE of these INSIDE your repeat:
• Motion → "turn 15 degrees" → spins while walking!
• Sounds → "play sound" → adds music!

Make it your own! 🕺`,
]

// ── G3-4 Week 1: Moving Car ───────────────────────────────────────────────────
const g34W1Steps = [
  `🚗 Set up your car!
① Right-click the cat sprite on the stage → Delete
② Click the sprite icon (bottom-right) → search "Car" → click to add
③ Click the backdrop icon → choose "Blue Sky" or any road scene
④ Below the stage, find "Size" → type 80 → Enter

✅ You have a car on a road!`,

  `⬅️➡️ Drive LEFT and RIGHT!
Each direction needs its OWN separate stack of blocks.

① Events (yellow) → "when [right arrow] key pressed"
   Motion (blue) → "change x by 10" → snap under it
② NEW empty spot → "when [left arrow] key pressed"
   Motion → "change x by -10" → snap under it

✅ Press arrow keys — car slides left and right!`,

  `⬆️⬇️ Drive UP and DOWN!
① NEW spot → "when [up arrow] key pressed"
   Motion → "change y by 10"
② NEW spot → "when [down arrow] key pressed"
   Motion → "change y by -10"

You should have 4 separate stacks in your code area!

✅ All 4 arrow keys move the car!`,

  `⚡ Make it faster!
① Click the number "10" in each of your 4 motion blocks
② Change each one to "15"
③ Click the green flag — ZOOM! 🏎️

Try different numbers. What speed feels best?`,

  `🛣️ Paint a road onto the backdrop!
① Click "Stage" (bottom-right of sprite panel)
② Click the Backdrops tab at the top
③ Click your backdrop → it opens in the paint editor
④ Rectangle tool → grey colour → draw a strip across the middle
⑤ Line tool → white → add dashes down the centre`,

  `🧱 Add an obstacle!
① Click the Paint icon (near the sprite area) — this makes a NEW sprite
② Fill colour → pick RED
③ Rectangle tool → draw a filled rectangle in the centre canvas
④ Drag the red block onto your road on the stage`,

  `🚦 Make the obstacle STOP your car!
① Click your CAR sprite
② Events → "when 🚩 clicked" → Control → "forever"
③ INSIDE the forever: Control → "if...then"
④ In the if gap: Sensing → "touching [your red obstacle]?"
⑤ INSIDE the if: Motion → "change x by -20"

✅ Drive into the obstacle — car bounces back!`,

  `⭐ CHALLENGE!
Can you add 2 more obstacles and weave between them without touching any?
Or try Variables → "Make a Variable" → name it "Distance" → add "change Distance by 1" inside your right-arrow stack.
Watch your score go up as you drive! 🏆`,
]

// ── G3-4 Week 2: Make it Dance! ──────────────────────────────────────────────
const g34W2Steps = [
  `👀 Test your car from last week!
① Click the green flag
② Press the arrow keys — car should still drive!

Today we ADD a dancer and learn LOOPS.`,

  `🐾 Add a dancer!
① Click the sprite icon (bottom-right)
② Search "Dinosaur", "Penguin", or "Ballerina"
③ Click to add it

✅ You now have the car AND the dancer on stage!`,

  `♾️ Make the dancer walk with a FOREVER loop!
① Click your DANCER sprite (not the car!)
② Events → "when 🚩 clicked"
③ Control (orange) → "forever" → snap under the flag
④ Motion (blue) → "move 10 steps" → drop INSIDE the forever

✅ Click the flag — dancer walks non-stop!`,

  `↩️ Add bounce + fix flipping!
① Motion → "if on edge, bounce" → INSIDE forever, below move
② Click the flag — walks back and forth!

If it flips upside down: below the stage find "Direction"
→ click the ↔ icon (left-right only)`,

  `🌀 Add spinning!
① Motion → "turn 15 degrees" → INSIDE forever, below bounce
② Click the flag — walks AND spins!
③ Try changing 15 — bigger = faster spin`,

  `⏳ REPEAT vs FOREVER — spot the difference!
① Right-click the "forever" block → Delete (blocks float loose — OK!)
② Control → "repeat 10" → snap under "when 🚩 clicked"
③ Drag the loose move, bounce, turn blocks INSIDE repeat 10
④ Click the flag — moves 10 times then STOPS!

Forever = runs until you stop it.
Repeat = runs a set number of times, then stops.`,

  `🔊 Add sound + costume animation!
① Dancer selected → Sounds tab → speaker icon → search "Dance" → add it
② Back to Code tab — switch back to forever
③ Sound → "play sound [Dance] until done" → INSIDE forever, ABOVE move
④ Looks (purple) → "next costume" → INSIDE forever, AFTER move
⑤ Control → "wait 0.2 secs" → after next costume

✅ Click flag — music, movement, and pose changes!`,

  `🏆 CHALLENGE: Two things at once!
① Click the green flag — dancer bounces and animates
② NOW press the arrow keys — your car drives at the same time!

That's PARALLEL CODE — two sprites running at once!
Can you add a second dancer with a different spin speed? 🕺`,
]

// ── Update helper ─────────────────────────────────────────────────────────────
async function updateSteps(gradeBand, weekNumber, steps) {
  const [item] = await sql`
    SELECT ci.id, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'coding'
      AND ci.grade_band = ${gradeBand}
      AND c.week_number = ${weekNumber}
    LIMIT 1
  `
  if (!item) {
    console.error(`❌ Not found: ${gradeBand} W${weekNumber}`)
    return
  }
  const meta = { ...item.metadata, steps, step_count: steps.length }
  await sql`
    UPDATE content_items
    SET metadata = ${meta}, step_count = ${steps.length}
    WHERE id = ${item.id}
  `
  console.log(`✅ ${gradeBand} W${weekNumber}: ${steps.length} steps updated`)
}

await updateSteps('g1-2', 1, g12W1Steps)
await updateSteps('g1-2', 2, g12W2Steps)
await updateSteps('g3-4', 1, g34W1Steps)
await updateSteps('g3-4', 2, g34W2Steps)

await sql.end()
console.log('\nDone — run node scripts/seed-coding-w1-w2-rewrite.mjs to apply.')

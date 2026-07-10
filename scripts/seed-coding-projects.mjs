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

const projects = [
  // ── G1-2 Week 1: Zipline Zoo ────────────────────────────────────────────────
  // Goal: animal slides across the screen when Space is pressed
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Zipline Zoo',
      tagline: 'Make an animal ride a zipline across the screen!',
      steps: [
        '🖼️ Pick a background — click the picture in the bottom-right corner and choose a forest or mountain',
        '🦁 Add your animal — click "Choose a Sprite" (the cat face icon) and pick any animal you like',
        '📍 Put your animal on the LEFT side of the screen — drag it there with your mouse',
        '💻 Go to the Code tab (top left) → click Motion (blue) → drag "glide 1 secs to x: y:" onto your animal',
        '🏁 Press the green flag and then press SPACE — does your animal move? Ask your teacher if you need help with the numbers!',
        '🎵 Add a sound! Go to Sound tab → click "Choose a Sound" → pick something fun for when the animal arrives',
        '⭐ Bonus: Can you add a second animal that goes the other way?',
      ],
    },
  },

  // ── G1-2 Week 2: Balance Scale ──────────────────────────────────────────────
  // Goal: two objects, student picks which is heavier
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: "Balance Scale",
      tagline: 'Which object is heavier? Build a guessing game!',
      steps: [
        '🖼️ Pick a plain background — try the white one or draw your own balance scale',
        '🪨 Add two sprites — pick something heavy (rock, truck) and something light (feather, balloon)',
        '💬 Click on the heavy sprite → go to Code → drag "when this sprite clicked" → add "say Correct! ⭐ for 2 secs"',
        '💬 Click on the light sprite → go to Code → drag "when this sprite clicked" → add "say Oops! Try again! for 2 secs"',
        '🏁 Press the green flag and click each object — does the right one say correct?',
        '⭐ Bonus: Add a score! Go to Variables → "Make a Variable" called Score → add 1 when the correct one is clicked',
      ],
    },
  },

  // ── G3-4 Week 1: Rescue Mission ─────────────────────────────────────────────
  // Goal: move a hook with arrow keys, rescue people, timer countdown
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Rescue Mission',
      tagline: 'Control a crane hook and rescue as many people as you can!',
      steps: [
        '🏙️ Choose a city or rooftop backdrop from the Scratch library (bottom-right corner)',
        '🪝 Add a hook sprite — click "Paint" and draw a simple hook shape, or use any sprite you like',
        '⬆️ Code arrow key movement: Code tab → Events → "when [up arrow] key pressed" → Motion → "change y by 10". Do the same for down (-10), left (-10), right (+10)',
        '🧑 Add a Person sprite — go to Variables → "Make a Variable" called Score. Code: "when this sprite clicked → change Score by 1 → go to random position"',
        '⏱️ Add a timer: Variables → "Make a Variable" called Timer. Set it to 30. Use a "forever" loop → "wait 1 second" → "change Timer by -1" → "if Timer = 0 → stop all"',
        '🏁 Press the green flag and use arrow keys to move your hook. Can you rescue 5 people in 30 seconds?',
        '⭐ Bonus: Make the person only score when the HOOK touches them (use "touching [hook]?" in the person\'s code)',
      ],
    },
  },

  // ── G3-4 Week 2: Catapult Launch ────────────────────────────────────────────
  // Goal: launch a ball, hit targets, different distances
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Catapult Launch',
      tagline: 'Launch a ball and hit the targets — fulcrum position matters!',
      steps: [
        '🖼️ Pick a plain outdoor backdrop (like the blue sky or grass)',
        '⚾ Add a Ball sprite — you can find one in the library or draw a circle',
        '🎯 Add 3 Target sprites at different spots on the right side of the screen — make them different colours',
        '🚀 Code the ball: "when [space] key pressed" → "glide 0.5 secs to [Target 1 position]" — this is your launch!',
        '✅ Code each target: "when this sprite clicked" → "say Hit! for 1 sec" → "change Score by 1" (make a Score variable first)',
        '🔄 After launching, move the ball back to the start: add "wait 1 sec" → "go to x: -150 y: -50" after the glide block',
        '🏁 Press green flag and SPACE to launch. Does the ball reach the targets?',
        '⭐ Bonus: Use the LEFT and RIGHT arrow keys to move the ball\'s starting position — further back = more force!',
      ],
    },
  },
]

async function run() {
  for (const p of projects) {
    // Find the coding content item for this grade band and week
    const [item] = await sql`
      SELECT ci.id, ci.title, ci.metadata
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'coding'
        AND ci.grade_band = ${p.gradeBand}
        AND c.week_number = ${p.weekNumber}
        AND c.grade_band = ${p.gradeBand}
      LIMIT 1
    `
    if (!item) {
      console.warn(`⚠ No coding item found for ${p.gradeBand} week ${p.weekNumber}`)
      continue
    }
    await sql`UPDATE content_items SET title = ${p.metadata.challenge}, metadata = ${p.metadata} WHERE id = ${item.id}`
    console.log(`✓ Updated: ${p.gradeBand} Week ${p.weekNumber} — "${p.metadata.challenge}" (was: ${item.title})`)
  }

  await sql.end()
  console.log('\nDone! Coding projects updated.')
}

run().catch(e => { console.error(e); process.exit(1) })

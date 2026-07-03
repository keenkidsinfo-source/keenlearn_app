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
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Zipline Zoo',
      tagline: 'Rescue animals from the mountain using a zipline!',
      steps: [
        'Pick a mountain or forest backdrop from the Scratch library',
        'Choose an animal sprite — any animal you like!',
        'Add this code: when 🏁 clicked → go to x: -180 y: 120 (top left)',
        'Add this code: when SPACE pressed → glide 1 secs to x: 180 y: -100 (bottom right)',
        'Create a variable called Rescued — add 1 to it each time the animal reaches the bottom',
        'Add a fun sound when the animal arrives safely',
        '⭐ Challenge: Add a second animal that slides down after the first one!',
      ],
    },
  },
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: "Who's Heavier?",
      tagline: 'Guess which mystery object is heavier before the scale tips!',
      steps: [
        'Pick a plain backdrop — draw a big balance scale shape on it, or use a white background',
        'Add two mystery object sprites on opposite sides (try: a rock and a feather!)',
        'Add two button sprites: one saying LEFT HEAVIER, one saying RIGHT HEAVIER',
        'Code the LEFT button: when clicked → if the left object IS heavier → say "You got it! ⭐" else say "Oops! Try again!"',
        'Add a Score variable — increase by 1 when the answer is correct',
        'Make the scale sprite tilt left or right to reveal the answer after the button is clicked',
        '⭐ Challenge: Make a new mystery pair of objects appear after each correct answer!',
      ],
    },
  },
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Rescue Mission',
      tagline: 'Control a crane to rescue people before time runs out!',
      steps: [
        'Choose a city backdrop from the Scratch library',
        'Draw a crane hook sprite — a simple rectangle with a hook shape works great',
        'Code the hook: UP arrow → change y by 10, DOWN → change y by -10, LEFT → change x by -10, RIGHT → change x by 10',
        'Add a person sprite that appears at a random position on the screen',
        'Code: when hook touches person → play a cheer sound + add 1 to Score + move person to a new random spot',
        'Add a Timer variable starting at 30 — count it down every second using a forever loop',
        'When Timer hits 0 → stop all and show "You rescued [Score] people!"',
        '⭐ Challenge: Make the hook move faster as your score gets higher!',
      ],
    },
  },
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Catapult Launch',
      tagline: 'Adjust your fulcrum and launch a projectile to hit the targets!',
      steps: [
        'Draw a catapult arm sprite — a long thin rectangle',
        'Draw a triangle fulcrum sprite and place it near the center of the arm',
        'Add a ball sprite sitting on the left end of the catapult',
        'Code: LEFT arrow → move fulcrum 10 steps left. RIGHT arrow → move fulcrum 10 steps right',
        'Code: SPACE bar → launch! The ball glides to x: (fulcrum x + 200) y: 50 — the further the fulcrum from the ball, the farther it flies',
        'Add 3 target sprites at different distances — when ball touches a target → add points to Score',
        'Reset the ball to the catapult after each launch',
        '⭐ Challenge: Add 3 rounds with targets getting further away each time!',
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
    await sql`UPDATE content_items SET metadata = ${p.metadata} WHERE id = ${item.id}`
    console.log(`✓ Updated: ${p.gradeBand} Week ${p.weekNumber} — "${p.metadata.challenge}" (${item.title})`)
  }

  await sql.end()
  console.log('\nDone! Coding projects updated.')
}

run().catch(e => { console.error(e); process.exit(1) })

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
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Zipline Zoo',
      tagline: 'Make an animal ride a zipline across the screen!',
      steps: [
        '🗑️ Right-click the sprite in the bottom-right corner and press Delete to start fresh',
        '🖼️ Pick a forest or mountain background — click the backdrop picture (bottom-right corner)',
        '🎨 Draw the zipline! Click the backdrop picture → pencil/paint icon → Line tool → make the brush THICK → draw a diagonal line from the TOP-LEFT to the BOTTOM-RIGHT corner',
        '🦁 Add your animal — click the cat face icon at the bottom and pick any animal you love',
        '📍 Drag your animal to the TOP-LEFT end of the zipline',
        '🟡 Click your animal → "Code" at the top → "Events" (yellow) on the left → drag "when 🚩 clicked" into the empty middle area',
        '🔵 Click "Motion" (blue) on the left → find "glide 2 secs to x: y:" → snap it UNDER your flag block → type 200 in x and -120 in y',
        '🏁 Click the green flag — does your animal zip down? If not, ask your teacher!',
        '🔄 Make it go back up! Add another "glide 2 secs to x: y:" block below — type -200 in x and 120 in y so it bounces back',
        '💬 Make your animal say something! Click "Looks" (purple) → drag "say [Wheee!] for 2 secs" → snap it BEFORE the glide block',
        '🎵 Click "Sounds" at the top → "Choose a Sound" → pick "Zap" or "Whoosh" → drag "play sound" into your code after the say block',
        '🐦 Add a second animal! Pick a new sprite, place it higher up on the zipline, give it the same glide code but try x: 200 y: -80',
        '🎨 Make it yours — click your backdrop → paint icon → use the Text tool to write your name on the backdrop, or add trees and clouds with the brush',
        '🔁 Change the speed! Find the "2" in your glide block and try typing "1" — now it goes FAST! Try "3" for slow motion',
        '⭐ Challenge: Can you add a third animal AND make each one a different speed? Show your class when you\'re done!',
      ],
    },
  },

  // ── G1-2 Week 2: Balance Scale ──────────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Balance Scale',
      tagline: 'Which object is heavier? Build a guessing game!',
      steps: [
        '🗑️ Right-click the sprite in the bottom-right corner and press Delete to start fresh',
        '🎨 Draw a balance scale — click the backdrop picture → pencil icon → Line tool → draw a triangle in the middle, a flat bar across the top, and two strings hanging down on each side',
        '🪨 Add a HEAVY object — cat face icon → search "rock" or "apple" → place it on the LEFT side of your scale',
        '🪶 Add a LIGHT object — cat face icon → search "feather" or "balloon" → place it on the RIGHT side',
        '💻 Click the HEAVY sprite → Code → Events: "when this sprite clicked" → Looks: "say [You got it! ⭐] for 2 secs"',
        '💻 Click the LIGHT sprite → Code → Events: "when this sprite clicked" → Looks: "say [Oops! The other one is heavier! Try again!] for 2 secs"',
        '🏁 Test it — click each object. Does the right one say correct?',
        '📉 Make the heavy side TIP DOWN! Click the heavy sprite → Looks → add "change y by -30" after the say block → then "change y by 30" to reset it',
        '🎵 Add a cheer sound for the correct answer — Sounds tab → "Choose a Sound" → pick "Cheer" or "Tada" → drag "play sound" into the heavy sprite\'s code',
        '➕ Add a THIRD object! Pick something medium like "bread" — make it say "Close! But not the heaviest!" when clicked',
        '🎨 Colour your balance scale — click the backdrop → paint icon → use the Fill tool to add colour to your drawing',
        '🔢 Add a score! Variables → "Make a Variable" → call it Score → in the heavy sprite\'s code, add "change Score by 1" after the say block',
        '🎨 Make it yours — change the backdrop colour, make your objects bigger, or swap in your own favourite heavy and light things',
        '⭐ Challenge: Can you make a 4-object quiz where only ONE is the heaviest? Show a friend and see if they can guess!',
      ],
    },
  },

  // ── G3-4 Week 1: Rescue Mission ─────────────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Rescue Mission',
      tagline: 'Control a crane hook and rescue as many people as you can!',
      steps: [
        '🗑️ Right-click the sprite in the bottom-right corner and press Delete to start fresh',
        '🏙️ Choose a city or rooftop backdrop from the library (bottom-right corner)',
        '🪝 Add a hook — click "Paint" and draw a J-shape, or pick any sprite to be your hook',
        '⬆️ Code arrow keys: Code → Events → "when [up arrow] key pressed" → Motion → "change y by 10". Repeat for down (-10), left (-10), right (+10)',
        '🧑 Add a Person sprite → Variables → "Make a Variable" called Score → Code on person: "when this sprite clicked → change Score by 1 → go to random position"',
        '⏱️ Add a timer: Variables → "Make a Variable" called Timer → on your hook: "when 🚩 clicked → set Timer to 30 → forever → wait 1 sec → change Timer by -1 → if Timer = 0 → stop all"',
        '🏁 Test it — use arrow keys to move the hook, click people to rescue them. Can you get 5 in 30 seconds?',
        '🔊 Add a rescue sound! Click the person sprite → Sounds → "Choose a Sound" → pick "Cheer" → add "play sound Cheer" when clicked',
        '📢 Add a Game Over message! When the timer hits 0, make the hook "say [Game Over! Score: ] for 5 secs" using a "join" block from Operators',
        '🧑‍🤝‍🧑 Add a SECOND person at a different spot on the screen — give it the same code, different starting position',
        '🚧 Add an obstacle! Paint a red box sprite → if the hook touches it: "change Score by -1" (touching block is in Sensing)',
        '🏃 Make it harder — change the "10" in your arrow key blocks to "15" for faster movement, or add a second timer that counts down faster each round',
        '🎨 Make it yours — change the backdrop, rename your variables, or turn it into a fishing game (fish instead of people, water backdrop)',
        '⭐ Challenge: Add a HIGH SCORE that saves the best score across games using another variable. Show your class!',
      ],
    },
  },

  // ── G3-4 Week 2: Catapult Launch ────────────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Catapult Launch',
      tagline: 'Launch a ball and hit the targets — fulcrum position matters!',
      steps: [
        '🗑️ Right-click the sprite in the bottom-right corner and press Delete to start fresh',
        '🖼️ Pick an outdoor backdrop — blue sky or grass works great',
        '⚾ Add a Ball sprite from the library, or paint a circle',
        '🎯 Add 3 Target sprites on the RIGHT side at different heights — make them different colours so you can tell them apart',
        '🚀 Code the ball: "when [space] key pressed" → Motion → "glide 0.5 secs to x: 150 y: 50" (aim for your first target)',
        '🔢 Make a Score variable: Variables → "Make a Variable" → call it Score',
        '✅ Code each target: "when this sprite clicked" → "say [Hit! +1] for 1 sec" → "change Score by 1" → "go to random position"',
        '🔄 Reset the ball after each launch: after the glide block add "wait 0.5 secs" → "go to x: -150 y: -50"',
        '🏁 Test — press the green flag then SPACE. Does the ball launch and the targets score?',
        '🔊 Add a launch sound! Sounds tab → "Choose a Sound" → pick "Zap" or "Pop" → drag "play sound" at the start of the space key code',
        '⬅️➡️ Move the launch position with arrow keys: "when [left arrow] key pressed → change x by -10" and right → +10. Further back = longer distance!',
        '⏱️ Add a 30-second timer: Variables → Timer → "when 🚩 clicked → set Timer to 30 → forever → wait 1 sec → change Timer by -1 → if Timer = 0 → stop all → say [Final Score: ] + Score"',
        '🎯 Make targets worth different points! Big target = 1 point, small target = 3 points — change the "change Score by" amount for each one',
        '🎨 Make it yours — change the theme to basketball, snowball fight, or cannon fire. Rename variables, change backdrops, make targets move!',
        '⭐ Challenge: Make a target that MOVES left and right using a forever loop + "change x by 3" + "if on edge, bounce". Can you hit a moving target?',
      ],
    },
  },
]

async function run() {
  // ── Classroom curriculum assignments ────────────────────────────────────────
  console.log('\n── Classroom curriculum assignments ──')
  const assignments = await sql`
    SELECT cl.name as classroom, cl.grade_band, c.title as curriculum, c.week_number,
           ccl.week_start_date
    FROM classroom_curriculum ccl
    JOIN classrooms cl ON cl.id = ccl.classroom_id
    JOIN curriculum c ON c.id = ccl.curriculum_id
    ORDER BY cl.name, ccl.week_start_date
  `
  for (const a of assignments) {
    console.log(`  ${a.classroom} (${a.grade_band}) | ${a.week_start_date} → W${a.week_number}: ${a.curriculum}`)
  }

  // ── Coding content items so we can see what's in the DB
  const allItems = await sql`
    SELECT ci.id, ci.title, ci.grade_band, ci.created_at,
           c.week_number, c.grade_band as curr_grade,
           EXISTS (
             SELECT 1 FROM classroom_curriculum ccl WHERE ccl.curriculum_id = c.id
           ) as is_assigned
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'coding'
      AND ci.grade_band IN ('g1-2', 'g3-4')
    ORDER BY ci.grade_band, c.week_number, ci.created_at DESC
  `
  console.log('\n── Coding content items in DB ──')
  for (const r of allItems) {
    console.log(`  ${r.grade_band} W${r.week_number} | ${r.is_assigned ? '✅ ASSIGNED' : '  orphan  '} | "${r.title}" | created ${r.created_at?.toISOString?.()?.slice(0,10)}`)
  }
  console.log()

  for (const p of projects) {
    // Find the content item that is ACTUALLY ASSIGNED to a classroom
    // (i.e. reachable via classroom_curriculum → curriculum → curriculum_days → curriculum_content)
    // If multiple rows are assigned, pick the newest.
    const items = await sql`
      SELECT ci.id, ci.title, ci.metadata, ci.created_at
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'coding'
        AND ci.grade_band = ${p.gradeBand}
        AND c.week_number = ${p.weekNumber}
        AND c.grade_band = ${p.gradeBand}
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
    `

    if (items.length === 0) {
      // Fallback: no classroom assignment found, just pick the newest row
      console.warn(`⚠  No assigned classroom found for ${p.gradeBand} week ${p.weekNumber} — falling back to newest row`)
      const [item] = await sql`
        SELECT ci.id, ci.title FROM content_items ci
        JOIN curriculum_content cc ON cc.content_item_id = ci.id
        JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
        JOIN curriculum c ON c.id = cd.curriculum_id
        WHERE ci.subject = 'coding'
          AND ci.grade_band = ${p.gradeBand}
          AND c.week_number = ${p.weekNumber}
        ORDER BY ci.created_at DESC LIMIT 1
      `
      if (!item) { console.warn('  Still not found — skipping'); continue }
      await sql`UPDATE content_items SET title = ${p.metadata.challenge}, metadata = ${p.metadata} WHERE id = ${item.id}`
      console.log(`✓ Updated (fallback): ${p.gradeBand} Week ${p.weekNumber} — "${p.metadata.challenge}"`)
      continue
    }

    // Update ALL matched assigned rows (handles edge case of duplicate assignments)
    for (const item of items) {
      await sql`UPDATE content_items SET title = ${p.metadata.challenge}, metadata = ${p.metadata} WHERE id = ${item.id}`
      console.log(`✓ Updated: ${p.gradeBand} Week ${p.weekNumber} — "${p.metadata.challenge}" (was: "${item.title}", created ${item.created_at?.toISOString?.()?.slice(0,10)})`)
    }
  }

  await sql.end()
  console.log('\nDone! Coding projects updated.')
}

run().catch(e => { console.error(e); process.exit(1) })

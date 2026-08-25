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
  // ── G1-2 Week 1: Welcome to Scratch! ────────────────────────────────────────
  // Topic: Explore the interface, meet sprites — VERY basic, first ever session
  // Teacher guide: 15 min free explore, 30 min guided (sprite → backdrop → move block). That's it.
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Welcome to Scratch!',
      tagline: 'Explore Scratch and make something move — anything goes!',
      starterUrl: '/scratch-starters/g1-2-w1-starter.sb3',
      steps: [
        '🐱 You\'re in Scratch! See the orange cat on the white screen? That\'s a SPRITE. The white area is called the STAGE.',
        '🟡 Click "Events" (yellow) on the left → find the block that says "when 🚩 clicked" → drag it into the middle area.',
        '🔵 Click "Motion" (blue) on the left → find "move 10 steps" → snap it UNDER the flag block.',
        '🚩 Click the GREEN FLAG at the top of the stage — did the cat move? Click it again and again!',
        '🔢 See the number "10" in your move block? Click it and change it to "50" → click the flag again. What happened?',
        '🐾 Pick your own sprite! Click the cat face icon at the bottom-right corner → choose any animal or character you like.',
        '🖼️ Pick a backdrop! Click the backdrop picture at the bottom-right → choose any scene you like. You\'re done — show your teacher! 🎉',
      ],
    },
  },

  // ── G1-2 Week 2: Make it move ────────────────────────────────────────────────
  // Topic: repeat loop, back-and-forth motion
  // Teacher guide: act out loop physically first, then repeat block → bounce → dance challenge
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Make it move!',
      tagline: 'Use repeat loops to make your sprite walk, bounce, and dance!',
      steps: [
        '👀 Click the green flag — does your sprite still move from last week? Great start!',
        '📍 Let\'s make it always start in the middle: "Motion" (blue) → "go to x: 0 y: 0" → drag it to the TOP of your code, ABOVE the move block.',
        '🏃 Stand up! Clap 3 times. You just did a REPEAT 3 loop — doing the same thing 3 times in a row!',
        '🔁 In Scratch: click "Control" (orange) → find "repeat 10" → drag it so it WRAPS AROUND your move block.',
        '🔢 Change "repeat 10" to "repeat 4" and "move 10 steps" to "move 60 steps" → click the flag. It walks across the stage!',
        '↩️ Add a bounce: "Motion" → "if on edge, bounce" → drag it INSIDE the repeat loop, AFTER the move block → click the flag. It bounces back!',
        '💃 CHALLENGE: Add "turn 15 degrees" inside your repeat loop. What does your sprite do? Show your teacher! 🕺',
      ],
    },
  },

  // ── G3-4 Week 1: Moving Car ──────────────────────────────────────────────────
  // Topic: Wheel & axle (simple machine), arrow key controls
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Moving Car',
      tagline: 'Build a driveable car and discover how wheels are a simple machine!',
      starterUrl: '/scratch-starters/g3-4-w1-starter.sb3',
      steps: [
        '🔬 SCIENCE FIRST: A WHEEL is a simple machine! Wheels and axles let things roll instead of slide — much less friction. Today you will code a car you can actually drive! 🚗',
        '🗑️ Right-click the cat sprite on the stage → click Delete. Then click the backdrop icon at the bottom-right → choose "Blue Sky" or any outdoor scene.',
        '🚗 Click the cat face icon at the bottom-right → search "Car" → pick a car sprite and click it to add it to your stage.',
        '📏 Below the stage you will see a box that says "Size". Click it, type 80, and press Enter. This makes your car smaller so it fits nicely.',
        '➡️ Let\'s make the car go RIGHT. Click your car sprite. Click Events (yellow) → drag "when [space ▼] key pressed" into the code area → click the word "space" and choose "right arrow". Now click Motion (blue) → drag "change x by 10" → snap it under the Events block. Each direction needs its OWN separate pair of blocks!',
        '⬅️ Go LEFT: drag a brand new "when key pressed" block into an EMPTY spot. Click the dropdown arrow on it → choose "left arrow". Then drag "change x by 10" under it → change 10 to -10. Negative means left!',
        '⬆️ Go UP: drag another NEW "when key pressed" block → dropdown → choose "up arrow". Add "change y by 10" under it. In Scratch, y means up and down!',
        '⬇️ Go DOWN: one more NEW "when key pressed" block → dropdown → choose "down arrow". Add "change y by -10" under it. You should now have 4 separate stacks of blocks in your code area!',
        '🚩 Click the GREEN FLAG then use your arrow keys to drive around the stage! Does the car move in all 4 directions?',
        '⚡ Make it faster! Find the number 10 in each of your 4 motion blocks → click each one and change it to 15. Click the flag and zoom! 🏎️',
        '🛣️ Add a road! Click "Stage" at the bottom-right (not a sprite) → click the Backdrops tab at the top → click your Blue Sky backdrop to open it in the editor. Use the Rectangle tool to draw a grey road across the middle. Use the Line tool to add white dashes down the centre.',
        '🧱 Add an obstacle! Click the Paint icon near the sprite area (bottom-right) to make a NEW sprite. In the paint editor: first click the Fill colour box (top-left) → click the red colour. Then click the Rectangle tool → draw a rectangle in the centre of the canvas. You will see it fill red! Click the Select tool (arrow) when done. Now look at the big STAGE area — your red rectangle is there. Click and drag it on the stage to place it right on top of your road.',
        '🚦 Make the obstacle stop the car! Click your car sprite → Events → drag "when 🚩 clicked" → Control (orange) → snap a "forever" block under it. Inside the forever loop: Control → drag an "if...then" block inside → Sensing (light blue) → drag "touching [mouse-pointer▼]?" into the if slot → click "mouse-pointer" and choose your red rectangle sprite. Inside the if: Motion → "change x by -20". The forever loop keeps checking every moment so the car bounces back the instant it touches the obstacle!',
        '📊 BONUS: Add a distance counter! Click Variables → Make a Variable → name it "Distance". You will see "Distance" appear in the Variables list on the left — make sure the small checkbox next to it is ticked. A counter box will appear on your stage! Now find the group of blocks that starts with "when right arrow key pressed" → drag "change Distance by 1" and snap it below the "change x by 15" block. Press the right arrow a few times — the number on stage should go up each time!',
        '⭐ CHALLENGE: Can you add 3 obstacles on the road and drive without hitting any of them? Wheels with TREADS grip the road — your code is simulating real-world physics! 🏆',
      ],
    },
  },

  // ── G3-4 Week 2: Make it Dance! ──────────────────────────────────────────────
  // Topic: Loops (repeat vs forever), motion + sound, sprite animation
  // Students arrive with their W1 Moving Car project — arrow keys + change x/y.
  // We ADD a new dancing character and teach loops with that, leaving the car intact.
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Make it Dance!',
      tagline: 'Add a dancer to your car scene and master repeat vs forever loops!',
      starterUrl: '/scratch-starters/g3-4-w1-starter.sb3',
      steps: [
        '👀 Click the green flag — your car from last week should still drive with the arrow keys! Great. Today we are going to ADD a dancing character using LOOPS.',
        '🐾 Add a dancer: click the sprite icon at the bottom-right of the stage → search "Dinosaur", "Penguin", or "Ballerina" → click to add it. You now have the car AND the dancer on stage!',
        '🖱️ Click your NEW dancer sprite in the sprite panel (not the car). Events (yellow) → drag "when 🚩 clicked" into the code area. This starts the dancer when you click the green flag.',
        '♾️ FOREVER loop: Control (orange) → drag "forever" block → snap it under "when 🚩 clicked". Inside it: Motion (blue) → "move 10 steps". Click the green flag — the dancer walks forever! It might walk off the edge — that is okay, we fix it in the next step.',
        '↩️ Add a bounce: Motion → "if on edge, bounce" → drag it INSIDE the forever loop, BELOW "move 10 steps" → click the flag. The dancer walks back and forth! If it flips upside down: look below the stage at the sprite panel — next to the Direction number you will see three small icons (arrows). Click the MIDDLE one (left-right arrows) to stop it flipping upside down.',
        '🌀 Add spinning: inside the forever loop, Motion → "turn 15 degrees" → snap it below the bounce block → click flag. Dancing AND spinning! Try changing 15 to different numbers — bigger = faster spin.',
        '⏳ Now try a REPEAT loop. Step 1: right-click the big orange "forever" block → click Delete. The blocks inside will float loose — that is normal! Step 2: Control → drag "repeat 10" → snap it under "when 🚩 clicked". Step 3: one by one, drag the loose move, bounce, and turn blocks INSIDE the repeat 10 (they snap in when you drop them in the gap). Step 4: click the green flag — the sprite moves 10 times then STOPS. To see it move again, click the flag again. That is the whole point! REPEAT makes you click each time. FOREVER keeps going on its own. Try changing "10" to "3" — now it stops even faster!',
        '🔊 Add sound to your DANCER sprite (not the car). First, make sure your dancer sprite is selected in the sprite panel. Step 1: click the Sounds tab at the top → click the speaker icon (bottom-left) → search "Dance" or "Pop" → click to add it. Step 2: switch your "repeat 10" back to a "forever" block (right-click repeat → delete, drag in forever). Step 3: Code tab → Sound → drag "play sound [your sound] until done" → snap it INSIDE the forever loop, ABOVE the move block. Click the flag — your dancer plays music and moves forever!',
        '🏆 CHALLENGE: Click the green flag — your DANCER starts bouncing automatically. NOW use the ARROW KEYS to drive your car at the same time. The dancer loops forever while YOU control the car! That is parallel code — two things running at once. Can you add a SECOND dancer sprite with different move and turn numbers so they dance differently from each other? 🕺',
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

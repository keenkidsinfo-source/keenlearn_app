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
  // Topic: Explore the interface, meet sprites (aligned with keenkids-teachers.netlify.app W1)
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    metadata: {
      language: 'scratch',
      challenge: 'Welcome to Scratch!',
      tagline: 'Explore Scratch and make something move — anything goes!',
      steps: [
        // W1: Welcome to Scratch! — Explore interface, meet sprites (slow & playful)
        '🐱 You\'re in Scratch! See the orange cat on the white screen? That\'s a SPRITE. The white area is called the STAGE.',
        '🟡 On the LEFT side, click the yellow button that says "Events" — find the block that says "when 🚩 clicked" and drag it into the middle area.',
        '🔵 Now click "Motion" (blue) on the left — find "move 10 steps" and snap it UNDER the flag block.',
        '🚩 Click the GREEN FLAG at the top of the stage — did the cat move? Click it again and again!',
        '🔢 Find the number "10" in your move block and click it. Change it to "50" and click the flag again. What happened?',
        '🌟 Try "100" — then try "5". Which one moves more? Which is slower?',
        '🐾 Now let\'s pick a NEW sprite! Click the cat face icon at the bottom-right corner. Pick any animal or character you like.',
        '🎨 Drag your new sprite somewhere else on the stage so you can see both.',
        '🔧 Click your NEW sprite, then give it the same code: Events → "when 🚩 clicked" → Motion → "move 10 steps".',
        '🚩 Click the green flag — BOTH sprites move now! Change the numbers to make them move different amounts.',
        '🖼️ Pick a backdrop! Click the backdrop picture at the bottom-right → choose any scene you like (nature, space, city!).',
        '💬 Make your sprite talk! Click "Looks" (purple) → find "say [Hello!] for 2 secs" → snap it under the move block → click the flag.',
        '😄 Click the "Hello!" text and change it to anything you want your sprite to say!',
        '🔊 Add a sound! Click "Sounds" at the top → "Choose a Sound" → pick something fun → drag "play sound" into your code.',
        '⭐ EXPLORE: Click every coloured button on the left and drag blocks to see what they do. Make your sprite do ANYTHING — there are no wrong answers today!',
      ],
    },
  },

  // ── G1-2 Week 2: Make it move ────────────────────────────────────────────────
  // Topic: Motion blocks, repeat loops (aligned with keenkids-teachers.netlify.app W2)
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Make it move!',
      tagline: 'Use motion blocks and loops to make sprites zoom, bounce, and repeat!',
      steps: [
        '👀 Open Scratch — can you see last week\'s project? Click the green flag. What does your sprite do?',
        '📍 Let\'s make it always start in the same place! Click "Motion" (blue) → find "go to x: 0 y: 0" → drag it ABOVE your move block.',
        '🚩 Click the flag — the sprite starts in the middle then moves. Try changing "0 0" to "-180 0" to start on the left edge!',
        '🏃 Now stand up! We\'re going to ACT OUT a loop. Clap 3 times. You just did a REPEAT 3 loop!',
        '🔁 In Scratch: click "Control" (orange) on the left → find "repeat 10" → drag it so it WRAPS AROUND your move block.',
        '🔢 Change "10" to "3" and change your move to "60 steps" → click the flag. The sprite takes 3 steps across!',
        '➕ Try "repeat 6" with "move 30 steps" — it still crosses the stage but takes more smaller steps.',
        '♾️ Now find "forever" in Control — it\'s below repeat. Drag it to replace your repeat block (wrap it around move).',
        '🚩 Click the flag — it goes FOREVER! Hit the red STOP button ⏹️ to make it stop.',
        '🏓 Add a BOUNCE! Motion → find "if on edge, bounce" → drag it INSIDE the forever loop, AFTER the move block.',
        '🚩 Click the flag — the sprite bounces back and forth like a ping pong ball! Try changing the move speed.',
        '🐾 Add a SECOND sprite and give it different code — maybe "move 8 steps" instead of 10. They race each other!',
        '🔄 Try adding "turn 15 degrees" inside the forever loop. What happens? (It goes wild! 🌀)',
        '🎨 Change the backdrop to something fun — a race track, the ocean, or outer space!',
        '⭐ CHALLENGE: Make 3 sprites race at different speeds. Who gets to the edge first? Can you make one do somersaults while it moves?',
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
      steps: [
        '🔬 SCIENCE FIRST: A WHEEL is a simple machine! Wheels + axles let things roll instead of slide — much less friction. Today you\'ll code one! 🚗',
        '🗑️ Delete the cat sprite (right-click → delete). Then click the backdrop picture (bottom-right) → choose "Blue Sky" or any outdoor scene.',
        '🚗 Add a car sprite: click the cat face icon → search "car" in the library. If you don\'t find one, click "Paint" and draw a simple rectangle with circles underneath!',
        '📏 Make your car the right size: look for the SIZE box under the stage → type "80" to shrink it down.',
        '⬆️ Code RIGHT movement: click your car → Code tab → Events → drag "when [right arrow] key pressed" → Motion → "change x by 10".',
        '⬅️ Code LEFT: "when [left arrow] key pressed" → "change x by -10". The negative number goes left!',
        '⬆️ Code UP: "when [up arrow] key pressed" → "change y by 10". (y goes up in Scratch!)',
        '⬇️ Code DOWN: "when [down arrow] key pressed" → "change y by -10".',
        '🚩 Click the green flag then use your ARROW KEYS to drive. You\'re the driver! 🎮',
        '⚡ Make it faster! Change all "10"s to "15" in your four arrow blocks. Test it again — zoom!',
        '🛣️ Add a road! Click the backdrop → paint icon → use the Line tool to draw road lines and a horizon.',
        '🧱 Add an obstacle! Paint a new sprite (a red rectangle) → place it on your road. When the car touches it, it should bounce back: Sensing → "touching [obstacle]?" → Motion → "change x by -20".',
        '📊 Track distance! Variables → "Make a Variable" → call it "Distance" → in your right-arrow code, add "change Distance by 1". How far can you drive?',
        '🎵 Add an engine sound! Sounds → choose a sound like "Motor" or "Zap" → play it when the right arrow is pressed.',
        '⭐ CHALLENGE + SCIENCE: Real wheels have TREADS for grip. Add 3 obstacles on your road and try to drive through them without touching. This simulates tires gripping a rough road!',
      ],
    },
  },

  // ── G3-4 Week 2: Racing Game ─────────────────────────────────────────────────
  // Topic: Inclined plane (simple machine), speed variable, score, timer
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    metadata: {
      language: 'scratch',
      challenge: 'Racing Game',
      tagline: 'Build a racing game with a speed boost, mud pits, and a finish line!',
      steps: [
        '🔬 SCIENCE CHECK: An INCLINED PLANE (ramp) is a simple machine! Things roll FASTER downhill because gravity helps. Today\'s game has speed boosts that act like a ramp! 🏎️',
        '🗑️ Delete the cat sprite. Choose a race track backdrop — search "Racetrack" in the library, or paint your own oval track with green grass and a grey road.',
        '🚗 Add a car sprite (search "car") and place it at the START of your track.',
        '🔢 Create a Speed variable: Variables → "Make a Variable" → call it "Speed" → click the checkbox to show it on stage.',
        '🏗️ Build the driving loop: Events → "when 🚩 clicked" → Control → "set Speed to 3" → "forever" → Motion → "move Speed steps" → "if on edge, bounce".',
        '🚩 Test it — the car moves automatically at speed 3. Click the flag!',
        '⬆️ Add the RAMP EFFECT (speed up): "when [up arrow] key pressed" → "change Speed by 1" — like rolling downhill!',
        '⬇️ Add braking (slow down): "when [down arrow] key pressed" → "change Speed by -1". Add Control → "if Speed < 1 → set Speed to 1" to stop it going backwards.',
        '↩️ Add steering: "when [left arrow] key pressed" → Motion → "turn -10 degrees". "when [right arrow] key pressed" → "turn 10 degrees".',
        '🏁 Add a Finish Line! Paint a white stripe sprite across your track. Code it: "forever" → "if touching [car sprite]? → change Score by 1 → go to x: 0 y: -140" to reset.',
        '📊 Make a Score variable: Variables → "Make a Variable" → call it "Score" → show it on stage.',
        '⏱️ Add a 30-second timer: Variables → "Timer" → "when 🚩 clicked → set Timer to 30 → forever → wait 1 sec → change Timer by -1 → if Timer = 0 → stop all".',
        '🟡 Add a SPEED BOOST pad! Paint a yellow rectangle sprite on the track: "forever → if touching [car sprite]? → change Speed by 3 → wait 2 secs → change Speed by -3".',
        '🟫 Add MUD! Paint a brown rectangle: "forever → if touching [car sprite]? → change Speed by -2". Mud = FRICTION = slower! (Simple machines reduce friction — mud adds it back!)',
        '⭐ CHALLENGE: Add a second car sprite controlled by W/A/S/D keys and race a friend. Who gets the most laps in 30 seconds?',
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

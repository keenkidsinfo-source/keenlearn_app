/**
 * patch-coding-w3-monsters.mjs
 * Updates W3 coding steps to match the new starter .sb3 files which have
 * Pikachu, PokeBall, Caterpie, Abra, Psyduck pre-loaded as custom SVG sprites.
 * Steps now reference sprites by their pre-loaded names instead of asking kids
 * to search for Pokémon in the Scratch library (where they don't exist).
 *
 * Run: node scripts/patch-coding-w3-monsters.mjs
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

const updates = [
  {
    gradeBand: 'g1-2',
    weekNumber: 3,
    challenge: 'Pokémon Catcher!',
    tagline: 'Move Pikachu and throw a Poké Ball to catch Caterpie!',
    steps: [
      '🎮 Welcome to Pokémon Catcher! Look at the bottom-right corner — you should see PIKACHU, POKEBALL, and CATERPIE in your sprite list. Those are your characters today! First, let\'s pick a background: click the little landscape picture at the very bottom-right corner of the screen → click "Choose a Backdrop" → search for "Forest" or "Blue Sky" → click it. Your stage now has a background! 🌲',
      '⬅️ Let\'s make Pikachu move LEFT! Click the PIKACHU sprite in the sprite list. Click the yellow EVENTS block → drag "when [left arrow] key pressed" onto the big white area. Then click the blue MOTION blocks → drag "change x by 10" → snap it underneath. Change the 10 to -10 (click the number and type -10). Press the left arrow key — Pikachu slides left! ⬅️',
      '➡️ Now make Pikachu move RIGHT! Still on PIKACHU — find the yellow EVENTS block again → drag a NEW "when [right arrow] key pressed" block to a EMPTY spot on the white area (don\'t connect it to the first stack!). Click blue MOTION → drag "change x by 10" → snap it under the right arrow block. Press the right arrow key — Pikachu slides right! ⬅️➡️ Try both arrow keys now!',
      '🔴 Click the POKEBALL sprite. Drag it to the BOTTOM of the stage near Pikachu. Now let\'s make it throw! Click yellow EVENTS → drag "when [space] key pressed". Click blue MOTION → drag "set y to -130" → snap it under (this resets the ball to the bottom each throw). Then MOTION → drag "glide 1 secs to x: 0 y: 160" → snap it under (this makes the ball fly up slowly so it can hit Caterpie!). Then one more: MOTION → drag "set y to -130" again → snap it last (this brings the ball back down ready for the next throw). Press Space — watch the ball fly up and come back! 🚀',
      '🐛 Click the CATERPIE sprite. Drag Caterpie to the TOP of the stage. Now let\'s set up the catching code! First make a SCORE: click orange VARIABLES → "Make a Variable" → type "Score" → OK. A score box appears on the stage! Now: click yellow EVENTS → drag "when 🚩 clicked". Click orange CONTROL → drag "forever" → snap it under. Click CONTROL again → drag "if...then" → snap it INSIDE the forever. 🎉',
      '👀 Still on CATERPIE — let\'s fill in the "if" block. Click light-blue SENSING → drag "touching [mouse pointer]?" INTO the pointy slot of the "if" block → click the dropdown → change it to "PokeBall". Now click orange VARIABLES → drag "change Score by 1" → snap it INSIDE the "if". Then click purple LOOKS → drag "hide" → snap it UNDER "change Score by 1". Click 🚩, throw the ball — Caterpie disappears and your score goes up! 🎉',
      '🔄 Make Caterpie come BACK! Still on CATERPIE — first, add 2 blocks BETWEEN "when 🚩 clicked" and the "forever" loop: ① purple LOOKS → "show" (so Caterpie is always visible when the game starts!) ② blue MOTION → "go to x: 0 y: 130". Now inside the "if" block, add 4 more blocks after "hide": ③ orange CONTROL → "wait 1 seconds" ④ blue MOTION → "go to x: 0 y: 130" ⑤ purple LOOKS → "show" ⑥ orange CONTROL → "wait 1 seconds" (this second wait is the secret — without it Caterpie hides straight away again!). Full script: when 🚩 clicked → show → go to x:0 y:130 → forever → if touching PokeBall → change Score → hide → wait 1 → go to x:0 y:130 → show → wait 1. Click 🚩, press Space, catch Caterpie — score goes up and Caterpie comes back every time! 🎉',
      '🏆 CHALLENGE: Make Caterpie wiggle around on its own — much harder to catch! Click CATERPIE. Find an EMPTY spot on the white area. Click yellow EVENTS → drag a BRAND NEW "when 🚩 clicked" → don\'t connect it to anything! Click CONTROL → drag "forever" → snap it under. Click blue MOTION → drag "move 2 steps" inside → then drag "if on edge, bounce" inside too. Click 🚩 — Caterpie bounces around! Can you still hit it? 🏆',
      '⭐ SUPER CHALLENGE: Can you make PIKACHU say something when the game starts? Click PIKACHU → Events → "when 🚩 clicked" → Looks → "say [Let\'s catch \'em all!] for 2 secs". Click 🚩 to see it! Now show your teacher your Pokémon game! 🌟',
    ],
  },
  {
    gradeBand: 'g3-4',
    weekNumber: 3,
    challenge: 'Pokémon Battle Game!',
    tagline: 'Build a full Pokémon catching game with HP, score, and a countdown timer!',
    steps: [
      '🎮 Welcome to Pokémon Battle Game! Look at the bottom-right — you should see PIKACHU, POKEBALL, CATERPIE, ABRA, and PSYDUCK in your sprite list. First, pick a backdrop: click the little landscape icon at the very bottom-right corner → "Choose a Backdrop" → search "Forest" or "Space" → click one. Now drag PIKACHU to the bottom-centre of the stage. Drag CATERPIE, ABRA, and PSYDUCK to the top of the stage, spread out at different x positions so they\'re not on top of each other. Your battlefield is ready! 🌲',
      '⬅️➡️ Make Pikachu move left and right! Click the PIKACHU sprite in the sprite list. Click yellow EVENTS on the left → drag "when [right arrow] key pressed" onto the white coding area. Click blue MOTION → drag "change x by 10" → snap it underneath → change 10 to 15. Now for the other direction: drag a SECOND "when [left arrow] key pressed" block to an EMPTY spot on the white area (not connected to the first stack). Click MOTION → drag "change x by 10" → snap it under → change 10 to -15. Press the left and right arrow keys — Pikachu slides both ways! ⬅️➡️',
      '🔴 Make the Poké Ball throw! Click the POKEBALL sprite. Click yellow EVENTS → drag "when [space] key pressed" onto the white area. Now click blue MOTION → drag "go to x: 0 y: -130" → snap it under (this puts the ball at Pikachu\'s starting position each throw). Then MOTION → drag "glide 0.3 secs to x: 0 y: 170" → snap it under (the ball flies up fast to hit the Pokémon at the top!). Then one more: MOTION → drag "go to x: 0 y: -130" → snap it last (resets the ball ready for the next throw). Press Space — the ball shoots up and comes back! 🚀',
      '❤️ Make your Score and Lives (HP) show on screen! Click orange VARIABLES on the left → click "Make a Variable" → type Score → make sure "For all sprites" is selected → click OK. A Score box appears on the stage! Do it again: "Make a Variable" → type HP → "For all sprites" → OK. Now click the STAGE — it\'s the small grey box to the LEFT of your sprite list at the bottom (not a Pokémon, it\'s the background itself). Click yellow EVENTS → drag "when 🚩 clicked" onto the white area. Click orange VARIABLES → drag "set Score to 0" → snap it under. Drag "set HP to 3" → snap it under that. *(If Score and HP boxes aren\'t showing on stage, find them in the Variables list and tick the checkbox next to each one.)* Click 🚩 — you should see Score: 0 and HP: 3 on screen. 3 lives! ❤️❤️❤️',
      '💥 Make each Pokémon react when the ball hits! Click CATERPIE in the sprite list. Click yellow EVENTS → drag "when 🚩 clicked". Click orange CONTROL → drag "forever" → snap under. Click CONTROL → drag "if...then" → snap it INSIDE the forever loop. Click light-blue SENSING → drag "touching [mouse-pointer]?" INTO the pointy diamond slot of the "if" → click the dropdown → change it to "PokeBall". Inside the "if": click orange VARIABLES → drag "change Score by 1". Then click blue MOTION → drag "go to [random position]" → snap under. Then CONTROL → drag "wait 0.5 secs" → snap under. Now REPEAT THIS SAME SCRIPT on ABRA and PSYDUCK — click each sprite and build the exact same stack. All 3 Pokémon now jump away when hit! 💥',
      '💔 Lose a life when a Pokémon escapes! Still on CATERPIE — find an EMPTY spot on the white area. Drag a SECOND "when 🚩 clicked" (don\'t connect it to the first stack). CONTROL → "forever". Inside: CONTROL → "if...then". Click light-blue SENSING → drag "touching [edge]?" into the diamond slot. Inside the "if": VARIABLES → "change HP by -1" (type -1). Then MOTION → "go to [random position]". This means: if Caterpie drifts to the edge without being caught, you lose 1 life and it resets. REPEAT this second script on ABRA and PSYDUCK too. Now losing Pokémon actually costs you! ❤️',
      '⏱️ Add a 30-second countdown timer! First make a new variable: orange VARIABLES → "Make a Variable" → type Time → OK. Click the STAGE (small grey box to the left of your sprite list). You should already have a "when 🚩 clicked" stack with Score and HP. Add to it: VARIABLES → "set Time to 30" → snap under "set HP to 3". Now click orange CONTROL → drag "repeat 30" → snap under. Inside the repeat: CONTROL → "wait 1 secs". Then VARIABLES → "change Time by -1". After the repeat block (snap OUTSIDE it at the bottom): click purple LOOKS → drag "say [Time\'s up! ⏰] for 2 secs" → snap under. Then CONTROL → "stop [all]". Click 🚩 — watch the timer count down from 30! ⏱️',
      '💀 Add Game Over when HP hits 0! Click CATERPIE. Find your FIRST forever loop (the one where Caterpie reacts to being hit). Inside that forever loop, add a SECOND "if...then" block BELOW the first one. Click orange OPERATORS → drag "= " block into the diamond slot → click VARIABLES → drag "HP" into the left side → type 0 on the right. So it reads "if HP = 0". Inside this "if": purple LOOKS → "say [Game Over! 💀] for 2 secs". Then CONTROL → "stop [all]". REPEAT this same "if HP = 0" check inside ABRA and PSYDUCK\'s forever loops too. Now if you let 3 Pokémon escape, the game ends! Click 🚩 and test it. 💀',
      '🏆 CHALLENGE: Make Pokémon move on their own — much harder to catch! Click CATERPIE. Find an EMPTY spot on the white area. Drag a brand new "when 🚩 clicked" → don\'t connect it to anything! CONTROL → "forever". Inside: MOTION → "move 3 steps" → then "if on edge, bounce". REPEAT on ABRA and PSYDUCK. Now all 3 drift and bounce around the screen! Can you catch them all before 30 seconds runs out AND before you lose 3 lives? Show your teacher your full game! 🎉',
    ],
  },
]

async function run() {
  for (const u of updates) {
    const [item] = await sql`
      SELECT ci.id, ci.title, ci.metadata
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'coding'
        AND ci.grade_band = ${u.gradeBand}
        AND c.grade_band = ${u.gradeBand}
        AND c.week_number = ${u.weekNumber}
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
      LIMIT 1
    `
    if (!item) {
      console.warn(`⚠ No coding item found for ${u.gradeBand} W${u.weekNumber}`)
      continue
    }
    const existing = item.metadata ?? {}
    const updated = {
      ...existing,
      challenge: u.challenge,
      tagline:   u.tagline,
      steps:     u.steps,
    }
    await sql`
      UPDATE content_items
      SET metadata = ${updated}
      WHERE id = ${item.id}
    `
    console.log(`✓ ${u.gradeBand} W${u.weekNumber}: "${item.title}" → "${u.challenge}" (${u.steps.length} steps)`)
  }
  await sql.end()
  console.log('\n✅ Done — W3 coding projects updated to Monster Catcher/Battle.')
}

run().catch(e => { console.error(e); process.exit(1) })

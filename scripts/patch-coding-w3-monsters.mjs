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
      '🔄 Make Caterpie come BACK! Still on CATERPIE — you need 4 more blocks inside the "if", in this exact order after "hide": ① orange CONTROL → "wait 1 seconds" ② blue MOTION → "go to x: 0 y: 130" (type 0 for x and 130 for y) ③ purple LOOKS → "show" ④ orange CONTROL → "wait 1 seconds" again (this second wait is the secret — without it Caterpie hides straight away again!). So the full "if" reads: change Score → hide → wait 1 → go to x:0 y:130 → show → wait 1. Click 🚩, press Space, catch Caterpie — score goes up and Caterpie comes back every time! 🎉',
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
      '🎮 Today we build a REAL Pokémon game with score, HP, and a timer! Your starter has Pikachu, Poké Ball, Caterpie, Abra, and Psyduck pre-loaded. Pick a backdrop first: click the backdrop icon → search "Forest" or "Space". Drag Pikachu to the bottom, Caterpie/Abra/Psyduck to the top at different x positions.',
      '⬅️➡️ Click PIKACHU → arrow key movement. Events → "when [right arrow] key pressed" → Motion → "change x by 15". New stack: "when [left arrow] key pressed" → "change x by -15". Test — Pikachu slides left and right.',
      '🔴 Click POKEBALL (Size 40). Events → "when [space] key pressed" → Motion → "go to x: (Pikachu\'s x position) y: (Pikachu\'s y position)". Then "glide 0.3 secs to x: (same x) y: 170". The ball flies up fast! Use Sensing blocks to get Pikachu\'s actual x position dynamically.',
      '❤️ Set up HP and Score variables. Click Variables → Make a Variable → "Score" (for all sprites). Make another: "HP" (for all sprites). Click STAGE → Events → "when 🚩 clicked" → Variables → "set Score to 0" → "set HP to 3". Tick both checkboxes so they show on stage.',
      '💥 Make each Pokémon react to the ball. Click CATERPIE → "when 🚩 clicked" → Control → "forever". Inside: if → Sensing → "touching [PokeBall]?" → inside if: Variables → "change Score by 1" → Motion → "go to [random position]" → Control → "wait 0.5 secs". Repeat this exact script on ABRA and PSYDUCK too (click each one and build the same script).',
      '⏱️ Add a 30-second countdown. Make a Variable "Time". Click STAGE → Events → "when 🚩 clicked" → Variables → "set Time to 30" → Control → "repeat 30" → "wait 1 secs" → "change Time by -1". After the repeat: Looks → "say [Time\'s up!] for 2 secs" → Control → "stop [all]".',
      '💀 Add Lives (HP). Back on each Pokémon: inside its forever loop, add a SECOND if: "if HP = 0" → Looks → "say [You lost!] for 2 secs" → Control → "stop [all]". On STAGE: add another check — "if Time = 0 and Score > 0" → "say [You caught em all! 🏆]". Click the green flag and play!',
      '🎨 Polish your game! Click PIKACHU → Sounds tab → add "Pop" or "Zap" → Code tab → Sound → "play sound [] until done" inside the space-key throwing script.',
      '🏆 CHALLENGE: Make all 3 Pokémon move on their own! Each one → add a SECOND "when 🚩 clicked" → "forever" → "move 3 steps" + "if on edge, bounce". Now they drift across the screen — can you still catch them all before time runs out? 🎉',
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

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
      '🎮 Today we build a Pokémon catching game! Your starter already has Pikachu, a Poké Ball, and Caterpie loaded — look in the sprite list at the bottom-right. First, pick a backdrop: click the backdrop icon → search "Forest" or "Blue Sky".',
      '⚡ Click the PIKACHU sprite. Make it move left and right with arrow keys. Click Events (yellow) → drag "when [right arrow] key pressed" → Motion (blue) → snap "change x by 10" under it. Then make a NEW stack: "when [left arrow] key pressed" → "change x by -10". Test it — Pikachu should slide left and right!',
      '🔴 Click the POKEBALL sprite. Place it on top of Pikachu. Make it throw upward: Events → "when [space] key pressed" → Motion → "go to x: (Pikachu x) y: (Pikachu y)" then "glide 0.5 secs to x: (same x) y: 160". The ball flies up! Tip: drag Caterpie to the top of the stage now.',
      '🐛 Click the CATERPIE sprite. Set its Size to 60. Place it near the TOP of the stage. Now make it react to the Poké Ball: Events → "when 🚩 clicked" → Control → "forever". Inside forever: Control → "if...then" → Sensing → "touching [PokeBall]?" → inside if: Looks → "hide". Click the green flag and throw the ball — Caterpie disappears when you hit it!',
      '🔢 Add a score! Click Variables → Make a Variable → name it "Score". Tick the checkbox so it shows on stage. Click CATERPIE → inside the "if touching PokeBall" block → Variables → drag "change Score by 1" ABOVE the "hide" block. Catch Caterpie — your score goes up! 🎉',
      '🔄 Make Caterpie reappear! After "hide", add: Looks → "wait 1 secs" → Looks → "show" → Motion → "go to [random position]". Now Caterpie keeps coming back. How high can your score get in 30 seconds?',
      '🏆 CHALLENGE: Make Caterpie move on its own! Add a SECOND "when 🚩 clicked" stack on Caterpie → Control → "forever" → Motion → "move 2 steps" + "if on edge, bounce". Now it wiggles across the screen — much harder to catch! 🎉',
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

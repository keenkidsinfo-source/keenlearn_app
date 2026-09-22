/**
 * restore-w3-g34-metadata.mjs
 * Restores the G3-4 Week 3 coding content item metadata (Pokémon Battle Game)
 * which was accidentally overwritten with Harry Potter W4 data.
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

const correctMeta = {
  language: 'scratch',
  challenge: 'Pokémon Battle Game!',
  tagline: 'Build a full Pokémon catching game with HP, score, and a countdown timer!',
  starterUrl: '/scratch-starters/g3-4-w3-starter.sb3',
  steps: [
    '🎮 Welcome to Pokémon Battle Game! Look at the bottom-right — you should see PIKACHU, POKEBALL, CATERPIE, ABRA, and PSYDUCK in your sprite list. First, pick a backdrop: click the little landscape icon at the very bottom-right corner → "Choose a Backdrop" → search "Forest" or "Space" → click one. Now drag PIKACHU to the bottom-centre of the stage. Drag CATERPIE, ABRA, and PSYDUCK to the top of the stage, spread out at different x positions. Your battlefield is ready! 🌲',
    '🔴 Make the Poké Ball throw! Click the POKEBALL sprite. EVENTS → "when [space] key pressed". MOTION → "go to x: 0 y: -130" → snap under (ball starts at Pikachu). MOTION → "glide 0.3 secs to x: 0 y: 170" → snap under (ball flies up!). MOTION → "go to x: 0 y: -130" → snap last (resets). Press Space — the ball shoots up and comes back! 🚀',
    '❤️ Make Score and HP show on screen! VARIABLES → "Make a Variable" → type Score → OK. Again: "Make a Variable" → type HP → OK. Click the STAGE (small grey box LEFT of sprite list). EVENTS → "when 🚩 clicked". VARIABLES → "set Score to 0". VARIABLES → "set HP to 3". Click 🚩 — Score: 0 and HP: 3 appear on screen. 3 lives! ❤️❤️❤️',
    '💥 Pokémon react when the ball hits! Click CATERPIE. EVENTS → "when 🚩 clicked". CONTROL → "forever". CONTROL → "if...then" → inside the forever. SENSING → "touching [PokeBall]?" → into the diamond slot. Inside the if: VARIABLES → "change Score by 1". MOTION → "go to [random position]". CONTROL → "wait 0.5 secs". REPEAT this same script on ABRA and PSYDUCK. All 3 jump away when hit! 💥',
    '💔 Lose a life when a Pokémon escapes! Still on CATERPIE — find an EMPTY spot. NEW "when 🚩 clicked" (separate stack). CONTROL → "forever". Inside: CONTROL → "if...then". SENSING → "touching [edge]?" → into diamond. Inside if: VARIABLES → "change HP by -1". MOTION → "go to [random position]". REPEAT on ABRA and PSYDUCK. Escaping Pokémon now cost you a life! ❤️',
    '⏱️ Add a 30-second timer! VARIABLES → "Make a Variable" → type Time → OK. Click the STAGE. Add to the bottom of your "when 🚩 clicked" stack: VARIABLES → "set Time to 30". CONTROL → "repeat 30". Inside: CONTROL → "wait 1 secs". Inside: VARIABLES → "change Time by -1". After the repeat (outside): LOOKS → "say [Time\'s up! ⏰] for 2 secs". CONTROL → "stop [all]". Click 🚩 — timer counts down from 30! ⏱️',
    '💀 Game Over when HP hits 0! Click CATERPIE. Inside your first forever loop, add a 2nd "if...then" BELOW the first. OPERATORS → "= " block → put HP on the left, 0 on the right → into diamond. Inside: LOOKS → "say [Game Over! 💀] for 2 secs". CONTROL → "stop [all]". REPEAT inside ABRA and PSYDUCK forever loops too. Let 3 Pokémon escape — game ends! 💀',
    '🏆 CHALLENGE: Pokémon move on their own! Click CATERPIE → empty spot → NEW "when 🚩 clicked". CONTROL → "forever". Inside: MOTION → "move 3 steps". Inside: MOTION → "if on edge, bounce". REPEAT on ABRA and PSYDUCK. All 3 drift and bounce — much harder to catch! Can you beat 30 seconds with 3 lives? Show your teacher your game! 🎉',
  ],
}

async function main() {
  // Find the W3 G3-4 coding content item by week_number=3, grade_band=g3-4
  const [item] = await sql`
    SELECT ci.id, ci.title, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'coding'
      AND ci.grade_band = 'g3-4'
      AND c.grade_band = 'g3-4'
      AND c.week_number = 3
      AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
    ORDER BY ci.created_at ASC
    LIMIT 1
  `

  if (!item) {
    console.error('❌ No W3 G3-4 coding item found!')
    await sql.end()
    return
  }

  console.log(`Found: id=${item.id} title="${item.title}"`)
  console.log(`Current tagline: ${item.metadata?.tagline ?? '(none)'}`)

  await sql`
    UPDATE content_items
    SET metadata = ${JSON.stringify(correctMeta)}
    WHERE id = ${item.id}
  `

  console.log(`✅ Restored W3 G3-4 metadata → challenge: "${correctMeta.challenge}", tagline: "${correctMeta.tagline}"`)
  await sql.end()
}

main().catch(e => { console.error(e); process.exit(1) })

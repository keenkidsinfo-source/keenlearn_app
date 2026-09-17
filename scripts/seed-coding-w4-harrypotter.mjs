/**
 * seed-coding-w4-harrypotter.mjs
 * Seeds Week 4 coding — Harry vs Voldemort dueling game
 *
 * G1-2: Harry shoots lightning bolts at Voldemort, 30-second score attack (9 steps)
 * G3-4: Full duel — HP bars, Voldemort AI shoots back, Personal Best (9 core + 2 challenge)
 *
 * Starter .sb3 sprites needed: HARRY, VOLDEMORT, LIGHTNING_BOLT, DARK_CURSE
 *
 * Run: node scripts/seed-coding-w4-harrypotter.mjs
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
  // ── G1-2 Week 4: Harry vs Voldemort (Beginner) ──────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 4,
    challenge: 'Harry vs Voldemort!',
    tagline: 'Shoot lightning bolts at Voldemort before time runs out!',
    steps: [
      '🧙 Set up the arena! Your sprite list already has HARRY, VOLDEMORT, and LIGHTNING_BOLT loaded. Drag HARRY to the bottom-centre of the stage. Drag VOLDEMORT to the top-centre. Click the little landscape icon at the very bottom-right → "Choose a Backdrop" → search "Castle" or "Stars" → click one. Dueling arena ready! ⚡',

      '⬅️➡️ Make Harry move! Click HARRY in the sprite list. Events → "when [right arrow] key pressed" onto the white area. Motion → "change x by 10" → snap under. Now drag a SECOND "when [left arrow] key pressed" to an EMPTY spot (not connected!). Motion → "change x by 10" → change 10 to -10. Press the arrow keys — Harry slides left and right! ⬅️➡️',

      '⚡ Make Harry shoot lightning! Click LIGHTNING_BOLT. Events → "when [space] key pressed". Motion → "go to x: 0 y: -130" → snap under (bolt starts at the bottom). Motion → "glide 0.5 secs to x: 0 y: 160" → snap under (fires UP!). Motion → "go to x: 0 y: -130" → snap last (resets for the next shot). Press Space — lightning flies up and comes back! ⚡',

      '🏆 Make a Score! Variables → "Make a Variable" → type Score → OK. A Score box appears on stage! Now click VOLDEMORT. Events → "when 🚩 clicked". CONTROL → "forever" → snap under. CONTROL → "if...then" → snap inside the forever. This is where the magic happens next! 🎉',

      '💥 Voldemort reacts when hit! Still on VOLDEMORT — fill in the "if" block. SENSING → "touching [mouse-pointer]?" → drop into the diamond → click dropdown → change to "Lightning_Bolt". Inside the if: VARIABLES → "change Score by 1". MOTION → "go to [random position]". Click 🚩 and press Space — hit Voldemort and score goes up! 💥',

      '🧙 Make Voldemort bounce! Still on VOLDEMORT — find an EMPTY spot. Drag a NEW "when 🚩 clicked" (not connected to anything). CONTROL → "forever". Inside: MOTION → "move 3 steps". MOTION → "if on edge, bounce". Click 🚩 — Voldemort bounces around the screen! Much harder to hit now. 🧙',

      '⏱️ Add a 30-second timer! Variables → "Make a Variable" → type Time → OK. Click the STAGE (small grey box to the LEFT of the sprite list). Events → "when 🚩 clicked". Variables → "set Score to 0" → snap under. Variables → "set Time to 30" → snap under. CONTROL → "repeat 30" → snap inside. Inside repeat: CONTROL → "wait 1 secs". VARIABLES → "change Time by -1". OUTSIDE and below the repeat: LOOKS → "say [Time\'s up! ⏰] for 2 secs". CONTROL → "stop [all]". Click 🚩 — 30 seconds on the clock! ⏱️',

      '🌟 CHALLENGE: Harry shouts the spell! Click HARRY → find an empty spot → Events → "when [space] key pressed" → Looks → "say [Expelliarmus! ⚡] for 0.5 secs". Now Harry shouts every time you shoot! 🧙',

      '⭐ SUPER CHALLENGE: Voldemort shoots back! Click DARK_CURSE. Events → "when 🚩 clicked". CONTROL → "forever". Inside: CONTROL → "wait [pick random 2 to 4] secs". Motion → "go to [Voldemort]". Motion → "glide 1 secs to x: 0 y: -170". Motion → "go to x: 0 y: 170". Click 🚩 — dark curses fire down! Can Harry dodge AND shoot back? 🔮 Show your teacher!',
    ],
  },

  // ── G3-4 Week 4: The Dueling Championship (Advanced) ────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 4,
    challenge: 'The Dueling Championship!',
    tagline: 'Code Voldemort\'s AI brain — HP bars, targeted curses, beat your personal best!',
    steps: [
      '🧙 Set up the dueling stage! Your sprite list has HARRY, VOLDEMORT, LIGHTNING_BOLT, and DARK_CURSE pre-loaded. Drag HARRY to the bottom-left. Drag VOLDEMORT to the top-centre. Click the landscape icon → "Choose a Backdrop" → search "Castle" or "Space" → click one. Stage set! ⚡',

      '⬅️➡️ Make Harry move smoothly! Click HARRY. Events → "when 🚩 clicked". CONTROL → "forever" → snap under. Inside the forever: CONTROL → "if...then" → SENSING → "key [right arrow] pressed?" into the diamond. Inside: MOTION → "change x by 12". Add a SECOND "if...then" below (still inside forever): SENSING → "key [left arrow] pressed?" → inside: MOTION → "change x by -12". Add a THIRD "if...then": SENSING → "touching [edge]?" → inside: MOTION → "go to x: 0 y: -130". Hold the arrow keys — Harry glides smoothly! ⬅️➡️',

      '❤️ Set up HP variables! Variables → "Make a Variable" for each: Harry_HP, Voldemort_HP, Score, Personal_Best → OK each time. Click the STAGE. Events → "when 🚩 clicked". Variables → "set Harry_HP to 3" → snap under. Variables → "set Voldemort_HP to 5" → snap under. Variables → "set Score to 0" → snap under. (Leave Personal_Best alone — it keeps its value between games!) Click 🚩 — HP bars and Score show on stage. ❤️',

      '⚡ Lightning bolt fires from Harry! Click LIGHTNING_BOLT. Events → "when [space] key pressed". Motion → "go to [Harry]" → click dropdown → choose Harry (bolt teleports to Harry\'s position!). Motion → "glide 0.2 secs to x: 0 y: 170" → snap under (fires up fast). Motion → "go to x: 0 y: -170" → snap last (resets). Press Space — bolt shoots from Harry straight up! 🚀',

      '💥 Lightning hits Voldemort! Click VOLDEMORT. Events → "when 🚩 clicked". CONTROL → "forever". Inside: "if...then" → SENSING → "touching [Lightning_Bolt]?" into diamond. Inside the if: Variables → "change Voldemort_HP by -1". CONTROL → "wait 0.3 secs" (stops one bolt counting as multiple hits — this is called invincibility frames!). Press Space and hit Voldemort — watch Voldemort_HP drop! 💥',

      '💀 Voldemort respawns when HP runs out! Still on VOLDEMORT, inside the forever — add a SECOND "if...then" BELOW the first. Operators → "[ ] < [ ]" → put Voldemort_HP on the left, type 1 on the right → drop into diamond. Inside: Variables → "change Score by 1". Variables → "set Voldemort_HP to 5". Motion → "go to [random position]". Looks → "say [I\'ll be back! 💀] for 0.5 secs". Shoot Voldemort 5 times — he respawns and Score goes up! 🎉',

      '🤖 Voldemort\'s AI — he shoots dark curses! You are now coding Voldemort\'s brain! Click DARK_CURSE. Events → "when 🚩 clicked". CONTROL → "forever". Inside: CONTROL → "wait [pick random 2 to 4] secs" (random timing = unpredictable AI). Motion → "go to [Voldemort]". Motion → "glide 0.8 secs to x: 0 y: -170". Motion → "go to x: 0 y: 170". Click 🚩 — curses fire every few seconds. This is Voldemort\'s BASIC AI. We\'ll make him smarter in the challenge steps! 🔮',

      '❤️ Harry takes damage! Click HARRY. Find an EMPTY spot. Drag a NEW "when 🚩 clicked" (separate — not connected to anything). CONTROL → "forever". Inside: "if...then" → SENSING → "touching [Dark_Curse]?" into diamond. Inside: Variables → "change Harry_HP by -1". Looks → "say [Ouch! 😣] for 0.5 secs". CONTROL → "wait 1 secs" (invincibility — one curse can\'t wipe you instantly). Add a SECOND "if...then" below: Operators → Harry_HP < 1 → inside: Looks → "say [Voldemort wins... 💀] for 2 secs". CONTROL → "stop [all]". Game over when HP hits 0! ❤️',

      '⏱️ 60-second timer + Personal Best! Click the STAGE. Add to your "when 🚩 clicked" stack: Variables → "set Time to 60" → snap under the HP lines. CONTROL → "repeat 60". Inside: CONTROL → "wait 1 secs". VARIABLES → "change Time by -1". OUTSIDE the repeat: CONTROL → "if...then" → Operators → Score > Personal_Best → inside: Variables → "set Personal_Best to Score". Looks → "say [🏆 New Personal Best!] for 2 secs". CONTROL → "stop [all]". Full 60-second duel — beat your own best score each time! ⏱️',

      '🎯 CHALLENGE: Make Voldemort AIM at Harry! Right now dark curses always fall to x:0 — the middle. Harry can stand to the side and never get hit! Click DARK_CURSE. Find the "glide 0.8 secs to x: 0 y: -170" block. Click the 0 in the x slot → DELETE it → SENSING → "x position of [Harry]" → click dropdown → choose Harry → drop it into the x slot. Now the curse flies to wherever Harry IS standing. Click 🚩 — curses chase Harry! You just upgraded Voldemort\'s AI from random to targeted. 🎯',

      '😤 SUPER CHALLENGE: Rage mode at low HP! When Voldemort is about to die he should panic and shoot faster. Click DARK_CURSE. Inside the forever, BEFORE the "wait [pick random 2 to 4] secs" — add "if...then" → Operators → Voldemort_HP < 2 → inside: Looks → "set [color] effect to 50" (curses glow!). CONTROL → "wait [pick random 0.5 to 1.5] secs". CONTROL → "stop [this script]" (skips the normal slower wait so it fires faster). When Voldemort hits 1 HP he goes into RAGE MODE — coloured curses, twice as fast. The final hit is the hardest! 💥 Show your teacher your full duel!',
    ],
  },
]

async function main() {
  console.log('Seeding W3 Harry Potter coding content...\n')

  for (const u of updates) {
    // Find the content item via curriculum join (same pattern as patch-coding-w3-monsters.mjs)
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
      console.warn(`⚠️  No coding item found for ${u.gradeBand} week ${u.weekNumber}`)
      continue
    }

    const updatedMeta = {
      ...(item.metadata),
      challenge: u.challenge,
      tagline:   u.tagline,
      steps:     u.steps,
    }

    await sql`
      UPDATE content_items
      SET metadata = ${JSON.stringify(updatedMeta)}
      WHERE id = ${item.id}
    `

    console.log(`✅ ${u.gradeBand} W${u.weekNumber} → "${u.challenge}" (${u.steps.length} steps)`)
  }

  await sql.end()
  console.log('\nDone!')
}

main().catch(e => { console.error(e); process.exit(1) })

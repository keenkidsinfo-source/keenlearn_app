/**
 * reset-w4-metadata.mjs
 * Hard-resets W4 coding metadata (starterUrl + steps) without spreading
 * existing metadata, avoiding the "Too many properties to enumerate" error.
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

const resets = [
  {
    gradeBand: 'g1-2',
    meta: {
      language: 'scratch',
      challenge: 'Harry vs Voldemort!',
      tagline: 'Shoot lightning bolts at Voldemort before time runs out!',
      starterUrl: '/scratch-starters/g1-2-w4-starter.sb3',
      steps: [
        `🧙 Place Harry!\n\nDrag HARRY to the bottom of the stage.\n\n✅ Harry is at the bottom!`,

        `🧙 Place Voldemort!\n\nDrag VOLDEMORT to the top of the stage.\n\n✅ They're facing each other!`,

        `🏰 Add a castle backdrop!\n\n① Click the landscape icon (bottom-right)\n② "Choose a Backdrop" → search "Castle" → click it\n\n✅ You're in Hogwarts!`,

        `➡️ Harry moves RIGHT!\n\nClick HARRY in the sprite list:\n① EVENTS → "when [right arrow] key pressed"\n② MOTION → "change x by 10" → snap under\n\n✅ Press right arrow — Harry moves!`,

        `⬅️ Harry moves LEFT!\n\nStill on HARRY — drag to an EMPTY spot:\n① EVENTS → "when [left arrow] key pressed"\n② MOTION → "change x by 10" → change 10 to -10\n\n✅ Press left arrow — Harry moves left!`,

        `⚡ Lightning starts at Harry!\n\nClick LIGHTNING_BOLT in the sprite list:\n① EVENTS → "when [space] key pressed"\n② MOTION → "go to x: 0 y: -130"\n\n✅ Bolt snaps to the bottom!`,

        `⚡ Lightning flies up!\n\nStill on LIGHTNING_BOLT — snap underneath:\n① MOTION → "glide 0.5 secs to x: 0 y: 160"\n② MOTION → "go to x: 0 y: -130"\n\n✅ Press Space — lightning fires and resets!`,

        `🏆 Make a Score variable!\n\n① VARIABLES → "Make a Variable" → type Score → OK\n\nA Score box appears on the stage!\n\n✅ Score is ready!`,

        `🧱 Start Voldemort's code!\n\nClick VOLDEMORT in the sprite list:\n① EVENTS → "when 🚩 clicked"\n② CONTROL → "forever" → snap under\n③ CONTROL → "if...then" → snap INSIDE forever\n\n✅ "If" block is ready for the next step!`,

        `💥 Voldemort reacts to lightning!\n\nFill in the "if" diamond:\n① SENSING → "touching [Lightning_Bolt]?" → into diamond\n\nInside the if:\n② VARIABLES → "change Score by 1"\n③ MOTION → "go to [random position]"\n\n✅ Press 🚩 + Space — hit him and score goes up!`,

        `🏃 Voldemort bounces!\n\nStill on VOLDEMORT — drag to an EMPTY spot:\n① EVENTS → "when 🚩 clicked"\n② CONTROL → "forever" → snap under\n③ MOTION → "move 3 steps" → inside\n④ MOTION → "if on edge, bounce" → inside\n\n✅ He bounces — much harder to hit!`,

        `⏱️ Make a Time variable!\n\n① VARIABLES → "Make a Variable" → type Time → OK\n\nClick the STAGE (left of sprite list):\n② EVENTS → "when 🚩 clicked"\n③ VARIABLES → "set Score to 0"\n④ VARIABLES → "set Time to 30"\n\n✅ Score and Time are set to 0 and 30!`,

        `⏱️ Countdown code!\n\nStill on the STAGE — snap under the set blocks:\n① CONTROL → "repeat 30"\n   Inside: CONTROL → "wait 1 secs"\n   Inside: VARIABLES → "change Time by -1"\n② After repeat: LOOKS → "say [Time's up! ⏰] for 2 secs"\n③ After repeat: CONTROL → "stop [all]"\n\n✅ Click 🚩 — timer counts down from 30!`,

        `⭐ CHALLENGE: Harry shouts!\n\nClick HARRY → find an empty spot:\n① EVENTS → "when [space] key pressed"\n② LOOKS → "say [Expelliarmus! ⚡] for 0.5 secs"\n\n✅ Harry shouts every time you shoot! 🧙`,

        `⭐⭐ SUPER CHALLENGE: Voldemort shoots back!\n\nClick DARK_CURSE:\n① EVENTS → "when 🚩 clicked"\n② CONTROL → "forever"\n   Inside: CONTROL → "wait [pick random 2 to 4] secs"\n   Inside: MOTION → "go to [Voldemort]"\n   Inside: MOTION → "glide 1 secs to x: 0 y: -170"\n   Inside: MOTION → "go to x: 0 y: 170"\n\n✅ Dark curses fire at Harry! Show your teacher! 🔮`,
      ],
    },
  },
  {
    gradeBand: 'g3-4',
    meta: {
      language: 'scratch',
      challenge: 'The Dueling Championship!',
      tagline: "Code Voldemort's AI brain — HP bars, targeted curses, beat your personal best!",
      starterUrl: '/scratch-starters/g3-4-w4-starter.sb3',
      steps: [
        `🧙 Place sprites!\n\n① Drag HARRY to the bottom-left\n② Drag VOLDEMORT to the top-centre\n\n✅ They're set up to duel!`,

        `🏰 Add a castle backdrop!\n\nLandscape icon → "Choose a Backdrop" → search "Castle" → click it\n\n✅ You're in Hogwarts! ⚡`,

        `⬅️➡️ Harry moves left & right!\n\nClick HARRY:\n① EVENTS → "when 🚩 clicked"\n② CONTROL → "forever"\n   Inside: if SENSING "key [right arrow] pressed?" → MOTION "change x by 12"\n   Inside: if SENSING "key [left arrow] pressed?" → MOTION "change x by -12"\n\n✅ Hold arrows — Harry moves!`,

        `🛡️ Harry bounces off edges!\n\nStill inside the same forever block:\n① if SENSING "touching [edge]?" → MOTION "go to x: 0 y: -130"\n\n✅ Harry can't escape the stage!`,

        `❤️ Make 4 variables!\n\nVARIABLES → "Make a Variable" for each:\n① Harry_HP\n② Voldemort_HP\n③ Score\n④ Personal_Best\n\n✅ All 4 appear on screen!`,

        `📋 Set starting values!\n\nClick the STAGE (left of sprite list):\n① EVENTS → "when 🚩 clicked"\n② VARIABLES → "set Harry_HP to 3"\n③ VARIABLES → "set Voldemort_HP to 5"\n④ VARIABLES → "set Score to 0"\n\n✅ Click 🚩 — HP bars and score ready!`,

        `⚡ Lightning fires from Harry!\n\nClick LIGHTNING_BOLT:\n① EVENTS → "when [space] key pressed"\n② MOTION → "go to [Harry]" (dropdown → Harry)\n③ MOTION → "glide 0.2 secs to x: 0 y: 170"\n④ MOTION → "go to x: 0 y: -170"\n\n✅ Press Space — bolt fires from Harry!`,

        `💥 Lightning hits Voldemort!\n\nClick VOLDEMORT:\n① EVENTS → "when 🚩 clicked" + CONTROL → "forever"\n   Inside: if SENSING "touching [Lightning_Bolt]?"\n   → VARIABLES "change Voldemort_HP by -1"\n   → CONTROL "wait 0.3 secs"\n\n✅ Aim and shoot — watch his HP drop!`,

        `💀 Voldemort respawns!\n\nStill on VOLDEMORT — 2nd "if" BELOW the first (inside forever):\n① Diamond: OPERATORS → Voldemort_HP < 1\n   → VARIABLES "change Score by 1"\n   → VARIABLES "set Voldemort_HP to 5"\n   → MOTION "go to [random position]"\n   → LOOKS "say [I'll be back! 💀] for 0.5 secs"\n\n✅ 5 hits — he respawns and score goes up!`,

        `🤖 Code Voldemort's AI!\n\nClick DARK_CURSE:\n① EVENTS → "when 🚩 clicked" + CONTROL → "forever"\n   Inside: CONTROL "wait [pick random 2 to 4] secs"\n   Inside: MOTION "go to [Voldemort]"\n   Inside: MOTION "glide 0.8 secs to x: 0 y: -170"\n   Inside: MOTION "go to x: 0 y: 170"\n\n✅ Curses fire at Harry! Voldemort's basic AI! 🔮`,

        `❤️ Harry takes damage!\n\nClick HARRY — find an EMPTY spot:\n① EVENTS → "when 🚩 clicked" + CONTROL → "forever"\n   if SENSING "touching [Dark_Curse]?"\n   → VARIABLES "change Harry_HP by -1"\n   → LOOKS "say [Ouch! 😣] for 0.5 secs"\n   → CONTROL "wait 1 secs"\n\n✅ A curse hits Harry — HP drops!`,

        `☠️ Game over when Harry runs out of HP!\n\nStill on HARRY — 2nd "if" below the first:\n① Diamond: OPERATORS → Harry_HP < 1\n   → LOOKS "say [Voldemort wins! 💀] for 2 secs"\n   → CONTROL "stop [all]"\n\n✅ 3 curse hits = game over!`,

        `⏱️ 60-second timer!\n\nClick the STAGE — add to bottom of "when 🚩 clicked":\n① VARIABLES → "set Time to 60"\n② CONTROL → "repeat 60"\n   Inside: CONTROL "wait 1 secs"\n   Inside: VARIABLES "change Time by -1"\n\n✅ Timer counts down from 60!`,

        `🏆 Personal Best!\n\nAfter the repeat (outside below it):\n① if OPERATORS Score > Personal_Best\n   → VARIABLES "set Personal_Best to Score"\n   → LOOKS "say [🏆 New Personal Best!] for 2 secs"\n② CONTROL → "stop [all]"\n\n✅ Beat your own record each round!`,

        `🎯 CHALLENGE: Curses AIM at Harry!\n\nClick DARK_CURSE. Find:\n"glide 0.8 secs to x: 0 y: -170"\n\n① Click the "0" in the x slot → delete it\n② SENSING → "x position of [Harry]" → drag into x slot\n\n✅ Curses now chase Harry wherever he stands! 🎯`,

        `😤 SUPER CHALLENGE: Rage mode!\n\nClick DARK_CURSE — BEFORE the wait inside forever:\n① if OPERATORS Voldemort_HP < 2\n   → LOOKS "set [color] effect to 50"\n   → CONTROL "wait [pick random 0.5 to 1.5] secs"\n   → CONTROL "stop [this script]"\n\n✅ At 1 HP — glowing curses fly twice as fast! Show your teacher! 💥`,
      ],
    },
  },
]

async function main() {
  console.log('Resetting W4 metadata (clean write, no spread)...\n')

  for (const r of resets) {
    const [item] = await sql`
      SELECT ci.id
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'coding'
        AND ci.grade_band = ${r.gradeBand}
        AND c.grade_band = ${r.gradeBand}
        AND c.week_number = 4
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
      LIMIT 1
    `

    if (!item) { console.warn(`⚠️  No W4 coding item for ${r.gradeBand}`); continue }

    await sql`
      UPDATE content_items
      SET metadata = ${JSON.stringify(r.meta)}
      WHERE id = ${item.id}
    `
    console.log(`✅ ${r.gradeBand} → reset with starterUrl + ${r.meta.steps.length} steps`)
  }

  await sql.end()
  console.log('\nDone! Hard-reload the coding page (Cmd+Shift+R) to see Harry Potter.')
}

main().catch(e => { console.error(e); process.exit(1) })

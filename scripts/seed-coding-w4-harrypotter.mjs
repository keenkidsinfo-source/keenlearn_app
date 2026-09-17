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
      `🧙 Set up the dueling arena!

① Drag HARRY to the bottom of the stage
② Drag VOLDEMORT to the top of the stage
③ Click the landscape icon (bottom-right corner)
④ Click "Choose a Backdrop" → search "Castle" → click it

✅ You should see Harry at the bottom and Voldemort at the top!`,

      `⬅️➡️ Make Harry move left and right!

Click HARRY in the sprite list, then:

① Yellow EVENTS → "when [right arrow] key pressed" → drag to white area
② Blue MOTION → "change x by 10" → snap underneath

Now for the LEFT — drag to an EMPTY spot (not connected!):
③ Yellow EVENTS → "when [left arrow] key pressed"
④ Blue MOTION → "change x by 10" → change 10 to -10

✅ Press the arrow keys — Harry slides!`,

      `⚡ Make Harry shoot lightning!

Click LIGHTNING_BOLT in the sprite list, then:

① Yellow EVENTS → "when [space] key pressed"
② Blue MOTION → "go to x: 0 y: -130" → snap under (bolt starts at bottom)
③ Blue MOTION → "glide 0.5 secs to x: 0 y: 160" → snap under (fires up!)
④ Blue MOTION → "go to x: 0 y: -130" → snap last (resets for next shot)

✅ Press Space — lightning flies up and comes back!`,

      `🏆 Make a Score counter!

① Orange VARIABLES → "Make a Variable" → type Score → OK
   A Score box appears on screen!

Now click VOLDEMORT in the sprite list:
② Yellow EVENTS → "when 🚩 clicked"
③ Orange CONTROL → "forever" → snap under
④ Orange CONTROL → "if...then" → snap INSIDE the forever

✅ You have the "if" block ready — next step fills it in!`,

      `💥 Voldemort jumps away when hit!

Still on VOLDEMORT — fill in the "if" block:

① Light-blue SENSING → "touching [mouse-pointer]?"
   → drag it into the diamond slot of the "if"
   → click the dropdown → change to "Lightning_Bolt"

Inside the if, add:
② Orange VARIABLES → "change Score by 1"
③ Blue MOTION → "go to [random position]"

✅ Click 🚩 and press Space — hit Voldemort and score goes up!`,

      `🧙 Make Voldemort bounce around!

Still on VOLDEMORT — find an EMPTY spot on the white area:

① Yellow EVENTS → "when 🚩 clicked" (drag to empty spot — NOT connected!)
② Orange CONTROL → "forever" → snap under
③ Blue MOTION → "move 3 steps" → snap inside
④ Blue MOTION → "if on edge, bounce" → snap inside

✅ Click 🚩 — Voldemort bounces! Much harder to hit now.`,

      `⏱️ Add a 30-second timer!

① Orange VARIABLES → "Make a Variable" → type Time → OK

Click the STAGE (small grey box to the LEFT of the sprite list):
② Yellow EVENTS → "when 🚩 clicked"
③ Orange VARIABLES → "set Score to 0" → snap under
④ Orange VARIABLES → "set Time to 30" → snap under
⑤ Orange CONTROL → "repeat 30" → snap under
   Inside repeat: CONTROL → "wait 1 secs"
   Inside repeat: VARIABLES → "change Time by -1"
⑥ After the repeat (snap OUTSIDE below it):
   Purple LOOKS → "say [Time's up! ⏰] for 2 secs"
   Orange CONTROL → "stop [all]"

✅ Click 🚩 — the timer counts down from 30!`,

      `⭐ CHALLENGE: Harry shouts the spell!

Click HARRY → find an empty spot → build this stack:

① Yellow EVENTS → "when [space] key pressed"
② Purple LOOKS → "say [Expelliarmus! ⚡] for 0.5 secs"

✅ Harry shouts every time you shoot! 🧙`,

      `⭐⭐ SUPER CHALLENGE: Voldemort shoots back!

Click DARK_CURSE in the sprite list, then:

① Yellow EVENTS → "when 🚩 clicked"
② Orange CONTROL → "forever" → snap under
   Inside forever:
③ CONTROL → "wait [pick random 2 to 4] secs"
④ Blue MOTION → "go to [Voldemort]"
⑤ Blue MOTION → "glide 1 secs to x: 0 y: -170"
⑥ Blue MOTION → "go to x: 0 y: 170"

✅ Click 🚩 — dark curses fire down at Harry! Show your teacher! 🔮`,
    ],
  },

  // ── G3-4 Week 4: The Dueling Championship (Advanced) ────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 4,
    challenge: 'The Dueling Championship!',
    tagline: "Code Voldemort's AI brain — HP bars, targeted curses, beat your personal best!",
    steps: [
      `🧙 Set up the dueling stage!

① Drag HARRY to the bottom-left of the stage
② Drag VOLDEMORT to the top-centre
③ Click the landscape icon (bottom-right corner)
④ "Choose a Backdrop" → search "Castle" → click it

✅ Harry at the bottom, Voldemort at the top — let the duel begin! ⚡`,

      `⬅️➡️ Make Harry move smoothly!

Click HARRY in the sprite list, then build ONE stack:

① Yellow EVENTS → "when 🚩 clicked"
② Orange CONTROL → "forever" → snap under
   Inside the forever, add 3 "if...then" blocks:

③ CONTROL → "if...then"
   Light-blue SENSING → "key [right arrow] pressed?" → into diamond
   Inside: Blue MOTION → "change x by 12"

④ CONTROL → "if...then" (below the first, still inside forever)
   SENSING → "key [left arrow] pressed?" → into diamond
   Inside: MOTION → "change x by -12"

⑤ CONTROL → "if...then" (below that)
   SENSING → "touching [edge]?" → into diamond
   Inside: MOTION → "go to x: 0 y: -130"

✅ Hold the arrow keys — Harry glides smoothly!`,

      `❤️ Set up HP bars and score!

Make 4 variables (orange VARIABLES → "Make a Variable" for each):
① Harry_HP   → OK
② Voldemort_HP → OK
③ Score → OK
④ Personal_Best → OK

Now click the STAGE (grey box to the LEFT of the sprite list):
⑤ Yellow EVENTS → "when 🚩 clicked"
⑥ VARIABLES → "set Harry_HP to 3" → snap under
⑦ VARIABLES → "set Voldemort_HP to 5" → snap under
⑧ VARIABLES → "set Score to 0" → snap under
   (Leave Personal_Best alone — it saves your best between games!)

✅ Click 🚩 — HP bars and Score appear on screen!`,

      `⚡ Make lightning fire from Harry!

Click LIGHTNING_BOLT in the sprite list:

① Yellow EVENTS → "when [space] key pressed"
② Blue MOTION → "go to [Harry]"
   → click the dropdown → choose Harry
   (bolt teleports to wherever Harry is standing!)
③ MOTION → "glide 0.2 secs to x: 0 y: 170" → snap under
④ MOTION → "go to x: 0 y: -170" → snap last (resets)

✅ Press Space — bolt fires from Harry straight up!`,

      `💥 Lightning hits Voldemort!

Click VOLDEMORT in the sprite list:

① Yellow EVENTS → "when 🚩 clicked"
② Orange CONTROL → "forever" → snap under
   Inside the forever:
③ CONTROL → "if...then"
   SENSING → "touching [Lightning_Bolt]?" → into diamond
   Inside the if:
④ VARIABLES → "change Voldemort_HP by -1"
⑤ CONTROL → "wait 0.3 secs"
   (this stops one bolt from counting as 3 hits)

✅ Press Space and aim at Voldemort — watch the HP drop!`,

      `💀 Voldemort respawns when HP reaches 0!

Still on VOLDEMORT — add a SECOND "if...then" BELOW the first (inside the forever):

① Orange OPERATORS → "[ ] < [ ]" block
   → put Voldemort_HP on the left, type 1 on the right
   → drop into the diamond slot
   Inside this if:
② VARIABLES → "change Score by 1"
③ VARIABLES → "set Voldemort_HP to 5"
④ MOTION → "go to [random position]"
⑤ LOOKS → "say [I'll be back! 💀] for 0.5 secs"

✅ Shoot Voldemort 5 times — he respawns and your score goes up!`,

      `🤖 Code Voldemort's AI — he shoots back!

You are coding Voldemort's brain! Click DARK_CURSE:

① Yellow EVENTS → "when 🚩 clicked"
② Orange CONTROL → "forever" → snap under
   Inside the forever:
③ CONTROL → "wait [pick random 2 to 4] secs"
   (random timing makes the AI unpredictable!)
④ MOTION → "go to [Voldemort]"
⑤ MOTION → "glide 0.8 secs to x: 0 y: -170"
⑥ MOTION → "go to x: 0 y: 170"

✅ Click 🚩 — dark curses fire every few seconds! This is Voldemort's basic AI. 🔮`,

      `❤️ Harry takes damage from curses!

Click HARRY → find an EMPTY spot on the white area:

Build a SEPARATE stack (not connected to the first one):
① Yellow EVENTS → "when 🚩 clicked"
② CONTROL → "forever"
   Inside:
③ CONTROL → "if...then"
   SENSING → "touching [Dark_Curse]?" → into diamond
   Inside the if:
④ VARIABLES → "change Harry_HP by -1"
⑤ LOOKS → "say [Ouch! 😣] for 0.5 secs"
⑥ CONTROL → "wait 1 secs"
   (gives Harry 1 second where he can't be hit again)

Below the first if, add a second:
⑦ CONTROL → "if...then"
   OPERATORS → Harry_HP < 1 → into diamond
   Inside: LOOKS → "say [Voldemort wins! 💀] for 2 secs"
   Then: CONTROL → "stop [all]"

✅ Let a curse hit Harry — HP drops! 3 hits and it's game over.`,

      `⏱️ 60-second timer + Personal Best!

Click the STAGE — add to the bottom of your "when 🚩 clicked" stack:

① VARIABLES → "set Time to 60" → snap under the HP lines
② CONTROL → "repeat 60"
   Inside repeat:
   CONTROL → "wait 1 secs"
   VARIABLES → "change Time by -1"
③ After the repeat (snap OUTSIDE below it):
   CONTROL → "if...then"
   OPERATORS → Score > Personal_Best → into diamond
   Inside: VARIABLES → "set Personal_Best to Score"
   Then: LOOKS → "say [🏆 New Personal Best!] for 2 secs"
④ CONTROL → "stop [all]"

✅ 60-second duel! Beat your own best score each round.`,

      `🎯 CHALLENGE: Make Voldemort AIM at Harry!

Right now curses always fall to x: 0 (the middle).
Harry can stand to the side and never get hit!

Click DARK_CURSE. Find this block:
"glide 0.8 secs to x: 0 y: -170"

① Click the "0" in the x slot → delete it
② Light-blue SENSING → "x position of [Harry]"
   → click dropdown → choose Harry
   → drag it into the x slot

Now the block reads: "glide 0.8 secs to x: (x position of Harry) y: -170"

✅ Click 🚩 — curses now fly to wherever Harry is standing! You upgraded the AI to targeted mode. 🎯`,

      `😤 SUPER CHALLENGE: Rage mode!

When Voldemort is almost dead, he panics and shoots FASTER.

Click DARK_CURSE. Inside the forever, BEFORE the "wait [pick random 2 to 4] secs":

① CONTROL → "if...then"
   OPERATORS → Voldemort_HP < 2 → into diamond
   Inside the if:
② LOOKS → "set [color] effect to 50" (curses glow red!)
③ CONTROL → "wait [pick random 0.5 to 1.5] secs"
④ CONTROL → "stop [this script]"
   (this skips the slower normal wait — so he fires twice as fast!)

✅ Click 🚩 — when Voldemort hits 1 HP, glowing curses fly twice as fast!
The final hit is the hardest. Show your teacher your full duel! 💥`,
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

/**
 * seed-build-w1.mjs
 * Seeds Week 1 build content for Aug 17 week — BOTH teacher and student accounts see this.
 *
 * Source: Google Doc KeenKids_BuildDay_Manual_August2025_v5
 *   G1-2 Build: Cable Car (Week 1, Mon Aug 18)
 *   G3-4 Build: Well Pulley (Week 1, Mon Aug 18)
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/seed-build-w1.mjs
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

// ── Build content from KeenKids_BuildDay_Manual_August2025_v5 ──────────────────
// Steps formatted as { emoji, title, text, tip? } for StepViewer
// Simple machine context included age-appropriately in each track

const builds = [
  // ── G1-2 Week 1: Cable Car ───────────────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    title: 'Cable Car',
    simpleMachine: 'Pulley',
    tagline: 'Build a paper cup that slides down a zip line and carries cargo!',
    // resultFields defines the student submission form labels for this project.
    // Copy this block into every future seed script and customise for that build.
    resultFields: {
      a:               { label: 'Round 1 — paperclips carried',     key: 'round1Clips'   },
      b:               { label: 'After your fix — clips carried',    key: 'afterFixClips' },
      c:               { label: 'Your BEST — maximum paperclips 🏆', key: 'maxClips'      },
      unit:            'clips',
      leaderboard:     'more',   // 'more' = higher score wins, 'less' = lower score wins
      showLeaderboard: false,    // hide for G1-2
    },
    steps: [
      {
        emoji: '🚡',
        title: 'Meet your materials',
        text: 'You have: 1 paper cup, 1 wide straw (already on the zip line!), string, paperclips, tape, and scissors. Your straw is your PULLEY — it lets your cup roll along the line!',
        tip: 'A PULLEY is a simple machine that helps things move along a line. The straw is your pulley today!',
      },
      {
        emoji: '✂️',
        title: 'Punch the holes',
        text: 'Use a pencil to poke 2 holes near the TOP of your cup — one on the LEFT side and one on the RIGHT side, directly across from each other. Like ears on your cup!',
        tip: 'Make the holes as close to the rim as possible so your cup hangs straight.',
      },
      {
        emoji: '🧵',
        title: 'Thread the string',
        text: 'Cut 30cm of string. Push one end through the LEFT hole from the OUTSIDE going IN. Pull it across the inside of the cup, then push it out through the RIGHT hole from the INSIDE going OUT. Both ends should hang outside the cup.',
      },
      {
        emoji: '🎪',
        title: 'Hook onto the straw',
        text: 'Hold your cup under the straw. Bring BOTH string ends UP — one on the LEFT side of the straw, one on the RIGHT side. The strings run up past either side of the straw. Hold both ends above the straw — don\'t let go yet!',
        tip: 'The cup will hang below the straw like a pendulum — gravity keeps it upright even on the diagonal zip line.',
      },
      {
        emoji: '🪢',
        title: 'Tie the knots',
        text: 'Tie the two string ends TOGETHER in a knot on TOP of the straw. Pull tight! The straw is now locked inside the loop of string and the cup hangs below. Check the cup hangs level (not tilting).',
        tip: 'If the cup tilts, untie and adjust so there is equal string length on both sides before re-tying.',
      },
      {
        emoji: '🩹',
        title: 'Reinforce the holes',
        text: 'Put a small piece of tape over each hole — inside and outside. This stops the string from tearing through when you add cargo!',
      },
      {
        emoji: '🚦',
        title: 'Dry test — no cargo yet',
        text: 'Gently slide your cup to the top of the zip line and let go. Does it slide all the way down? It should! If it stops, check that the straw can move freely and nothing is caught.',
      },
      {
        emoji: '📎',
        title: 'Cargo Challenge Round 1',
        text: 'Place 3 paperclips in your cup as cargo. Let it go from the top — does it still make it all the way down? Write YES or NO on the class chart!',
        tip: 'GRAVITY is pulling your cargo down. The HEAVIER the cargo, the more gravity pulls — but too heavy and friction wins!',
      },
      {
        emoji: '📈',
        title: 'Cargo Challenge Round 2 — push the limit',
        text: 'Add paperclips ONE at a time. After each one, test the zip line. Keep going until your cable car stops before reaching the end. Record your maximum cargo on the class chart — how many paperclips?',
      },
      {
        emoji: '🔧',
        title: 'Fix time!',
        text: 'If your cable car stopped before the end, figure out why. Is the cup tilting? Is cargo in one spot? Is the string catching on something? Make ONE fix and retest.',
        tip: 'FRICTION is what slows things down. Smoother movement = less friction = more cargo!',
      },
      {
        emoji: '📊',
        title: 'Update the class chart',
        text: 'Write your new max cargo on the class chart after your fix. Did your fix improve it? Compare with your classmates — who has the most cargo-carrying cable car?',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "My cable car carried ___ paperclips. I changed ___ and it ___." Remember: PULLEY, GRAVITY, LOAD, FRICTION!',
        tip: 'Real cable cars and ski lifts use the same pulley system as your cup today!',
      },
    ],
  },

  // ── G3-4 Week 1: Well Pulley ─────────────────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    title: 'Well Pulley',
    simpleMachine: 'Wheel & Axle',
    tagline: 'Build a working well with a crank that raises and lowers a bucket!',
    resultFields: {
      a:               { label: 'No cargo — how many cranks?',        key: 'cranksNoLoad'   },
      b:               { label: '3 pennies in bucket — cranks?',      key: 'cranksWithLoad' },
      c:               { label: 'After improvement — cranks 🏆',      key: 'cranksImproved' },
      unit:            'cranks',
      leaderboard:     'less',   // fewer cranks = better engineering
      showLeaderboard: true,
    },
    steps: [
      {
        emoji: '⚙️',
        title: 'The science: Wheel & Axle',
        text: 'A WHEEL & AXLE is a simple machine! The crank (wheel) turns the skewer (axle), which winds the string and lifts the bucket. More crank = more rotation = bucket rises. You\'ll build one today!',
        tip: 'Real-world examples: water wells, fishing reels, winches, and window blinds all use wheel & axle!',
      },
      {
        emoji: '🏗️',
        title: 'Build the well body',
        text: 'Take your 2 large cardboard pieces. Stack them together. Roll them tightly into a cylinder (tube shape) — the double layer makes it rigid. Tape the seam firmly along the FULL length. The cylinder should hold its shape without springing open.',
        tip: 'Roll from a corner for a tighter cylinder. Tape as you go, not just at the end.',
      },
      {
        emoji: '🔲',
        title: 'Attach the base',
        text: 'Stand your cylinder upright on the flat cardboard square. Tape around the outside edge where the cylinder meets the base — go all the way around. Push the cylinder sideways to test: it should NOT tip over.',
      },
      {
        emoji: '🪵',
        title: 'Add the uprights',
        text: 'Push one popsicle stick firmly into the LEFT side of your cylinder so it stands 8–10 cm above the top. Repeat on the RIGHT side. Then use a pencil tip to punch a small hole near the TOP of each stick — this is where the skewer will thread through.',
        tip: 'Make the holes as level as possible on both sticks so the skewer sits straight across.',
      },
      {
        emoji: '🔩',
        title: 'Install the axle',
        text: 'Thread the wooden skewer through the hole in the LEFT stick, straight across the top of the well, and out through the hole in the RIGHT stick. It should stick out a few centimetres on each side. Spin it with your fingers — it should rotate freely inside the holes.',
        tip: 'If it\'s too tight, gently wiggle the skewer to widen the holes slightly. The axle MUST spin freely!',
      },
      {
        emoji: '🧵',
        title: 'Attach the string',
        text: 'Put a small dot of glue on the CENTRE of the skewer. Press one end of the string firmly into the glue and hold for 10 seconds. Once it grips, wind the string around the skewer 4–5 times in the SAME direction. Let the rest hang down into the well.',
        tip: 'Winding in one direction means it unwinds cleanly when you reverse the crank.',
      },
      {
        emoji: '🪣',
        title: 'Make the bucket',
        text: 'Roll the small corrugated piece into a mini cylinder and tape the seam. Bend a large paperclip into an S-hook shape. Hook one end through the TOP RIM of the bucket. Hook the other end onto the hanging end of your string. The bucket should hang level below the well.',
        tip: 'If the bucket tilts, reposition the paperclip hook to a different spot on the rim until it balances.',
      },
      {
        emoji: '🎡',
        title: 'Add the crank',
        text: 'Cut a strip of cardstock 2 cm wide and 15 cm long. Place one short end against the tip of the skewer and tape it firmly — wrap tape around 2–3 times so it grips. The strip sticks out straight like a flag. To use: pinch the FAR END and sweep it in a full circle. The skewer spins with it and winds up the string!',
        tip: 'If the strip spins loose, add more tape. Cardstock is stiff enough for light loads as long as the tape holds.',
      },
      {
        emoji: '✅',
        title: 'Test your well!',
        text: 'Turn the crank clockwise — does the string wind up and the bucket rise? Turn it counter-clockwise — does the bucket lower? Both directions should work smoothly. If not, ask your teacher for an INSTRUCTOR CHECK.',
      },
      {
        emoji: '📊',
        title: 'Count the cranks',
        text: 'Lower your bucket all the way down. Count how many FULL turns of the crank it takes to raise the bucket completely to the top. Record your number on the class chart.',
      },
      {
        emoji: '🪙',
        title: 'Cargo test',
        text: 'Place 3 pennies in your bucket as cargo. Count the cranks to raise it now. Does it feel harder? Does it take more cranks?',
        tip: 'MECHANICAL ADVANTAGE means you can lift a heavy load with less force — but you may need more cranks!',
      },
      {
        emoji: '🔧',
        title: 'Improve it — fewer cranks!',
        text: 'Challenge: can you reduce the number of cranks to raise the bucket? Pick ONE change to try: (A) Pre-wind — wind extra string onto the skewer before you start, so the bucket has less distance to travel. (B) Longer crank — tape a longer cardstock strip to the skewer end so your hand sweeps a bigger circle each turn. (C) Wider axle — wrap extra tape around the centre of the skewer to make it thicker, so more string winds per turn. Make your one change and recount. Record your new number!',
        tip: 'Only change ONE thing at a time — otherwise you won\'t know which change made the difference!',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "It took ___ cranks before and ___ cranks after my improvement." Key vocab: WHEEL, AXLE, CRANK, MECHANICAL ADVANTAGE, LOAD, ROTATION.',
        tip: 'Real wells, fishing reels, winches, and cranes all use wheel & axle. You just built one!',
      },
    ],
  },
]

async function run() {
  // ── Show what's in DB for build W1 ──────────────────────────────────────────
  console.log('\n── Build content items in DB (Week 1) ──')
  const existing = await sql`
    SELECT ci.id, ci.title, ci.grade_band, ci.subject, ci.step_count,
           c.week_number, c.grade_band as curr_grade,
           EXISTS (
             SELECT 1 FROM classroom_curriculum ccl WHERE ccl.curriculum_id = c.id
           ) as is_assigned
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'build'
      AND c.week_number = 1
    ORDER BY ci.grade_band, ci.created_at DESC
  `
  if (existing.length === 0) {
    console.log('  No build content items found for Week 1 — will INSERT.')
  } else {
    for (const r of existing) {
      console.log(`  ${r.grade_band} W${r.week_number} | ${r.is_assigned ? '✅ ASSIGNED' : '  orphan  '} | "${r.title}" | ${r.step_count ?? 0} steps`)
    }
  }

  for (const build of builds) {
    const imgFolder = build.gradeBand === 'g1-2' ? 'cable-car' : 'well-pulley'
    const stepsWithImages = build.steps.map((step, i) => ({
      ...step,
      image: `/images/build/${imgFolder}/step-${String(i + 1).padStart(2, '0')}.svg`,
    }))
    const metadata = {
      simpleMachine: build.simpleMachine,
      tagline: build.tagline,
      resultFields: build.resultFields,
      steps: stepsWithImages,
    }
    const stepCount = stepsWithImages.length

    // Try to find existing assigned build content item for this week + grade
    const items = await sql`
      SELECT ci.id, ci.title, ci.metadata, ci.created_at
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'build'
        AND ci.grade_band = ${build.gradeBand}
        AND c.week_number = ${build.weekNumber}
        AND c.grade_band = ${build.gradeBand}
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
    `

    if (items.length === 0) {
      // Fallback: no classroom assignment, pick newest build content item for this week
      console.warn(`⚠  No assigned classroom build found for ${build.gradeBand} week ${build.weekNumber} — trying fallback`)
      const [item] = await sql`
        SELECT ci.id, ci.title FROM content_items ci
        JOIN curriculum_content cc ON cc.content_item_id = ci.id
        JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
        JOIN curriculum c ON c.id = cd.curriculum_id
        WHERE ci.subject = 'build'
          AND ci.grade_band = ${build.gradeBand}
          AND c.week_number = ${build.weekNumber}
        ORDER BY ci.created_at DESC LIMIT 1
      `
      if (!item) {
        console.warn(`  Still not found for ${build.gradeBand} W${build.weekNumber} — skipping`)
        continue
      }
      await sql`
        UPDATE content_items
        SET title = ${build.title}, metadata = ${metadata}, step_count = ${stepCount}
        WHERE id = ${item.id}
      `
      console.log(`✓ Updated (fallback): ${build.gradeBand} W${build.weekNumber} — "${build.title}" (${stepCount} steps)`)
      continue
    }

    for (const item of items) {
      await sql`
        UPDATE content_items
        SET title = ${build.title}, metadata = ${metadata}, step_count = ${stepCount}
        WHERE id = ${item.id}
      `
      console.log(`✓ Updated: ${build.gradeBand} W${build.weekNumber} — "${build.title}" (${stepCount} steps, was: "${item.title}")`)
    }
  }

  await sql.end()
  console.log('\n✅ Done! W1 build content seeded (Cable Car + Well Pulley).')
  console.log('   Both teacher AND student accounts will see text steps.')
  console.log('   Build step images remain gated to teacher/admin only.')
}

run().catch(e => { console.error(e); process.exit(1) })

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
    tagline: 'Build a gondola cup that slides down a zip line and carries small rocks!',
    resultFields: {
      a:               { label: 'Minimum rocks to slide all the way', key: 'minRocks'  },
      b:               { label: 'Maximum rocks carried 🏆',           key: 'maxRocks'  },
      unit:            'rocks',
      leaderboard:     'more',   // higher max = better
      showLeaderboard: false,
    },
    steps: [
      {
        emoji: '🚡',
        title: 'Meet your materials',
        text: 'You have: 1 paper cup (with 2 holes in the rim), 1 wide striped straw (already on the zip line!), 2 pieces of string, small rocks, tape, and scissors. Each string goes through ONE hole in the cup and ties to one end of the straw.',
        tip: 'A PULLEY is a simple machine that helps things move along a line. The straw slides along the zip line and carries your cup gondola!',
      },
      {
        emoji: '✂️',
        title: 'Cut two strings (30 cm each)',
        text: 'Cut TWO separate pieces of string, each about 30 cm long — roughly from your wrist to your elbow. Hold them side by side before cutting to make sure they are the SAME length.',
        tip: 'Equal length strings = cup hangs level. If one string is longer the cup will tilt and the cargo will fall out.',
      },
      {
        emoji: '🔵',
        title: 'Punch 2 holes in the cup rim',
        text: 'Use a pencil tip to punch ONE small hole on each side of the cup rim — they should be directly opposite each other (left side and right side). The hole must be big enough to thread the string through.',
        tip: 'Make the hole near the TOP of the rim, not in the middle of the cup. Push a pencil tip through gently with a small twist.',
      },
      {
        emoji: '🧵',
        title: 'Thread String 1 — left hole, knot inside',
        text: 'Push one end of String 1 through the LEFT hole from OUTSIDE to INSIDE. Pull it through until you have about 5 cm inside the cup. Tie a big double knot on the INSIDE end so it cannot pull back through. Tug hard to test!',
        tip: 'The knot must be bigger than the hole so it cannot pull back through. Tie it twice (double knot) and tug hard to test.',
      },
      {
        emoji: '🧵',
        title: 'Thread String 2 — right hole, knot inside',
        text: 'Do the same on the RIGHT side: push String 2 through the RIGHT hole from outside to inside, pull through ~5 cm, and tie a big double knot on the inside. You now have TWO strings — one anchored on each side inside the cup.',
        tip: 'Tug both strings from outside to make sure neither knot pulls through. Both knots must hold firmly before moving on.',
      },
      {
        emoji: '🎪',
        title: 'Tie String 1 to the LEFT end of the straw',
        text: 'Take the outside end of String 1 (coming from the left hole). Tie it firmly to the LEFT end of the straw with a double knot right at the very tip. Pull TIGHT and tug hard to test — it must not slip or slide along the straw.',
        tip: 'Wrap the string around the straw end twice before knotting. The knot must sit right at the tip so it does not slide.',
      },
      {
        emoji: '🎪',
        title: 'Tie String 2 to the RIGHT end — gondola done!',
        text: 'Take the outside end of String 2 (coming from the right hole). Tie it to the RIGHT end of the straw — double knot at the very tip. The cup should now hang level below the straw like a gondola, with one string on each side!',
        tip: 'Strings run straight from straw ends, through the cup holes, with knots inside anchoring the cup. The cup interior stays clear for rocks!',
      },
      {
        emoji: '⚖️',
        title: 'Check the cup hangs level',
        text: 'Look at your cup from the side. Is it hanging flat and level? If it tilts: on the LOW side, untie the inside knot, pull the string a tiny bit LESS through the hole, and re-knot. This shortens that side and levels the cup.',
        tip: 'To level the cup: on the LOW side, untie the inside knot, pull slightly less string through, re-knot. Repeat until level.',
      },
      {
        emoji: '🚦',
        title: 'Slide test — does it move freely?',
        text: 'Gently push the cup along the zip line. Does the straw slide smoothly from one end to the other? If it catches, check that the strings are NOT twisted — they must run straight from the straw ends down to the cup holes.',
        tip: 'The straw must slide freely for a fair test. Untangle any twisted strings and make sure knots sit at the very ENDS of the straw.',
      },
      {
        emoji: '🧪',
        title: 'Round 1 — release the empty cup',
        text: 'Put the empty cup at the HIGH end and let go. Does it slide all the way down? Most empty cups STOP in the middle — that is correct! Gravity vs Friction: not enough weight yet. Record YES or NO on the class chart.',
        tip: 'GRAVITY pulls the cup down. FRICTION holds the straw in place. With no cargo, friction wins!',
      },
      {
        emoji: '📊',
        title: 'Round 2 — find your minimum',
        text: 'Add rocks ONE at a time into the cup. After each rock, release from the HIGH end. Keep going until the cup slides ALL THE WAY to the low end. Count how many rocks that took — that is your MINIMUM! Write it on the class chart.',
        tip: 'The minimum is the smallest number of rocks that gives gravity enough force to overcome friction.',
      },
      {
        emoji: '🏎️',
        title: 'Round 3 — speed race + share out!',
        text: 'You found your minimum. Now add 3 MORE rocks on top of that number. Release from the HIGH end — is it faster? More weight = more gravity = beats friction even harder and goes faster! Share out to the class: "My minimum was ___ rocks. With more weight it zoomed!"',
        tip: 'More rocks always means faster — gravity keeps winning once it beats friction! Real cable cars in San Francisco use the same pulley principle as your cup.',
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
        text: 'Push one popsicle stick DEEP into the corrugated ridges on the LEFT side of the cylinder top — the ridges grip it naturally, no tape needed. It should stand firmly about 8–10 cm above the top. Repeat on the RIGHT side.',
        tip: 'The corrugated ridges grip the stick like a slot. Push straight down firmly. It should not wobble.',
      },
      {
        emoji: '🔩',
        title: 'Install the axle',
        text: 'Rest the wooden skewer horizontally across the TOP of both uprights. Tape each end LIGHTLY to the upright — just enough to keep it in place. Then spin the skewer with your fingers — it MUST still rotate freely!',
        tip: 'If the tape is too tight the skewer won\'t spin. Use the smallest piece of tape that holds it. The axle MUST spin freely!',
      },
      {
        emoji: '🧵',
        title: 'Attach the string',
        text: 'Tie one end of the string to the CENTRE of the skewer with a tight knot. Wind the string around the skewer 3–4 times in the SAME direction. Leave a free end hanging down into the well.',
        tip: 'Winding in one direction means it unwinds cleanly when you reverse the crank. Make the knot very tight so it doesn\'t slip.',
      },
      {
        emoji: '🪣',
        title: 'Make the bucket',
        text: 'Roll the small corrugated piece into a mini cylinder and tape the seam. Tie 3 short pieces of string around the RIM of the bucket — equally spaced (like a triangle). Knot all 3 strings together at the top. Tie this top knot to the free hanging end of your axle string.',
        tip: 'Three equally spaced strings keep the bucket hanging level. Adjust the knot heights until the bucket hangs flat.',
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

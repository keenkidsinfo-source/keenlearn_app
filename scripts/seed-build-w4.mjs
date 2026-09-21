/**
 * seed-build-w4.mjs
 * Seeds Week 4 build content — Paper Fan with Paper Cup (Sep 21)
 *
 * G1-2 + G3-4: Same craft — paper fan powered by a wound string mechanism
 *
 * Source: Paper Fan.pdf (13 slides extracted as step images)
 * Images: /public/images/build/paper-fan/step-01.jpg through step-12.jpg
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/seed-build-w4.mjs
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

const fanSteps = [
  {
    emoji: '✂️',
    title: 'Cut out your fan blade',
    text: 'You\'ll get a piece of paper already cut to size. Cut it into a fan blade shape — like a wide rounded leaf, wider at the top and narrower at the bottom. Make it your own!',
    tip: 'The bigger and wider your fan blade, the more air it will push when it spins!',
    image: '/images/build/paper-fan/step-01.jpg',
  },
  {
    emoji: '🪡',
    title: 'Get one skewer and one strip of paper',
    text: 'You need: one bamboo skewer and one narrow strip of paper (about 2 cm wide). These will be the handle and the winding mechanism for your fan.',
    tip: 'Keep the strip of paper flat for now — you\'ll wrap it tightly around the skewer in a moment.',
    image: '/images/build/paper-fan/step-02.jpg',
  },
  {
    emoji: '📌',
    title: 'Tape the skewer to the edge of the paper strip',
    text: 'Lay the paper strip flat. Place the skewer along one long edge of the strip. Tape the skewer firmly to the edge so it won\'t slide out when you wrap.',
    tip: 'Press the tape down on both sides. If the skewer wiggles loose during wrapping, your fan won\'t spin properly.',
    image: '/images/build/paper-fan/step-03.jpg',
  },
  {
    emoji: '🌀',
    title: 'Wrap the paper around the skewer',
    text: 'Roll the paper strip tightly around the skewer, all the way from one end to the other. When you reach the end, tape it down so it stays wrapped.',
    tip: 'Wrap as tightly as you can — a loose wrap means the paper slips instead of turning the skewer.',
    image: '/images/build/paper-fan/step-04.jpg',
  },
  {
    emoji: '⭕',
    title: 'Draw a circle and cut it out',
    text: 'Place the paper cup upside down on a fresh piece of paper. Trace around the rim to draw a circle. Cut the circle out — this becomes the base cap that holds the fan.',
    tip: 'Cut just inside the pencil line so the circle fits snugly inside the cup opening.',
    image: '/images/build/paper-fan/step-05.jpg',
  },
  {
    emoji: '🔧',
    title: 'Poke holes in the cup',
    text: 'Use a push pin on top of a sponge or folded rag to poke two holes in the paper cup: one at the TOP (centre of the base) and one on the SIDE near the bottom.',
    tip: 'Rest the cup on the sponge so the pin goes through cleanly. Make the holes just big enough for the skewer to slide through.',
    image: '/images/build/paper-fan/step-06.jpg',
  },
  {
    emoji: '⬇️',
    title: 'Poke the skewer through the top of the cup',
    text: 'Push the skewer (with the paper wrapped around it) through the TOP hole of the cup from outside going in. The wrapped part should sit inside the cup.',
    tip: 'The skewer should fit snugly but still be able to rotate. If it\'s too tight, gently widen the hole slightly.',
    image: '/images/build/paper-fan/step-07.jpg',
  },
  {
    emoji: '🪢',
    title: 'Tie a double knot on the skewer',
    text: 'Thread a string onto the skewer and tie a strong DOUBLE KNOT right at the bottom end of the skewer. Tug it firmly — it must not slip.',
    tip: 'A single knot will slide off the moment you wind the string. Double-knot it, then give it a real tug to test it!',
    image: '/images/build/paper-fan/step-08.jpg',
  },
  {
    emoji: '🌀',
    title: 'Wind the string through the side hole',
    text: 'Wind the string around the skewer several times, then thread the end of the string through the SIDE hole in the cup and out the other side.',
    tip: 'Wind it in the same direction each time — clockwise all the way. Mixed directions mean the string tangles instead of pulling.',
    image: '/images/build/paper-fan/step-09.jpg',
  },
  {
    emoji: '🔩',
    title: 'Attach the circle cap to the bottom',
    text: 'Poke the skewer through the circle you cut earlier. Tape the circle onto the BOTTOM of the cup — it holds everything together. Cut off any skewer sticking out past the circle, but leave a small tip poking out.',
    tip: 'The skewer tip needs to poke out just a little so it can rest against a surface as the fan spins.',
    image: '/images/build/paper-fan/step-10.jpg',
  },
  {
    emoji: '🌬️',
    title: 'Attach the fan on top',
    text: 'Stick the TOP of the skewer to the centre of the fan blade you cut in Step 1. The fan blade sits on top — just stick and press, no poking through!',
    tip: 'Centre the fan blade on the skewer tip and press firmly. If it tilts, re-centre it until it sits flat and balanced.',
    image: '/images/build/paper-fan/step-11.jpg',
  },
  {
    emoji: '🎉',
    title: 'Done! Pull the string to spin',
    text: 'Hold the cup steady with one hand. Pull the string downward with your other hand. The string unwinds, turns the skewer, and SPINS the fan! It makes wind! 💨',
    tip: 'Pull slowly and steadily for the smoothest spin. Try pulling at different speeds — what happens to the fan speed?',
    image: '/images/build/paper-fan/step-12.jpg',
  },
]

const fanStepsG34 = [
  {
    emoji: '✂️',
    title: 'Design and cut your propeller blade',
    text: 'You\'ll get a pre-portioned piece of paper. Cut it into a propeller blade shape — wide at the top, tapering toward the base. The shape determines how much air it displaces per rotation.',
    tip: 'Wider blades catch more air but create more drag. Predict: will a wider blade make MORE or LESS wind when pulled at the same speed?',
    image: '/images/build/paper-fan/step-01.jpg',
  },
  {
    emoji: '🪡',
    title: 'Collect your axle and winding strip',
    text: 'Gather one bamboo skewer (this is your axle — the rotating shaft) and one narrow paper strip (~2 cm wide). The strip will wrap around the axle and convert the string\'s linear pull into rotational motion.',
    tip: 'In real machines, axles transmit torque (rotational force). Can you think of another machine that uses an axle to transfer energy?',
    image: '/images/build/paper-fan/step-02.jpg',
  },
  {
    emoji: '📌',
    title: 'Anchor the skewer to the paper strip',
    text: 'Lay the paper strip flat. Align the skewer along one long edge and tape it firmly on both sides. This anchor point is critical — it prevents the wrap from sliding axially.',
    tip: 'Why does it matter WHERE on the strip you attach the skewer? Think about what happens to the wrap if the skewer shifts during winding.',
    image: '/images/build/paper-fan/step-03.jpg',
  },
  {
    emoji: '🌀',
    title: 'Coil the paper tightly around the axle',
    text: 'Roll the paper strip tightly and evenly around the skewer from one end to the other. Tape the final edge to lock the coil. This paper sleeve will grip the axle and transmit rotation.',
    tip: 'A loose coil slips instead of spinning. How does friction between the paper and skewer affect the energy transfer?',
    image: '/images/build/paper-fan/step-04.jpg',
  },
  {
    emoji: '⭕',
    title: 'Trace and cut the base cap',
    text: 'Invert the paper cup and trace around its rim. Cut the circle out — this cap will form the bearing surface at the bottom that stabilises the axle during operation.',
    tip: 'Cut just inside the pencil line so the cap fits snugly. Why is it important for the cap to be centred on the axle?',
    image: '/images/build/paper-fan/step-05.jpg',
  },
  {
    emoji: '🔧',
    title: 'Pierce the bearing holes in the cup',
    text: 'Use a push pin on a sponge or folded rag to pierce two holes in the cup: one through the centre of the base (top bearing) and one on the side near the bottom (string exit point).',
    tip: 'Why do both holes need to be centred — what happens to the spin if the axle wobbles off-centre? Think: bearing alignment affects all rotating machinery.',
    image: '/images/build/paper-fan/step-06.jpg',
  },
  {
    emoji: '⬇️',
    title: 'Thread the axle through the top bearing',
    text: 'Insert the paper-coiled skewer through the TOP hole (centre of cup base) from outside inward. The coil sits inside the cup cavity, which acts as the housing for the drive mechanism.',
    tip: 'The skewer should rotate freely but not rattle. Too tight = friction loss. Too loose = wobble. This is called a bearing clearance — engineers size this precisely.',
    image: '/images/build/paper-fan/step-07.jpg',
  },
  {
    emoji: '🪢',
    title: 'Secure the string with a double knot',
    text: 'Thread string onto the lower end of the skewer. Tie a firm double knot — it must not slip under tension. This knot is the attachment point where the string\'s potential energy will be stored as it winds.',
    tip: 'A single knot fails under repeated loading. Think of it like an engineering safety factor. What other places do you see double-knotted or redundant fasteners?',
    image: '/images/build/paper-fan/step-08.jpg',
  },
  {
    emoji: '🌀',
    title: 'Wind the string — store potential energy',
    text: 'Coil the string around the skewer in the same direction, then thread the free end through the SIDE hole and out. Each wind stores potential energy in the tensioned string that will be released as kinetic energy when pulled.',
    tip: 'Wind consistently clockwise. Predict: if you wind 5 turns vs 10 turns, how does the spin speed and duration change? Test it!',
    image: '/images/build/paper-fan/step-09.jpg',
  },
  {
    emoji: '🔩',
    title: 'Attach the bottom bearing cap',
    text: 'Pierce the cap circle onto the lower end of the skewer and tape it to the cup base. Trim excess skewer, leaving a small tip. This cap completes the housing and provides the second bearing point that keeps the axle aligned.',
    tip: 'Two bearing points (top + bottom) prevent the axle from tilting — the same reason a bicycle wheel has bearings on both sides of the fork.',
    image: '/images/build/paper-fan/step-10.jpg',
  },
  {
    emoji: '🌬️',
    title: 'Mount the propeller on the axle',
    text: 'Stick the top of the skewer to the centre of the propeller blade — press and hold. The blade sits on top; you\'re not poking through it. It should sit level and balanced.',
    tip: 'An unbalanced propeller creates vibration and loses efficiency. Centre it carefully — how do engineers balance real propellers at high RPM?',
    image: '/images/build/paper-fan/step-11.jpg',
  },
  {
    emoji: '🎉',
    title: 'Launch! Convert stored energy to wind',
    text: 'Hold the housing steady. Pull the string in one smooth downward motion. The stored potential energy converts to kinetic energy → axle rotation → propeller spin → air displacement = WIND! 💨',
    tip: 'Experiment: vary pull speed, number of winds, and blade size. Record your results. Which variable has the biggest effect on wind strength? Can you find the optimal configuration?',
    image: '/images/build/paper-fan/step-12.jpg',
  },
]

const builds = [
  {
    gradeBand: 'g1-2',
    weekNumber: 4,
    title: 'Paper Fan',
    tagline: 'Build a spinning paper fan powered by a wound string — pull to make wind!',
    resultFields: {
      a: { label: 'Does your fan spin? (Yes / No)', key: 'spins' },
      b: { label: 'Fan speed rating (1–5 stars)', key: 'speedRating' },
      unit: 'pulls',
      leaderboard: 'more',
      showLeaderboard: false,
    },
    steps: fanSteps,
  },
  {
    gradeBand: 'g3-4',
    weekNumber: 4,
    title: 'Paper Fan',
    tagline: 'Engineer a propeller-axle system that converts stored string energy into rotational motion and airflow.',
    resultFields: {
      a: { label: 'Does your propeller spin? (Yes / No)', key: 'spins' },
      b: { label: 'Wind strength rating (1–5 stars)', key: 'speedRating' },
      unit: 'winds',
      leaderboard: 'more',
      showLeaderboard: false,
    },
    steps: fanStepsG34,
  },
]

async function run() {
  console.log('\n── Build content items in DB (Week 4) ──')
  const existing = await sql`
    SELECT ci.id, ci.title, ci.grade_band, ci.subject, ci.step_count,
           c.week_number,
           EXISTS (
             SELECT 1 FROM classroom_curriculum ccl WHERE ccl.curriculum_id = c.id
           ) as is_assigned
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'build'
      AND c.week_number = 4
    ORDER BY ci.grade_band, ci.created_at DESC
  `
  if (existing.length === 0) {
    console.log('  No build content items found for Week 4 — will INSERT.')
  } else {
    for (const r of existing) {
      console.log(`  ${r.grade_band} W${r.week_number} | ${r.is_assigned ? '✅ ASSIGNED' : '  orphan  '} | "${r.title}" | ${r.step_count ?? 0} steps`)
    }
  }

  for (const build of builds) {
    const metadata = {
      tagline: build.tagline,
      resultFields: build.resultFields,
      steps: build.steps,
    }
    const stepCount = build.steps.length

    // Find assigned build content item for this week + grade
    const items = await sql`
      SELECT ci.id, ci.title, ci.created_at
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
  console.log('\n✅ Done! W4 build content seeded (Paper Fan — G1-2 + G3-4).')
  console.log('   Images are at /images/build/paper-fan/step-01.jpg through step-12.jpg')
}

run().catch(e => { console.error(e); process.exit(1) })

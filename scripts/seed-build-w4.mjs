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
    title: 'Draw and cut out your fan',
    text: 'Draw a fan blade shape on your paper — like a wide rounded leaf. It should be wider at the top and taper toward the bottom. Cut it out carefully.',
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
    text: 'Use the skewer to carefully poke two holes in the paper cup: one at the TOP (centre of the base) and one on the SIDE near the bottom.',
    tip: 'Ask your teacher for help poking the holes — the skewer is sharp! Make the holes just big enough for the skewer to slide through.',
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
    text: 'Poke the TOP of the skewer (with the paper wrapped around it) through the fan blade you cut in Step 1. The fan blade should sit on top of the cup with the skewer holding it up.',
    tip: 'Position the fan so it sits flat and balanced. If it tilts to one side, shift it until it looks even.',
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
  // G3-4 TBD — not seeded yet
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

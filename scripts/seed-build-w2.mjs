/**
 * seed-build-w2.mjs
 * Seeds Week 2 build content — BOTH teacher and student accounts see this.
 *
 * Source: KeenKids_BuildDay_Manual_August2025_v6
 *   G1-2 Build: Seesaw (Week 2)
 *   G3-4 Build: Balance Scale (Week 2)
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/seed-build-w2.mjs
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

// ── Build content from KeenKids_BuildDay_Manual_August2025_v6 ──────────────────
// Steps formatted as { emoji, title, text, tip? } for StepViewer

const builds = [
  // ── G1-2 Week 2: Seesaw ──────────────────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    title: 'Seesaw',
    simpleMachine: 'Lever',
    tagline: 'Build a working seesaw and discover why the heavier side always goes down!',
    resultFields: {
      a:               { label: 'Heaviest object found',        key: 'heaviestObject'  },
      b:               { label: 'Surprise result (size vs weight)', key: 'surpriseResult' },
      unit:            'objects',
      leaderboard:     'more',
      showLeaderboard: false,
    },
    steps: [
      {
        emoji: '🪜',
        title: 'Meet your materials',
        text: 'You have: 1 long cardstock beam (30 × 5 cm, pre-cut), 1 triangle fulcrum (pre-cut, pre-scored at base), 1 base rectangle (20 × 15 cm), 2 small seat squares (5 × 5 cm), masking tape, and small objects to weigh. A SEESAW is a LEVER — the triangle is the FULCRUM (pivot). Heavier side goes DOWN!',
        tip: 'A LEVER is a simple machine. The FULCRUM is the pivot. The LOAD goes on each end. Heavier side goes down!',
      },
      {
        emoji: '🔲',
        title: 'Set up the base',
        text: 'Lay the large cardstock rectangle flat on the table. This is your stable platform. Place it on a flat, level surface — if the table is uneven it will affect your results.',
      },
      {
        emoji: '🔺',
        title: 'Build the fulcrum — the pivot point',
        text: 'Fold the scored flap at the bottom of the triangle flat. Place the triangle at the CENTRE of the base. Tape the flap firmly — press down all edges. Push sideways to test stability: it must NOT wobble or tip.',
        tip: 'This is the FULCRUM — the most important part. If it wobbles, add more tape around the base fold and press firmly.',
      },
      {
        emoji: '➖',
        title: 'Lay the beam — do NOT tape it!',
        text: 'Lay the long cardstock beam across the TIP of the triangle at the centre mark. Do NOT tape the beam to the fulcrum! The beam MUST be free to tip left and right — that is how it works. If it slides off, fold a tiny V-notch at the centre to grip the triangle tip.',
        tip: 'DO NOT tape the beam to the fulcrum. It must pivot freely. If taped it cannot tip and the seesaw will not work.',
      },
      {
        emoji: '🪑',
        title: 'Make and attach the seats',
        text: 'Fold each small cardstock square into a shallow box by folding up about 1 cm on all four sides. Tape one seat to the LEFT end of the beam and one to the RIGHT end. Tape firmly but check the beam still tips freely after each seat is attached.',
        tip: 'One coin per seat should balance roughly level. If the empty beam does not balance, check the fulcrum is exactly at the CENTRE of the beam.',
      },
      {
        emoji: '🪙',
        title: 'Test with coins — what tips the balance?',
        text: 'Place ONE coin in each seat. Does the beam stay level? Now add two more coins to ONE side. What happens? The heavier side goes DOWN. Add coins back one at a time to find how many it takes to balance again.',
        tip: 'Try 1 coin vs 1 coin = level. Try 3 coins vs 1 coin = 3-coin side drops. Equal loads balance!',
      },
      {
        emoji: '⚖️',
        title: 'Weighing challenge — which is heavier?',
        text: 'Test 4 pairs of objects: put ONE object in each seat and see which side goes down. PREDICT before each test — then check! Record your results on the class chart. Pairs to try: coin vs eraser, rock vs button, 3 clips vs 1 coin, pencil cap vs rock.',
        tip: 'SIZE does not equal weight! A big cotton ball can be lighter than a small coin. Your seesaw is a precision scale!',
      },
      {
        emoji: '🔍',
        title: 'Explore — balance two unequal objects',
        text: 'Put two DIFFERENT objects in the seats. Can you BALANCE them without removing either one? Slide the BEAM left or right on the fulcrum to find the balance point. The beam moves toward the heavier object — try it!',
        tip: 'Discovery: changing WHERE the fulcrum is under the beam balances different loads. Real levers use this trick!',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "I tested ___ vs ___ and I was surprised that ___." And: "I balanced two unequal objects by ___." Science words from today: LEVER, FULCRUM, BALANCE, LOAD, FORCE.',
        tip: 'Real levers: seesaws, scissors, crowbars, bottle openers, and the claw of a hammer all work the same way as your seesaw!',
      },
    ],
  },

  // ── G3-4 Week 2: Balance Scale ───────────────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    title: 'Balance Scale',
    simpleMachine: 'Lever',
    tagline: 'Build a precision balance scale sensitive enough to detect a single paperclip difference!',
    resultFields: {
      a:               { label: 'Equal pair found',             key: 'equalPair'       },
      b:               { label: '3 small = 1 big (what objects?)', key: 'threeToOne'   },
      c:               { label: 'Detects 1 paperclip? (Yes/No) 🏆', key: 'paperclipTest' },
      unit:            'challenges',
      leaderboard:     'more',
      showLeaderboard: true,
    },
    steps: [
      {
        emoji: '⚖️',
        title: 'Meet your materials',
        text: 'You have: 3 popsicle sticks (2 uprights + 1 beam), 1 cardstock base rectangle, 6 string pieces (15 cm each, 3 per pan), 2 cardstock circle pans, masking tape, small objects to weigh, and a pen. Your scale must be sensitive enough to detect a single paperclip!',
        tip: 'Plus: coins, rocks, erasers, nuts, buttons. Also a pen to mark the true centre of the beam.',
      },
      {
        emoji: '🏗️',
        title: 'Set up the base',
        text: 'Lay the cardstock rectangle flat on the table. This is your stable platform. Mark a light pencil line down the CENTRE — the uprights go on this line. Make sure the surface is flat and level: a wobbly base gives wobbly results.',
        tip: 'Push the base against a book edge if it slides. The base must be completely flat — any tilt and your scale will always read false.',
      },
      {
        emoji: '🪵',
        title: 'Mount two uprights side-by-side',
        text: 'Hold 2 popsicle sticks side-by-side with a TINY gap between them. Tape them together near the top. Stand them VERTICALLY at the CENTRE of the base and tape firmly down. Check from the side AND front — must be exactly vertical. Test: push sideways — must NOT wobble.',
        tip: 'The gap between the 2 uprights IS the fulcrum — the beam will pivot in this gap. Tilted uprights = false readings every time.',
      },
      {
        emoji: '📏',
        title: 'Find the TRUE centre of the beam',
        text: 'Take the third popsicle stick (horizontal beam). Balance it on your fingertip. Slide your finger until it hangs perfectly level. That spot is the TRUE centre — mark it with a clear pen dot. The wood is not perfectly uniform so the real balance point may not be the geometric middle.',
        tip: 'This step is critical. An off-centre pivot = one pan always appears lighter and your results will not be reliable.',
      },
      {
        emoji: '🔄',
        title: 'Mount the beam — must swing freely',
        text: 'Lay the horizontal beam across the two uprights AT the pen-dot centre — it rests in the gap between them. The gap acts as the fulcrum. Test: flick one end — it should swing and return to level. If the beam does not swing freely, gently widen the gap between the uprights slightly.',
        tip: 'If the beam does NOT swing freely, the gap is too tight — loosen slightly. The beam MUST pivot or your scale will not work.',
      },
      {
        emoji: '🧵',
        title: 'Make the pans — 3 strings each',
        text: 'For EACH cardstock circle pan: tie 3 strings equally spaced around the rim (like a peace sign, 120° apart). Knot all 3 strings together at the top. Make TWO pans exactly the same way with equal string lengths. Both pans must hang at the same height!',
        tip: 'Space strings evenly (120 degrees apart). Uneven spacing = pan tilts. Equal spacing = pan hangs flat.',
      },
      {
        emoji: '🔗',
        title: 'Attach the pans + final check',
        text: 'Tie one pan knot to each END of the horizontal beam at equal distances from the centre. Both pans should hang at the same height when empty. If one pan hangs lower: shorten that pan\'s strings slightly until both are level. Empty pans level = scale is ready!',
        tip: 'If one pan hangs lower when empty, shorten that pan\'s strings slightly. Both pans must start at the same height for fair results.',
      },
      {
        emoji: '⚖️',
        title: '3 weighing challenges',
        text: 'Challenge 1: Find 2 objects that BALANCE exactly — the beam stays level. Challenge 2: Find 3 small objects that together balance 1 big object (3 small = 1 big). Challenge 3: Can your scale detect 1 paperclip vs 2 paperclips? Record ALL results on the class chart.',
        tip: 'Record all results. Who has the most sensitive scale? What design difference explains it?',
      },
      {
        emoji: '🔬',
        title: 'Fix + improve — make it more sensitive',
        text: 'Pick ONE improvement: (A) LONGER BEAM ARMS — move the pans further from the centre so tiny weights create more tip. (B) LIGHTER PANS — trim the cardstock circles smaller. (C) BETTER PIVOT — re-mark the true centre by balancing on your finger again. Make ONE change, retest with a single paperclip difference, and record the result.',
        tip: 'Only change ONE thing at a time or you will not know which change helped.',
      },
      {
        emoji: '🎤',
        title: 'Share out!',
        text: 'Tell the class: "My most surprising result was: ___ and ___ BALANCED." And: "My improvement was ___ and it made my scale ___." Science words: LEVER, FULCRUM, BEAM, PIVOT, PRECISION, BALANCE.',
        tip: 'Real precision scales used in pharmacies, chemistry labs, and gold merchants work on the same lever-balance principle you built today!',
      },
    ],
  },
]

async function run() {
  // ── Show what's in DB for build W2 ──────────────────────────────────────────
  console.log('\n── Build content items in DB (Week 2) ──')
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
      AND c.week_number = 2
    ORDER BY ci.grade_band, ci.created_at DESC
  `
  if (existing.length === 0) {
    console.log('  No build content items found for Week 2 — will INSERT.')
  } else {
    for (const r of existing) {
      console.log(`  ${r.grade_band} W${r.week_number} | ${r.is_assigned ? '✅ ASSIGNED' : '  orphan  '} | "${r.title}" | ${r.step_count ?? 0} steps`)
    }
  }

  for (const build of builds) {
    const imgFolder = build.gradeBand === 'g1-2' ? 'seesaw' : 'balance-scale'
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
  console.log('\n✅ Done! W2 build content seeded (Seesaw + Balance Scale).')
  console.log('   Both teacher AND student accounts will see text steps.')
  console.log('   Build step images remain gated to teacher/admin only.')
}

run().catch(e => { console.error(e); process.exit(1) })

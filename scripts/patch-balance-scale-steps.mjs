#!/usr/bin/env node
// Patch G3-4 Week 2 Balance Scale build steps in DB
// New design: 3 popsicle sticks (2 uprights + 1 beam) + flat cardstock base
// Removes clay cylinder base

import postgres from 'postgres'
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const newSteps = [
  {
    emoji: '⚖️',
    title: 'Meet your materials',
    text: 'You have: 3 popsicle sticks (2 uprights + 1 beam), 1 cardstock base rectangle, 6 string pieces (15 cm each, 3 per pan), 2 cardstock circle pans, masking tape, small objects to weigh, and a pen. Your scale must be sensitive enough to detect a single paperclip!',
    tip: 'Plus: coins, rocks, erasers, nuts, buttons. Also a pen to mark the true centre of the beam.',
    image: '/images/build/balance-scale/step-01.svg',
  },
  {
    emoji: '🏗️',
    title: 'Set up the base',
    text: 'Lay the cardstock rectangle flat on the table. This is your stable platform. Mark a light pencil line down the CENTRE — the uprights go on this line. Make sure the surface is flat and level: a wobbly base gives wobbly results.',
    tip: 'Push the base against a book edge if it slides. The base must be completely flat — any tilt and your scale will always read false.',
    image: '/images/build/balance-scale/step-02.svg',
  },
  {
    emoji: '🪵',
    title: 'Mount two uprights side-by-side',
    text: 'Hold 2 popsicle sticks side-by-side with a TINY gap between them. Tape them together near the top. Stand them VERTICALLY at the CENTRE of the base and tape firmly down. Check from the side AND front — must be exactly vertical. Test: push sideways — must NOT wobble.',
    tip: 'The gap between the 2 uprights IS the fulcrum — the beam will pivot in this gap. Tilted uprights = false readings every time.',
    image: '/images/build/balance-scale/step-03.svg',
  },
  {
    emoji: '📏',
    title: 'Find the TRUE centre of the beam',
    text: 'Take the third popsicle stick (horizontal beam). Balance it on your fingertip. Slide your finger until it hangs perfectly level. That spot is the TRUE centre — mark it with a clear pen dot. The wood is not perfectly uniform so the real balance point may not be the geometric middle.',
    tip: 'This step is critical. An off-centre pivot = one pan always appears lighter and your results will not be reliable.',
    image: '/images/build/balance-scale/step-04.svg',
  },
  {
    emoji: '🔄',
    title: 'Mount the beam — must swing freely',
    text: 'Lay the horizontal beam across the two uprights AT the pen-dot centre — it rests in the gap between them. The gap acts as the fulcrum. Test: flick one end — it should swing and return to level. If the beam does not swing freely, gently widen the gap between the uprights slightly.',
    tip: 'If the beam does NOT swing freely, the gap is too tight — loosen slightly. The beam MUST pivot or your scale will not work.',
    image: '/images/build/balance-scale/step-05.svg',
  },
  {
    emoji: '🧵',
    title: 'Make the pans — 3 strings each',
    text: 'For EACH cardstock circle pan: tie 3 strings equally spaced around the rim (like a peace sign, 120° apart). Knot all 3 strings together at the top. Make TWO pans exactly the same way with equal string lengths. Both pans must hang at the same height!',
    tip: 'Space strings evenly (120 degrees apart). Uneven spacing = pan tilts. Equal spacing = pan hangs flat.',
    image: '/images/build/balance-scale/step-06.svg',
  },
  {
    emoji: '🔗',
    title: 'Attach the pans + final check',
    text: 'Tie one pan knot to each END of the horizontal beam at equal distances from the centre. Both pans should hang at the same height when empty. If one pan hangs lower: shorten that pan\'s strings slightly until both are level. Empty pans level = scale is ready!',
    tip: 'If one pan hangs lower when empty, shorten that pan\'s strings slightly. Both pans must start at the same height for fair results.',
    image: '/images/build/balance-scale/step-07.svg',
  },
  {
    emoji: '⚖️',
    title: '3 weighing challenges',
    text: 'Challenge 1: Find 2 objects that BALANCE exactly — the beam stays level. Challenge 2: Find 3 small objects that together balance 1 big object (3 small = 1 big). Challenge 3: Can your scale detect 1 paperclip vs 2 paperclips? Record ALL results on the class chart.',
    tip: 'Record all results. Who has the most sensitive scale? What design difference explains it?',
    image: '/images/build/balance-scale/step-08.svg',
  },
  {
    emoji: '🔬',
    title: 'Fix + improve — make it more sensitive',
    text: 'Pick ONE improvement: (A) LONGER BEAM ARMS — move the pans further from the centre so tiny weights create more tip. (B) LIGHTER PANS — trim the cardstock circles smaller. (C) BETTER PIVOT — re-mark the true centre by balancing on your finger again. Make ONE change, retest with a single paperclip difference, and record the result.',
    tip: 'Only change ONE thing at a time or you will not know which change helped.',
    image: '/images/build/balance-scale/step-09.svg',
  },
  {
    emoji: '🎤',
    title: 'Share out!',
    text: 'Tell the class: "My most surprising result was: ___ and ___ BALANCED." And: "My improvement was ___ and it made my scale ___." Science words: LEVER, FULCRUM, BEAM, PIVOT, PRECISION, BALANCE.',
    tip: 'Real precision scales used in pharmacies, chemistry labs, and gold merchants work on the same lever-balance principle you built today!',
    image: '/images/build/balance-scale/step-10.svg',
  },
]

async function run() {
  // Find G3-4 week 2 balance scale content item(s)
  const items = await sql`
    SELECT ci.id, ci.title, ci.grade_band, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'build'
      AND ci.grade_band = 'g3-4'
      AND ci.title ILIKE '%balance%'
      AND c.week_number = 2
    ORDER BY ci.created_at DESC
  `

  if (items.length === 0) {
    console.error('❌ No G3-4 week 2 balance scale content item found')
    process.exit(1)
  }

  for (const item of items) {
    const oldMeta = item.metadata || {}
    const newMeta = { ...oldMeta, steps: newSteps }
    await sql`
      UPDATE content_items
      SET metadata = ${JSON.stringify(newMeta)},
          step_count = ${newSteps.length},
          updated_at = NOW()
      WHERE id = ${item.id}
    `
    console.log(`✅ Updated "${item.title}" (${item.id}) — ${newSteps.length} steps`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })

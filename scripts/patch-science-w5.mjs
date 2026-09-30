/**
 * patch-science-w5.mjs
 * Seeds Week 5 science content — The Amazing Refraction Mystery — for both G1-2 and G3-4.
 * Topic: Light · Refraction · Transparent Materials
 *
 * Run: cd ~/Documents/keenlearn_app && node scripts/patch-science-w5.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
for (const line of lines) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('='); if (i === -1) continue
  const k = t.slice(0, i).trim()
  const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  if (!process.env[k]) process.env[k] = v
}

const sql = postgres(process.env.DATABASE_URL)

const STEPS_SHARED = [
  {
    emoji: '🔮',
    title: 'Hook & Predictions',
    text: 'Hold up a pencil. Ask: "Is this pencil straight?" Students: "Yes!" Ask: "What if I put part of it in water — can water make a straight pencil look bent?" Then show the arrow. Ask: "Can water make this arrow look like it changed direction?" Finally, show the fish image. Ask: "What do you think will happen to this fish when we put it inside water?"\n\nPossible predictions: the fish will move / the colors will change / the fish will look blurry / nothing will happen / the outline will look different.\n\nSay: "Today we are going to test what happens when LIGHT travels through water!"\n\nStudents write four predictions:\n➡️ Arrow: "I think the arrow will __________"\n✏️ Pencil: "I think the pencil will __________"\n🪮 Comb: "I think the comb will __________"\n🐟 Fish: "I think the fish will __________ when it is inside the water."',
    tip: 'Don\'t reveal any results yet — suspense makes the experiments land harder!',
  },
  {
    emoji: '➡️',
    title: 'Experiment 1: The Arrow Mystery',
    text: 'Draw a bold arrow on white paper pointing RIGHT →.\n\nPlace the arrow behind the empty clear container. Ask: "Which direction is the arrow pointing?"\n\nNow fill the container with water. Look through the water at the arrow. Move the arrow slowly closer or farther until the effect is most visible.\n\n✨ Students may see the arrow appear to reverse direction!\n\nAsk: "Did we actually turn the arrow around?" No!\n\nExplain: "The water changed the path of the light coming from the arrow. The arrow looks different but nothing actually moved."',
    tip: 'The effect is strongest when the arrow is about 5–10 cm behind the container. Try different distances to find the sweet spot.',
  },
  {
    emoji: '✏️',
    title: 'Experiment 2: The Bent Pencil',
    text: 'Show the pencil outside the water. Ask: "Is the pencil straight?" Students confirm.\n\nPlace the pencil diagonally into the water container. Students look at the boundary between AIR 💨 and WATER 💧.\n\n✨ The pencil appears bent or broken at the water line!\n\nAsk: "Did the pencil actually bend?" No!\n\nExplain: "Light from the underwater part of the pencil bends when it travels from water into air. Our eyes receive that bent light and our brain thinks the pencil is bent — but it\'s not."',
    tip: 'Place the pencil at about a 45° angle for the clearest effect. The wider the angle from straight up, the more dramatic the bend looks.',
  },
  {
    emoji: '🪮',
    title: 'Experiment 3: The Comb',
    text: 'Show students the comb outside the water. Ask them to notice: the spaces between teeth / the straight lines / the size of the teeth.\n\nPlace the comb behind or inside the clear water container. Ask: "Does the comb look exactly the same?"\n\nMove the comb slowly and have students observe from different angles. They may notice: distortion / changes in spacing / changes in apparent size / slight shifting of the teeth.\n\n✨ The regular pattern of the comb can look stretched or wavy through water!\n\nExplain: "The water bends light differently depending on where we look through it."',
    tip: 'Holding the comb flat against the back of the container gives the most noticeable distortion.',
  },
  {
    emoji: '🐟',
    title: 'Experiment 4: The Mystery Fish',
    text: 'BEFORE WATER — Show students the multicolor fish drawing. Ask: "What colors do you see?" Ask: "Can you clearly see the black outline?"\n\nINTO THE BAG — Place the fish inside the sealed clear Ziploc bag. Ask: "Can you still see all the colors and the outline through the bag?"\n\nINTO THE WATER — Carefully place the sealed bag into the clear container of water. Ask: "What looks different now?"\n\nEncourage students to observe carefully:\n● The colors — do they look the same?\n● The black outline — can you still see it clearly?\n● The shape — does the fish look exactly the same size and position?\n● Any blurry or distorted areas?\n\nLight is now traveling through: 💨 Air → 🧴 Plastic bag → 💧 Water → 👀 Eyes\n\nImportant: Do not tell students what they must see. Ask: "Which parts can you see clearly? Which parts look different?"',
    tip: 'The exact effect depends on container shape, water amount, viewing angle, and lighting. Encourage students to describe what THEY observe — this is a real observation experiment with no single "correct" result.',
  },
  {
    emoji: '💡',
    title: 'Explain the Science: Refraction',
    text: 'Bring students together. Ask: "Did any of the objects actually change?"\n\nNo!\n➡️ The arrow did not actually turn.\n✏️ The pencil did not actually break.\n🪮 The comb did not actually change shape.\n🐟 The fish did not actually move.\n\nSo why did they look different?\n\n💡 THE LIGHT CHANGED DIRECTION!\n\nWrite on the board:\n💨 AIR → 💧 WATER → 👀 EYES\n\nExplain: Light travels at different speeds through different materials. When light moves from air into water, its path bends. This is called:\n🔬 REFRACTION\n\nOur eyes receive the light after it bends. Our brain uses that light to decide where objects are and what they look like. Because the light\'s path changed, objects can appear: shifted / bent / distorted / in a different position.\n\nKid-friendly version: "The arrow didn\'t really turn and the pencil didn\'t really break. What changed was the path of the LIGHT. When light travels through water, it can bend — and that changes what our eyes see. This bending of light is called REFRACTION!"',
    tip: 'Write REFRACTION large on the board and point back to it for each experiment: "Experiment 1 showed refraction. Experiment 2 showed refraction..."',
  },
  {
    emoji: '🌍',
    title: 'Real-World Connections',
    text: 'Ask students: "Where do we see refraction in real life?"\n\n🐟 Fish in water — fish can appear to be in a different position than they really are.\n🥤 Glass of water — objects look distorted through a full glass.\n🌈 Rainbows — light bends through tiny water droplets in the air.\n👓 Eyeglasses — lenses bend light to help people see clearly.\n📷 Cameras — camera lenses use refraction to focus light.\n🔭 Telescopes and microscopes — lenses bend and focus light to magnify objects.\n\nVocabulary check:\n💡 Light — energy that allows us to see\n🔬 Refraction — the bending of light when it travels from one material into another\n💧 Transparent — a material that allows light to pass through (water, clear glass, clear plastic)\n👀 Observe — to carefully look for changes and collect information\n🌈 Distortion — when something appears different from its real shape or position',
    tip: 'Ask: "Why do you think fishermen need to know about refraction when they are trying to catch fish?" (The fish is not where it appears to be!)',
  },
  {
    emoji: '✏️',
    title: 'Draw & Write / Share Out',
    text: 'Students divide their paper into four sections, one per experiment.\n\n➡️ Arrow — "What I saw before water: ______" / "What I saw through water: ______"\n✏️ Pencil — "What changed: ______"\n🪮 Comb — "What changed: ______"\n🐟 Fish — Draw the multicolor fish with its black outline. Then draw or describe what you observed after it was placed in the Ziploc bag in water.\n\nG1–2 complete:\n"Water can make things look __________"\n"Light can __________ when it goes through water." (Answer: BEND!)\n\nG3–4 explain:\n"Why can an object look different when we see it through water?"\nUse these words: light / water / bend / refraction\n\nClose with: "Today we discovered that water doesn\'t actually bend pencils or turn arrows. Water bends LIGHT — and that changes what our eyes see. That\'s the science of REFRACTION!"',
    tip: 'Write on the board: 💡 LIGHT ENTERS WATER → ↪️ LIGHT BENDS → 👀 OUR EYES SEE THE BENT LIGHT',
  },
]

const scienceW5 = [
  {
    gradeBand: 'g1-2',
    weekNumber: 5,
    title: 'The Amazing Refraction Mystery',
    stepCount: STEPS_SHARED.length,
    metadata: {
      topic: 'Light · Refraction · Transparent Materials',
      wowFactor: 'An arrow can appear to reverse direction, a pencil looks broken, a comb looks distorted — all without touching them! Water bends light, and that changes what our eyes see.',
      bigQuestion: 'Can water change what our eyes see?',
      prepInfo: 'Before class:\n1. Draw a bold arrow on white paper (pointing clearly RIGHT →).\n2. Draw a multicolor fish on white paper with a clear black outline.\n3. Place the fish inside a Ziploc bag and seal it — water must NOT reach the paper.\n4. Fill clear containers with water.\n5. Gather one comb and one pencil per group.\n\nThe visual effects depend on container shape, water amount, viewing angle, and lighting. Try the experiments yourself first to find the best setup for your containers.',
      materials: [
        'Clear glass or transparent plastic container',
        'Water',
        'White paper (for arrow and fish drawings)',
        'Pencil',
        'Comb',
        'Clear Ziploc bag (sealed with fish drawing inside)',
        'Paper towels',
        'Marker (bold, for drawing arrow)',
        'Colored pencils or markers (for fish)',
      ],
      vocabulary: ['Light', 'Refraction', 'Transparent', 'Observe', 'Distortion'],
      steps: STEPS_SHARED,
    },
  },
  {
    gradeBand: 'g3-4',
    weekNumber: 5,
    title: 'The Amazing Refraction Mystery',
    stepCount: STEPS_SHARED.length,
    metadata: {
      topic: 'Light · Refraction · Transparent Materials',
      wowFactor: 'An arrow can appear to reverse direction, a pencil looks broken, a comb looks distorted — all without touching them! Water bends light, and that changes what our eyes see.',
      bigQuestion: 'Can water change what our eyes see?',
      prepInfo: 'Before class:\n1. Draw a bold arrow on white paper (pointing clearly RIGHT →).\n2. Draw a multicolor fish on white paper with a clear black outline.\n3. Place the fish inside a Ziploc bag and seal it — water must NOT reach the paper.\n4. Fill clear containers with water.\n5. Gather one comb and one pencil per group.\n\nThe visual effects depend on container shape, water amount, viewing angle, and lighting. Try the experiments yourself first to find the best setup for your containers.',
      materials: [
        'Clear glass or transparent plastic container',
        'Water',
        'White paper (for arrow and fish drawings)',
        'Pencil',
        'Comb',
        'Clear Ziploc bag (sealed with fish drawing inside)',
        'Paper towels',
        'Marker (bold, for drawing arrow)',
        'Colored pencils or markers (for fish)',
      ],
      vocabulary: ['Light', 'Refraction', 'Transparent', 'Observe', 'Distortion'],
      discussionQuestions: [
        'Why did the arrow appear to reverse direction through water?',
        'Did the pencil actually break? What really changed?',
        'What do all four experiments have in common? (They all show refraction)',
        'Why is it important that scientists describe what they actually see rather than what they expect to see?',
        'Can you think of a situation where refraction could be misleading or even dangerous? (e.g., fishing, swimming pool depth)',
      ],
      steps: STEPS_SHARED,
    },
  },
]

for (const activity of scienceW5) {
  const [item] = await sql`
    SELECT ci.id, ci.title
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'science'
      AND ci.grade_band = ${activity.gradeBand}
      AND c.week_number = ${activity.weekNumber}
      AND c.grade_band = ${activity.gradeBand}
    LIMIT 1
  `

  if (!item) {
    console.warn(`⚠️  Not found: ${activity.gradeBand} W${activity.weekNumber} science — skipping`)
    continue
  }

  await sql`
    UPDATE content_items
    SET title = ${activity.title}, step_count = ${activity.stepCount}, metadata = ${activity.metadata}
    WHERE id = ${item.id}
  `
  console.log(`✅ ${activity.gradeBand} W${activity.weekNumber}: "${activity.title}" (was: "${item.title}")`)
}

console.log('\nDone! Refraction Mystery is live for W5.')
await sql.end()

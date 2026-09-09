/**
 * seed-science.mjs
 * Adds step-by-step science activity content to the DB.
 * Safe to re-run — updates existing rows, doesn't recreate them.
 *
 * Run: node scripts/seed-science.mjs
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

const scienceContent = [
  // ── G1-2 Week 1: What do plants need? ──────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    title: 'The Invisible Fire Extinguisher',
    stepCount: 6,
    metadata: {
      steps: [
        { emoji: '🌱', title: 'Look at a seed', text: 'Hold a bean seed in your hand. What do you notice? Is it hard or soft? Big or small? Draw it in your science journal and label what you see.', tip: 'Scientists always look carefully BEFORE they start an experiment!' },
        { emoji: '💧', title: 'Water experiment', text: 'We have two cups with soil. Plant one seed in each. Write "WATER" on cup 1 and "NO WATER" on cup 2. Give cup 1 a small drink of water. Leave cup 2 dry. Predict: which seed will grow?', tip: 'A prediction is a smart guess based on what you know!' },
        { emoji: '☀️', title: 'Light experiment', text: 'Put cup 1 by the sunny window. Put a third cup in the dark cupboard. Make sure BOTH get water. Predict: will the dark one grow as well?', tip: 'We change only ONE thing at a time — that\'s called a fair test.' },
        { emoji: '🔬', title: 'Observe day by day', text: 'Check your plants every day. Write the date and draw what you see — or write one word. Did any sprout yet? Which one sprouted first?', tip: 'Real scientists record data even when nothing seems to happen. That\'s data too!' },
        { emoji: '📊', title: 'Compare your results', text: 'After 5 days: look at all three cups. Which plant is tallest? Which didn\'t grow at all? Write your findings: plants need ___ and ___ to grow.', tip: 'Your results might surprise you! It\'s OK if your prediction was wrong — that\'s how science works.' },
        { emoji: '🗣️', title: 'Share what you found', text: 'Tell the class: "I think plants need ___ because ___." Listen to what others found. Did everyone get the same result? Why or why not?', tip: 'Science is better when we share — someone else might have noticed something you missed!' },
      ],
    },
  },

  // ── G1-2 Week 3: Spinning Magnetic Pen ─────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 3,
    title: 'Spinning Magnetic Pen',
    stepCount: 7,
    metadata: {
      steps: [
        { emoji: '🧲', title: 'Feel the magic — magnets push AND pull', text: 'Hold two magnets. Stick them together — that is ATTRACT. Now flip one around. They push away — that is REPEL. Feel the invisible force in your hands! Today you will see this force hold a whole PEN in mid-air.', tip: 'Every magnet has two ends: NORTH POLE and SOUTH POLE. Opposite poles attract. Same poles repel — push each other away.' },
        { emoji: '🔮', title: 'Make your prediction', text: 'Before the demo: Thumbs UP if you think the pen can float in the air. Thumbs DOWN if you think it will fall. Sideways if you\'re not sure. Remember your prediction — we come back to it after! Write your prediction and why.', tip: 'There is no wrong prediction! Scientists use predictions to test what they think they know.' },
        { emoji: '✨', title: 'Watch the demo', text: 'Watch your teacher slowly lower the pen toward the base. Feel the tension. When it is released — the pen FLOATS! Give it a gentle spin — it keeps spinning. Notice: nothing is touching it. What force is holding it up?', tip: 'Pay close attention! Can you see the force? No — but you can see what it DOES.' },
        { emoji: '✋', title: 'Feel the repulsion force yourself', text: 'Your teacher will invite you to try: push the floating pen DOWN. What happens? It pushes BACK. That invisible push is magnetic repulsion — the same poles pushing each other away. The magnets on the pen and the base have the SAME pole facing each other.', tip: 'Two forces are at work: magnetic repulsion pushing UP, and gravity pulling DOWN. When they balance — the pen floats!' },
        { emoji: '💡', title: 'The science: same poles repel', text: 'Every magnet has a NORTH POLE and a SOUTH POLE. Rule: same poles repel (push apart). The pen has magnets with the SAME pole facing down as the base magnets facing up. They push away from each other — strong enough to hold the pen against gravity!', tip: 'Write on your paper: SAME POLES REPEL. OPPOSITE POLES ATTRACT. Draw a north and south pole arrow.' },
        { emoji: '🚄', title: 'Real world — the floating train!', text: 'MAGLEV trains float above the track using the SAME force — magnetic repulsion! No wheels touching the track means no friction — so maglev trains go over 600 km/h! Ask: "What else could float if we made magnets strong enough?" Discuss with a partner.', tip: 'Maglev = MAGnetic LEVitation. The same invisible force that held the pen holds a whole train!' },
        { emoji: '✏️', title: 'Draw and label — show the forces', text: 'Draw the floating pen above the base. Add TWO arrows: one pointing UP (the magnetic repulsion pushing the pen up) and one pointing DOWN (gravity pulling the pen down). Label: "push up" and "pull down." Write one sentence: "The pen floats because..."', tip: 'Good science drawing shows forces as ARROWS. The size of the arrow shows how strong the force is. Both arrows here are the same size — the forces are balanced!' },
      ],
    },
  },

  // ── G3-4 Week 1: Forces and Motion Lab ─────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    title: 'The Invisible Fire Extinguisher',
    stepCount: 7,
    metadata: {
      steps: [
        { emoji: '⚡', title: 'Newton\'s Laws intro', text: 'Write these 3 laws in your own words: 1) Objects keep doing what they\'re doing unless a force acts on them. 2) Bigger force = bigger acceleration (F = ma). 3) Every action has an equal and opposite reaction. Give one real-life example for each law.', tip: 'Hint for Law 3: when you push off the wall in a swimming pool!' },
        { emoji: '🎯', title: 'Predict the marble race', text: 'You have 3 marbles: small, medium, large. Roll them all down the SAME ramp from the SAME height. Before testing: predict which will go furthest, and explain why using Newton\'s 2nd law (F=ma).', tip: 'Hint: the ramp gives the same force to all — but mass (m) is different. What does that mean for acceleration (a)?' },
        { emoji: '📏', title: 'Measure and record', text: 'Roll each marble 3 times. Record all results in a table. Calculate the average distance for each marble. Does your data match your prediction? If not — why might that be?', tip: 'Averaging 3 trials removes "lucky" results. Real labs do this hundreds of times!' },
        { emoji: '🔄', title: 'Friction investigation', text: 'Roll your medium marble on: (1) smooth tile, (2) carpet, (3) sandpaper. Time how long it takes to stop using a stopwatch. Calculate: which surface exerts the most friction force? (Hint: stops fastest = most friction)', tip: 'Force = change in momentum ÷ time. More friction = faster deceleration = quicker stop.' },
        { emoji: '💥', title: 'Newton\'s 3rd Law demo', text: 'Blow up a balloon, hold the neck closed, and point it away from you — then let go. Observe: which direction does the air go? Which direction does the balloon go? This is Law 3 in action: rocket science!', tip: 'Rockets work the SAME way — gas shoots down, rocket goes up. No air needed in space!' },
        { emoji: '📊', title: 'Analyse your data', text: 'Make a bar graph of your marble distances (average). Write a conclusion: "I found that ___ because ___. This supports Newton\'s ___ law because ___." Use numbers from your data.', tip: 'A good scientific conclusion always references SPECIFIC data, not just "it went further."' },
        { emoji: '🌍', title: 'Real-world connections', text: 'Find one example of each Newton\'s Law in: (a) sport, (b) transport, (c) everyday life. Share your 3 examples with the class. Which law shows up most often? Vote as a class!', tip: 'Newton published these laws in 1687 — and they still explain almost everything we observe today.' },
      ],
    },
  },

  // ── G1-2 Week 2: Air Pressure & Surface Tension (Water Bottle) ─────────────
  // Sep 11 — all grades together. G1-2: wonder + simple "why" questions.
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    title: 'The Upside-Down Water Bottle',
    stepCount: 6,
    metadata: {
      prepInfo: 'Materials: 1 glass bottle (demo, teacher only) + 1 plastic bottle per pair, window screen mesh squares, rubber bands, wooden toothpicks, trays. Fill ALL bottles completely to the brim before class — zero air gap. Stretch mesh over each bottle mouth, secure with rubber band. Practice the flip at home: palm flat over mesh, flip fast, remove palm slowly. Do it 5 times until it feels natural.',
      steps: [
        { emoji: '💨', title: 'Can you feel the air?', text: 'Wave your hand in front of your face — you can feel air moving. But even when it is still, air is pushing on your skin from every direction, all the time. We call this AIR PRESSURE. And water molecules cling to each other like tiny magnets — at the surface they form a stretchy invisible skin called SURFACE TENSION. Today both of these invisible things will do something that looks impossible.', tip: 'Write these two words: AIR PRESSURE and SURFACE TENSION. We will need them today!' },
        { emoji: '🔮', title: 'Make your prediction!', text: 'Teacher holds a bottle filled completely with water. Mesh is stretched over the top. Write your prediction: "When the teacher flips the bottle upside down, the water will ___." Thumbs UP if you think it falls out. Thumbs DOWN if you think it stays in. Tell a partner ONE reason for your answer. Remember your prediction — we come back to it!', tip: 'Scientists always predict BEFORE they test. There is no wrong answer here — that is the point!' },
        { emoji: '🙃', title: 'Watch the demo!', text: 'Teacher puts palm over the mesh, counts 3-2-1, and flips the bottle. Slowly removes hand. What happens? THE WATER STAYS IN. Now teacher pushes a wooden toothpick through the mesh into the upside-down bottle. Which way does it go? It floats UP — because wood is lighter than water, so it always floats toward the top. But the top of the bottle is now at the bottom!', tip: 'Pay attention: what happens when teacher tilts the bottle? Air sneaks in — and the water falls immediately.' },
        { emoji: '🧪', title: 'Try it with your partner!', text: 'Get your plastic bottle (filled to the brim!), mesh, rubber band and toothpicks. Challenge 1: Flip your bottle and hold the water in — both partners try. Challenge 2: Push toothpicks in one at a time while upside down — count how many before it leaks. Challenge 3: Very slowly tilt it — at what point does the water start to fall? Refill and try again!', tip: 'The bottle MUST be full to the brim — one air bubble inside will make it leak right away.' },
        { emoji: '🗣️', title: 'Reflection — were you right?', text: 'Come back together. Look at your prediction — were you right? No matter what, write: "I was surprised that ___." Now think: WHY did the water stay in? (Air pushing up from below + surface tension sealing the holes.) WHY did the toothpick go up? (Wood is lighter than water — it floats.) Share your answer with the group.', tip: 'Being wrong is fine in science — what matters is understanding WHY you were wrong. That is how scientists learn!' },
        { emoji: '🌍', title: 'Where do we see this in real life?', text: 'AIR PRESSURE: when you drink through a straw, you suck air OUT and pressure pushes the drink UP. Suction cups work the same way! SURFACE TENSION: water strider bugs walk on water using the surface skin. Raindrops are round because of it. BUOYANCY: boats, fish, and swimming all use the upward push of water. Draw one real-world example and label it.', tip: 'New words for your journal: AIR PRESSURE · SURFACE TENSION · BUOYANCY · FLOAT · SINK.' },
      ],
    },
  },

  // ── G3-4 Week 2: Air Pressure & Surface Tension (Water Bottle) ─────────────
  // Sep 11 — all grades together. G3-4: same demo, deeper "why" + richer reflection.
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    title: 'The Upside-Down Water Bottle',
    stepCount: 6,
    metadata: {
      prepInfo: 'Materials: 1 glass bottle (demo, teacher only) + 1 plastic bottle per pair, window screen mesh squares, rubber bands, wooden toothpicks, trays. Fill ALL bottles completely to the brim before class — zero air gap. Stretch mesh over each bottle mouth, secure with rubber band. Practice the flip at home: palm flat over mesh, flip fast, remove palm slowly. Do it 5 times until it feels natural.',
      steps: [
        { emoji: '💨', title: 'Two invisible forces — air pressure and surface tension', text: 'Air pushes on everything around us from every direction all the time — we just don\'t feel it because it is balanced. Water molecules cling to each other at the surface, forming a stretchy skin called surface tension — strong enough to hold a paperclip on water. Wood floats on water because it is lighter than water for the same size — scientists call this being less dense. Today all three ideas combine to produce something that looks impossible.', tip: 'Write: AIR PRESSURE · SURFACE TENSION · DENSITY. These three things explain everything you will see today.' },
        { emoji: '🔮', title: 'Make your prediction — and give a reason', text: 'Teacher holds a bottle filled completely with water with mesh secured over the mouth. Write your prediction: "When flipped upside down, the water will ___ because ___." Then make a second prediction: "When a wooden toothpick is pushed through the mesh into the upside-down bottle, it will float ___ because ___." Share your reason with a partner before the demo starts.', tip: 'A strong prediction uses the word BECAUSE and gives a reason based on what you know — not just a guess.' },
        { emoji: '✨', title: 'Watch the demo — notice every detail', text: 'Teacher flips the bottle. Water stays in. Teacher pushes toothpicks through — they float UP. Teacher tilts the bottle — water pours out immediately. For each thing you see, write: WHAT happened, and WHY you think it happened. Focus on the moment the bottle tilts — what changes that causes the water to fall? (Hint: something gets in.)', tip: 'Scientists write observations AS THEY HAPPEN — not from memory afterward. Keep your pencil ready.' },
        { emoji: '🧪', title: 'Partner exploration — try to break it', text: 'Get your plastic bottle (filled to the brim), mesh, rubber band and toothpicks. Challenge 1: Both partners flip and hold it. Challenge 2: Push toothpicks in while upside down — how many before it leaks? What do you think causes the leak? Challenge 3: Let the tiniest bit of air in with one finger — what happens instantly? Challenge 4: Try tilting slowly — at roughly what angle does it fail? Compare your angle with another pair.', tip: 'When you test one thing at a time (like just tilting vs just adding toothpicks), that is called a controlled experiment.' },
        { emoji: '🗣️', title: 'Reflection — explain the science', text: 'Come back together. Review your predictions — who was right? Now explain in your own words: (1) Why did the water stay in? (Air pushes UP from outside, surface tension seals the mesh holes — together they hold the water against gravity.) (2) Why did the toothpick go UP? (Wood is less dense than water, so it always floats — even when up is actually down.) (3) Why did tilting break it? (Air got in — once air is inside, the upward push is gone and gravity wins.)', tip: 'A good science explanation uses BECAUSE and names the forces or properties involved. Try to use: air pressure, surface tension, density, float.' },
        { emoji: '🌍', title: 'Connect to the real world', text: 'Where do we see these forces at work? STRAWS: you remove air from the straw — pressure outside pushes the drink UP. SUCTION CUPS: same idea — no air inside = pressure holds it to the wall. WATER STRIDER BUGS: walk on the surface tension skin of water. BOATS AND FISH: stay up because of buoyancy — water pushes them up. Pick one and draw it with labels showing which direction the forces push. Share with the group.', tip: 'Extra challenge: can you think of a time when air pressure works against us rather than for us? (Hint: what happens to a bag of chips on a plane?)' },
      ],
    },
  },

  // ── G3-4 Week 3: Spinning Magnetic Pen ─────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 3,
    title: 'Spinning Magnetic Pen',
    stepCount: 7,
    metadata: {
      steps: [
        { emoji: '🧲', title: 'What do you already know about magnets?', text: 'Every magnet has two poles: NORTH and SOUTH. Rule 1 — opposite poles attract (pull together). Rule 2 — same poles repel (push apart). Before the demo: predict how you could use REPULSION (same poles pushing) to make an object float. Write your idea.', tip: 'Repulsion = pushing apart. If the repulsion force is exactly equal to gravity, the object floats in equilibrium.' },
        { emoji: '🔮', title: 'Make your prediction', text: 'Before the demo: Thumbs UP if you think same-pole repulsion can hold a pen against gravity. DOWN if you think gravity always wins. Write: "I predict ___ because using F=ma, the magnet force needs to be ___." Then circle: you think it will work / won\'t work / almost work.', tip: 'Think: gravity pulls down with force = mg. For the pen to float, the magnetic repulsion must equal mg upward.' },
        { emoji: '✨', title: 'Watch the demo — every detail matters', text: 'Watch your teacher lower the pen. Notice: at what distance does it start to resist? When released — it floats! Key question: which poles must be facing each other on the pen magnet and the base magnet? (Hint: think about which rule makes them push apart.) Write your answer.', tip: 'Same poles = NORTH facing NORTH, or SOUTH facing SOUTH. They push apart. That upward push balances gravity.' },
        { emoji: '✋', title: 'Feel and test the force', text: 'When invited, push the floating pen down. Notice: the harder you push DOWN, the harder it pushes UP. This is because as magnets get closer, the repulsion force gets STRONGER. Try spinning the pen — it keeps spinning. Why? (Hint: no friction from the base, and gyroscopic effect stabilises it.)' , tip: 'Gyroscopic effect: a spinning object resists tipping. That\'s why the pen stays upright instead of wobbling sideways.' },
        { emoji: '💡', title: 'The science: equilibrium of forces', text: 'Two forces act on the floating pen: (1) GRAVITY pulls DOWN (force = mass × g). (2) MAGNETIC REPULSION pushes UP. When these two forces are EXACTLY EQUAL — the pen floats in EQUILIBRIUM. If one increases, the pen moves until balance is restored. Write: Forces balanced → object in EQUILIBRIUM.', tip: 'Equilibrium means the net force = 0. No net force = no acceleration = object stays still (or keeps spinning at the same speed).' },
        { emoji: '🚄', title: 'Real world — maglev and beyond', text: 'MAGLEV trains use the same principle at massive scale. Powerful electromagnets create enough repulsive force to lift a 40-tonne train car off the track. No friction = speeds over 600 km/h. Question: why do maglev trains need active computer systems to stay stable? (Hint: why doesn\'t your pen need one?) Discuss.', tip: 'A heavier train needs enormously stronger magnets. And unlike your pen (which stays in the magnetic "bowl"), a train on a flat track can drift sideways — computers correct this hundreds of times per second.' },
        { emoji: '✏️', title: 'Draw and label — force diagram', text: 'Draw the floating pen above the base. Draw and label 4 things: (1) NORTH POLE on the base magnet, (2) NORTH POLE on the pen magnet (same → repel), (3) MAGNETIC REPULSION arrow pointing UP from base to pen, (4) GRAVITY arrow pointing DOWN from pen. Write the conclusion: "The pen floats because ___."', tip: 'In physics, force diagrams (called free body diagrams) show ALL forces on an object as arrows. The pen has two arrows of equal length = balanced forces = equilibrium.' },
      ],
    },
  },
]

async function run() {
  for (const activity of scienceContent) {
    // Find the assigned content item for this grade + week
    const items = await sql`
      SELECT ci.id, ci.title
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'science'
        AND ci.grade_band = ${activity.gradeBand}
        AND c.week_number = ${activity.weekNumber}
        AND c.grade_band = ${activity.gradeBand}
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
    `

    if (items.length === 0) {
      // Fallback: no classroom assignment, pick newest
      const [item] = await sql`
        SELECT ci.id, ci.title FROM content_items ci
        JOIN curriculum_content cc ON cc.content_item_id = ci.id
        JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
        JOIN curriculum c ON c.id = cd.curriculum_id
        WHERE ci.subject = 'science'
          AND ci.grade_band = ${activity.gradeBand}
          AND c.week_number = ${activity.weekNumber}
        ORDER BY ci.created_at DESC LIMIT 1
      `
      if (!item) { console.warn(`⚠ Not found: ${activity.gradeBand} W${activity.weekNumber} science`); continue }
      await sql`UPDATE content_items SET title = ${activity.title}, step_count = ${activity.stepCount}, metadata = ${activity.metadata} WHERE id = ${item.id}`
      console.log(`✓ (fallback) ${activity.gradeBand} W${activity.weekNumber}: "${activity.title}"`)
      continue
    }

    for (const item of items) {
      await sql`UPDATE content_items SET title = ${activity.title}, step_count = ${activity.stepCount}, metadata = ${activity.metadata} WHERE id = ${item.id}`
      console.log(`✓ ${activity.gradeBand} W${activity.weekNumber}: "${activity.title}" (was: "${item.title}")`)
    }
  }

  await sql.end()
  console.log('\nDone! Science content updated.')
}

run().catch(e => { console.error(e); process.exit(1) })

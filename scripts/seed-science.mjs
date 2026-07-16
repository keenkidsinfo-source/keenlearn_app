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
    title: 'What do plants need?',
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

  // ── G1-2 Week 2: Push & Pull — Forces All Around Us ────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    title: 'Push & Pull: Forces All Around Us',
    stepCount: 6,
    metadata: {
      steps: [
        { emoji: '🤔', title: 'What is a force?', text: 'A force is a push OR a pull. Push your chair away from you — that\'s a push force. Pull it back — that\'s a pull force. Find 3 things in the classroom and decide: is it a push, a pull, or both? Write them down.', tip: 'Gravity is a pull force too — it\'s what keeps you on the ground!' },
        { emoji: '📏', title: 'Ramp experiment setup', text: 'Make a ramp by leaning a book against a stack of 2 other books. Place a toy car at the TOP of the ramp. Let go. Measure how far it rolls with a ruler. Write the distance.', tip: 'Let go gently — don\'t push! We want gravity to be the only force.' },
        { emoji: '📐', title: 'Change the slope', text: 'Now make the ramp STEEPER by adding one more book. Release the car again. How far does it roll this time? Add another book and try again. Record all 3 distances in a table.', tip: 'A steeper ramp means a stronger push from gravity — predict before you try!' },
        { emoji: '🧲', title: 'Friction detective', text: 'Roll the car on the smooth floor, then on the carpet, then on a rough towel. Does it go the same distance each time? The force that slows it down is called FRICTION.', tip: 'Friction always acts in the OPPOSITE direction to movement — it\'s nature\'s brake!' },
        { emoji: '📝', title: 'Record your results', text: 'Fill in your results table: Surface | Distance rolled. Which surface had the most friction (shortest roll)? Which had the least? Circle your answer and write one sentence explaining why.', tip: 'Pattern: rougher surface → more friction → car stops sooner.' },
        { emoji: '🏗️', title: 'Connect to Build week', text: 'Think about your balance scale from Build day. Which force made the heavier side tip down? What would happen on the moon where gravity is weaker? Discuss with a partner!', tip: 'STEM is connected — the forces in your build project are the SAME forces you just measured!' },
      ],
    },
  },

  // ── G3-4 Week 1: Forces and Motion Lab ─────────────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    title: 'Forces and Motion Lab',
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

  // ── G3-4 Week 2: Measuring Forces with Newtons ─────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    title: 'Measuring Forces with Newtons',
    stepCount: 7,
    metadata: {
      steps: [
        { emoji: '⚖️', title: 'What is a Newton?', text: 'A Newton (N) is the unit of force. 1 Newton ≈ the weight of a 100g apple. Write: Weight (N) = mass (kg) × 9.8. If you weigh 30 kg on Earth, what is your weight in Newtons? Calculate it!', tip: 'Weight and mass are DIFFERENT: mass is how much stuff, weight is the gravitational force on that stuff.' },
        { emoji: '🏗️', title: 'Build a spring scale', text: 'Stretch a rubber band and attach a paper cup. Mark the rest position "0 N." Hang a 100g weight (≈ 1 N) and mark that line. Add another 100g and mark 2 N. Keep going to 5 N. You\'ve made a force meter!', tip: 'This works because rubber bands obey Hooke\'s Law: stretch is proportional to force.' },
        { emoji: '📏', title: 'Calibrate and test', text: 'Use your spring scale to measure: (1) your pencil case, (2) a book, (3) your shoe. Record the force in Newtons. Then check with a real spring scale or balance — how close were your measurements?', tip: 'All measuring instruments need calibration — even the ones in hospitals and space stations!' },
        { emoji: '🔬', title: 'Measure lever forces', text: 'Set up your lever from Build day. Hang a 200g load at 10 cm from the fulcrum. Measure the effort force needed at 20 cm. Then at 5 cm. Fill in: Distance from fulcrum: 5 cm / 10 cm / 20 cm | Force needed: ___N / ___N / ___N', tip: 'Pattern you\'ll find: twice the distance = half the force. This is the Law of the Lever: F × d = F × d' },
        { emoji: '📐', title: 'Calculate mechanical advantage', text: 'Mechanical Advantage (MA) = Load Force ÷ Effort Force. Calculate MA for each fulcrum position. Which gave the best mechanical advantage? Write: "The lever with the fulcrum at ___ gave MA = ___, meaning I only needed to push with ___ N to lift ___N."', tip: 'MA > 1 means the machine multiplies your force. MA < 1 means it trades force for speed.' },
        { emoji: '📊', title: 'Graph force vs. distance', text: 'Plot a line graph: x-axis = effort distance from fulcrum (cm), y-axis = force needed (N). Draw the best-fit line. Is it linear? What does the shape tell you about the relationship between distance and force?', tip: 'A straight downward line confirms an inverse relationship: force × distance = constant.' },
        { emoji: '🌍', title: 'Levers in the real world', text: 'Find a lever in everyday life (scissors, door handle, wheelbarrow, see-saw). Identify: fulcrum, effort point, load point. Calculate the approximate mechanical advantage. Would a longer handle make it easier or harder? Explain using your graph.', tip: 'Archimedes said "Give me a lever long enough and I shall move the world." Was he right? Discuss!' },
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

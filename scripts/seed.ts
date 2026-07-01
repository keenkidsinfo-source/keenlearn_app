import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local (Next.js doesn't load it automatically outside the app)
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* .env.local not found — rely on existing env */ }

const DATABASE_URL = process.env.DATABASE_URL!
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set. Check .env.local')
const sql = postgres(DATABASE_URL)

async function seed() {
  console.log('Seeding database...')

  // 0. Schema migrations
  await sql`ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS teacher_id uuid`
  await sql`ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS school_id uuid`
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS school_id uuid`
  await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS metadata jsonb`
  await sql`
    CREATE TABLE IF NOT EXISTS schools (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS school_schedule (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      day_of_week integer NOT NULL,
      subject text NOT NULL
    )
  `
  console.log('✓ Schema ready')

  // Fix old email if needed
  await sql`UPDATE users SET email = 'teacher@keenkidsenrichment.com' WHERE email = 'teacher@keenkids.com'`

  // 1. Create schools
  const mattosSchedule = [
    { day: 1, subject: 'build' },
    { day: 2, subject: 'coding' },
    { day: 3, subject: 'public_speaking' },
    { day: 4, subject: 'science' },
    { day: 5, subject: 'free_build' },
  ]
  const sinnottSchedule = [
    { day: 1, subject: 'coding' },
    { day: 2, subject: 'build' },
    { day: 3, subject: 'public_speaking' },
    { day: 4, subject: 'math' },
    { day: 5, subject: 'free_build' },
  ]

  for (const [schoolName, slug, schedule] of [
    ['Mabel Mattos Elementary', 'mattos', mattosSchedule],
    ['John Sinnott Elementary', 'sinnott', sinnottSchedule],
  ] as const) {
    const [school] = await sql`
      INSERT INTO schools (name, slug) VALUES (${schoolName}, ${slug})
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `
    // Wipe and re-insert schedule
    await sql`DELETE FROM school_schedule WHERE school_id = ${school.id}`
    for (const s of schedule) {
      await sql`INSERT INTO school_schedule (school_id, day_of_week, subject) VALUES (${school.id}, ${s.day}, ${s.subject})`
    }
    console.log(`✓ School: ${schoolName} (${slug})`)
  }

  // 2. Get Mattos school for the demo classroom
  const [mattos] = await sql`SELECT id FROM schools WHERE slug = 'mattos'`

  // 3. Create teacher
  const passwordHash = await bcrypt.hash('teacher123', 10)
  const [teacher] = await sql`
    INSERT INTO users (school_id, name, role, email, password_hash)
    VALUES (${mattos.id}, 'Ms. Johnson', 'teacher', 'teacher@keenkidsenrichment.com', ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET school_id = EXCLUDED.school_id, name = EXCLUDED.name
    RETURNING id, email
  `
  console.log('✓ Teacher:', teacher.email)

  // 4. Create classroom linked to Mattos school + teacher
  const [classroom] = await sql`
    INSERT INTO classrooms (school_id, teacher_id, name, grade_level, grade_band, access_code)
    VALUES (${mattos.id}, ${teacher.id}, 'Class 1A', '1', 'g1-2', 'KEEN01')
    ON CONFLICT (access_code) DO UPDATE SET school_id = EXCLUDED.school_id, teacher_id = EXCLUDED.teacher_id
    RETURNING id, access_code
  `
  console.log('✓ Classroom code:', classroom.access_code, '(Mattos)')

  // 5. Students
  await sql`DELETE FROM users WHERE classroom_id = ${classroom.id} AND role = 'student'`
  const students = [
    { name: 'Alice', pin: '1234', avatar: 1 },
    { name: 'Bob',   pin: '2345', avatar: 2 },
    { name: 'Carol', pin: '3456', avatar: 3 },
  ]
  for (const s of students) {
    const pinHash = await bcrypt.hash(s.pin, 10)
    await sql`
      INSERT INTO users (school_id, classroom_id, name, display_name, role, pin_hash, avatar_id)
      VALUES (${mattos.id}, ${classroom.id}, ${s.name}, ${s.name}, 'student', ${pinHash}, ${s.avatar})
    `
    console.log(`  ✓ Student: ${s.name} (PIN: ${s.pin})`)
  }

  // 6. Curriculum — wipe all weeks in FK-safe order and re-seed
  await sql`DELETE FROM classroom_curriculum`
  await sql`DELETE FROM coding_projects`
  await sql`DELETE FROM student_sessions WHERE content_item_id IN (SELECT id FROM content_items WHERE grade_band IN ('g1-2', 'g3-4'))`
  await sql`DELETE FROM curriculum_content`
  await sql`DELETE FROM content_items WHERE grade_band IN ('g1-2', 'g3-4')`
  await sql`DELETE FROM curriculum WHERE week_number IN (1, 2) AND grade_band IN ('g1-2', 'g3-4')`
  // curriculum_days cascade-deletes when curriculum is deleted (ON DELETE CASCADE)

  const [week1] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES ('Week 1 — Exploring Our World', 'g1-2', 1, 'Nature & Discovery', true)
    RETURNING id, title
  `
  console.log('✓ Curriculum:', week1.title)
  const mathQuestions = JSON.stringify([
    { id: 1, phase: 'concrete', emoji: '🍎', prompt: 'If you have 3 apples and get 2 more, how many do you have?', choices: ['4', '5', '6', '7'], answer: 1 },
    { id: 2, phase: 'pictorial', emoji: '🟡', prompt: '🟡🟡🟡 + 🟡🟡 = ?', choices: ['4', '5', '6', '7'], answer: 1 },
    { id: 3, phase: 'abstract', emoji: '✏️', prompt: '3 + 2 = ?', choices: ['4', '5', '6', '7'], answer: 1 },
    { id: 4, phase: 'concrete', emoji: '🐣', prompt: 'There are 8 chicks. 3 walk away. How many are left?', choices: ['3', '4', '5', '6'], answer: 2 },
    { id: 5, phase: 'abstract', emoji: '✏️', prompt: '8 − 3 = ?', choices: ['3', '4', '5', '6'], answer: 2 },
  ])

  const cableCar = JSON.stringify({ steps: [
    { emoji: '🎯', title: 'Get Ready', text: 'Find your pre-threaded straw on the zip line. Don\'t start building yet — listen to both rules first!', tip: 'Rule 1: must slide the full length. Rule 2: must carry at least 3 paperclip cargo.', image: '/images/build/cable-car/step-1.svg' },
    { emoji: '✂️', title: 'Punch 2 Holes', text: 'Punch a hole near the top rim of your cup on each side — directly opposite each other. Ask for help if needed!', tip: 'The holes must be opposite so the cup hangs level.', image: '/images/build/cable-car/step-2.svg' },
    { emoji: '🪢', title: 'Thread the String', text: 'Take a 30cm piece of string. Push one end through the LEFT hole from outside to inside, pull it across, then push it out through the RIGHT hole. Tie a knot on each end outside the cup — the knots act as stoppers. Tug both ends to confirm they hold. The cup should hang level!', tip: 'If the cup hangs crooked, re-thread until both sides are equal length.', image: '/images/build/cable-car/step-3.svg' },
    { emoji: '🩹', title: 'Reinforce the Holes', text: 'Put small tape patches over the holes on both sides. This stops the string from tearing through when you add cargo.', image: '/images/build/cable-car/step-4.svg' },
    { emoji: '🪝', title: 'Make Your Hook', text: 'Bend a paperclip into an S-hook shape. This is your pull handle — clip it to the string above the cup.', image: '/images/build/cable-car/step-5.svg' },
    { emoji: '🚡', title: 'Test Run!', text: 'Release your cable car — does it glide all the way to the end of the zip line? Watch the straw rolling along the string.', tip: 'If it sticks, check that no tape is touching the string.', image: '/images/build/cable-car/step-6.svg' },
    { emoji: '📎', title: 'Cargo Challenge', text: 'Add paperclips to your cup one at a time. How many can your cable car carry before it stops? Write your number on the class chart!', image: '/images/build/cable-car/step-7.svg' },
    { emoji: '🔧', title: 'Fix & Improve', text: 'Why did yours slow down or stop? Make ONE change — remove a paperclip, centre the cargo, or adjust the tape — then retest. Did your number improve?', tip: 'What would make it carry even more? (Steeper line? Lighter cup?)', image: '/images/build/cable-car/step-8.svg' },
  ]})

  const days = [
    { day: 1, subject: 'build',           theme: 'Cable Car',                           type: 'illustrated-steps', meta: cableCar },
    { day: 2, subject: 'coding',          theme: 'My first Scratch story',              type: 'sandbox',           meta: JSON.stringify({ language: 'scratch' }) },
    { day: 3, subject: 'public_speaking', theme: 'Show and Tell: My Favourite Plant',   type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'science',         theme: 'What do plants need?',                type: 'illustrated-steps', meta: null },
    { day: 5, subject: 'free_build',      theme: 'Free Build Friday',                   type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'math',            theme: 'Adding and Subtracting',              type: 'activity',          meta: JSON.stringify({ questions: JSON.parse(mathQuestions) }) },
  ]

  for (const d of days) {
    const [day] = await sql`
      INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
      VALUES (${week1.id}, ${d.day}, ${d.subject}, ${d.theme})
      RETURNING id
    `
    const metaVal = d.meta ? JSON.parse(d.meta) : null
    const [item] = await sql`
      INSERT INTO content_items (subject, type, title, description, grade_band, duration_mins, step_count, metadata)
      VALUES (${d.subject}, ${d.type}, ${d.theme}, ${'A fun ' + d.subject + ' activity'}, 'g1-2', 20, 5, ${metaVal})
      RETURNING id
    `
    await sql`
      INSERT INTO curriculum_content (curriculum_day_id, content_item_id, order_index)
      VALUES (${day.id}, ${item.id}, 0)
    `
  }
  console.log('✓ Seeded G1-2 curriculum days')

  // 6b. G3-4 curriculum week 1
  await sql`DELETE FROM curriculum WHERE week_number = 1 AND grade_band = 'g3-4'`
  const [week1g34] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES ('Week 1 — Exploring Our World', 'g3-4', 1, 'Motion & Transportation', true)
    RETURNING id, title
  `
  console.log('✓ G3-4 Curriculum:', week1g34.title)

  const deskCrane = JSON.stringify({ steps: [
    { emoji: '🏗️', title: 'Build the Mast', text: 'Tape your cardboard tube upright to the centre of the base. Wrap tape around the base 4+ times in different directions.', tip: 'Push the top sideways — it must NOT wobble. Add cardstock diagonal braces if it does!', image: '/images/build/desk-crane/step-1.svg' },
    { emoji: '➡️', title: 'Add the Boom Arm', text: 'Tape your cardstock strip horizontally to the top of the mast, extending 15cm outward. This is your boom arm.', tip: 'Tape it firmly — the boom holds all the weight!', image: '/images/build/desk-crane/step-2.svg' },
    { emoji: '⚙️', title: 'Fixed Pulley', text: 'Tape the first spool to the far end of the boom. This is your fixed pulley — it must rotate freely. Do NOT tape through its centre hole.', image: '/images/build/desk-crane/step-3.svg' },
    { emoji: '🔄', title: 'Movable Pulley', text: 'Cut 80cm of string. Loop it over the fixed spool, then down and under the second spool, then back up and tie the end to the boom near the mast. The second spool must hang freely below the boom.', tip: 'If strings tangle, check the movable spool is hanging freely and strings are not crossed.', image: '/images/build/desk-crane/step-4.svg' },
    { emoji: '🪣', title: 'Attach the Load', text: 'Tie your load cup (with 10 pennies) to the movable spool with a 10cm string. Pull the effort string — does the cup rise?', image: '/images/build/desk-crane/step-5.svg' },
    { emoji: '💪', title: 'Test 3 Ways', text: 'Lift the cup 3 ways and record Easy/Medium/Hard on the class chart. 1) Bare hand — Hard. 2) Fixed pulley only — Medium. 3) Full compound system — Easy!', tip: 'If compound doesn\'t feel easier than bare hand, your movable spool isn\'t hanging freely.', image: '/images/build/desk-crane/step-6.svg' },
    { emoji: '🪙', title: 'Cargo Challenge', text: 'Add 10 more pennies (double the load). Does the compound system still feel easier than your bare hand? The compound saves even MORE effort as the load increases!', image: '/images/build/desk-crane/step-7.svg' },
    { emoji: '🗣️', title: 'Share Out', text: 'Who had the biggest difference between bare hand and compound? Where do we see compound pulleys in real life? (Tower cranes, elevators, rock climbing gear, sailing rigging!)', tip: 'New vocab: FIXED PULLEY · MOVABLE PULLEY · COMPOUND PULLEY · MECHANICAL ADVANTAGE · EFFORT · LOAD', image: '/images/build/desk-crane/step-8.svg' },
  ]})

  const g34Days = [
    { day: 1, subject: 'build', theme: 'Desk Crane', type: 'illustrated-steps', meta: deskCrane },
    { day: 2, subject: 'coding', theme: 'My first Python story', type: 'sandbox', meta: JSON.stringify({ language: 'python' }) },
    { day: 3, subject: 'public_speaking', theme: 'Debate: Machines vs. People', type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'science', theme: 'Forces and Motion Lab', type: 'illustrated-steps', meta: null },
    { day: 5, subject: 'free_build', theme: 'Engineer\'s Choice Friday', type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'math', theme: 'Multiplication Patterns', type: 'activity', meta: null },
  ]

  for (const d of g34Days) {
    const [day] = await sql`
      INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
      VALUES (${week1g34.id}, ${d.day}, ${d.subject}, ${d.theme})
      RETURNING id
    `
    const metaVal = d.meta ? JSON.parse(d.meta) : null
    const [item] = await sql`
      INSERT INTO content_items (subject, type, title, description, grade_band, duration_mins, step_count, metadata)
      VALUES (${d.subject}, ${d.type}, ${d.theme}, ${'A fun ' + d.subject + ' activity'}, 'g3-4', 20, 8, ${metaVal})
      RETURNING id
    `
    await sql`
      INSERT INTO curriculum_content (curriculum_day_id, content_item_id, order_index)
      VALUES (${day.id}, ${item.id}, 0)
    `
  }
  console.log('✓ Seeded G3-4 curriculum days')

  // 6c. G1-2 curriculum week 2
  const [week2g12] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES ('Week 2 — Balance & Forces', 'g1-2', 2, 'Levers & Balance', true)
    RETURNING id, title
  `
  console.log('✓ G1-2 Week 2 Curriculum:', week2g12.title)

  const leverScale = JSON.stringify({ steps: [
    { emoji: '📏', title: 'Tape Left Cup', text: 'Tape a 15cm piece of string to the LEFT end of your ruler (at the "0" end). Let it dangle down. Your cup will hang from this string — tape it firmly or it will fall!', tip: 'The string should hang straight down from the ruler edge, not the top.', image: '/images/build/lever-scale/step-1.svg' },
    { emoji: '📏', title: 'Tape Right Cup', text: 'Now tape another 15cm string to the RIGHT end of your ruler. Hang the second cup the same way. Both cups should hang at about the same height when the ruler is flat.', tip: 'Use equal-length strings! If one cup hangs lower, re-tape until they match.', image: '/images/build/lever-scale/step-2.svg' },
    { emoji: '✏️', title: 'Balance It!', text: 'Place the middle of your ruler on the pencil eraser (fulcrum). Try to find the spot where the ruler sits flat without tipping. Mark that spot with a pencil line — that\'s the balance point!', tip: 'Nudge the ruler left or right until it balances. The balance point is not always the exact centre!', image: '/images/build/lever-scale/step-3.svg' },
    { emoji: '✅', title: 'Calibration Check', text: 'Put the same object in each cup — they should be identical. Does your scale stay flat? If yes, your scale is calibrated and ready to weigh things!', tip: 'If it still tips with equal objects, adjust the string lengths until they match.', image: '/images/build/lever-scale/step-4.svg' },
    { emoji: '🔮', title: 'Make Predictions', text: 'Look at the 4 object pairs on your sheet. BEFORE weighing, write your prediction: which one do you think is heavier? Think about size, material, and how heavy it felt when you picked it up.', tip: 'Scientists always predict before they test — it helps you learn even when you\'re wrong!', image: '/images/build/lever-scale/step-5.svg' },
    { emoji: '⚖️', title: 'Weigh All 4 Pairs', text: 'Put one object in the left cup, the other in the right cup. Which side tips down? The heavier object goes to the ground! Record your results. How many did you predict correctly?', tip: 'Which result surprised you the most? Think about WHY your prediction was wrong.', image: '/images/build/lever-scale/step-6.svg' },
    { emoji: '🔬', title: 'Fulcrum Explorer', text: 'Try balancing a heavy eraser against a light cotton ball. If you slide the fulcrum TOWARD the heavy side, can you make them balance? Try it! The further the light object is from the fulcrum, the more lifting power it has.', tip: 'Big idea: a shorter arm needs less force but moves less. A longer arm needs more force but moves more. TRADE-OFFS!', image: '/images/build/lever-scale/step-7.svg' },
  ]})

  const mathQuestions2 = JSON.stringify([
    { id: 1, phase: 'concrete', emoji: '🍌', prompt: 'A bunch has 4 bananas. You eat 1. How many left?', choices: ['2', '3', '4', '5'], answer: 1 },
    { id: 2, phase: 'pictorial', emoji: '🟦', prompt: '🟦🟦🟦🟦🟦 − 🟦🟦 = ?', choices: ['1', '2', '3', '4'], answer: 2 },
    { id: 3, phase: 'abstract', emoji: '✏️', prompt: '7 + 6 = ?', choices: ['11', '12', '13', '14'], answer: 2 },
    { id: 4, phase: 'concrete', emoji: '🌟', prompt: 'There are 10 stars. 4 are red, the rest are blue. How many are blue?', choices: ['4', '5', '6', '7'], answer: 2 },
    { id: 5, phase: 'abstract', emoji: '✏️', prompt: '15 − 8 = ?', choices: ['5', '6', '7', '8'], answer: 2 },
  ])

  const week2g12Days = [
    { day: 1, subject: 'build',           theme: 'Lever Balance Scale',                 type: 'illustrated-steps', meta: leverScale },
    { day: 2, subject: 'coding',          theme: 'Make a sprite move',                  type: 'sandbox',           meta: JSON.stringify({ language: 'scratch' }) },
    { day: 3, subject: 'public_speaking', theme: 'Persuade Me: Best Superpower',        type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'science',         theme: 'Push & Pull: Forces All Around Us',   type: 'illustrated-steps', meta: null },
    { day: 5, subject: 'free_build',      theme: 'Free Build Friday',                   type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'math',            theme: 'Adding & Subtracting to 20',          type: 'activity',          meta: JSON.stringify({ questions: JSON.parse(mathQuestions2) }) },
  ]

  for (const d of week2g12Days) {
    const [day] = await sql`
      INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
      VALUES (${week2g12.id}, ${d.day}, ${d.subject}, ${d.theme})
      RETURNING id
    `
    const metaVal = d.meta ? JSON.parse(d.meta) : null
    const [item] = await sql`
      INSERT INTO content_items (subject, type, title, description, grade_band, duration_mins, step_count, metadata)
      VALUES (${d.subject}, ${d.type}, ${d.theme}, ${'A fun ' + d.subject + ' activity'}, 'g1-2', 20, 7, ${metaVal})
      RETURNING id
    `
    await sql`
      INSERT INTO curriculum_content (curriculum_day_id, content_item_id, order_index)
      VALUES (${day.id}, ${item.id}, 0)
    `
  }
  console.log('✓ Seeded G1-2 Week 2 curriculum days')

  // 6d. G3-4 curriculum week 2
  const [week2g34] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES ('Week 2 — Lever Mechanics', 'g3-4', 2, '3 Classes of Levers', true)
    RETURNING id, title
  `
  console.log('✓ G3-4 Week 2 Curriculum:', week2g34.title)

  const leverChallenge = JSON.stringify({ steps: [
    { emoji: '📚', title: 'The 3 Lever Classes', text: 'Study the diagram of all 3 lever classes. The key is the ORDER of Fulcrum (F), Effort (E), and Load (L). Class 1: E–F–L (seesaw). Class 2: E–L–F (wheelbarrow). Class 3: F–E–L (tweezers). Draw all 3 in your engineering notebook!', tip: 'Memory trick: Class 1 = F in the middle. Class 2 = L in the middle. Class 3 = E in the middle.', image: '/images/build/lever-challenge/step-1.svg' },
    { emoji: '⚖️', title: 'Build Class 1 — Seesaw', text: 'Place the eraser fulcrum under the MIDDLE of your popsicle stick. Put 2 paperclip loads on the RIGHT side. Push the LEFT side down with your finger — that\'s your effort. The load should lift! This is a Class 1 lever: E–F–L.', tip: 'Try moving the fulcrum closer to the load. Does it get easier or harder to lift?', image: '/images/build/lever-challenge/step-2.svg' },
    { emoji: '🛻', title: 'Build Class 2 — Wheelbarrow', text: 'Place the eraser fulcrum at the RIGHT END of the stick. Put a small weight in the MIDDLE of the stick. Push the LEFT end UP — that\'s your effort. You\'re lifting the load with less effort! Class 2: E–L–F.', tip: 'Class 2 always gives you a mechanical advantage — it\'s easier to lift the same load!', image: '/images/build/lever-challenge/step-3.svg' },
    { emoji: '🥢', title: 'Build Class 3 — Speed Lever', text: 'Place the fulcrum at the LEFT END of the stick. The load (cotton ball) goes on the RIGHT END. Apply your effort in the MIDDLE of the stick. Class 3: F–E–L. It takes MORE force than the other classes — but watch how FAR and FAST the load moves!', tip: 'Your forearm is a Class 3 lever! The elbow is the fulcrum, muscle in middle, hand is the load.', image: '/images/build/lever-challenge/step-4.svg' },
    { emoji: '📏', title: 'Measure Effort Force', text: 'Attach a rubber band to the effort point of each lever. Pull until the load just lifts — measure the rubber band stretch in cm. Record: Class 1 stretch = ___cm. Class 2 stretch = ___cm. Class 3 stretch = ___cm. Which required the most stretch (force)?', tip: 'More stretch = more force needed. Does this match your prediction from Step 1?', image: '/images/build/lever-challenge/step-5.svg' },
    { emoji: '🏋️', title: 'Cargo Challenge', text: 'Set all 3 levers to the same fulcrum position. Add coins (paperclips) one at a time to each load. Which class carries the most before the lever tips? Record your max loads and compare with classmates.', tip: 'Predict first! The answer might surprise you — it depends WHERE your fulcrum is!', image: '/images/build/lever-challenge/step-6.svg' },
    { emoji: '🌍', title: 'Lever Hunt', text: 'Find one lever in this classroom. Identify: Where is the fulcrum? Where is the effort applied? Where is the load? Which class is it? Share with the class — can everyone agree on the class? Look for: scissors, door hinges, staplers, tweezers!', tip: 'Some objects contain TWO levers (scissors = two Class 1 levers joined at the fulcrum!)', image: '/images/build/lever-challenge/step-7.svg' },
  ]})

  const week2g34Days = [
    { day: 1, subject: 'build',           theme: '3-Class Lever Challenge',          type: 'illustrated-steps', meta: leverChallenge },
    { day: 2, subject: 'coding',          theme: 'Python: Loops and Patterns',       type: 'sandbox',           meta: JSON.stringify({ language: 'python' }) },
    { day: 3, subject: 'public_speaking', theme: 'Structured Debate: Tech in Sport', type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'science',         theme: 'Measuring Forces with Newtons',    type: 'illustrated-steps', meta: null },
    { day: 5, subject: 'free_build',      theme: "Engineer's Choice Friday",         type: 'illustrated-steps', meta: null },
    { day: 4, subject: 'math',            theme: 'Ratios & Mechanical Advantage',    type: 'activity',          meta: null },
  ]

  for (const d of week2g34Days) {
    const [day] = await sql`
      INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
      VALUES (${week2g34.id}, ${d.day}, ${d.subject}, ${d.theme})
      RETURNING id
    `
    const metaVal = d.meta ? JSON.parse(d.meta) : null
    const [item] = await sql`
      INSERT INTO content_items (subject, type, title, description, grade_band, duration_mins, step_count, metadata)
      VALUES (${d.subject}, ${d.type}, ${d.theme}, ${'A fun ' + d.subject + ' activity'}, 'g3-4', 20, 7, ${metaVal})
      RETURNING id
    `
    await sql`
      INSERT INTO curriculum_content (curriculum_day_id, content_item_id, order_index)
      VALUES (${day.id}, ${item.id}, 0)
    `
  }
  console.log('✓ Seeded G3-4 Week 2 curriculum days')

  // 7. Assign week 1 to the classroom (starting this Monday)
  const today = new Date()
  const dow = today.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  // Use local date components to avoid UTC-offset shifting the date
  const pad = (n: number) => String(n).padStart(2, '0')
  const mondayStr = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`

  // Calculate next Monday
  const nextMonday = new Date(monday)
  nextMonday.setDate(monday.getDate() + 7)
  const nextMondayStr = `${nextMonday.getFullYear()}-${pad(nextMonday.getMonth() + 1)}-${pad(nextMonday.getDate())}`

  await sql`DELETE FROM classroom_curriculum WHERE classroom_id = ${classroom.id}`
  await sql`
    INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
    VALUES (${classroom.id}, ${week1.id}, ${mondayStr})
  `
  await sql`
    INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
    VALUES (${classroom.id}, ${week2g12.id}, ${nextMondayStr})
  `
  console.log('✓ Assigned Week 1 to Mattos classroom starting', mondayStr)
  console.log('✓ Assigned Week 2 to Mattos classroom starting', nextMondayStr)

  // 8. Sinnott test classroom + teacher + student
  const [sinnott] = await sql`SELECT id FROM schools WHERE slug = 'sinnott'`

  const sinnottPasswordHash = await bcrypt.hash('teacher123', 10)
  const [sinnottTeacher] = await sql`
    INSERT INTO users (school_id, name, role, email, password_hash)
    VALUES (${sinnott.id}, 'Mr. Smith', 'teacher', 'teacher2@keenkidsenrichment.com', ${sinnottPasswordHash})
    ON CONFLICT (email) DO UPDATE SET school_id = EXCLUDED.school_id, name = EXCLUDED.name
    RETURNING id, email
  `
  console.log('✓ Sinnott Teacher:', sinnottTeacher.email)

  const [sinnottClass] = await sql`
    INSERT INTO classrooms (school_id, teacher_id, name, grade_level, grade_band, access_code)
    VALUES (${sinnott.id}, ${sinnottTeacher.id}, 'Class 1B', '1', 'g1-2', 'SINN01')
    ON CONFLICT (access_code) DO UPDATE SET school_id = EXCLUDED.school_id, teacher_id = EXCLUDED.teacher_id
    RETURNING id, access_code
  `
  console.log('✓ Classroom code:', sinnottClass.access_code, '(Sinnott)')

  await sql`DELETE FROM users WHERE classroom_id = ${sinnottClass.id} AND role = 'student'`
  const davidPin = await bcrypt.hash('4567', 10)
  await sql`
    INSERT INTO users (school_id, classroom_id, name, display_name, role, pin_hash, avatar_id)
    VALUES (${sinnott.id}, ${sinnottClass.id}, 'David', 'David', 'student', ${davidPin}, 4)
  `
  console.log('  ✓ Student: David (PIN: 4567)')

  await sql`DELETE FROM classroom_curriculum WHERE classroom_id = ${sinnottClass.id}`
  await sql`
    INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
    VALUES (${sinnottClass.id}, ${week1.id}, ${mondayStr})
  `
  await sql`
    INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
    VALUES (${sinnottClass.id}, ${week2g12.id}, ${nextMondayStr})
  `
  console.log('✓ Assigned Week 1 to Sinnott classroom starting', mondayStr)
  console.log('✓ Assigned Week 2 to Sinnott classroom starting', nextMondayStr)

  console.log('\nDone! Login details:')
  console.log('  Mattos Teacher  → teacher@keenkidsenrichment.com / teacher123')
  console.log('  Mattos Code     → KEEN01')
  console.log('  Mattos Students → Alice/1234, Bob/2345, Carol/3456')
  console.log('  Schedule        → Mon=Build, Tue=Coding, Wed=Public Speaking, Thu=Science, Fri=Free Build')
  console.log('')
  console.log('  Sinnott Teacher  → teacher2@keenkidsenrichment.com / teacher123')
  console.log('  Sinnott Code     → SINN01')
  console.log('  Sinnott Students → David/4567')
  console.log('  Schedule         → Mon=Coding, Tue=Build, Wed=Public Speaking, Thu=Math, Fri=Free Build')

  await sql.end()
}

seed().catch(e => { console.error(e); process.exit(1) })

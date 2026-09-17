/**
 * seed-w4.mjs — Create Week 4 curriculum structure for both g1-2 and g3-4,
 * then assign it to every classroom that already has weeks 1–3.
 *
 * After running this, run:
 *   node scripts/fix-week-dates.mjs
 *   node scripts/seed-coding-w4-harrypotter.mjs
 *
 * Usage: node scripts/seed-w4.mjs
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

async function seedWeek(gradeBand, weekTitle, theme, days) {
  // Wipe any existing week 4 for this grade so the script is idempotent
  const existing = await sql`
    SELECT id FROM curriculum WHERE grade_band = ${gradeBand} AND week_number = 4
  `
  for (const row of existing) {
    await sql`DELETE FROM classroom_curriculum WHERE curriculum_id = ${row.id}`
    await sql`DELETE FROM curriculum WHERE id = ${row.id}`
  }

  const [week] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES (${weekTitle}, ${gradeBand}, 4, ${theme}, true)
    RETURNING id, title
  `
  console.log(`✓ Created curriculum: ${week.title}`)

  for (const d of days) {
    const [day] = await sql`
      INSERT INTO curriculum_days (curriculum_id, day_of_week, subject, theme)
      VALUES (${week.id}, ${d.day}, ${d.subject}, ${d.theme})
      RETURNING id
    `
    const [item] = await sql`
      INSERT INTO content_items (subject, type, title, description, grade_band, duration_mins, step_count, metadata)
      VALUES (
        ${d.subject},
        ${d.type},
        ${d.theme},
        ${'A fun ' + d.subject + ' activity'},
        ${gradeBand},
        70,
        ${d.stepCount ?? 5},
        ${d.meta ?? null}
      )
      RETURNING id
    `
    await sql`
      INSERT INTO curriculum_content (curriculum_day_id, content_item_id, order_index)
      VALUES (${day.id}, ${item.id}, 0)
    `
    console.log(`  ✓ ${d.subject}: ${d.theme}`)
  }

  return week.id
}

async function run() {
  // ── G1-2 Week 4 ─────────────────────────────────────────────────────────────
  const g12CodingMeta = {
    language: 'scratch',
    challenge: 'Harry vs Voldemort!',
    tagline: 'Shoot lightning bolts at Voldemort before time runs out!',
    starterUrl: '/scratch-starters/g1-2-w4-starter.sb3',
    steps: [],   // seed-coding-w4-harrypotter.mjs fills these in
  }

  const g12WeekId = await seedWeek(
    'g1-2',
    'Week 4 — Harry vs Voldemort',
    'Magic & Dueling',
    [
      { day: 1, subject: 'build',           theme: 'Week 4 Build',                      type: 'illustrated-steps', stepCount: 6 },
      { day: 2, subject: 'coding',          theme: 'Harry vs Voldemort!',               type: 'sandbox',           stepCount: 9,  meta: g12CodingMeta },
      { day: 3, subject: 'public_speaking', theme: 'Week 4 Public Speaking',            type: 'illustrated-steps', stepCount: 4 },
      { day: 4, subject: 'science',         theme: 'Week 4 Science',                    type: 'illustrated-steps', stepCount: 4 },
      { day: 5, subject: 'free_build',      theme: 'Free Build Friday',                 type: 'illustrated-steps', stepCount: 3 },
      { day: 4, subject: 'math',            theme: 'Week 4 Math',                       type: 'activity',          stepCount: 5 },
    ],
  )

  // ── G3-4 Week 4 ─────────────────────────────────────────────────────────────
  const g34CodingMeta = {
    language: 'scratch',
    challenge: 'The Dueling Championship!',
    tagline: "Code Voldemort's AI brain — HP bars, targeted curses, beat your personal best!",
    starterUrl: '/scratch-starters/g3-4-w4-starter.sb3',
    steps: [],   // seed-coding-w4-harrypotter.mjs fills these in
  }

  const g34WeekId = await seedWeek(
    'g3-4',
    'Week 4 — The Dueling Championship',
    'Magic & Dueling',
    [
      { day: 1, subject: 'build',           theme: 'Week 4 Build',                      type: 'illustrated-steps', stepCount: 8 },
      { day: 2, subject: 'coding',          theme: 'The Dueling Championship!',         type: 'sandbox',           stepCount: 11, meta: g34CodingMeta },
      { day: 3, subject: 'public_speaking', theme: 'Week 4 Public Speaking',            type: 'illustrated-steps', stepCount: 4 },
      { day: 4, subject: 'science',         theme: 'Week 4 Science',                    type: 'illustrated-steps', stepCount: 4 },
      { day: 5, subject: 'free_build',      theme: "Engineer's Choice Friday",          type: 'illustrated-steps', stepCount: 3 },
      { day: 4, subject: 'math',            theme: 'Week 4 Math',                       type: 'activity',          stepCount: 5 },
    ],
  )

  // ── Assign to all classrooms that have weeks 1–3 ─────────────────────────────
  const classrooms = await sql`
    SELECT DISTINCT c.id, c.name, c.grade_band
    FROM classrooms c
    JOIN classroom_curriculum cc ON cc.classroom_id = c.id
    JOIN curriculum cur ON cur.id = cc.curriculum_id
    WHERE cur.week_number IN (1, 2, 3)
  `

  console.log(`\nAssigning Week 4 to ${classrooms.length} classroom(s)…`)

  for (const cls of classrooms) {
    const weekId = cls.grade_band === 'g3-4' ? g34WeekId : g12WeekId

    // Week 4 starts Sep 21 2026 (one week after Sep 14)
    const [w3row] = await sql`
      SELECT cc.week_start_date
      FROM classroom_curriculum cc
      JOIN curriculum cur ON cur.id = cc.curriculum_id
      WHERE cc.classroom_id = ${cls.id}
        AND cur.week_number = 3
        AND cur.grade_band = ${cls.grade_band}
      ORDER BY cc.week_start_date DESC
      LIMIT 1
    `

    let week4Start
    if (w3row?.week_start_date) {
      const d = new Date(w3row.week_start_date)
      d.setDate(d.getDate() + 7)
      const pad = n => String(n).padStart(2, '0')
      week4Start = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    } else {
      // Fallback: hardcoded Sep 21 2026
      week4Start = '2026-09-21'
    }

    await sql`
      INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
      VALUES (${cls.id}, ${weekId}, ${week4Start})
      ON CONFLICT DO NOTHING
    `
    console.log(`  ✓ ${cls.name} (${cls.grade_band}) → Week 4 starts ${week4Start}`)
  }

  await sql.end()
  console.log('\nDone! Now run:')
  console.log('  node scripts/fix-week-dates.mjs')
  console.log('  node scripts/seed-coding-w4-harrypotter.mjs')
}

run().catch(e => { console.error(e); process.exit(1) })

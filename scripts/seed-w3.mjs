/**
 * seed-w3.mjs — Create Week 3 curriculum structure for both g1-2 and g3-4,
 * then assign it to every classroom that already has weeks 1–2.
 *
 * After running this, run seed-coding-projects.mjs to fill in Pokémon content.
 *
 * Usage: node scripts/seed-w3.mjs
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
  // Wipe any existing week 3 for this grade so the script is idempotent
  const existing = await sql`
    SELECT id FROM curriculum WHERE grade_band = ${gradeBand} AND week_number = 3
  `
  for (const row of existing) {
    await sql`DELETE FROM classroom_curriculum WHERE curriculum_id = ${row.id}`
    await sql`DELETE FROM curriculum WHERE id = ${row.id}`
  }

  const [week] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES (${weekTitle}, ${gradeBand}, 3, ${theme}, true)
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
  // ── G1-2 Week 3 ─────────────────────────────────────────────────────────────
  const g12CodingMeta = {
    language: 'scratch',
    challenge: 'Pokémon Catcher!',
    tagline: 'Move Pikachu and throw a Poké Ball to catch a Pokémon!',
    starterUrl: '/scratch-starters/g1-2-w3-starter.sb3',
    steps: [],   // seed-coding-projects.mjs fills these in
  }

  const g12WeekId = await seedWeek(
    'g1-2',
    'Week 3 — Pokémon Catcher',
    'Games & Characters',
    [
      { day: 1, subject: 'build',           theme: 'Week 3 Build',                      type: 'illustrated-steps', stepCount: 6 },
      { day: 2, subject: 'coding',          theme: 'Pokémon Catcher!',                  type: 'sandbox',           stepCount: 7, meta: g12CodingMeta },
      { day: 3, subject: 'public_speaking', theme: 'Week 3 Public Speaking',            type: 'illustrated-steps', stepCount: 4 },
      { day: 4, subject: 'science',         theme: 'Week 3 Science',                    type: 'illustrated-steps', stepCount: 4 },
      { day: 5, subject: 'free_build',      theme: 'Free Build Friday',                 type: 'illustrated-steps', stepCount: 3 },
      { day: 4, subject: 'math',            theme: 'Week 3 Math',                       type: 'activity',          stepCount: 5 },
    ],
  )

  // ── G3-4 Week 3 ─────────────────────────────────────────────────────────────
  const g34CodingMeta = {
    language: 'scratch',
    challenge: 'Pokémon Battle Game!',
    tagline: 'Build a full Pokémon catching game with HP, score, and a countdown timer!',
    starterUrl: '/scratch-starters/g3-4-w3-starter.sb3',
    steps: [],   // seed-coding-projects.mjs fills these in
  }

  const g34WeekId = await seedWeek(
    'g3-4',
    'Week 3 — Pokémon Battle Game',
    'Games & Characters',
    [
      { day: 1, subject: 'build',           theme: 'Week 3 Build',                      type: 'illustrated-steps', stepCount: 8 },
      { day: 2, subject: 'coding',          theme: 'Pokémon Battle Game!',              type: 'sandbox',           stepCount: 10, meta: g34CodingMeta },
      { day: 3, subject: 'public_speaking', theme: 'Week 3 Public Speaking',            type: 'illustrated-steps', stepCount: 4 },
      { day: 4, subject: 'science',         theme: 'Week 3 Science',                    type: 'illustrated-steps', stepCount: 4 },
      { day: 5, subject: 'free_build',      theme: "Engineer's Choice Friday",          type: 'illustrated-steps', stepCount: 3 },
      { day: 4, subject: 'math',            theme: 'Week 3 Math',                       type: 'activity',          stepCount: 5 },
    ],
  )

  // ── Assign to all classrooms that have weeks 1 or 2 ─────────────────────────
  const classrooms = await sql`
    SELECT DISTINCT c.id, c.name, c.grade_band
    FROM classrooms c
    JOIN classroom_curriculum cc ON cc.classroom_id = c.id
    JOIN curriculum cur ON cur.id = cc.curriculum_id
    WHERE cur.week_number IN (1, 2)
  `

  console.log(`\nAssigning Week 3 to ${classrooms.length} classroom(s)…`)

  // Week 2's start date → Week 3 starts one week later
  for (const cls of classrooms) {
    const weekId = cls.grade_band === 'g3-4' ? g34WeekId : g12WeekId

    // Find the week-2 start date for this classroom so week-3 follows naturally
    const [w2row] = await sql`
      SELECT cc.week_start_date
      FROM classroom_curriculum cc
      JOIN curriculum cur ON cur.id = cc.curriculum_id
      WHERE cc.classroom_id = ${cls.id}
        AND cur.week_number = 2
        AND cur.grade_band = ${cls.grade_band}
      ORDER BY cc.week_start_date DESC
      LIMIT 1
    `

    let week3Start
    if (w2row?.week_start_date) {
      const d = new Date(w2row.week_start_date)
      d.setDate(d.getDate() + 7)
      const pad = n => String(n).padStart(2, '0')
      week3Start = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    } else {
      // Fallback: two weeks from this Monday
      const today = new Date()
      const dow = today.getDay()
      const diff = dow === 0 ? -6 : 1 - dow
      const monday = new Date(today)
      monday.setDate(today.getDate() + diff + 14)
      const pad = n => String(n).padStart(2, '0')
      week3Start = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
    }

    await sql`
      INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
      VALUES (${cls.id}, ${weekId}, ${week3Start})
      ON CONFLICT DO NOTHING
    `
    console.log(`  ✓ ${cls.name} (${cls.grade_band}) → Week 3 starts ${week3Start}`)
  }

  await sql.end()
  console.log('\nDone! Now run: node scripts/seed-coding-projects.mjs')
}

run().catch(e => { console.error(e); process.exit(1) })

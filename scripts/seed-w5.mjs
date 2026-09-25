/**
 * seed-w5.mjs — Create Week 5 curriculum structure for both g1-2 and g3-4,
 * then assign it to every classroom that already has week 4.
 *
 * After running this, run:
 *   node scripts/seed-coding-w5-kart.mjs
 *
 * Usage: node scripts/seed-w5.mjs
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
  // Idempotent — wipe existing week 5 for this grade
  const existing = await sql`
    SELECT id FROM curriculum WHERE grade_band = ${gradeBand} AND week_number = 5
  `
  for (const row of existing) {
    await sql`DELETE FROM classroom_curriculum WHERE curriculum_id = ${row.id}`
    await sql`DELETE FROM curriculum WHERE id = ${row.id}`
  }

  const [week] = await sql`
    INSERT INTO curriculum (title, grade_band, week_number, theme, is_active)
    VALUES (${weekTitle}, ${gradeBand}, 5, ${theme}, true)
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
      VALUES (${day.id}, ${item.id}, 1)
    `
    console.log(`  ✓ ${d.subject}: ${d.theme}`)
  }

  return week.id
}

// ── G1-2 Week 5 ──────────────────────────────────────────────────────────────
const g12WeekId = await seedWeek(
  'g1-2',
  'Week 5 — Kart Racer',
  'Kart Racer',
  [
    { day: 1, subject: 'build',           theme: 'Week 5 Build',            type: 'illustrated-steps', stepCount: 6 },
    { day: 2, subject: 'coding',          theme: 'Kart Racer!',             type: 'sandbox',           stepCount: 7 },
    { day: 3, subject: 'public_speaking', theme: 'Week 5 Public Speaking',  type: 'illustrated-steps', stepCount: 4 },
    { day: 4, subject: 'science',         theme: 'Week 5 Science',          type: 'illustrated-steps', stepCount: 4 },
    { day: 5, subject: 'free_build',      theme: 'Free Build Friday',       type: 'illustrated-steps', stepCount: 3 },
    { day: 4, subject: 'math',            theme: 'Week 5 Math',             type: 'activity',          stepCount: 5 },
  ],
)

// ── G3-4 Week 5 ──────────────────────────────────────────────────────────────
const g34WeekId = await seedWeek(
  'g3-4',
  'Week 5 — Kart Racer',
  'Kart Racer',
  [
    { day: 1, subject: 'build',           theme: 'Week 5 Build',            type: 'illustrated-steps', stepCount: 8 },
    { day: 2, subject: 'coding',          theme: 'Kart Racer!',             type: 'sandbox',           stepCount: 10 },
    { day: 3, subject: 'public_speaking', theme: 'Week 5 Public Speaking',  type: 'illustrated-steps', stepCount: 4 },
    { day: 4, subject: 'science',         theme: 'Week 5 Science',          type: 'illustrated-steps', stepCount: 4 },
    { day: 5, subject: 'free_build',      theme: "Engineer's Choice Friday", type: 'illustrated-steps', stepCount: 3 },
    { day: 4, subject: 'math',            theme: 'Week 5 Math',             type: 'activity',          stepCount: 5 },
  ],
)

// ── Assign to all classrooms that have week 4 ────────────────────────────────
const w4Classrooms = await sql`
  SELECT DISTINCT cc.classroom_id, c.grade_band
  FROM classroom_curriculum cc
  JOIN curriculum c ON c.id = cc.curriculum_id
  WHERE c.week_number = 4
`

const weekStartDate = '2026-09-28' // Monday of Week 5

for (const row of w4Classrooms) {
  const weekId = row.grade_band === 'g1-2' ? g12WeekId : g34WeekId
  await sql`
    INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
    VALUES (${row.classroom_id}, ${weekId}, ${weekStartDate})
    ON CONFLICT DO NOTHING
  `
  console.log(`  ✓ Assigned week 5 to classroom ${row.classroom_id} (${row.grade_band})`)
}

console.log('\n✅ Week 5 curriculum seeded. Now run: node scripts/seed-coding-w5-kart.mjs')
await sql.end()

/**
 * seed-classroom-weeks.mjs
 *
 * Pre-seeds classroom_curriculum rows for ALL weeks for ALL classrooms,
 * so the dashboard automatically shows the right week without any manual
 * intervention each week.
 *
 * The first class day is Sep 1 2026 (week 1 = week starting Aug 31 2026).
 * Each subsequent week starts 7 days later.
 *
 * Run once, or re-run safely — it upserts so duplicates are ignored.
 *
 * Usage:
 *   node scripts/seed-classroom-weeks.mjs
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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

// ── Config ────────────────────────────────────────────────────────────────────
// Monday of Week 1
const WEEK1_MONDAY = new Date('2026-09-14') // adjust if your actual W1 start differs

function weekMonday(weekNumber) {
  const d = new Date(WEEK1_MONDAY)
  d.setDate(d.getDate() + (weekNumber - 1) * 7)
  return d.toISOString().slice(0, 10)
}

// ── Fetch all classrooms ──────────────────────────────────────────────────────
const classrooms = await sql`SELECT id, name, grade_band FROM classrooms ORDER BY name`
console.log(`Found ${classrooms.length} classroom(s)`)

// ── Fetch all curriculum rows ─────────────────────────────────────────────────
const curricula = await sql`SELECT id, week_number, grade_band FROM curriculum ORDER BY grade_band, week_number`
console.log(`Found ${curricula.length} curriculum row(s)`)

// Build lookup: grade_band → week_number → curriculum_id
const curriculumMap = new Map()
for (const c of curricula) {
  const key = `${c.grade_band}:${c.week_number}`
  curriculumMap.set(key, c.id)
}

// ── Seed ─────────────────────────────────────────────────────────────────────
let inserted = 0, skipped = 0

for (const classroom of classrooms) {
  // Find all weeks available for this classroom's grade band
  const weeksForGrade = curricula
    .filter(c => c.grade_band === classroom.grade_band)
    .map(c => c.week_number)
    .sort((a, b) => a - b)

  for (const weekNum of weeksForGrade) {
    const curriculumId = curriculumMap.get(`${classroom.grade_band}:${weekNum}`)
    if (!curriculumId) continue

    const weekStartDate = weekMonday(weekNum)

    // Upsert: insert if not exists, update curriculum_id if the date already exists
    const result = await sql`
      INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
      VALUES (${classroom.id}, ${curriculumId}, ${weekStartDate})
      ON CONFLICT (classroom_id, week_start_date)
      DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id
      RETURNING classroom_id
    `
    if (result.length) inserted++
    else skipped++
  }

  console.log(`  ✓ "${classroom.name}" (${classroom.grade_band}): seeded ${weeksForGrade.length} weeks`)
}

await sql.end()
console.log(`\n✅ Done — ${inserted} rows upserted, ${skipped} skipped`)
console.log('\nFrom now on the dashboard auto-advances each week. No manual switching needed!')

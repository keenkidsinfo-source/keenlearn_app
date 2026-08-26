/**
 * fix-week-dates.mjs
 *
 * Re-assigns classroom_curriculum so each week number maps to the correct
 * Monday of the school year.
 *
 * ── UPDATE THIS EACH YEAR ──────────────────────────────────────────────────
 * SCHOOL_START: the Monday of Week 1 for the current school year.
 * Add entries to WEEK_OVERRIDES for any weeks with non-standard dates
 * (e.g. short weeks, breaks).
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Run once from Terminal:
 *   node scripts/fix-week-dates.mjs
 *
 * Safe to re-run — deletes and re-inserts all classroom_curriculum rows.
 */

const SCHOOL_START = '2026-08-31'   // Monday of Week 1
const TOTAL_WEEKS  = 2              // how many weeks of curriculum are seeded

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

function addWeeks(dateStr, weeks) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + weeks * 7)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Build the week_number → Monday map
const WEEK_DATES = {}
for (let w = 1; w <= TOTAL_WEEKS; w++) {
  WEEK_DATES[w] = addWeeks(SCHOOL_START, w - 1)
}

async function run() {
  console.log('School year week schedule:')
  for (const [w, d] of Object.entries(WEEK_DATES)) {
    console.log(`  Week ${w} → ${d}`)
  }

  // Show current state before
  const before = await sql`
    SELECT cl.name as classroom, c.week_number, ccl.week_start_date
    FROM classroom_curriculum ccl
    JOIN curriculum c ON c.id = ccl.curriculum_id
    JOIN classrooms cl ON cl.id = ccl.classroom_id
    ORDER BY cl.name, c.week_number
  `
  console.log('\nBefore:')
  for (const r of before) {
    console.log(`  ${r.classroom} W${r.week_number} → ${r.week_start_date}`)
  }

  // Rebuild cleanly: match each classroom's grade_band to the right curriculum.
  // This fixes data corruption (e.g. Class 1A having two W1 rows from multiple seed runs).

  // 1. Get all classrooms
  const classrooms = await sql`SELECT id, name, grade_band FROM classrooms`

  // 2. Get the NEWEST curriculum per (grade_band, week_number) — avoids stale orphan rows
  const weekNumbers = Object.keys(WEEK_DATES).map(Number)
  const curricula = await sql`
    SELECT DISTINCT ON (grade_band, week_number) id, grade_band, week_number
    FROM curriculum
    WHERE week_number = ANY(${weekNumbers})
    ORDER BY grade_band, week_number, created_at DESC
  `

  // Build lookup: grade_band -> { 1: id, 2: id }
  const currMap = {}
  for (const c of curricula) {
    if (!currMap[c.grade_band]) currMap[c.grade_band] = {}
    currMap[c.grade_band][c.week_number] = c.id
  }

  // 3. Wipe all existing assignments
  await sql`DELETE FROM classroom_curriculum`

  // 4. Re-insert one clean row per classroom per week
  let inserted = 0
  for (const cl of classrooms) {
    const weeks = currMap[cl.grade_band]
    if (!weeks) { console.warn(`  ⚠ No curriculum found for grade_band "${cl.grade_band}" (${cl.name}) — skipping`); continue }

    for (const [weekNum, monday] of Object.entries(WEEK_DATES)) {
      const currId = weeks[weekNum]
      if (!currId) { console.warn(`  ⚠ No W${weekNum} curriculum for ${cl.grade_band} — skipping`); continue }
      await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
                VALUES (${cl.id}, ${currId}, ${monday})
                ON CONFLICT (classroom_id, week_start_date) DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id`
      console.log(`  ${cl.name} (${cl.grade_band}) W${weekNum} → ${monday}`)
      inserted++
    }
  }
  console.log(`\nInserted ${inserted} assignment(s) total`)

  // Show after
  const after = await sql`
    SELECT cl.name as classroom, c.week_number, ccl.week_start_date
    FROM classroom_curriculum ccl
    JOIN curriculum c ON c.id = ccl.curriculum_id
    JOIN classrooms cl ON cl.id = ccl.classroom_id
    ORDER BY cl.name, c.week_number
  `
  console.log('\nAfter:')
  for (const r of after) {
    console.log(`  ${r.classroom} W${r.week_number} → ${r.week_start_date}`)
  }

  console.log(`\n✅ Done! Week 1 starts ${WEEK_DATES[1]}, Week 2 starts ${WEEK_DATES[2] ?? 'N/A'}.`)

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

/**
 * fix-classroom-weeks.mjs
 *
 * Repairs classroom_curriculum by finding the curriculum row for each
 * week_number that has the MOST associated content (curriculum_days entries).
 * This correctly identifies the "real" curriculum vs duplicates from re-seeding.
 *
 * Week 1 = 2026-08-31, each week +7 days.
 *
 * Usage: node scripts/fix-classroom-weeks.mjs
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

const WEEK1_MONDAY = '2026-08-31'

function weekStartDate(weekNumber) {
  const d = new Date(WEEK1_MONDAY)
  d.setUTCDate(d.getUTCDate() + (weekNumber - 1) * 7)
  return d.toISOString().slice(0, 10)
}

// For each grade_band + week_number, find the curriculum_id with the MOST curriculum_days
// This identifies the "real" seeded curriculum vs empty duplicates
const bestCurricula = await sql`
  SELECT c.grade_band, c.week_number, c.id as curriculum_id,
         COUNT(cd.id) as day_count
  FROM curriculum c
  LEFT JOIN curriculum_days cd ON cd.curriculum_id = c.id
  GROUP BY c.grade_band, c.week_number, c.id
  ORDER BY c.grade_band, c.week_number, day_count DESC
`

// Build map: "grade_band:week_number" → best curriculum_id
const bestMap = new Map()
for (const row of bestCurricula) {
  const key = `${row.grade_band}:${row.week_number}`
  if (!bestMap.has(key)) {
    // First row = highest day_count = best curriculum
    bestMap.set(key, { curriculumId: row.curriculum_id, dayCount: parseInt(row.day_count) })
  }
}

// Find distinct week numbers that have real content (at least 1 curriculum_day)
const realWeeks = [...bestMap.entries()]
  .filter(([, v]) => v.dayCount > 0)

console.log(`Found ${realWeeks.length} grade_band:week combos with real content`)

// Get all classrooms
const classrooms = await sql`SELECT id, name, grade_band FROM classrooms ORDER BY name`

// Delete all existing classroom_curriculum rows and re-insert correctly
for (const classroom of classrooms) {
  const weeksForGrade = realWeeks
    .filter(([key]) => key.startsWith(classroom.grade_band + ':'))
    .map(([key, v]) => ({ weekNumber: parseInt(key.split(':')[1]), curriculumId: v.curriculumId }))
    .sort((a, b) => a.weekNumber - b.weekNumber)

  // Delete all existing rows for this classroom
  await sql`DELETE FROM classroom_curriculum WHERE classroom_id = ${classroom.id}`

  // Re-insert with correct dates and curriculum IDs
  for (const { weekNumber, curriculumId } of weeksForGrade) {
    const startDate = weekStartDate(weekNumber)
    await sql`
      INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
      VALUES (${classroom.id}, ${curriculumId}, ${startDate})
    `
  }

  console.log(`  ✓ "${classroom.name}" (${classroom.grade_band}): restored ${weeksForGrade.length} weeks`)
}

await sql.end()
console.log('\n✅ Done — classroom_curriculum restored with correct curriculum IDs')

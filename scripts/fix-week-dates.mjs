/**
 * fix-week-dates.mjs
 *
 * Re-assigns classroom_curriculum so that:
 *   Week 1 → previous Monday (last week)
 *   Week 2 → current Monday (this week)
 *
 * Run once from Terminal:
 *   node scripts/fix-week-dates.mjs
 *
 * Safe to re-run — uses UPDATE not INSERT.
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

function getMondayStr(offsetWeeks = 0) {
  const today = new Date()
  const dow = today.getDay()
  const diff = (dow === 0 ? -6 : 1 - dow) + offsetWeeks * 7
  const d = new Date(today)
  d.setDate(today.getDate() + diff)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

async function run() {
  const prevMonday = getMondayStr(-1)  // last week
  const currMonday = getMondayStr(0)   // this week

  console.log(`Setting Week 1 → ${prevMonday} (last week)`)
  console.log(`Setting Week 2 → ${currMonday} (this week)`)

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
  const curricula = await sql`
    SELECT DISTINCT ON (grade_band, week_number) id, grade_band, week_number
    FROM curriculum
    WHERE week_number IN (1, 2)
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

    if (weeks[1]) {
      await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
                VALUES (${cl.id}, ${weeks[1]}, ${prevMonday})
                ON CONFLICT (classroom_id, week_start_date) DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id`
      console.log(`  ${cl.name} (${cl.grade_band}) W1 → ${prevMonday}`)
      inserted++
    }
    if (weeks[2]) {
      await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
                VALUES (${cl.id}, ${weeks[2]}, ${currMonday})
                ON CONFLICT (classroom_id, week_start_date) DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id`
      console.log(`  ${cl.name} (${cl.grade_band}) W2 → ${currMonday}`)
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

  console.log('\n✅ Done! Students on the current week will now see Week 2 (Balance Scale coding, Lever Balance Scale build).')
  console.log('   Navigating to "← Prev week" will show Week 1 (Zipline Zoo, Cable Car).')

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

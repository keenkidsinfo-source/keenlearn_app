/**
 * reset-schedule-aug17.mjs
 *
 * Wipes ALL classroom_curriculum assignments and re-sets them so that:
 *   Week 1  → Aug 17, 2026
 *   Week 2  → Aug 24, 2026
 *   Week 3  → Aug 31, 2026
 *   ... and so on for every curriculum week in the DB
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/reset-schedule-aug17.mjs
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

// Aug 17, 2026 is a Monday — confirmed start of school year
const START_DATE = '2026-08-17'

function addWeeks(dateStr, weeks) {
  const d = new Date(dateStr + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + weeks * 7)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

async function run() {
  // 1. Show what's currently assigned
  const current = await sql`
    SELECT cl.name as classroom, cl.grade_band, c.week_number, c.title, ccl.week_start_date
    FROM classroom_curriculum ccl
    JOIN curriculum c ON c.id = ccl.curriculum_id
    JOIN classrooms cl ON cl.id = ccl.classroom_id
    ORDER BY cl.name, c.week_number
  `
  console.log('\n── Current assignments ──')
  if (current.length === 0) {
    console.log('  (none)')
  } else {
    for (const r of current) {
      console.log(`  ${r.classroom} (${r.grade_band}) W${r.week_number} → ${r.week_start_date} | "${r.title}"`)
    }
  }

  // 2. Get all classrooms
  const classrooms = await sql`SELECT id, name, grade_band FROM classrooms ORDER BY name`
  console.log(`\n── Classrooms found: ${classrooms.length} ──`)
  for (const cl of classrooms) console.log(`  ${cl.name} (${cl.grade_band})`)

  // 3. Get all curriculum weeks per grade_band — pick newest per (grade_band, week_number)
  const curricula = await sql`
    SELECT DISTINCT ON (grade_band, week_number)
      id, grade_band, week_number, title
    FROM curriculum
    ORDER BY grade_band, week_number, created_at DESC
  `
  console.log(`\n── Curriculum weeks found: ${curricula.length} ──`)
  for (const c of curricula) {
    console.log(`  ${c.grade_band} W${c.week_number}: "${c.title}"`)
  }

  // 4. Build lookup: grade_band → { weekNumber → curriculumId }
  const currMap = {}
  for (const c of curricula) {
    if (!currMap[c.grade_band]) currMap[c.grade_band] = {}
    currMap[c.grade_band][c.week_number] = c.id
  }

  // 5. Wipe all existing assignments
  const deleted = await sql`DELETE FROM classroom_curriculum`
  console.log(`\n🗑️  Cleared all previous assignments`)

  // 6. Re-insert — Week N starts on (Aug 17 + (N-1) weeks)
  let inserted = 0
  for (const cl of classrooms) {
    const weeks = currMap[cl.grade_band]
    if (!weeks) {
      console.warn(`  ⚠ No curriculum found for grade_band "${cl.grade_band}" (${cl.name}) — skipping`)
      continue
    }

    const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b)
    for (const wn of weekNumbers) {
      const weekStart = addWeeks(START_DATE, wn - 1)
      await sql`
        INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
        VALUES (${cl.id}, ${weeks[wn]}, ${weekStart})
        ON CONFLICT (classroom_id, week_start_date) DO UPDATE SET curriculum_id = EXCLUDED.curriculum_id
      `
      console.log(`  ✓ ${cl.name} (${cl.grade_band}) W${wn} → ${weekStart}`)
      inserted++
    }
  }

  // 7. Show new assignments
  const after = await sql`
    SELECT cl.name as classroom, cl.grade_band, c.week_number, c.title, ccl.week_start_date
    FROM classroom_curriculum ccl
    JOIN curriculum c ON c.id = ccl.curriculum_id
    JOIN classrooms cl ON cl.id = ccl.classroom_id
    ORDER BY cl.name, c.week_number
  `
  console.log(`\n── New assignments (${after.length} total) ──`)
  for (const r of after) {
    console.log(`  ${r.classroom} (${r.grade_band}) W${r.week_number} → ${r.week_start_date} | "${r.title}"`)
  }

  console.log(`\n✅ Done! ${inserted} assignment(s) set. Week 1 starts Aug 17, 2026.`)
  console.log(`   Today (Jul 30) is before the school year — teacher will see "No curriculum this week"`)
  console.log(`   until Aug 17. You can test by setting your computer's date to Aug 17.`)

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

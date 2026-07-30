/**
 * diagnose-build.mjs — quick DB check for build day setup
 * Run: node scripts/diagnose-build.mjs
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

console.log('\n── Classrooms ──')
const classrooms = await sql`SELECT id, name, grade_band, teacher_id FROM classrooms ORDER BY name`
for (const c of classrooms) console.log(`  ${c.name} (${c.grade_band}) teacherId=${c.teacher_id}`)

console.log('\n── classroom_curriculum for Aug 17 ──')
const cc = await sql`
  SELECT cl.name, cl.grade_band, c.title, c.week_number, ccl.week_start_date
  FROM classroom_curriculum ccl
  JOIN classrooms cl ON cl.id = ccl.classroom_id
  JOIN curriculum c ON c.id = ccl.curriculum_id
  WHERE ccl.week_start_date = '2026-08-17'
  ORDER BY cl.name
`
if (cc.length === 0) console.log('  ⚠ NO ROWS for 2026-08-17')
for (const r of cc) console.log(`  ${r.name} (${r.grade_band}) → "${r.title}" W${r.week_number}`)

console.log('\n── curriculum_days with subject=build ──')
const days = await sql`
  SELECT c.grade_band, c.week_number, c.title as curr_title, cd.subject, cd.theme, cd.id as day_id
  FROM curriculum_days cd
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE cd.subject = 'build'
  ORDER BY c.grade_band, c.week_number
`
if (days.length === 0) console.log('  ⚠ NO build days in curriculum_days!')
for (const d of days) console.log(`  ${d.grade_band} W${d.week_number} (${d.curr_title}) — "${d.theme}" dayId=${d.day_id}`)

console.log('\n── content_items linked to build days ──')
const items = await sql`
  SELECT c.grade_band, c.week_number, cd.subject, ci.title, ci.step_count, ci.id as item_id
  FROM curriculum_content cc2
  JOIN curriculum_days cd ON cd.id = cc2.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  JOIN content_items ci ON ci.id = cc2.content_item_id
  WHERE cd.subject = 'build'
  ORDER BY c.grade_band, c.week_number
`
if (items.length === 0) console.log('  ⚠ NO content_items linked to any build day!')
for (const i of items) console.log(`  ${i.grade_band} W${i.week_number} → "${i.title}" (${i.step_count ?? 0} steps) itemId=${i.item_id}`)

await sql.end()

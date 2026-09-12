/**
 * switch-classroom-week.mjs
 * Reassigns a classroom to a different week's curriculum.
 *
 * Usage:
 *   node scripts/switch-classroom-week.mjs "sinnot" 1
 *   (matches classroom name case-insensitively, switches to week 1)
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

const classroomName = process.argv[2]
const targetWeek    = parseInt(process.argv[3], 10)

if (!classroomName || isNaN(targetWeek)) {
  console.error('Usage: node scripts/switch-classroom-week.mjs "<classroom name>" <week number>')
  process.exit(1)
}

const classrooms = await sql`
  SELECT id, name, grade_band FROM classrooms
  WHERE LOWER(name) LIKE ${'%' + classroomName.toLowerCase() + '%'}
`
if (!classrooms.length) {
  console.error(`No classroom found matching "${classroomName}"`)
  process.exit(1)
}
console.log(`Found ${classrooms.length} classroom(s):`)
for (const c of classrooms) {
  console.log(`  ${c.id} | "${c.name}" | ${c.grade_band}`)
  const curricula = await sql`
    SELECT id, week_number, grade_band FROM curriculum
    WHERE grade_band = ${c.grade_band} AND week_number = ${targetWeek}
    LIMIT 1
  `
  if (!curricula.length) {
    console.error(`  ⚠ No W${targetWeek} curriculum found for grade_band=${c.grade_band}`)
    continue
  }
  const newCurriculum = curricula[0]
  const existing = await sql`
    SELECT curriculum_id FROM classroom_curriculum WHERE classroom_id = ${c.id}
  `
  if (existing.length) {
    await sql`
      UPDATE classroom_curriculum
      SET curriculum_id = ${newCurriculum.id}
      WHERE classroom_id = ${c.id}
    `
  } else {
    await sql`
      INSERT INTO classroom_curriculum (classroom_id, curriculum_id)
      VALUES (${c.id}, ${newCurriculum.id})
    `
  }
  console.log(`  ✓ Switched "${c.name}" → W${targetWeek} curriculum (${newCurriculum.id})`)
}

await sql.end()
console.log('\n✅ Done.')

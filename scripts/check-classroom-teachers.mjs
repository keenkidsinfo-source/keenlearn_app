/**
 * check-classroom-teachers.mjs
 * Shows which teachers are assigned to which classrooms,
 * to diagnose why a co-teacher can't see chart data.
 *
 * Run: cd ~/Documents/keenlearn_app && node scripts/check-classroom-teachers.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
for (const line of lines) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('='); if (i === -1) continue
  const k = t.slice(0, i).trim()
  const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  if (!process.env[k]) process.env[k] = v
}

const sql = postgres(process.env.DATABASE_URL)

// List all classrooms and which teachers are in them
const rows = await sql`
  SELECT
    c.id        AS classroom_id,
    c.name      AS classroom_name,
    c.grade_band,
    s.name      AS school_name,
    u.id        AS teacher_id,
    u.name      AS teacher_name,
    u.email     AS teacher_email
  FROM classrooms c
  LEFT JOIN schools s ON s.id = c.school_id
  LEFT JOIN classroom_teachers ct ON ct.classroom_id = c.id
  LEFT JOIN users u ON u.id = ct.teacher_id
  ORDER BY c.grade_band, c.name, u.name
`

// Group by classroom
const classroomMap = new Map()
for (const row of rows) {
  const key = row.classroom_id
  if (!classroomMap.has(key)) {
    classroomMap.set(key, {
      name: row.classroom_name,
      gradeBand: row.grade_band,
      school: row.school_name,
      teachers: [],
    })
  }
  if (row.teacher_id) {
    classroomMap.get(key).teachers.push(`${row.teacher_name} (${row.teacher_email})`)
  }
}

console.log('\n=== CLASSROOM → TEACHER ASSIGNMENTS ===\n')
for (const [id, info] of classroomMap) {
  console.log(`📚 ${info.name} [${info.gradeBand}] — ${info.school ?? 'no school'}`)
  console.log(`   ID: ${id}`)
  if (info.teachers.length === 0) {
    console.log('   ⚠️  NO TEACHERS ASSIGNED')
  } else {
    for (const t of info.teachers) {
      console.log(`   👩‍🏫 ${t}`)
    }
  }
  console.log()
}

// Also show any teachers not in any classroom
const unassigned = await sql`
  SELECT u.id, u.name, u.email
  FROM users u
  WHERE u.role = 'teacher'
    AND u.id NOT IN (SELECT teacher_id FROM classroom_teachers)
  ORDER BY u.name
`

if (unassigned.length > 0) {
  console.log('=== TEACHERS WITH NO CLASSROOM ASSIGNMENT ===\n')
  for (const t of unassigned) {
    console.log(`  ⚠️  ${t.name} (${t.email}) — id: ${t.id}`)
  }
  console.log()
}

await sql.end()

/**
 * debug-chart-visibility.mjs
 * Diagnoses why two co-teachers see different build chart data.
 * Shows exactly which classroom each teacher resolves to on the chart page.
 *
 * Run: cd ~/Documents/keenlearn_app && node scripts/debug-chart-visibility.mjs
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

// 1. All classrooms and their grade_band
console.log('\n=== ALL CLASSROOMS ===')
const classroomRows = await sql`
  SELECT c.id, c.name, c.grade_band, s.name as school
  FROM classrooms c
  LEFT JOIN schools s ON s.id = c.school_id
  ORDER BY c.grade_band, c.name
`
for (const c of classroomRows) {
  console.log(`  [${c.grade_band ?? 'NULL'}] ${c.name} (${c.school ?? 'no school'}) — id: ${c.id}`)
}

// 2. For each teacher, which classroom does the chart page resolve to for g3-4?
console.log('\n=== CHART PAGE CLASSROOM RESOLUTION PER TEACHER (g3-4) ===')
const teachers = await sql`
  SELECT u.id, u.name, u.email FROM users u WHERE u.role IN ('teacher','admin') ORDER BY u.name
`

for (const teacher of teachers) {
  // Primary query: with grade_band filter
  const [primary] = await sql`
    SELECT c.id, c.name, c.grade_band
    FROM classroom_teachers ct
    JOIN classrooms c ON c.id = ct.classroom_id
    WHERE ct.teacher_id = ${teacher.id} AND c.grade_band = 'g3-4'
    LIMIT 1
  `
  // Fallback: without grade_band filter
  const [fallback] = await sql`
    SELECT c.id, c.name, c.grade_band
    FROM classroom_teachers ct
    JOIN classrooms c ON c.id = ct.classroom_id
    WHERE ct.teacher_id = ${teacher.id}
    LIMIT 1
  `

  const resolved = primary ?? fallback ?? null
  if (!resolved) continue // skip teachers with no classroom

  const flag = primary ? '✅' : '⚠️  (fallback, no grade_band set)'
  console.log(`  ${teacher.name} (${teacher.email})`)
  console.log(`    → "${resolved.name}" [${resolved.grade_band ?? 'NULL'}] ${flag}`)
  console.log(`       id: ${resolved.id}`)
}

// 3. Check studentSessions for build content in each g3-4 classroom
console.log('\n=== BUILD CHART SESSIONS SAVED IN EACH G3-4 CLASSROOM ===')
const g34classrooms = classroomRows.filter(c => c.grade_band === 'g3-4')
for (const classroom of g34classrooms) {
  const sessions = await sql`
    SELECT u.name as student, ss.updated_at, ss.session_data
    FROM student_sessions ss
    JOIN users u ON u.id = ss.student_id
    WHERE u.classroom_id = ${classroom.id}
    ORDER BY ss.updated_at DESC
    LIMIT 10
  `
  console.log(`\n  Classroom: ${classroom.name} (${classroom.id})`)
  if (sessions.length === 0) {
    console.log('    — no sessions saved')
  } else {
    for (const s of sessions) {
      console.log(`    ✅ ${s.student} — ${new Date(s.updated_at).toLocaleString()}`)
    }
  }
}

await sql.end()

/**
 * clear-student-build-result.mjs
 * Clears a specific student's build chart result (student_sessions row).
 *
 * Usage:
 *   STUDENT_NAME="Vincent" WEEK_NUMBER=2 \
 *   node scripts/clear-student-build-result.mjs
 *
 * Or with a specific week start date:
 *   STUDENT_NAME="Vincent" WEEK_START="2026-09-14" \
 *   node scripts/clear-student-build-result.mjs
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

const studentName = process.env.STUDENT_NAME ?? 'Vincent'

// Find the student
const students = await sql`
  SELECT u.id, u.name, c.name as classroom, c.grade_band
  FROM users u
  JOIN classrooms c ON c.id = u.classroom_id
  WHERE u.role = 'student' AND u.name ILIKE ${'%' + studentName + '%'}
  ORDER BY u.name
`

if (students.length === 0) {
  console.error(`No student found matching "${studentName}"`)
  await sql.end(); process.exit(1)
}

console.log(`\nFound ${students.length} student(s) matching "${studentName}":`)
for (const s of students) {
  console.log(`  ${s.name} — ${s.classroom} [${s.grade_band}] (id: ${s.id})`)
}

// Find their build session results
const sessions = await sql`
  SELECT ss.id, ss.student_id, ss.content_item_id, ss.session_data, ss.started_at,
         ci.title as content_title, ci.subject
  FROM student_sessions ss
  JOIN content_items ci ON ci.id = ss.content_item_id
  WHERE ss.student_id = ANY(${students.map(s => s.id)})
    AND ci.subject = 'build'
  ORDER BY ss.started_at DESC
`

if (sessions.length === 0) {
  console.log('\nNo build results found for this student. Nothing to clear.')
  await sql.end(); process.exit(0)
}

console.log(`\nBuild results for ${studentName}:`)
for (const s of sessions) {
  const data = typeof s.session_data === 'string' ? JSON.parse(s.session_data) : s.session_data
  console.log(`  [${s.id}] ${s.content_title} — ${new Date(s.started_at).toLocaleDateString()}`)
  console.log(`         data: ${JSON.stringify(data)}`)
}

// Delete all build results for this student
const ids = sessions.map(s => s.id)
await sql`DELETE FROM student_sessions WHERE id = ANY(${ids})`

console.log(`\n✅ Cleared ${ids.length} build result(s) for ${studentName}.`)
await sql.end()

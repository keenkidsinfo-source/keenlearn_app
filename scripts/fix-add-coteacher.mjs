/**
 * fix-add-coteacher.mjs
 * Adds a teacher to a classroom's classroom_teachers table.
 * Use after running check-classroom-teachers.mjs to identify the missing assignment.
 *
 * Usage:
 *   TEACHER_EMAIL="other@example.com" CLASSROOM_ID="<uuid>" \
 *   node scripts/fix-add-coteacher.mjs
 *
 * Run: cd ~/Documents/keenlearn_app && TEACHER_EMAIL="..." CLASSROOM_ID="..." node scripts/fix-add-coteacher.mjs
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

const teacherEmail = process.env.TEACHER_EMAIL
const classroomId  = process.env.CLASSROOM_ID

if (!teacherEmail || !classroomId) {
  console.error('Usage: TEACHER_EMAIL="..." CLASSROOM_ID="..." node scripts/fix-add-coteacher.mjs')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL)

const [teacher] = await sql`SELECT id, name, email FROM users WHERE email = ${teacherEmail} LIMIT 1`
if (!teacher) { console.error(`No user found with email: ${teacherEmail}`); await sql.end(); process.exit(1) }

const [classroom] = await sql`SELECT id, name, grade_band FROM classrooms WHERE id = ${classroomId} LIMIT 1`
if (!classroom) { console.error(`No classroom found with id: ${classroomId}`); await sql.end(); process.exit(1) }

// Check if already assigned
const [existing] = await sql`
  SELECT 1 FROM classroom_teachers WHERE teacher_id = ${teacher.id} AND classroom_id = ${classroomId}
`
if (existing) {
  console.log(`✅ ${teacher.name} is already in classroom "${classroom.name}" [${classroom.grade_band}]`)
  await sql.end(); process.exit(0)
}

await sql`
  INSERT INTO classroom_teachers (teacher_id, classroom_id)
  VALUES (${teacher.id}, ${classroomId})
  ON CONFLICT DO NOTHING
`

console.log(`✅ Added ${teacher.name} (${teacher.email}) to classroom "${classroom.name}" [${classroom.grade_band}]`)
console.log('They can now see the same chart data as Fatema.')

await sql.end()

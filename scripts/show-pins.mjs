import { readFileSync } from 'fs'
import postgres from 'postgres'

const lines = readFileSync('.env.local', 'utf8').split('\n')
let url = ''
for (const l of lines) { const m = l.match(/^DATABASE_URL="?([^"]+)"?/); if (m) url = m[1] }
const sql = postgres(url, { ssl: 'require' })

// Show the classroom access code (shared for all students in the class)
const [cl] = await sql`
  SELECT cl.name, cl.access_code
  FROM classrooms cl
  JOIN schools s ON s.id = cl.school_id
  WHERE cl.grade_band = 'g1-2' AND s.name ILIKE '%mattos%'
  LIMIT 1
`
console.log(`Classroom: ${cl.name}`)
console.log(`Access code: ${cl.access_code}`)

// List students (individual PINs are hashed — can't be reversed)
const students = await sql`
  SELECT u.display_name, u.name, u.pin_hash IS NOT NULL AS has_pin
  FROM users u
  JOIN classrooms cl ON cl.id = u.classroom_id
  JOIN schools s ON s.id = cl.school_id
  WHERE u.role = 'student' AND u.deleted_at IS NULL
    AND cl.grade_band = 'g1-2'
    AND s.name ILIKE '%mattos%'
  ORDER BY u.name
`
console.log(`\nStudents (${students.length}):`)
for (const s of students) console.log(`  ${s.display_name ?? s.name} — PIN set: ${s.has_pin}`)
await sql.end()

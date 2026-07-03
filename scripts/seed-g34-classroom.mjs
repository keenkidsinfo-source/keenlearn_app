import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

// Load .env.local
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

async function run() {
  // Find Mattos school + existing teacher
  const [mattos] = await sql`SELECT id FROM schools WHERE slug = 'mattos'`
  const [teacher] = await sql`SELECT id FROM users WHERE email = 'teacher@keenkidsenrichment.com'`

  // Find G3-4 curriculum weeks
  const weeks = await sql`SELECT id, title, week_number FROM curriculum WHERE grade_band = 'g3-4' ORDER BY week_number`
  console.log('G3-4 weeks found:', weeks.map(w => w.title))

  // Create G3-4 classroom
  const [classroom] = await sql`
    INSERT INTO classrooms (school_id, teacher_id, name, grade_level, grade_band, access_code)
    VALUES (${mattos.id}, ${teacher.id}, 'Class 3A', '3', 'g3-4', 'KEEN02')
    ON CONFLICT (access_code) DO UPDATE SET school_id = EXCLUDED.school_id
    RETURNING id, access_code
  `
  console.log('✓ G3-4 Classroom:', classroom.access_code)

  // Add sample students (name = what they type to log in)
  await sql`DELETE FROM users WHERE classroom_id = ${classroom.id} AND role = 'student'`
  const students = [
    { name: 'Evans',   display: 'Emma Evans',   avatar: 1 },
    { name: 'Garcia',  display: 'Leo Garcia',   avatar: 2 },
    { name: 'Patel',   display: 'Priya Patel',  avatar: 3 },
    { name: 'Kim',     display: 'Jason Kim',    avatar: 4 },
  ]
  for (const s of students) {
    await sql`
      INSERT INTO users (school_id, classroom_id, name, display_name, role, avatar_id)
      VALUES (${mattos.id}, ${classroom.id}, ${s.name}, ${s.display}, 'student', ${s.avatar})
    `
    console.log(`  ✓ Student: ${s.display} (login: "${s.name}")`)
  }

  // Assign both G3-4 weeks
  const today = new Date()
  const dow = today.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const pad = n => String(n).padStart(2, '0')
  const mondayStr = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
  const nextMonday = new Date(monday)
  nextMonday.setDate(monday.getDate() + 7)
  const nextMondayStr = `${nextMonday.getFullYear()}-${pad(nextMonday.getMonth() + 1)}-${pad(nextMonday.getDate())}`

  await sql`DELETE FROM classroom_curriculum WHERE classroom_id = ${classroom.id}`
  await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date) VALUES (${classroom.id}, ${weeks[0].id}, ${mondayStr})`
  await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date) VALUES (${classroom.id}, ${weeks[1].id}, ${nextMondayStr})`

  console.log(`\n✓ Assigned Week 1 G3-4 starting ${mondayStr}`)
  console.log(`✓ Assigned Week 2 G3-4 starting ${nextMondayStr}`)
  console.log('\nDone! Login details:')
  console.log('  Class code: KEEN02')
  console.log('  Students: Evans, Garcia, Patel, Kim (type last name to log in)')

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

/**
 * seed-test-student.mjs
 * Creates test student: Krisha Praveen, G1-2, PIN: 1234
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/seed-test-student.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'

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
  // Show all classrooms so we can pick the right one
  const classrooms = await sql`
    SELECT cl.id, cl.name, cl.grade_band, s.name as school, cl.teacher_id
    FROM classrooms cl
    LEFT JOIN schools s ON s.id = cl.school_id
    ORDER BY cl.grade_band, cl.name
  `
  console.log('\n── Classrooms in DB ──')
  for (const c of classrooms) {
    console.log(`  ${c.grade_band} | "${c.name}" | ${c.school} | id: ${c.id}`)
  }

  // Find G1-2 classroom (take the first one found)
  const g12 = classrooms.find(c => c.grade_band === 'g1-2')
  if (!g12) {
    console.error('\n❌ No G1-2 classroom found! Check your classroom setup.')
    await sql.end()
    process.exit(1)
  }

  console.log(`\nUsing classroom: "${g12.name}" (${g12.id})`)

  // Check if Krisha already exists
  const [existing] = await sql`
    SELECT id, name FROM users WHERE name = 'Krisha Praveen' AND classroom_id = ${g12.id}
  `
  if (existing) {
    console.log(`\n⚠  Krisha Praveen already exists (id: ${existing.id}) — skipping create.`)
    await sql.end()
    return
  }

  // Get school ID from classroom
  const [classroom] = await sql`SELECT school_id FROM classrooms WHERE id = ${g12.id}`

  const pin = '1234'
  const pinHash = await bcrypt.hash(pin, 10)

  const [student] = await sql`
    INSERT INTO users (school_id, classroom_id, name, display_name, role, avatar_id, pin_hash)
    VALUES (
      ${classroom.school_id},
      ${g12.id},
      'Krisha Praveen',
      'Krisha',
      'student',
      3,
      ${pinHash}
    )
    RETURNING id, name, display_name, role, avatar_id
  `

  console.log('\n✅ Created student:')
  console.log(`   Name: ${student.name}`)
  console.log(`   Display name: ${student.display_name}`)
  console.log(`   Role: ${student.role}`)
  console.log(`   PIN: ${pin}`)
  console.log(`   ID: ${student.id}`)
  console.log(`\n   → Login at /login as student, enter name "Krisha" and PIN 1234`)

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

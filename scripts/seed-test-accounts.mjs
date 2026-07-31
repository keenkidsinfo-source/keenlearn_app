/**
 * seed-test-accounts.mjs
 * Creates dedicated CI/test accounts used by Playwright smoke tests.
 *
 * Creates:
 *   - School:     "KeenKids CI"
 *   - Classroom:  "CI-G1" (g1-2), access_code = CITEST
 *   - Teacher:    ci-teacher@keenkids.test  (password from CI_TEACHER_PASSWORD env)
 *   - Student:    "CI Student" (last name "Student"), PIN 9999
 *   - Curriculum: assigns W1 (Pulleys / Cable Car) to CI classroom for Aug 17
 *
 * Safe to re-run — uses ON CONFLICT DO NOTHING / UPDATE.
 *
 * Run from Mac Terminal:
 *   CI_TEACHER_PASSWORD=YourSecret123 node scripts/seed-test-accounts.mjs
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

const CI_TEACHER_EMAIL    = 'ci-teacher@keenkids.test'
const CI_TEACHER_PASSWORD = process.env.CI_TEACHER_PASSWORD
const CI_ACCESS_CODE      = 'CITEST'
const CI_STUDENT_PIN      = '9999'
const W1_DATE             = '2026-08-17'

if (!CI_TEACHER_PASSWORD) {
  console.error('❌ CI_TEACHER_PASSWORD env var is required')
  console.error('   Run: CI_TEACHER_PASSWORD=YourSecret node scripts/seed-test-accounts.mjs')
  process.exit(1)
}

async function run() {
  console.log('\n── Creating CI test accounts ──\n')

  // ── 1. School ──────────────────────────────────────────────────────────────
  const [school] = await sql`
    INSERT INTO schools (name) VALUES ('KeenKids CI')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, name
  `
  console.log(`✓ School: "${school.name}" (${school.id})`)

  // ── 2. Classroom ───────────────────────────────────────────────────────────
  const [classroom] = await sql`
    INSERT INTO classrooms (school_id, name, grade_band, grade_level, access_code)
    VALUES (${school.id}, 'CI-G1', 'g1-2', 1, ${CI_ACCESS_CODE})
    ON CONFLICT (access_code) DO UPDATE
      SET school_id = EXCLUDED.school_id, grade_band = EXCLUDED.grade_band
    RETURNING id, name, access_code, grade_band
  `
  console.log(`✓ Classroom: "${classroom.name}" code=${classroom.access_code} (${classroom.id})`)

  // ── 3. Teacher ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(CI_TEACHER_PASSWORD, 10)
  const [teacher] = await sql`
    INSERT INTO users (school_id, name, email, password_hash, role, approved)
    VALUES (${school.id}, 'CI Teacher', ${CI_TEACHER_EMAIL}, ${passwordHash}, 'teacher', true)
    ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash, approved = true
    RETURNING id, email, role
  `
  console.log(`✓ Teacher: ${teacher.email} (${teacher.id})`)

  // Link teacher to classroom
  await sql`
    UPDATE classrooms SET teacher_id = ${teacher.id} WHERE id = ${classroom.id}
  `
  console.log(`✓ Teacher linked to classroom`)

  // ── 4. Student ─────────────────────────────────────────────────────────────
  const pinHash = await bcrypt.hash(CI_STUDENT_PIN, 10)
  const [student] = await sql`
    INSERT INTO users (school_id, classroom_id, name, display_name, role, avatar_id, pin_hash)
    VALUES (${school.id}, ${classroom.id}, 'CI Student', 'CI', 'student', 1, ${pinHash})
    ON CONFLICT (classroom_id, name) DO UPDATE
      SET pin_hash = EXCLUDED.pin_hash, display_name = EXCLUDED.display_name
    RETURNING id, name, display_name
  `
  console.log(`✓ Student: ${student.name} PIN=${CI_STUDENT_PIN} (${student.id})`)

  // ── 5. Curriculum assignment ───────────────────────────────────────────────
  const [g12Curriculum] = await sql`
    SELECT id, title FROM curriculum
    WHERE grade_band = 'g1-2' AND week_number = 1
    LIMIT 1
  `
  if (!g12Curriculum) {
    console.error('❌ G1-2 W1 curriculum not found — run seed.ts first')
    await sql.end()
    process.exit(1)
  }

  await sql`
    INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date)
    VALUES (${classroom.id}, ${g12Curriculum.id}, ${W1_DATE})
    ON CONFLICT (classroom_id, week_start_date) DO UPDATE
      SET curriculum_id = ${g12Curriculum.id}
  `
  console.log(`✓ Assigned "${g12Curriculum.title}" to CI classroom for ${W1_DATE}`)

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n✅  CI test accounts ready!')
  console.log('\n   Add these to .env.playwright and GitHub Secrets:')
  console.log(`   BASE_URL=https://your-app.vercel.app`)
  console.log(`   CI_TEACHER_EMAIL=${CI_TEACHER_EMAIL}`)
  console.log(`   CI_TEACHER_PASSWORD=<the password you used>`)
  console.log(`   CI_CLASSROOM_CODE=${CI_ACCESS_CODE}`)
  console.log(`   CI_STUDENT_LASTNAME=Student`)
  console.log(`   CI_STUDENT_PIN=${CI_STUDENT_PIN}`)

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

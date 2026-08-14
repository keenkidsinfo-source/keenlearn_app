#!/usr/bin/env node
/**
 * fix-sinnott-classrooms.mjs
 * Creates or updates Sinnott classrooms:
 *   KEEN03 → Sinnott G1-2 (Class 1A)
 *   KEEN04 → Sinnott G3-4 (Class 3A)
 *
 * Does NOT touch KEEN01 or KEEN02 (Mattos).
 *
 * Run: node scripts/fix-sinnott-classrooms.mjs
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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  // Safety check — never touch Mattos classrooms
  const mattos = await sql`SELECT id, name, access_code FROM classrooms WHERE access_code IN ('KEEN01','KEEN02')`
  console.log('\nMattos classrooms (untouched):')
  mattos.forEach(c => console.log(`  ${c.access_code} → ${c.name}`))

  const [sinnott] = await sql`SELECT id FROM schools WHERE slug = 'sinnott'`
  if (!sinnott) { console.error('❌ Sinnott school not found'); process.exit(1) }

  // Get teacher accounts (use teacher2@ for Sinnott, fall back to teacher@)
  const [teacher2] = await sql`SELECT id FROM users WHERE email = 'teacher2@keenkidsenrichment.com'`
  const [teacher1] = await sql`SELECT id FROM users WHERE email = 'teacher@keenkidsenrichment.com'`
  const teacherId = (teacher2 ?? teacher1)?.id
  if (!teacherId) { console.error('❌ No teacher account found'); process.exit(1) }

  // ── KEEN03: Sinnott G1-2 ────────────────────────────────────────────────
  // First rename any existing Sinnott G1-2 classroom that has a different code
  await sql`
    UPDATE classrooms
    SET access_code = 'KEEN03'
    WHERE school_id = ${sinnott.id}
      AND grade_band = 'g1-2'
      AND access_code != 'KEEN03'
  `

  const [g12] = await sql`
    INSERT INTO classrooms (school_id, teacher_id, name, grade_level, grade_band, access_code)
    VALUES (${sinnott.id}, ${teacherId}, 'Class 1A', '1', 'g1-2', 'KEEN03')
    ON CONFLICT (access_code) DO UPDATE
      SET school_id = EXCLUDED.school_id,
          name      = EXCLUDED.name
    RETURNING id, access_code, name
  `
  console.log(`\n✓ Sinnott G1-2: ${g12.access_code} → ${g12.name}`)

  // ── KEEN04: Sinnott G3-4 ────────────────────────────────────────────────
  await sql`
    UPDATE classrooms
    SET access_code = 'KEEN04'
    WHERE school_id = ${sinnott.id}
      AND grade_band = 'g3-4'
      AND access_code != 'KEEN04'
  `

  const [g34] = await sql`
    INSERT INTO classrooms (school_id, teacher_id, name, grade_level, grade_band, access_code)
    VALUES (${sinnott.id}, ${teacherId}, 'Class 3A', '3', 'g3-4', 'KEEN04')
    ON CONFLICT (access_code) DO UPDATE
      SET school_id = EXCLUDED.school_id,
          name      = EXCLUDED.name
    RETURNING id, access_code, name
  `
  console.log(`✓ Sinnott G3-4: ${g34.access_code} → ${g34.name}`)

  // Assign curriculum weeks to Sinnott classrooms (if not already assigned)
  const g12Weeks = await sql`SELECT id, week_number FROM curriculum WHERE grade_band = 'g1-2' ORDER BY week_number`
  const g34Weeks = await sql`SELECT id, week_number FROM curriculum WHERE grade_band = 'g3-4' ORDER BY week_number`

  const pad = n => String(n).padStart(2, '0')
  const today = new Date()
  const dow = today.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const mondayStr = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
  const nextMonday = new Date(monday)
  nextMonday.setDate(monday.getDate() + 7)
  const nextMondayStr = `${nextMonday.getFullYear()}-${pad(nextMonday.getMonth() + 1)}-${pad(nextMonday.getDate())}`

  const existingG12 = await sql`SELECT id FROM classroom_curriculum WHERE classroom_id = ${g12.id}`
  if (existingG12.length === 0 && g12Weeks.length >= 2) {
    await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date) VALUES (${g12.id}, ${g12Weeks[0].id}, ${mondayStr})`
    await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date) VALUES (${g12.id}, ${g12Weeks[1].id}, ${nextMondayStr})`
    console.log(`  Assigned G1-2 W1+W2 starting ${mondayStr}`)
  } else {
    console.log(`  G1-2 curriculum already assigned — skipped`)
  }

  const existingG34 = await sql`SELECT id FROM classroom_curriculum WHERE classroom_id = ${g34.id}`
  if (existingG34.length === 0 && g34Weeks.length >= 2) {
    await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date) VALUES (${g34.id}, ${g34Weeks[0].id}, ${mondayStr})`
    await sql`INSERT INTO classroom_curriculum (classroom_id, curriculum_id, week_start_date) VALUES (${g34.id}, ${g34Weeks[1].id}, ${nextMondayStr})`
    console.log(`  Assigned G3-4 W1+W2 starting ${mondayStr}`)
  } else {
    console.log(`  G3-4 curriculum already assigned — skipped`)
  }

  // Print summary
  const all = await sql`
    SELECT c.access_code, c.name, c.grade_band, s.name as school
    FROM classrooms c JOIN schools s ON s.id = c.school_id
    ORDER BY s.name, c.grade_band
  `
  console.log('\n── All classrooms ──────────────────')
  all.forEach(c => console.log(`  ${c.access_code}  ${c.school} ${c.grade_band}  ${c.name}`))

  await sql.end()
  console.log('\n✅ Done — KEEN01/02 untouched, KEEN03/04 ready for Sinnott')
}

run().catch(e => { console.error(e); process.exit(1) })

#!/usr/bin/env node
/**
 * fix-teacher-school-assignments.mjs
 *
 * Fixes cross-school teacher assignments in classroom_teachers.
 *
 * Correct final state:
 *   teacher@  → Mattos classrooms ONLY  (all grade bands)
 *   teacher2@ → Sinnott classrooms ONLY (all grade bands)
 *
 * Run: node scripts/fix-teacher-school-assignments.mjs
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
  // ── Look up accounts ─────────────────────────────────────────────────────
  const [t1] = await sql`SELECT id, email FROM users WHERE email = 'teacher@keenkidsenrichment.com'`
  const [t2] = await sql`SELECT id, email FROM users WHERE email = 'teacher2@keenkidsenrichment.com'`

  if (!t1 || !t2) {
    console.error('❌ Could not find teacher accounts. Check emails.')
    process.exit(1)
  }

  const [mattos]  = await sql`SELECT id, name FROM schools WHERE slug = 'mattos'`
  const [sinnott] = await sql`SELECT id, name FROM schools WHERE slug = 'sinnott'`

  if (!mattos || !sinnott) {
    console.error('❌ Could not find schools (expected slugs: mattos, sinnott).')
    console.log('Available schools:')
    const schools = await sql`SELECT slug, name FROM schools`
    schools.forEach(s => console.log(`  ${s.slug}: ${s.name}`))
    process.exit(1)
  }

  console.log(`\nMattos school:  ${mattos.name} (${mattos.id})`)
  console.log(`Sinnott school: ${sinnott.name} (${sinnott.id})`)

  // ── Show current state ────────────────────────────────────────────────────
  console.log('\n── Current classroom_teachers ──────────────────────────────')
  const current = await sql`
    SELECT u.email, cl.name, cl.grade_band, s.name as school, ct.is_primary
    FROM classroom_teachers ct
    JOIN classrooms cl ON cl.id = ct.classroom_id
    JOIN schools s ON s.id = cl.school_id
    JOIN users u ON u.id = ct.teacher_id
    WHERE u.email IN ('teacher@keenkidsenrichment.com', 'teacher2@keenkidsenrichment.com')
    ORDER BY u.email, s.name, cl.grade_band
  `
  current.forEach(r =>
    console.log(`  ${r.email} → ${r.school} ${r.grade_band} "${r.name}"${r.is_primary ? ' [primary]' : ''}`)
  )

  // ── Fix: remove teacher@ from Sinnott classrooms ──────────────────────────
  const sinnottClassrooms = await sql`SELECT id FROM classrooms WHERE school_id = ${sinnott.id}`
  const sinnottIds = sinnottClassrooms.map(c => c.id)

  if (sinnottIds.length > 0) {
    const removed1 = await sql`
      DELETE FROM classroom_teachers
      WHERE teacher_id = ${t1.id}
        AND classroom_id = ANY(${sinnottIds})
      RETURNING classroom_id
    `
    console.log(`\n🗑  Removed teacher@ from ${removed1.length} Sinnott classroom(s)`)
  }

  // ── Fix: remove teacher2@ from Mattos classrooms ─────────────────────────
  const mattosClassrooms = await sql`SELECT id FROM classrooms WHERE school_id = ${mattos.id}`
  const mattosIds = mattosClassrooms.map(c => c.id)

  if (mattosIds.length > 0) {
    const removed2 = await sql`
      DELETE FROM classroom_teachers
      WHERE teacher_id = ${t2.id}
        AND classroom_id = ANY(${mattosIds})
      RETURNING classroom_id
    `
    console.log(`🗑  Removed teacher2@ from ${removed2.length} Mattos classroom(s)`)
  }

  // ── Ensure teacher@ is in all Mattos classrooms ──────────────────────────
  for (const c of mattosClassrooms) {
    await sql`
      INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
      VALUES (${c.id}, ${t1.id}, true)
      ON CONFLICT (classroom_id, teacher_id) DO NOTHING
    `
  }
  console.log(`✅ Ensured teacher@ is primary in all ${mattosClassrooms.length} Mattos classroom(s)`)

  // ── Ensure teacher2@ is in all Sinnott classrooms ────────────────────────
  for (const c of sinnottClassrooms) {
    await sql`
      INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
      VALUES (${c.id}, ${t2.id}, true)
      ON CONFLICT (classroom_id, teacher_id) DO NOTHING
    `
  }
  console.log(`✅ Ensured teacher2@ is primary in all ${sinnottClassrooms.length} Sinnott classroom(s)`)

  // ── Final state ───────────────────────────────────────────────────────────
  console.log('\n── Final classroom_teachers ─────────────────────────────────')
  const final = await sql`
    SELECT u.email, cl.name, cl.grade_band, s.name as school, ct.is_primary
    FROM classroom_teachers ct
    JOIN classrooms cl ON cl.id = ct.classroom_id
    JOIN schools s ON s.id = cl.school_id
    JOIN users u ON u.id = ct.teacher_id
    WHERE u.email IN ('teacher@keenkidsenrichment.com', 'teacher2@keenkidsenrichment.com')
    ORDER BY u.email, s.name, cl.grade_band
  `
  final.forEach(r =>
    console.log(`  ${r.email} → ${r.school} ${r.grade_band} "${r.name}"${r.is_primary ? ' [primary]' : ''}`)
  )

  await sql.end()
  console.log('\n✅ Done!')
}

run().catch(e => { console.error(e); process.exit(1) })

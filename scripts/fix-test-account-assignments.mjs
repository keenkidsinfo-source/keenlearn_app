#!/usr/bin/env node
/**
 * fix-test-account-assignments.mjs
 *
 * Fixes test account classroom assignments to:
 *   teacher@  → Mattos G1-2  (KEEN01) — already correct, ensure it
 *   teacher2@ → Mattos G3-4  (KEEN02) — move from Sinnott
 *   teacher3@ → Sinnott G3-4 (KEEN04) — move from Mattos G3-4
 *
 * Run: node scripts/fix-test-account-assignments.mjs
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

const [t1] = await sql`SELECT id FROM users WHERE email = 'teacher@keenkidsenrichment.com'`
const [t2] = await sql`SELECT id FROM users WHERE email = 'teacher2@keenkidsenrichment.com'`
const [t3] = await sql`SELECT id FROM users WHERE email = 'teacher3@keenkidsenrichment.com'`

const [keen01] = await sql`SELECT id FROM classrooms WHERE access_code = 'KEEN01'` // Mattos G1-2
const [keen02] = await sql`SELECT id FROM classrooms WHERE access_code = 'KEEN02'` // Mattos G3-4
const [keen03] = await sql`SELECT id FROM classrooms WHERE access_code = 'KEEN03'` // Sinnott G1-2
const [keen04] = await sql`SELECT id FROM classrooms WHERE access_code = 'KEEN04'` // Sinnott G3-4

if (!t1 || !t2 || !t3) { console.error('❌ Missing test accounts'); process.exit(1) }
if (!keen01 || !keen02 || !keen03 || !keen04) { console.error('❌ Missing classrooms'); process.exit(1) }

// ── teacher2@: remove from Sinnott (KEEN03 + KEEN04), add to Mattos G3-4 (KEEN02) ──
await sql`DELETE FROM classroom_teachers WHERE teacher_id = ${t2.id} AND classroom_id = ${keen03.id}`
console.log('🗑  Removed teacher2@ from Sinnott G1-2 (KEEN03)')

await sql`DELETE FROM classroom_teachers WHERE teacher_id = ${t2.id} AND classroom_id = ${keen04.id}`
console.log('🗑  Removed teacher2@ from Sinnott G3-4 (KEEN04)')

await sql`
  INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
  VALUES (${keen02.id}, ${t2.id}, true)
  ON CONFLICT (classroom_id, teacher_id) DO NOTHING
`
console.log('✅ Added teacher2@ to Mattos G3-4 (KEEN02)')

// ── teacher3@: remove from Mattos G3-4 (KEEN02), add to Sinnott G3-4 (KEEN04) ──
await sql`DELETE FROM classroom_teachers WHERE teacher_id = ${t3.id} AND classroom_id = ${keen02.id}`
console.log('🗑  Removed teacher3@ from Mattos G3-4 (KEEN02)')

await sql`
  INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
  VALUES (${keen04.id}, ${t3.id}, true)
  ON CONFLICT (classroom_id, teacher_id) DO NOTHING
`
console.log('✅ Added teacher3@ to Sinnott G3-4 (KEEN04)')

// ── teacher@: ensure in Mattos G1-2 (KEEN01) ──
await sql`
  INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
  VALUES (${keen01.id}, ${t1.id}, true)
  ON CONFLICT (classroom_id, teacher_id) DO NOTHING
`
console.log('✅ Ensured teacher@ in Mattos G1-2 (KEEN01)')

// ── Final state ───────────────────────────────────────────────────────────────
console.log('\n── Final state ──────────────────────────────────────────────')
const rows = await sql`
  SELECT u.email, s.name as school, cl.grade_band, cl.access_code
  FROM classroom_teachers ct
  JOIN users u ON u.id = ct.teacher_id
  JOIN classrooms cl ON cl.id = ct.classroom_id
  LEFT JOIN schools s ON s.id = cl.school_id
  ORDER BY cl.access_code, u.email
`
rows.forEach(r => console.log(`  ${r.access_code} ${r.school} ${r.grade_band}  ←  ${r.email}`))

await sql.end()
console.log('\n✅ Done!')

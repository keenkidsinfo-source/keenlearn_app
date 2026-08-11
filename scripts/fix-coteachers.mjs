#!/usr/bin/env node
/**
 * fix-coteachers.mjs — Fixes cross-grade teacher assignments from the previous script.
 *
 * Rule: co-teachers must be in the SAME grade band, never across grades.
 *
 * Correct final state:
 *   Class 1A (g1-2): teacher@ [primary]   ← g1-2 only
 *   Class 1B (g1-2): teacher@ [primary]   ← g1-2 only
 *   Class 3A (g3-4): teacher2@ [primary]  ← g3-4 only
 *
 * Cross-grade rows removed:
 *   teacher2@ OUT of Class 1A
 *   teacher@  OUT of Class 3A
 *
 * Run: node scripts/fix-coteachers.mjs
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
    if (i > 0) {
      let val = t.slice(i + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
      if (!process.env[t.slice(0, i).trim()]) process.env[t.slice(0, i).trim()] = val
    }
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

// Look up IDs
const [t1]  = await sql`SELECT id FROM users WHERE email = 'teacher@keenkidsenrichment.com'`
const [t2]  = await sql`SELECT id FROM users WHERE email = 'teacher2@keenkidsenrichment.com'`
const [c1a] = await sql`SELECT id FROM classrooms WHERE name = 'Class 1A'`
const [c1b] = await sql`SELECT id FROM classrooms WHERE name = 'Class 1B'`
const [c3a] = await sql`SELECT id FROM classrooms WHERE name = 'Class 3A'`

if (!t1 || !t2) {
  console.error('Could not find teacher accounts. Check emails.')
  process.exit(1)
}

console.log('\nRemoving cross-grade assignments...')

// Remove teacher2@ from Class 1A (g1-2) — teacher2 is g3-4
if (c1a) {
  await sql`DELETE FROM classroom_teachers WHERE classroom_id = ${c1a.id} AND teacher_id = ${t2.id}`
  console.log('  🗑  Removed teacher2@ from Class 1A (g1-2)')
}

// Remove teacher@ from Class 3A (g3-4) — teacher is g1-2
if (c3a) {
  await sql`DELETE FROM classroom_teachers WHERE classroom_id = ${c3a.id} AND teacher_id = ${t1.id}`
  console.log('  🗑  Removed teacher@ from Class 3A (g3-4)')
}

// Ensure correct primaries are set
async function ensure(classroomId, teacherId, isPrimary) {
  await sql`
    INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
    VALUES (${classroomId}, ${teacherId}, ${isPrimary})
    ON CONFLICT (classroom_id, teacher_id) DO UPDATE SET is_primary = ${isPrimary}
  `
}

if (c1a) { await ensure(c1a.id, t1.id, true);  console.log('  ✅ Class 1A → teacher@ [primary]') }
if (c1b) { await ensure(c1b.id, t1.id, true);  console.log('  ✅ Class 1B → teacher@ [primary]') }
if (c3a) { await ensure(c3a.id, t2.id, true);  console.log('  ✅ Class 3A → teacher2@ [primary]') }

// Final state
console.log('\nFinal classroom_teachers state:')
const rows = await sql`
  SELECT cl.name, cl.grade_band, u.email, ct.is_primary
  FROM classroom_teachers ct
  JOIN classrooms cl ON cl.id = ct.classroom_id
  JOIN users u ON u.id = ct.teacher_id
  ORDER BY cl.name, ct.is_primary DESC
`
for (const r of rows) {
  console.log(`  ${r.name} (${r.grade_band}) ← ${r.email}${r.is_primary ? ' [primary]' : ' [co-teacher]'}`)
}

await sql.end()
console.log('\n✅ Done!')
console.log('   teacher@  → Class 1A, Class 1B  (Grades 1–2 only)')
console.log('   teacher2@ → Class 3A             (Grades 3–4 only)')
console.log()
console.log('ℹ️  To demo co-teaching WITHIN a grade, create a third account (e.g. teacher3@)')
console.log('   and add them to Class 1A or Class 3A using ensure() above.')

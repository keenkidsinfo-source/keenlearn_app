#!/usr/bin/env node
/**
 * fix-demo-teachers.mjs — Sets up co-teaching for the demo.
 *
 * Goal:
 *   Class 1A (g1-2): teacher@ [primary] + teacher2@ [co-teacher]
 *   Class 1B (g1-2): teacher@ [primary]
 *   Class 3A (g3-4): teacher2@ [primary] + teacher@ [co-teacher]
 *
 * Run: node scripts/fix-demo-teachers.mjs
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

if (!t1 || !t2 || !c1a || !c1b || !c3a) {
  console.error('Could not find expected teachers/classrooms. Check emails/names.')
  process.exit(1)
}

async function ensure(classroomId, teacherId, isPrimary) {
  await sql`
    INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
    VALUES (${classroomId}, ${teacherId}, ${isPrimary})
    ON CONFLICT (classroom_id, teacher_id) DO UPDATE SET is_primary = ${isPrimary}
  `
}

console.log('\nSetting up classroom_teachers...')

// Class 1A: teacher [primary], teacher2 [co]
await ensure(c1a.id, t1.id, true)
await ensure(c1a.id, t2.id, false)
console.log('  ✅ Class 1A → teacher [primary] + teacher2 [co-teacher]')

// Class 1B: teacher [primary]
await ensure(c1b.id, t1.id, true)
console.log('  ✅ Class 1B → teacher [primary]')

// Class 3A: teacher2 [primary], teacher [co]
await ensure(c3a.id, t2.id, true)
await ensure(c3a.id, t1.id, false)
console.log('  ✅ Class 3A → teacher2 [primary] + teacher [co-teacher]')

// Verify
console.log('\nFinal state:')
const rows = await sql`
  SELECT cl.name, u.email, ct.is_primary
  FROM classroom_teachers ct
  JOIN classrooms cl ON cl.id = ct.classroom_id
  JOIN users u ON u.id = ct.teacher_id
  ORDER BY cl.name, ct.is_primary DESC
`
for (const r of rows) {
  console.log(`  ${r.name} ← ${r.email}${r.is_primary ? ' [primary]' : ' [co-teacher]'}`)
}

await sql.end()
console.log('\n✅ Done! Both teachers can now log in to see their classrooms.')
console.log('   Demo: both teachers in Class 1A & 3A — edits by one are visible to the other.')

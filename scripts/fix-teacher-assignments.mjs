/**
 * fix-teacher-assignments.mjs
 * Fixes teacher2 (5b258514) owning both Class 1B and Class 3A.
 * Class 1B should have no teacher (or its own teacher).
 * Teacher2 should only own Class 3A (g3-4, Mattos).
 *
 * Run: node scripts/fix-teacher-assignments.mjs
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

const sql = postgres(process.env.DATABASE_URL)

console.log('\n── Current classroom → teacher assignments ──')
const before = await sql`
  SELECT cl.name, cl.grade_band, s.name as school, u.email, u.id as teacher_id
  FROM classrooms cl
  LEFT JOIN users u ON u.id = cl.teacher_id
  LEFT JOIN schools s ON s.id = cl.school_id
  ORDER BY cl.name
`
for (const r of before) {
  console.log(`  ${r.name} (${r.grade_band}) @ ${r.school} → ${r.email ?? 'no teacher'}`)
}

// Detach teacher2 from Class 1B (set teacher_id = NULL)
// Class 1B doesn't have a real teacher assigned in this test setup
const result = await sql`
  UPDATE classrooms
  SET teacher_id = NULL
  WHERE name = 'Class 1B'
    AND teacher_id = '5b258514-ff68-439c-9795-278160d70582'
  RETURNING name, grade_band
`

if (result.length > 0) {
  console.log(`\n✓ Detached teacher2 from Class 1B`)
} else {
  console.log(`\n⚠ No change — Class 1B either already has no teacher or wrong teacher_id`)
}

console.log('\n── Updated assignments ──')
const after = await sql`
  SELECT cl.name, cl.grade_band, s.name as school, u.email
  FROM classrooms cl
  LEFT JOIN users u ON u.id = cl.teacher_id
  LEFT JOIN schools s ON s.id = cl.school_id
  ORDER BY cl.name
`
for (const r of after) {
  console.log(`  ${r.name} (${r.grade_band}) @ ${r.school} → ${r.email ?? '⚠ no teacher'}`)
}

await sql.end()
console.log('\n✅ Done. Teacher2 now only owns Class 3A (g3-4, Mattos).')

#!/usr/bin/env node
/**
 * fix-mattos-grade-split.mjs
 * teacher@  → Mattos g1-2 only
 * teacher2@ → Sinnott classrooms only (unchanged)
 *
 * Removes teacher@ from any Mattos g3-4 classrooms my previous script
 * incorrectly added them to.
 *
 * Run: node scripts/fix-mattos-grade-split.mjs
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

const [t1]     = await sql`SELECT id FROM users WHERE email = 'teacher@keenkidsenrichment.com'`
const [mattos] = await sql`SELECT id FROM schools WHERE slug = 'mattos'`

if (!t1 || !mattos) { console.error('❌ teacher@ or mattos school not found'); process.exit(1) }

const removed = await sql`
  DELETE FROM classroom_teachers
  WHERE teacher_id = ${t1.id}
    AND classroom_id IN (
      SELECT id FROM classrooms
      WHERE school_id = ${mattos.id} AND grade_band = 'g3-4'
    )
  RETURNING classroom_id
`
console.log(`🗑  Removed teacher@ from ${removed.length} Mattos g3-4 classroom(s)`)

// Show final state
const final = await sql`
  SELECT u.email, s.name as school, cl.grade_band, cl.name as classroom
  FROM classroom_teachers ct
  JOIN classrooms cl ON cl.id = ct.classroom_id
  JOIN schools s ON s.id = cl.school_id
  JOIN users u ON u.id = ct.teacher_id
  WHERE u.email IN ('teacher@keenkidsenrichment.com','teacher2@keenkidsenrichment.com')
  ORDER BY u.email, s.name, cl.grade_band
`
console.log('\nFinal state:')
final.forEach(r => console.log(`  ${r.email} → ${r.school} ${r.grade_band} "${r.classroom}"`))

await sql.end()
console.log('\n✅ Done')

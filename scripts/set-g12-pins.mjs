#!/usr/bin/env node
/**
 * Sets sequential plain-text PINs for Mattos G1-2 students only.
 * Students are sorted alphabetically; PINs start at 2930 and go 2930, 3132, 3334...
 *
 * Run: cd /Users/anjanavenkat/Documents/keenlearn_app && node scripts/set-g12-pins.mjs
 * Apply: node scripts/set-g12-pins.mjs --apply
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'

const APPLY = process.argv.includes('--apply')

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
    if (m) process.env.DATABASE_URL = m[1]
  }
} catch {}

if (!process.env.DATABASE_URL) { console.error('❌  DATABASE_URL not found'); process.exit(1) }

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

console.log(APPLY ? '🔧 APPLY mode — PINs will be written' : '🔍 DRY RUN — pass --apply to write PINs\n')

// Sequential PINs: 2930, 3132, 3334, 3536, 3738, 3940, 4142, 4344 ...
function seqPin(index) {
  const base = 29 + index * 2
  return `${String(base).padStart(2, '0')}${String(base + 1).padStart(2, '0')}`
}

const students = await sql`
  SELECT u.id, u.name, u.display_name
  FROM users u
  JOIN classrooms cl ON cl.id = u.classroom_id
  JOIN schools s ON s.id = cl.school_id
  WHERE s.name ILIKE '%mattos%'
    AND cl.grade_band = 'g1-2'
    AND u.role = 'student'
    AND u.deleted_at IS NULL
  ORDER BY u.name
`

console.log(`\n=== Mabel Mattos G1-2 (${students.length} students) ===\n`)

for (let i = 0; i < students.length; i++) {
  const student = students[i]
  const pin = seqPin(i)
  const name = student.display_name ?? student.name
  console.log(`  ${name.padEnd(32)} PIN: ${pin}`)
  if (APPLY) {
    const pinHash = await bcrypt.hash(pin, 10)
    await sql`UPDATE users SET pin = ${pin}, pin_hash = ${pinHash} WHERE id = ${student.id}`
  }
}

if (!APPLY) {
  console.log('\n⚠️  DRY RUN — no changes written. Run with --apply to save.')
} else {
  console.log('\n✅ Done.')
}

await sql.end()

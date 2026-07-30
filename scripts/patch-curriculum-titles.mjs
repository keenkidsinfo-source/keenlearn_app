/**
 * patch-curriculum-titles.mjs
 * Fixes W1 curriculum titles in the DB.
 * Run: node scripts/patch-curriculum-titles.mjs
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

const patches = [
  { grade_band: 'g1-2', week_number: 1, title: 'Week 1 — Pulleys' },
  { grade_band: 'g3-4', week_number: 1, title: 'Week 1 — Pulleys & Wheel-and-Axle' },
]

for (const p of patches) {
  const result = await sql`
    UPDATE curriculum SET title = ${p.title}
    WHERE grade_band = ${p.grade_band} AND week_number = ${p.week_number}
    RETURNING id, grade_band, week_number, title
  `
  if (result.length) {
    console.log(`✓ ${result[0].grade_band} W${result[0].week_number} → "${result[0].title}"`)
  } else {
    console.warn(`⚠ No row found for ${p.grade_band} W${p.week_number}`)
  }
}

await sql.end()
console.log('\nDone.')

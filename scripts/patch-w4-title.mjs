/**
 * patch-w4-title.mjs
 * Fixes Week 4 curriculum title — removes "Harry vs Voldemort" from the main
 * week banner. The coding day still shows its own theme ("Harry vs Voldemort!")
 * so nothing is lost; only the top-level week label changes.
 *
 * Run from Mac Terminal:
 *   cd ~/Documents/keenlearn_app && node scripts/patch-w4-title.mjs
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

async function run() {
  // Show current state
  const before = await sql`
    SELECT id, title, grade_band, week_number
    FROM curriculum
    WHERE week_number = 4
    ORDER BY grade_band
  `
  console.log('\nBefore:')
  for (const r of before) console.log(`  ${r.grade_band}  "${r.title}"`)

  // Patch titles
  await sql`UPDATE curriculum SET title = 'Week 4 — Motion & Transportation', theme = 'Motion & Transportation' WHERE week_number = 4 AND grade_band = 'g1-2'`
  await sql`UPDATE curriculum SET title = 'Week 4 — Motion & Transportation', theme = 'Motion & Transportation' WHERE week_number = 4 AND grade_band = 'g3-4'`

  const after = await sql`
    SELECT id, title, grade_band, week_number
    FROM curriculum
    WHERE week_number = 4
    ORDER BY grade_band
  `
  console.log('\nAfter:')
  for (const r of after) console.log(`  ${r.grade_band}  "${r.title}"`)

  await sql.end()
  console.log('\n✅ Done. Week 4 title updated to "Week 4 — Motion & Transportation" for both grade bands.')
}

run().catch(e => { console.error(e); process.exit(1) })

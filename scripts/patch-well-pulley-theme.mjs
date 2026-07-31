/**
 * patch-well-pulley-theme.mjs
 * Fixes curriculum_days.theme from "Desk Crane" → "Well Pulley" for G3-4 W1.
 * Run: node scripts/patch-well-pulley-theme.mjs
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

const result = await sql`
  UPDATE curriculum_days
  SET theme = 'Well Pulley'
  WHERE theme = 'Desk Crane'
  RETURNING id, subject, theme
`

if (result.length > 0) {
  for (const r of result) console.log(`✓ Fixed: ${r.subject} → "${r.theme}"`)
} else {
  console.log('⚠ No rows with theme="Desk Crane" found — already patched or different value.')
}

await sql.end()
console.log('\n✅ Done.')

/**
 * patch-wellpulley-bucket.mjs
 * Updates Well Pulley Step 7 (Make the bucket) to use paper clip method.
 * Run: node scripts/patch-wellpulley-bucket.mjs
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

// Update step index 6 (0-based = Step 7) in the metadata JSON for Well Pulley
const result = await sql`
  UPDATE content_items
  SET metadata = jsonb_set(
    jsonb_set(
      metadata,
      '{steps,6,text}',
      '"Roll the small corrugated piece into a mini cylinder and tape the seam. Bend a paper clip into an open hook shape and loop one end through the top rim of the bucket on each side. Tie the free hanging end of your axle string directly to the paper clip hook."'
    ),
    '{steps,6,tip}',
    '"The paper clip hook is your handle — make sure it sits over the rim securely before attaching the string."'
  )
  WHERE title = 'Well Pulley'
  RETURNING id, title
`

if (result.length === 0) {
  console.log('No rows matched — check that title is exactly "Well Pulley"')
} else {
  console.log(`Updated ${result.length} row(s):`, result.map(r => r.title))
}

await sql.end()

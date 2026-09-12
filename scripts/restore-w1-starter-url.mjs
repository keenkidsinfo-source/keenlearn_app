/**
 * restore-w1-starter-url.mjs
 * Restores the starterUrl for G1-2 W1 coding content
 * (which was removed by patch-coding-w1-remove-starter.mjs)
 * Run: node scripts/restore-w1-starter-url.mjs
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

const [item] = await sql`
  SELECT ci.id, ci.metadata
  FROM content_items ci
  JOIN curriculum_content cc ON cc.content_item_id = ci.id
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE ci.subject = 'coding'
    AND ci.grade_band = 'g1-2'
    AND c.grade_band = 'g1-2'
    AND c.week_number = 1
    AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
  ORDER BY ci.created_at DESC
  LIMIT 1
`

if (!item) { console.error('No G1-2 W1 coding item found'); process.exit(1) }

const updated = { ...item.metadata, starterUrl: '/scratch-starters/g1-2-w1-starter.sb3' }
await sql`UPDATE content_items SET metadata = ${updated} WHERE id = ${item.id}`
console.log('✓ G1-2 W1: starterUrl restored to /scratch-starters/g1-2-w1-starter.sb3')

await sql.end()

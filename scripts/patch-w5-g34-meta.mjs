/**
 * patch-w5-g34-meta.mjs
 * Removes g12StopAfter from the G3-4 W5 coding metadata.
 * G3-4 W5 has its own separate 10-step list — the banner
 * "G1-2 great job, G3-4 keep going!" should never appear.
 *
 * Run: node scripts/patch-w5-g34-meta.mjs
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
  INNER JOIN curriculum_content cc ON cc.content_item_id = ci.id
  INNER JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  INNER JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE c.grade_band = 'g3-4'
    AND c.week_number = 5
    AND cd.subject = 'coding'
  LIMIT 1
`

if (!item) {
  console.error('❌ G3-4 W5 coding item not found')
  await sql.end()
  process.exit(1)
}

const meta = typeof item.metadata === 'string'
  ? JSON.parse(item.metadata)
  : (item.metadata ?? {})

if ('g12StopAfter' in meta) {
  delete meta.g12StopAfter
  await sql`
    UPDATE content_items
    SET metadata = ${JSON.stringify(meta)}
    WHERE id = ${item.id}
  `
  console.log(`✅ G3-4 W5 — removed g12StopAfter from metadata (id: ${item.id})`)
} else {
  console.log(`ℹ️  G3-4 W5 — g12StopAfter was not set, nothing to do (id: ${item.id})`)
}

await sql.end()

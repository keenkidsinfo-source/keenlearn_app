/**
 * patch-w5-no-starter.mjs
 * Sets noStarterFallback: true on W5 coding content items for both grade bands.
 * This prevents the editor from auto-loading the Harry Potter (W4) project
 * when a student opens W5 for the first time — Space Shooter is a brand-new game.
 *
 * Run: node scripts/patch-w5-no-starter.mjs
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

for (const gradeBand of ['g1-2', 'g3-4']) {
  const [item] = await sql`
    SELECT ci.id, ci.metadata
    FROM content_items ci
    INNER JOIN curriculum_content cc ON cc.content_item_id = ci.id
    INNER JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    INNER JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE c.grade_band = ${gradeBand}
      AND c.week_number = 5
      AND cd.subject = 'coding'
    LIMIT 1
  `

  if (!item) {
    console.warn(`⚠️  No W5 coding item for ${gradeBand} — skipping`)
    continue
  }

  const meta = typeof item.metadata === 'string'
    ? JSON.parse(item.metadata)
    : (item.metadata ?? {})

  meta.noStarterFallback = true

  await sql`
    UPDATE content_items
    SET metadata = ${JSON.stringify(meta)}
    WHERE id = ${item.id}
  `

  console.log(`✅ ${gradeBand} W5 — noStarterFallback set (id: ${item.id})`)
}

await sql.end()
console.log('\n✅ Done — W5 will always open as a blank Scratch project for first-time students')

/**
 * patch-build-w4-resultfields.mjs
 * Updates Paper Fan result fields in DB for both G1-2 and G3-4.
 * Changes: spins (Yes/No) → Number of spins, rating 1-5
 *
 * Run: cd ~/Documents/keenlearn_app && node scripts/patch-build-w4-resultfields.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
for (const line of lines) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('='); if (i === -1) continue
  const k = t.slice(0, i).trim()
  const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  if (!process.env[k]) process.env[k] = v
}

const sql = postgres(process.env.DATABASE_URL)

const newResultFields = {
  a:               { label: 'Number of spins',      key: 'spins'       },
  b:               { label: 'Rating (1–5 stars)',    key: 'speedRating' },
  unit:            'spins',
  leaderboard:     'more',
  showLeaderboard: false,
}

for (const gradeBand of ['g1-2', 'g3-4']) {
  const [item] = await sql`
    SELECT ci.id, ci.title, ci.metadata::text as raw_meta
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'build' AND ci.grade_band = ${gradeBand} AND c.week_number = 4
    ORDER BY ci.created_at DESC LIMIT 1
  `

  if (!item) { console.warn(`⚠️  No W4 build item found for ${gradeBand}`); continue }

  let meta = item.raw_meta
  if (typeof meta === 'string' && meta.startsWith('"')) meta = JSON.parse(meta)
  const obj = typeof meta === 'string' ? JSON.parse(meta) : meta

  const updatedMeta = { ...obj, resultFields: newResultFields }

  await sql`
    UPDATE content_items
    SET metadata = ${updatedMeta}
    WHERE id = ${item.id}
  `

  console.log(`✅ ${gradeBand} Paper Fan: resultFields updated → spins + speedRating`)
}

console.log('\nDone! Email will now show "Number of spins" and "Rating (1–5 stars)".')
await sql.end()

/**
 * patch-coding-w4-g12-lightning.mjs
 * Fixes Steps 6 + 7 for G1-2 W4:
 * Lightning bolt should start at Harry's position (go to [Harry])
 * instead of a fixed x:0 y:-130 that ignores where Harry is standing.
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

const [item] = await sql`
  SELECT ci.id, ci.metadata::text as raw_meta
  FROM content_items ci
  JOIN curriculum_content cc ON cc.content_item_id = ci.id
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE ci.subject = 'coding' AND ci.grade_band = 'g1-2' AND c.week_number = 4
  ORDER BY ci.created_at DESC LIMIT 1
`

if (!item) { console.error('No G1-2 W4 coding item found'); process.exit(1) }

let meta = item.raw_meta
if (typeof meta === 'string' && meta.startsWith('"')) meta = JSON.parse(meta)
const obj = typeof meta === 'string' ? JSON.parse(meta) : meta
const steps = [...obj.steps]

console.log(`Found ${steps.length} steps. Patching Steps 6 + 7 (indices 5, 6)...`)

// Step 6 (index 5): bolt starts at Harry's position
steps[5] = `⚡ Lightning starts at Harry!

Click LIGHTNING_BOLT in the sprite list:
① EVENTS → "when [space] key pressed"
② MOTION → "go to [Harry]"
   (click dropdown → choose Harry)

✅ Bolt snaps to wherever Harry is standing!`

// Step 7 (index 6): bolt flies up, resets to Harry
steps[6] = `⚡ Lightning flies up!

Still on LIGHTNING_BOLT — snap underneath:
① MOTION → "glide 0.5 secs to x: 0 y: 160"
② MOTION → "go to [Harry]"
   (resets back to Harry for the next shot)

✅ Press Space — lightning fires and resets to Harry!`

const updatedMeta = { ...obj, steps }
await sql`
  UPDATE content_items
  SET metadata = ${updatedMeta}, step_count = ${steps.length}
  WHERE id = ${item.id}
`

console.log('✅ Fixed Steps 6 + 7 — lightning now starts at Harry\'s position.')
await sql.end()

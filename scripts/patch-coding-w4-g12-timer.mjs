/**
 * patch-coding-w4-g12-timer.mjs
 * Fixes Step 7 (index 6) of G1-2 W4 coding:
 * Removes LOOKS → "say [Time's up!]" from the STAGE timer step — Stage has no "say" block.
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
  AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
  ORDER BY ci.created_at DESC LIMIT 1
`

if (!item) { console.error('No G1-2 W4 coding item found'); process.exit(1) }

let meta = item.raw_meta
if (typeof meta === 'string' && meta.startsWith('"')) meta = JSON.parse(meta)
const obj = typeof meta === 'string' ? JSON.parse(meta) : meta
const steps = [...obj.steps]

console.log(`Found ${steps.length} steps. Patching Step 7 (index 6)...`)
console.log('\nCURRENT Step 7:\n', steps[6])

// Find step 7 by matching its content (index may vary)
const timerIdx = steps.findIndex(s => s.includes('30-second timer') || s.includes('repeat 30'))
if (timerIdx === -1) { console.error('Could not find timer step!'); process.exit(1) }
console.log(`Timer step found at index ${timerIdx}`)

steps[timerIdx] = `⏱️ Add a 30-second timer!

① Orange VARIABLES → "Make a Variable" → type Time → OK

Click the STAGE (small grey box to the LEFT of the sprite list):
② Yellow EVENTS → "when 🚩 clicked"
③ Orange VARIABLES → "set Score to 0" → snap under
④ Orange VARIABLES → "set Time to 30" → snap under
⑤ Orange CONTROL → "repeat 30" → snap under
   Inside repeat: CONTROL → "wait 1 secs"
   Inside repeat: VARIABLES → "change Time by -1"
⑥ After the repeat (snap OUTSIDE below it):
   Orange CONTROL → "stop [all]"

✅ Click 🚩 — the timer counts down from 30 and stops at 0!

💡 Note: The Stage doesn't have a "say" block — that's why we just use "stop [all]" here.`

const updatedMeta = { ...obj, steps }
await sql`
  UPDATE content_items
  SET metadata = ${updatedMeta}, step_count = ${steps.length}
  WHERE id = ${item.id}
`

console.log('\n✅ Fixed! Removed "say" from Stage timer step — Stage has no say block.')
await sql.end()

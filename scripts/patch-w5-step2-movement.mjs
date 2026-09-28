/**
 * patch-w5-step2-movement.mjs
 * Fixes step 2 (rocketship movement) for both G1-2 and G3-4 W5.
 * Replaces sluggish event-based movement (when key pressed)
 * with smooth polling movement (forever + if key pressed? SENSING).
 *
 * Run: node scripts/patch-w5-step2-movement.mjs
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

const NEW_STEP2 = `⬅️➡️ Move left and right + add Score!

① VARIABLES → "Make a Variable" → type "Score" → OK
   Find the "when 🚩 clicked" stack → snap at the bottom:
   VARIABLES  ▸ "set Score to 0"

② Same stack — snap below "set Score to 0":
   CONTROL ▸ "forever"
   INSIDE the forever, add TWO "if < > then" blocks:

   First if:
     — hexagon: SENSING "key [left arrow] pressed?"
     INSIDE: MOTION ▸ "change x by -15"

   Second if (snap below the first, still inside forever):
     — hexagon: SENSING "key [right arrow] pressed?"
     INSIDE: MOTION ▸ "change x by 15"

✅ Hold left/right arrow — rocket moves smoothly! Score shows 0!
⚠️ This is different from "when key pressed" — SENSING checks every frame!`

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

  if (!meta.steps) {
    console.warn(`⚠️  ${gradeBand} W5 has no steps — skipping`)
    continue
  }

  // Step 2 is index 1
  meta.steps[1] = NEW_STEP2

  await sql`
    UPDATE content_items
    SET metadata = ${JSON.stringify(meta)}
    WHERE id = ${item.id}
  `
  console.log(`✅ ${gradeBand} W5 step 2 — smooth movement applied (id: ${item.id})`)
}

await sql.end()
console.log('\n✅ Done — rocketship now moves smoothly with held arrow keys')

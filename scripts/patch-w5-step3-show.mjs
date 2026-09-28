/**
 * patch-w5-step3-show.mjs
 * Adds "LOOKS ▸ show" to step 3 (asteroid) for both G1-2 and G3-4 W5.
 * Fixes the bug where the asteroid is invisible after the flag is clicked.
 *
 * Run: node scripts/patch-w5-step3-show.mjs
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

const OLD_STEP3 = `☄️ Make a falling asteroid!

① Click the sprite icon → Choose a Sprite → search "Rocks" → click it
② Click Rocks in the sprite list. Drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "set size to 50 %"
   CONTROL ▸ "forever"   ← this is the big mouth block`

const NEW_STEP3 = `☄️ Make a falling asteroid!

① Click the sprite icon → Choose a Sprite → search "Rocks" → click it
② Click Rocks in the sprite list. Drag to code area:
   EVENTS  ▸ "when 🚩 clicked"
   LOOKS   ▸ "set size to 50 %"
   LOOKS   ▸ "show"
   CONTROL ▸ "forever"   ← this is the big mouth block`

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

  // Step 3 is index 2
  if (meta.steps[2] && meta.steps[2].includes(OLD_STEP3)) {
    meta.steps[2] = meta.steps[2].replace(OLD_STEP3, NEW_STEP3)
    await sql`
      UPDATE content_items
      SET metadata = ${JSON.stringify(meta)}
      WHERE id = ${item.id}
    `
    console.log(`✅ ${gradeBand} W5 step 3 — added "show" block (id: ${item.id})`)
  } else if (meta.steps[2] && meta.steps[2].includes('LOOKS   ▸ "show"')) {
    console.log(`ℹ️  ${gradeBand} W5 step 3 — "show" already present, nothing to do`)
  } else {
    console.warn(`⚠️  ${gradeBand} W5 step 3 text didn't match — check manually`)
    console.log('Step 3 starts with:', meta.steps[2]?.slice(0, 100))
  }
}

await sql.end()
console.log('\n✅ Done')

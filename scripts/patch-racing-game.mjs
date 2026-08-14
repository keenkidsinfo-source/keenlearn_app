#!/usr/bin/env node
/**
 * patch-racing-game.mjs
 * Fixes two bugs in G3-4 Week 2 Racing Game coding steps:
 *   1. "Racetrack" backdrop → "Track" (Sports category)
 *   2. Remove "set Speed to 3" from when-flag-clicked loop
 *
 * Run: node scripts/patch-racing-game.mjs
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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  // Find the Racing Game content item (G3-4 W2)
  const items = await sql`
    SELECT ci.id, ci.title, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'coding'
      AND ci.grade_band = 'g3-4'
      AND c.week_number = 2
      AND c.grade_band = 'g3-4'
    ORDER BY ci.created_at DESC
  `

  if (items.length === 0) {
    console.error('❌ G3-4 Week 2 coding item not found')
    process.exit(1)
  }

  for (const item of items) {
    console.log(`\nPatching: "${item.title}" (id: ${item.id})`)
    const meta = item.metadata

    // Fix step 2: Racetrack → Track (Sports)
    meta.steps[1] = '🗑️ Delete the cat sprite. Choose a race track backdrop — click the backdrop icon (bottom-right) → search "Track" in the Sports category. If you can\'t find it, paint your own oval track with green grass and a grey road.'
    console.log('  ✓ Step 2: "Racetrack" → "Track (Sports category)"')

    // Fix step 5: remove "set Speed to 3" from the main loop
    meta.steps[4] = '🏗️ Build the driving loop: Events → "when 🚩 clicked" → "forever" → Motion → "move Speed steps" → "if on edge, bounce". (No speed reset here — you control it with the arrow keys!)'
    console.log('  ✓ Step 5: removed "set Speed to 3" from when-flag-clicked')

    // Fix step 6: update test instruction since car starts at 0 now
    meta.steps[5] = '🚩 Test it — the car won\'t move yet because Speed starts at 0. Use the ↑ arrow to get going!'
    console.log('  ✓ Step 6: updated test instruction for speed-0 start')

    await sql`UPDATE content_items SET metadata = ${meta} WHERE id = ${item.id}`
    console.log(`  ✅ Saved`)
  }

  await sql.end()
  console.log('\n✅ Racing Game patches applied')
}

run().catch(e => { console.error(e); process.exit(1) })

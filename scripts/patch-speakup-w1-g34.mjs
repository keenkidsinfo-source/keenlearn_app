#!/usr/bin/env node
/**
 * patch-speakup-w1-g34.mjs
 * Updates the G3-4 Week 1 SpeakUp session (Row 11 + Row 12 teacher bug sheet):
 *
 *   Row 11 — Warm-up script lifelines:
 *     Update 1:00 step to write sentence starters on the board before calling students up.
 *     Update 1:30 step to reference board as a lifeline.
 *   (Row 11 checkmark ✓ → 🎯 fix is UI-only, already done in SpeakingSession.tsx)
 *
 *   Row 12 — Remove teacher-facing tip from student portal:
 *     Delete the tip / tipIcon fields from G3-4 W1 metadata so the "first session sets
 *     the emotional tone..." text no longer appears on the student speaking page.
 *
 * Run: node scripts/patch-speakup-w1-g34.mjs
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
  // Find the G3-4 W1 SpeakUp content item
  const items = await sql`
    SELECT ci.id, ci.title, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'public_speaking'
      AND ci.grade_band = 'g3-4'
      AND c.week_number = 1
      AND c.grade_band = 'g3-4'
    ORDER BY ci.created_at DESC
    LIMIT 1
  `

  if (items.length === 0) {
    console.error('❌ G3-4 Week 1 SpeakUp content item not found')
    process.exit(1)
  }

  const item = items[0]
  console.log(`\nPatching: "${item.title}" (id: ${item.id})`)

  const meta = item.metadata

  // ── Row 12: Remove teacher-facing tip ────────────────────────────────────
  if (meta.tip) {
    delete meta.tip
    delete meta.tipIcon
    console.log('  ✓ Removed teacher-facing tip from metadata')
  } else {
    console.log('  · No tip field found, skipping')
  }

  // ── Row 11: Warm-up script lifelines ─────────────────────────────────────
  const warmup = meta.sessionPlan?.[0]
  if (!warmup || warmup.label !== 'WARM-UP') {
    console.error('❌ Expected WARM-UP as first segment, got:', warmup?.label)
    process.exit(1)
  }

  // Update 1:00 step — add sentence starters on board + ground rules
  const idx100 = warmup.steps.findIndex(s => s.time === '1:00')
  if (idx100 === -1) {
    console.error('❌ Could not find 1:00 step in WARM-UP')
    process.exit(1)
  }
  warmup.steps[idx100] = {
    time: '1:00',
    action: `Before calling anyone up, write three sentence starters on the board — keep them visible for the whole round:\n\n  • "My name is ___"\n  • "One surprising fact about me is ___"\n  • "I'm here because ___"\n\nTell the class: "These are your lifelines — use all three, or just start with the first one if you freeze. The board stays up for everyone." Then set the ground rules: "Audience stays silent while someone speaks. Snaps after every speaker. No coaching, no laughing — today is only about building the muscle of standing up front."`,
  }
  console.log('  ✓ Updated 1:00 step with sentence starters on board')

  // Update 1:30 step — reference board as lifeline
  const idx130 = warmup.steps.findIndex(s => s.time === '1:30')
  if (idx130 === -1) {
    console.error('❌ Could not find 1:30 step in WARM-UP')
    process.exit(1)
  }
  warmup.steps[idx130] = {
    time: '1:30',
    action: `Call students one at a time. Set timer to 30 sec. Student stands, faces the class, and uses the board lines as needed. Class snaps after each. Teacher says only: "Thank you, [name]." No feedback yet. If a student freezes beyond 5 seconds, point calmly to the board and say quietly: "Start with the first line."`,
  }
  console.log('  ✓ Updated 1:30 step to reference board as lifeline')

  // Write updated metadata back
  await sql`UPDATE content_items SET metadata = ${meta} WHERE id = ${item.id}`
  console.log('\n✅ Patch applied successfully!')

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

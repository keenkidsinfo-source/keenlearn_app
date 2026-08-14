#!/usr/bin/env node
/**
 * patch-speakup-w1-g12.mjs
 * Updates the G1-2 Week 1 SpeakUp session plan (Row 9 teacher bug sheet):
 *   1. Add "stay quiet during peer turns" rule step before 2:30 warm-up
 *   2. Replace 14:00 "6-minute gap" placeholder with real backup prompts
 *   3. Add 27:00 "Shake it out" movement break before First Try
 *   4. Change 55:30 home practice line to "try it once at dinner tonight"
 *
 * NOTE: ✓ → 🎯 on Today's Goals is a UI-only fix in SpeakingSession.tsx (already done).
 *
 * Run: node scripts/patch-speakup-w1-g12.mjs
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
  // Find the G1-2 W1 SpeakUp content item
  const items = await sql`
    SELECT ci.id, ci.title, ci.metadata
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'public_speaking'
      AND ci.grade_band = 'g1-2'
      AND c.week_number = 1
      AND c.grade_band = 'g1-2'
    ORDER BY ci.created_at DESC
    LIMIT 1
  `

  if (items.length === 0) {
    console.error('❌ G1-2 Week 1 SpeakUp content item not found')
    process.exit(1)
  }

  const item = items[0]
  console.log(`\nPatching: "${item.title}" (id: ${item.id})`)

  const meta = item.metadata

  // ── Segment 0: WARM-UP ───────────────────────────────────────────────────
  const warmup = meta.sessionPlan[0]
  if (!warmup || warmup.label !== 'WARM-UP') {
    console.error('❌ Expected WARM-UP as first segment, got:', warmup?.label)
    process.exit(1)
  }

  // Insert "stay quiet during peer turns" rule as new step before 2:30
  // Current steps: [0:00, 1:00, 2:30, 7:00] → [0:00, 1:00, 2:00(new), 2:30, 7:00]
  const ruleStep = {
    time: '2:00',
    action: 'Set the one rule before we begin: "When your classmate is standing and speaking, it is THEIR moment. Our rule: stay quiet during peer turns — no talking, no side comments. When they finish, we snap or clap. Ready?" Thumbs up from the class.',
  }
  // Insert after index 1 (the 1:00 step)
  const has200 = warmup.steps.some(s => s.time === '2:00')
  if (!has200) {
    warmup.steps.splice(2, 0, ruleStep)
    console.log('  ✓ Added 2:00 "stay quiet during peer turns" rule step')
  } else {
    console.log('  · 2:00 step already present, skipping')
  }

  // ── Segment 1: MAIN ACTIVITY ─────────────────────────────────────────────
  const main = meta.sessionPlan[1]
  if (!main || main.label !== 'MAIN ACTIVITY') {
    console.error('❌ Expected MAIN ACTIVITY as second segment, got:', main?.label)
    process.exit(1)
  }

  // Fix 14:00 step — replace "6-minute gap" with backup prompts
  const idx14 = main.steps.findIndex(s => s.time === '14:00')
  if (idx14 === -1) {
    console.error('❌ Could not find 14:00 step in MAIN ACTIVITY')
    process.exit(1)
  }
  main.steps[idx14] = {
    time: '14:00',
    action: 'If discussion slows, use one of these backup prompts to keep momentum: "Has anyone seen a speech at a wedding, graduation, assembly, or on TV — what were they talking about?" / "If YOU had a microphone for 60 seconds right now, what would you say?" / "Where do you feel most comfortable talking — at home with family, with friends, or somewhere else?" Pick whichever fits the energy. You only need one.',
  }
  console.log('  ✓ Replaced 14:00 "6-minute gap" with backup prompts')

  // Add 27:00 shake-out break before the 28:00 First Try step
  const idx28 = main.steps.findIndex(s => s.time === '28:00')
  if (idx28 === -1) {
    console.error('❌ Could not find 28:00 step in MAIN ACTIVITY')
    process.exit(1)
  }
  const has2700 = main.steps.some(s => s.time === '27:00')
  if (!has2700) {
    const shakeStep = {
      time: '27:00',
      action: 'SHAKE IT OUT. "Stand up — everyone up! Shake your hands like there\'s water on them. Now shake your whole body — shake those nerves out! 5, 4, 3, 2, 1 — FREEZE! Great. Sit back down. We are READY."',
    }
    main.steps.splice(idx28, 0, shakeStep)
    console.log('  ✓ Added 27:00 "Shake it out" movement break before First Try')
  } else {
    console.log('  · 27:00 step already present, skipping')
  }

  // ── Segment 2: WRAP-UP ────────────────────────────────────────────────────
  const wrapup = meta.sessionPlan[2]
  if (!wrapup || wrapup.label !== 'WRAP-UP') {
    console.error('❌ Expected WRAP-UP as third segment, got:', wrapup?.label)
    process.exit(1)
  }

  // Fix 55:30 home practice line
  const idx5530 = wrapup.steps.findIndex(s => s.time === '55:30')
  if (idx5530 === -1) {
    console.error('❌ Could not find 55:30 step in WRAP-UP')
    process.exit(1)
  }
  wrapup.steps[idx5530] = {
    time: '55:30',
    action: '"Next week we learn VOICE — how to make your voice big enough to fill this whole room. Tonight\'s challenge: try it once at dinner! Tell someone at the table the ONE place you\'d like to give a speech someday."',
  }
  console.log('  ✓ Updated 55:30 home practice line')

  // Write the updated metadata back
  await sql`UPDATE content_items SET metadata = ${meta} WHERE id = ${item.id}`
  console.log('\n✅ Patch applied successfully!')

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

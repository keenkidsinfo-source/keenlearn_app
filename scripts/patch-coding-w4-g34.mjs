/**
 * patch-coding-w4-g34.mjs
 * Patches 5 specific steps in the G3-4 Week 4 Harry Potter coding content.
 * Does NOT overwrite all 16 steps — only fixes the targeted ones.
 *
 * Changes:
 *   Step 7  — Lightning bolt: point towards Voldemort + glide 0.3s to him
 *   Step 8  — Lightning hits: add "change Score by 1" per hit
 *   Step 9  — Voldemort respawns: remove "change Score by 1" (now per-hit)
 *   Step 11 — Harry takes damage: add "change Score by -1" per hit
 *   Step 13 — Timer: repeat until Time < 1 (not repeat 60)
 *
 * Run: cd ~/Documents/keenlearn_app && node scripts/patch-coding-w4-g34.mjs
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
  WHERE ci.subject = 'coding' AND ci.grade_band = 'g3-4' AND c.week_number = 4
  AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
  ORDER BY ci.created_at DESC LIMIT 1
`

if (!item) { console.error('No item found'); process.exit(1) }

let meta = item.raw_meta
if (typeof meta === 'string' && meta.startsWith('"')) meta = JSON.parse(meta)
const obj = typeof meta === 'string' ? JSON.parse(meta) : meta
const steps = [...obj.steps]

console.log(`Found ${steps.length} steps. Patching 6...`)

// ── Step 7 (index 6): Lightning fires from Harry ──────────────────────────────
steps[6] = `⚡ Lightning fires from Harry!

Click LIGHTNING_BOLT:
① EVENTS → "when [space] key pressed"
② MOTION → "go to [Harry]"
③ MOTION → "point towards [Voldemort]"
④ MOTION → "glide 0.3 secs to [Voldemort]"
⑤ MOTION → "go to [Harry]"

✅ Press Space — bolt flies from Harry to Voldemort!`

// ── Step 8 (index 7): Lightning hits Voldemort — add score per hit ───────────
steps[7] = `💥 Lightning hits Voldemort!

Click VOLDEMORT — inside the forever, add an "if":
① SENSING → "touching [Lightning_Bolt]?" → into diamond
② Inside: VARIABLES "change Voldemort_HP by -1"
③ Inside: VARIABLES "change Score by 1"
④ Inside: CONTROL "wait 0.3 secs"

✅ Hit Voldemort — HP drops AND score goes up!`

// ── Step 9 (index 8): Voldemort respawns — remove score (now per-hit) ────────
steps[8] = `💀 Voldemort respawns!

Still on VOLDEMORT — 2nd "if" below the first (inside forever):
① OPERATORS → Voldemort_HP < 1 → into diamond
② Inside: VARIABLES "set Voldemort_HP to 5"
③ Inside: MOTION "go to [random position]"
④ Inside: LOOKS "say [I'll be back! 💀] for 0.5 secs"

✅ 5 hits — he vanishes and comes back!`

// ── Step 11 (index 10): Harry takes damage — add score -1 ───────────────────
steps[10] = `❤️ Harry takes damage!

Click HARRY — find an EMPTY spot, new stack:
① EVENTS → "when 🚩 clicked" + CONTROL → "forever"
② Inside: if SENSING "touching [Dark_Curse]?"
③ VARIABLES "change Harry_HP by -1" + "change Score by -1"
④ LOOKS "say [Ouch! 😣] for 0.5 secs"
⑤ CONTROL "wait 1 secs"

✅ Curse hits Harry — HP drops AND score goes down!`

// ── Step 13 (index 12): Timer — repeat until Time < 1 ───────────────────────
steps[12] = `⏱️ 60-second timer!

Still on STAGE — snap below "set Score to 0":
① VARIABLES → "set Time to 60"
② CONTROL → "repeat until Time < 1"
   Inside: CONTROL "wait 1 secs"
   Inside: VARIABLES "change Time by -1"

✅ Timer counts down from 60 to 0!`

// ── Step 14 (index 13): Personal Best — fix Stage "say" bug ─────────────────
steps[13] = `🏆 Personal Best!

Still on STAGE — snap below the timer:
① if OPERATORS → Score > Personal_Best
   Inside: VARIABLES "set Personal_Best to Score"
② CONTROL → "stop [all]"

✅ Beat your record each round!`

// Write back
const updatedMeta = { ...obj, steps }

await sql`
  UPDATE content_items
  SET metadata = ${updatedMeta},
      step_count = ${steps.length}
  WHERE id = ${item.id}
`

console.log('✅ Patched steps 7, 8, 9, 11, 13, 14. All 16 steps preserved.')
await sql.end()

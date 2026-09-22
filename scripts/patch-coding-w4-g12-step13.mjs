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

console.log(`Found ${steps.length} steps. Patching Step 13 (index 12)...`)

// Step 13 (index 12): just the countdown — Step 12 already did the variable + stage setup
steps[12] = `⏳ Countdown from 30!

Still on the STAGE — snap below "set Time to 30":
① CONTROL → "repeat 30"
   Inside: CONTROL → "wait 1 secs"
   Inside: VARIABLES → "change Time by -1"
② After the repeat (snap OUTSIDE below):
   CONTROL → "stop [all]"

✅ Timer counts down from 30 to 0 and stops!`

const updatedMeta = { ...obj, steps }
await sql`
  UPDATE content_items
  SET metadata = ${updatedMeta}, step_count = ${steps.length}
  WHERE id = ${item.id}
`

console.log('✅ Fixed Step 13 — removed duplicate setup, kept only the countdown loop.')
await sql.end()

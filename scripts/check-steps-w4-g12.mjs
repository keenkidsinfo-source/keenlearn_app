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
  SELECT ci.id, ci.step_count, ci.metadata::text as raw_meta
  FROM content_items ci
  JOIN curriculum_content cc ON cc.content_item_id = ci.id
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE ci.subject = 'coding' AND ci.grade_band = 'g1-2' AND c.week_number = 4
  ORDER BY ci.created_at DESC LIMIT 1
`

let meta = item.raw_meta
if (typeof meta === 'string' && meta.startsWith('"')) meta = JSON.parse(meta)
const obj = typeof meta === 'string' ? JSON.parse(meta) : meta
const steps = obj.steps

console.log(`DB step_count: ${item.step_count}, actual steps in metadata: ${steps.length}\n`)
steps.forEach((s, i) => {
  console.log(`\n=== Step ${i + 1} ===`)
  console.log(s)
})

await sql.end()

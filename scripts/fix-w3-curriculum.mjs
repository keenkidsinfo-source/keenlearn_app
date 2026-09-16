/**
 * fix-w3-curriculum.mjs
 * Finds the correct curriculum_id for W3 (the one linked to real content items)
 * and points all classrooms at it.
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

// For each grade_band + week_number, find the curriculum that has the MOST content_items
const best = await sql`
  SELECT c.grade_band, c.week_number, c.id as curriculum_id,
         COUNT(DISTINCT ci.id) as content_count,
         COUNT(DISTINCT cd.id) as day_count
  FROM curriculum c
  LEFT JOIN curriculum_days cd ON cd.curriculum_id = c.id
  LEFT JOIN curriculum_content cc ON cc.curriculum_day_id = cd.id
  LEFT JOIN content_items ci ON ci.id = cc.content_item_id
  WHERE c.week_number <= 16
  GROUP BY c.grade_band, c.week_number, c.id
  ORDER BY c.grade_band, c.week_number, content_count DESC, day_count DESC
`

// Best curriculum per grade_band:week_number (most content wins)
const bestMap = new Map()
for (const row of best) {
  const key = `${row.grade_band}:${row.week_number}`
  if (!bestMap.has(key)) {
    bestMap.set(key, { id: row.curriculum_id, days: parseInt(row.day_count), content: parseInt(row.content_count) })
    console.log(`  ${key} → id=${row.curriculum_id} | days=${row.day_count} | content_items=${row.content_count}`)
  }
}

const W3_MONDAY = '2026-09-14'

const classrooms = await sql`SELECT id, name, grade_band FROM classrooms ORDER BY name`

for (const classroom of classrooms) {
  const cur = bestMap.get(`${classroom.grade_band}:3`)
  if (!cur) { console.warn(`No W3 curriculum found for ${classroom.grade_band}`); continue }

  await sql`
    UPDATE classroom_curriculum
    SET curriculum_id = ${cur.id}
    WHERE classroom_id = ${classroom.id}
      AND week_start_date::date = ${W3_MONDAY}::date
  `
  console.log(`✓ "${classroom.name}" W3 → curriculum ${cur.id} (days=${cur.days}, content=${cur.content})`)
}

await sql.end()
console.log('\n✅ Done')

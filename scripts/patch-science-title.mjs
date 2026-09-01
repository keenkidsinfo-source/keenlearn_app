/**
 * patch-science-title.mjs
 * Fixes the Week 1 science theme shown on the student dashboard Thursday tile.
 * Updates BOTH curriculum_days.theme AND content_items.title for G1-2 Week 1 science.
 * Run: node scripts/patch-science-title.mjs
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
const NEW_TITLE = 'The Invisible Fire Extinguisher'

// 1. Fix curriculum_days.theme (what the student dashboard tile shows)
const days = await sql`
  UPDATE curriculum_days cd
  SET theme = ${NEW_TITLE}
  FROM curriculum c
  WHERE cd.curriculum_id = c.id
    AND cd.subject = 'science'
    AND c.week_number = 1
  RETURNING cd.id, cd.theme
`
console.log(`curriculum_days.theme updated: ${days.length} row(s)`)

// 2. Fix content_items.title for BOTH grades (what the teacher dashboard "This Week" card shows)
const items = await sql`
  UPDATE content_items ci
  SET title = ${NEW_TITLE}
  FROM curriculum_content cc
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE cc.content_item_id = ci.id
    AND ci.subject = 'science'
    AND c.week_number = 1
  RETURNING ci.id, ci.title, ci.grade_band
`
console.log(`content_items.title updated: ${items.length} row(s)`, items.map(r => r.grade_band))

await sql.end()

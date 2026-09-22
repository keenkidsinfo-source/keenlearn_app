/**
 * patch-w4-starter-url.mjs
 * One-time fix: sets starterUrl in metadata for W4 coding content items.
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

const patches = [
  { gradeBand: 'g1-2', starterUrl: '/scratch-starters/g1-2-w4-starter.sb3' },
  { gradeBand: 'g3-4', starterUrl: '/scratch-starters/g3-4-w4-starter.sb3' },
]

async function main() {
  for (const p of patches) {
    const [item] = await sql`
      SELECT ci.id, ci.metadata
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'coding'
        AND ci.grade_band = ${p.gradeBand}
        AND c.grade_band = ${p.gradeBand}
        AND c.week_number = 4
        AND c.id IN (SELECT curriculum_id FROM classroom_curriculum)
      ORDER BY ci.created_at DESC
      LIMIT 1
    `
    if (!item) { console.warn(`⚠️  No W4 coding item for ${p.gradeBand}`); continue }

    const current = item.metadata ?? {}
    const updated = { ...current, starterUrl: p.starterUrl }
    await sql`UPDATE content_items SET metadata = ${JSON.stringify(updated)} WHERE id = ${item.id}`
    console.log(`✅ ${p.gradeBand} → starterUrl set to ${p.starterUrl}`)
    console.log(`   (was: ${current.starterUrl ?? 'not set'})`)
  }
  await sql.end()
  console.log('\nDone! Students should now get Harry Potter starter on next page load.')
}

main().catch(e => { console.error(e); process.exit(1) })

/**
 * migrate-build-w4-sessiondata.mjs
 * Renames old Paper Fan session data keys (spins → spinCount, speedRating → rating)
 * so existing chart entries display correctly in the parent email after the resultFields patch.
 * Does NOT delete any data — only renames keys in session_data jsonb.
 *
 * Run AFTER patch-build-w4-resultfields.mjs
 * Run: cd ~/Documents/keenlearn_app && node scripts/migrate-build-w4-sessiondata.mjs
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

// Find W4 build content item IDs for both grade bands
const items = await sql`
  SELECT ci.id, ci.grade_band, ci.title
  FROM content_items ci
  JOIN curriculum_content cc ON cc.content_item_id = ci.id
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE ci.subject = 'build' AND c.week_number = 4
`

if (items.length === 0) {
  console.error('No W4 build items found'); await sql.end(); process.exit(1)
}

let total = 0
for (const item of items) {
  // Find sessions with old keys (spins or speedRating present)
  const sessions = await sql`
    SELECT id, session_data
    FROM student_sessions
    WHERE content_item_id = ${item.id}
      AND (session_data ? 'spins' OR session_data ? 'speedRating')
  `

  console.log(`\n${item.grade_band} "${item.title}": ${sessions.length} session(s) to migrate`)

  for (const sess of sessions) {
    const d = sess.session_data as Record<string, unknown>
    const updated: Record<string, unknown> = { ...d }

    // Rename spins → spinCount
    if ('spins' in updated) {
      updated.spinCount = updated.spins
      delete updated.spins
    }
    // Rename speedRating → rating
    if ('speedRating' in updated) {
      updated.rating = updated.speedRating
      delete updated.speedRating
    }

    await sql`
      UPDATE student_sessions SET session_data = ${updated} WHERE id = ${sess.id}
    `
    console.log(`  ✅ Session ${sess.id}: spins→spinCount, speedRating→rating`)
    total++
  }
}

console.log(`\nDone — migrated ${total} session(s). No data was deleted.`)
await sql.end()

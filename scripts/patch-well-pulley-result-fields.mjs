#!/usr/bin/env node
/**
 * patch-well-pulley-result-fields.mjs
 *
 * Updates the G3-4 Well Pulley (Week 1) content_items metadata:
 * changes resultFields from cranks → rocks without touching student session data.
 *
 * Run from the project root:
 *   node scripts/patch-well-pulley-result-fields.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

// Load DATABASE_URL from .env.local
try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
    if (m) process.env.DATABASE_URL = m[1]
  }
} catch {}

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL not found in .env.local')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const NEW_RESULT_FIELDS = {
  a:               { label: 'First attempt — rocks held',    key: 'cranksNoLoad'   },
  b:               { label: 'After adjustment — rocks held', key: 'cranksWithLoad' },
  c:               { label: 'Best rocks held 🏆',            key: 'cranksImproved' },
  unit:            'rocks',
  leaderboard:     'more',
  showLeaderboard: true,
}

async function main() {
  const items = await sql`
    SELECT id, metadata
    FROM content_items
    WHERE subject = 'build'
      AND grade_band = 'g3-4'
  `

  if (!items.length) {
    console.log('⚠️  No G3-4 build content items found.')
    await sql.end()
    return
  }

  let patched = 0
  for (const item of items) {
    const meta = item.metadata ?? {}
    if (meta.resultFields?.unit === 'cranks') {
      const newMeta = { ...meta, resultFields: NEW_RESULT_FIELDS }
      await sql`
        UPDATE content_items
        SET metadata = ${sql.json(newMeta)}
        WHERE id = ${item.id}
      `
      console.log(`✅  Patched content item ${item.id}`)
      patched++
    } else {
      console.log(`⏭️  Skipping ${item.id} (unit: ${meta.resultFields?.unit ?? 'unknown'})`)
    }
  }

  console.log(`\n✅  Done — ${patched} item(s) patched.`)
  await sql.end()
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })

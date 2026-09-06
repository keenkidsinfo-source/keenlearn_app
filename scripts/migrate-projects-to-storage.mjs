/**
 * migrate-projects-to-storage.mjs
 * Moves coding_projects.project_data blobs into Supabase Storage.
 * Safe to re-run — skips rows that already have r2_key set.
 *
 * Run: node scripts/migrate-projects-to-storage.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'
import { createClient } from '@supabase/supabase-js'

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
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const BUCKET = 'scratch-projects'

async function run() {
  // Fetch all rows that still have inline project_data
  const rows = await sql`
    SELECT id, project_data
    FROM coding_projects
    WHERE project_data IS NOT NULL
      AND r2_key IS NULL
    ORDER BY created_at
  `

  console.log(`Found ${rows.length} rows to migrate`)
  if (rows.length === 0) { await sql.end(); return }

  let ok = 0, failed = 0

  for (const row of rows) {
    const path = `projects/${row.id}.sb3`
    const bytes = Buffer.from(row.project_data, 'utf-8')

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: 'application/octet-stream', upsert: true })

    if (error) {
      console.error(`✗ ${row.id}: ${error.message}`)
      failed++
      continue
    }

    // Clear project_data, set r2_key
    await sql`
      UPDATE coding_projects
      SET r2_key = ${path}, project_data = NULL
      WHERE id = ${row.id}
    `
    console.log(`✓ ${row.id} → ${path}`)
    ok++
  }

  await sql.end()
  console.log(`\nDone: ${ok} migrated, ${failed} failed`)
  console.log('Run the SQL query again to verify project_data is now empty.')
}

run().catch(e => { console.error(e); process.exit(1) })

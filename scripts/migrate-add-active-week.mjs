/**
 * migrate-add-active-week.mjs
 * Adds active_week column to classrooms table.
 * Safe to run multiple times (uses IF NOT EXISTS).
 *
 * Run: node scripts/migrate-add-active-week.mjs
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

await sql`
  ALTER TABLE classrooms
  ADD COLUMN IF NOT EXISTS active_week integer
`
console.log('✅ active_week column added to classrooms (or already existed)')
await sql.end()

#!/usr/bin/env node
/**
 * Adds plain-text `pin` column to the users table.
 * Run once: cd /Users/anjanavenkat/Documents/keenlearn_app && node scripts/add-pin-column.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
    if (m) process.env.DATABASE_URL = m[1]
  }
} catch {}

if (!process.env.DATABASE_URL) { console.error('❌  DATABASE_URL not found'); process.exit(1) }

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

console.log('Adding pin column to users table...')
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS pin text`
console.log('✅ Done.')

await sql.end()

#!/usr/bin/env node
// Adds parent_name and parent_email columns to the users table.
// Run once from Mac Terminal:
//   node scripts/add-parent-fields.mjs

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i > 0) {
      let val = t.slice(i + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      process.env[t.slice(0, i).trim()] = val
    }
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  console.log('Adding parent_name and parent_email columns...')

  await sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS parent_name  text,
      ADD COLUMN IF NOT EXISTS parent_email text
  `

  console.log('✓ Done')
  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

#!/usr/bin/env node
// Adds parent_phone column to users table
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue
    const i = t.indexOf('='); if (i === -1) continue
    const k = t.slice(0, i).trim(), v = t.slice(i+1).trim().replace(/^["']|["']$/g,'')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_phone text`
  console.log('✓ parent_phone column added to users table')
  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

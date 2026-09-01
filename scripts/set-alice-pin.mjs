#!/usr/bin/env node
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
    if (m) process.env.DATABASE_URL = m[1]
  }
} catch {}

if (!process.env.DATABASE_URL) { console.error('❌  DATABASE_URL not found'); process.exit(1) }

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const pin = '1234'
const pinHash = await bcrypt.hash(pin, 10)

const result = await sql`
  UPDATE users SET pin = ${pin}, pin_hash = ${pinHash}
  WHERE name ILIKE 'alice'
    AND role = 'student'
    AND deleted_at IS NULL
  RETURNING name, display_name
`

if (result.length) {
  console.log(`✅ Updated: ${result[0].display_name ?? result[0].name} → PIN: ${pin}`)
} else {
  console.log('❌ No student named Alice found')
}

await sql.end()

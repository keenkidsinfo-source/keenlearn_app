#!/usr/bin/env node
/**
 * Lists all teacher accounts in the DB — approved and pending.
 * Run: node scripts/check-teachers.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  try {
    const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
    for (const line of lines) {
      const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
      if (m) process.env.DATABASE_URL = m[1]
    }
  } catch {}
}
if (!process.env.DATABASE_URL) { console.error('❌  DATABASE_URL not found'); process.exit(1) }

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', prepare: false })

const teachers = await sql`
  SELECT name, email, approved_at, created_at
  FROM users
  WHERE role = 'teacher'
  ORDER BY created_at DESC
`

console.log(`\n=== Teacher accounts (${teachers.length} total) ===\n`)
for (const t of teachers) {
  const status = t.approved_at ? `✅ approved ${new Date(t.approved_at).toLocaleDateString()}` : '⏳ PENDING'
  console.log(`  ${(t.name ?? '(no name)').padEnd(30)} ${(t.email ?? '(no email)').padEnd(35)} ${status}  (created ${new Date(t.created_at).toLocaleDateString()})`)
}

await sql.end()

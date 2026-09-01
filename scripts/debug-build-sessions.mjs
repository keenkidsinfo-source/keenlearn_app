#!/usr/bin/env node
/**
 * debug-build-sessions.mjs
 * Shows what's stored in student_sessions for build days — run from project root.
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

const rows = await sql`
  SELECT
    u.name,
    u.display_name,
    cl.grade_band,
    ss.completed,
    ss.session_data
  FROM student_sessions ss
  JOIN users u ON u.id = ss.student_id
  JOIN classrooms cl ON cl.id = u.classroom_id
  JOIN content_items ci ON ci.id = ss.content_item_id
  WHERE ci.subject = 'build'
  ORDER BY cl.grade_band, u.name
`

if (!rows.length) {
  console.log('⚠️  No build sessions found at all.')
} else {
  for (const r of rows) {
    const name = r.display_name ?? r.name
    const data = r.session_data ?? {}
    console.log(`\n${r.grade_band} | ${name}`)
    console.log(`  completed: ${r.completed}`)
    console.log(`  note: ${data.note ?? '(none)'}`)
    console.log(`  minRocks: ${data.minRocks ?? '(not set)'}`)
    console.log(`  maxRocks: ${data.maxRocks ?? '(not set)'}`)
    console.log(`  gradeBand in data: ${'gradeBand' in data}`)
    console.log(`  raw keys: ${Object.keys(data).join(', ')}`)
  }
}

await sql.end()

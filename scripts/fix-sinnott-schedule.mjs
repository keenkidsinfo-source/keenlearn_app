#!/usr/bin/env node
/**
 * fix-sinnott-schedule.mjs
 * Ensures Sinnott schedule is correct:
 *   Monday (1)  → Coding
 *   Tuesday (2) → Build
 *
 * Run: node scripts/fix-sinnott-schedule.mjs
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
    if (i > 0) {
      let val = t.slice(i + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
      if (!process.env[t.slice(0, i).trim()]) process.env[t.slice(0, i).trim()] = val
    }
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const [school] = await sql`SELECT id FROM schools WHERE slug = 'sinnott'`
if (!school) { console.error('Sinnott school not found'); process.exit(1) }

const before = await sql`
  SELECT day_of_week, subject FROM school_schedule
  WHERE school_id = ${school.id} ORDER BY day_of_week
`
console.log('\nBefore:')
before.forEach(r => console.log(`  Day ${r.day_of_week}: ${r.subject}`))

// Correct: Monday=Coding, Tuesday=Build, Thursday=Science
await sql`UPDATE school_schedule SET subject = 'coding'  WHERE school_id = ${school.id} AND day_of_week = 1`
await sql`UPDATE school_schedule SET subject = 'build'   WHERE school_id = ${school.id} AND day_of_week = 2`
await sql`UPDATE school_schedule SET subject = 'science' WHERE school_id = ${school.id} AND day_of_week = 4`

const after = await sql`
  SELECT day_of_week, subject FROM school_schedule
  WHERE school_id = ${school.id} ORDER BY day_of_week
`
console.log('\nAfter:')
after.forEach(r => console.log(`  Day ${r.day_of_week}: ${r.subject}`))

await sql.end()
console.log('\n✅ Sinnott schedule correct — Monday=Coding, Tuesday=Build, Thursday=Science')

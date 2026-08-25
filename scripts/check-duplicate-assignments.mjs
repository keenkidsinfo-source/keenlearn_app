#!/usr/bin/env node
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
  // Check classroom_curriculum for duplicates
  console.log('\n── classroom_curriculum rows ──')
  const ccl = await sql`
    SELECT cl.name, cl.grade_band, c.week_number, ccl.id, ccl.week_start_date
    FROM classroom_curriculum ccl
    JOIN classrooms cl ON cl.id = ccl.classroom_id
    JOIN curriculum c ON c.id = ccl.curriculum_id
    ORDER BY cl.name, c.week_number
  `
  for (const r of ccl) console.log(`  ${r.name} (${r.grade_band}) W${r.week_number} | start: ${r.week_start_date} | ccl_id: ${r.id}`)

  // Check curriculum_days for duplicate coding content per week
  console.log('\n── curriculum_days with coding content ──')
  const days = await sql`
    SELECT c.week_number, c.grade_band, cd.id as day_id, cd.day_number,
           ci.id as content_id, ci.subject, ci.title
    FROM curriculum c
    JOIN curriculum_days cd ON cd.curriculum_id = c.id
    JOIN curriculum_content cc ON cc.curriculum_day_id = cd.id
    JOIN content_items ci ON ci.id = cc.content_item_id
    WHERE ci.subject = 'coding'
    ORDER BY c.grade_band, c.week_number, cd.day_number
  `
  for (const r of days) console.log(`  ${r.grade_band} W${r.week_number} Day${r.day_number} | ${r.subject} | "${r.title}" | day_id: ${r.day_id}`)

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

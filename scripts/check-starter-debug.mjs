#!/usr/bin/env node
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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  // Check what starterUrl is in the DB for G1-2 W1
  const items = await sql`
    SELECT ci.id, ci.title, ci.grade_band,
           ci.metadata->>'starterUrl' as starter_url,
           c.week_number
    FROM content_items ci
    JOIN curriculum_content cc ON cc.content_item_id = ci.id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE ci.subject = 'coding' AND ci.grade_band = 'g1-2' AND c.week_number = 1
    ORDER BY ci.created_at DESC
  `
  console.log('\n── G1-2 W1 coding content items ──')
  for (const r of items) {
    console.log(`  id: ${r.id}`)
    console.log(`  title: ${r.title}`)
    console.log(`  starterUrl: ${r.starter_url ?? '⚠ MISSING (null)'}`)
    console.log()
  }

  // Check for any existing coding projects for G1-2 W1
  const projects = await sql`
    SELECT cp.id, cp.student_id, cp.created_at,
           length(cp.project_data::text) as data_size
    FROM coding_projects cp
    JOIN curriculum_content cc ON cc.id = cp.curriculum_content_id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    JOIN content_items ci ON ci.id = cc.content_item_id
    WHERE ci.grade_band = 'g1-2' AND c.week_number = 1
    ORDER BY cp.created_at DESC
    LIMIT 10
  `
  console.log(`── Existing G1-2 W1 coding projects (${projects.length} found) ──`)
  for (const p of projects) {
    console.log(`  student: ${p.student_id} | created: ${p.created_at?.toISOString?.()?.slice(0,16)} | data size: ${p.data_size} bytes`)
  }

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

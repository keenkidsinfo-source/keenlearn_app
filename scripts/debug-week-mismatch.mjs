#!/usr/bin/env node
/**
 * debug-week-mismatch.mjs
 * Shows which week's curriculum each build session is stored under,
 * vs what the teacher dashboard would look at for today's week.
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

// 1. Show all classroom curriculum assignments
console.log('\n=== Classroom Curriculum Assignments ===')
const assignments = await sql`
  SELECT
    cl.name         AS classroom,
    cl.grade_band,
    cc.week_start_date,
    cur.title       AS curriculum_title,
    cur.id          AS curriculum_id
  FROM classroom_curriculum cc
  JOIN classrooms cl ON cl.id = cc.classroom_id
  JOIN curriculum cur ON cur.id = cc.curriculum_id
  ORDER BY cl.grade_band, cc.week_start_date
`
for (const a of assignments) {
  console.log(`  ${a.grade_band} | ${a.classroom} | week: ${a.week_start_date} | ${a.curriculum_title} (${a.curriculum_id.slice(0,8)}...)`)
}

// 2. Show which content item IDs belong to each curriculum's build day
console.log('\n=== Build Content Items per Curriculum ===')
const buildItems = await sql`
  SELECT
    cur.title AS curriculum,
    cc.week_start_date,
    ci.id   AS content_item_id,
    ci.title AS item_title,
    ci.grade_band AS item_grade
  FROM curriculum_days cd
  JOIN curriculum_content cc_c ON cc_c.curriculum_day_id = cd.id
  JOIN content_items ci ON ci.id = cc_c.content_item_id
  JOIN classroom_curriculum cc ON cc.curriculum_id = cd.curriculum_id
  WHERE cd.subject = 'build'
  ORDER BY cc.week_start_date, ci.grade_band
`
for (const b of buildItems) {
  console.log(`  week ${b.week_start_date} | ${b.curriculum} | content_item: ${b.content_item_id.slice(0,8)}... | ${b.item_title} (${b.item_grade})`)
}

// 3. Show which content_item_id each build session is stored under, for students with notes
console.log('\n=== Build Sessions with Notes → which content_item_id? ===')
const sessions = await sql`
  SELECT
    u.name,
    ss.content_item_id,
    ss.session_data->>'note' AS note,
    cc.week_start_date
  FROM student_sessions ss
  JOIN users u ON u.id = ss.student_id
  JOIN content_items ci ON ci.id = ss.content_item_id
  -- find which classroom_curriculum this content_item belongs to
  LEFT JOIN curriculum_content cc_c ON cc_c.content_item_id = ss.content_item_id
  LEFT JOIN curriculum_days cd ON cd.id = cc_c.curriculum_day_id AND cd.subject = 'build'
  LEFT JOIN classroom_curriculum cc ON cc.curriculum_id = cd.curriculum_id AND cc.classroom_id = u.classroom_id
  WHERE ci.subject = 'build'
    AND ss.session_data->>'note' IS NOT NULL
    AND ss.session_data->>'note' != ''
  ORDER BY u.name
`
for (const s of sessions) {
  console.log(`  ${s.name} | content_item: ${s.content_item_id.slice(0,8)}... | week: ${s.week_start_date ?? '(no matching assignment)'} | note: "${s.note}"`)
}

await sql.end()

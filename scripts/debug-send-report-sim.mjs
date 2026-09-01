#!/usr/bin/env node
/**
 * Simulates exactly what send-report does when finding build sessions.
 * Run: cd /Users/anjanavenkat/Documents/keenlearn_app && node scripts/debug-send-report-sim.mjs
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

// Step 1: Get all classrooms
const classrooms = await sql`SELECT id, name, grade_band FROM classrooms ORDER BY grade_band`
console.log('\n=== Classrooms ===')
for (const c of classrooms) console.log(`  ${c.grade_band} | ${c.name} | ${c.id}`)

// Step 2: For each classroom, simulate send-report for '2026-08-31'
const weekStartDate = '2026-08-31'
console.log(`\n=== Simulating send-report for weekStartDate = '${weekStartDate}' ===`)

for (const classroom of classrooms) {
  console.log(`\n--- Classroom: ${classroom.name} (${classroom.grade_band}) ---`)

  // Step 2a: Find week's curriculum
  const [weekRow] = await sql`
    SELECT cc.curriculum_id, cur.title
    FROM classroom_curriculum cc
    JOIN curriculum cur ON cur.id = cc.curriculum_id
    WHERE cc.classroom_id = ${classroom.id}
      AND cc.week_start_date::text LIKE ${weekStartDate + '%'}
    LIMIT 1
  `
  if (!weekRow) { console.log('  ❌ No curriculum for this week'); continue }
  console.log(`  ✅ Curriculum: "${weekRow.title}" (${weekRow.curriculum_id.slice(0,8)}...)`)

  // Step 2b: Get content items for the week
  const dayItems = await sql`
    SELECT cd.subject, cc_c.content_item_id, ci.title AS item_title
    FROM curriculum_days cd
    JOIN curriculum_content cc_c ON cc_c.curriculum_day_id = cd.id
    JOIN content_items ci ON ci.id = cc_c.content_item_id
    WHERE cd.curriculum_id = ${weekRow.curriculum_id}
  `
  console.log(`  Content items (${dayItems.length}):`)
  for (const d of dayItems) {
    console.log(`    ${d.subject}: ${d.content_item_id.slice(0,8)}... "${d.item_title}"`)
  }

  const buildItems = dayItems.filter(d => d.subject === 'build')
  if (!buildItems.length) { console.log('  ❌ No build content item!'); continue }

  const contentItemIds = dayItems.map(d => d.content_item_id)

  // Step 2c: Get students
  const students = await sql`
    SELECT id, name, display_name, parent_email
    FROM users
    WHERE classroom_id = ${classroom.id} AND role = 'student' AND deleted_at IS NULL
    ORDER BY name
  `
  console.log(`  Students: ${students.length}`)
  if (!students.length) continue

  const studentIds = students.map(s => s.id)

  // Step 2d: Load sessions (exactly as send-report does)
  const sessions = await sql`
    SELECT student_id, content_item_id, completed, session_data
    FROM student_sessions
    WHERE student_id = ANY(${studentIds}::uuid[])
      AND content_item_id = ANY(${contentItemIds}::uuid[])
  `
  console.log(`  Sessions found: ${sessions.length}`)

  // Step 2e: Show build sessions specifically
  const buildItemIds = buildItems.map(d => d.content_item_id)
  const buildSessions = sessions.filter(s => buildItemIds.includes(s.content_item_id))
  console.log(`  Build sessions found: ${buildSessions.length}`)

  for (const bs of buildSessions) {
    const student = students.find(s => s.id === bs.student_id)
    const name = student?.display_name ?? student?.name ?? bs.student_id
    const data = bs.session_data ?? {}
    const note = data.note ?? '(none)'
    const hasGradeBand = 'gradeBand' in data
    console.log(`    ${name}: completed=${bs.completed}, gradeBand=${hasGradeBand}, note="${note}"`)
  }

  // Step 2f: Show which students have NO build session at all
  const studentsWithBuildSessions = new Set(buildSessions.map(s => s.student_id))
  const missing = students.filter(s => !studentsWithBuildSessions.has(s.id))
  if (missing.length) {
    console.log(`  Students with no build session: ${missing.map(s => s.display_name ?? s.name).join(', ')}`)
  }
}

// Step 3: Cross-check — what content_item_id are the note sessions stored under?
console.log('\n=== Build sessions WITH notes: stored content_item_id ===')
const noteSessions = await sql`
  SELECT
    u.name,
    u.display_name,
    cl.name AS classroom,
    ss.content_item_id,
    ss.session_data->>'note' AS note
  FROM student_sessions ss
  JOIN users u ON u.id = ss.student_id
  JOIN classrooms cl ON cl.id = u.classroom_id
  JOIN content_items ci ON ci.id = ss.content_item_id
  WHERE ci.subject = 'build'
    AND ss.session_data->>'note' IS NOT NULL
    AND ss.session_data->>'note' != ''
  ORDER BY cl.grade_band, u.name
`
for (const s of noteSessions) {
  console.log(`  ${s.classroom} | ${s.display_name ?? s.name}: content_item ${s.content_item_id.slice(0,8)}... | note: "${s.note}"`)
}

await sql.end()

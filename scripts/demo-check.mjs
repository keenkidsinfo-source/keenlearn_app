#!/usr/bin/env node
/**
 * demo-check.mjs — Pre-demo readiness checker
 * Run: node scripts/demo-check.mjs
 *
 * Checks: teachers, classrooms, classroom_teachers, Week 1 build content,
 * speaking content, curriculum assignments for Aug 17-22 week.
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
let issues = 0

function ok(msg)   { console.log(`  ✅ ${msg}`) }
function warn(msg) { console.log(`  ⚠️  ${msg}`); issues++ }
function info(msg) { console.log(`  ℹ️  ${msg}`) }

// ── 1. Teacher accounts ────────────────────────────────────────────────────
console.log('\n── 1. Teacher accounts ──────────────────────────────────────────')
const teachers = await sql`
  SELECT id, name, email, approved_at, classroom_id
  FROM users
  WHERE role = 'teacher'
  ORDER BY name
`
if (teachers.length === 0) {
  warn('No teacher accounts found!')
} else {
  for (const t of teachers) {
    if (!t.approved_at) {
      warn(`${t.email} — NOT APPROVED (pending) → go to /admin and approve!`)
    } else {
      ok(`${t.email} — approved`)
    }
  }
}

// ── 2. Classrooms ─────────────────────────────────────────────────────────
console.log('\n── 2. Classrooms ────────────────────────────────────────────────')
const classrooms = await sql`
  SELECT id, name, grade_band, grade_level, access_code
  FROM classrooms ORDER BY grade_band, name
`
if (classrooms.length === 0) {
  warn('No classrooms found!')
} else {
  for (const c of classrooms) {
    ok(`${c.name} (${c.grade_band}) · code: ${c.access_code}`)
  }
}

// ── 3. classroom_teachers junction ──────────────────────────────────────
console.log('\n── 3. Classroom ↔ Teacher assignments (classroom_teachers) ─────')
const ct = await sql`
  SELECT cl.name as classroom, cl.grade_band, u.email, ct.is_primary
  FROM classroom_teachers ct
  JOIN classrooms cl ON cl.id = ct.classroom_id
  JOIN users u ON u.id = ct.teacher_id
  ORDER BY cl.name, ct.is_primary DESC
`
if (ct.length === 0) {
  warn('classroom_teachers table is EMPTY — no teachers are assigned to any classroom!')
  warn('Fix: go to /admin, find each classroom, assign teachers. Or run: node scripts/add-classroom-teachers.mjs')
} else {
  for (const r of ct) {
    ok(`${r.classroom} (${r.grade_band}) ← ${r.email}${r.is_primary ? ' [primary]' : ''}`)
  }
  // Check each classroom has at least 1 teacher
  for (const c of classrooms) {
    const assigned = ct.filter(r => r.classroom === c.name)
    if (assigned.length === 0) warn(`${c.name} has NO teacher assigned!`)
    else if (assigned.length === 1) info(`${c.name} has 1 teacher (${assigned[0].email})`)
    else ok(`${c.name} has ${assigned.length} teachers (co-teaching ✓)`)
  }
}

// ── 4. Students per classroom ──────────────────────────────────────────
console.log('\n── 4. Students per classroom ────────────────────────────────────')
for (const c of classrooms) {
  const students = await sql`
    SELECT COUNT(*) as cnt FROM users
    WHERE classroom_id = ${c.id} AND role = 'student' AND deleted_at IS NULL
  `
  const cnt = Number(students[0].cnt)
  if (cnt === 0) warn(`${c.name} has 0 students! Add students at /admin or teacher dashboard.`)
  else ok(`${c.name}: ${cnt} students`)
}

// ── 5. Curriculum for Week 1 (Aug 17) ──────────────────────────────────
console.log('\n── 5. Week 1 curriculum (Aug 17–21) ─────────────────────────────')
const weekAssign = await sql`
  SELECT cl.name as classroom, cl.grade_band, c.title, c.week_number, cc.week_start_date
  FROM classroom_curriculum cc
  JOIN classrooms cl ON cl.id = cc.classroom_id
  JOIN curriculum c ON c.id = cc.curriculum_id
  WHERE cc.week_start_date = '2026-08-17'
  ORDER BY cl.grade_band, cl.name
`
if (weekAssign.length === 0) {
  warn('No classroom has curriculum assigned for the week of Aug 17!')
  warn('Fix: go to /admin → Classrooms → Assign Curriculum for each classroom.')
} else {
  for (const r of weekAssign) {
    ok(`${r.classroom} (${r.grade_band}) → "${r.title}" (W${r.week_number})`)
  }
}

// ── 6. Build content ─────────────────────────────────────────────────────
console.log('\n── 6. Build content (Cable Car + Well Pulley) ────────────────────')
const buildItems = await sql`
  SELECT ci.title, ci.grade_band, ci.step_count, c.week_number
  FROM curriculum_content cc
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  JOIN content_items ci ON ci.id = cc.content_item_id
  WHERE cd.subject = 'build' AND c.week_number = 1
  ORDER BY ci.grade_band
`
if (buildItems.length === 0) {
  warn('No build content found for Week 1! Run: node scripts/seed-build-w1.mjs')
} else {
  for (const b of buildItems) {
    if (b.step_count > 0) ok(`${b.grade_band} Build: "${b.title}" (${b.step_count} steps)`)
    else warn(`${b.grade_band} Build: "${b.title}" has 0 steps — re-run seed-build-w1.mjs`)
  }
}

// ── 7. Speaking content ──────────────────────────────────────────────────
console.log('\n── 7. Speaking content (Week 1) ──────────────────────────────────')
const speakItems = await sql`
  SELECT ci.title, ci.grade_band, c.week_number
  FROM curriculum_content cc
  JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  JOIN content_items ci ON ci.id = cc.content_item_id
  WHERE cd.subject = 'public_speaking' AND c.week_number = 1
  ORDER BY ci.grade_band
`
if (speakItems.length === 0) {
  warn('No speaking content for Week 1! Run: node scripts/seed-speakup.mjs')
} else {
  for (const s of speakItems) ok(`${s.grade_band} Speaking W1: "${s.title}"`)
}

// ── Summary ──────────────────────────────────────────────────────────────
console.log('\n── Summary ──────────────────────────────────────────────────────')
if (issues === 0) {
  console.log('  🎉 ALL CHECKS PASSED — you are good for the demo!\n')
} else {
  console.log(`  ❌ ${issues} issue(s) found — see ⚠️ lines above for fixes.\n`)
}

await sql.end()

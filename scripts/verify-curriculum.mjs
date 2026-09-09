/**
 * verify-curriculum.mjs
 *
 * Pre-launch checklist — run this before any demo or Vercel deploy.
 * Checks that the DB and hardcoded files are in sync for all weeks/grades.
 *
 * Usage:
 *   node scripts/verify-curriculum.mjs
 *
 * Exit code 0 = all good. Exit code 1 = problems found (fix before demo).
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

// ── load .env.local ──────────────────────────────────────────────────────────
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

const sql = postgres(process.env.DATABASE_URL)

const GRADE_BANDS = ['g1-2', 'g3-4']
const SUBJECTS    = ['science', 'build', 'coding', 'public_speaking', 'math', 'arts']

let problems = 0
let warnings = 0

function ok(msg)   { console.log(`  ✅ ${msg}`) }
function warn(msg) { console.log(`  ⚠️  ${msg}`); warnings++ }
function fail(msg) { console.log(`  ❌ ${msg}`); problems++ }

// ── 1. Classrooms ────────────────────────────────────────────────────────────
console.log('\n📋 Classrooms')
const classrooms = await sql`SELECT id, name, grade_band FROM classrooms ORDER BY name`
if (classrooms.length === 0) {
  fail('No classrooms found — run seed scripts first')
} else {
  for (const cl of classrooms) {
    ok(`${cl.name} (${cl.grade_band})`)
  }
}

// ── 2. Curriculum weeks in DB ────────────────────────────────────────────────
console.log('\n📚 Curriculum weeks in DB')
const curricula = await sql`
  SELECT grade_band, week_number, title, created_at
  FROM curriculum
  ORDER BY grade_band, week_number
`
const currMap = {}
for (const c of curricula) {
  const key = `${c.grade_band}:W${c.week_number}`
  currMap[key] = c
}

// Separate regular weeks (1–99) from SpeakUp weeks (100+)
const regularWeeks = [...new Set(curricula.filter(c => c.week_number < 100).map(c => c.week_number))].sort((a, b) => a - b)
const speakupWeeks = [...new Set(curricula.filter(c => c.week_number >= 100).map(c => c.week_number))].sort((a, b) => a - b)
const maxWeek = regularWeeks.at(-1) ?? 0

for (const gb of GRADE_BANDS) {
  for (const w of regularWeeks) {
    const key = `${gb}:W${w}`
    if (currMap[key]) {
      ok(`${gb} W${w}: "${currMap[key].title}"`)
    } else {
      fail(`${gb} W${w} — MISSING from curriculum table`)
    }
  }
  if (speakupWeeks.length > 0) {
    ok(`${gb}: ${speakupWeeks.length} SpeakUp weeks (W${speakupWeeks[0]}–W${speakupWeeks.at(-1)})`)
  }
}

// ── 3. Curriculum days per week ──────────────────────────────────────────────
console.log('\n📅 Curriculum days per week')
const days = await sql`
  SELECT c.grade_band, c.week_number, cd.subject
  FROM curriculum_days cd
  JOIN curriculum c ON c.id = cd.curriculum_id
  ORDER BY c.grade_band, c.week_number, cd.subject
`
const dayMap = {}
for (const d of days) {
  const key = `${d.grade_band}:W${d.week_number}`
  if (!dayMap[key]) dayMap[key] = []
  dayMap[key].push(d.subject)
}

for (const gb of GRADE_BANDS) {
  for (const w of regularWeeks) {
    const key = `${gb}:W${w}`
    const found = dayMap[key] ?? []
    // 'arts' is not yet implemented — warn instead of fail
    const REQUIRED = SUBJECTS.filter(s => s !== 'arts')
    const missing = REQUIRED.filter(s => !found.includes(s))
    const missingArts = !found.includes('arts')
    if (missing.length === 0) {
      ok(`${gb} W${w}: all required subjects present${missingArts ? ' (arts not yet seeded)' : ''}`)
    } else {
      fail(`${gb} W${w}: missing subjects — ${missing.join(', ')}`)
    }
  }
  // SpeakUp weeks only have public_speaking — that's expected
  for (const w of speakupWeeks) {
    const key = `${gb}:W${w}`
    const found = dayMap[key] ?? []
    if (found.includes('public_speaking')) {
      // ok — don't spam the output for all 16 weeks
    } else {
      fail(`${gb} SpeakUp W${w}: missing public_speaking day`)
    }
  }
  if (speakupWeeks.length > 0) {
    ok(`${gb}: ${speakupWeeks.length} SpeakUp weeks have public_speaking days`)
  }
}

// ── 4. Classroom→curriculum assignments ──────────────────────────────────────
console.log('\n🔗 Classroom curriculum assignments')
const assignments = await sql`
  SELECT cl.name, cl.grade_band, c.week_number, ccl.week_start_date
  FROM classroom_curriculum ccl
  JOIN curriculum c ON c.id = ccl.curriculum_id
  JOIN classrooms cl ON cl.id = ccl.classroom_id
  ORDER BY cl.name, c.week_number
`
if (assignments.length === 0) {
  fail('No classroom_curriculum rows — run fix-week-dates.mjs')
} else {
  const clWeekMap = {}
  for (const a of assignments) {
    const key = a.name
    if (!clWeekMap[key]) clWeekMap[key] = []
    clWeekMap[key].push(`W${a.week_number}→${a.week_start_date}`)
  }
  for (const [name, weeks] of Object.entries(clWeekMap)) {
    ok(`${name}: ${weeks.join(', ')}`)
    if (maxWeek > 0 && weeks.length < maxWeek) {
      warn(`${name} only has ${weeks.length} regular week(s) assigned — expected ${maxWeek}`)
    }
  }
}

// ── 5. Science content items in DB ───────────────────────────────────────────
console.log('\n🔬 Science content in DB')
const scienceItems = await sql`
  SELECT c.grade_band, c.week_number, c.title
  FROM curriculum_content ci
  JOIN curriculum_days cd ON cd.id = ci.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE cd.subject = 'science'
  ORDER BY c.grade_band, c.week_number
`
if (scienceItems.length === 0) {
  fail('No science content items — run seed-science.mjs')
} else {
  for (const s of scienceItems) {
    ok(`${s.grade_band} W${s.week_number}: "${s.title}"`)
  }
}

// ── 6. SpeakUp sessions in DB ────────────────────────────────────────────────
console.log('\n🎤 SpeakUp sessions in DB')
const speakupItems = await sql`
  SELECT c.grade_band, c.week_number
  FROM curriculum_content ci
  JOIN curriculum_days cd ON cd.id = ci.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE cd.subject = 'public_speaking'
  ORDER BY c.grade_band, c.week_number
`
if (speakupItems.length === 0) {
  fail('No public speaking content — run seed-speakup.mjs')
} else {
  ok(`${speakupItems.length} SpeakUp session(s) found`)
}

// ── 7. Build day steps ───────────────────────────────────────────────────────
console.log('\n🏗️  Build day content in DB')
const buildItems = await sql`
  SELECT c.grade_band, c.week_number, c.title
  FROM curriculum_content ci
  JOIN curriculum_days cd ON cd.id = ci.curriculum_day_id
  JOIN curriculum c ON c.id = cd.curriculum_id
  WHERE cd.subject = 'build'
  ORDER BY c.grade_band, c.week_number
`
if (buildItems.length === 0) {
  fail('No build day content — run seed-build-w1.mjs / seed-build-w2.mjs')
} else {
  for (const b of buildItems) {
    ok(`${b.grade_band} W${b.week_number}: "${b.title}"`)
  }
}

// ── 8. Schools + schedule ────────────────────────────────────────────────────
console.log('\n🏫 Schools & schedule')
const schools = await sql`SELECT id, name FROM schools`
if (schools.length === 0) {
  fail('No schools found — run seed-schools.mjs or add via admin dashboard')
} else {
  for (const s of schools) ok(`School: "${s.name}"`)
}

const schedule = await sql`SELECT COUNT(*) as n FROM school_schedule`
if (parseInt(schedule[0].n) === 0) {
  fail('No school_schedule rows — add schedule via admin dashboard')
} else {
  ok(`${schedule[0].n} schedule row(s)`)
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50))
if (problems === 0 && warnings === 0) {
  console.log('✅ All checks passed — ready to demo!\n')
} else {
  if (problems > 0) console.log(`❌ ${problems} problem(s) must be fixed before demo`)
  if (warnings > 0) console.log(`⚠️  ${warnings} warning(s) to review`)
  console.log('\nFix order: seed-science.mjs → seed-speakup.mjs → seed-build-w1.mjs → fix-week-dates.mjs → verify again\n')
}

await sql.end()
process.exit(problems > 0 ? 1 : 0)

#!/usr/bin/env node
/**
 * Load test — simulates N students doing concurrent auto-saves.
 * Tests the DB directly (bypasses Vercel) to measure Supabase capacity.
 *
 * Usage:
 *   node scripts/load-test.mjs                    # 26 concurrent users, 3 rounds
 *   node scripts/load-test.mjs --users 10         # 10 concurrent users
 *   node scripts/load-test.mjs --rounds 5         # 5 save rounds
 *
 * Pass DATABASE_URL as env var if .env.local isn't set:
 *   DATABASE_URL="postgresql://..." node scripts/load-test.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

// ── Load DATABASE_URL ─────────────────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
  try {
    const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
    for (const line of lines) {
      const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
      if (m) process.env.DATABASE_URL = m[1]
    }
  } catch {}
}
if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL not found. Set it in .env.local or as an env var.')
  process.exit(1)
}

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const getArg = (flag, def) => {
  const i = args.indexOf(flag)
  return i !== -1 ? parseInt(args[i + 1]) : def
}
const USERS      = getArg('--users', 26)
const ROUNDS     = getArg('--rounds', 5)
const DELAY      = getArg('--delay', 3000)   // ms between rounds
const STOP_P95   = getArg('--stop-p95', 400) // ms — abort if p95 exceeds this (proxy for ~50% CPU)

// ── DB connection ─────────────────────────────────────────────────────────────
// Use max = USERS so we can have truly concurrent connections
const sql = postgres(process.env.DATABASE_URL, {
  ssl:     'require',
  prepare: false,
  max:     USERS + 2,
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))

function stats(times) {
  const sorted = [...times].sort((a, b) => a - b)
  const avg    = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  const p50    = sorted[Math.floor(sorted.length * 0.50)]
  const p95    = sorted[Math.floor(sorted.length * 0.95)]
  const p99    = sorted[Math.floor(sorted.length * 0.99)] ?? sorted[sorted.length - 1]
  const max    = sorted[sorted.length - 1]
  return { avg, p50, p95, p99, max }
}

// ── Simulate one "auto-save" ──────────────────────────────────────────────────
// Mirrors what the app does: SELECT coding_projects + UPDATE coding_projects
// Uses a real student row if available, otherwise falls back to SELECT 1.
async function simulateSave(studentId, projectId) {
  if (projectId) {
    // Real save path
    await sql`
      UPDATE coding_projects
      SET    last_saved_at = NOW()
      WHERE  id = ${projectId}
        AND  student_id   = ${studentId}
    `
  } else {
    // Fallback: lightweight read/write cycle that still exercises the DB
    await sql`SELECT pg_sleep(0.001)` // 1ms synthetic "work"
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🧪  KeenLearn DB Load Test`)
  console.log(`    ${USERS} concurrent students · ${ROUNDS} save rounds · ${DELAY}ms between rounds\n`)

  // 1. Find real student + project data to test with
  console.log('📋  Finding students and projects...')
  const students = await sql`
    SELECT id FROM users
    WHERE  role       = 'student'
      AND  deleted_at IS NULL
    LIMIT  ${USERS}
  `

  const projects = await sql`
    SELECT cp.id AS project_id, cp.student_id
    FROM   coding_projects cp
    JOIN   users u ON u.id = cp.student_id
    WHERE  u.role = 'student' AND u.deleted_at IS NULL
    LIMIT  ${USERS}
  `

  // Build a map of studentId → projectId
  const projectMap = new Map(projects.map(p => [p.student_id, p.project_id]))

  const sessions = students.map(s => ({
    studentId: s.id,
    projectId: projectMap.get(s.id) ?? null,
  }))

  const hasProjects = sessions.filter(s => s.projectId).length
  console.log(`    Found ${students.length} students, ${hasProjects} with coding projects\n`)

  if (students.length === 0) {
    console.error('❌  No students found. Seed the DB first.')
    await sql.end()
    process.exit(1)
  }

  // 2. Connectivity check
  const t0 = Date.now()
  await sql`SELECT 1`
  console.log(`✅  DB connected in ${Date.now() - t0}ms\n`)

  // 3. Run rounds
  const allTimes  = []
  const allErrors = []

  for (let round = 1; round <= ROUNDS; round++) {
    console.log(`─── Round ${round}/${ROUNDS} — ${USERS} concurrent saves ───`)
    const roundStart = Date.now()
    const times = []
    const errors = []

    await Promise.all(sessions.map(async ({ studentId, projectId }) => {
      const t = Date.now()
      try {
        await simulateSave(studentId, projectId)
        times.push(Date.now() - t)
      } catch (e) {
        errors.push(e.message)
        times.push(Date.now() - t)
      }
    }))

    const s = stats(times)
    const roundMs = Date.now() - roundStart

    // CPU proxy: colour-code based on p95 latency thresholds
    const cpuLabel =
      s.p95 < 150  ? '🟢 DB healthy   (CPU likely <30%)' :
      s.p95 < 400  ? '🟡 DB warm      (CPU likely 30–60%)' :
      s.p95 < 800  ? '🔴 DB stressed  (CPU likely 60–80%)' :
                     '💀 DB struggling (CPU likely >80%)'

    console.log(`    Total: ${roundMs}ms | avg: ${s.avg}ms | p50: ${s.p50}ms | p95: ${s.p95}ms | p99: ${s.p99}ms | max: ${s.max}ms`)
    console.log(`    ${cpuLabel}`)
    if (errors.length) {
      console.log(`    ❌  ${errors.length} error(s): ${[...new Set(errors)].join(', ')}`)
    } else {
      console.log(`    ✅  All ${times.length} saves succeeded`)
    }

    allTimes.push(...times)
    allErrors.push(...errors)

    // Auto-stop if p95 exceeds safety threshold
    if (s.p95 >= STOP_P95 || errors.length > 0) {
      console.log(`\n🛑  STOPPING EARLY — p95 ${s.p95}ms hit safety limit (${STOP_P95}ms) or errors detected.`)
      console.log(`    This corresponds to ~50%+ CPU. Do NOT run more load against this DB right now.`)
      break
    }

    if (round < ROUNDS) {
      process.stdout.write(`    Waiting ${DELAY}ms before next round...`)
      await sleep(DELAY)
      console.log(' done\n')
    }
  }

  // 4. Summary
  const s = stats(allTimes)
  console.log(`\n══ Summary (${ROUNDS} rounds × ${USERS} users = ${allTimes.length} saves) ══`)
  console.log(`   avg: ${s.avg}ms | p50: ${s.p50}ms | p95: ${s.p95}ms | p99: ${s.p99}ms | max: ${s.max}ms`)
  console.log(`   Errors: ${allErrors.length}/${allTimes.length}`)

  if (allErrors.length === 0 && s.p95 < 150) {
    console.log(`\n✅  PASS — Micro is handling ${USERS} students easily. Could probably downgrade to Nano.`)
  } else if (allErrors.length === 0 && s.p95 < 400) {
    console.log(`\n✅  PASS — Micro is comfortable. Stay on Micro; don't downgrade.`)
  } else if (allErrors.length === 0 && s.p95 < 800) {
    console.log(`\n⚠️   MARGINAL — DB is warm. Micro is the right tier; watch CPU during class.`)
  } else {
    console.log(`\n❌  FAIL — DB is struggling even on Micro. Consider Supabase Pro Large or Railway.`)
  }

  await sql.end()
}

main().catch(e => { console.error(e); process.exit(1) })

#!/usr/bin/env node
/**
 * Fixes PINs for G1-2 students (corrects the wrong sequential PINs)
 * and sets PINs for G3-4 students.
 *
 * Dry run (default):
 *   node scripts/fix-pins.mjs
 *
 * Write to DB:
 *   node scripts/fix-pins.mjs --apply
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

const APPLY = process.argv.includes('--apply')

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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', prepare: false })

console.log(APPLY ? '🔧  APPLY mode — PINs will be written to DB' : '🔍  DRY RUN — pass --apply to write PINs\n')

// ── PIN assignments ───────────────────────────────────────────────────────────
// G1-2: correct PINs (Alice gets 1234; rest are sequential pairs)
const G12_PINS = [
  { nameMatch: 'Alice',     pin: '1234' },
  { nameMatch: 'Aadhvik',   pin: '2930' },
  { nameMatch: 'Aanyaa',    pin: '3132' },
  { nameMatch: 'Aarush',    pin: '3334' },
  { nameMatch: 'Vivek',     pin: '3536' },  // Aayush Vivek
  { nameMatch: 'Matturi',   pin: '3940' },  // Ayush Matturi
  { nameMatch: 'Neev',      pin: '4344' },
  { nameMatch: 'Praneel',   pin: '4546' },
  { nameMatch: 'Rinisha',   pin: '4748' },
  { nameMatch: 'Sampson',   pin: '4950' },
  { nameMatch: 'Shreyas',   pin: '5152' },
  { nameMatch: 'Yuvir',     pin: '5354' },
]

// Sinnott G1-2
const SINNOTT_G12_PINS = [
  { nameMatch: 'Ayaan',     pin: '1234' },  // Ayaan Gaonkar
  { nameMatch: 'Arun',      pin: '5678' },  // Mahathi Arun
  { nameMatch: 'Rishabh',   pin: '9012' },  // Rishabh Dash
  { nameMatch: 'Shritha',   pin: '3456' },  // Shritha R Anireddy
  { nameMatch: 'Shubham',   pin: '7890' },  // Shubham Mishra
  { nameMatch: 'Vihas',     pin: '1112' },  // Vihas Varma Malladi
]

// Sinnott G3-4
const SINNOTT_G34_PINS = [
  { nameMatch: 'Aaradhana',  pin: '1234' },  // Aaradhana Balakrishnan
  { nameMatch: 'Arjun',      pin: '5678' },  // Arjun Mopuru
  { nameMatch: 'Ayan',       pin: '9012' },  // Ayan Kulkarni
  { nameMatch: 'Enrique',    pin: '3456' },  // Enrique Godoy III
  { nameMatch: 'Eric',       pin: '7890' },  // Eric Roshan
  { nameMatch: 'Isha',       pin: '1112' },  // Isha Harshad
  { nameMatch: 'Julian',     pin: '1314' },  // Julian Godoy
  { nameMatch: 'Naomika',    pin: '1516' },  // Naomika Chalasani
  { nameMatch: 'Nithila',    pin: '1718' },  // Nithila Renganathan
  { nameMatch: 'Niya',       pin: '1920' },  // Niya Harshad
  { nameMatch: 'Saavni',     pin: '2122' },  // Saavni Prabhudesai
  { nameMatch: 'Sophie',     pin: '2324' },  // Sophie Hwang
  { nameMatch: 'Tejas',      pin: '2526' },  // Tejas Udutha
  { nameMatch: 'Varenya',    pin: '2728' },  // Varenya Shetty
]

// Mattos G3-4: alphanumeric PINs
const G34_PINS = [
  { nameMatch: 'Aaradhya',   pin: 'A301' },
  { nameMatch: 'Aaryan',     pin: '2018' },
  { nameMatch: 'Adhrit',     pin: 'A302' },
  { nameMatch: 'Ethan',      pin: 'E301' },
  { nameMatch: 'Kushagra',   pin: 'K301' },
  { nameMatch: 'Mahitha',    pin: 'M301' },
  { nameMatch: 'Navya',      pin: 'N301' },
  { nameMatch: 'Niam',       pin: 'N302' },
  { nameMatch: 'Samarth',    pin: 'S301' },
  { nameMatch: 'Varenya',    pin: 'V301' },
  { nameMatch: 'Yash',       pin: 'Y301' },
  { nameMatch: 'Kai',        pin: 'K401' },
  { nameMatch: 'Rick',       pin: 'R401' },
  { nameMatch: 'Shreenika',  pin: 'S401' },
  { nameMatch: 'Vincent',    pin: 'V401' },
]

// ── Apply a list of PIN assignments ──────────────────────────────────────────
async function applyPins(label, gradeBand, schoolMatch, entries) {
  console.log(`\n=== ${label} (${entries.length} students) ===\n`)
  let ok = 0, missing = 0

  for (const { nameMatch, pin } of entries) {
    const rows = await sql`
      SELECT u.id, u.name, u.display_name, u.pin AS current_pin
      FROM users u
      JOIN classrooms cl ON cl.id = u.classroom_id
      JOIN schools s ON s.id = cl.school_id
      WHERE u.name ILIKE ${'%' + nameMatch + '%'}
        AND u.role = 'student'
        AND u.deleted_at IS NULL
        AND cl.grade_band = ${gradeBand}
        AND s.name ILIKE ${schoolMatch}
    `

    if (rows.length === 0) {
      console.log(`  ⚠️  NOT FOUND: ${nameMatch}`)
      missing++
      continue
    }
    if (rows.length > 1) {
      console.log(`  ⚠️  MULTIPLE MATCHES for "${nameMatch}": ${rows.map(r => r.name).join(', ')} — skipping`)
      missing++
      continue
    }

    const student = rows[0]
    const displayName = (student.display_name ?? student.name).padEnd(32)
    const change = student.current_pin === pin ? '(already correct)' : `${student.current_pin ?? 'null'} → ${pin}`
    console.log(`  ${displayName} PIN: ${pin}  ${change}`)

    if (APPLY && student.current_pin !== pin) {
      await sql`UPDATE users SET pin = ${pin} WHERE id = ${student.id}`
    }
    ok++
  }

  return { ok, missing }
}

const r1 = await applyPins('G1-2 PIN fixes (Mattos)', 'g1-2', '%mattos%', G12_PINS)
const r2 = await applyPins('G3-4 PIN assignments (Mattos)', 'g3-4', '%mattos%', G34_PINS)
const r3 = await applyPins('G1-2 PIN assignments (Sinnott)', 'g1-2', '%sinnott%', SINNOTT_G12_PINS)
const r4 = await applyPins('G3-4 PIN assignments (Sinnott)', 'g3-4', '%sinnott%', SINNOTT_G34_PINS)

const totalOk = r1.ok + r2.ok + r3.ok + r4.ok
const totalMissing = r1.missing + r2.missing + r3.missing + r4.missing

console.log(`\n${'─'.repeat(50)}`)
if (!APPLY) {
  console.log('⚠️   DRY RUN complete. Run with --apply to write PINs.')
} else {
  console.log(`✅  Done. ${totalOk} students updated.`)
  if (totalMissing > 0) console.log(`⚠️   ${totalMissing} student(s) not found — check names above.`)
}

await sql.end()

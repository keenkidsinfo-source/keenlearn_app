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

const sql = postgres(process.env.DATABASE_URL)

const mathContent = [
  // ─── G1-2 Week 1: Cranes & Ziplines ───────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 1,
    title: 'Crane & Zipline Math',
    questions: [
      {
        id: 1, phase: 'concrete', emoji: '🚡',
        prompt: 'A cable car carries 4 boxes up the hill. Then it carries 3 more. How many boxes in total?',
        choices: ['5', '6', '7', '8'],
        answer: 2,
      },
      {
        id: 2, phase: 'pictorial', emoji: '📦',
        prompt: '📦📦📦📦📦 + 📦📦 = ?',
        choices: ['5', '6', '7', '8'],
        answer: 2,
      },
      {
        id: 3, phase: 'concrete', emoji: '🪢',
        prompt: 'The zipline is 10 steps long. Emma has walked 6 steps. How many more steps until the end?',
        choices: ['3', '4', '5', '6'],
        answer: 1,
      },
      {
        id: 4, phase: 'pictorial', emoji: '🔵',
        prompt: '🔵🔵🔵🔵🔵🔵🔵🔵 — 3 beads fall off the rope. How many are left?',
        choices: ['4', '5', '6', '7'],
        answer: 1,
      },
      {
        id: 5, phase: 'abstract', emoji: '✏️',
        prompt: '6 + 7 = ?',
        choices: ['11', '12', '13', '14'],
        answer: 2,
      },
      {
        id: 6, phase: 'abstract', emoji: '✏️',
        prompt: '15 − 8 = ?',
        choices: ['5', '6', '7', '8'],
        answer: 2,
      },
    ],
  },

  // ─── G1-2 Week 2: Balance & Levers ────────────────────────────────────────
  {
    gradeBand: 'g1-2',
    weekNumber: 2,
    title: 'Balance Scale Math',
    questions: [
      {
        id: 1, phase: 'concrete', emoji: '⚖️',
        prompt: 'A balance scale has 5 blocks on the left. How many blocks do you need on the right to make it balance?',
        choices: ['3', '4', '5', '6'],
        answer: 2,
      },
      {
        id: 2, phase: 'pictorial', emoji: '⚖️',
        prompt: '⚖️ Left: 🟦🟦🟦🟦🟦🟦  Right: 🟦🟦🟦🟦 + ?  — How many more blocks to balance?',
        choices: ['1', '2', '3', '4'],
        answer: 1,
      },
      {
        id: 3, phase: 'abstract', emoji: '✏️',
        prompt: '5 + ? = 9',
        choices: ['3', '4', '5', '6'],
        answer: 1,
      },
      {
        id: 4, phase: 'concrete', emoji: '🪨',
        prompt: 'A rock weighs 9 pounds. A leaf weighs 2 pounds. How much heavier is the rock?',
        choices: ['5', '6', '7', '8'],
        answer: 2,
      },
      {
        id: 5, phase: 'pictorial', emoji: '🔴',
        prompt: '🔴🔴🔴🔴🔴🔴🔴 = 🔴🔴🔴🔴 + ?  (7 = 4 + ?)',
        choices: ['2', '3', '4', '5'],
        answer: 1,
      },
      {
        id: 6, phase: 'abstract', emoji: '✏️',
        prompt: '? + 6 = 14',
        choices: ['6', '7', '8', '9'],
        answer: 2,
      },
    ],
  },

  // ─── G3-4 Week 1: Cranes & Ziplines — Multiplication & Division ───────────
  {
    gradeBand: 'g3-4',
    weekNumber: 1,
    title: 'Crane Engineering Math',
    questions: [
      {
        id: 1, phase: 'concrete', emoji: '🏗️',
        prompt: 'A crane lifts 4 boxes per trip. It makes 6 trips. How many boxes total?',
        choices: ['20', '22', '24', '26'],
        answer: 2,
      },
      {
        id: 2, phase: 'pictorial', emoji: '🏗️',
        prompt: '🏗️🏗️🏗️  Each crane lifts 7 boxes per trip. 3 cranes, 1 trip each. How many boxes total?',
        choices: ['18', '19', '21', '23'],
        answer: 2,
      },
      {
        id: 3, phase: 'abstract', emoji: '✏️',
        prompt: '8 × 7 = ?',
        choices: ['54', '56', '58', '60'],
        answer: 1,
      },
      {
        id: 4, phase: 'concrete', emoji: '🪢',
        prompt: 'A zipline is 48 metres long, divided into 6 equal sections. How long is each section?',
        choices: ['6m', '7m', '8m', '9m'],
        answer: 2,
      },
      {
        id: 5, phase: 'pictorial', emoji: '🔵',
        prompt: '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵  (12 beads in 4 equal groups) — how many per group?',
        choices: ['2', '3', '4', '5'],
        answer: 1,
      },
      {
        id: 6, phase: 'abstract', emoji: '✏️',
        prompt: '63 ÷ 9 = ?',
        choices: ['6', '7', '8', '9'],
        answer: 1,
      },
      {
        id: 7, phase: 'abstract', emoji: '✏️',
        prompt: 'A crane rope is 45 cm long. Cut into 5 equal pieces. How long is each piece?',
        choices: ['7cm', '8cm', '9cm', '10cm'],
        answer: 2,
      },
    ],
  },

  // ─── G3-4 Week 2: Levers — Fractions & Ratios ─────────────────────────────
  {
    gradeBand: 'g3-4',
    weekNumber: 2,
    title: 'Lever & Ratio Math',
    questions: [
      {
        id: 1, phase: 'concrete', emoji: '⚖️',
        prompt: 'A lever arm is 12 cm long. The fulcrum is exactly in the middle. How long is each side?',
        choices: ['4cm', '5cm', '6cm', '7cm'],
        answer: 2,
      },
      {
        id: 2, phase: 'pictorial', emoji: '📏',
        prompt: 'Lever: [════════|════]  Total = 12 units. Left side = 8 units. Right side = ?',
        choices: ['2', '3', '4', '5'],
        answer: 2,
      },
      {
        id: 3, phase: 'abstract', emoji: '✏️',
        prompt: '1/2 of 20 = ?',
        choices: ['8', '9', '10', '11'],
        answer: 2,
      },
      {
        id: 4, phase: 'concrete', emoji: '🏋️',
        prompt: 'A lever gives 3× mechanical advantage. You push with 5 N of force. How much weight can you lift?',
        choices: ['10N', '12N', '15N', '18N'],
        answer: 2,
      },
      {
        id: 5, phase: 'abstract', emoji: '✏️',
        prompt: '3/4 of 24 = ?',
        choices: ['15', '16', '17', '18'],
        answer: 3,
      },
      {
        id: 6, phase: 'concrete', emoji: '⚖️',
        prompt: 'A seesaw: 6 kg child sits 2 m from fulcrum. To balance, another child sits 3 m away. What is their weight? (6×2 = ?×3)',
        choices: ['2 kg', '4 kg', '6 kg', '8 kg'],
        answer: 1,
      },
      {
        id: 7, phase: 'abstract', emoji: '✏️',
        prompt: 'Effort to load ratio is 1:3. Your effort is 8 N. What is the load?',
        choices: ['16 N', '20 N', '24 N', '28 N'],
        answer: 2,
      },
    ],
  },
]

async function run() {
  for (const m of mathContent) {
    const [item] = await sql`
      SELECT ci.id, ci.title
      FROM content_items ci
      JOIN curriculum_content cc ON cc.content_item_id = ci.id
      JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
      JOIN curriculum c ON c.id = cd.curriculum_id
      WHERE ci.subject = 'math'
        AND ci.grade_band = ${m.gradeBand}
        AND c.week_number = ${m.weekNumber}
        AND c.grade_band = ${m.gradeBand}
      LIMIT 1
    `
    if (!item) {
      console.warn(`⚠  No math item found for ${m.gradeBand} week ${m.weekNumber}`)
      continue
    }
    await sql`
      UPDATE content_items
      SET title = ${m.title}, metadata = ${JSON.stringify({ questions: m.questions })}
      WHERE id = ${item.id}
    `
    console.log(`✓ ${m.gradeBand} Week ${m.weekNumber}: "${m.title}" — ${m.questions.length} questions (was: ${item.title})`)
  }
  await sql.end()
  console.log('\nDone! Math questions updated.')
}

run().catch(e => { console.error(e); process.exit(1) })

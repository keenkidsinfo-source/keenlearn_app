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

const W2_DAY_ID = '5eca64f4-9530-4601-963e-4633a76a2a74'

async function run() {
  // 1. What curriculum does W2 day belong to?
  const [w2Day] = await sql`
    SELECT cd.id, cd.subject, cd.curriculum_id,
           c.week_number, c.grade_band, c.title
    FROM curriculum_days cd
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE cd.id = ${W2_DAY_ID}
  `
  console.log('\n── W2 Day ──')
  console.log(w2Day)

  if (!w2Day) { console.log('Day not found!'); await sql.end(); return }

  // 2. Find the W1 coding day via the same logic as page.tsx
  const prevWeek = await sql`
    SELECT cd.id as day_id, c.id as curriculum_id, c.week_number, c.grade_band, c.title
    FROM curriculum_days cd
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE c.week_number = ${w2Day.week_number - 1}
      AND c.grade_band = ${w2Day.grade_band}
      AND cd.subject = 'coding'
    ORDER BY c.id
  `
  console.log('\n── W1 coding days found by lookup ──')
  console.log(prevWeek)

  if (prevWeek.length === 0) { console.log('No W1 day found!'); await sql.end(); return }

  // 3. Find curriculum_content rows for those W1 days
  const prevContents = await sql`
    SELECT cc.id, cc.curriculum_day_id, ci.title
    FROM curriculum_content cc
    JOIN content_items ci ON ci.id = cc.content_item_id
    WHERE cc.curriculum_day_id = ANY(${prevWeek.map(r => r.day_id)})
  `
  console.log('\n── W1 curriculum_content rows ──')
  console.log(prevContents)

  // 4. Show ALL coding_projects rows, with their curriculum_content_id
  const projects = await sql`
    SELECT cp.id, cp.student_id, u.name as student_name,
           cp.curriculum_content_id, ci.title as content_title,
           c.week_number, c.grade_band,
           length(cp.project_data) as data_len,
           cp.last_saved_at
    FROM coding_projects cp
    JOIN users u ON u.id = cp.student_id
    LEFT JOIN curriculum_content cc ON cc.id = cp.curriculum_content_id
    LEFT JOIN content_items ci ON ci.id = cc.content_item_id
    LEFT JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    LEFT JOIN curriculum c ON c.id = cd.curriculum_id
    ORDER BY cp.last_saved_at DESC
    LIMIT 20
  `
  console.log('\n── coding_projects (most recent 20) ──')
  for (const p of projects) {
    console.log(`  ${p.student_name} | W${p.week_number} ${p.grade_band} | content_id=${p.curriculum_content_id} | ${p.data_len} bytes | ${p.last_saved_at?.toISOString?.()?.slice(0,16)}`)
  }

  // 5. Check if any project's curriculum_content_id matches what the lookup finds
  const prevContentIds = prevContents.map(r => r.id)
  const match = projects.filter(p => prevContentIds.includes(p.curriculum_content_id))
  console.log('\n── Projects whose content_id matches W1 lookup ──')
  console.log(match.length ? match : 'NONE — this is the bug!')
  console.log('\nW1 content ids from lookup:', prevContentIds)
  console.log('Projects content ids:      ', projects.map(p => p.curriculum_content_id))

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

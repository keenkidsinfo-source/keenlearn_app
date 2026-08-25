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

const W1_CONTENT_ID = '81a0df4b-5474-4da5-90eb-785c5ec6dafd'
const W2_CONTENT_ID = '742217cf-3776-4a38-91a6-cfa487a8c24f'

async function run() {
  const rows = await sql`
    SELECT cp.id, u.name, cc2.id as content_id,
           c.week_number, c.grade_band,
           length(cp.project_data) as data_len,
           left(cp.project_data, 100) as preview,
           cp.last_saved_at
    FROM coding_projects cp
    JOIN users u ON u.id = cp.student_id
    JOIN curriculum_content cc2 ON cc2.id = cp.curriculum_content_id
    JOIN curriculum_days cd ON cd.id = cc2.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE cp.curriculum_content_id IN (${W1_CONTENT_ID}, ${W2_CONTENT_ID})
    ORDER BY c.week_number
  `
  console.log('\n── Evans W1 and W2 projects ──')
  for (const r of rows) {
    console.log(`W${r.week_number} | ${r.data_len} bytes | saved ${r.last_saved_at?.toISOString?.()?.slice(0,16)}`)
    console.log(`  id: ${r.id}`)
    console.log(`  preview: ${r.preview}`)
  }

  // Check if W1 and W2 project_data are now identical
  const [cmp] = await sql`
    SELECT
      (SELECT length(project_data) FROM coding_projects WHERE curriculum_content_id = ${W1_CONTENT_ID}) as w1_len,
      (SELECT length(project_data) FROM coding_projects WHERE curriculum_content_id = ${W2_CONTENT_ID}) as w2_len,
      (SELECT project_data FROM coding_projects WHERE curriculum_content_id = ${W1_CONTENT_ID}) =
      (SELECT project_data FROM coding_projects WHERE curriculum_content_id = ${W2_CONTENT_ID}) as are_equal
  `
  console.log('\n── Comparison ──')
  console.log(`W1 size: ${cmp.w1_len} bytes`)
  console.log(`W2 size: ${cmp.w2_len} bytes`)
  console.log(`W1 == W2: ${cmp.are_equal}`)

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

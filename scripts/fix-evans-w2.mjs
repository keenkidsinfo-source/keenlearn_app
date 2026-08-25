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

// Copy Evans' W1 project data into his W2 project row
const W1_CONTENT_ID = '81a0df4b-5474-4da5-90eb-785c5ec6dafd'
const W2_CONTENT_ID = '742217cf-3776-4a38-91a6-cfa487a8c24f'

async function run() {
  const [w1] = await sql`
    SELECT id, student_id, project_data, length(project_data) as data_len
    FROM coding_projects
    WHERE curriculum_content_id = ${W1_CONTENT_ID}
      AND student_id = (SELECT student_id FROM coding_projects WHERE curriculum_content_id = ${W2_CONTENT_ID} LIMIT 1)
    LIMIT 1
  `
  if (!w1?.project_data) {
    console.log('W1 project not found!'); await sql.end(); return
  }
  console.log(`Found W1 project (${w1.data_len} bytes) for student ${w1.student_id}`)

  const result = await sql`
    UPDATE coding_projects
    SET project_data = ${w1.project_data},
        last_saved_at = now()
    WHERE curriculum_content_id = ${W2_CONTENT_ID}
      AND student_id = ${w1.student_id}
    RETURNING id, length(project_data) as data_len
  `
  console.log(`✓ Updated W2 project (${result[0]?.data_len} bytes)`)
  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

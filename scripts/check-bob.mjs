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

async function run() {
  // Find Bob
  const users = await sql`
    SELECT u.id, u.name, u.email, u.role
    FROM users u
    WHERE lower(u.name) LIKE '%bob%'
  `
  console.log('\n── Bob user(s) ──')
  for (const u of users) console.log(`  id: ${u.id} | name: ${u.name} | role: ${u.role}`)

  if (!users.length) { await sql.end(); return }

  const bob = users[0]

  // Check coding projects
  const projects = await sql`
    SELECT cp.id, cp.curriculum_content_id,
           c.week_number, c.grade_band,
           length(cp.project_data) as data_len,
           left(cp.project_data, 80) as preview,
           cp.last_saved_at
    FROM coding_projects cp
    JOIN curriculum_content cc ON cc.id = cp.curriculum_content_id
    JOIN curriculum_days cd ON cd.id = cc.curriculum_day_id
    JOIN curriculum c ON c.id = cd.curriculum_id
    WHERE cp.student_id = ${bob.id}
    ORDER BY c.week_number
  `
  console.log('\n── Bob coding projects ──')
  if (!projects.length) console.log('  (none)')
  for (const p of projects) {
    console.log(`  W${p.week_number} | ${p.data_len ?? 0} bytes | saved: ${p.last_saved_at?.toISOString?.()?.slice(0,16)}`)
    console.log(`    id: ${p.id}`)
    console.log(`    preview: ${p.preview}`)
  }

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

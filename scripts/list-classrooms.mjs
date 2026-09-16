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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

const classrooms = await sql`
  SELECT c.id, c.name, c.grade_band, s.name as school_name
  FROM classrooms c
  LEFT JOIN schools s ON s.id = c.school_id
  ORDER BY s.name, c.grade_band
`

const todayStr = new Date().toISOString().slice(0, 10)
console.log(`Today (UTC): ${todayStr}`)

for (const c of classrooms) {
  console.log(`\n[${c.school_name}] "${c.name}" (${c.grade_band})`)

  // Show all rows
  const rows = await sql`
    SELECT cc.week_start_date, cur.week_number, cur.id as cur_id,
           COUNT(cd.id) as day_count
    FROM classroom_curriculum cc
    JOIN curriculum cur ON cur.id = cc.curriculum_id
    LEFT JOIN curriculum_days cd ON cd.curriculum_id = cur.id
    WHERE cc.classroom_id = ${c.id}
    GROUP BY cc.week_start_date, cur.week_number, cur.id
    ORDER BY cc.week_start_date DESC
    LIMIT 6
  `
  for (const r of rows) {
    const d = typeof r.week_start_date === 'string' ? r.week_start_date : new Date(r.week_start_date).toISOString().slice(0,10)
    const active = d <= todayStr ? ' ← eligible' : ''
    console.log(`  W${r.week_number} | ${d} | days=${r.day_count}${active}`)
  }

  // What the dashboard lte query would pick
  const [best] = await sql`
    SELECT cur.week_number, cc.week_start_date
    FROM classroom_curriculum cc
    JOIN curriculum cur ON cur.id = cc.curriculum_id
    WHERE cc.classroom_id = ${c.id}
      AND cc.week_start_date <= ${todayStr}
    ORDER BY cc.week_start_date DESC
    LIMIT 1
  `
  console.log(`  → Dashboard would show: W${best?.week_number} (${best?.week_start_date})`)
}

await sql.end()

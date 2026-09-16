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
console.log('\nClassroom records:')
for (const c of classrooms) {
  console.log(`\n  [${c.school_name}] "${c.name}" | ${c.grade_band} | id=${c.id}`)
  const cc = await sql`
    SELECT cc.week_start_date, cur.week_number
    FROM classroom_curriculum cc
    JOIN curriculum cur ON cur.id = cc.curriculum_id
    WHERE cc.classroom_id = ${c.id}
    ORDER BY cc.week_start_date
  `
  for (const r of cc) {
    const isThisWeek = new Date(r.week_start_date).toISOString().slice(0,10) === '2026-09-14'
    console.log(`    → W${r.week_number} | ${r.week_start_date}${isThisWeek ? '  ← THIS WEEK' : ''}`)
  }
}

await sql.end()

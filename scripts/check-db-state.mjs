#!/usr/bin/env node
/**
 * check-db-state.mjs — prints current schools, classrooms, and teacher assignments
 * Run: node scripts/check-db-state.mjs
 */
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

console.log('\n── Schools ──────────────────────────────────────────────────')
const schools = await sql`SELECT id, name, slug FROM schools ORDER BY name`
schools.forEach(s => console.log(`  ${s.slug}  ${s.name}  (${s.id})`))

console.log('\n── Classrooms ───────────────────────────────────────────────')
const classrooms = await sql`
  SELECT c.access_code, c.name, c.grade_band, c.grade_level, s.name as school
  FROM classrooms c
  LEFT JOIN schools s ON s.id = c.school_id
  ORDER BY s.name, c.grade_band
`
classrooms.forEach(c =>
  console.log(`  ${c.access_code}  ${c.school ?? '(no school)'}  ${c.grade_band}  "${c.name}"`)
)

console.log('\n── Teacher → Classroom assignments ──────────────────────────')
const assignments = await sql`
  SELECT u.email, u.name, s.name as school, cl.grade_band, cl.name as classroom, cl.access_code, ct.is_primary
  FROM classroom_teachers ct
  JOIN users u ON u.id = ct.teacher_id
  JOIN classrooms cl ON cl.id = ct.classroom_id
  LEFT JOIN schools s ON s.id = cl.school_id
  ORDER BY u.email, s.name, cl.grade_band
`
assignments.forEach(a =>
  console.log(`  ${a.email}  →  ${a.school ?? '?'} ${a.grade_band} "${a.classroom}" (${a.access_code})${a.is_primary ? ' [primary]' : ' [co-teacher]'}`)
)

console.log('\n── Teachers (all) ───────────────────────────────────────────')
const teachers = await sql`
  SELECT name, email, approved_at, display_name
  FROM users WHERE role = 'teacher'
  ORDER BY created_at
`
teachers.forEach(t =>
  console.log(`  ${t.email}  "${t.name}"  ${t.approved_at ? '✅ approved' : '⏳ pending'}  ${t.display_name ? `[${t.display_name}]` : ''}`)
)

await sql.end()
console.log('\n✅ Done\n')

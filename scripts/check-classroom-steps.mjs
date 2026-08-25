#!/usr/bin/env node
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue
    const i = t.indexOf('='); if (i === -1) continue
    const k = t.slice(0, i).trim(), v = t.slice(i+1).trim().replace(/^["']|["']$/g,'')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  const rows = await sql`
    SELECT cl.name as classroom, cl.grade_band, c.week_number,
           ci.id as content_id, ci.title,
           ci.metadata->>'starterUrl' as starter_url,
           jsonb_array_length(ci.metadata->'steps') as step_count
    FROM classrooms cl
    JOIN classroom_curriculum ccl ON ccl.classroom_id = cl.id
    JOIN curriculum c ON c.id = ccl.curriculum_id
    JOIN curriculum_days cd ON cd.curriculum_id = c.id
    JOIN curriculum_content cc ON cc.curriculum_day_id = cd.id
    JOIN content_items ci ON ci.id = cc.content_item_id
    WHERE ci.subject = 'coding'
    ORDER BY cl.name, c.week_number
  `

  // Group by classroom
  const byClass = {}
  for (const r of rows) {
    const key = `${r.classroom} (${r.grade_band})`
    if (!byClass[key]) byClass[key] = []
    byClass[key].push(r)
  }

  for (const [cls, items] of Object.entries(byClass)) {
    console.log(`\n── ${cls} ──`)
    for (const r of items) {
      console.log(`  W${r.week_number} | ${r.step_count} steps | "${r.title}" | starter: ${r.starter_url ?? 'none'}`)
      console.log(`         content_id: ${r.content_id}`)
    }
  }

  // Check if Mattos and Sinnott share the same content_ids
  const mattos = rows.filter(r => r.classroom.toLowerCase().includes('mattos'))
  const sinnott = rows.filter(r => r.classroom.toLowerCase().includes('sinnott') || r.classroom.toLowerCase().includes('sinno'))
  if (mattos.length && sinnott.length) {
    console.log('\n── Sharing same content items? ──')
    for (const m of mattos) {
      const s = sinnott.find(r => r.week_number === m.week_number && r.grade_band === m.grade_band)
      if (s) {
        const same = m.content_id === s.content_id
        console.log(`  W${m.week_number} ${m.grade_band}: ${same ? '✅ same content_id' : `⚠ DIFFERENT — Mattos: ${m.content_id} | Sinnott: ${s.content_id}`}`)
      }
    }
  }

  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

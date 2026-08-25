#!/usr/bin/env node
// Removes duplicate classroom_curriculum rows, keeping the one with the lower (older) id.
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
  // Find duplicates: same classroom_id + curriculum_id, keep min(id)
  const dupes = await sql`
    SELECT classroom_id, curriculum_id,
           MIN(id::text) as keep_id,
           array_agg(id::text ORDER BY id::text) as all_ids,
           COUNT(*) as cnt
    FROM classroom_curriculum
    GROUP BY classroom_id, curriculum_id
    HAVING COUNT(*) > 1
  `

  if (dupes.length === 0) {
    console.log('No duplicates found.')
    await sql.end(); return
  }

  console.log(`Found ${dupes.length} duplicate group(s):`)
  for (const d of dupes) {
    const toDelete = d.all_ids.filter(id => id !== d.keep_id)
    console.log(`  classroom: ${d.classroom_id} | curriculum: ${d.curriculum_id} | keeping: ${d.keep_id} | deleting: ${toDelete.join(', ')}`)
    await sql`DELETE FROM classroom_curriculum WHERE id = ANY(${toDelete}::uuid[])`
  }

  console.log('\nDone — duplicates removed.')
  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

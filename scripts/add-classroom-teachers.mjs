#!/usr/bin/env node
// Creates classroom_teachers junction table and seeds it from classrooms.teacher_id.
// Run once from Mac Terminal:
//   node scripts/add-classroom-teachers.mjs

import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i > 0) {
      let val = t.slice(i + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      process.env[t.slice(0, i).trim()] = val
    }
  }
} catch {}

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  console.log('Creating classroom_teachers table...')

  await sql`
    CREATE TABLE IF NOT EXISTS classroom_teachers (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      classroom_id uuid NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
      teacher_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_primary   boolean NOT NULL DEFAULT false,
      assigned_at  timestamp NOT NULL DEFAULT now(),
      CONSTRAINT uq_classroom_teacher UNIQUE (classroom_id, teacher_id)
    )
  `

  console.log('Seeding from existing classrooms.teacher_id...')

  const result = await sql`
    INSERT INTO classroom_teachers (classroom_id, teacher_id, is_primary)
    SELECT id, teacher_id, true
    FROM classrooms
    WHERE teacher_id IS NOT NULL
    ON CONFLICT (classroom_id, teacher_id) DO NOTHING
  `

  console.log(`✓ Done — ${result.count} rows inserted`)
  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

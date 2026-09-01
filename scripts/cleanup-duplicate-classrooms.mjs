#!/usr/bin/env node
/**
 * cleanup-duplicate-classrooms.mjs
 *
 * Finds duplicate classrooms (same name + grade_band), keeps the one with the most
 * students, and re-points everything that referenced the duplicate to the real one.
 *
 * DRY RUN by default — pass --apply to actually write changes.
 *
 * Run: cd /Users/anjanavenkat/Documents/keenlearn_app && node scripts/cleanup-duplicate-classrooms.mjs
 * Apply: cd /Users/anjanavenkat/Documents/keenlearn_app && node scripts/cleanup-duplicate-classrooms.mjs --apply
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import postgres from 'postgres'

const APPLY = process.argv.includes('--apply')

try {
  const lines = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^DATABASE_URL="?([^"]+)"?/)
    if (m) process.env.DATABASE_URL = m[1]
  }
} catch {}

if (!process.env.DATABASE_URL) { console.error('❌  DATABASE_URL not found'); process.exit(1) }

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

console.log(APPLY ? '🔧 APPLY mode — changes will be written' : '🔍 DRY RUN — pass --apply to write changes')

// 1. Find duplicate classrooms grouped by (name, grade_band)
const groups = await sql`
  SELECT name, grade_band, COUNT(*) AS cnt
  FROM classrooms
  WHERE deleted_at IS NULL
  GROUP BY name, grade_band
  HAVING COUNT(*) > 1
`

if (!groups.length) {
  console.log('\n✅ No duplicate classrooms found.')
  await sql.end()
  process.exit(0)
}

for (const group of groups) {
  console.log(`\n--- Duplicate: "${group.name}" (${group.grade_band}) — ${group.cnt} copies ---`)

  // Get all classrooms in this group with student counts
  const copies = await sql`
    SELECT c.id, c.name, c.grade_band,
           COUNT(u.id) AS student_count
    FROM classrooms c
    LEFT JOIN users u ON u.classroom_id = c.id AND u.role = 'student' AND u.deleted_at IS NULL
    WHERE c.name = ${group.name} AND c.grade_band = ${group.grade_band} AND c.deleted_at IS NULL
    GROUP BY c.id, c.name, c.grade_band
    ORDER BY COUNT(u.id) DESC, c.created_at ASC
  `

  for (const c of copies) {
    console.log(`  ${c.id} — ${c.student_count} students`)
  }

  // Keep the one with the most students (first after ORDER BY)
  const keeper  = copies[0]
  const dupes   = copies.slice(1)

  console.log(`  → KEEP:   ${keeper.id} (${keeper.student_count} students)`)
  for (const d of dupes) {
    console.log(`  → DELETE: ${d.id} (${d.student_count} students)`)

    if (APPLY) {
      // Re-point classroom_teachers
      await sql`
        UPDATE classroom_teachers SET classroom_id = ${keeper.id}
        WHERE classroom_id = ${d.id}
          AND teacher_id NOT IN (
            SELECT teacher_id FROM classroom_teachers WHERE classroom_id = ${keeper.id}
          )
      `
      // Delete classroom_teachers for the duplicate (now that unique ones are moved)
      await sql`DELETE FROM classroom_teachers WHERE classroom_id = ${d.id}`

      // Re-point classroom_curriculum (deduplicate)
      const dupCurr = await sql`
        SELECT curriculum_id, week_start_date FROM classroom_curriculum
        WHERE classroom_id = ${d.id}
      `
      for (const row of dupCurr) {
        // Only insert if the keeper doesn't already have this curriculum+week
        const existing = await sql`
          SELECT 1 FROM classroom_curriculum
          WHERE classroom_id = ${keeper.id}
            AND curriculum_id = ${row.curriculum_id}
            AND week_start_date::date = ${row.week_start_date}::date
        `
        if (!existing.length) {
          await sql`
            UPDATE classroom_curriculum SET classroom_id = ${keeper.id}
            WHERE classroom_id = ${d.id}
              AND curriculum_id = ${row.curriculum_id}
              AND week_start_date::date = ${row.week_start_date}::date
          `
        }
      }
      // Delete remaining duplicate curriculum rows
      await sql`DELETE FROM classroom_curriculum WHERE classroom_id = ${d.id}`

      // Re-point any users (students) in the duplicate classroom
      await sql`
        UPDATE users SET classroom_id = ${keeper.id}
        WHERE classroom_id = ${d.id}
      `

      // Soft-delete the duplicate classroom
      await sql`UPDATE classrooms SET deleted_at = NOW() WHERE id = ${d.id}`

      console.log(`    ✅ Cleaned up ${d.id}`)
    } else {
      console.log(`    (dry run — would re-point classroom_teachers, curriculum, users → ${keeper.id} then soft-delete)`)
    }
  }

  // Also clean up duplicate classroom_curriculum rows on the KEEPER itself
  if (APPLY) {
    const currRows = await sql`
      SELECT curriculum_id, week_start_date, MIN(ctid) AS keep_ctid
      FROM classroom_curriculum
      WHERE classroom_id = ${keeper.id}
      GROUP BY curriculum_id, week_start_date
      HAVING COUNT(*) > 1
    `
    for (const row of currRows) {
      await sql`
        DELETE FROM classroom_curriculum
        WHERE classroom_id = ${keeper.id}
          AND curriculum_id = ${row.curriculum_id}
          AND week_start_date::date = ${row.week_start_date}::date
          AND ctid != ${row.keep_ctid}
      `
      console.log(`  ✅ Removed duplicate classroom_curriculum for week ${row.week_start_date}`)
    }
  } else {
    // Show duplicate curriculum rows on keeper
    const dupCurrRows = await sql`
      SELECT curriculum_id, week_start_date, COUNT(*) AS cnt
      FROM classroom_curriculum
      WHERE classroom_id = ${keeper.id}
      GROUP BY curriculum_id, week_start_date
      HAVING COUNT(*) > 1
    `
    if (dupCurrRows.length) {
      for (const r of dupCurrRows) {
        console.log(`  ⚠️  Keeper has ${r.cnt}x duplicate curriculum_curriculum rows for week ${r.week_start_date} — would deduplicate`)
      }
    }
  }
}

console.log(APPLY ? '\n✅ Done.' : '\n✅ Dry run complete. Run with --apply to apply changes.')
await sql.end()

#!/usr/bin/env node
// Adds parent_name and parent_email columns to the users table.
// Run once from Mac Terminal:
//   node scripts/add-parent-fields.mjs

import postgres from 'postgres'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

async function run() {
  console.log('Adding parent_name and parent_email columns...')

  await sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS parent_name  text,
      ADD COLUMN IF NOT EXISTS parent_email text
  `

  console.log('✓ Done')
  await sql.end()
}

run().catch(e => { console.error(e); process.exit(1) })

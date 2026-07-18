/**
 * Usage: node scripts/create-admin.mjs
 * Creates an admin user. Run once per admin.
 * Requires DATABASE_URL in .env.local
 */

import { createInterface } from 'readline'
import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local
try {
  const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  }
} catch { /* no .env.local */ }

const require = createRequire(import.meta.url)
const bcrypt  = require('bcryptjs')
const postgres = (await import('postgres')).default

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(res => rl.question(q, res))

const sql = postgres(process.env.DATABASE_URL, { prepare: false })

async function main() {
  console.log('\n── KeenKids Admin Creator ──\n')

  const name     = await ask('Full name:  ')
  const email    = await ask('Email:      ')
  const password = await ask('Password (min 8 chars): ')

  if (!name || !email || password.length < 8) {
    console.error('Invalid input. Password must be at least 8 characters.')
    process.exit(1)
  }

  // Check if email already exists
  const existing = await sql`SELECT id, role FROM users WHERE email = ${email.toLowerCase().trim()}`
  if (existing.length) {
    const u = existing[0]
    if (u.role === 'admin') {
      console.log(`\n⚠️  ${email} is already an admin.`)
      process.exit(0)
    }
    // Upgrade existing teacher to admin
    const confirm = await ask(`\n⚠️  ${email} already exists as a ${u.role}. Upgrade to admin? (y/N): `)
    if (confirm.toLowerCase() !== 'y') { console.log('Aborted.'); process.exit(0) }
    const hash = await bcrypt.hash(password, 10)
    await sql`UPDATE users SET role='admin', password_hash=${hash}, approved_at=NOW() WHERE id=${u.id}`
    console.log(`\n✅ ${name} upgraded to admin!`)
  } else {
    const hash = await bcrypt.hash(password, 10)
    await sql`
      INSERT INTO users (name, email, password_hash, role, approved_at)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${hash}, 'admin', NOW())
    `
    console.log(`\n✅ Admin account created for ${name}!`)
  }

  console.log(`   Email: ${email}`)
  console.log(`   Login: /login → "I'm a Teacher" → enter email + password\n`)
  await sql.end()
  rl.close()
}

main().catch(e => { console.error(e); process.exit(1) })

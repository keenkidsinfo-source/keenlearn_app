import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Lazy singleton — do NOT initialize at module load time.
// Next.js visits route modules during build; if DATABASE_URL is unavailable
// or the connection fails, the build errors even for force-dynamic routes.
let _db: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set')
    // DATABASE_SCHEMA lets staging deployments point at the 'staging' schema
    // within the same Supabase project, without touching production data.
    const dbSchema = process.env.DATABASE_SCHEMA || 'public'
    const client = postgres(connectionString, {
      prepare: false,
      connection: { search_path: dbSchema },
    })
    _db = drizzle(client, { schema })
  }
  return _db
}

// Proxy so callers import `db` and use it normally (db.select()…)
// without knowing about the lazy init.
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop]
  },
})

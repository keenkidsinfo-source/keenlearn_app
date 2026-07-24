import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set')
    const dbSchema = process.env.DATABASE_SCHEMA || 'public'

    const client = postgres(connectionString, { prepare: false, max: 1 })

    if (dbSchema !== 'public') {
      // Session-level SET overrides ALTER ROLE SET defaults.
      // With max:1, postgres.js serialises queries, so this runs before anything else.
      client.unsafe(`SET search_path TO ${dbSchema}, extensions`)
        .catch(() => {})
    }

    _db = drizzle(client, { schema })
  }
  return _db
}

// Proxy with correct `this` binding so all drizzle methods work
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const instance = getDb()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

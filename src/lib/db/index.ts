import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set')
    const dbSchema = process.env.DATABASE_SCHEMA || 'public'

    // max:1 ensures a single connection in serverless so the SET below
    // is guaranteed to run before any subsequent query on that connection.
    const client = postgres(connectionString, { prepare: false, max: 1 })

    if (dbSchema !== 'public') {
      // ALTER ROLE SET search_path is overridden by an explicit session-level SET.
      // Fire-and-forget is safe here: postgres.js serialises all queries on a
      // single connection (max:1), so this SET executes before anything else.
      client.unsafe(`SET search_path TO ${dbSchema}, extensions`)
        .catch(() => { /* per-query errors surface naturally */ })
    }

    _db = drizzle(client, { schema })
  }
  return _db
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop]
  },
})

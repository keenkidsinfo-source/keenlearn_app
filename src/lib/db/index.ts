import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// DATABASE_SCHEMA lets us point a staging Vercel deployment at a separate
// schema ('staging') within the same Supabase project, without needing a
// second Supabase project. Production leaves this unset → defaults to 'public'.
const dbSchema = process.env.DATABASE_SCHEMA || 'public'

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(connectionString, {
  prepare: false,
  connection: { search_path: dbSchema },
})

export const db = drizzle(client, { schema })

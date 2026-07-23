export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

// Temporary debug endpoint — remove before going to production
export async function GET() {
  const [searchPath] = await db.execute(sql`SHOW search_path`)
  const [currentSchema] = await db.execute(sql`SELECT current_schema()`)
  const [userCount] = await db.execute(sql`SELECT count(*) FROM users`)

  return Response.json({
    DATABASE_SCHEMA: process.env.DATABASE_SCHEMA ?? '(not set)',
    search_path: searchPath,
    current_schema: currentSchema,
    user_count: userCount,
  })
}

import { db } from '@/lib/db'
import { schools } from '@/lib/db/schema'
import { apiOk } from '@/lib/utils'

// GET /api/v1/schools — public list of schools for signup form
export async function GET() {
  const rows = await db.select({ id: schools.id, name: schools.name })
    .from(schools).orderBy(schools.name)
  return apiOk(rows)
}

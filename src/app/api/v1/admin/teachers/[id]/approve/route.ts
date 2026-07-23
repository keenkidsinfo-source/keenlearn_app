export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// POST /api/v1/admin/teachers/:id/approve
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id } = await params

  const [teacher] = await db.select({ id: users.id, role: users.role })
    .from(users).where(eq(users.id, id)).limit(1)

  if (!teacher || teacher.role !== 'teacher') {
    return apiError('Teacher not found', 'NOT_FOUND', 404)
  }

  await db.update(users)
    .set({ approvedAt: new Date() })
    .where(eq(users.id, id))

  return apiOk({ approved: true })
}

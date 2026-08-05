export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { users, classrooms } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// POST /api/v1/teacher/students/bulk-parents
// Body: { rows: [{ studentName, parentName, parentEmail }] }
// Matches by student name (case-insensitive), updates parent fields.

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  if (session.role === 'student') return apiError('Forbidden', 'FORBIDDEN', 403)

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.teacherId, session.sub))
    .limit(1)
  if (!classroom) return apiError('No classroom found', 'NOT_FOUND', 404)

  const students = await db
    .select({ id: users.id, name: users.name, displayName: users.displayName })
    .from(users)
    .where(and(eq(users.classroomId, classroom.id), eq(users.role, 'student'), isNull(users.deletedAt)))

  const body = await req.json().catch(() => null)
  const rows: { studentName: string; parentName: string; parentEmail: string }[] = body?.rows ?? []

  if (!Array.isArray(rows) || rows.length === 0) {
    return apiError('No rows provided', 'VALIDATION_ERROR', 400)
  }

  const results: { studentName: string; status: 'updated' | 'not_found' }[] = []

  for (const row of rows) {
    const inputName = (row.studentName ?? '').trim().toLowerCase()
    if (!inputName) continue

    // Match by full name or first name
    const match = students.find(s => {
      const full  = s.name.trim().toLowerCase()
      const disp  = (s.displayName ?? s.name).trim().toLowerCase()
      return full === inputName || disp === inputName
        || full.startsWith(inputName + ' ') || disp.startsWith(inputName + ' ')
        || inputName.startsWith(full + ' ') || inputName.startsWith(disp + ' ')
    })

    if (!match) {
      results.push({ studentName: row.studentName, status: 'not_found' })
      continue
    }

    await db.update(users).set({
      parentName:  row.parentName?.trim()  || null,
      parentEmail: row.parentEmail?.trim().toLowerCase() || null,
    }).where(eq(users.id, match.id))

    results.push({ studentName: row.studentName, status: 'updated' })
  }

  return apiOk({ results })
}

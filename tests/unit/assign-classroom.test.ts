// Regression test for the "Teacher2 shows wrong classroom" bug.
//
// Root cause: POST /api/v1/admin/teachers/:id/assign-classroom only ever set
// teacherId on the *newly* assigned classroom. It never cleared teacherId off
// any classroom the teacher previously owned, so a teacher could end up
// pointing at two classroom rows. The teacher dashboard then had to pick one
// of them with `ORDER BY name LIMIT 1`, which surfaced the wrong school's
// classroom (see commit db6bb67).
//
// This test asserts the fixed handler always clears the teacher's old
// classroom(s) before (and independent of) assigning a new one, so a teacher
// can never own more than one classroom row at a time.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { classrooms, users } from '@/lib/db/schema'

interface UpdateCall {
  table: unknown
  set: Record<string, unknown>
}

let updateCalls: UpdateCall[] = []

vi.mock('@/lib/db', () => {
  return {
    db: {
      select: (_fields: unknown) => ({
        from: (table: unknown) => ({
          where: (_cond: unknown) => ({
            limit: async (_n: number) => {
              if (table === users) return [{ id: 'teacher-1', role: 'teacher' }]
              if (table === classrooms) return [{ id: 'classroom-new' }]
              return []
            },
          }),
        }),
      }),
      update: (table: unknown) => ({
        set: (vals: Record<string, unknown>) => ({
          where: async (_cond: unknown) => {
            updateCalls.push({ table, set: vals })
            return undefined
          },
        }),
      }),
    },
  }
})

vi.mock('@/lib/auth/jwt', () => ({
  getSession: async () => ({ sub: 'admin-1', role: 'admin', name: 'Admin' }),
}))

describe('POST /api/v1/admin/teachers/:id/assign-classroom', () => {
  beforeEach(() => {
    updateCalls = []
  })

  it('clears the teacher off any previously-owned classroom before assigning the new one', async () => {
    const { POST } = await import('@/app/api/v1/admin/teachers/[id]/assign-classroom/route')

    const req = { json: async () => ({ classroomId: 'classroom-new' }) } as any
    const res = await POST(req, { params: Promise.resolve({ id: 'teacher-1' }) })

    expect(res.status).toBe(200)

    // First update must clear teacherId (null) on the classrooms table —
    // this is the unconditional "detach from anything I used to own" step.
    const clearCall = updateCalls.find(c => c.table === classrooms && c.set.teacherId === null)
    expect(clearCall).toBeTruthy()

    // A later update must set teacherId to the new teacher on classrooms.
    const assignCall = updateCalls.find(c => c.table === classrooms && c.set.teacherId === 'teacher-1')
    expect(assignCall).toBeTruthy()
    expect(updateCalls.indexOf(clearCall!)).toBeLessThan(updateCalls.indexOf(assignCall!))

    // Users row for the teacher must reflect their one current classroom.
    const userCall = updateCalls.find(c => c.table === users)
    expect(userCall?.set.classroomId).toBe('classroom-new')
  })

  it('still clears the old classroom when un-assigning (classroomId = null)', async () => {
    const { POST } = await import('@/app/api/v1/admin/teachers/[id]/assign-classroom/route')

    const req = { json: async () => ({ classroomId: null }) } as any
    const res = await POST(req, { params: Promise.resolve({ id: 'teacher-1' }) })

    expect(res.status).toBe(200)
    const clearCall = updateCalls.find(c => c.table === classrooms && c.set.teacherId === null)
    expect(clearCall).toBeTruthy()

    // No classroom should be (re)assigned to this teacher.
    const assignCall = updateCalls.find(c => c.table === classrooms && c.set.teacherId === 'teacher-1')
    expect(assignCall).toBeFalsy()
  })
})

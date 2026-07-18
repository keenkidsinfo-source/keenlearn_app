'use client'

import { useEffect, useState, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Teacher {
  id: string
  name: string
  email: string
  displayName: string | null
  schoolId: string | null
  classroomId: string | null
  createdAt: string
  approvedAt: string | null
}

interface CurriculumAssignment {
  id: string
  weekStartDate: string
  curriculumId: string
  title: string | null
  weekNumber: number | null
}

interface Classroom {
  id: string
  name: string
  gradeLevel: string
  gradeBand: string
  accessCode: string
  schoolId: string | null
  teacherId: string | null
  schoolName: string | null
  teacherName: string | null
  teacherEmail: string | null
  curriculum: CurriculumAssignment[]
}

interface CurriculumWeek {
  id: string
  title: string
  gradeBand: string
  weekNumber: number
  theme: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nextMonday(d = new Date()) {
  const day = d.getDay() // 0=Sun
  const diff = day === 1 ? 0 : (8 - day) % 7 || 7
  const m = new Date(d)
  m.setDate(d.getDate() + (day === 1 ? 0 : diff))
  return m.toISOString().slice(0, 10)
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [teachers,    setTeachers]    = useState<Teacher[]>([])
  const [classrooms,  setClassrooms]  = useState<Classroom[]>([])
  const [curriculum,  setCurriculum]  = useState<CurriculumWeek[]>([])
  const [loading,     setLoading]     = useState(true)
  const [tab,         setTab]         = useState<'pending' | 'teachers' | 'classrooms' | 'admins'>('pending')
  const [toast,       setToast]       = useState('')
  const [newClassroom, setNewClassroom] = useState({ name: '', gradeLevel: '1', gradeBand: 'g1-2', schoolId: '' })
  const [creating,    setCreating]    = useState(false)

  // New admin form
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })
  const [creatingAdmin, setCreatingAdmin] = useState(false)

  // Per-teacher classroom assignment state
  const [teacherClassroom, setTeacherClassroom] = useState<Record<string, string>>({})

  // Per-classroom curriculum assignment state
  const [classroomCurriculum, setClassroomCurriculum] = useState<Record<string, { curriculumId: string; weekStartDate: string }>>({})

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [tRes, cRes, curRes] = await Promise.all([
        fetch('/api/v1/admin/teachers'),
        fetch('/api/v1/admin/classrooms'),
        fetch('/api/v1/admin/curriculum'),
      ])
      const [tJson, cJson, curJson] = await Promise.all([tRes.json(), cRes.json(), curRes.json()])
      setTeachers(tJson.data ?? [])
      setClassrooms(cJson.data ?? [])
      setCurriculum(curJson.data ?? [])

      // Seed teacher→classroom state from loaded data
      const tcMap: Record<string, string> = {}
      ;(tJson.data ?? []).forEach((t: Teacher) => {
        tcMap[t.id] = t.classroomId ?? ''
      })
      setTeacherClassroom(tcMap)

      // Seed classroom curriculum state
      const ccMap: Record<string, { curriculumId: string; weekStartDate: string }> = {}
      ;(cJson.data ?? []).forEach((cls: Classroom) => {
        const latest = cls.curriculum[cls.curriculum.length - 1]
        ccMap[cls.id] = {
          curriculumId:  latest?.curriculumId ?? '',
          weekStartDate: latest?.weekStartDate ?? nextMonday(),
        }
      })
      setClassroomCurriculum(ccMap)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function approveTeacher(id: string) {
    const res = await fetch(`/api/v1/admin/teachers/${id}/approve`, { method: 'POST' })
    if (res.ok) { showToast('✅ Teacher approved!'); loadData() }
    else showToast('❌ Failed to approve.')
  }

  async function assignClassroom(teacherId: string) {
    const classroomId = teacherClassroom[teacherId] || null
    const res = await fetch(`/api/v1/admin/teachers/${teacherId}/assign-classroom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classroomId }),
    })
    if (res.ok) { showToast('✅ Classroom assigned!'); loadData() }
    else showToast('❌ Failed to assign.')
  }

  async function assignCurriculum(classroomId: string) {
    const { curriculumId, weekStartDate } = classroomCurriculum[classroomId] ?? {}
    if (!curriculumId || !weekStartDate) { showToast('Pick a curriculum week and start date.'); return }
    const res = await fetch(`/api/v1/admin/classrooms/${classroomId}/assign-curriculum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curriculumId, weekStartDate }),
    })
    if (res.ok) { showToast('✅ Curriculum assigned!'); loadData() }
    else showToast('❌ Failed to assign.')
  }

  async function createAdmin(e: React.FormEvent) {
    e.preventDefault()
    const { name, email, password } = newAdmin
    if (!name || !email || password.length < 8) { showToast('All fields required, password min 8 chars.'); return }
    setCreatingAdmin(true)
    const res = await fetch('/api/v1/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    setCreatingAdmin(false)
    if (res.ok) {
      showToast('✅ Admin account created!')
      setNewAdmin({ name: '', email: '', password: '' })
    } else {
      const j = await res.json()
      showToast(`❌ ${j.error ?? 'Failed to create admin.'}`)
    }
  }

  async function createClassroom() {
    const { name, gradeLevel, gradeBand, schoolId } = newClassroom
    if (!name.trim()) { showToast('Enter a classroom name.'); return }
    setCreating(true)
    const res = await fetch('/api/v1/admin/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, gradeLevel, gradeBand, schoolId: schoolId || null }),
    })
    setCreating(false)
    if (res.ok) {
      showToast('✅ Classroom created!')
      setNewClassroom({ name: '', gradeLevel: '1', gradeBand: 'g1-2', schoolId: '' })
      loadData()
    } else showToast('❌ Failed to create.')
  }

  const pendingTeachers  = teachers.filter(t => !t.approvedAt)
  const approvedTeachers = teachers.filter(t => !!t.approvedAt)

  const uniqueSchools = Array.from(new Set(classrooms.map(c => c.schoolId).filter(Boolean)))
    .map(sid => {
      const cls = classrooms.find(c => c.schoolId === sid)
      return { id: sid!, name: cls?.schoolName ?? sid! }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-keen-700 text-white px-6 py-4 flex items-center gap-4 shadow">
        <div className="font-black text-xl tracking-tight">KeenKids Admin</div>
        <div className="flex-1" />
        <a href="/account/password" className="text-keen-200 hover:text-white text-sm font-semibold">🔑 Change Password</a>
        <form action="/api/v1/auth/logout" method="POST">
          <button type="submit" className="text-keen-200 hover:text-white text-sm font-semibold">Sign out</button>
        </form>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-xl z-50">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm w-fit">
          {[
            { key: 'pending',    label: `⏳ Pending Approvals${pendingTeachers.length ? ` (${pendingTeachers.length})` : ''}` },
            { key: 'teachers',   label: '👩‍🏫 Teachers' },
            { key: 'classrooms', label: '🏫 Classrooms' },
            { key: 'admins',     label: '🔑 Admins' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                tab === t.key
                  ? 'bg-keen-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16 text-lg">Loading…</div>
        ) : (
          <>
            {/* ── Pending Approvals ── */}
            {tab === 'pending' && (
              <div className="space-y-4">
                {pendingTeachers.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-semibold">No pending teacher approvals</p>
                  </div>
                ) : pendingTeachers.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="font-black text-gray-800 text-lg">{t.name}</div>
                      <div className="text-gray-500 text-sm">{t.email}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {t.displayName ?? '—'} &middot; Signed up {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      {/* Assign classroom during approval */}
                      <select
                        value={teacherClassroom[t.id] ?? ''}
                        onChange={e => setTeacherClassroom(p => ({ ...p, [t.id]: e.target.value }))}
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400"
                      >
                        <option value="">No classroom yet</option>
                        {classrooms.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.schoolName ?? 'School'} — {c.name} (G{c.gradeLevel})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={async () => {
                          // Assign classroom first if chosen, then approve
                          if (teacherClassroom[t.id]) await assignClassroom(t.id)
                          await approveTeacher(t.id)
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
                      >
                        Approve ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Teachers ── */}
            {tab === 'teachers' && (
              <div className="space-y-4">
                {approvedTeachers.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
                    <p className="font-semibold">No approved teachers yet</p>
                  </div>
                ) : approvedTeachers.map(t => {
                  const assignedClassroom = classrooms.find(c => c.id === t.classroomId)
                  return (
                    <div key={t.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="font-black text-gray-800 text-lg">{t.name}</div>
                        <div className="text-gray-500 text-sm">{t.email}</div>
                        {assignedClassroom && (
                          <div className="text-green-600 text-xs mt-1 font-semibold">
                            📚 {assignedClassroom.schoolName ?? ''} — {assignedClassroom.name} (G{assignedClassroom.gradeLevel}) · Code: {assignedClassroom.accessCode}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 items-center">
                        <select
                          value={teacherClassroom[t.id] ?? ''}
                          onChange={e => setTeacherClassroom(p => ({ ...p, [t.id]: e.target.value }))}
                          className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400"
                        >
                          <option value="">No classroom</option>
                          {classrooms.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.schoolName ?? 'School'} — {c.name} (G{c.gradeLevel})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignClassroom(t.id)}
                          className="bg-keen-600 hover:bg-keen-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-95"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Admins ── */}
            {tab === 'admins' && (
              <div className="max-w-lg">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-black text-gray-700 text-lg mb-1">Add Admin Account</h2>
                  <p className="text-gray-400 text-sm mb-5">Admins have full access to this dashboard. If the email already exists in the system, that account will be upgraded to admin.</p>
                  <form onSubmit={createAdmin} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Full Name</label>
                      <input type="text" value={newAdmin.name}
                        onChange={e => setNewAdmin(p => ({ ...p, name: e.target.value }))}
                        placeholder="Shilpa Patel" required
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-keen-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Email</label>
                      <input type="email" value={newAdmin.email}
                        onChange={e => setNewAdmin(p => ({ ...p, email: e.target.value }))}
                        placeholder="shilpa@keenkids.com" required
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-keen-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Password (min 8 chars)</label>
                      <input type="password" value={newAdmin.password}
                        onChange={e => setNewAdmin(p => ({ ...p, password: e.target.value }))}
                        placeholder="••••••••" required minLength={8}
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-keen-400" />
                    </div>
                    <button type="submit" disabled={creatingAdmin}
                      className="bg-keen-600 hover:bg-keen-500 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50">
                      {creatingAdmin ? 'Creating…' : 'Create Admin Account →'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── Classrooms ── */}
            {tab === 'classrooms' && (
              <div className="space-y-6">
                {/* Create new classroom */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h2 className="font-black text-gray-700 mb-4">+ New Classroom</h2>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Classroom Name</label>
                      <input
                        type="text"
                        value={newClassroom.name}
                        onChange={e => setNewClassroom(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Ms. Smith's Class"
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm w-52 focus:outline-none focus:border-keen-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">Grade</label>
                      <select
                        value={newClassroom.gradeLevel}
                        onChange={e => {
                          const gl = e.target.value
                          setNewClassroom(p => ({
                            ...p,
                            gradeLevel: gl,
                            gradeBand: ['1','2'].includes(gl) ? 'g1-2' : 'g3-4',
                          }))
                        }}
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400"
                      >
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">School</label>
                      <select
                        value={newClassroom.schoolId}
                        onChange={e => setNewClassroom(p => ({ ...p, schoolId: e.target.value }))}
                        className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400"
                      >
                        <option value="">No school</option>
                        {uniqueSchools.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={createClassroom}
                      disabled={creating}
                      className="bg-keen-600 hover:bg-keen-500 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      {creating ? 'Creating…' : 'Create Classroom'}
                    </button>
                  </div>
                </div>

                {/* Existing classrooms */}
                {classrooms.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
                    <p className="font-semibold">No classrooms yet</p>
                  </div>
                ) : classrooms.map(cls => {
                  const curState = classroomCurriculum[cls.id] ?? { curriculumId: '', weekStartDate: nextMonday() }
                  const filteredCurriculum = curriculum.filter(c => c.gradeBand === cls.gradeBand || c.gradeBand === 'both')

                  return (
                    <div key={cls.id} className="bg-white rounded-2xl shadow-sm p-5">
                      <div className="flex flex-wrap items-start gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-gray-800 text-lg truncate">{cls.name}</div>
                          <div className="text-gray-500 text-sm">{cls.schoolName ?? 'No school'} · Grade {cls.gradeLevel} · <span className="font-mono font-bold text-keen-600">{cls.accessCode}</span></div>
                          {cls.teacherName
                            ? <div className="text-green-600 text-xs mt-1">👩‍🏫 {cls.teacherName} ({cls.teacherEmail})</div>
                            : <div className="text-gray-400 text-xs mt-1">No teacher assigned</div>
                          }
                        </div>
                      </div>

                      {/* Current curriculum assignments */}
                      {cls.curriculum.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {cls.curriculum.map(a => (
                            <span key={a.id} className="bg-keen-50 border border-keen-200 text-keen-700 text-xs font-semibold px-3 py-1 rounded-full">
                              📅 {a.weekStartDate}: {a.title ?? `Week ${a.weekNumber}`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Assign curriculum */}
                      <div className="flex flex-wrap gap-3 items-end border-t border-gray-100 pt-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1">Curriculum Week</label>
                          <select
                            value={curState.curriculumId}
                            onChange={e => setClassroomCurriculum(p => ({ ...p, [cls.id]: { ...curState, curriculumId: e.target.value } }))}
                            className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm w-64 focus:outline-none focus:border-keen-400"
                          >
                            <option value="">Select curriculum week…</option>
                            {filteredCurriculum.map(c => (
                              <option key={c.id} value={c.id}>
                                Week {c.weekNumber} — {c.title} ({c.gradeBand})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1">Week Start Date (Monday)</label>
                          <input
                            type="date"
                            value={curState.weekStartDate}
                            onChange={e => setClassroomCurriculum(p => ({ ...p, [cls.id]: { ...curState, weekStartDate: e.target.value } }))}
                            className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400"
                          />
                        </div>
                        <button
                          onClick={() => assignCurriculum(cls.id)}
                          className="bg-keen-600 hover:bg-keen-500 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95"
                        >
                          Assign Week →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

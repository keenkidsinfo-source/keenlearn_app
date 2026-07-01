'use client'

import { useState } from 'react'

const AVATARS = ['🦊','🐼','🦁','🐸','🦋','🐬','🦄','🐉']

interface Student {
  id: string
  name: string
  displayName: string | null
  avatarId: number | null
}

interface Props {
  initialStudents: Student[]
}

type Modal =
  | { type: 'add' }
  | { type: 'edit-pin'; student: Student }
  | { type: 'delete'; student: Student }
  | null

export function StudentManager({ initialStudents }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [modal, setModal]       = useState<Modal>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // ── Add student form state
  const [newName, setNewName]       = useState('')
  const [newPin, setNewPin]         = useState('')
  const [newAvatar, setNewAvatar]   = useState(1)
  // ── Edit PIN form state
  const [newPinEdit, setNewPinEdit] = useState('')

  function closeModal() {
    setModal(null)
    setError('')
    setNewName('')
    setNewPin('')
    setNewAvatar(1)
    setNewPinEdit('')
  }

  async function addStudent() {
    if (!newName.trim()) { setError('Enter a name'); return }
    if (newPin.length !== 4 || isNaN(Number(newPin))) { setError('PIN must be 4 digits'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/v1/teacher/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), pin: newPin, avatarId: newAvatar }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to add student'); return }
      setStudents(prev => [...prev, json.data].sort((a, b) => a.name.localeCompare(b.name)))
      closeModal()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function resetPin(studentId: string) {
    if (newPinEdit.length !== 4 || isNaN(Number(newPinEdit))) { setError('PIN must be 4 digits'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/v1/teacher/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPinEdit }),
      })
      if (!res.ok) { setError('Failed to update PIN'); return }
      closeModal()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function deleteStudent(studentId: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/v1/teacher/students/${studentId}`, { method: 'DELETE' })
      if (!res.ok) { setError('Failed to remove student'); return }
      setStudents(prev => prev.filter(s => s.id !== studentId))
      closeModal()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Student list */}
      <div className="flex flex-col gap-2">
        {students.length === 0 && (
          <p className="text-gray-400 text-center py-4 text-sm">No students yet. Add one below!</p>
        )}
        {students.map(student => (
          <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl w-9 text-center flex-shrink-0">
              {AVATARS[((student.avatarId ?? 1) - 1) % 8]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate">{student.displayName ?? student.name}</p>
              <p className="text-xs text-gray-400">PIN: ●●●●</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => { setModal({ type: 'edit-pin', student }); setError('') }}
                className="text-xs font-bold text-keen-600 hover:text-keen-800 bg-keen-50 hover:bg-keen-100 px-2 py-1.5 rounded-lg transition-all"
                title="Change PIN"
              >
                🔑 PIN
              </button>
              <button
                onClick={() => { setModal({ type: 'delete', student }); setError('') }}
                className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-all"
                title="Remove student"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add student button */}
      <button
        onClick={() => setModal({ type: 'add' })}
        className="mt-4 w-full border-2 border-dashed border-keen-300 text-keen-600 font-bold py-3 rounded-xl hover:border-keen-500 hover:bg-keen-50 transition-all text-sm"
      >
        + Add Student
      </button>

      {/* ── Modal overlay ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">

            {/* ADD STUDENT */}
            {modal.type === 'add' && (
              <>
                <h3 className="text-xl font-black text-gray-800 mb-4">Add Student</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Alice"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:border-keen-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">4-digit PIN</label>
                    <input
                      type="number"
                      value={newPin}
                      onChange={e => setNewPin(e.target.value.slice(0, 4))}
                      placeholder="e.g. 1234"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-2xl font-black tracking-widest focus:border-keen-400 focus:outline-none"
                      inputMode="numeric"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-2 block">Avatar</label>
                    <div className="grid grid-cols-4 gap-2">
                      {AVATARS.map((emoji, i) => (
                        <button
                          key={i}
                          onClick={() => setNewAvatar(i + 1)}
                          className={`text-3xl py-2 rounded-xl transition-all ${
                            newAvatar === i + 1
                              ? 'bg-keen-100 ring-2 ring-keen-500 scale-110'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                      Cancel
                    </button>
                    <button
                      onClick={addStudent}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-keen-600 text-white font-bold hover:bg-keen-500 disabled:opacity-60"
                    >
                      {loading ? 'Adding…' : 'Add Student'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* EDIT PIN */}
            {modal.type === 'edit-pin' && (
              <>
                <h3 className="text-xl font-black text-gray-800 mb-1">Change PIN</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {AVATARS[((modal.student.avatarId ?? 1) - 1) % 8]} {modal.student.displayName ?? modal.student.name}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">New 4-digit PIN</label>
                    <input
                      type="number"
                      value={newPinEdit}
                      onChange={e => setNewPinEdit(e.target.value.slice(0, 4))}
                      placeholder="e.g. 5678"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-2xl font-black tracking-widest focus:border-keen-400 focus:outline-none"
                      inputMode="numeric"
                      maxLength={4}
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                      Cancel
                    </button>
                    <button
                      onClick={() => resetPin(modal.student.id)}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-keen-600 text-white font-bold hover:bg-keen-500 disabled:opacity-60"
                    >
                      {loading ? 'Saving…' : 'Save PIN'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* DELETE */}
            {modal.type === 'delete' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{AVATARS[((modal.student.avatarId ?? 1) - 1) % 8]}</div>
                  <h3 className="text-xl font-black text-gray-800">Remove {modal.student.displayName ?? modal.student.name}?</h3>
                  <p className="text-gray-500 text-sm mt-1">Their progress will be kept but they won't be able to log in.</p>
                </div>
                {error && <p className="text-red-500 text-sm font-semibold text-center mb-3">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteStudent(modal.student.id)}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-60"
                  >
                    {loading ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

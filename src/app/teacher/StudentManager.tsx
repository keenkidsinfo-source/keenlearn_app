'use client'

import { useState } from 'react'
import { BulkParentForm } from './BulkParentForm'

const AVATARS = ['🦊','🐼','🦁','🐸','🦋','🐬','🦄','🐉']

interface Student {
  id: string
  name: string
  displayName: string | null
  avatarId: number | null
  parentName: string | null
  parentEmail: string | null
  parentPhone: string | null
}

interface Props {
  initialStudents: Student[]
  classroomId?: string
}

type Modal =
  | { type: 'add' }
  | { type: 'edit-name'; student: Student }
  | { type: 'edit-pin'; student: Student }
  | { type: 'edit-parent'; student: Student }
  | { type: 'delete'; student: Student }
  | { type: 'bulk-parents' }
  | { type: 'bulk-students' }
  | null

export function StudentManager({ initialStudents, classroomId }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [modal, setModal]       = useState<Modal>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // ── Add student form state
  const [newName, setNewName]               = useState('')
  const [newPin, setNewPin]                 = useState('')
  const [newAvatar, setNewAvatar]           = useState(1)
  const [newParentName, setNewParentName]   = useState('')
  const [newParentEmail, setNewParentEmail] = useState('')
  const [newParentPhone, setNewParentPhone] = useState('')
  // ── Edit name form state
  const [editName, setEditName]             = useState('')
  // ── Edit PIN form state
  const [newPinEdit, setNewPinEdit]         = useState('')
  // ── Edit parent form state
  const [editParentName, setEditParentName]   = useState('')
  const [editParentEmail, setEditParentEmail] = useState('')
  const [editParentPhone, setEditParentPhone] = useState('')
  // ── Bulk student CSV state
  const [csvText, setCsvText]         = useState('')
  const [csvImporting, setCsvImporting] = useState(false)
  const [csvResult, setCsvResult]     = useState<{ done: number; failed: string[] } | null>(null)

  type CsvRow = { name: string; pin: string; parentName: string; parentEmail: string; parentPhone: string }

  function parseCsv(text: string): CsvRow[] {
    return text.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.toLowerCase().startsWith('name'))
      .map(l => {
        const cols = l.split(',').map(c => c.trim())
        return {
          name:        cols[0] ?? '',
          pin:         cols[1] ?? '',
          parentName:  cols[2] ?? '',
          parentEmail: cols[3] ?? '',
          parentPhone: cols[4] ?? '',
        }
      })
      .filter(r => r.name && r.pin.length === 4 && !isNaN(Number(r.pin)))
  }

  async function importCsvStudents() {
    const rows = parseCsv(csvText)
    if (!rows.length) { setError('No valid rows found'); return }
    setCsvImporting(true); setError(''); setCsvResult(null)
    const failed: string[] = []
    let done = 0
    for (const row of rows) {
      try {
        const res = await fetch('/api/v1/teacher/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.name, pin: row.pin, avatarId: Math.ceil(Math.random() * 8),
            parentName:  row.parentName  || null,
            parentEmail: row.parentEmail || null,
            parentPhone: row.parentPhone || null,
            classroomId: classroomId ?? null,
          }),
        })
        if (res.ok) {
          const json = await res.json()
          setStudents(prev => [...prev, { ...json.data, parentPhone: json.data.parentPhone ?? null }])
          done++
        } else {
          failed.push(row.name)
        }
      } catch {
        failed.push(row.name)
      }
    }
    setStudents(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)))
    setCsvResult({ done, failed })
    setCsvImporting(false)
  }

  function closeModal() {
    setModal(null)
    setError('')
    setNewName(''); setNewPin(''); setNewAvatar(1)
    setNewParentName(''); setNewParentEmail(''); setNewParentPhone('')
    setEditName('')
    setNewPinEdit('')
    setEditParentName(''); setEditParentEmail(''); setEditParentPhone('')
    setCsvText(''); setCsvResult(null)
  }

  async function addStudent() {
    if (!newName.trim()) { setError('Enter a name'); return }
    if (newPin.length !== 4 || isNaN(Number(newPin))) { setError('PIN must be 4 digits'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/v1/teacher/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(), pin: newPin, avatarId: newAvatar,
          parentName: newParentName.trim() || null,
          parentEmail: newParentEmail.trim() || null,
          parentPhone: newParentPhone.trim() || null,
          classroomId: classroomId ?? null,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to add student'); return }
      setStudents(prev => [...prev, { ...json.data, parentPhone: json.data.parentPhone ?? null }].sort((a, b) => a.name.localeCompare(b.name)))
      closeModal()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function saveName(studentId: string) {
    if (!editName.trim()) { setError('Enter a name'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/v1/teacher/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (!res.ok) { setError('Failed to update name'); return }
      setStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, name: editName.trim(), displayName: editName.trim() } : s
      ).sort((a, b) => (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name)))
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

  async function saveParent(studentId: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/v1/teacher/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName:  editParentName.trim()  || null,
          parentEmail: editParentEmail.trim() || null,
          parentPhone: editParentPhone.trim() || null,
        }),
      })
      if (!res.ok) { setError('Failed to save parent info'); return }
      setStudents(prev => prev.map(s =>
        s.id === studentId
          ? { ...s, parentName: editParentName.trim() || null, parentEmail: editParentEmail.trim() || null, parentPhone: editParentPhone.trim() || null }
          : s
      ))
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
              {student.parentEmail
                ? <p className="text-xs text-green-600 truncate">📧 {student.parentEmail}</p>
                : <p className="text-xs text-orange-400">No parent email</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setEditName(student.displayName ?? student.name)
                  setModal({ type: 'edit-name', student })
                  setError('')
                }}
                className="text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-lg transition-all"
                title="Edit name"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  setEditParentName(student.parentName ?? '')
                  setEditParentEmail(student.parentEmail ?? '')
                  setEditParentPhone(student.parentPhone ?? '')
                  setModal({ type: 'edit-parent', student })
                  setError('')
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded-lg transition-all"
                title="Edit parent info"
              >
                👪
              </button>
              <button
                onClick={() => { setModal({ type: 'edit-pin', student }); setError('') }}
                className="text-xs font-bold text-keen-600 hover:text-keen-800 bg-keen-50 hover:bg-keen-100 px-2 py-1.5 rounded-lg transition-all"
                title="Change PIN"
              >
                🔑
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

      {/* Add student + bulk upload buttons */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setModal({ type: 'add' })}
          className="flex-1 border-2 border-dashed border-keen-300 text-keen-600 font-bold py-3 rounded-xl hover:border-keen-500 hover:bg-keen-50 transition-all text-sm"
          title="Create a new student account with name, PIN, and optional parent contact"
        >
          + Add New Student
        </button>
        <button
          onClick={() => { setCsvText(''); setCsvResult(null); setModal({ type: 'bulk-students' }) }}
          className="flex-1 border-2 border-dashed border-green-300 text-green-700 font-bold py-3 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-sm"
          title="Import multiple students at once from a CSV list"
        >
          📋 Bulk Import Students
        </button>
        {students.length > 0 && (
          <button
            onClick={() => setModal({ type: 'bulk-parents' })}
            className="flex-1 border-2 border-dashed border-indigo-300 text-indigo-600 font-bold py-3 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-sm"
            title="Update parent contact info for existing students via spreadsheet upload"
          >
            📊 Bulk Update Contacts
          </button>
        )}
      </div>

      {/* ── Modal overlay ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

            {/* BULK STUDENT IMPORT */}
            {modal.type === 'bulk-students' && (
              <>
                <h3 className="text-xl font-black text-gray-800 mb-1">Bulk Import Students</h3>
                <p className="text-gray-500 text-sm mb-3">
                  Paste a list — one student per line:<br/>
                  <code className="bg-gray-100 px-1 rounded text-xs">Name, PIN</code> or&nbsp;
                  <code className="bg-gray-100 px-1 rounded text-xs">Name, PIN, Parent Name, Parent Email, Parent Phone</code>
                </p>
                <textarea
                  value={csvText}
                  onChange={e => { setCsvText(e.target.value); setCsvResult(null) }}
                  placeholder={"Alice Smith, 1234\nBob Jones, 5678, Jane Jones, jane@gmail.com\n..."}
                  rows={8}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-green-400 focus:outline-none resize-none"
                />
                {csvText.trim() && (() => {
                  const rows = parseCsv(csvText)
                  return (
                    <p className="text-sm text-gray-600 mt-1">
                      {rows.length > 0
                        ? <span className="text-green-700 font-semibold">✓ {rows.length} valid student{rows.length !== 1 ? 's' : ''} ready to import</span>
                        : <span className="text-red-500 font-semibold">No valid rows found — check format</span>}
                    </p>
                  )
                })()}
                {csvResult && (
                  <div className={`mt-2 rounded-xl px-4 py-3 text-sm font-semibold ${csvResult.failed.length === 0 ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                    ✓ {csvResult.done} imported
                    {csvResult.failed.length > 0 && <span> · Failed: {csvResult.failed.join(', ')}</span>}
                  </div>
                )}
                {error && <p className="text-red-500 text-sm font-semibold mt-2">{error}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                    {csvResult ? 'Done' : 'Cancel'}
                  </button>
                  {!csvResult && (
                    <button
                      onClick={importCsvStudents}
                      disabled={csvImporting || parseCsv(csvText).length === 0}
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 disabled:opacity-60"
                    >
                      {csvImporting ? 'Importing…' : `Import ${parseCsv(csvText).length} Students`}
                    </button>
                  )}
                </div>
              </>
            )}

            {/* BULK PARENT UPLOAD */}
            {modal.type === 'bulk-parents' && (
              <BulkParentForm
                students={students}
                onSaved={updated => { setStudents(updated); setModal(null) }}
                onClose={closeModal}
              />
            )}

            {/* ADD STUDENT */}
            {modal.type === 'add' && (
              <>
                <h3 className="text-xl font-black text-gray-800 mb-4">Add Student</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Student Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Alice Smith"
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

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Parent Info (optional)</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Parent Name</label>
                        <input
                          type="text"
                          value={newParentName}
                          onChange={e => setNewParentName(e.target.value)}
                          placeholder="e.g. Jane Smith"
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Parent Email</label>
                        <input
                          type="email"
                          value={newParentEmail}
                          onChange={e => setNewParentEmail(e.target.value)}
                          placeholder="e.g. jane@example.com"
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Parent Phone</label>
                        <input
                          type="tel"
                          value={newParentPhone}
                          onChange={e => setNewParentPhone(e.target.value)}
                          placeholder="e.g. (415) 555-0123"
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
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

            {/* EDIT NAME */}
            {modal.type === 'edit-name' && (
              <>
                <h3 className="text-xl font-black text-gray-800 mb-1">Rename Student</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {AVATARS[((modal.student.avatarId ?? 1) - 1) % 8]} currently: <strong>{modal.student.displayName ?? modal.student.name}</strong>
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">New Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="e.g. Alice Smith"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:border-keen-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                      Cancel
                    </button>
                    <button
                      onClick={() => saveName(modal.student.id)}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-keen-600 text-white font-bold hover:bg-keen-500 disabled:opacity-60"
                    >
                      {loading ? 'Saving…' : 'Save Name'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* EDIT PARENT */}
            {modal.type === 'edit-parent' && (
              <>
                <h3 className="text-xl font-black text-gray-800 mb-1">Parent Info</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {AVATARS[((modal.student.avatarId ?? 1) - 1) % 8]} {modal.student.displayName ?? modal.student.name}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Parent Name</label>
                    <input
                      type="text"
                      value={editParentName}
                      onChange={e => setEditParentName(e.target.value)}
                      placeholder="e.g. Jane Smith"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Parent Email</label>
                    <input
                      type="email"
                      value={editParentEmail}
                      onChange={e => setEditParentEmail(e.target.value)}
                      placeholder="e.g. jane@example.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Parent Phone</label>
                    <input
                      type="tel"
                      value={editParentPhone}
                      onChange={e => setEditParentPhone(e.target.value)}
                      placeholder="e.g. (415) 555-0123"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                      Cancel
                    </button>
                    <button
                      onClick={() => saveParent(modal.student.id)}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-60"
                    >
                      {loading ? 'Saving…' : 'Save'}
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
                  <p className="text-gray-500 text-sm mt-1">Their progress will be kept but they won&apos;t be able to log in.</p>
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

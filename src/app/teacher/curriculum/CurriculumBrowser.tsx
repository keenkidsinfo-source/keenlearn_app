'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CodingEditor } from './CodingEditor'

interface Week {
  id: string
  weekNumber: number
  title: string
  theme: string | null
  gradeBand: string
}

interface CodingItem {
  contentItemId: string
  title: string
  metadata: {
    language: 'scratch' | 'python'
    challenge?: string
    tagline?: string
    steps?: string[]
  } | null
}

interface Props {
  weeks: Week[]
  assignedMap: Record<string, string>
  classroomId: string
  codingMap: Record<string, CodingItem>
}

const pad = (n: number) => String(n).padStart(2, '0')

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return localDateStr(d)
}

function addWeeks(isoDate: string, n: number): string {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + n * 7)
  return localDateStr(d)
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const thisMonday = getMonday(new Date())

export function CurriculumBrowser({ weeks, assignedMap, classroomId, codingMap }: Props) {
  const [assigning, setAssigning]   = useState<string | null>(null)
  const [localMap, setLocalMap]     = useState<Record<string, string>>(assignedMap)
  const [localCoding, setLocalCoding] = useState<Record<string, CodingItem>>(codingMap)
  const [editingWeek, setEditingWeek] = useState<string | null>(null)
  const [error, setError]           = useState('')
  const [saved, setSaved]           = useState<string | null>(null)

  async function assign(curriculumId: string, weekStartDate: string) {
    setAssigning(curriculumId)
    setError('')
    try {
      const res = await fetch(`/api/v1/curriculum/${curriculumId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classroomId, weekStartDate }),
      })
      if (!res.ok) { setError('Failed to assign. Please try again.'); return }
      setLocalMap(prev => ({ ...prev, [curriculumId]: weekStartDate }))
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setAssigning(null)
    }
  }

  function handleSaved(weekId: string, contentItemId: string, updated: { title: string; metadata: any }) {
    setLocalCoding(prev => ({
      ...prev,
      [weekId]: { contentItemId, title: updated.title, metadata: updated.metadata },
    }))
    setEditingWeek(null)
    setSaved(weekId)
    setTimeout(() => setSaved(null), 2500)
  }

  if (weeks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-gray-500 font-semibold">No curriculum available for your grade band yet.</p>
        <p className="text-gray-400 text-sm mt-1">KeenKids will add new weeks soon!</p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm font-semibold">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        Schedule weeks for your class and edit coding projects for each week.
      </p>

      <div className="flex flex-col gap-4">
        {weeks.map((week, i) => {
          const assignedDate  = localMap[week.id]
          const suggestedDate = addWeeks(thisMonday, i)
          const coding        = localCoding[week.id]
          const isEditing     = editingWeek === week.id
          const justSaved     = saved === week.id

          return (
            <div
              key={week.id}
              className={cn(
                'bg-white rounded-2xl shadow-sm border-2 p-5 transition-all',
                assignedDate ? 'border-keen-300' : 'border-gray-100'
              )}
            >
              {/* ── Week header + assign controls ── */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Week {week.weekNumber}
                    </span>
                    {assignedDate && (
                      <span className="text-xs font-bold bg-keen-100 text-keen-700 px-2 py-0.5 rounded-full">
                        ✓ Assigned {formatDate(assignedDate)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-gray-800 text-lg leading-tight">{week.title}</h3>
                  {week.theme && <p className="text-gray-500 text-sm mt-0.5">{week.theme}</p>}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <select
                    className="text-sm border-2 border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-keen-400"
                    defaultValue={assignedDate ?? suggestedDate}
                    id={`date-${week.id}`}
                    onChange={e => {
                      const el = document.getElementById(`date-${week.id}`) as HTMLSelectElement
                      el.dataset.selected = e.target.value
                    }}
                  >
                    {Array.from({ length: 8 }, (_, n) => {
                      const d = addWeeks(thisMonday, n - 1)
                      return (
                        <option key={d} value={d}>Week of {formatDate(d)}</option>
                      )
                    })}
                  </select>
                  <button
                    onClick={() => {
                      const el = document.getElementById(`date-${week.id}`) as HTMLSelectElement
                      const date = el.dataset.selected ?? el.value
                      assign(week.id, date)
                    }}
                    disabled={assigning === week.id}
                    className={cn(
                      'min-w-[100px] px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95',
                      assignedDate
                        ? 'bg-keen-100 text-keen-700 hover:bg-keen-200'
                        : 'bg-keen-600 text-white hover:bg-keen-500',
                      assigning === week.id ? 'opacity-60' : ''
                    )}
                  >
                    {assigning === week.id ? '…' : assignedDate ? 'Reassign' : 'Assign'}
                  </button>
                </div>
              </div>

              {/* ── Coding project row ── */}
              {coding && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">💻</span>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{coding.title}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {coding.metadata?.language ?? 'scratch'} · {coding.metadata?.steps?.length ?? 0} steps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {justSaved && (
                        <span className="text-green-600 text-xs font-bold">✓ Saved</span>
                      )}
                      <button
                        onClick={() => setEditingWeek(isEditing ? null : week.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-sm font-bold transition-all',
                          isEditing
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-keen-100 hover:text-keen-700'
                        )}
                      >
                        {isEditing ? 'Close' : '✏️ Edit'}
                      </button>
                    </div>
                  </div>

                  {/* ── Inline editor ── */}
                  {isEditing && (
                    <CodingEditor
                      contentItemId={coding.contentItemId}
                      title={coding.title}
                      metadata={coding.metadata}
                      onSaved={(updated) => handleSaved(week.id, coding.contentItemId, updated)}
                      onCancel={() => setEditingWeek(null)}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  classroomId: string
  currentActiveWeek: number | null
  assignedWeeks: number[]   // week numbers that exist in classroom_curriculum
}

export function WeekOverrideControl({ classroomId, currentActiveWeek, assignedWeeks }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [active, setActive] = useState<number | null>(currentActiveWeek)

  async function setWeek(week: number | null) {
    setSaving(true)
    try {
      await fetch('/api/v1/teacher/classroom', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeWeek: week, classroomId }),
      })
      setActive(week)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 whitespace-nowrap">Preview week:</span>
      <select
        disabled={saving}
        value={active ?? ''}
        onChange={e => setWeek(e.target.value === '' ? null : Number(e.target.value))}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-keen-400 disabled:opacity-50"
      >
        <option value="">Auto (by date)</option>
        {assignedWeeks.map(w => (
          <option key={w} value={w}>Week {w}</option>
        ))}
      </select>
      {active != null && (
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
          👁 Teacher preview — students see their current week
        </span>
      )}
    </div>
  )
}

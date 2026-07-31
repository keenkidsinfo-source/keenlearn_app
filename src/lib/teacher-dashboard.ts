// Pure helper functions used by the teacher dashboard (src/app/teacher/page.tsx).
// Extracted so they can be unit tested without a database or React runtime.

export function getMondayStr(now: Date = new Date()): string {
  const today = now
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatWeekLabel(mondayStr: string): string {
  const d = new Date(mondayStr + 'T12:00:00')
  const friday = new Date(d)
  friday.setDate(d.getDate() + 4)
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = friday.toLocaleDateString('en-US', { month: 'short' })
  if (month === endMonth) return `${month} ${d.getDate()}–${friday.getDate()}`
  return `${month} ${d.getDate()} – ${endMonth} ${friday.getDate()}`
}

export interface StudentCompletion {
  id: string
  completedCount: number
  startedCount: number // includes completed
}

export interface ClassSummary {
  allDone: number
  inProgress: number
  notStarted: number
  classPct: number
}

// Summarizes per-student completion counts into the class-wide progress strip
// shown at the top of "This Week's Progress".
export function summarizeClassProgress(
  students: StudentCompletion[],
  totalThisWeek: number,
): ClassSummary {
  if (totalThisWeek <= 0 || students.length === 0) {
    return { allDone: 0, inProgress: 0, notStarted: students.length, classPct: 0 }
  }

  const allDone = students.filter(s => s.completedCount >= totalThisWeek).length
  const inProgress = students.filter(s => {
    return s.startedCount > 0 && s.completedCount < totalThisWeek
  }).length
  const notStarted = students.length - allDone - inProgress
  const classPct = Math.round(
    (students.reduce((sum, s) => sum + s.completedCount, 0) / (students.length * totalThisWeek)) * 100,
  )

  return { allDone, inProgress, notStarted, classPct }
}

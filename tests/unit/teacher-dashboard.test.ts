import { describe, it, expect } from 'vitest'
import { getMondayStr, addDays, formatWeekLabel, summarizeClassProgress } from '@/lib/teacher-dashboard'

describe('getMondayStr', () => {
  it('returns the same date when given a Monday', () => {
    // 2026-08-17 is a Monday
    expect(getMondayStr(new Date('2026-08-17T09:00:00'))).toBe('2026-08-17')
  })

  it('rolls forward-dated weekday back to Monday', () => {
    // 2026-08-20 is a Thursday
    expect(getMondayStr(new Date('2026-08-20T09:00:00'))).toBe('2026-08-17')
  })

  it('rolls Sunday back to the preceding Monday', () => {
    // 2026-08-23 is a Sunday
    expect(getMondayStr(new Date('2026-08-23T09:00:00'))).toBe('2026-08-17')
  })
})

describe('addDays', () => {
  it('adds days within the same month', () => {
    expect(addDays('2026-08-17', 3)).toBe('2026-08-20')
  })

  it('rolls over a month boundary', () => {
    expect(addDays('2026-08-30', 3)).toBe('2026-09-02')
  })

  it('supports negative offsets', () => {
    expect(addDays('2026-08-17', -7)).toBe('2026-08-10')
  })
})

describe('formatWeekLabel', () => {
  it('formats a week that stays within one month', () => {
    expect(formatWeekLabel('2026-08-17')).toBe('Aug 17–21')
  })

  it('formats a week that spans two months', () => {
    expect(formatWeekLabel('2026-08-31')).toBe('Aug 31 – Sep 4')
  })
})

describe('summarizeClassProgress', () => {
  it('returns all zeros with notStarted = student count when there is nothing assigned this week', () => {
    const result = summarizeClassProgress([{ id: 's1', completedCount: 0, startedCount: 0 }], 0)
    expect(result).toEqual({ allDone: 0, inProgress: 0, notStarted: 1, classPct: 0 })
  })

  it('classifies done / in-progress / not-started correctly', () => {
    const students = [
      { id: 's1', completedCount: 3, startedCount: 3 }, // all done
      { id: 's2', completedCount: 1, startedCount: 2 }, // in progress
      { id: 's3', completedCount: 0, startedCount: 0 }, // not started
    ]
    const result = summarizeClassProgress(students, 3)
    expect(result.allDone).toBe(1)
    expect(result.inProgress).toBe(1)
    expect(result.notStarted).toBe(1)
    expect(result.classPct).toBe(Math.round(((3 + 1 + 0) / (3 * 3)) * 100))
  })

  it('treats a student who started but has 0 completed as in progress, not done', () => {
    const students = [{ id: 's1', completedCount: 0, startedCount: 1 }]
    const result = summarizeClassProgress(students, 2)
    expect(result.inProgress).toBe(1)
    expect(result.allDone).toBe(0)
  })

  it('handles an empty roster without dividing by zero', () => {
    const result = summarizeClassProgress([], 5)
    expect(result).toEqual({ allDone: 0, inProgress: 0, notStarted: 0, classPct: 0 })
  })
})

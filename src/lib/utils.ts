import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Subject } from '@/lib/db/schema'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Subject → color mapping (matches tailwind.config.ts)
export const SUBJECT_COLORS: Record<Subject, { bg: string; text: string; border: string; light: string }> = {
  science:    { bg: 'bg-science',   text: 'text-science-dark',   border: 'border-science',   light: 'bg-science-light'   },
  coding:     { bg: 'bg-coding',    text: 'text-coding-dark',    border: 'border-coding',    light: 'bg-coding-light'    },
  build:      { bg: 'bg-build',     text: 'text-build-dark',     border: 'border-build',     light: 'bg-build-light'     },
  arts:       { bg: 'bg-arts',      text: 'text-arts-dark',      border: 'border-arts',      light: 'bg-arts-light'      },
  math:       { bg: 'bg-math',      text: 'text-math-dark',      border: 'border-math',      light: 'bg-math-light'      },
  reading:    { bg: 'bg-reading',   text: 'text-reading-dark',   border: 'border-reading',   light: 'bg-reading-light'   },
  creativity:       { bg: 'bg-keen-500',     text: 'text-keen-900',          border: 'border-keen-500',     light: 'bg-keen-100'          },
  public_speaking:  { bg: 'bg-teal-500',     text: 'text-teal-900',          border: 'border-teal-500',     light: 'bg-teal-50'           },
  free_build:       { bg: 'bg-orange-400',   text: 'text-orange-900',        border: 'border-orange-400',   light: 'bg-orange-50'         },
}

// Subject → emoji
export const SUBJECT_EMOJI: Record<Subject, string> = {
  science:    '🔬',
  coding:     '💻',
  build:      '🏗️',
  math:       '➕',
  arts:       '🎨',
  reading:    '📖',
  creativity:      '✨',
  public_speaking: '🎤',
  free_build:      '🛠️',
}

// Subject → display label
export const SUBJECT_LABEL: Record<Subject, string> = {
  science:    'Science',
  coding:     'Coding',
  build:      'Build',
  math:       'Math',
  arts:       'Arts',
  reading:    'Reading',
  creativity:      'Creativity',
  public_speaking: 'Public Speaking',
  free_build:      'Free Build',
}

// Day index → display label
export const DAY_LABELS: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
}

// Generate a random 6-char classroom access code
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// Standard API error response shape
export function apiError(message: string, code: string, status: number) {
  return Response.json({ error: message, code, status }, { status })
}

// Standard API success response shape
export function apiOk<T>(data: T, status = 200) {
  return Response.json({ data, status }, { status })
}

// Build result field definitions — stored in content_items.metadata.resultFields
// Every seed script should include this block, customised for that project.

export interface ResultField {
  label: string
  key: string
}

export interface ResultFields {
  a:               ResultField
  b:               ResultField
  c?:              ResultField   // optional — some builds only have 2 data points
  unit:            string
  leaderboard:     'more' | 'less'  // 'more' = higher is better, 'less' = lower is better
  showLeaderboard: boolean
}

// Fallbacks used when content was seeded before resultFields was introduced
export const DEFAULT_RESULT_FIELDS: Record<'g1-2' | 'g3-4', ResultFields> = {
  'g1-2': {
    a:               { label: 'Round 1 — paperclips carried',     key: 'round1Clips'   },
    b:               { label: 'After your fix — clips carried',   key: 'afterFixClips' },
    c:               { label: 'Your BEST — maximum paperclips 🏆', key: 'maxClips'     },
    unit:            'clips',
    leaderboard:     'more',
    showLeaderboard: false,
  },
  'g3-4': {
    a:               { label: 'First attempt — rocks held',    key: 'cranksNoLoad'   },
    b:               { label: 'After adjustment — rocks held', key: 'cranksWithLoad' },
    c:               { label: 'Best rocks held 🏆',            key: 'cranksImproved' },
    unit:            'rocks',
    leaderboard:     'more',
    showLeaderboard: true,
  },
}

export function getResultFields(meta: Record<string, any>, gradeBand: string): ResultFields {
  if (meta?.resultFields) return meta.resultFields as ResultFields
  const key = gradeBand === 'g1-2' ? 'g1-2' : 'g3-4'
  return DEFAULT_RESULT_FIELDS[key]
}

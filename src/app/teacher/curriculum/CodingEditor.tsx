'use client'

import { useState } from 'react'

interface CodingMeta {
  language: 'scratch' | 'python'
  challenge?: string
  tagline?: string
  steps?: string[]
}

interface Props {
  contentItemId: string
  title: string
  metadata: CodingMeta | null
  onSaved: (updated: { title: string; metadata: CodingMeta }) => void
  onCancel: () => void
}

export function CodingEditor({ contentItemId, title: initTitle, metadata, onSaved, onCancel }: Props) {
  const [title, setTitle]         = useState(initTitle)
  const [challenge, setChallenge] = useState(metadata?.challenge ?? initTitle)
  const [tagline, setTagline]     = useState(metadata?.tagline ?? '')
  const [language, setLanguage]   = useState<'scratch' | 'python'>(metadata?.language ?? 'scratch')
  const [steps, setSteps]         = useState<string[]>(metadata?.steps ?? [''])
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  function updateStep(i: number, val: string) {
    setSteps(prev => prev.map((s, idx) => idx === i ? val : s))
  }

  function addStep() {
    setSteps(prev => [...prev, ''])
  }

  function removeStep(i: number) {
    setSteps(prev => prev.filter((_, idx) => idx !== i))
  }

  function moveStep(i: number, dir: -1 | 1) {
    setSteps(prev => {
      const next = [...prev]
      const tmp = next[i]
      next[i] = next[i + dir]
      next[i + dir] = tmp
      return next
    })
  }

  async function save() {
    const filtered = steps.filter(s => s.trim())
    if (!title.trim() || !challenge.trim() || filtered.length === 0) {
      setError('Title, challenge name, and at least one step are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/v1/teacher/content-items/${contentItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, challenge, tagline, language, steps: filtered }),
      })
      if (!res.ok) { setError('Failed to save. Try again.'); return }
      onSaved({ title, metadata: { language, challenge, tagline, steps: filtered } })
    } catch {
      setError('Network error. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">Edit Coding Project</h4>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-3 text-sm">{error}</div>
      )}

      <div className="flex flex-col gap-3">
        {/* Title + Language row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 mb-1 block">Project Title</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); setChallenge(e.target.value) }}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-keen-400"
              placeholder="e.g. Rescue Mission"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as 'scratch' | 'python')}
              className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-keen-400 h-[42px]"
            >
              <option value="scratch">Scratch</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Tagline <span className="font-normal text-gray-400">(shown to students)</span></label>
          <input
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400"
            placeholder="e.g. Control a crane to rescue people before time runs out!"
          />
        </div>

        {/* Steps */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-2 block">
            Step-by-step instructions <span className="font-normal text-gray-400">({steps.length} steps)</span>
          </label>
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs font-black text-gray-300 mt-2.5 w-5 shrink-0 text-right">{i + 1}.</span>
                <textarea
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                  rows={2}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-keen-400 resize-none"
                  placeholder={i === 0 ? 'e.g. 🎭 Backdrop: Click the white Stage area...' : 'Next step...'}
                />
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(i, -1)}
                    disabled={i === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs px-1"
                    title="Move up"
                  >▲</button>
                  <button
                    onClick={() => moveStep(i, 1)}
                    disabled={i === steps.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs px-1"
                    title="Move down"
                  >▼</button>
                  <button
                    onClick={() => removeStep(i)}
                    disabled={steps.length === 1}
                    className="text-red-300 hover:text-red-500 disabled:opacity-20 text-xs px-1"
                    title="Remove step"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addStep}
            className="mt-2 text-keen-600 hover:text-keen-800 text-sm font-bold flex items-center gap-1"
          >
            + Add step
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-keen-600 text-white hover:bg-keen-500 disabled:opacity-50 active:scale-95 transition-all"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

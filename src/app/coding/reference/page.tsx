import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const CATS = [
  {
    color: '#ffab19',
    bg: '#fff8ed',
    border: '#ffd07a',
    emoji: '🟡',
    label: 'EVENTS',
    week: 'W1',
    tagline: 'Always the FIRST block — nothing runs without it',
    when: 'Start every code stack with an Events block. Without one, clicking the green flag does nothing.',
    blocks: [
      { name: 'when 🚩 clicked', use: 'Runs code when the green flag is pressed. Use this to set everything up at the start.' },
      { name: 'when [key] pressed', use: 'Runs code each time a key is held. Use for movement (arrows) or firing (space).' },
    ],
  },
  {
    color: '#4c97ff',
    bg: '#eff6ff',
    border: '#93c5fd',
    emoji: '🔵',
    label: 'MOTION',
    week: 'W1',
    tagline: 'Move and position sprites on the stage',
    when: 'Use Motion to slide sprites left/right/up/down, teleport them, or place them at a starting position.',
    blocks: [
      { name: 'change x by 15', use: 'Adds 15 to x position — sprite moves RIGHT. Negative = LEFT.' },
      { name: 'change y by 15', use: 'Adds 15 to y position — sprite moves UP. Negative = DOWN.' },
      { name: 'go to x: y:', use: 'Teleports sprite instantly to exact coordinates.' },
      { name: 'go to [Sprite]', use: 'Teleports to another sprite\'s current position. Use for bullets before "show".' },
    ],
  },
  {
    color: '#ff8c1a',
    bg: '#fff7ed',
    border: '#fdba74',
    emoji: '🟠',
    label: 'CONTROL',
    week: 'W2',
    tagline: 'Repeat, loop, and make decisions',
    when: 'Use Control when you need something to keep happening (forever/repeat) or only happen under a condition (if-then).',
    blocks: [
      { name: 'forever', use: 'Loops endlessly. Use for things that run the whole game: movement, falling, checking.' },
      { name: 'repeat (10)', use: 'Loops exactly N times then stops. Use when you know the exact count.' },
      { name: 'repeat until <condition>', use: 'Loops until condition becomes true. Use for bullets flying until they exit.' },
      { name: 'if <condition> then', use: 'Runs inside code only when condition is true. Use to react to touching, key presses.' },
    ],
  },
  {
    color: '#9966ff',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    emoji: '🟣',
    label: 'LOOKS',
    week: 'W4',
    tagline: 'Change what players see — show, hide, costumes',
    when: 'Use Looks for the "invisible bullet" trick: hide at start, show when fired, hide when done. Also for animations.',
    blocks: [
      { name: 'hide', use: 'Makes sprite invisible. It still exists and code still runs on it — just can\'t be seen.' },
      { name: 'show', use: 'Makes a hidden sprite visible again.' },
      { name: 'next costume', use: 'Switches to the next costume image — makes sprites look like they\'re walking or animating.' },
      { name: 'say [text] for 2 secs', use: 'Shows a speech bubble. Use for score feedback ("Ouch!", "Got it!").' },
    ],
  },
  {
    color: '#5cb1d6',
    bg: '#f0f9ff',
    border: '#7dd3fc',
    emoji: '🔵',
    label: 'SENSING',
    week: 'W3',
    tagline: 'Detect collisions and the state of the world',
    when: 'Sensing blocks ask YES/NO questions. They must go inside a hexagon-shaped gap in if-then or repeat-until.',
    blocks: [
      { name: 'touching [Sprite]?', use: 'YES if the two sprites are overlapping even slightly. Use for scoring, catching, hitting.' },
      { name: 'touching [edge]?', use: 'YES if the sprite has reached the edge of the stage. Use with "if on edge, bounce".' },
      { name: 'key [space] pressed?', use: 'YES while a key is held down. Alternative to the Events "when key pressed" block.' },
    ],
  },
]

export default async function CodingReferencePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const backHref = session.role === 'student' ? '/dashboard' : '/teacher'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href={backHref} className="text-slate-500 hover:text-slate-700 text-sm font-semibold">← Back</Link>
        <h1 className="text-xl font-black text-slate-800">Scratch Block Reference 🗂️</h1>
        <span className="ml-auto text-xs text-slate-400 font-semibold">G1-2 · All Weeks</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <p className="text-sm text-slate-500 text-center">
          All 5 block categories used across the 5-week program. Each category has a color — use it to find blocks in Scratch.
        </p>

        {CATS.map(cat => (
          <div
            key={cat.label}
            className="rounded-2xl border-2 overflow-hidden shadow-sm"
            style={{ borderColor: cat.border, background: cat.bg }}
          >
            {/* Category header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: cat.color }}>
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <p className="text-white font-black text-lg leading-none">{cat.label}</p>
                <p className="text-white/80 text-xs font-semibold mt-0.5">Introduced {cat.week} · {cat.tagline}</p>
              </div>
            </div>

            {/* When to use */}
            <div className="px-5 pt-3 pb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">When to use</p>
              <p className="text-sm text-slate-700">{cat.when}</p>
            </div>

            {/* Block list */}
            <div className="px-5 pt-3 pb-4 grid gap-2">
              {cat.blocks.map(b => (
                <div key={b.name} className="flex gap-3 items-start">
                  <span
                    className="shrink-0 px-2.5 py-1 rounded-lg text-white text-xs font-black whitespace-nowrap"
                    style={{ background: cat.color }}
                  >
                    {b.name}
                  </span>
                  <p className="text-sm text-slate-600 pt-0.5">{b.use}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-slate-400 pb-4">
          Tip: in Scratch, click a category name on the left panel to highlight all its blocks.
        </p>
      </div>
    </div>
  )
}

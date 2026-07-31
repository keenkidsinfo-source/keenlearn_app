'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { TheoryDeck } from '@/lib/theory-slides'
import { SLIDE_COLORS } from '@/lib/theory-slides'

interface Props {
  deck: TheoryDeck
  buildDayId: string
}

/** Renders inline markdown-style bold (**text**) and italic (*text*) */
function InlineMarkdown({ text }: { text: string }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function TheoryViewer({ deck, buildDayId }: Props) {
  const router = useRouter()
  const [slide, setSlide] = useState(0)

  const total = deck.slides.length
  const current = deck.slides[slide]
  const colors = SLIDE_COLORS[current.color]
  const isLast = slide === total - 1
  const isG12 = deck.gradeBand === 'g1-2'

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className={cn('text-white px-4 py-4 flex items-center gap-3', colors.badge)}>
        <button
          onClick={() => router.push(`/build/day/${buildDayId}`)}
          className="text-white/70 text-2xl hover:text-white"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {isG12 ? 'Grades 1–2' : 'Grades 3–4'} · Theory
            </span>
          </div>
          <h1 className="font-black text-lg">{deck.title}</h1>
          <p className="text-white/70 text-xs">{deck.subject}</p>
        </div>
        <span className="text-white/70 font-bold whitespace-nowrap">{slide + 1} / {total}</span>
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 flex">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={cn(
              'flex-1 transition-all duration-300',
              i < slide ? colors.badge + ' opacity-60'
                : i === slide ? colors.badge
                : 'bg-gray-700'
            )}
          />
        ))}
      </div>

      {/* Main slide */}
      <main className="flex-1 flex flex-col p-4 gap-4 max-w-2xl mx-auto w-full py-6">

        {/* Slide card */}
        <div className={cn('rounded-2xl border-2 p-6 flex flex-col gap-4 shadow-lg', colors.bg, colors.border)}>
          {/* Emoji + Title */}
          <div className="flex items-center gap-4">
            <span className="text-5xl">{current.emoji}</span>
            <div>
              <p className={cn('text-xs font-bold uppercase tracking-widest opacity-60', colors.text)}>
                Slide {slide + 1} of {total}
              </p>
              <h2 className={cn('text-2xl font-black', colors.text)}>{current.title}</h2>
            </div>
          </div>

          {/* Headline */}
          <div className={cn('rounded-xl px-4 py-3 border border-black/10', colors.headlineBg)}>
            <p className={cn('font-bold text-base leading-snug', colors.text)}>
              <InlineMarkdown text={current.headline} />
            </p>
          </div>

          {/* Bullet points */}
          <ul className="flex flex-col gap-2.5">
            {current.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={cn('shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black mt-0.5', colors.badge)}>
                  {i + 1}
                </span>
                <span className={cn('text-sm leading-relaxed', colors.text)}>
                  <InlineMarkdown text={b} />
                </span>
              </li>
            ))}
          </ul>

          {/* Vocab box */}
          {current.vocab && (
            <div className="bg-white/60 border border-white/80 rounded-xl px-4 py-3">
              <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-0.5">📚 Key Word</p>
              <p className={cn('font-black text-base', colors.text)}>{current.vocab.word}</p>
              <p className="text-gray-600 text-sm">{current.vocab.definition}</p>
            </div>
          )}

          {/* Try This */}
          {current.tryThis && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-xs font-black uppercase tracking-wider text-yellow-700 mb-1">🙋 Ask the Class</p>
              <p className="text-yellow-900 text-sm font-semibold italic">{current.tryThis}</p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="p-4 pb-8 flex gap-3 max-w-2xl mx-auto w-full">
        <button
          onClick={() => setSlide(s => Math.max(0, s - 1))}
          disabled={slide === 0}
          className="flex-1 min-h-[56px] rounded-2xl border-2 border-gray-600 text-gray-300 font-bold text-lg disabled:opacity-20 active:scale-95 transition-all"
        >
          ← Back
        </button>

        {isLast ? (
          <button
            onClick={() => router.push(`/build/day/${buildDayId}`)}
            className={cn(
              'min-h-[56px] px-8 rounded-2xl text-white font-bold text-lg active:scale-95 transition-all shadow',
              colors.badge
            )}
            style={{ flex: 2 }}
          >
            🔨 Start Building!
          </button>
        ) : (
          <button
            onClick={() => setSlide(s => Math.min(total - 1, s + 1))}
            className={cn(
              'min-h-[56px] px-8 rounded-2xl text-white font-bold text-lg active:scale-95 transition-all shadow',
              colors.badge
            )}
            style={{ flex: 2 }}
          >
            Next Slide →
          </button>
        )}
      </footer>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { scienceLabs } from '@/lib/scienceLabs'
import Link from 'next/link'

export default async function TeacherSciencePage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">🔬 Science Lab — Instructor Manual</h1>
            <p className="text-teal-200 text-sm mt-0.5">KeenKids STEAM · August 2025 · Mattos & Sinnott Elementary</p>
          </div>
          <Link href="/teacher" className="text-teal-200 text-sm hover:text-white">← Dashboard</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-12">
        {scienceLabs.map(lab => (
          <div key={lab.id} className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            {/* Lab title */}
            <div className="bg-teal-600 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{lab.emoji}</span>
                <div>
                  <h2 className="text-xl font-black">{lab.title}</h2>
                  <p className="text-teal-200 text-sm">
                    {new Date(lab.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    {' · '}{lab.conceptShort}
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-teal-700 rounded-xl px-4 py-2">
                <p className="text-yellow-300 font-semibold text-sm">✨ Wow factor: {lab.wowFactor}</p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">

              {/* Materials */}
              <section>
                <h3 className="text-lg font-black text-gray-800 mb-2">📦 Materials Needed</h3>
                <ul className="grid grid-cols-2 gap-1">
                  {lab.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                      <span className="text-teal-500 shrink-0 mt-0.5">•</span>{m}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Setup Notes */}
              <section>
                <h3 className="text-lg font-black text-gray-800 mb-2">⚙️ Setup Notes</h3>
                <ol className="flex flex-col gap-1.5">
                  {lab.setupNotes.map((n, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-xs">{i+1}</span>
                      {n}
                    </li>
                  ))}
                </ol>
              </section>

              {/* Safety */}
              <section className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <h3 className="font-black text-red-700 mb-1">⚠️ Safety Notes</h3>
                <p className="text-red-800 text-sm">{lab.safetyNotes}</p>
              </section>

              {/* Session Plan */}
              <section>
                <h3 className="text-lg font-black text-gray-800 mb-2">📋 Session Plan</h3>
                <div className="flex flex-col gap-2">
                  {lab.sessionPlan.map((phase, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">{phase.time}</span>
                        <span className="font-bold text-gray-800 text-sm">{phase.phase}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{phase.instructions}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* The Science Behind It */}
              <section className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-4">
                <h3 className="font-black text-blue-800 mb-2">🧪 The Science Behind It</h3>
                <p className="text-blue-900 text-sm leading-relaxed">{lab.scienceBehindIt}</p>
              </section>

              {/* Student explanation */}
              <section className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                <h3 className="font-black text-yellow-800 mb-1">💬 Kid-Friendly Explanation (say this to students)</h3>
                <p className="text-yellow-900 text-sm leading-relaxed italic">&ldquo;{lab.kidExplanation}&rdquo;</p>
              </section>

              {/* Discussion Questions */}
              <section>
                <h3 className="text-lg font-black text-gray-800 mb-2">💡 Discussion Questions</h3>
                <div className="flex flex-col gap-3">
                  {lab.discussionQuestions.map((q, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3">
                      <p className="font-semibold text-gray-800 text-sm">{i+1}. {q.question}</p>
                      <p className="text-gray-500 text-xs mt-1 italic">→ {q.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Vocabulary */}
              <section>
                <h3 className="text-lg font-black text-gray-800 mb-2">📚 Vocabulary</h3>
                <div className="flex flex-col gap-2">
                  {lab.vocab.map((v, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="font-bold text-gray-800 shrink-0 w-40">{v.word}</span>
                      <span className="text-gray-600">{v.definition}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Real-world connections */}
              <section>
                <h3 className="text-lg font-black text-gray-800 mb-2">🌍 Real-World Connections</h3>
                <ul className="flex flex-col gap-1">
                  {lab.realWorld.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                      <span className="text-teal-500 shrink-0 mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Reference video */}
              {lab.referenceVideo && (
                <section>
                  <h3 className="text-lg font-black text-gray-800 mb-1">🎥 Reference Video</h3>
                  <a href={lab.referenceVideo} target="_blank" rel="noopener noreferrer"
                    className="text-teal-600 text-sm underline break-all">
                    {lab.referenceVideo}
                  </a>
                </section>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

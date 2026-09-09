export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/jwt'
import { TeacherSidebar } from '../TeacherSidebar'

export default async function CurriculumGuidePage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'student') redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-keen-700 text-white px-6 py-4 flex-shrink-0">
        <h1 className="text-xl font-black">📋 How to Add a New Week</h1>
        <p className="text-keen-200 text-sm mt-0.5">Step-by-step guide for adding curriculum for a new week</p>
      </header>

      <div className="flex flex-1">
        <TeacherSidebar activePage="curriculum" email={session.email} />

        <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6 flex flex-col gap-6 max-w-3xl">

          {/* Overview */}
          <section className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
            <h2 className="font-black text-blue-800 text-lg mb-2">📌 How the curriculum works</h2>
            <p className="text-blue-900 text-sm leading-relaxed">
              Curriculum lives in <strong>two places</strong> that must both be updated when adding a new week:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <div className="bg-white rounded-xl px-4 py-3 border border-blue-100">
                <p className="font-bold text-blue-800 text-sm">1. Source code files (hardcoded)</p>
                <p className="text-blue-700 text-xs mt-0.5">
                  <code className="bg-blue-50 px-1 rounded">src/lib/scienceLabs.ts</code> — controls what the science lab pages show.<br/>
                  Build day SVG images in <code className="bg-blue-50 px-1 rounded">public/build/</code> — the step-by-step diagrams.
                </p>
              </div>
              <div className="bg-white rounded-xl px-4 py-3 border border-blue-100">
                <p className="font-bold text-blue-800 text-sm">2. Database (seeded via scripts)</p>
                <p className="text-blue-700 text-xs mt-0.5">
                  All other content — speaking sessions, science steps, build steps, coding projects — lives in the DB and is added by running seed scripts in Terminal.
                </p>
              </div>
            </div>
          </section>

          {/* Quick checklist */}
          <section className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
            <h2 className="font-black text-gray-800 text-lg mb-3">⚡ Quick checklist — run in this order</h2>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, label: 'Update scienceLabs.ts', detail: 'Add the new week\'s lab entry to src/lib/scienceLabs.ts (copy an existing entry as a template)' },
                { n: 2, label: 'Run seed-science.mjs', detail: 'node scripts/seed-science.mjs — adds science steps for G1-2 and G3-4 to the DB' },
                { n: 3, label: 'Run seed-speakup.mjs', detail: 'node scripts/seed-speakup.mjs — adds public speaking session plan for the new week' },
                { n: 4, label: 'Run seed-build-wN.mjs', detail: 'node scripts/seed-build-w2.mjs (or whichever week) — adds build day steps and SVG paths' },
                { n: 5, label: 'Run fix-week-dates.mjs', detail: 'node scripts/fix-week-dates.mjs — assigns curriculum to classrooms with correct Monday dates. Update TOTAL_WEEKS at top of this file first.' },
                { n: 6, label: 'Verify everything', detail: 'node scripts/verify-curriculum.mjs — checks DB and reports any missing content. Fix anything flagged before demoing.' },
                { n: 7, label: 'Commit and push', detail: 'git add -A && git commit -m "Add Week N curriculum" && git push — deploys to Vercel in ~2 min' },
              ].map(step => (
                <li key={step.n} className="flex items-start gap-3">
                  <span className="bg-keen-100 text-keen-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs mt-0.5">{step.n}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{step.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Science */}
          <section className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
            <h2 className="font-black text-gray-800 text-base mb-3">🔬 Science — adding a new week</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-800">
                🚧 <strong>Coming soon:</strong> An admin form will let you add science labs without touching any code. Until then, a developer needs to edit the file below.
              </div>
              <p><strong>File to edit (developer only for now):</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">src/lib/scienceLabs.ts</code></p>
              <p>Copy the last entry in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">scienceLabs</code> array and fill in the new lab. Key fields:</p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-xs text-gray-600">
                <li><strong>id</strong> — unique slug, e.g. <code>sep-17-balloon-rocket</code></li>
                <li><strong>date</strong> — the Thursday of that week (YYYY-MM-DD)</li>
                <li><strong>title, emoji, conceptShort, kidExplanation</strong> — student-facing text</li>
                <li><strong>vocab</strong> — 3–5 words, each with a color (blue/green/orange/purple/red)</li>
                <li><strong>sessionPlan</strong> — teacher-only minute-by-minute plan (shown in teacher manual)</li>
              </ul>
              <p className="text-xs text-gray-500 mt-1">G1-2 students see first 3 vocab words and first 2 discussion questions. G3-4 sees all.</p>
              <p className="mt-2"><strong>Then run:</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">node scripts/seed-science.mjs</code></p>
              <p className="text-xs text-gray-500">Add G1-2 and G3-4 entries with separate step arrays — different vocabulary/depth for each grade band.</p>
            </div>
          </section>

          {/* Build Day */}
          <section className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
            <h2 className="font-black text-gray-800 text-base mb-3">🔧 Build Day — adding a new week</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <p><strong>Two parts:</strong> SVG diagrams + seed script.</p>
              <p className="font-semibold">Step 1 — Create SVG step images</p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-xs text-gray-600">
                <li>G1-2 images go in <code>public/build/g12-wN/</code></li>
                <li>G3-4 images go in <code>public/build/g34-wN/</code></li>
                <li>Name them <code>step-01.svg</code>, <code>step-02.svg</code>, etc.</li>
                <li>Each SVG should show one construction step clearly — keep it simple and large</li>
                <li>Tip: generate these with Claude by describing the step in plain English</li>
              </ul>
              <p className="font-semibold mt-2">Step 2 — Create seed-build-wN.mjs</p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-xs text-gray-600">
                <li>Copy <code>scripts/seed-build-w2.mjs</code> → <code>scripts/seed-build-w3.mjs</code></li>
                <li>Update <code>WEEK_NUMBER</code>, step titles, materials, and image paths</li>
                <li>Run: <code>node scripts/seed-build-w3.mjs</code></li>
              </ul>
              <p className="text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2 mt-2">
                ⚠️ Build day images load lazily (only when teacher clicks a step) — they don&apos;t slow down the page on load.
              </p>
            </div>
          </section>

          {/* Public Speaking */}
          <section className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
            <h2 className="font-black text-gray-800 text-base mb-3">🎤 Public Speaking — adding a new week</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <p><strong>File to edit:</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">scripts/seed-speakup.mjs</code></p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-xs text-gray-600">
                <li>Add a G1-2 entry and a G3-4 entry for the new week</li>
                <li>Each entry has: <code>weekNumber</code>, <code>title</code>, <code>theme</code>, <code>steps</code> (the session plan)</li>
                <li>G1-2 steps use simple language and short sentences — kids read these on screen</li>
                <li>G3-4 steps can include more complex vocabulary and reasoning</li>
                <li>See SpeakUp_TeacherGuide_v5.docx for the full 32-week content to pull from</li>
              </ul>
              <p className="mt-2"><strong>Then run:</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">node scripts/seed-speakup.mjs</code></p>
            </div>
          </section>

          {/* Coding */}
          <section className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
            <h2 className="font-black text-gray-800 text-base mb-3">💻 Coding — adding a new week</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <p>Coding is simpler — students continue building their existing Scratch project across weeks. There&apos;s no new content to seed for most weeks.</p>
              <p className="text-xs text-gray-500">If a new project type is introduced (e.g. Week 3 starts a new challenge), update <code>scripts/seed-coding.mjs</code> and re-run it.</p>
            </div>
          </section>

          {/* Dates */}
          <section className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
            <h2 className="font-black text-gray-800 text-base mb-3">📅 Week dates — keeping them correct</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <p><strong>File to update:</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">scripts/fix-week-dates.mjs</code></p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-xs text-gray-600">
                <li>Update <code>TOTAL_WEEKS</code> to the new total number of weeks</li>
                <li><code>SCHOOL_START</code> should already be set to the Monday of Week 1 — don&apos;t change it</li>
                <li>Run: <code>node scripts/fix-week-dates.mjs</code></li>
                <li>This assigns each classroom to the correct curriculum week with the right Monday date</li>
              </ul>
              <p className="text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2 mt-2">
                ⚠️ If you forget this step, students will see the wrong week&apos;s content or Week 1 instead of the current week.
              </p>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
            <h2 className="font-black text-red-800 text-base mb-3">🚨 Common problems &amp; fixes</h2>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { problem: 'Students see Week 1 instead of the current week', fix: 'Run fix-week-dates.mjs — classroom_curriculum rows are missing or have wrong dates' },
                { problem: 'Teacher science page shows wrong week', fix: 'Check scienceLabs.ts — the new entry\'s date must fall within the current Mon–Fri window' },
                { problem: 'Science lab shows old content on student page', fix: 'getCurrentLab() uses lab.title to detect type — make sure the new lab title includes a distinctive word' },
                { problem: 'Build day steps are missing', fix: 'Run seed-build-wN.mjs for the new week, then run fix-week-dates.mjs again' },
                { problem: 'Changes don\'t show on Vercel', fix: 'You\'re editing localhost only — run: git add -A && git commit -m "..." && git push' },
                { problem: 'verify-curriculum reports missing content', fix: 'Run the scripts in order: seed-science → seed-speakup → seed-build → fix-week-dates → verify again' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl px-4 py-3 border border-red-100">
                  <p className="font-bold text-red-700 text-xs">❌ {item.problem}</p>
                  <p className="text-gray-700 text-xs mt-1">→ {item.fix}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Terminal commands reference */}
          <section className="bg-gray-800 rounded-2xl px-5 py-4 text-green-300 font-mono text-xs">
            <p className="text-white font-black text-sm mb-3">💻 All commands — copy &amp; paste</p>
            <pre className="whitespace-pre-wrap leading-relaxed">{`# Run all seeds for a new week (replace N with week number)
node scripts/seed-science.mjs
node scripts/seed-speakup.mjs
node scripts/seed-build-wN.mjs

# Update TOTAL_WEEKS in fix-week-dates.mjs first, then:
node scripts/fix-week-dates.mjs

# Verify everything is in place
node scripts/verify-curriculum.mjs

# Deploy to Vercel
git add -A
git commit -m "Add Week N curriculum"
git push`}</pre>
          </section>

        </main>
      </div>
    </div>
  )
}

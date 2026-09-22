'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/db/schema'

interface Props {
  contentItemId: string
  sessionContentItemId: string   // content_items.id — used for step progress persistence
  title: string
  theme: string
  language: 'scratch' | 'python'
  projectId: string | null
  projectUrl: string | null
  starterUrl?: string | null      // pre-seeded .sb3 to load for brand-new projects
  savedCode: string | null
  gradeBand: GradeBand | null
  challenge?: string
  tagline?: string
  steps?: string[]
  initialStep?: number
}

// ── Text-to-speech helper ──────────────────────────────────────────────────
// Splits on sentence-ending punctuation and inserts a 500 ms pause between each sentence.
function speak(text: string, baseRate = 0.6) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()

  // Strip emojis and non-ASCII so the voice doesn't stumble
  const clean = text.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, ' ').trim()

  // Split into sentences on . ! ? — keep the punctuation with the sentence
  const sentences = clean.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) ?? [clean]

  // Pick the most natural-sounding available voice (prefer Samantha, Google US English, etc.)
  const voices = window.speechSynthesis.getVoices()
  const preferred = ['Samantha', 'Google US English', 'Karen', 'Moira', 'Google UK English Female']
  const voice = preferred.reduce<SpeechSynthesisVoice | null>((found, name) =>
    found ?? voices.find(v => v.name.includes(name)) ?? null, null)

  function speakNext(i: number) {
    if (i >= sentences.length) return
    const s   = sentences[i]
    const utt = new SpeechSynthesisUtterance(s)
    if (voice) utt.voice = voice

    // Vary pitch + rate by sentence type for expressiveness
    if (s.endsWith('?')) {
      utt.pitch = 1.3
      utt.rate  = baseRate + 0.05
    } else if (s.endsWith('!')) {
      utt.pitch = 1.2
      utt.rate  = baseRate + 0.1
    } else if (i === 0) {
      utt.pitch = 1.15
      utt.rate  = baseRate
    } else {
      utt.pitch = 1.0
      utt.rate  = baseRate
    }

    utt.onend = () => {
      if (i + 1 < sentences.length) {
        setTimeout(() => speakNext(i + 1), 500)
      }
    }
    window.speechSynthesis.speak(utt)
  }

  speakNext(0)
}

export function CodingSandbox({
  contentItemId, sessionContentItemId, title, theme, language, projectId, projectUrl,
  starterUrl, savedCode, gradeBand, challenge, tagline, steps, initialStep = 0,
}: Props) {
  // G1-2 gets a noticeably slower reading speed (younger ears need more time)
  const ttsRate = gradeBand === 'g1-2' ? 0.5 : 0.6
  const router          = useRouter()
  const iframeRef       = useRef<HTMLIFrameElement>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const currentProjectId      = useRef(projectId)
  const autoSaveTimer         = useRef<ReturnType<typeof setInterval> | null>(null)
  const debounceTimer         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedAt           = useRef<number>(0)
  // Change-detection: store snapshot of what was last successfully uploaded.
  // The interval only fires a real save when content has changed since last save.
  const lastSavedSb3          = useRef<string | null>(null)
  const lastSavedPy           = useRef<string | null>(null)
  // true once TurboWarp signals KK_PROJECT_LOADED — prevents auto-save from firing while
  // the student's .sb3 is still being loaded into the VM (which would overwrite the real project).
  // Wait for KK_PROJECT_LOADED signal even for new projects — prevents auto-save
  // from firing before TurboWarp has finished initialising (which could write
  // stale or empty state over a real project).
  const projectReadyRef       = useRef(false)
  const pyCode                = useRef('')
  const sb3UploadRef          = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(
    steps && initialStep >= steps.length ? 0 : initialStep
  )

  // Save step position to student_sessions (fire-and-forget)
  const saveStep = useCallback((step: number) => {
    fetch(`/api/v1/sessions/${sessionContentItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastStepIndex: step, progressPct: 0, completed: false }),
    }).catch(() => {})
  }, [sessionContentItemId])

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step)
    saveStep(step)
  }, [saveStep])

  // Mark the session as fully completed when student clicks "Done!" on the last step
  const handleStepComplete = useCallback(() => {
    const totalSteps = steps?.length ?? 0
    fetch(`/api/v1/sessions/${sessionContentItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastStepIndex: Math.max(0, totalSteps - 1),
        progressPct: 100,
        completed: true,
      }),
    }).catch(() => {})
  }, [sessionContentItemId, steps])
  const [hasProject, setHasProject]   = useState(!!projectId)
  // iframeSrc starts null when we need to pre-load data into localStorage first:
  //   • saved projects: fetch projectUrl → localStorage → iframe
  //   • new projects with a starterUrl: fetch starter → localStorage → iframe
  // For truly blank new projects (no starter, no saved project): start immediately.
  const [iframeSrc, setIframeSrc] = useState<string | null>(
    (projectUrl || starterUrl) ? null : `/scratch/editor.html?kk=${Date.now()}`
  )

  // ── KeeBot state ──────────────────────────────────────────────────────────
  const [chatOpen, setChatOpen]     = useState(false)
  const [messages, setMessages]     = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: `Hi! I'm KeeBot 🤖 Tap the 🔊 button next to any step to hear it read aloud. Ask me anything if you get stuck — I'm here to help! 🌟` },
  ])
  const [chatInput, setChatInput]   = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const askKeeBot = useCallback(async (question: string) => {
    if (!question.trim() || chatLoading) return
    setMessages(m => [...m, { role: 'user', text: question }])
    setChatInput('')
    setChatLoading(true)

    // Snapshot the student's current Scratch project so KeeBot can give
    // advice based on what they've actually built (sprites, blocks, costumes).
    let projectSnapshot: string | null = null
    if (language === 'scratch') {
      try {
        const iframeWin = iframeRef.current?.contentWindow as any
        if (iframeWin?.vm) {
          const json = JSON.parse(iframeWin.vm.toJSON())
          const summary = (json.targets ?? []).map((t: any) => {
            const blocks = Object.values(t.blocks ?? {}) as any[]
            const categories = Array.from(
              new Set(blocks.map((b: any) => b.opcode?.split('_')[0]).filter(Boolean))
            )
            return {
              name: t.name,
              isStage: t.isStage,
              costumes: (t.costumes ?? []).map((c: any) => c.name),
              blockCategories: categories,
              blockCount: blocks.length,
            }
          })
          projectSnapshot = JSON.stringify(summary)
        }
      } catch { /* ignore — KeeBot still works without snapshot */ }
    }

    // Send last 8 messages as history (skip the initial bot greeting at index 0)
    const history = messages.slice(1, -1).slice(-8).map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }))

    try {
      const res = await fetch('/api/v1/ai/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, challenge, steps, currentStep, projectSnapshot, history }),
      })
      const data = await res.json()
      const botText = data.text ?? data.error ?? "Hmm, I couldn't think of an answer. Ask your teacher! 🙂"
      setMessages(m => [...m, { role: 'bot', text: botText }])
    } catch {
      setMessages(m => [...m, { role: 'bot', text: "Oops! Something went wrong. Ask your teacher! 🙂" }])
    } finally {
      setChatLoading(false)
    }
  }, [chatLoading, challenge, steps, currentStep, language, messages])

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported in this browser. Try Chrome!'); return }
    const recog = new SR()
    recog.lang = 'en-US'
    recog.interimResults = false
    recog.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript
      setChatInput(transcript)
    }
    recog.start()
  }, [])

  // ── Upload helper ──────────────────────────────────────────────────────────
  const uploadProject = useCallback(async (projectJson: string, lang: 'scratch' | 'python') => {
    setSaving(true)
    setSaveError(null)
    try {
      const method = currentProjectId.current ? 'PUT' : 'POST'
      const url    = currentProjectId.current
        ? `/api/v1/coding/${currentProjectId.current}`
        : '/api/v1/coding'
      const body = currentProjectId.current
        ? { projectJson, curriculumContentId: contentItemId }
        : { curriculumContentId: contentItemId, title, language: lang, projectJson }
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const text = await res.text()
      if (!res.ok) {
        let msg = `${res.status}`
        try { msg = `${res.status}: ${JSON.parse(text)?.error ?? text.slice(0, 80)}` } catch {}
        setSaveError(msg)
        return
      }
      const json = JSON.parse(text)
      if (!currentProjectId.current && json.data?.id) {
        currentProjectId.current = json.data.id
        setHasProject(true)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      setSaveError(e?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [contentItemId, title])

  // ── Scratch save ───────────────────────────────────────────────────────────
  const saveScratch = useCallback(async () => {
    if (!iframeRef.current) { setSaveError('no iframe'); return }
    try {
      const iframeWin = iframeRef.current.contentWindow as any
      const vm = iframeWin?.vm
      if (!vm) { setSaveError('VM not ready — try again in a moment'); return }
      let projectJson: string
      try {
        // __kkGetProjectSb3 runs saveProjectSb3 + base64 encoding INSIDE the iframe context
        // so JSZip and all asset data are guaranteed to be in scope.
        // Falls back to vm.toJSON() if the helper isn't available yet (first few seconds).
        if (typeof iframeWin.__kkGetProjectSb3 === 'function') {
          projectJson = await iframeWin.__kkGetProjectSb3()
        } else {
          projectJson = vm.toJSON()
        }
      } catch (e: any) { setSaveError('save failed: ' + e?.message); return }
      if (!projectJson) { setSaveError('empty project'); return }
      await uploadProject(projectJson, 'scratch')
      // Record snapshot so the interval can skip redundant saves
      lastSavedSb3.current = iframeWin?.__kkLastSb3 ?? projectJson
      iframeWin.ReduxStore?.dispatch({
        type: 'scratch-gui/project-changed/SET_PROJECT_CHANGED',
        changed: false,
      })
    } catch (err: any) {
      setSaveError(err?.message ?? 'save error')
    }
  }, [uploadProject])

  // ── Python save ────────────────────────────────────────────────────────────
  const savePython = useCallback(async () => {
    await uploadProject(pyCode.current, 'python')
    lastSavedPy.current = pyCode.current
  }, [uploadProject])

  // ── Listen for TurboWarp "project fully loaded" signal ─────────────────────
  // Starters are pre-fetched into localStorage BEFORE the iframe loads (see useEffect below),
  // so by the time KK_PROJECT_LOADED fires, the project is already loaded. Just gate saves.
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== 'KK_PROJECT_LOADED') return
      projectReadyRef.current = true
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // ── Auto-save (change-detection) ──────────────────────────────────────────
  // Checks every 60 s but only fires a real DB write when content has changed
  // since the last successful save. Eliminates redundant uploads when kids are
  // idle, reading instructions, or just watching the car simulation run.
  useEffect(() => {
    if (language === 'scratch') {
      autoSaveTimer.current = setInterval(() => {
        if (!projectReadyRef.current) return
        // Only save when __kkLastSb3 has changed since the last successful save
        const iframeWin = iframeRef.current?.contentWindow as any
        const currentSb3 = iframeWin?.__kkLastSb3 as string | null | undefined
        if (currentSb3 && currentSb3 === lastSavedSb3.current) return // no change
        saveScratch()
      }, 90_000)
    } else {
      autoSaveTimer.current = setInterval(() => {
        // Only save when Python code has changed since the last successful save
        if (pyCode.current === lastSavedPy.current) return
        savePython()
      }, 90_000)
    }
    return () => { if (autoSaveTimer.current) clearInterval(autoSaveTimer.current) }
  }, [language, saveScratch, savePython])

  // ── Keepalive save on tab/page close ─────────────────────────────────────
  // We use the pre-computed __kkLastSb3 (updated every 3 s inside the iframe)
  // so beforeunload can fire a keepalive fetch synchronously — no async needed.
  // This avoids the old vm.toJSON() approach that lost custom drawn assets.
  // Guard: only save if the project has loaded (projectReadyRef) AND a project
  // row exists, so we never overwrite with an empty VM on initial page load.
  useEffect(() => {
    if (language !== 'scratch') return
    const handleBeforeUnload = () => {
      const iframeWin = iframeRef.current?.contentWindow as any
      const lastSb3   = iframeWin?.__kkLastSb3 as string | null | undefined
      if (!lastSb3 || !projectReadyRef.current) return
      if (currentProjectId.current) {
        // Existing project — update it
        fetch(`/api/v1/coding/${currentProjectId.current}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectJson: lastSb3, curriculumContentId: contentItemId }),
          keepalive: true,
        })
      } else {
        // Brand-new project — create it so work isn't lost
        fetch('/api/v1/coding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ curriculumContentId: contentItemId, title, language: 'scratch', projectJson: lastSb3 }),
          keepalive: true,
        })
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [language, contentItemId])

  // ── Blank new project: clear stale kk_project so TurboWarp starts empty ──────
  useEffect(() => {
    if (language !== 'scratch' || projectUrl || starterUrl) return
    localStorage.removeItem('kk_project')
    // iframeSrc already set in useState — nothing else to do
  }, [language, projectUrl, starterUrl])

  // ── Fetch saved project → localStorage → TurboWarp (single load) ────────────
  useEffect(() => {
    if (!projectUrl) return
    let cancelled = false
    fetch(projectUrl)
      .then(r => r.ok ? r.text() : null)
      .then(data => {
        if (!cancelled && data) {
          localStorage.setItem('kk_project', data)
          setIframeSrc(`/scratch/editor.html?kk=${Date.now()}`)
        }
      })
      .catch(e => console.warn('[KK] project fetch failed', e))
    return () => { cancelled = true }
  }, [projectUrl])

  // ── Pre-fetch starter → localStorage → TurboWarp (single load, no reload) ───
  // For brand-new projects: fetch the starter .sb3 BEFORE the iframe opens so
  // TurboWarp's own componentDidUpdate loads it in ONE load, the same as saved projects.
  // This is simpler and more reliable than the postMessage approach.
  useEffect(() => {
    if (!starterUrl || projectUrl) return
    let cancelled = false
    async function loadStarter() {
      try {
        const res = await fetch(`${starterUrl}?v=5`)
        if (!res.ok) throw new Error(`fetch ${res.status}`)
        const contentType = res.headers.get('Content-Type') ?? ''
        let toStore: string
        if (contentType.includes('application/json') || contentType.includes('text/')) {
          // Could be a base64 data URL (from storage) or raw JSON (vm.toJSON() save)
          // Either way, TurboWarp's componentDidUpdate handles both formats
          toStore = (await res.text()).trim()
        } else {
          // Binary .sb3 — encode to base64 data URL
          const buf = await res.arrayBuffer()
          const bytes = new Uint8Array(buf)
          let binary = ''
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
          toStore = `data:application/zip;base64,${btoa(binary)}`
        }
        if (!cancelled) localStorage.setItem('kk_project', toStore)
      } catch (err) {
        console.warn('[KK] starter fetch failed, starting blank', err)
      }
      if (!cancelled) setIframeSrc(`/scratch/editor.html?kk=${Date.now()}`)
    }
    loadStarter()
    return () => { cancelled = true }
  }, [starterUrl, projectUrl])

  // ── Shared header content ───────────────────────────────────────────────────
  const headerStatus = (
    <div className="flex items-center gap-2">
      {saving    && <span className="text-purple-200 text-sm">Saving…</span>}
      {saved     && <span className="text-green-300 text-sm font-bold">✓ Saved</span>}
      {saveError && <span className="text-red-300 text-xs max-w-[100px] truncate" title={saveError}>⚠ {saveError}</span>}
    </div>
  )

  if (language === 'scratch') {
    return (
      <div className="flex flex-col h-screen bg-purple-50">
        <header className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={async () => { await saveScratch(); router.back() }} className="text-purple-200 text-2xl">←</button>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-lg truncate">💻 {title}</h1>
            <p className="text-purple-200 text-xs flex items-center gap-2">
              {theme && <span>{theme}</span>}
              {gradeBand && <span className="bg-purple-500 text-purple-100 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">{gradeBand}</span>}
            </p>
          </div>
          {headerStatus}
          {/* Start fresh — wipes stale saved data so student isn't stuck with ? sprite */}
          {hasProject && currentProjectId.current && (
            <button
              onClick={async () => {
                if (!confirm('Start a brand-new project? Your saved work will be cleared.')) return
                await fetch(`/api/v1/coding/${currentProjectId.current}`, { method: 'DELETE' })
                // reload so server sees no project and shows blank TurboWarp
                window.location.reload()
              }}
              className="text-purple-300 hover:text-white text-xs font-semibold shrink-0"
              title="Clear saved project and start fresh"
            >Start fresh</button>
          )}
          <button
            onClick={async () => {
              const iframeWin = iframeRef.current?.contentWindow as any
              if (!iframeWin) return
              let b64: string | null = null
              if (typeof iframeWin.__kkGetProjectSb3 === 'function') {
                b64 = await iframeWin.__kkGetProjectSb3()
              } else if (iframeWin.__kkLastSb3) {
                b64 = iframeWin.__kkLastSb3
              }
              if (!b64) { alert('Project not ready yet — try again in a moment'); return }
              const prefix = 'data:application/zip;base64,'
              const base64 = b64.startsWith(prefix) ? b64.slice(prefix.length) : b64
              const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
              const blob = new Blob([bytes], { type: 'application/zip' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `${title.replace(/\s+/g, '_')}.sb3`
              a.click()
            }}
            className="font-bold px-3 py-1 rounded-xl text-sm active:scale-95 transition-all shrink-0 bg-green-500 hover:bg-green-400 text-white"
            title="Download your project as a file"
          >⬇ Download</button>
          {/* Load .sb3 from disk — lets students restore a downloaded backup */}
          <input
            ref={sb3UploadRef}
            type="file"
            accept=".sb3"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              e.target.value = ''
              const buf = await file.arrayBuffer()
              const bytes = new Uint8Array(buf)
              let binary = ''
              for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
              const base64 = `data:application/zip;base64,${btoa(binary)}`
              // Write to localStorage then reload — single-load approach
              localStorage.setItem('kk_project', base64)
              projectReadyRef.current = false
              setIframeSrc(`/scratch/editor.html?kk=${Date.now()}`)
            }}
          />
          <button
            onClick={() => sb3UploadRef.current?.click()}
            className="text-purple-300 hover:text-white text-xs font-semibold shrink-0"
            title="Load a saved .sb3 file"
          >📂 Load</button>
          {/* Reload iframe — saves first then reloads TurboWarp; fixes stuck/missing blocks */}
          <button
            onClick={async () => {
              if (projectReadyRef.current) await saveScratch()
              const iframeWin = iframeRef.current?.contentWindow as any
              // Always call __kkGetProjectSb3 (live) — __kkLastSb3 is a 1s polling
              // cache and may be stale if the student just added blocks/variables.
              let lastSb3: string | null = null
              if (typeof iframeWin?.__kkGetProjectSb3 === 'function') {
                lastSb3 = await iframeWin.__kkGetProjectSb3()
              } else {
                lastSb3 = iframeWin?.__kkLastSb3 ?? null
              }
              if (lastSb3) localStorage.setItem('kk_project', lastSb3)
              projectReadyRef.current = false
              setIframeSrc(`/scratch/editor.html?kk=${Date.now()}`)
            }}
            className="text-purple-300 hover:text-white text-xs font-semibold shrink-0"
            title="Reload coding editor (fixes missing blocks)"
          >🔄 Reload</button>
          <button
            onClick={saveScratch}
            className={`font-bold px-3 py-1 rounded-xl text-sm active:scale-95 transition-all shrink-0
              ${!hasProject
                ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-900 animate-pulse'
                : 'bg-purple-500 hover:bg-purple-400 text-white'}`}
          >{!hasProject ? '💾 Save first!' : 'Save'}</button>
          <form action="/api/v1/auth/logout" method="POST">
            <button type="submit" className="text-purple-300 hover:text-white text-xs font-semibold ml-1 shrink-0">Sign out</button>
          </form>
        </header>

        <StepPanel
          steps={steps} challenge={challenge}
          currentStep={currentStep} onStepChange={handleStepChange}
          onComplete={handleStepComplete}
          onDone={() => router.push('/dashboard')}
          onSpeak={(text) => speak(text, ttsRate)}
          onKeeBotToggle={() => setChatOpen(v => !v)}
          keeBotOpen={chatOpen}
          gradeBand={gradeBand ?? undefined}
        />

        {/* Main area: iframe + optional KeeBot side panel, side by side */}
        <div className="flex-1 flex flex-row overflow-hidden">
          <div className="relative flex-1 flex flex-col">
            {iframeSrc ? (
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                className="flex-1 w-full border-0"
                allow="microphone; camera"
                title="Scratch Editor"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white">
                <p className="text-purple-400 text-sm animate-pulse">Loading your project…</p>
              </div>
            )}
            {/* First-visit hint — no saved project yet */}
            {!projectUrl && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-2 rounded-full shadow-md">
                  ✨ New project — start building! Your work saves automatically.
                </div>
              </div>
            )}
          </div>

          {/* KeeBot side panel — sits beside the iframe on lg+; overlay on small screens */}
          <KeeBotPanel
            open={chatOpen}
            onToggle={() => setChatOpen(v => !v)}
            messages={messages}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={() => askKeeBot(chatInput)}
            onListen={startListening}
            loading={chatLoading}
            chatEndRef={chatEndRef}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <header className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={async () => { await savePython(); router.back() }} className="text-purple-200 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">💻 {title}</h1>
          <p className="text-purple-200 text-xs flex items-center gap-2">
            {theme && <span>{theme}</span>}
            {gradeBand && <span className="bg-purple-500 text-purple-100 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">{gradeBand}</span>}
          </p>
        </div>
        {headerStatus}
        <button onClick={savePython}
          className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-3 py-1 rounded-xl text-sm active:scale-95 transition-all">
          Save
        </button>
        <form action="/api/v1/auth/logout" method="POST">
          <button type="submit" className="text-purple-300 hover:text-white text-xs font-semibold ml-1">Sign out</button>
        </form>
      </header>

      <StepPanel
        steps={steps} challenge={challenge}
        currentStep={currentStep} onStepChange={handleStepChange}
        onComplete={handleStepComplete}
        onDone={() => router.push('/dashboard')}
        onSpeak={(text) => speak(text, ttsRate)}
        onKeeBotToggle={() => setChatOpen(v => !v)}
        keeBotOpen={chatOpen}
      />

      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <PythonEditor
            initialCode={savedCode ?? '# Write your Python code here\nprint("Hello, World!")'}
            onCodeChange={code => { pyCode.current = code }}
          />
        </div>
        <KeeBotPanel
          open={chatOpen}
          onToggle={() => setChatOpen(v => !v)}
          messages={messages}
          input={chatInput}
          onInputChange={setChatInput}
          onSend={() => askKeeBot(chatInput)}
          onListen={startListening}
          loading={chatLoading}
          chatEndRef={chatEndRef}
        />
      </div>
    </div>
  )
}

// ── Step-by-step panel — one step at a time ───────────────────────────────
function StepPanel({
  steps, challenge, currentStep, onStepChange, onComplete, onDone, onSpeak, onKeeBotToggle, keeBotOpen, gradeBand,
}: {
  steps?: string[]
  challenge?: string
  currentStep: number
  onStepChange: (n: number) => void
  onComplete?: () => void
  onDone?: () => void
  onSpeak?: (text: string) => void
  onKeeBotToggle?: () => void
  keeBotOpen?: boolean
  gradeBand?: string
}) {
  const [toast, setToast] = useState<string | null>(null)

  if (!steps || steps.length === 0) return null
  const total   = steps.length
  const step    = (steps[currentStep] ?? '').trim()
  const isFirst = currentStep === 0
  const isLast  = currentStep === total - 1

  function handleNext() {
    if (isLast) {
      setToast('🎉 All steps done! Amazing work!')
      onComplete?.()
      setTimeout(() => onDone?.(), 1200)
    } else {
      setToast(`✅ Step ${currentStep + 1} done! On to step ${currentStep + 2}!`)
      onStepChange(currentStep + 1)
    }
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 shrink-0 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-green-500 text-white text-sm font-black px-5 py-2.5 rounded-2xl shadow-xl animate-bounce whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}

      <div className="px-2 py-2 flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => onStepChange(currentStep - 1)}
          onMouseDown={e => e.preventDefault()}
          disabled={isFirst}
          className="bg-yellow-200 hover:bg-yellow-300 disabled:opacity-25 text-yellow-800 font-black text-xl w-10 h-10 rounded-xl shrink-0 flex items-center justify-center active:scale-95 transition-all"
        >←</button>

        {/* Step text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-yellow-500 leading-none mb-0.5">
            🎯 {challenge ?? 'Challenge'} · Step {currentStep + 1} of {total}
          </p>
          <p className="text-sm text-gray-700 leading-snug whitespace-pre-line max-h-32 overflow-hidden">{step}</p>
        </div>

        {/* Read aloud */}
        {onSpeak && (
          <button
            onClick={() => onSpeak(step)}
            onMouseDown={e => e.preventDefault()}
            title="Read aloud"
            className="text-yellow-400 hover:text-yellow-600 text-2xl shrink-0 w-9 h-9 flex items-center justify-center"
          >🔊</button>
        )}

        {/* Done / Next step button */}
        <button
          onClick={handleNext}
          onMouseDown={e => e.preventDefault()}
          className={`font-black text-sm px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 active:scale-95 transition-all
            ${isLast
              ? 'bg-green-500 hover:bg-green-400 text-white'
              : 'bg-yellow-400 hover:bg-yellow-500 text-white'}`}
        >
          {isLast ? '🎉 Done!' : '✅ Next →'}
        </button>

        {/* KeeBot toggle */}
        {onKeeBotToggle && (
          <button
            onClick={onKeeBotToggle}
            onMouseDown={e => e.preventDefault()}
            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl transition-all active:scale-95
              ${keeBotOpen ? 'bg-purple-500 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-600'}`}
            title="Ask KeeBot"
          >🤖</button>
        )}
      </div>
    </div>
  )
}

// ── KeeBot panel — side panel on desktop, bottom sheet on mobile ──────────
function KeeBotPanel({
  open, onToggle, messages, input, onInputChange, onSend, onListen, loading, chatEndRef,
}: {
  open: boolean
  onToggle: () => void
  messages: { role: 'user' | 'bot'; text: string }[]
  input: string
  onInputChange: (v: string) => void
  onSend: () => void
  onListen: () => void
  loading: boolean
  chatEndRef: React.RefObject<HTMLDivElement>
}) {
  if (!open) return null
  return (
    <>
      {/* Mobile: full-screen bottom sheet overlay */}
      <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onToggle} />
        <div className="relative flex flex-col bg-white rounded-t-3xl shadow-2xl" style={{ maxHeight: '70vh' }}>
          <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between rounded-t-3xl shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="font-black text-sm leading-none">KeeBot</p>
                <p className="text-purple-200 text-xs">Your coding helper!</p>
              </div>
            </div>
            <button onClick={onToggle} className="text-purple-200 hover:text-white font-bold px-2">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-purple-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-3 py-2 max-w-[85%] text-sm leading-relaxed
                  ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-white text-gray-700 border border-purple-100 rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-purple-100 rounded-2xl px-3 py-2 text-sm text-gray-400 shadow-sm animate-pulse">KeeBot is thinking…</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="px-3 py-3 border-t border-purple-100 bg-white shrink-0 flex gap-2">
            <button onClick={onListen} title="Speak" className="text-purple-400 hover:text-purple-600 text-xl shrink-0">🎤</button>
            <input type="text" value={input} onChange={e => onInputChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !loading) onSend() }}
              placeholder="Ask me anything…"
              className="flex-1 text-sm border border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400" />
            <button onClick={onSend} disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-bold px-3 py-2 rounded-xl shrink-0">Ask</button>
          </div>
        </div>
      </div>

      {/* Desktop: side panel beside the iframe */}
      <div className="hidden lg:flex w-64 flex-col bg-white border-l border-purple-100 shadow-lg shrink-0">
      {/* Header */}
      <div className="bg-purple-600 text-white px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <p className="font-black text-sm leading-none">KeeBot</p>
            <p className="text-purple-200 text-xs">Your coding helper!</p>
          </div>
        </div>
        <button onClick={onToggle} className="text-purple-200 hover:text-white font-bold px-1">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-purple-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl px-3 py-2 max-w-[90%] text-xs leading-relaxed
              ${msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-sm'
                : 'bg-white text-gray-700 border border-purple-100 rounded-bl-sm shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-purple-100 rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-gray-400 shadow-sm animate-pulse">
              KeeBot is thinking…
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-2 py-2 border-t border-purple-100 bg-white shrink-0 flex gap-1">
        <button
          onClick={onListen}
          onMouseDown={e => e.preventDefault()}
          title="Speak your question"
          className="text-purple-400 hover:text-purple-600 text-lg shrink-0"
        >🎤</button>
        <input
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) onSend() }}
          placeholder="Ask me…"
          className="flex-1 text-xs border border-purple-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-purple-400 min-w-0"
        />
        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          onMouseDown={e => e.preventDefault()}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold px-2 py-1.5 rounded-xl shrink-0"
        >Ask</button>
      </div>
    </div>
    </>
  )
}

// ── Python editor ──────────────────────────────────────────────────────────
function PythonEditor({ initialCode, onCodeChange }: { initialCode: string; onCodeChange: (c: string) => void }) {
  const [output, setOutput] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [code, setCode] = useState(initialCode)
  const pyodideRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (typeof window === 'undefined') return
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
          script.onload = () => resolve()
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      if (!cancelled) pyodideRef.current = await (window as any).loadPyodide()
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function runCode() {
    setRunning(true)
    setOutput([])
    try {
      if (!pyodideRef.current) { setOutput(['⚠ Python is still loading. Try again in a moment!']); return }
      const captured: string[] = []
      pyodideRef.current.setStdout({ batched: (s: string) => captured.push(s) })
      pyodideRef.current.setStderr({ batched: (s: string) => captured.push(`Error: ${s}`) })
      await pyodideRef.current.runPythonAsync(code)
      setOutput(captured.length ? captured : ['(no output)'])
    } catch (e: any) {
      setOutput([`Error: ${e.message}`])
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <textarea
        className="flex-1 font-mono text-sm p-4 bg-gray-900 text-green-300 resize-none focus:outline-none"
        value={code}
        onChange={e => { setCode(e.target.value); onCodeChange(e.target.value) }}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="none"
        placeholder="# Write Python here"
      />
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-3">
        <button onClick={runCode} disabled={running}
          className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-1.5 rounded-xl text-sm disabled:opacity-50">
          {running ? '▶ Running…' : '▶ Run'}
        </button>
        {output.length > 0 && <button onClick={() => setOutput([])} className="text-gray-400 text-sm">Clear</button>}
      </div>
      {output.length > 0 && (
        <div className="bg-black text-green-400 font-mono text-sm p-4 max-h-40 overflow-y-auto">
          {output.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
    </div>
  )
}

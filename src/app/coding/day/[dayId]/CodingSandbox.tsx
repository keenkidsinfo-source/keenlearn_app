'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/db/schema'

interface Props {
  contentItemId: string
  title: string
  theme: string
  language: 'scratch' | 'python'
  projectId: string | null
  projectUrl: string | null
  savedCode: string | null
  gradeBand: GradeBand | null
  challenge?: string
  tagline?: string
  steps?: string[]
}

export function CodingSandbox({
  contentItemId, title, theme, language, projectId, projectUrl, savedCode, gradeBand,
  challenge, tagline, steps
}: Props) {
  const router          = useRouter()
  const iframeRef       = useRef<HTMLIFrameElement>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const currentProjectId      = useRef(projectId)
  const autoSaveTimer         = useRef<ReturnType<typeof setInterval> | null>(null)
  const pyCode                = useRef('')
  const [showInstructions, setShowInstructions] = useState(true)

  // ── Upload helper (used by both Scratch and Python) ──
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
      console.log('[save]', res.status, text.slice(0, 500))
      if (!res.ok) {
        let msg = `${res.status}`
        try { msg = `${res.status}: ${JSON.parse(text)?.error ?? text.slice(0, 80)}` } catch {}
        setSaveError(msg)
        return
      }
      const json = JSON.parse(text)
      if (!currentProjectId.current && json.data?.id) {
        currentProjectId.current = json.data.id
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      console.error('Save failed', e)
      setSaveError(e?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [contentItemId, title])

  // ── Scratch / TurboWarp save ──
  // iframe is same-origin so we can access window.vm directly — no postMessage needed
  const saveScratch = useCallback(async () => {
    if (!iframeRef.current) { setSaveError('no iframe'); return }
    try {
      const iframeWin = iframeRef.current.contentWindow as any
      const vm = iframeWin?.vm
      if (!vm) { setSaveError('VM not ready — wait a moment and try again'); return }
      let projectJson: string
      try {
        projectJson = vm.toJSON()
      } catch (e: any) {
        setSaveError('toJSON failed: ' + e?.message); return
      }
      if (!projectJson) { setSaveError('empty project'); return }
      await uploadProject(projectJson, 'scratch')
      // Tell TurboWarp the project is saved so it stops showing "Leave site?" dialog
      iframeWin.ReduxStore?.dispatch({
        type: 'scratch-gui/project-changed/SET_PROJECT_CHANGED',
        changed: false,
      })
    } catch (err: any) {
      console.error('saveScratch error', err)
      setSaveError(err?.message ?? 'save error')
    }
  }, [uploadProject])

  // ── Python save ──
  const savePython = useCallback(async () => {
    await uploadProject(pyCode.current, 'python')
  }, [uploadProject])

  useEffect(() => {
    if (language === 'scratch') {
      autoSaveTimer.current = setInterval(saveScratch, 10_000)
    } else {
      autoSaveTimer.current = setInterval(savePython, 10_000)
    }
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current)
    }
  }, [language, saveScratch, savePython])

  // Save with keepalive when the tab/window is closed or the user navigates away at OS level
  useEffect(() => {
    if (language !== 'scratch') return
    const handleBeforeUnload = () => {
      try {
        const vm = (iframeRef.current?.contentWindow as any)?.vm
        if (!vm) return
        const projectJson = vm.toJSON()
        if (!projectJson) return
        const method = currentProjectId.current ? 'PUT' : 'POST'
        const url = currentProjectId.current
          ? `/api/v1/coding/${currentProjectId.current}`
          : '/api/v1/coding'
        const body = currentProjectId.current
          ? { projectJson, curriculumContentId: contentItemId }
          : { curriculumContentId: contentItemId, title, language: 'scratch', projectJson }
        fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true,
        })
      } catch (e) {
        console.error('beforeunload save failed', e)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [language, contentItemId, title])

  // After iframe loads, inject saved project directly via vm.loadProject()
  const onIframeLoad = useCallback(() => {
    console.log('[KK] onIframeLoad, projectUrl=', projectUrl)
    if (!projectUrl) return
    let cancelled = false
    const tryInject = async () => {
      const res = await fetch(projectUrl)
      console.log('[KK] /data fetch status:', res.status)
      if (!res.ok || cancelled) return
      const json = await res.text()
      console.log('[KK] project data length:', json.length)
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 250))
        if (cancelled) return
        const vm = (iframeRef.current?.contentWindow as any)?.vm
        if (vm) {
          console.log('[KK] VM ready, calling loadProject')
          await vm.loadProject(json)
          console.log('[KK] loadProject done')
          return
        }
      }
      console.warn('[KK] VM never became ready after 10s')
    }
    tryInject().catch(e => console.error('[KK] tryInject error:', e))
  }, [projectUrl])

  if (language === 'scratch') {
    return (
      <div className="flex flex-col h-screen bg-purple-50">
        <header className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={async () => { await saveScratch(); router.push('/dashboard') }} className="text-purple-200 text-2xl">←</button>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-lg truncate">💻 {title}</h1>
            {theme && <p className="text-purple-200 text-xs">{theme}</p>}
          </div>
          <div className="flex items-center gap-2">
            {saving    && <span className="text-purple-200 text-sm">Saving…</span>}
            {saved     && <span className="text-green-300 text-sm font-bold">✓ Saved</span>}
            {saveError && <span className="text-red-300 text-sm">{saveError}</span>}
            <button
              onClick={saveScratch}
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-3 py-1 rounded-xl text-sm active:scale-95 transition-all"
            >
              Save
            </button>
            <form action="/api/v1/auth/logout" method="POST">
              <button type="submit" className="text-purple-300 hover:text-white text-xs font-semibold ml-1">Sign out</button>
            </form>
          </div>
        </header>
        <InstructionsPanel steps={steps} challenge={challenge} tagline={tagline} show={showInstructions} onToggle={() => setShowInstructions(v => !v)} />
        <iframe
          ref={iframeRef}
          src="/scratch/editor.html"
          onLoad={onIframeLoad}
          className="flex-1 w-full border-0"
          allow="microphone; camera"
          title="Scratch Editor"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <header className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={async () => { await savePython(); router.push('/dashboard') }} className="text-purple-200 text-2xl">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">💻 {title}</h1>
          {theme && <p className="text-purple-200 text-xs">{theme}</p>}
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-purple-200 text-sm">Saving…</span>}
          {saved  && <span className="text-green-300 text-sm font-bold">✓ Saved</span>}
          <button
            onClick={savePython}
            className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-3 py-1 rounded-xl text-sm active:scale-95 transition-all"
          >

            Save
          </button>
          <form action="/api/v1/auth/logout" method="POST">
            <button type="submit" className="text-purple-300 hover:text-white text-xs font-semibold ml-1">Sign out</button>
          </form>
        </div>
      </header>
      <InstructionsPanel steps={steps} challenge={challenge} tagline={tagline} show={showInstructions} onToggle={() => setShowInstructions(v => !v)} />
      <main className="flex-1 overflow-hidden">
        <PythonEditor
          initialCode={savedCode ?? '# Write your Python code here\nprint("Hello, World!")'}
          onCodeChange={code => { pyCode.current = code }}
        />
      </main>
    </div>
  )
}

function InstructionsPanel({
  steps, challenge, tagline, show, onToggle,
}: {
  steps?: string[]
  challenge?: string
  tagline?: string
  show: boolean
  onToggle: () => void
}) {
  if (!steps || steps.length === 0) return null
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 shrink-0">
      <button
        onClick={onToggle}
        // prevent stealing keyboard focus from the Scratch iframe (fixes Ctrl+Z undo)
        onMouseDown={e => e.preventDefault()}
        className="w-full flex items-center justify-between px-4 py-2 text-left"
      >
        <span className="font-black text-yellow-800 text-sm">
          🎯 {challenge ?? 'Your Challenge'}
          {tagline && <span className="font-normal text-yellow-700 ml-2">— {tagline}</span>}
        </span>
        <span className="text-yellow-600 text-xs font-bold">{show ? 'Hide ▲' : 'Show ▼'}</span>
      </button>
      {show && (
        <div className="px-4 pb-3 space-y-1">
          {steps.map((step, i) => (
            <div key={i} className={`text-sm flex gap-2 ${step.startsWith('⭐') ? 'text-yellow-700 font-bold mt-2' : 'text-gray-700'}`}>
              {!step.startsWith('⭐') && <span className="text-yellow-500 font-black shrink-0">{i + 1}.</span>}
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PythonEditor({ initialCode, onCodeChange }: { initialCode: string; onCodeChange: (c: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
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
      if (!cancelled) {
        pyodideRef.current = await (window as any).loadPyodide()
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function runCode() {
    setRunning(true)
    setOutput([])
    try {
      if (!pyodideRef.current) {
        setOutput(['⚠ Python is still loading. Try again in a moment!'])
        return
      }
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
        <button
          onClick={runCode}
          disabled={running}
          className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-1.5 rounded-xl text-sm disabled:opacity-50"
        >
          {running ? '▶ Running…' : '▶ Run'}
        </button>
        {output.length > 0 && (
          <button onClick={() => setOutput([])} className="text-gray-400 text-sm">Clear</button>
        )}
      </div>
      {output.length > 0 && (
        <div className="bg-black text-green-400 font-mono text-sm p-4 max-h-40 overflow-y-auto">
          {output.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
    </div>
  )
}

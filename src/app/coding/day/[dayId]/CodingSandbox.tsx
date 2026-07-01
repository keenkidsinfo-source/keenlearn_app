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
  gradeBand: GradeBand | null
  turbowarpUrl: string
}

export function CodingSandbox({
  contentItemId, title, theme, language, projectId, projectUrl, gradeBand, turbowarpUrl
}: Props) {
  const router          = useRouter()
  const iframeRef       = useRef<HTMLIFrameElement>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const currentProjectId      = useRef(projectId)
  const autoSaveTimer         = useRef<ReturnType<typeof setInterval> | null>(null)
  const pyCode                = useRef('')

  // ── Scratch / TurboWarp save ──
  const saveScratch = useCallback(async () => {
    if (!iframeRef.current) return
    iframeRef.current.contentWindow?.postMessage({ type: 'KEENKIDS_REQUEST_SAVE' }, '*')
  }, [])

  const uploadScratch = useCallback(async (projectJson: string) => {
    setSaving(true)
    try {
      const method = currentProjectId.current ? 'PUT' : 'POST'
      const url    = currentProjectId.current
        ? `/api/v1/coding/${currentProjectId.current}`
        : '/api/v1/coding'

      const body = currentProjectId.current
        ? { projectJson }
        : { contentItemId, title, language: 'scratch', projectJson }

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!currentProjectId.current && json.data?.id) {
        currentProjectId.current = json.data.id
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Save failed', e)
    } finally {
      setSaving(false)
    }
  }, [contentItemId, title])

  // Listen for TurboWarp postMessage responses
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === 'KEENKIDS_PROJECT_JSON') {
        uploadScratch(event.data.json)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [uploadScratch])

  // Auto-save every 30s
  useEffect(() => {
    if (language === 'scratch') {
      autoSaveTimer.current = setInterval(saveScratch, 30_000)
    } else {
      autoSaveTimer.current = setInterval(() => savePython(), 30_000)
    }
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current)
    }
  }, [language, saveScratch])

  // ── Python save ──
  const savePython = useCallback(async () => {
    setSaving(true)
    try {
      const method = currentProjectId.current ? 'PUT' : 'POST'
      const url    = currentProjectId.current
        ? `/api/v1/coding/${currentProjectId.current}`
        : '/api/v1/coding'

      const body = currentProjectId.current
        ? { projectJson: pyCode.current }
        : { contentItemId, title, language: 'python', projectJson: pyCode.current }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!currentProjectId.current && json.data?.id) {
        currentProjectId.current = json.data.id
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Save failed', e)
    } finally {
      setSaving(false)
    }
  }, [contentItemId, title])

  // TurboWarp doesn't allow embedding the editor in an iframe — open in new tab instead
  if (language === 'scratch') {
    return (
      <div className="flex flex-col min-h-screen bg-purple-50">
        <header className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-purple-200 text-2xl">←</button>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-lg truncate">💻 {title}</h1>
            {theme && <p className="text-purple-200 text-xs">{theme}</p>}
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-8 max-w-lg mx-auto w-full text-center">
          <div className="text-8xl">🐱</div>
          <div>
            <h2 className="text-2xl font-black text-purple-700 mb-2">{theme}</h2>
            <p className="text-gray-500 text-sm">Use Scratch to bring your story to life!</p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-purple-100 p-6 w-full text-left space-y-3">
            <p className="font-bold text-gray-700 text-sm uppercase tracking-wide">What to make:</p>
            <div className="space-y-2 text-gray-600 text-sm">
              <p>🎭 Pick a character (sprite)</p>
              <p>🌄 Choose a background</p>
              <p>💬 Make your character say something</p>
              <p>▶️ Press the green flag to run it!</p>
            </div>
          </div>

          <a
            href={`${turbowarpUrl}/editor`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all w-full text-center block"
          >
            Open Scratch Editor →
          </a>
          <p className="text-xs text-gray-400">Opens in a new tab. Come back here when you&apos;re done!</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <header className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/dashboard')} className="text-purple-200 text-2xl">←</button>
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
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <PythonEditor
          initialCode={projectUrl ? '' : '# Write your Python code here\nprint("Hello, World!")'}
          onCodeChange={code => { pyCode.current = code }}
        />
      </main>
    </div>
  )
}

// ── Inline Python editor (Monaco via CDN loaded lazily) ──
function PythonEditor({ initialCode, onCodeChange }: { initialCode: string; onCodeChange: (c: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [output, setOutput] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [code, setCode] = useState(initialCode)

  // Load Pyodide once (dynamically inject CDN script then init)
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

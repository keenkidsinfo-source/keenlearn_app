export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Temporary debug route — remove after testing
export async function GET(_req: Request) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  if (!url || !key) {
    return NextResponse.json({ error: 'Missing env vars', url: !!url, key: !!key }, { status: 500 })
  }

  try {
    const supabase = createClient(url, key)
    const { data: list, error } = await supabase.storage.from('scratch-projects').list('projects', { limit: 3 })
    if (error) return NextResponse.json({ error: error.message, url, keyPrefix: key.slice(0, 10) }, { status: 500 })

    // Try downloading the first file to verify read works
    let downloadOk = false
    let downloadError = null
    let downloadSize = 0
    if (list && list.length > 0) {
      const path = `projects/${list[0].name}`
      const { data: blob, error: dlErr } = await supabase.storage.from('scratch-projects').download(path)
      if (dlErr) { downloadError = dlErr.message }
      else { downloadOk = true; downloadSize = blob ? (await blob.arrayBuffer()).byteLength : 0 }
    }

    return NextResponse.json({ ok: true, files: list?.length ?? 0, downloadOk, downloadError, downloadSize, url, keyPrefix: key.slice(0, 10) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, url, keyPrefix: key.slice(0, 10) }, { status: 500 })
  }
}

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
    const { data, error } = await supabase.storage.from('scratch-projects').list('projects', { limit: 3 })
    if (error) return NextResponse.json({ error: error.message, url, keyPrefix: key.slice(0, 10) }, { status: 500 })
    return NextResponse.json({ ok: true, files: data?.length ?? 0, url, keyPrefix: key.slice(0, 10) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, url, keyPrefix: key.slice(0, 10) }, { status: 500 })
  }
}

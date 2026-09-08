/**
 * Supabase Storage helpers for Scratch .sb3 project files.
 * Stores files in the 'scratch-projects' bucket.
 * Files are private — accessed via signed URLs or the /data API route.
 */
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'scratch-projects'

function getClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  )
}

/** Upload raw project data (string or Buffer) to storage. Returns the storage path. */
export async function uploadProject(projectId: string, data: string): Promise<string> {
  const supabase = getClient()
  const path = `projects/${projectId}.sb3`

  // data is either:
  //   "data:application/zip;base64,<b64>" — from __kkGetProjectSb3
  //   raw JSON string                     — from vm.toJSON() fallback
  let bytes: Buffer
  const b64Prefix = 'data:application/zip;base64,'
  if (data.startsWith(b64Prefix)) {
    bytes = Buffer.from(data.slice(b64Prefix.length), 'base64')
  } else {
    // Python code or raw JSON — store as UTF-8 text
    bytes = Buffer.from(data, 'utf-8')
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: 'application/octet-stream',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  return path
}

/** Download project data from storage. Returns a base64 data URL for .sb3 files. */
export async function downloadProject(storagePath: string): Promise<string | null> {
  const supabase = getClient()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(storagePath)

  if (error || !data) return null

  // .sb3 files are binary — return as base64 data URL so TurboWarp can load them
  if (storagePath.endsWith('.sb3')) {
    const buffer = Buffer.from(await data.arrayBuffer())
    return `data:application/zip;base64,${buffer.toString('base64')}`
  }

  // Python / other text files — return as plain text
  return await data.text()
}

/** Delete a project file from storage. */
export async function deleteProject(storagePath: string): Promise<void> {
  const supabase = getClient()
  await supabase.storage.from(BUCKET).remove([storagePath])
}

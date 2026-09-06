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
  const bytes = Buffer.from(data, 'utf-8')

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: 'application/octet-stream',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  return path
}

/** Download raw project data string from storage. Returns null if not found. */
export async function downloadProject(storagePath: string): Promise<string | null> {
  const supabase = getClient()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(storagePath)

  if (error || !data) return null
  return await data.text()
}

/** Delete a project file from storage. */
export async function deleteProject(storagePath: string): Promise<void> {
  const supabase = getClient()
  await supabase.storage.from(BUCKET).remove([storagePath])
}

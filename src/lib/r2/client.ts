import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!
const PRESIGN_EXPIRY = 3600 // 1 hour

// Generate a presigned GET URL for a private object
export async function getPresignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return getSignedUrl(r2, command, { expiresIn: PRESIGN_EXPIRY })
}

// Generate presigned URLs for all steps in a build/science project
export async function getStepImageUrls(projectId: string, stepCount: number): Promise<string[]> {
  const urls = await Promise.all(
    Array.from({ length: stepCount }, (_, i) =>
      getPresignedUrl(`build/${projectId}/step-${i + 1}.png`)
    )
  )
  return urls
}

// Upload a file (used for coding projects, artwork, step images)
export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  })
  await r2.send(command)
}

// Delete an object (used during student cleanup)
export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
  await r2.send(command)
}

// R2 key helpers
export const r2Keys = {
  buildStep:       (projectId: string, step: number) => `build/${projectId}/step-${step}.png`,
  scienceStep:     (experimentId: string, step: number) => `science/${experimentId}/step-${step}.png`,
  codingProject:   (studentId: string, projectId: string) => `coding/${studentId}/${projectId}.json`,
  codingThumbnail: (studentId: string, projectId: string) => `coding/${studentId}/thumbnails/${projectId}.png`,
  artwork:         (studentId: string, filename: string) => `artwork/${studentId}/${filename}`,
  thumbnail:       (contentId: string) => `thumbnails/content/${contentId}.png`,
}

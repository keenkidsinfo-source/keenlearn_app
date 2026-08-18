export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { apiOk, apiError } from '@/lib/utils'
import { getSession } from '@/lib/auth/jwt'

// POST /api/v1/admin/teachers/:id/approve
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return apiError('Forbidden', 'FORBIDDEN', 403)

  const { id } = await params

  const [teacher] = await db
    .select({ id: users.id, role: users.role, name: users.name, email: users.email })
    .from(users).where(eq(users.id, id)).limit(1)

  if (!teacher || teacher.role !== 'teacher') {
    return apiError('Teacher not found', 'NOT_FOUND', 404)
  }

  await db.update(users)
    .set({ approvedAt: new Date() })
    .where(eq(users.id, id))

  // Send approval email (best-effort — don't fail the approval if email fails)
  if (teacher.email) {
    try {
      const GMAIL_USER = process.env.GMAIL_USER ?? ''
      const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD ?? ''
      if (GMAIL_USER && GMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_PASS },
        })
        const firstName = teacher.name?.split(' ')[0] ?? teacher.name ?? 'there'
        await transporter.sendMail({
          from:    `"KeenKids Enrichment" <${GMAIL_USER}>`,
          to:      teacher.email,
          subject: 'Your KeenKids teacher account is approved!',
          html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1f2937">
  <div style="background:#0d9488;border-radius:12px;padding:20px 24px;margin-bottom:24px">
    <h1 style="color:#ffffff;margin:0;font-size:22px">🎉 You&apos;re approved, ${firstName}!</h1>
  </div>
  <p style="font-size:15px;line-height:1.6">
    Your KeenKids teacher account has been approved. You can now log in and access your classroom dashboard.
  </p>
  <div style="text-align:center;margin:28px 0">
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://keenkids.app')}/login"
       style="background:#0d9488;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 28px;border-radius:8px;display:inline-block">
      Log in to KeenKids →
    </a>
  </div>
  <p style="font-size:13px;color:#6b7280;line-height:1.6">
    If you have any questions, reply to this email and we&apos;ll be happy to help.
  </p>
</div>`,
        })
      }
    } catch (emailErr) {
      console.error('[approve] Failed to send approval email:', emailErr)
    }
  }

  return apiOk({ approved: true })
}

export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const origin = new URL(req.url).origin
  const res = NextResponse.redirect(new URL('/login', origin), { status: 303 })
  res.headers.set('Set-Cookie', 'kk_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
  return res
}

export async function GET(req: Request) {
  return POST(req)
}

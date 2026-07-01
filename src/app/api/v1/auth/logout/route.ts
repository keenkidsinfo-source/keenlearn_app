import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = NextResponse.redirect(new URL('/login', appUrl))
  res.headers.set('Set-Cookie', 'kk_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
  return res
}

export async function GET() {
  return POST(new Request('http://localhost'))
}

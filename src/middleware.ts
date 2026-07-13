import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/', '/login', '/api/v1/auth/login', '/api/v1/classroom/students', '/api/v1/debug']

const ROLE_PATHS: Record<string, string[]> = {
  teacher: ['/teacher', '/api/v1/teacher', '/api/v1/curriculum'],
  admin:   ['/admin'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/api/v1/auth'))) {
    return NextResponse.next()
  }

  // Allow static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Allow TurboWarp to fetch saved project data — UUID is the access control
  if (/^\/api\/v1\/coding\/[^/]+\/data$/.test(pathname)) {
    return NextResponse.next()
  }

  const token = req.cookies.get('kk_token')?.value

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized', code: 'NO_TOKEN', status: 401 }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)

    // Attach user info to headers for API routes
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', payload.sub as string)
    requestHeaders.set('x-role', payload.role as string)
    requestHeaders.set('x-classroom-id', (payload.classroomId as string) ?? '')
    requestHeaders.set('x-grade-band', (payload.gradeBand as string) ?? '')

    // Role-based path protection
    for (const [role, paths] of Object.entries(ROLE_PATHS)) {
      const isProtected = paths.some(p => pathname.startsWith(p))
      if (isProtected && payload.role !== role && payload.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden', code: 'INSUFFICIENT_ROLE', status: 403 }, { status: 403 })
        }
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    // Token invalid or expired
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Unauthorized', code: 'INVALID_TOKEN', status: 401 }, { status: 401 })
      : NextResponse.redirect(new URL('/login', req.url))

    response.cookies.delete('kk_token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

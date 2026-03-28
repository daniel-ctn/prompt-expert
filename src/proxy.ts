import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/prompts',
  '/system-prompts',
  '/settings',
  '/history',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  )

  if (isProtected) {
    const sessionCookie =
      request.cookies.get('authjs.session-token') ??
      request.cookies.get('__Secure-authjs.session-token')

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/prompts/:path*',
    '/system-prompts/:path*',
    '/settings/:path*',
    '/history/:path*',
  ],
}

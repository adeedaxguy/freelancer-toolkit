import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)

  // Keep category pages intact while consolidating thin tool variants.
  if (segments.length === 3 && segments[0] === 'tools' && segments[1] !== 'category') {
    const canonicalUrl = request.nextUrl.clone()
    canonicalUrl.pathname = `/tools/${segments[1]}`
    return NextResponse.redirect(canonicalUrl, 308)
  }

  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get('admin-token')?.value
    const secret = process.env.ADMIN_PASSWORD

    if (!secret) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (!token || token !== secret) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/tools/:path*'],
}

import { NextRequest, NextResponse } from 'next/server'
// Browser login prompt for /admin. Username can be anything; password is ADMIN_PASSWORD.
export function middleware(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD
  const auth = req.headers.get('authorization')
  if (pw && auth?.startsWith('Basic ') && atob(auth.slice(6)).split(':').slice(1).join(':') === pw) return NextResponse.next()
  return new NextResponse('Admin login required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="admin"' } })
}
export const config = { matcher: ['/admin/:path*'] }

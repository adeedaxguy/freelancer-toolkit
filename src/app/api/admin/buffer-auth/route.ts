import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.BUFFER_CLIENT_ID
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freeltools.com'}/api/admin/buffer-callback`

// GET /api/admin/buffer-auth
// Visit this URL while logged into admin to start Buffer OAuth flow
export async function GET() {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: 'BUFFER_CLIENT_ID not set' }, { status: 500 })
  }

  const authUrl = new URL('https://bufferapp.com/oauth2/authorize')
  authUrl.searchParams.set('client_id', CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  authUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(authUrl.toString())
}

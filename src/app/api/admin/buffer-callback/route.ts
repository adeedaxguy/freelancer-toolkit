import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.BUFFER_CLIENT_ID
const CLIENT_SECRET = process.env.BUFFER_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://freeltools.com'}/api/admin/buffer-callback`

// GET /api/admin/buffer-callback
// Buffer redirects here after user authorizes — exchanges code for access token
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;max-width:600px">
        <h2 style="color:red">❌ Buffer Authorization Failed</h2>
        <p>Error: ${error}</p>
        <p><a href="/admin">Back to admin</a></p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  if (!code) {
    return new NextResponse('Missing code parameter', { status: 400 })
  }

  try {
    const res = await fetch('https://api.bufferapp.com/1/oauth2/token.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      }),
    })

    const data = await res.json()

    if (!data.access_token) {
      return new NextResponse(`
        <html><body style="font-family:sans-serif;padding:40px;max-width:600px">
          <h2 style="color:red">❌ Token Exchange Failed</h2>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </body></html>
      `, { headers: { 'Content-Type': 'text/html' } })
    }

    const token = data.access_token

    return new NextResponse(`
      <html><body style="font-family:sans-serif;padding:40px;max-width:640px">
        <h2 style="color:#16a34a">✅ Buffer Connected!</h2>
        <p>Copy this access token and add it to two places:</p>
        <h3>1. Your .env.local file</h3>
        <code style="background:#f0fdf4;padding:12px;display:block;border-radius:6px;word-break:break-all">
          BUFFER_ACCESS_TOKEN=${token}
        </code>
        <h3 style="margin-top:24px">2. Vercel Environment Variables</h3>
        <p>Go to <a href="https://vercel.com" target="_blank">vercel.com</a> → your project → Settings → Environment Variables → add:</p>
        <ul>
          <li><strong>Name:</strong> BUFFER_ACCESS_TOKEN</li>
          <li><strong>Value:</strong> <code style="word-break:break-all">${token}</code></li>
        </ul>
        <p>Then redeploy on Vercel for the live site to pick it up.</p>
        <p style="margin-top:24px"><a href="/admin" style="color:#16a34a">← Back to admin</a></p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })

  } catch (err) {
    console.error('Buffer callback error:', err)
    return new NextResponse('Server error during token exchange', { status: 500 })
  }
}

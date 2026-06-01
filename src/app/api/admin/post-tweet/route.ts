import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

const ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN
const PROFILE_ID = process.env.BUFFER_TWITTER_PROFILE_ID

const SITE_URL = 'https://freeltools.com'

const TWEETS = [
  `Most freelancers undercharge by 30-40% because they forget taxes, unpaid time & expenses. Our free rate calculator does the math → ${SITE_URL}/tools/freelancer-rate-calculator #freelance #freelancing`,
  `Stop sending invoices in Word docs. Generate a clean professional PDF invoice in under 2 minutes — no account needed → ${SITE_URL}/tools/invoice-generator #freelance #invoice`,
  `Freelancers: what's your biggest pricing mistake when you first started? 👇\n\nWe built a calculator to help avoid them: ${SITE_URL}/tools/freelancer-rate-calculator #freelancing`,
  `Upwork takes up to 20%. Fiverr takes 20%. Our calculator shows exactly what to charge on each platform to hit your target income → ${SITE_URL}/tools/freelancer-commission-calculator #upwork #fiverr`,
  `If a client has ever moved the goalposts mid-project, you needed a scope of work doc. Generate one free in 3 minutes → ${SITE_URL}/tools/scope-of-work-generator #freelance #agencylife`,
  `17 free tools for freelancers. No login. No account. Just tools that help you earn more 👇\n\n${SITE_URL} #freelance #freelancing #tools`,
  `Freelance tip: always add a 15–20% buffer to fixed-price quotes for scope creep. Our project cost calculator has this built in → ${SITE_URL}/tools/project-cost-calculator #freelancing`,
]

function getTodaysTweet(): string {
  const dayIndex = new Date().getDay()
  return TWEETS[dayIndex % TWEETS.length]
}

async function postToBuffer(text: string): Promise<{ ok: boolean; error?: string }> {
  if (!ACCESS_TOKEN || !PROFILE_ID) {
    return { ok: false, error: 'BUFFER_ACCESS_TOKEN or BUFFER_TWITTER_PROFILE_ID not set' }
  }

  // Try Buffer v1 API with Bearer auth
  const params = new URLSearchParams()
  params.append('profile_ids[]', PROFILE_ID)
  params.append('text', text)
  params.append('now', 'true')

  const res = await fetch('https://api.bufferapp.com/1/updates/create.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
    body: params.toString(),
  })

  const data = await res.json()
  console.log('[buffer] response:', JSON.stringify(data))

  if (data.success || (Array.isArray(data) && data[0]?.success)) return { ok: true }
  if (data.updates?.length > 0) return { ok: true }
  return { ok: false, error: JSON.stringify(data) }
}

// POST /api/admin/post-tweet
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const text = body.text || getTodaysTweet()

  // Try Buffer first
  const result = await postToBuffer(text)

  if (result.ok) {
    return NextResponse.json({ ok: true, method: 'buffer', text })
  }

  // Fallback: email the tweet
  await sendEmail({
    subject: `📣 Today's Tweet (ready to post) — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#16a34a">📣 Tweet Ready to Post</h2>
        <p style="color:#555">Buffer posting failed — copy and paste this manually to <a href="https://x.com/freeltoolscom">@freeltoolscom</a>:</p>
        <div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:8px;padding:16px;margin:16px 0;font-size:15px;line-height:1.6">
          ${text.replace(/\n/g, '<br>')}
        </div>
        <p style="color:#94a3b8;font-size:12px">Buffer error: ${result.error ?? 'not configured'}</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true, method: 'email_fallback', text })
}

export async function GET(req: NextRequest) {
  // Debug mode: ?debug=1 returns Buffer API response without posting
  if (req.nextUrl.searchParams.get('debug') === '1') {
    if (!ACCESS_TOKEN || !PROFILE_ID) {
      return NextResponse.json({ error: 'env vars missing', ACCESS_TOKEN: !!ACCESS_TOKEN, PROFILE_ID: !!PROFILE_ID })
    }
    const params = new URLSearchParams()
    params.append('profile_ids[]', PROFILE_ID)
    params.append('text', 'test')
    params.append('now', 'true')
    const res = await fetch('https://api.bufferapp.com/1/updates/create.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${ACCESS_TOKEN}` },
      body: params.toString(),
    })
    const data = await res.json()
    return NextResponse.json({ status: res.status, data })
  }
  return POST(new NextRequest(req.url, { method: 'POST', body: '{}' }))
}

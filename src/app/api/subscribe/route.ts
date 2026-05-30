import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, newSubscriberEmail, welcomeEmail } from '@/lib/email'
import fs from 'fs'
import path from 'path'

interface DripSubscriber {
  email: string
  subscribedAt: string
  sentDays: number[]
}

function trackDripSubscriber(email: string) {
  // Only works locally (Vercel has read-only filesystem)
  if (process.env.VERCEL) return
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    const filePath = path.join(dataDir, 'subscribers-drip.json')
    let subscribers: DripSubscriber[] = []
    if (fs.existsSync(filePath)) {
      subscribers = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
    // Don't add duplicates
    if (!subscribers.find((s) => s.email === email)) {
      subscribers.push({ email, subscribedAt: new Date().toISOString(), sentDays: [] })
      fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2))
    }
  } catch (err) {
    console.error('[subscribe] drip tracking error:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    let totalSubscribers: number | undefined

    // Add to ConvertKit if configured
    const ckSecret = process.env.CONVERTKIT_API_SECRET
    const ckFormId = process.env.CONVERTKIT_FORM_ID

    if (ckSecret && ckFormId) {
      try {
        const ckRes = await fetch(
          `https://api.convertkit.com/v3/forms/${ckFormId}/subscribe`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_secret: ckSecret, email }),
          }
        )
        if (ckRes.ok) {
          // Get total subscriber count
          const countRes = await fetch(
            `https://api.convertkit.com/v3/subscribers?api_secret=${ckSecret}&per_page=1`
          )
          if (countRes.ok) {
            const countData = await countRes.json()
            totalSubscribers = countData.total_subscribers
          }
        }
      } catch (err) {
        console.error('[subscribe] ConvertKit error:', err)
      }
    }

    // Track subscriber for drip sequence (local only)
    trackDripSubscriber(email)

    // Send welcome email to new subscriber
    try {
      const welcome = welcomeEmail(email)
      await sendEmail({ ...welcome, to: email })
    } catch (err) {
      console.error('[subscribe] welcome email error:', err)
    }

    // Send notification email to admin
    const tmpl = newSubscriberEmail({ email, total: totalSubscribers })
    await sendEmail(tmpl)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

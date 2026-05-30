import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, newSubscriberEmail } from '@/lib/email'

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

    // Send notification email to admin
    const tmpl = newSubscriberEmail({ email, total: totalSubscribers })
    await sendEmail(tmpl)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

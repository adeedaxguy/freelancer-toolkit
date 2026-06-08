import { NextResponse } from 'next/server'
import { sendEmail, welcomeEmail, toolRequestEmail, newSubscriberEmail } from '@/lib/email'

const TEST_TO = 'adnan.webexpert@gmail.com'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Test endpoint disabled in production' }, { status: 403 })
  }
  const results: Record<string, unknown> = {}

  // 1. Admin notification test
  try {
    const r = await sendEmail({
      subject: '✅ FreelTools Email System — Admin Notification Test',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <div style="background:#16a34a;border-radius:12px;padding:20px 24px;margin-bottom:24px">
            <h2 style="color:white;margin:0">Email System Working ✅</h2>
            <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">freeltools.com</p>
          </div>
          <p style="color:#374151;font-size:15px">Admin notifications are working correctly. Sent from <strong>admin@freeltools.com</strong> via Resend.</p>
          <p style="color:#6b7280;font-size:13px;margin-top:16px">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
      to: TEST_TO,
    })
    results.adminNotification = r
  } catch (e) {
    results.adminNotification = { ok: false, error: String(e) }
  }

  // 2. Welcome email test
  try {
    const tmpl = welcomeEmail(TEST_TO)
    const r = await sendEmail({ ...tmpl, to: TEST_TO })
    results.welcomeEmail = r
  } catch (e) {
    results.welcomeEmail = { ok: false, error: String(e) }
  }

  // 3. New subscriber notification test
  try {
    const tmpl = newSubscriberEmail({ email: 'test@example.com', total: 42 })
    const r = await sendEmail({ ...tmpl, to: TEST_TO })
    results.subscriberNotification = r
  } catch (e) {
    results.subscriberNotification = { ok: false, error: String(e) }
  }

  // 4. Tool request notification test
  try {
    const tmpl = toolRequestEmail({
      toolName: 'Test Tool Request',
      description: 'This is a test tool request to verify email notifications.',
      email: 'user@example.com',
      total: 5,
    })
    const r = await sendEmail({ ...tmpl, to: TEST_TO })
    results.toolRequestNotification = r
  } catch (e) {
    results.toolRequestNotification = { ok: false, error: String(e) }
  }

  const allOk = Object.values(results).every((r: unknown) => (r as { ok: boolean }).ok)

  return NextResponse.json({
    status: allOk ? '✅ All emails sent successfully' : '⚠️ Some emails failed',
    sentTo: TEST_TO,
    results,
  })
}

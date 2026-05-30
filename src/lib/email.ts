import nodemailer from 'nodemailer'

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? 'adnan.webexpert@gmail.com'
const GMAIL_USER = process.env.GMAIL_USER ?? ''
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD ?? ''

function getTransport() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  })
}

export async function sendEmail({
  subject,
  html,
  text,
}: {
  subject: string
  html: string
  text?: string
}) {
  const transport = getTransport()
  if (!transport) {
    console.warn('[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email')
    return { ok: false, reason: 'not_configured' }
  }
  try {
    await transport.sendMail({
      from: `"FreelancerToolkit" <${GMAIL_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject,
      html,
      text: text ?? subject,
    })
    return { ok: true }
  } catch (err) {
    console.error('[email] send failed:', err)
    return { ok: false, reason: String(err) }
  }
}

// ─── Email Templates ────────────────────────────────────────────────────────

export function toolRequestEmail(data: {
  toolName: string
  description: string
  email: string
  total: number
}) {
  return {
    subject: `🛠️ New Tool Request: "${data.toolName}"`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <div style="background:#16a34a;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <h2 style="color:white;margin:0;font-size:18px">New Tool Request</h2>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">FreelancerToolkit.com</p>
        </div>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#6b7280;font-size:13px;width:120px">Tool Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600;font-size:15px;color:#111827">${data.toolName}</td>
          </tr>
          ${data.description ? `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#6b7280;font-size:13px;vertical-align:top">Problem</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#374151">${data.description}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:13px">Submitted by</td>
            <td style="padding:10px 0;font-size:14px;color:#374151">${data.email || 'Anonymous'}</td>
          </tr>
        </table>

        <div style="background:#f0fdf4;border-radius:8px;padding:14px 18px;margin-top:20px">
          <p style="margin:0;font-size:13px;color:#166534">
            Total requests in queue: <strong>${data.total}</strong>
          </p>
        </div>

        <p style="margin-top:24px;font-size:12px;color:#9ca3af">
          View all requests in the <a href="https://freeltools.com/admin/requests" style="color:#16a34a">admin panel</a>.
        </p>
      </div>
    `,
  }
}

export function newSubscriberEmail(data: { email: string; total?: number }) {
  return {
    subject: `📬 New Subscriber: ${data.email}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <div style="background:#16a34a;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <h2 style="color:white;margin:0;font-size:18px">New Subscriber</h2>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">FreelancerToolkit.com</p>
        </div>

        <p style="font-size:15px;color:#111827">
          <strong>${data.email}</strong> just signed up to your mailing list.
        </p>

        ${data.total ? `<p style="font-size:13px;color:#6b7280">Total subscribers: <strong>${data.total}</strong></p>` : ''}

        <p style="margin-top:24px;font-size:12px;color:#9ca3af">
          View subscribers in the <a href="https://freeltools.com/admin/subscribers" style="color:#16a34a">admin panel</a>.
        </p>
      </div>
    `,
  }
}

export function weeklyDigestEmail(data: {
  newSubscribers: number
  totalSubscribers: number
  topPages: Array<{ path: string; views: number }>
  postsPublished: number
}) {
  const topPagesHtml = data.topPages
    .slice(0, 5)
    .map(
      (p, i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#6b7280;font-size:13px">${i + 1}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151">${p.path}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;text-align:right"><strong>${p.views}</strong></td>
      </tr>`,
    )
    .join('')

  return {
    subject: `📊 FreelancerToolkit Weekly Digest`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <div style="background:#16a34a;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <h2 style="color:white;margin:0;font-size:18px">Weekly Digest</h2>
          <p style="color:#bbf7d0;margin:4px 0 0;font-size:13px">FreelancerToolkit.com</p>
        </div>

        <div style="display:flex;gap:16px;margin-bottom:24px">
          <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:700;color:#16a34a">+${data.newSubscribers}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280">New Subscribers</p>
          </div>
          <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:700;color:#111827">${data.totalSubscribers}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280">Total Subscribers</p>
          </div>
          <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;text-align:center">
            <p style="margin:0;font-size:28px;font-weight:700;color:#111827">${data.postsPublished}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280">Posts Published</p>
          </div>
        </div>

        <h3 style="font-size:14px;font-weight:600;color:#374151;margin-bottom:8px">Top Pages This Week</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;font-size:11px;color:#9ca3af;padding-bottom:6px;width:24px">#</th>
              <th style="text-align:left;font-size:11px;color:#9ca3af;padding-bottom:6px">Page</th>
              <th style="text-align:right;font-size:11px;color:#9ca3af;padding-bottom:6px">Views</th>
            </tr>
          </thead>
          <tbody>${topPagesHtml}</tbody>
        </table>

        <p style="margin-top:24px;font-size:12px;color:#9ca3af">
          View full stats in the <a href="https://freeltools.com/admin" style="color:#16a34a">admin panel</a>.
        </p>
      </div>
    `,
  }
}

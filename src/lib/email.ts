import { Resend } from 'resend'

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? 'adnan.webexpert@gmail.com'
const FROM_ADDRESS = 'FreelTools <admin@freeltools.com>'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendEmail({
  subject,
  html,
  to,
}: {
  subject: string
  html: string
  text?: string
  to?: string
}) {
  const resend = getResend()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping email')
    return { ok: false, reason: 'not_configured' }
  }
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to ?? NOTIFICATION_EMAIL],
      subject,
      html,
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

// ─── Welcome Email ──────────────────────────────────────────────────────────

export function welcomeEmail(email: string) {
  return {
    subject: `Welcome to FreelancerToolkit 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

  <!-- Header -->
  <tr><td style="background:#16a34a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center">
    <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="background:rgba(255,255,255,0.2);border-radius:10px;width:36px;height:36px;display:inline-block;text-align:center;line-height:36px;font-size:20px">🔧</div>
      <span style="color:white;font-size:18px;font-weight:700;vertical-align:middle">FreelancerToolkit</span>
    </div>
    <h1 style="color:white;margin:16px 0 8px;font-size:28px;font-weight:800;line-height:1.2">You're in. Let's get you paid more.</h1>
    <p style="color:#bbf7d0;margin:0;font-size:15px">17 free tools. Zero fluff. Built for freelancers who mean business.</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:white;padding:36px 40px">
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px">
      Hey 👋 — welcome aboard. You just joined a growing list of freelancers using FreelancerToolkit to charge more, win better clients, and run a tighter business.
    </p>

    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 8px;font-weight:600">Start with the most popular tool:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
      <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px">
        <p style="margin:0 0 4px;font-size:13px;color:#16a34a;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Most Used Tool</p>
        <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#111827">💰 Freelance Rate Calculator</p>
        <p style="margin:0 0 14px;font-size:14px;color:#6b7280;line-height:1.5">Enter your income goal, tax rate, and expenses. Get your minimum hourly rate — instantly. No more guessing.</p>
        <a href="https://freeltools.com/tools/freelancer-rate-calculator" style="display:inline-block;background:#16a34a;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600">Calculate My Rate →</a>
      </td></tr>
    </table>

    <p style="color:#374151;font-size:15px;font-weight:600;margin:0 0 12px">All 17 free tools at a glance:</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ['💰','Rate Calculator','Set your minimum hourly rate','/tools/freelancer-rate-calculator'],
        ['📄','Invoice Generator','Professional invoices in seconds','/tools/invoice-generator'],
        ['📝','Proposal Generator','Win clients with better proposals','/tools/proposal-generator'],
        ['📋','Scope of Work','Stop scope creep before it starts','/tools/scope-of-work-generator'],
        ['🧮','Project Cost Calc','Quote projects accurately','/tools/project-cost-calculator'],
        ['💸','Upwork Fee Calc','Know what you actually take home','/tools/upwork-fee-calculator'],
      ].map(([icon, name, desc, path]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;width:32px;font-size:18px">${icon}</td>
        <td style="padding:8px 12px 8px 8px;border-bottom:1px solid #f3f4f6">
          <a href="https://freeltools.com${path}" style="color:#111827;text-decoration:none;font-size:14px;font-weight:600">${name}</a>
          <p style="margin:2px 0 0;font-size:12px;color:#9ca3af">${desc}</p>
        </td>
      </tr>`).join('')}
    </table>

    <p style="color:#9ca3af;font-size:13px;margin:20px 0 0">
      <a href="https://freeltools.com" style="color:#16a34a;text-decoration:none;font-weight:600">See all 17 tools →</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center">
    <p style="margin:0;font-size:12px;color:#9ca3af">
      You're receiving this because you subscribed at freeltools.com.<br>
      No spam, ever. <a href="#" style="color:#6b7280">Unsubscribe</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  }
}

// ─── Drip Emails ─────────────────────────────────────────────────────────────

const BRAND = { green: '#16a34a', lightGreen: '#f0fdf4', border: '#bbf7d0', gray: '#6b7280', dark: '#111827' }

function dripWrapper(content: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
  <tr><td style="background:#16a34a;border-radius:16px 16px 0 0;padding:16px 32px">
    <span style="color:white;font-size:14px;font-weight:700">🔧 FreelancerToolkit</span>
  </td></tr>
  <tr><td style="background:white;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 16px 16px;padding:36px 40px">
    ${content}
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:28px 0">
    <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">
      FreelancerToolkit · Free tools for freelancers & agencies<br>
      <a href="#" style="color:#6b7280">Unsubscribe</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

function toolCta(label: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:${BRAND.green};color:white;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600;margin-top:16px">${label} →</a>`
}

export const DRIP_SEQUENCE: Array<{
  id: string
  day: number
  subject: string
  html: string
}> = [
  {
    id: 'day3',
    day: 3,
    subject: `The rate mistake that costs freelancers $20k/year 😬`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">Most freelancers set their rate wrong.</h2>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        Not because they're bad at math — because they start from the wrong number. They pick a rate they've seen on job boards or Reddit and work backwards.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        The right way: start from your income goal and work <em>forward</em>.
      </p>
      <div style="background:${BRAND.lightGreen};border-left:4px solid ${BRAND.green};border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0">
        <p style="margin:0;font-size:14px;color:#166534;font-weight:600">The formula:</p>
        <p style="margin:8px 0 0;font-size:14px;color:#166534;font-family:monospace;line-height:1.6">
          (Income Goal + Expenses + Taxes)<br>÷ Billable Hours<br>= Your Minimum Rate
        </p>
      </div>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 4px">
        The part most people miss: <strong>you're not billing 40 hours/week.</strong> Admin, marketing, proposals, and sick days eat 30–40% of your time. A realistic billable week is 20–25 hours.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:16px 0 0">
        Run your real numbers in 60 seconds:
      </p>
      ${toolCta('Calculate My Minimum Rate', 'https://freeltools.com/tools/freelancer-rate-calculator')}
    `),
  },
  {
    id: 'day7',
    day: 7,
    subject: `Why your proposals aren't converting (and what to fix)`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">Your proposal loses in the first paragraph.</h2>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        Most freelance proposals open with: <em>"Hi, I'm [name], I've been a designer for 8 years and I've worked with brands like..."</em>
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        The client doesn't care — yet. They're scanning for: <strong>does this person get my problem?</strong>
      </p>
      <p style="color:#374151;font-size:15px;font-weight:700;margin:0 0 12px">The structure that wins:</p>
      ${[
        ['1', 'Lead with their problem', 'One sentence showing you read the brief and understand the situation'],
        ['2', 'Define scope clearly', 'What\'s in. What\'s out. How many revision rounds. No vagueness.'],
        ['3', 'Show your process', 'A 4-step timeline kills the "how long will this take?" back-and-forth'],
        ['4', 'Price transparently', 'Line-item breakdown > single lump sum. It signals confidence.'],
        ['5', 'One clear CTA', '"Let\'s jump on a 20-min call Thursday" beats "let me know if you have questions"'],
      ].map(([n, title, desc]) => `
      <div style="display:flex;gap:12px;margin-bottom:14px">
        <div style="background:${BRAND.green};color:white;border-radius:50%;width:24px;height:24px;text-align:center;line-height:24px;font-size:12px;font-weight:700;flex-shrink:0;margin-top:2px">${n}</div>
        <div><p style="margin:0;font-size:14px;font-weight:600;color:${BRAND.dark}">${title}</p><p style="margin:3px 0 0;font-size:13px;color:${BRAND.gray}">${desc}</p></div>
      </div>`).join('')}
      ${toolCta('Generate a Winning Proposal', 'https://freeltools.com/tools/proposal-generator')}
    `),
  },
  {
    id: 'day14',
    day: 14,
    subject: `Scope creep is costing you more than you think 🔥`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">The most expensive four words in freelancing:</h2>
      <p style="color:#374151;font-size:18px;font-weight:700;text-align:center;margin:0 0 20px;color:${BRAND.green}">"Can you just quickly..."</p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        Scope creep doesn't usually arrive as a monster. It sneaks in as small requests that feel unreasonable to push back on — until you've added 12 hours of unpaid work to a fixed-price project.
      </p>
      <p style="color:#374151;font-size:15px;font-weight:700;margin:0 0 12px">The fix is a Scope of Work document that specifies:</p>
      ${['What\'s included (specific deliverables, formats, quantities)', 'What\'s NOT included (explicit, not implied)', 'How many revision rounds are covered', 'What happens when scope changes (your rate for additional work)', 'Timeline and payment milestones'].map(item => `
      <p style="margin:0 0 8px;font-size:14px;color:#374151">✅ ${item}</p>`).join('')}
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:20px 0 0">
        A signed SOW is your best protection. It also forces the client to think clearly about what they actually need before work starts.
      </p>
      ${toolCta('Generate My Scope of Work', 'https://freeltools.com/tools/scope-of-work-generator')}
    `),
  },
  {
    id: 'day21',
    day: 21,
    subject: `Upwork's fee structure changed — here's what you actually keep`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">Quick question: on a $3,000 Upwork project, how much do you take home?</h2>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        Most freelancers guess wrong — and that gap directly affects how they price.
      </p>
      <div style="background:${BRAND.lightGreen};border-radius:12px;padding:20px 24px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:13px;color:#166534;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Current Upwork Fee Structure (2024)</p>
        <p style="margin:0 0 6px;font-size:14px;color:#166534">• <strong>Flat 10%</strong> on all earnings (old tiered 20%/10%/5% is gone)</p>
        <p style="margin:0 0 6px;font-size:14px;color:#166534">• Plus client pays a 5% fee on top of your rate</p>
        <p style="margin:0;font-size:14px;color:#166534">• So a $3,000 project → you get <strong>$2,700</strong></p>
      </div>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        The strategy? Factor the fee into your rate. If you need $100/hr, quote $112/hr on Upwork. The client sees your "Upwork rate" — you keep your real number.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 4px">Compare what you keep across Upwork, Fiverr, Freelancer.com, and PeoplePerHour:</p>
      ${toolCta('Compare Platform Fees', 'https://freeltools.com/tools/freelancer-commission-calculator')}
    `),
  },
  {
    id: 'day30',
    day: 30,
    subject: `The retainer model: why top freelancers switch to monthly 📅`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">Project-to-project income is exhausting. Retainers fix it.</h2>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        The feast-or-famine cycle is the #1 reason talented freelancers burn out. One month you're turning down work. Three months later you're chasing leads at midnight.
      </p>
      <p style="color:#374151;font-size:15px;font-weight:700;margin:0 0 12px">What a retainer actually is:</p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        A fixed monthly fee for a committed set of hours or deliverables. The client gets predictable access. You get predictable income. Both sides win.
      </p>
      <div style="background:${BRAND.lightGreen};border-radius:12px;padding:20px 24px;margin:20px 0">
        <p style="margin:0 0 10px;font-size:14px;color:#166534;font-weight:600">Typical retainer structure:</p>
        <p style="margin:0 0 6px;font-size:14px;color:#166534">• 15–20 committed hours/month</p>
        <p style="margin:0 0 6px;font-size:14px;color:#166534">• 5–10% discount vs your project rate (reward for commitment)</p>
        <p style="margin:0 0 6px;font-size:14px;color:#166534">• 30-day rolling notice period to exit</p>
        <p style="margin:0;font-size:14px;color:#166534">• Invoiced on the 1st of each month</p>
      </div>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 4px">
        Even one retainer client covering 40% of your income transforms how you run your business.
      </p>
      ${toolCta('Calculate My Retainer Price', 'https://freeltools.com/tools/retainer-calculator')}
    `),
  },
  {
    id: 'day45',
    day: 45,
    subject: `Is it time to raise your rates? (Here's how to know) 📈`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">A rate you've never been pushed back on is probably too low.</h2>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px">
        If every client says yes immediately, you're undercharging. Healthy friction means you're priced at market. Here's how to raise rates without losing your best clients:
      </p>
      ${[
        ['Give 60 days notice', 'Email existing clients 60 days before the new rate kicks in. Never surprise them.'],
        ['Frame it as a review', '"I do an annual rate review in January" sounds professional. "I need more money" doesn\'t.'],
        ['Tie it to value added', 'If you\'ve delivered results, reference them. "Since we started working together, [outcome]..."'],
        ['Raise 15–25% at a time', 'Small raises look hesitant. A real market adjustment is meaningful.'],
        ['New clients, new rate immediately', 'Don\'t wait for the annual review. New clients always get your current rate.'],
      ].map(([title, desc]) => `
      <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f3f4f6">
        <p style="margin:0 0 3px;font-size:14px;font-weight:600;color:${BRAND.dark}">→ ${title}</p>
        <p style="margin:0;font-size:13px;color:${BRAND.gray};line-height:1.5">${desc}</p>
      </div>`).join('')}
      ${toolCta('Recalculate My Rate', 'https://freeltools.com/tools/freelancer-rate-calculator')}
    `),
  },
  {
    id: 'day60',
    day: 60,
    subject: `2 months in — here's what top freelancers do differently 🏆`,
    html: dripWrapper(`
      <h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${BRAND.dark}">The difference between a struggling freelancer and a thriving one isn't talent.</h2>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px">
        It's systems. Here are the 5 non-negotiables that consistently separate top earners:
      </p>
      ${[
        ['They know their numbers cold', 'Break-even point. Minimum rate. Profit margin. Revenue goal. If you can\'t answer these in 10 seconds, that\'s the first thing to fix.'],
        ['They have a signed SOW on every project', 'No exceptions. Even for "quick" work. Especially for "quick" work.'],
        ['They invoice immediately and chase fast', 'Same-day invoicing after project delivery. Follow up on day 7, day 14, day 21. Politely ruthless.'],
        ['They say no to bad-fit clients', 'Every bad client takes time you could spend finding a great one. The questionnaire before kickoff pays for itself.'],
        ['They raise rates every 12 months', 'Expenses go up. Skills improve. Rates that don\'t move backwards.'],
      ].map(([title, desc], i) => `
      <div style="display:flex;gap:14px;margin-bottom:18px">
        <div style="background:${BRAND.green};color:white;border-radius:50%;width:28px;height:28px;text-align:center;line-height:28px;font-size:13px;font-weight:700;flex-shrink:0;margin-top:2px">${i+1}</div>
        <div><p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${BRAND.dark}">${title}</p><p style="margin:0;font-size:13px;color:${BRAND.gray};line-height:1.5">${desc}</p></div>
      </div>`).join('')}
      <div style="background:${BRAND.lightGreen};border-radius:12px;padding:18px 22px;margin-top:8px">
        <p style="margin:0;font-size:14px;color:#166534">All 17 tools to back up these habits are free at <a href="https://freeltools.com" style="color:${BRAND.green};font-weight:600">freeltools.com</a> — no login, no paywall, no ads.</p>
      </div>
    `),
  },
]

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

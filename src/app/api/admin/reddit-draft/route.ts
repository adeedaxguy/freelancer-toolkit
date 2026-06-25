import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { ALL_TOOLS } from '@/lib/tools'

const SITE_URL = 'https://freeltools.com'
const TOTAL_TOOLS = ALL_TOOLS.length

interface RedditPost {
  subreddit: string
  title: string
  body: string
  toolUrl: string
  flairNote: string
}

// Rotating pool of posts — one per day of the week
const POSTS: RedditPost[] = [
  {
    subreddit: 'r/freelance',
    title: 'I built a free rate calculator that tells you exactly what to charge (no email needed)',
    body: `Hey r/freelance,

One of the biggest mistakes freelancers make is guessing their rate. So I built a calculator that does the math properly.

**How it works:**
- Enter your annual income goal
- Add your tax rate, expenses, and vacation weeks
- It spits out your required hourly rate

No email, no login. Just the number.

👉 ${SITE_URL}/tools/freelancer-rate-calculator

Happy to answer questions or hear if your rate comes out way different than what you expected!`,
    toolUrl: `${SITE_URL}/tools/freelancer-rate-calculator`,
    flairNote: 'Post under "Tools & Resources" flair if available',
  },
  {
    subreddit: 'r/webdev',
    title: 'Free invoice generator for freelance devs — clean PDF output, no account required',
    body: `Made this for freelance web developers who need to send quick invoices without paying for Wave/FreshBooks.

**Features:**
- Add line items, quantities, rates
- Tax calculation built in
- Preview mode with clean PDF export
- Zero data stored server-side

Works great for one-off client invoices or retainers.

👉 ${SITE_URL}/tools/invoice-generator

Built with Next.js + Tailwind if anyone's curious about the stack.`,
    toolUrl: `${SITE_URL}/tools/invoice-generator`,
    flairNote: 'Post under "Showoff Saturday" or "Tools" flair',
  },
  {
    subreddit: 'r/freelance',
    title: 'How much does Upwork actually take? Built a calculator to compare all major platforms',
    body: `I kept getting confused about Upwork's sliding fee structure vs Fiverr vs Freelancer.com, so I built a side-by-side comparison tool.

Enter what you want to earn → it shows what you need to charge on each platform to hit that number.

Platforms covered: Upwork, Fiverr, Freelancer.com, PeoplePerHour

👉 ${SITE_URL}/tools/freelancer-commission-calculator

The differences are pretty eye-opening, especially at lower contract values.`,
    toolUrl: `${SITE_URL}/tools/freelancer-commission-calculator`,
    flairNote: 'Post under "Tools & Resources" flair if available',
  },
  {
    subreddit: 'r/Entrepreneur',
    title: `Built ${TOTAL_TOOLS} free tools for freelancers, agencies, and document workflows — no login, no ads, no catch`,
    body: `Started freeltools.com because I was frustrated paying for tools that should be free.

**What's included:**
- Rate calculator (set your hourly based on income goals + tax)
- Project cost estimator
- Proposal generator
- Scope of work generator
- Invoice generator (PDF export)
- Commission comparison (Upwork vs Fiverr vs others)
- Passport and visa photo makers
- Image resizers and PDF converters
- ${TOTAL_TOOLS} tools total

All run in-browser. No account, no data stored. MIT spirit.

👉 ${SITE_URL}

Happy to get feedback from this community.`,
    toolUrl: SITE_URL,
    flairNote: 'Post under "Tools/Resources" flair',
  },
  {
    subreddit: 'r/freelance',
    title: 'Free proposal generator — paste in client details, get a professional proposal in 60 seconds',
    body: `Writing proposals used to take me an hour. Built a generator that does it in under a minute.

**You fill in:**
- Your name + client name
- The project type
- Client's main problem/goal
- Your deliverables

**It generates:**
- Full proposal with executive summary
- Scope, timeline, investment section
- Professional formatting you can copy-paste

👉 ${SITE_URL}/tools/proposal-generator

No templates to buy, no account needed.`,
    toolUrl: `${SITE_URL}/tools/proposal-generator`,
    flairNote: 'Post under "Tools & Resources" flair if available',
  },
  {
    subreddit: 'r/agency',
    title: 'Free scope of work generator for agencies — stops scope creep before it starts',
    body: `Scope creep killed two of my projects last year because the SOW was vague. Built a generator to fix this.

Enter your project details → get a clear, professional scope of work document that specifies exactly what's included and what's not.

Clients sign off on it before work begins = no arguments later.

👉 ${SITE_URL}/tools/scope-of-work-generator

Takes 3 minutes. Free, no account.`,
    toolUrl: `${SITE_URL}/tools/scope-of-work-generator`,
    flairNote: 'Post under "Resources" flair',
  },
  {
    subreddit: 'r/freelance',
    title: 'Hourly vs fixed price calculator — shows which billing model earns you more per project',
    body: `The "should I charge hourly or fixed?" question comes up constantly. Built a calculator to answer it with actual numbers.

Enter your estimated hours + hourly rate + fixed price quote → it shows:
- Which earns more
- Your effective hourly under each model
- Break-even hours

Really useful when a client pushes for fixed and you want to know if it's worth it.

👉 ${SITE_URL}/tools/hourly-vs-fixed-calculator

Free, no login.`,
    toolUrl: `${SITE_URL}/tools/hourly-vs-fixed-calculator`,
    flairNote: 'Post under "Tools & Resources" flair if available',
  },
]

function getTodaysPost(): RedditPost {
  const dayIndex = new Date().getDay() // 0 = Sunday
  return POSTS[dayIndex % POSTS.length]
}

function buildEmail(post: RedditPost): string {
  return `
<div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:20px">
  <h2 style="color:#16a34a">📝 Today's Reddit Draft</h2>
  <p style="color:#555">Ready to post — takes 60 seconds. Just copy-paste into Reddit.</p>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0">
    <p style="margin:0 0 8px 0"><strong>Subreddit:</strong> <a href="https://reddit.com/${post.subreddit}" style="color:#16a34a">${post.subreddit}</a></p>
    <p style="margin:0 0 8px 0"><strong>Flair tip:</strong> ${post.flairNote}</p>
    <p style="margin:0"><strong>Tool URL:</strong> <a href="${post.toolUrl}" style="color:#16a34a">${post.toolUrl}</a></p>
  </div>

  <div style="background:#fff;border:2px solid #16a34a;border-radius:8px;padding:20px;margin:20px 0">
    <p style="margin:0 0 12px 0;font-weight:bold;color:#111">TITLE (copy this):</p>
    <p style="margin:0;background:#f0fdf4;padding:12px;border-radius:4px;font-size:15px">${post.title}</p>
  </div>

  <div style="background:#fff;border:2px solid #16a34a;border-radius:8px;padding:20px;margin:20px 0">
    <p style="margin:0 0 12px 0;font-weight:bold;color:#111">BODY (copy this):</p>
    <pre style="margin:0;background:#f0fdf4;padding:12px;border-radius:4px;font-size:13px;white-space:pre-wrap;font-family:monospace">${post.body}</pre>
  </div>

  <div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:16px;margin:20px 0">
    <p style="margin:0;font-size:13px;color:#713f12">
      <strong>Tips:</strong> Post between 8–10am or 6–8pm in your local time for best visibility.
      Don't post the same subreddit two days in a row. Reply to comments within the first hour.
    </p>
  </div>

  <p style="color:#94a3b8;font-size:12px">FreelTools.com · <a href="${SITE_URL}" style="color:#16a34a">Visit site</a></p>
</div>
  `.trim()
}

// POST /api/admin/reddit-draft
export async function POST() {
  try {
    const post = getTodaysPost()
    const html = buildEmail(post)

    await sendEmail({
      subject: `📝 Reddit Draft Ready: ${post.subreddit} — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
      html,
    })

    return NextResponse.json({
      ok: true,
      subreddit: post.subreddit,
      title: post.title,
      message: 'Draft emailed successfully',
    })
  } catch (err) {
    console.error('Reddit draft error:', err)
    return NextResponse.json({ error: 'Failed to send draft' }, { status: 500 })
  }
}

// GET for easy testing
export async function GET() {
  return POST()
}

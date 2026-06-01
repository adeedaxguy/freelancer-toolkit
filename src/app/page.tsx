import type { Metadata } from 'next'
import Link from 'next/link'
import ToolCard from '@/components/ToolCard'
import EmailCapture from '@/components/EmailCapture'
import RequestATool from '@/components/RequestATool'
import { TOOL_CATEGORIES } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'FreelancerToolkit – 17 Free Tools for Freelancers & Agencies',
  description:
    'Free calculators and generators for freelancers and agencies. Set your rate, quote projects, write proposals, create invoices. No login required.',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FreelancerToolkit',
  url: 'https://freelancertoolkit.com',
  description: 'Free tools for freelancers, agencies, and consultants.',
}

const stats = [
  { label: 'Free Tools', value: '17' },
  { label: 'No Login Required', value: '✓' },
  { label: 'Data Stored', value: '0' },
]

export default function HomePage() {
  const totalTools = TOOL_CATEGORIES.reduce((sum, c) => sum + c.tools.length, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              {totalTools} Free Tools · No Account Needed
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Tools That Help Freelancers{' '}
              <span className="text-brand-600">Charge What They&apos;re Worth</span>
            </h1>
            <p className="mt-6 text-lg text-gray-500">
              Free calculators and generators for freelancers, agencies, and consultants. Calculate your rate, quote projects, generate proposals, create invoices, and grow your business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/tools/freelancer-rate-calculator" className="btn-primary px-6 py-3 text-base">
                Calculate Your Rate →
              </Link>
              <Link href="#tools" className="btn-secondary px-6 py-3 text-base">
                Browse All {totalTools} Tools
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-brand-600 sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools by category */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        {TOOL_CATEGORIES.map((cat) => (
          <div key={cat.slug} id={cat.name.toLowerCase().replace(/\s+/g, '-')}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{cat.name}</h2>
              <p className="mt-1 text-gray-500">{cat.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {cat.tools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  title={tool.title}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  icon={tool.icon}
                  keywords={tool.keywords}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Email Capture */}
      <section className="border-t border-gray-100 bg-brand-600">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Get New Tools First</h2>
          <p className="mt-3 text-brand-100">
            We&apos;re building even more free tools for freelancers. Join the list and be the first to know.
          </p>
          <EmailCapture />
          <p className="mt-3 text-xs text-brand-200">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Request a Tool */}
      <RequestATool />

      {/* SEO content section */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Free Tools Built for Freelancers, Agencies & Consultants</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base">
            <p>
              FreelancerToolkit provides <strong>17 free business tools</strong> designed specifically for independent professionals. Whether you&apos;re trying to figure out how much to charge, prepare a client proposal, or calculate your break-even point, every tool works instantly in your browser — no login, no account, no data stored.
            </p>
            <p>
              Our <strong>freelance rate calculator</strong> helps you set your hourly rate based on your income goal, tax rate, and expenses. The <strong>project cost calculator</strong> lets you build a quote with scope buffers and revision rounds built in. The <strong>commission calculator</strong> compares fees across Upwork, Fiverr, Freelancer.com, and PeoplePerHour side by side.
            </p>
            <p>
              For client acquisition, our <strong>proposal generator</strong> and <strong>scope of work generator</strong> produce professional documents you can copy and send in minutes. The <strong>discovery call script generator</strong> gives you a structured, category-specific script for winning new clients.
            </p>
            <p>
              All tools are completely free, mobile-friendly, and optimized for search. No ads interrupt the experience. Built by freelancers, for freelancers.
            </p>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">Why FreelancerToolkit?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { icon: '⚡', title: 'Instant Results', body: 'All calculations happen in your browser. No waiting, no servers, no login.' },
              { icon: '🔒', title: 'Private by Default', body: "We don't store your numbers. Your financial data stays on your device." },
              { icon: '🎯', title: 'Built for Freelancers', body: 'Every input and formula is designed around how freelancers and agencies actually price their work.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

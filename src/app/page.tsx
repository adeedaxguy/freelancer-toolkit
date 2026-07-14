import type { Metadata } from 'next'
import Link from 'next/link'
import ToolCard from '@/components/ToolCard'
import EmailCapture from '@/components/EmailCapture'
import RequestATool from '@/components/RequestATool'
import { getCategoryUrl } from '@/lib/categoryPages'
import { TOOL_CATEGORIES } from '@/lib/tools'

const SITE_URL = 'https://freeltools.com'
const TOTAL_TOOLS = TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.tools.length, 0)
const TOOL_COUNT_LABEL = TOTAL_TOOLS >= 100 ? '100+' : String(TOTAL_TOOLS)
const OG_IMAGE = `${SITE_URL}/opengraph-image`

export const metadata: Metadata = {
  title: `FreelancerToolkit – ${TOOL_COUNT_LABEL} Free Tools for Freelancers & Agencies`,
  description:
    'Free calculators, generators, passport photo makers, PDF converters, and image tools for freelancers and agencies. No login required.',
  openGraph: {
    title: `FreelancerToolkit – ${TOOL_COUNT_LABEL} Free Tools for Freelancers & Agencies`,
    description:
      'Free calculators, generators, passport photo makers, PDF converters, and image tools for freelancers and agencies. No login required.',
    url: SITE_URL,
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${TOOL_COUNT_LABEL} free freelancer tools` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `FreelancerToolkit – ${TOOL_COUNT_LABEL} Free Tools for Freelancers & Agencies`,
    description:
      'Free calculators, generators, passport photo makers, PDF converters, and image tools for freelancers and agencies. No login required.',
    images: [OG_IMAGE],
  },
}

function buildItemListSchema() {
  const allTools = TOOL_CATEGORIES.flatMap((cat) => cat.tools)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Tools for Freelancers — FreelancerToolkit',
    description: `${TOOL_COUNT_LABEL} free business, document, image, and passport photo tools. No account required.`,
    url: SITE_URL,
    numberOfItems: allTools.length,
    itemListElement: allTools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.title,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      item: {
        '@type': 'WebApplication',
        name: tool.title,
        url: `${SITE_URL}/tools/${tool.slug}`,
        description: tool.description,
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    })),
  }
}

const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is FreelancerToolkit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `FreelancerToolkit (freeltools.com) is a free collection of ${TOOL_COUNT_LABEL} tools for freelancers, agencies, and independent consultants. Tools include business calculators, proposal generators, invoice tools, passport and visa photo makers, PDF converters, image resizers, and more. No account or login is required.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Are the tools on FreelancerToolkit free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. All ${TOOL_COUNT_LABEL} tools on FreelancerToolkit are completely free. There is no account required, no credit card, no subscription, and no free trial. Many tools run entirely in your browser.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best free freelance rate calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FreelancerToolkit\'s Freelancer Rate Calculator (freeltools.com/tools/freelancer-rate-calculator) calculates your minimum hourly rate based on your income goal, tax rate, monthly expenses, and billable hours per week — giving a data-backed rate, not a rough guess.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best free invoice generator for freelancers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FreelancerToolkit\'s Invoice Generator (freeltools.com/tools/invoice-generator) lets you create a professional invoice with line items, tax, and totals, then export it as a PDF — no account or subscription required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does FreelancerToolkit store my financial data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All calculations on FreelancerToolkit happen in your browser. Nothing is sent to a server or stored. Your financial numbers stay completely private on your device.',
      },
    },
    {
      '@type': 'Question',
      name: 'What tools does FreelancerToolkit include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `FreelancerToolkit includes ${TOOL_COUNT_LABEL} free tools across freelance pricing, client operations, marketplace fees, passport and visa photos, image resizing, PDF conversion, and document generation.`,
      },
    },
  ],
}

const stats = [
  { label: 'Free Tools', value: TOOL_COUNT_LABEL },
  { label: 'No Login Required', value: '✓' },
  { label: 'Data Stored', value: '0' },
]

export default function HomePage() {
  const totalTools = TOTAL_TOOLS
  const itemListSchema = buildItemListSchema()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }} />
      {/* Hero */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[22rem] text-center sm:max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              {TOOL_COUNT_LABEL} Free Tools · No Account Needed
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="block sm:inline">Tools That Help</span>{' '}
              <span className="block sm:inline">Freelancers</span>{' '}
              <span className="block text-brand-600 sm:inline">Charge What</span>{' '}
              <span className="block text-brand-600 sm:inline">They&apos;re Worth</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-500 sm:text-lg">
              Free calculators and generators for freelancers, agencies, and consultants. Calculate your rate, quote projects, generate proposals, create invoices, and grow your business.
            </p>
            <div className="mx-auto mt-8 flex max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
              <Link href="/tools/freelancer-rate-calculator" className="btn-primary px-6 py-3 text-base">
                Calculate Your Rate →
              </Link>
              <Link href="#tools" className="btn-secondary px-6 py-3 text-base">
                Browse All {TOOL_COUNT_LABEL} Tools
              </Link>
            </div>
            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2 text-xs font-medium text-gray-500">
              <Link href="/tools/fiverr-fee-calculator" className="rounded-full border border-gray-200 px-3 py-1.5 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Estimate Fiverr fees
              </Link>
              <Link href="/tools/late-payment-fee-calculator" className="rounded-full border border-gray-200 px-3 py-1.5 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Calculate late fees
              </Link>
              <Link href="/tools/resize-image-to-20kb" className="rounded-full border border-gray-200 px-3 py-1.5 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Resize image to 20KB
              </Link>
              <Link href="/tools/germany-visa-photo-generator" className="rounded-full border border-gray-200 px-3 py-1.5 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Make visa photos
              </Link>
              <Link href="/tools/app-icon-generator" className="rounded-full border border-gray-200 px-3 py-1.5 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Generate app icons
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
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  <Link href={getCategoryUrl(cat)} className="hover:text-brand-600">{cat.name}</Link>
                </h2>
                <p className="mt-1 text-gray-500">{cat.description}</p>
              </div>
              <Link href={getCategoryUrl(cat)} className="text-sm font-semibold text-brand-600 hover:underline">
                View category →
              </Link>
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
              FreelancerToolkit provides <strong>{TOOL_COUNT_LABEL} free tools</strong> designed for independent professionals and people who need fast document utilities. Whether you&apos;re pricing client work, preparing a proposal, creating a passport photo, resizing an application upload, or converting images to PDF, the tools work instantly — no login or subscription required.
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

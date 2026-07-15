import type { Metadata } from 'next'
import Link from 'next/link'
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
        text: 'No. Most calculations and browser-based file tools on FreelancerToolkit run locally in your browser. Your financial numbers and many uploaded files stay on your device.',
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

const allTools = TOOL_CATEGORIES.flatMap((cat) => cat.tools)

function getTool(slug: string) {
  const tool = allTools.find((item) => item.slug === slug)
  if (!tool) throw new Error(`Missing homepage tool: ${slug}`)
  return tool
}

const primaryTools = [
  getTool('freelancer-rate-calculator'),
  getTool('project-cost-calculator'),
  getTool('fiverr-fee-calculator'),
  getTool('invoice-generator'),
  getTool('proposal-generator'),
  getTool('germany-visa-photo-generator'),
]

const quickTasks = [
  { label: 'Price a project', href: '/tools/project-cost-calculator', eyebrow: 'Pricing' },
  { label: 'Calculate platform fees', href: '/tools/fiverr-fee-calculator', eyebrow: 'Marketplace' },
  { label: 'Create an invoice', href: '/tools/invoice-generator', eyebrow: 'Operations' },
  { label: 'Generate a proposal', href: '/tools/proposal-generator', eyebrow: 'Client work' },
  { label: 'Make a visa photo', href: '/tools/germany-visa-photo-generator', eyebrow: 'Applications' },
  { label: 'Resize to 20KB', href: '/tools/resize-image-to-20kb', eyebrow: 'File upload' },
]

const proofPoints = [
  { value: TOOL_COUNT_LABEL, label: 'free tools' },
  { value: '0', label: 'accounts required' },
  { value: 'Local', label: 'browser-first file tools' },
]

const workflowSteps = [
  { title: 'Quote', body: 'Find your rate, project cost, retainers, fees, and profit targets before you send a price.' },
  { title: 'Win', body: 'Turn discovery notes into proposals, scopes, contracts, questionnaires, and follow-up emails.' },
  { title: 'Deliver', body: 'Prepare invoices, images, PDFs, passport photos, app files, and client documents faster.' },
]

export default function HomePage() {
  const itemListSchema = buildItemListSchema()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }} />

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {TOOL_COUNT_LABEL} free freelancer tools
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] text-gray-950 sm:text-5xl lg:text-6xl">
              The freelancer operating system for pricing, paperwork, and files.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Calculator-grade tools for client work, marketplace fees, invoices, proposals, passport photos, image resizing,
              and PDFs. Free to use, fast to open, and built for people who bill their own work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools/freelancer-rate-calculator" className="inline-flex justify-center rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800">
                Calculate your rate
              </Link>
              <Link href="#tools" className="inline-flex justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-brand-200 hover:text-brand-700">
                Browse tool library
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {proofPoints.map((point) => (
                <div key={point.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xl font-bold text-gray-950">{point.value}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{point.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 shadow-2xl">
            <div className="rounded-lg bg-white p-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Start with a job to be done</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">Popular workflows</p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">No login</span>
              </div>
              <div className="mt-4 grid gap-2">
                {quickTasks.map((task) => (
                  <Link
                    key={task.href}
                    href={task.href}
                    className="group flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 transition hover:border-brand-200 hover:bg-brand-50"
                  >
                    <span>
                      <span className="block text-[11px] font-semibold uppercase text-gray-400">{task.eyebrow}</span>
                      <span className="mt-0.5 block text-sm font-semibold text-gray-900 group-hover:text-brand-700">{task.label}</span>
                    </span>
                    <span className="text-gray-300 group-hover:text-brand-600">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <div key={step.title} className="rounded-lg border border-gray-200 bg-white p-5">
                <h2 className="text-base font-bold text-gray-950">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-700">Most used tools</p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-950">Open the right tool in one click</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
              Start with the highest-intent tools first, then browse the full library by category below.
            </p>
          </div>
          <Link href="/tools/category/pricing" className="inline-flex w-fit rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-200 hover:text-brand-700">
            View pricing tools
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {primaryTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xl">{tool.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-950 group-hover:text-brand-700">{tool.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">{tool.description}</p>
                  <span className="mt-3 inline-flex text-sm font-semibold text-brand-700">Use tool →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-brand-700">Tool library</p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-950">Browse by outcome, not by clutter</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Each category has its own SEO hub and full tool list. The homepage shows a preview so visitors can choose a lane
              quickly without scanning every utility at once.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TOOL_CATEGORIES.map((cat) => (
              <section key={cat.slug} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-950">
                      <Link href={getCategoryUrl(cat)} className="hover:text-brand-700">{cat.name}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{cat.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500 shadow-sm">{cat.tools.length}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {cat.tools.slice(0, 4).map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex min-w-0 items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-700">
                      <span className="shrink-0">{tool.icon}</span>
                      <span className="truncate">{tool.title}</span>
                    </Link>
                  ))}
                </div>
                <Link href={getCategoryUrl(cat)} className="mt-5 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800">
                  View all {cat.name.toLowerCase()} →
                </Link>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-300">Private by design</p>
            <h2 className="mt-2 text-3xl font-extrabold">Useful tools without account friction.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['No login wall', 'Open tools instantly without creating an account.'],
              ['Browser-first', 'Many image, PDF, and calculator workflows run locally.'],
              ['Clear pages', 'Every major tool has its own focused SEO page.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-950">Get new tools first</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            Join for practical new calculators, file utilities, and freelancer workflows as they go live.
          </p>
          <EmailCapture />
          <p className="mt-3 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <RequestATool />

      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-950">Free tools built for freelancers, agencies, and consultants</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
            <p>
              FreelancerToolkit provides <strong>{TOOL_COUNT_LABEL} free tools</strong> designed for independent professionals
              and people who need fast document utilities. Whether you are pricing client work, preparing a proposal, creating a
              passport photo, resizing an application upload, or converting images to PDF, the tools work instantly with no login
              or subscription required.
            </p>
            <p>
              The <strong>freelance rate calculator</strong> helps you set your hourly rate based on your income goal, tax rate,
              expenses, and billable time. The <strong>project cost calculator</strong> helps you build a quote with scope,
              revision, and buffer assumptions. Marketplace calculators estimate Fiverr, Upwork, and commission fees before you
              send a price.
            </p>
            <p>
              For client acquisition, the <strong>proposal generator</strong>, <strong>scope of work generator</strong>, and
              <strong> discovery call script generator</strong> help turn messy client notes into usable business documents.
              File utilities handle passport photos, application images, PDF conversion, compression, and upload-size limits.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

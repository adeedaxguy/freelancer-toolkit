import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://freeltools.com'
const EMAIL = 'adnan@technodigg.com'

export const metadata: Metadata = {
  title: 'Contact FreelancerToolkit',
  description: 'Contact FreelancerToolkit for tool support, corrections, privacy questions, copyright concerns, and partnership inquiries.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact FreelancerToolkit',
    description: 'Get in touch with FreelancerToolkit about free tools, corrections, privacy, and support.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Contact FreelancerToolkit' }],
  },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact FreelancerToolkit',
  url: `${SITE_URL}/contact`,
  description: 'Contact page for FreelancerToolkit support, corrections, privacy questions, copyright concerns, and tool requests.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'FreelancerToolkit',
    url: SITE_URL,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: EMAIL,
    contactType: 'customer support',
    availableLanguage: ['en'],
  },
}

const contactReasons = [
  'Report a broken calculator, file tool, or generator',
  'Request a correction to a formula, article, or requirement',
  'Ask a privacy, data, or cookie question',
  'Send a copyright, attribution, or removal request',
  'Suggest a new free tool for freelancers or agencies',
  'Discuss advertising, sponsorship, or partnership requests',
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Contact</span>
      </nav>

      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Contact</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Contact FreelancerToolkit
        </h1>
        <p className="mt-5 text-base leading-8 text-gray-600">
          For support, corrections, privacy questions, copyright concerns, tool requests, or partnership inquiries, email us
          directly. Include the page URL and a short description so we can review the issue quickly.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-7 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Email {EMAIL}
        </a>
      </div>

      <section className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">What to contact us about</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {contactReasons.map((reason) => (
            <li key={reason} className="flex gap-3 text-sm leading-6 text-gray-600">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Helpful links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/about" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand-200 hover:text-brand-700">
            About
          </Link>
          <Link href="/privacy" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand-200 hover:text-brand-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand-200 hover:text-brand-700">
            Terms of Use
          </Link>
          <Link href="/#request-tool" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand-200 hover:text-brand-700">
            Request a Tool
          </Link>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://freeltools.com'

export const metadata: Metadata = {
  title: 'About FreelancerToolkit',
  description: 'Learn who maintains FreelancerToolkit, how the free freelancer tools are built, and how to contact the site owner.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About FreelancerToolkit',
    description: 'Free calculators, generators, passport photo makers, image tools, and PDF utilities for freelancers and agencies.',
    url: `${SITE_URL}/about`,
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'About FreelancerToolkit' }],
  },
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About FreelancerToolkit',
  url: `${SITE_URL}/about`,
  description: 'About the free freelancer tools, editorial standards, privacy approach, and contact path for FreelancerToolkit.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'FreelancerToolkit',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'FreelancerToolkit',
    alternateName: 'FreelTools',
    url: SITE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'adnan@technodigg.com',
      contactType: 'customer support',
      url: `${SITE_URL}/contact`,
    },
  },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-gray-600">About</span>
      </nav>

      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">About FreelancerToolkit</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Free practical tools for freelancers, agencies, and consultants.
        </h1>
        <p className="mt-5 text-base leading-8 text-gray-600">
          FreelancerToolkit, available at freeltools.com, helps independent professionals handle everyday business work faster:
          pricing projects, calculating fees, generating proposals, creating invoices, preparing passport and visa photos,
          resizing images, and converting documents.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">Who runs the site</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            FreelancerToolkit is maintained by Adnan and the Technodigg team. The site is built as a free resource for
            freelancers and small agencies who need simple, browser-based tools without creating an account.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">How the tools work</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            Many calculators and file tools run locally in your browser. Some AI-assisted text generators use the details you
            enter to create the requested output. The site is designed to be useful first, with clear tool pages and practical
            explanations around each workflow.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">Content and accuracy standards</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            We review formulas, examples, and tool guidance before publishing. Because platform fees, tax rules, passport
            requirements, visa requirements, and document rules can change, important outputs should be checked against official
            sources or a qualified professional before submission.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">Corrections and requests</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            If you find an error, need a source reviewed, or want a new tool added, contact us at{' '}
            <a href="mailto:adnan@technodigg.com" className="font-semibold text-brand-600 underline hover:text-brand-700">
              adnan@technodigg.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">Important policies</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          Review the <Link href="/privacy" className="font-semibold text-brand-700 underline">Privacy Policy</Link> and{' '}
          <Link href="/terms" className="font-semibold text-brand-700 underline">Terms of Use</Link> for details about data,
          cookies, analytics, advertising disclosures, and limitations of the tools.
        </p>
      </div>
    </div>
  )
}

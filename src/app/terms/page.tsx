import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://freeltools.com'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for FreelancerToolkit free tools.',
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: 'Terms of Use | FreelancerToolkit',
    description: 'Terms for using FreelancerToolkit free calculators, generators, and file tools.',
    url: `${SITE_URL}/terms`,
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'FreelancerToolkit terms of use' }],
  },
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Terms of Use</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Terms of Use</h1>
      <p className="mt-3 text-sm text-gray-500">Last updated: June 26, 2026</p>

      <div className="mt-8 space-y-7 text-sm leading-7 text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900">Use of the site</h2>
          <p className="mt-2">
            FreelancerToolkit provides free online tools, calculators, templates, and educational content. You may use the tools for lawful personal or business purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">No professional advice</h2>
          <p className="mt-2">
            The site provides general information and estimates only. Financial, tax, legal, immigration, passport, visa, and document-related outputs should be reviewed against official requirements or with a qualified professional before you rely on them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Accuracy and availability</h2>
          <p className="mt-2">
            We work to keep tools useful and accurate, but formulas, platform fees, government requirements, taxes, and third-party rules can change. The tools are provided as-is and may be updated, changed, or removed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Your responsibility</h2>
          <p className="mt-2">
            You are responsible for checking outputs before sending invoices, proposals, contracts, application files, passport photos, or other documents to clients, platforms, agencies, or authorities.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent to <a href="mailto:adnan@technodigg.com" className="text-brand-600 underline hover:text-brand-700">adnan@technodigg.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}

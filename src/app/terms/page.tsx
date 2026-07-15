import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://freeltools.com'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for FreelancerToolkit free tools, calculators, generators, image tools, PDF tools, and educational content.',
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
      <p className="mt-3 text-sm text-gray-500">Last updated: July 16, 2026</p>

      <div className="mt-8 space-y-7 text-sm leading-7 text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900">Use of the site</h2>
          <p className="mt-2">
            FreelancerToolkit provides free online tools, calculators, templates, generators, file utilities, and educational
            content. You may use the tools for lawful personal or business purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">No professional advice</h2>
          <p className="mt-2">
            The site provides general information and estimates only. Financial, tax, legal, immigration, passport, visa, and
            document-related outputs should be reviewed against official requirements or with a qualified professional before
            you rely on them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Accuracy and availability</h2>
          <p className="mt-2">
            We work to keep tools useful and accurate, but formulas, platform fees, government requirements, taxes, and
            third-party rules can change. The tools are provided as-is and may be updated, changed, or removed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Your responsibility</h2>
          <p className="mt-2">
            You are responsible for checking outputs before sending invoices, proposals, contracts, application files, passport
            photos, or other documents to clients, platforms, agencies, or authorities. Do not use the site for illegal,
            deceptive, infringing, harmful, or abusive activity.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Advertising and third-party links</h2>
          <p className="mt-2">
            FreelancerToolkit may display advertising or link to third-party websites. Ads and external links may be provided by
            third parties and do not mean we endorse every claim, offer, product, or service shown. Advertising must remain
            separate from tool controls, download buttons, navigation, and other site content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Copyright and corrections</h2>
          <p className="mt-2">
            If you believe content on the site is inaccurate, infringes your rights, or should be removed, contact us with the
            page URL, a description of the issue, and any supporting details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent through the <Link href="/contact" className="text-brand-600 underline hover:text-brand-700">contact page</Link> or emailed to{' '}
            <a href="mailto:adnan@technodigg.com" className="text-brand-600 underline hover:text-brand-700">adnan@technodigg.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}

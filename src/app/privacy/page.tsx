import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://freeltools.com'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for FreelancerToolkit free tools, including browser-based processing, analytics, email, cookies, and advertising disclosures.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: 'Privacy Policy | FreelancerToolkit',
    description: 'How FreelancerToolkit handles privacy for free browser-based freelancer tools.',
    url: `${SITE_URL}/privacy`,
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'FreelancerToolkit privacy policy' }],
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-gray-500">Last updated: July 18, 2026</p>

      <div className="mt-8 space-y-7 text-sm leading-7 text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-900">Summary</h2>
          <p className="mt-2">
            FreelancerToolkit provides free tools that are designed to work without user accounts. Most calculator, image, PDF,
            and document-tool inputs are processed in your browser and are not stored by us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Information we collect</h2>
          <p className="mt-2">
            We may collect basic analytics data such as page views, device type, browser type, referring page, approximate
            geography, and usage patterns so we can improve the site. If you subscribe to updates, request a tool, or contact
            us, we collect the information you submit, such as your email address, message, and the page you referenced.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Tool inputs and uploaded files</h2>
          <p className="mt-2">
            Browser-based tools are intended to process data locally on your device. For example, image resizing, passport photo
            cropping, and many calculations run in your browser. AI-assisted tools may send the prompt details you enter to our
            generation endpoint so the requested text can be created.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Cookies, analytics, and advertising</h2>
          <p className="mt-2">
            We use cookies and similar technologies for analytics, basic site functionality, and admin access. We use Google
            Analytics to understand aggregate site usage. Advertising is currently paused. If advertising is enabled in the
            future, Google and other advertising partners may use cookies or similar identifiers to serve, measure, and improve
            ads, including personalized or non-personalized ads where available. You can manage Google ad personalization from
            your Google account settings and can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Email and tool requests</h2>
          <p className="mt-2">
            If you join the email list, submit a tool request, or contact us, we use your information to send updates, respond
            to the request, provide support, or improve the product. You can unsubscribe from marketing emails at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Third-party services</h2>
          <p className="mt-2">
            We may use third-party services for analytics, hosting, email delivery, generation features, and advertising. These
            providers process information according to their own privacy policies and our configuration of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Children</h2>
          <p className="mt-2">
            FreelancerToolkit is intended for freelancers, agencies, consultants, and business users. It is not directed to
            children, and we do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">Contact</h2>
          <p className="mt-2">
            Questions about privacy can be sent through the <Link href="/contact" className="text-brand-600 underline hover:text-brand-700">contact page</Link> or emailed to{' '}
            <a href="mailto:adnan@technodigg.com" className="text-brand-600 underline hover:text-brand-700">adnan@technodigg.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}

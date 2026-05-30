import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageViewTracker from '@/components/PageViewTracker'

const SITE_URL = 'https://freelancertoolkit.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FreelancerToolkit – Free Tools for Freelancers & Agencies',
    template: '%s | FreelancerToolkit',
  },
  description:
    'Free calculators and generators for freelancers, agencies, and consultants. Calculate your rate, quote projects, generate proposals, create invoices — no login required.',
  keywords: [
    'freelancer tools',
    'freelance calculator',
    'agency tools',
    'freelance rate calculator',
    'project cost calculator',
    'invoice generator',
    'proposal generator',
  ],
  authors: [{ name: 'FreelancerToolkit' }],
  creator: 'FreelancerToolkit',
  publisher: 'FreelancerToolkit',
  category: 'Business Tools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'FreelancerToolkit',
    title: 'FreelancerToolkit – Free Tools for Freelancers & Agencies',
    description:
      'Free calculators and generators for freelancers, agencies, and consultants. No login required.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@freelancertoolkit',
    creator: '@freelancertoolkit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* SVG favicon — scales perfectly at all resolutions */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="flex min-h-screen flex-col">
        <PageViewTracker />
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

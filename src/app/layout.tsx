import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageViewTracker from '@/components/PageViewTracker'
import FloatingChatbot from '@/components/FloatingChatbot'
import { ALL_TOOLS } from '@/lib/tools'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const SITE_URL = 'https://freeltools.com'
const TOTAL_TOOLS = ALL_TOOLS.length

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FreelancerToolkit',
  alternateName: 'FreelTools',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: `FreelancerToolkit (freeltools.com) provides ${TOTAL_TOOLS} free tools for freelancers, agencies, and independent consultants, including calculators, generators, passport photo makers, image tools, and PDF converters. All tools are free, require no account, and store no data.`,
  foundingDate: '2024',
  knowsAbout: [
    'Freelance rate setting',
    'Project pricing for freelancers',
    'Agency pricing strategy',
    'Invoice generation for freelancers',
    'Proposal writing for freelancers',
    'Scope of work documentation',
    'Upwork platform fees',
    'Freelance business finances',
    'Client onboarding for freelancers',
    'Retainer pricing',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'adnan@technodigg.com',
    contactType: 'customer support',
  },
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FreelancerToolkit',
  url: SITE_URL,
  description: 'Free tools for freelancers, agencies, and consultants.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/tools/{search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

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
    google: 'WVGLHOC8l_SwmyfSguGafQefhiiWiP2AQYvIo4heZTE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Preconnect to GA domains to reduce connection latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`flex min-h-screen flex-col ${inter.className}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg">
          Skip to content
        </a>
        <PageViewTracker />
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
        <FloatingChatbot />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-ZC1CQELSW4" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZC1CQELSW4');
        `}</Script>
      </body>
    </html>
  )
}

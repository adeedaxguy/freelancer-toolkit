import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug, type ToolMeta } from '@/lib/tools'

const SITE_URL = 'https://freelancertoolkit.com'

export function buildToolMetadata(tool: ToolMeta): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    authors: [{ name: 'FreelancerToolkit' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tool.headline,
      description: tool.description,
      url,
      type: 'website',
      siteName: 'FreelancerToolkit',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.headline,
      description: tool.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export function buildToolJsonLd(tool: ToolMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${SITE_URL}/tools/${tool.slug}`,
    description: tool.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      name: 'FreelancerToolkit',
      url: SITE_URL,
    },
  }
}

export function buildFaqJsonLd(tool: ToolMeta) {
  if (!tool.faqs || tool.faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function buildBreadcrumbJsonLd(tool: ToolMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category,
        item: `${SITE_URL}/#${tool.category.toLowerCase().replace(/[\s&]+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.title,
        item: `${SITE_URL}/tools/${tool.slug}`,
      },
    ],
  }
}

export function generateStaticParamsForTool(slug: string) {
  const tool = getToolBySlug(slug)
  return (tool?.programmaticVariants ?? []).map((v) => ({ variant: v.slug }))
}

export function getVariantOrNotFound(slug: string, variantSlug: string) {
  const tool = getToolBySlug(slug)
  const variant = tool?.programmaticVariants?.find((v) => v.slug === variantSlug)
  if (!tool || !variant) notFound()
  return { tool, variant }
}

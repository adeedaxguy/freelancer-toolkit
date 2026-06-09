import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug, type ToolMeta } from '@/lib/tools'

const SITE_URL = 'https://freeltools.com'

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

// How-to steps for tools that have a clear step-by-step usage pattern
const HOW_TO_STEPS: Record<string, { name: string; text: string }[]> = {
  'freelancer-rate-calculator': [
    { name: 'Enter your income goal', text: 'Type in the annual take-home income you want to earn as a freelancer.' },
    { name: 'Set your billable hours', text: 'Enter how many hours per week you realistically expect to bill to clients (most freelancers bill 15–25 hours of a 40-hour week).' },
    { name: 'Add your tax rate', text: 'Enter your estimated tax rate (self-employed freelancers in the US typically pay 25–30%).' },
    { name: 'Add monthly expenses', text: 'Enter your monthly business expenses — software, equipment, insurance, etc.' },
    { name: 'Read your minimum rate', text: 'The calculator shows your minimum hourly rate, daily rate, and monthly revenue target.' },
  ],
  'invoice-generator': [
    { name: 'Enter client details', text: 'Add your name/business name and your client\'s name and address.' },
    { name: 'Add line items', text: 'List the services or products with descriptions, quantities, and unit prices.' },
    { name: 'Set tax rate', text: 'Enter the applicable tax rate (or 0 if tax-exempt).' },
    { name: 'Export as PDF', text: 'Click "Download PDF" to save a professional invoice you can email to your client.' },
  ],
  'proposal-generator': [
    { name: 'Describe the project', text: 'Enter the project type, client name, and a brief description of the work.' },
    { name: 'Add your deliverables', text: 'List what you\'ll deliver — pages, features, campaigns, or content pieces.' },
    { name: 'Set timeline and rate', text: 'Enter the project timeline and your proposed fee.' },
    { name: 'Generate the proposal', text: 'Click Generate — AI writes a professional proposal in seconds.' },
    { name: 'Copy and send', text: 'Review the output, make any edits, then copy it into an email or document.' },
  ],
  'project-cost-calculator': [
    { name: 'Estimate project hours', text: 'Enter your best estimate of how many hours the project will take.' },
    { name: 'Enter your hourly rate', text: 'Add your hourly rate (use the Rate Calculator if you\'re not sure).' },
    { name: 'Add a scope buffer', text: 'Set a scope buffer of 15–25% to cover unexpected work and complexity.' },
    { name: 'Set revision rounds', text: 'Add the number of revision rounds included in the quote.' },
    { name: 'Read your quote', text: 'The calculator shows your base cost, total with buffer, and a recommended client price.' },
  ],
  'upwork-fee-calculator': [
    { name: 'Enter the project amount', text: 'Type in the total amount you\'ll charge the client on Upwork.' },
    { name: 'Read the fee breakdown', text: 'The calculator applies Upwork\'s sliding service fee (20% under $500, 10% from $500–$10K, 5% above $10K) and shows your net earnings.' },
  ],
}

export function buildToolJsonLd(tool: ToolMeta) {
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`
  const howToSteps = HOW_TO_STEPS[tool.slug]

  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.title,
      url: toolUrl,
      description: tool.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      browserRequirements: 'Requires JavaScript',
      featureList: tool.keywords,
      isAccessibleForFree: true,
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
    },
  ]

  if (howToSteps) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use the ${tool.title}`,
      description: tool.description,
      url: toolUrl,
      tool: [{ '@type': 'HowToTool', name: tool.title }],
      step: howToSteps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    })
  }

  return schemas
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

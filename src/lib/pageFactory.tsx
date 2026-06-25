import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryUrlForTool } from '@/lib/categoryPages'
import { getToolBySlug, type ToolMeta } from '@/lib/tools'

const SITE_URL = 'https://freeltools.com'

export function buildToolMetadata(tool: ToolMeta): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`
  const pageTitle = tool.seoTitle ?? `Free ${tool.title} (2026)`
  const ogImage = `${SITE_URL}/og-tool.svg`
  return {
    title: pageTitle,
    description: tool.description,
    keywords: tool.keywords,
    authors: [{ name: 'FreelancerToolkit' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: tool.description,
      url,
      type: 'website',
      siteName: 'FreelancerToolkit',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: tool.description,
      images: [ogImage],
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
  'freelancer-tax-calculator': [
    { name: 'Enter your gross annual income', text: 'Type in your total freelance income before taxes and expenses for the year.' },
    { name: 'Add your business expenses', text: 'Enter deductible business expenses — software, equipment, home office, professional development, etc.' },
    { name: 'Select your filing status', text: 'Choose single, married filing jointly, or head of household to get the correct federal tax brackets.' },
    { name: 'Review your tax breakdown', text: 'See your estimated self-employment tax, federal income tax, and total tax burden in one view.' },
    { name: 'Check your quarterly payments', text: 'The calculator shows how much to pay each quarter and when payments are due to avoid IRS penalties.' },
  ],
  'freelancer-savings-calculator': [
    { name: 'Enter your average monthly income', text: 'Input your typical monthly freelance earnings — use an average if income varies month to month.' },
    { name: 'Set your income variability', text: 'Choose low, medium, or high variability so the calculator can recommend the right emergency fund size for your situation.' },
    { name: 'Add your monthly expenses', text: 'Enter your total monthly living and business expenses to calculate how many months of runway you need.' },
    { name: 'See your emergency fund target', text: 'The calculator shows your recommended emergency fund size and how long it will take to build at your current savings rate.' },
    { name: 'Review retirement contribution limits', text: 'See your maximum SEP IRA and Solo 401(k) contribution for the current year based on your income.' },
  ],
  'freelance-contract-generator': [
    { name: 'Enter your name and client details', text: 'Add your full name or business name, and your client\'s name and company.' },
    { name: 'Describe the project scope', text: 'Enter what you\'ll deliver — be specific. This becomes the deliverables section of your contract.' },
    { name: 'Set payment terms', text: 'Choose your payment structure (flat fee, milestones, or hourly), total amount, and deposit percentage.' },
    { name: 'Configure revision and kill fee policy', text: 'Set how many revision rounds are included and your cancellation fee if the client ends the project early.' },
    { name: 'Generate and copy your contract', text: 'Click Generate to produce a professional contract. Copy it into a document and send to your client for signature.' },
  ],
  'client-onboarding-checklist': [
    { name: 'Select your service type', text: 'Choose your freelance category — web design, marketing, photography, consulting, etc. — to get a relevant checklist.' },
    { name: 'Choose project type', text: 'Indicate whether this is a one-off project, ongoing retainer, or long-term engagement to customize the checklist phases.' },
    { name: 'Review your checklist', text: 'The generator produces a phased checklist: pre-kickoff, contract and deposit, access gathering, kickoff call, and project setup.' },
    { name: 'Check off items as you go', text: 'Use the interactive checklist to track your onboarding progress. Each item can be checked off as you complete it.' },
    { name: 'Copy or print the checklist', text: 'Export the checklist as plain text, copy to Notion, or print it for reference during your client kickoff call.' },
  ],
  'project-deadline-calculator': [
    { name: 'Enter estimated project hours', text: 'Input your total estimated hours for the project — use your best estimate based on scope.' },
    { name: 'Set your daily availability', text: 'Enter how many hours per day you\'ll work on this specific project (accounting for other clients and admin time).' },
    { name: 'Add revision rounds and feedback windows', text: 'Set the number of revision rounds included and how many days you expect the client to take to review each one.' },
    { name: 'Add buffer days', text: 'Add a 10–20% buffer to absorb unexpected complexity or delays. This protects your deadline commitment.' },
    { name: 'Get your completion date', text: 'The calculator shows your projected finish date and total calendar days — ready to include in your proposal or contract.' },
  ],
  'pdf-to-jpg-converter': [
    { name: 'Upload your PDF', text: 'Click "Choose PDF" or drag and drop your PDF file onto the upload area.' },
    { name: 'Wait for conversion', text: 'Each page is rendered to a canvas in your browser. Larger PDFs take a few seconds per page.' },
    { name: 'Preview your pages', text: 'Thumbnail previews of every page appear once processing is complete.' },
    { name: 'Download images', text: 'Click individual page thumbnails to download them, or use Download All to get every page as a ZIP.' },
  ],
  'image-compressor': [
    { name: 'Upload your image', text: 'Click "Choose Image" or drag and drop a JPG, PNG, or WebP file.' },
    { name: 'Set quality and size', text: 'Adjust the quality slider (80% is a good default) and optionally set a maximum width to resize.' },
    { name: 'Preview the result', text: 'A side-by-side comparison shows the original and compressed versions with file sizes.' },
    { name: 'Download compressed image', text: 'Click Download to save the compressed file to your device.' },
  ],
  'word-count-tool': [
    { name: 'Paste your text', text: 'Paste or type any text into the input area.' },
    { name: 'Review instant stats', text: 'Word count, character count, sentence count, and paragraph count update in real time as you type.' },
    { name: 'Check readability', text: 'The Flesch Reading Ease score tells you how easy your content is to read — useful for client-facing copy.' },
    { name: 'Check reading time', text: 'See how long it takes an average reader to finish your content — useful for estimating blog post or script length.' },
  ],
  'pomodoro-timer': [
    { name: 'Set your work interval', text: 'The default is 25 minutes. Adjust to 50 minutes for longer focus sessions.' },
    { name: 'Click Start', text: 'The timer counts down. Stay focused on one task until the timer rings.' },
    { name: 'Take your break', text: 'When the work session ends, the timer automatically switches to a 5-minute break.' },
    { name: 'Track your sessions', text: 'Each completed pomodoro is logged. After 4 sessions, take a longer 15-minute break.' },
  ],
  'fiverr-fee-calculator': [
    { name: 'Enter your Fiverr gig price', text: 'Type the listed gig price, custom offer amount, or milestone value before buyer service fees.' },
    { name: 'Add any tip amount', text: 'If the buyer is tipping, enter the tip separately so the calculator can estimate the seller fee on the full order.' },
    { name: 'Review seller net earnings', text: 'The calculator shows the estimated Fiverr seller fee and the amount you keep before taxes, withdrawal fees, and currency conversion.' },
    { name: 'Check buyer checkout total', text: 'Review the estimated buyer service fee, small-order fee, and buyer total so you understand the price the client sees.' },
    { name: 'Use reverse pricing', text: 'Enter a target take-home amount to calculate the Fiverr gig price needed to net that amount after seller fees.' },
    { name: 'Adjust fee assumptions if needed', text: 'Change the seller fee percentage, buyer service fee, small-order threshold, or small-order fee if Fiverr shows a different number in your account.' },
  ],
  'late-payment-fee-calculator': [
    { name: 'Enter the original invoice amount', text: 'Type the invoice total that the client has not yet paid.' },
    { name: 'Enter days overdue', text: 'Count the number of days since the invoice due date and enter it here.' },
    { name: 'Set your annual late fee rate', text: 'Enter the rate specified in your contract (1.5%/month = 18%/year is the most common standard).' },
    { name: 'Get the total amount owed', text: 'The calculator shows the late fee amount and new total the client owes.' },
    { name: 'Copy the notice template', text: 'Use the pre-written late payment notice template to send a professional follow-up email.' },
  ],
  'rate-increase-calculator': [
    { name: 'Enter your current hourly rate', text: 'Type your current freelance hourly rate.' },
    { name: 'Set your planned increase percentage', text: 'Enter how much you want to raise your rate (10–25% is typical for annual increases).' },
    { name: 'Add your billable hours', text: 'Enter your average billable hours per week and billable weeks per year.' },
    { name: 'See the revenue impact', text: 'The calculator shows your new rate, extra monthly revenue, and additional annual income.' },
    { name: 'Compare increase scenarios', text: 'The table shows how different increase percentages (10%, 15%, 20%, 25%, 30%) affect your earnings.' },
    { name: 'Send the client notice', text: 'Use the built-in email template to notify existing clients of your rate increase professionally.' },
  ],
  'working-days-calculator': [
    { name: 'Choose your mode', text: 'Select "Days Between Two Dates" to count business days in a range, or "Add Working Days" to calculate a deadline.' },
    { name: 'Enter your start date', text: 'Pick the start date (e.g., today or the date you receive a project brief).' },
    { name: 'Enter end date or days to add', text: 'Either enter the end date of the range, or the number of business days you want to add.' },
    { name: 'Toggle holiday exclusion', text: 'Check or uncheck the US public holidays option depending on your situation.' },
    { name: 'Read your result', text: 'See the exact number of working days (for ranges) or the exact deadline date (for day addition).' },
  ],
  'time-zone-converter': [
    { name: 'Select your time zone', text: 'Choose your local time zone from the dropdown.' },
    { name: 'Select client time zone', text: 'Choose the time zone where your client or team member is located.' },
    { name: 'Enter a time', text: 'Pick a time in your zone to see what it is in the client\'s zone.' },
    { name: 'Find overlap hours', text: 'The overlap panel highlights hours that fall within business hours (9am–6pm) for both parties.' },
  ],
  'upwork-fee-calculator': [
    { name: 'Enter the project amount', text: 'Type in the total amount you\'ll charge the client on Upwork.' },
    { name: 'Enter the service fee shown by Upwork', text: 'Use the freelancer service fee percentage shown when you submit a proposal or receive an offer. Upwork says this can vary by contract from 0% to 15%.' },
    { name: 'Read the fee breakdown', text: 'The calculator shows the estimated Upwork fee, your net earnings, and the gross quote needed to hit a target take-home amount.' },
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
        item: `${SITE_URL}${getCategoryUrlForTool(tool)}`,
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

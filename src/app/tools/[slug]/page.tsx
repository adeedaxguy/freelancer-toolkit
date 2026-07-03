import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPageShell from '@/components/ToolPageShell'
import AdvancedToolRenderer from '@/components/calculators/AdvancedToolRenderer'
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator'
import FiverrFeeCalculator from '@/components/calculators/FiverrFeeCalculator'
import LatePaymentCalculator from '@/components/calculators/LatePaymentCalculator'
import { ALL_TOOLS, getToolBySlug } from '@/lib/tools'
import { buildFaqJsonLd, buildToolJsonLd, buildToolMetadata } from '@/lib/pageFactory'

type PageProps = {
  params: { slug: string }
}

const sharedCalculatorRenderers = {
  'project-price-calculator': ProjectCostCalculator,
  'freelance-services-pricing-calculator': ProjectCostCalculator,
  'freelance-pricing-calculator': ProjectCostCalculator,
  'fiverr-seller-fee-calculator': FiverrFeeCalculator,
  'fiverr-buyer-fee-calculator': FiverrFeeCalculator,
  'fiverr-commission-calculator': FiverrFeeCalculator,
  'late-charge-calculator': LatePaymentCalculator,
  'invoice-late-fee-calculator': LatePaymentCalculator,
}

function getSharedCalculator(slug: string) {
  return sharedCalculatorRenderers[slug as keyof typeof sharedCalculatorRenderers]
}

export function generateStaticParams() {
  return ALL_TOOLS
    .filter((tool) => tool.advancedTool || getSharedCalculator(tool.slug))
    .map((tool) => ({ slug: tool.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getToolBySlug(params.slug)
  if (!tool || (!tool.advancedTool && !getSharedCalculator(tool.slug))) return {}
  return buildToolMetadata(tool)
}

export default function Page({ params }: PageProps) {
  const tool = getToolBySlug(params.slug)
  if (!tool) notFound()
  const SharedCalculator = getSharedCalculator(tool.slug)
  if (!tool.advancedTool && !SharedCalculator) notFound()

  const jsonLd = buildToolJsonLd(tool)
  const faqJsonLd = buildFaqJsonLd(tool)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolPageShell tool={tool}>
        {tool.advancedTool ? (
          <AdvancedToolRenderer config={tool.advancedTool} />
        ) : SharedCalculator ? (
          <SharedCalculator />
        ) : null}
      </ToolPageShell>
    </>
  )
}

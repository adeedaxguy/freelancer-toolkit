import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPageShell from '@/components/ToolPageShell'
import AdvancedToolRenderer from '@/components/calculators/AdvancedToolRenderer'
import ProjectCostCalculator from '@/components/calculators/ProjectCostCalculator'
import InsuranceAndEventCalculator from '@/components/calculators/InsuranceAndEventCalculator'
import SeoToolsCalculator from '@/components/calculators/SeoToolsCalculator'
import { ALL_TOOLS, getToolBySlug } from '@/lib/tools'
import { buildFaqJsonLd, buildToolJsonLd, buildToolMetadata } from '@/lib/pageFactory'

type PageProps = {
  params: { slug: string; variant: string }
}

const sharedCalculatorRenderers = {
  'project-price-calculator': ProjectCostCalculator,
  'freelance-services-pricing-calculator': ProjectCostCalculator,
  'freelance-pricing-calculator': ProjectCostCalculator,
  'gap-insurance-refund-calculator': InsuranceAndEventCalculator,
  'home-replacement-cost-calculator': InsuranceAndEventCalculator,
  'dwelling-coverage-calculator': InsuranceAndEventCalculator,
  'actual-cash-value-calculator': InsuranceAndEventCalculator,
  'coinsurance-penalty-calculator': InsuranceAndEventCalculator,
  'world-cup-match-time-converter': InsuranceAndEventCalculator,
  'on-page-seo-audit-tool': SeoToolsCalculator,
  'serp-snippet-preview-tool': SeoToolsCalculator,
  'meta-tag-generator': SeoToolsCalculator,
  'schema-markup-generator': SeoToolsCalculator,
  'robots-txt-generator': SeoToolsCalculator,
  'xml-sitemap-generator': SeoToolsCalculator,
  'hreflang-tag-generator': SeoToolsCalculator,
  'keyword-density-checker': SeoToolsCalculator,
}

function getSharedCalculator(slug: string) {
  return sharedCalculatorRenderers[slug as keyof typeof sharedCalculatorRenderers]
}

export function generateStaticParams() {
  return ALL_TOOLS.filter((tool) => tool.advancedTool || getSharedCalculator(tool.slug)).flatMap((tool) =>
    (tool.programmaticVariants ?? []).map((variant) => ({ slug: tool.slug, variant: variant.slug }))
  )
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getToolBySlug(params.slug)
  if (!tool || (!tool.advancedTool && !getSharedCalculator(tool.slug))) return {}
  const variant = tool.programmaticVariants?.find((item) => item.slug === params.variant)
  if (!variant) return {}
  const base = buildToolMetadata(tool)
  return {
    ...base,
    title: `${tool.title} ${variant.label} | Free Online Tool`,
    description: `${tool.description} Optimized ${variant.label.toLowerCase()}.`,
  }
}

export default function Page({ params }: PageProps) {
  const tool = getToolBySlug(params.slug)
  if (!tool) notFound()
  const SharedCalculator = getSharedCalculator(tool.slug)
  if (!tool.advancedTool && !SharedCalculator) notFound()
  const variant = tool.programmaticVariants?.find((item) => item.slug === params.variant)
  if (!variant) notFound()

  const jsonLd = buildToolJsonLd(tool)
  const faqJsonLd = buildFaqJsonLd(tool)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolPageShell tool={tool} variantLabel={variant.label}>
        {tool.advancedTool ? (
          <AdvancedToolRenderer config={tool.advancedTool} />
        ) : SharedCalculator ? (
          <SharedCalculator />
        ) : null}
      </ToolPageShell>
    </>
  )
}

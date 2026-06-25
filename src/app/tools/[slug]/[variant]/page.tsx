import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPageShell from '@/components/ToolPageShell'
import AdvancedToolRenderer from '@/components/calculators/AdvancedToolRenderer'
import { ALL_TOOLS, getToolBySlug } from '@/lib/tools'
import { buildFaqJsonLd, buildToolJsonLd, buildToolMetadata } from '@/lib/pageFactory'

type PageProps = {
  params: { slug: string; variant: string }
}

export function generateStaticParams() {
  return ALL_TOOLS.filter((tool) => tool.advancedTool).flatMap((tool) =>
    (tool.programmaticVariants ?? []).map((variant) => ({ slug: tool.slug, variant: variant.slug }))
  )
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getToolBySlug(params.slug)
  if (!tool || !tool.advancedTool) return {}
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
  if (!tool || !tool.advancedTool) notFound()
  const variant = tool.programmaticVariants?.find((item) => item.slug === params.variant)
  if (!variant) notFound()

  const jsonLd = buildToolJsonLd(tool)
  const faqJsonLd = buildFaqJsonLd(tool)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolPageShell tool={tool} variantLabel={variant.label}>
        <AdvancedToolRenderer config={tool.advancedTool} />
      </ToolPageShell>
    </>
  )
}

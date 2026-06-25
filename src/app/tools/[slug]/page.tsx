import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPageShell from '@/components/ToolPageShell'
import AdvancedToolRenderer from '@/components/calculators/AdvancedToolRenderer'
import { ALL_TOOLS, getToolBySlug } from '@/lib/tools'
import { buildFaqJsonLd, buildToolJsonLd, buildToolMetadata } from '@/lib/pageFactory'

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return ALL_TOOLS.filter((tool) => tool.advancedTool).map((tool) => ({ slug: tool.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getToolBySlug(params.slug)
  if (!tool || !tool.advancedTool) return {}
  return buildToolMetadata(tool)
}

export default function Page({ params }: PageProps) {
  const tool = getToolBySlug(params.slug)
  if (!tool || !tool.advancedTool) notFound()

  const jsonLd = buildToolJsonLd(tool)
  const faqJsonLd = buildFaqJsonLd(tool)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolPageShell tool={tool}>
        <AdvancedToolRenderer config={tool.advancedTool} />
      </ToolPageShell>
    </>
  )
}

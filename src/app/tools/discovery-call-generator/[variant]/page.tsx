import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import DiscoveryCallGenerator from '@/components/calculators/DiscoveryCallGenerator'

const tool = getToolBySlug('discovery-call-generator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('discovery-call-generator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `${tool.title} ${variant.label}`,
    description: `${tool.description} Optimized ${variant.label.toLowerCase()}.`,
    alternates: { canonical: `/tools/discovery-call-generator/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <DiscoveryCallGenerator />
    </ToolPageShell>
  )
}

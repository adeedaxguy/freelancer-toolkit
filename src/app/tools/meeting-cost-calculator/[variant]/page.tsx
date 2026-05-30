import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import MeetingCostCalculator from '@/components/calculators/MeetingCostCalculator'

const tool = getToolBySlug('meeting-cost-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('meeting-cost-calculator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `${tool.title} ${variant.label}`,
    description: `${tool.description} Optimized ${variant.label.toLowerCase()}.`,
    alternates: { canonical: `/tools/meeting-cost-calculator/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <MeetingCostCalculator />
    </ToolPageShell>
  )
}

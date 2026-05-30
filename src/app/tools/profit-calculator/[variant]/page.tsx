import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import ProfitCalculator from '@/components/calculators/ProfitCalculator'

const tool = getToolBySlug('profit-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('profit-calculator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `${tool.title} ${variant.label}`,
    description: `${tool.description} Optimized ${variant.label.toLowerCase()}.`,
    alternates: { canonical: `/tools/profit-calculator/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <ProfitCalculator />
    </ToolPageShell>
  )
}

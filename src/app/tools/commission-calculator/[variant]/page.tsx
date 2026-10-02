import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { compactSeoDescription, compactSeoTitle, generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import SalesCommissionCalculator from '@/components/calculators/SalesCommissionCalculator'

const tool = getToolBySlug('commission-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('commission-calculator')
}

export async function generateMetadata(props: { params: Promise<{ variant: string }> }): Promise<Metadata> {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: { absolute: compactSeoTitle(`${tool.title} ${variant.label}`) },
    description: compactSeoDescription(`${tool.description} Optimized ${variant.label.toLowerCase()}.`),
    alternates: { canonical: `/tools/commission-calculator/${params.variant}` },
  }
}

export default async function Page(props: { params: Promise<{ variant: string }> }) {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <SalesCommissionCalculator />
    </ToolPageShell>
  )
}

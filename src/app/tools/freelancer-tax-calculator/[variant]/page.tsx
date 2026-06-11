import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import FreelancerTaxCalculator from '@/components/calculators/FreelancerTaxCalculator'

const tool = getToolBySlug('freelancer-tax-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('freelancer-tax-calculator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `${tool.title} ${variant.label}`,
    description: `Estimate your freelance self-employment tax, federal income tax, and quarterly payments ${variant.label.toLowerCase()}. Free calculator — no signup required.`,
    keywords: [`freelancer tax calculator ${variant.label.toLowerCase()}`, 'self employed tax calculator', ...tool.keywords],
    alternates: { canonical: `/tools/freelancer-tax-calculator/${params.variant}` },
    openGraph: {
      title: `Freelancer Tax Calculator ${variant.label}`,
      description: `Calculate your taxes and quarterly payments ${variant.label.toLowerCase()}.`,
    },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <FreelancerTaxCalculator />
    </ToolPageShell>
  )
}

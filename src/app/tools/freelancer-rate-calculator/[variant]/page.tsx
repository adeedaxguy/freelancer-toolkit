import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { compactSeoDescription, compactSeoTitle, generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import FreelancerRateCalculator from '@/components/calculators/FreelancerRateCalculator'

const tool = getToolBySlug('freelancer-rate-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('freelancer-rate-calculator')
}

export async function generateMetadata(props: { params: Promise<{ variant: string }> }): Promise<Metadata> {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: { absolute: compactSeoTitle(`${tool.title} ${variant.label}`) },
    description: compactSeoDescription(`Calculate your minimum freelance hourly rate ${variant.label.toLowerCase()}. Free tool — enter your income goals, tax rate, and expenses to find your rate instantly.`),
    keywords: [`freelancer rate calculator ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/freelancer-rate-calculator/${params.variant}` },
    openGraph: {
      title: `Freelancer Rate Calculator ${variant.label}`,
      description: `Find your minimum hourly rate ${variant.label.toLowerCase()}.`,
    },
  }
}

export default async function Page(props: { params: Promise<{ variant: string }> }) {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <FreelancerRateCalculator />
    </ToolPageShell>
  )
}

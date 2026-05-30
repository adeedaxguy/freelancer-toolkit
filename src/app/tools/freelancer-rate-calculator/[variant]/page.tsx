import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import FreelancerRateCalculator from '@/components/calculators/FreelancerRateCalculator'

const tool = getToolBySlug('freelancer-rate-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('freelancer-rate-calculator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `${tool.title} ${variant.label}`,
    description: `Calculate your minimum freelance hourly rate ${variant.label.toLowerCase()}. Free tool — enter your income goals, tax rate, and expenses to find your rate instantly.`,
    keywords: [`freelancer rate calculator ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/freelancer-rate-calculator/${params.variant}` },
    openGraph: {
      title: `Freelancer Rate Calculator ${variant.label}`,
      description: `Find your minimum hourly rate ${variant.label.toLowerCase()}.`,
    },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <FreelancerRateCalculator />
    </ToolPageShell>
  )
}

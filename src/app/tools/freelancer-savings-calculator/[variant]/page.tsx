import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import FreelancerSavingsCalculator from '@/components/calculators/FreelancerSavingsCalculator'

const tool = getToolBySlug('freelancer-savings-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('freelancer-savings-calculator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `${tool.title} — ${variant.label}`,
    description: `Calculate your emergency fund target and retirement savings ${variant.label.toLowerCase()}. Free freelancer savings calculator — SEP IRA limits, Solo 401(k) contributions, and monthly savings plan.`,
    keywords: [`freelancer savings calculator ${variant.label.toLowerCase()}`, 'self employed retirement calculator', ...tool.keywords],
    alternates: { canonical: `/tools/freelancer-savings-calculator/${params.variant}` },
    openGraph: {
      title: `Freelancer Savings Calculator — ${variant.label}`,
      description: `Emergency fund and retirement planning ${variant.label.toLowerCase()}.`,
    },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <FreelancerSavingsCalculator />
    </ToolPageShell>
  )
}

import type { Metadata } from 'next'
import { getToolBySlug } from '@/lib/tools'
import { buildToolMetadata, buildToolJsonLd, buildFaqJsonLd } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import FreelancerSavingsCalculator from '@/components/calculators/FreelancerSavingsCalculator'

const tool = getToolBySlug('freelancer-savings-calculator')!

export const metadata: Metadata = buildToolMetadata(tool)

export default function Page() {
  const jsonLd = buildToolJsonLd(tool)
  const faqJsonLd = buildFaqJsonLd(tool)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolPageShell tool={tool}>
        <FreelancerSavingsCalculator />
      </ToolPageShell>
    </>
  )
}

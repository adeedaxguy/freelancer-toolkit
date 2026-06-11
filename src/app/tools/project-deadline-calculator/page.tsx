import type { Metadata } from 'next'
import { getToolBySlug } from '@/lib/tools'
import { buildToolMetadata, buildToolJsonLd, buildFaqJsonLd } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import ProjectDeadlineCalculator from '@/components/calculators/ProjectDeadlineCalculator'

const tool = getToolBySlug('project-deadline-calculator')!

export const metadata: Metadata = buildToolMetadata(tool)

export default function Page() {
  const jsonLd = buildToolJsonLd(tool)
  const faqJsonLd = buildFaqJsonLd(tool)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolPageShell tool={tool}>
        <ProjectDeadlineCalculator />
      </ToolPageShell>
    </>
  )
}

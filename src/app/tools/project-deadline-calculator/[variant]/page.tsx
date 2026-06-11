import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import ProjectDeadlineCalculator from '@/components/calculators/ProjectDeadlineCalculator'

const tool = getToolBySlug('project-deadline-calculator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('project-deadline-calculator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Project Deadline Calculator ${variant.label}`,
    description: `Calculate your freelance project deadline ${variant.label.toLowerCase()}. Enter hours, daily availability, revision rounds, and buffer to get an accurate completion date.`,
    keywords: [`project deadline calculator ${variant.label.toLowerCase()}`, 'freelance timeline calculator', ...tool.keywords],
    alternates: { canonical: `/tools/project-deadline-calculator/${params.variant}` },
    openGraph: {
      title: `Project Deadline Calculator ${variant.label}`,
      description: `Get an accurate project completion date ${variant.label.toLowerCase()}.`,
    },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <ProjectDeadlineCalculator />
    </ToolPageShell>
  )
}

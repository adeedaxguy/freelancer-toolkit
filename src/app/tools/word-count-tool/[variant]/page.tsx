import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import WordCountTool from '@/components/calculators/WordCountTool'

const tool = getToolBySlug('word-count-tool')!

export function generateStaticParams() {
  return generateStaticParamsForTool('word-count-tool')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Word Count Tool — ${variant.label}`,
    description: `Free word counter and readability checker ${variant.label.toLowerCase()}. Instant word count, character count, reading time, and Flesch readability score.`,
    keywords: [`word count tool ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/word-count-tool/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <WordCountTool />
    </ToolPageShell>
  )
}

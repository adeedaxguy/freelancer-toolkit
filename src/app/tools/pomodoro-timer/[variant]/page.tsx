import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import PomodoroTimer from '@/components/calculators/PomodoroTimer'

const tool = getToolBySlug('pomodoro-timer')!

export function generateStaticParams() {
  return generateStaticParamsForTool('pomodoro-timer')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Pomodoro Timer — ${variant.label}`,
    description: `Free Pomodoro timer ${variant.label.toLowerCase()}. Track focus sessions, breaks, and daily productivity. Works offline in your browser.`,
    keywords: [`pomodoro timer ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/pomodoro-timer/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <PomodoroTimer />
    </ToolPageShell>
  )
}

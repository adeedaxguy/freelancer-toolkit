import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import TimeZoneConverter from '@/components/calculators/TimeZoneConverter'

const tool = getToolBySlug('time-zone-converter')!

export function generateStaticParams() {
  return generateStaticParamsForTool('time-zone-converter')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Time Zone Converter — ${variant.label}`,
    description: `Free time zone converter ${variant.label.toLowerCase()}. Find overlapping business hours and schedule meetings across time zones without confusion.`,
    keywords: [`time zone converter ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/time-zone-converter/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <TimeZoneConverter />
    </ToolPageShell>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import ClientOnboardingChecklist from '@/components/calculators/ClientOnboardingChecklist'

const tool = getToolBySlug('client-onboarding-checklist')!

export function generateStaticParams() {
  return generateStaticParamsForTool('client-onboarding-checklist')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Client Onboarding Checklist ${variant.label}`,
    description: `Free client onboarding checklist ${variant.label.toLowerCase()}. Generate a customized, printable checklist that ensures every new client engagement starts without a hitch.`,
    keywords: [`client onboarding checklist ${variant.label.toLowerCase()}`, 'client onboarding template', ...tool.keywords],
    alternates: { canonical: `/tools/client-onboarding-checklist/${params.variant}` },
    openGraph: {
      title: `Client Onboarding Checklist ${variant.label}`,
      description: `Generate a customized onboarding checklist ${variant.label.toLowerCase()}.`,
    },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <ClientOnboardingChecklist />
    </ToolPageShell>
  )
}

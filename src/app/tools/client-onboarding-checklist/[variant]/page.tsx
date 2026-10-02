import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { compactSeoDescription, compactSeoTitle, generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import ClientOnboardingChecklist from '@/components/calculators/ClientOnboardingChecklist'

const tool = getToolBySlug('client-onboarding-checklist')!

export function generateStaticParams() {
  return generateStaticParamsForTool('client-onboarding-checklist')
}

export async function generateMetadata(props: { params: Promise<{ variant: string }> }): Promise<Metadata> {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: { absolute: compactSeoTitle(`Client Onboarding Checklist ${variant.label}`) },
    description: compactSeoDescription(`Free client onboarding checklist ${variant.label.toLowerCase()}. Generate a customized, printable checklist that ensures every new client engagement starts without a hitch.`),
    keywords: [`client onboarding checklist ${variant.label.toLowerCase()}`, 'client onboarding template', ...tool.keywords],
    alternates: { canonical: `/tools/client-onboarding-checklist/${params.variant}` },
    openGraph: {
      title: `Client Onboarding Checklist ${variant.label}`,
      description: `Generate a customized onboarding checklist ${variant.label.toLowerCase()}.`,
    },
  }
}

export default async function Page(props: { params: Promise<{ variant: string }> }) {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <ClientOnboardingChecklist />
    </ToolPageShell>
  )
}

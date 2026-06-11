import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import FreelanceContractGenerator from '@/components/calculators/FreelanceContractGenerator'

const tool = getToolBySlug('freelance-contract-generator')!

export function generateStaticParams() {
  return generateStaticParamsForTool('freelance-contract-generator')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Freelance Contract Generator ${variant.label}`,
    description: `Generate a free, professional freelance contract ${variant.label.toLowerCase()}. Customize scope, payment terms, revision policy, and IP ownership — download-ready in minutes.`,
    keywords: [`freelance contract generator ${variant.label.toLowerCase()}`, 'freelance contract template', ...tool.keywords],
    alternates: { canonical: `/tools/freelance-contract-generator/${params.variant}` },
    openGraph: {
      title: `Freelance Contract Generator ${variant.label}`,
      description: `Create a professional contract ${variant.label.toLowerCase()} — free, no signup.`,
    },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <FreelanceContractGenerator />
    </ToolPageShell>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { compactSeoDescription, compactSeoTitle, generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import PdfToJpgConverter from '@/components/calculators/PdfToJpgConverter'

const tool = getToolBySlug('pdf-to-jpg-converter')!

export function generateStaticParams() {
  return generateStaticParamsForTool('pdf-to-jpg-converter')
}

export async function generateMetadata(props: { params: Promise<{ variant: string }> }): Promise<Metadata> {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: { absolute: compactSeoTitle(`PDF to JPG Converter — ${variant.label}`) },
    description: compactSeoDescription(`Free PDF to JPG converter ${variant.label.toLowerCase()}. Convert every PDF page to a high-quality image instantly in your browser. No upload, no watermark.`),
    keywords: [`pdf to jpg converter ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/pdf-to-jpg-converter/${params.variant}` },
  }
}

export default async function Page(props: { params: Promise<{ variant: string }> }) {
  const params = await props.params;
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <PdfToJpgConverter />
    </ToolPageShell>
  )
}

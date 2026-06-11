import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { generateStaticParamsForTool } from '@/lib/pageFactory'
import ToolPageShell from '@/components/ToolPageShell'
import ImageCompressor from '@/components/calculators/ImageCompressor'

const tool = getToolBySlug('image-compressor')!

export function generateStaticParams() {
  return generateStaticParamsForTool('image-compressor')
}

export async function generateMetadata({ params }: { params: { variant: string } }): Promise<Metadata> {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) return {}
  return {
    title: `Image Compressor — ${variant.label}`,
    description: `Free online image compressor ${variant.label.toLowerCase()}. Reduce file size without losing quality. Runs in your browser — no upload needed.`,
    keywords: [`image compressor ${variant.label.toLowerCase()}`, ...tool.keywords],
    alternates: { canonical: `/tools/image-compressor/${params.variant}` },
  }
}

export default function Page({ params }: { params: { variant: string } }) {
  const variant = tool.programmaticVariants?.find((v) => v.slug === params.variant)
  if (!variant) notFound()
  return (
    <ToolPageShell tool={tool} variantLabel={variant.label}>
      <ImageCompressor />
    </ToolPageShell>
  )
}

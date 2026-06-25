import Link from 'next/link'
import type { ToolMeta } from '@/lib/tools'
import { getRelatedTools } from '@/lib/tools'
import { getCategoryUrlForTool } from '@/lib/categoryPages'
import { buildBreadcrumbJsonLd } from '@/lib/pageFactory'
import ToolSeoContent from '@/components/ToolSeoContent'
import ToolSubscribePopup from '@/components/ToolSubscribePopup'

interface ToolPageShellProps {
  tool: ToolMeta
  children: React.ReactNode
  variantLabel?: string
}

export default function ToolPageShell({ tool, children, variantLabel }: ToolPageShellProps) {
  const related = getRelatedTools(tool.slug)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(tool)
  const categoryUrl = getCategoryUrlForTool(tool)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href={categoryUrl} className="hover:text-brand-600">
          {tool.category}
        </Link>
        <span>/</span>
        {variantLabel ? (
          <>
            <Link href={`/tools/${tool.slug}`} className="hover:text-brand-600">{tool.title}</Link>
            <span>/</span>
            <span className="text-gray-600 break-all">{variantLabel}</span>
          </>
        ) : (
          <span className="text-gray-600">{tool.title}</span>
        )}
      </nav>

      {/* Hero */}
      <div className="mb-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-3xl" role="img" aria-label={tool.title}>{tool.icon}</span>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">Free Tool</span>
          <Link href={categoryUrl} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 transition hover:bg-brand-50 hover:text-brand-700">
            {tool.category}
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          {variantLabel ? `${tool.title} ${variantLabel}` : tool.headline}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">{tool.description}</p>
      </div>

      {/* Tool */}
      <div className="min-w-0">{children}</div>

      {/* Programmatic variant links */}
      {!variantLabel && tool.programmaticVariants && tool.programmaticVariants.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-base font-semibold text-gray-900">More Variations</h2>
          <div className="flex flex-wrap gap-2">
            {tool.programmaticVariants.map((v) => (
              <Link
                key={v.slug}
                href={`/tools/${tool.slug}/${v.slug}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:text-brand-600 sm:text-sm"
              >
                {tool.title} {v.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search-focused supporting copy */}
      {tool.bodySections && tool.bodySections.length > 0 && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {tool.bodySections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">{section.heading}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{section.body}</p>
            </section>
          ))}
        </div>
      )}

      <ToolSeoContent tool={tool} variantLabel={variantLabel} />

      {/* FAQ */}
      {tool.faqs && tool.faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {tool.faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-semibold text-gray-900">
                  <span>{faq.q}</span>
                  <span className="mt-0.5 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Subscribe popup — appears after 10s, suppressed by localStorage */}
      <ToolSubscribePopup slug={tool.slug} />

      {/* Related tools */}
      {related.length > 0 && (
        <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Related Tools</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="flex items-center gap-2 rounded-lg border border-gray-100 p-3 text-sm text-gray-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <span className="text-base">{t.icon}</span>
                <span className="line-clamp-1">{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

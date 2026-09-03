import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolCard from '@/components/ToolCard'
import { getAllPosts } from '@/lib/blog'
import { getCategoryBySlug, getCategoryKeywords, getCategorySeoDescription, getCategorySeoTitle, getCategoryUrl } from '@/lib/categoryPages'
import { TOOL_CATEGORIES } from '@/lib/tools'

const SITE_URL = 'https://freeltools.com'

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return TOOL_CATEGORIES.map((category) => ({ slug: category.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategoryBySlug(params.slug)
  if (!category) return {}
  const title = getCategorySeoTitle(category)
  const description = getCategorySeoDescription(category)
  const url = `${SITE_URL}${getCategoryUrl(category)}`

  return {
    title,
    description,
    keywords: getCategoryKeywords(category),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'FreelancerToolkit',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.slug)
  if (!category) notFound()

  const categoryUrl = `${SITE_URL}${getCategoryUrl(category)}`
  const keywords = getCategoryKeywords(category)
  const relatedPosts = getAllPosts()
    .filter((post) =>
      post.tags.some((tag) => keywords.some((keyword) => keyword.includes(tag.toLowerCase()) || tag.toLowerCase().includes(keyword.split(' ')[0])))
    )
    .slice(0, 3)
  const featuredSlugs = category.slug === 'seo-tools'
    ? ['on-page-seo-checker', 'on-page-seo-audit-tool', 'keyword-density-checker', 'keyword-prominence-checker', 'seo-readability-checker']
    : category.tools.slice(0, 5).map((tool) => tool.slug)
  const featuredTools = featuredSlugs
    .map((slug) => category.tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof category.tools)[number] => Boolean(tool))

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: getCategorySeoTitle(category),
    description: getCategorySeoDescription(category),
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: category.tools.length,
      itemListElement: category.tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: `${SITE_URL}/tools/${tool.slug}`,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/#tools` },
      { '@type': 'ListItem', position: 3, name: category.name, item: categoryUrl },
    ],
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/#tools" className="hover:text-brand-600">Tools</Link>
        <span>/</span>
        <span className="text-gray-600">{category.name}</span>
      </nav>

      <section className="grid gap-8 border-b border-gray-100 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">{category.tools.length} free tools</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            {getCategorySeoDescription(category)}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {keywords.slice(0, 6).map((keyword) => (
              <span key={keyword} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900">Start with these</h2>
          <div className="mt-4 grid gap-2">
            {featuredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm font-medium text-gray-700 shadow-sm transition hover:text-brand-700"
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="min-w-0 flex-1 truncate">{tool.title}</span>
                <span className="text-xs text-brand-600">Use tool</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {category.slug === 'seo-tools' && (
        <section className="border-b border-gray-100 py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">On-page SEO workflow</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Check the whole page, then fix the exact warning</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Start with the broad checker, use focused tools for content placement and clarity, then rerun the audit before publishing or requesting indexing.
            </p>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { step: '1', title: 'Check the page', body: 'Fetch a live URL or paste HTML to find the highest-priority on-page gaps.', href: '/tools/on-page-seo-checker', label: 'On-Page SEO Checker' },
              { step: '2', title: 'Check coverage', body: 'Review exact use, related terms, questions, and repeated phrases without chasing a magic density.', href: '/tools/keyword-density-checker', label: 'Keyword Density Checker' },
              { step: '3', title: 'Fix placement and clarity', body: 'Confirm important keyword locations, then shorten long sentences and dense paragraphs.', href: '/tools/keyword-prominence-checker', label: 'Keyword Prominence Checker' },
              { step: '4', title: 'Rerun the audit', body: 'Export the final fix brief and confirm the live page is ready for its next crawl.', href: '/tools/on-page-seo-audit-tool', label: 'On-Page SEO Audit Tool' },
            ].map((item) => (
              <li key={item.step} className="border-l-2 border-brand-200 pl-4">
                <p className="text-xs font-bold text-brand-700">Step {item.step}</p>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-600">{item.body}</p>
                <Link href={item.href} className="mt-3 inline-block text-xs font-semibold text-brand-700 hover:underline">{item.label}</Link>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-5 text-gray-500">
            For sentence-level editing, use the <Link href="/tools/seo-readability-checker" className="font-semibold text-brand-700 hover:underline">SEO Readability Checker</Link> between steps 3 and 4.
          </p>
        </section>
      )}

      <section className="py-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All {category.name} tools</h2>
            <p className="mt-1 text-sm text-gray-500">Every tool in this category is free, browser-based, and built to move the user from search intent to action.</p>
          </div>
          <Link href="/#tools" className="text-sm font-semibold text-brand-600 hover:underline">Browse all categories</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {category.tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              title={tool.title}
              description={tool.description}
              href={`/tools/${tool.slug}`}
              icon={tool.icon}
              keywords={tool.keywords}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 border-t border-gray-100 py-12 lg:grid-cols-3">
        {[
          {
            title: `Why ${category.name.toLowerCase()} deserves its own page`,
            body: `Searchers looking for ${category.name.toLowerCase()} usually need a cluster of related tools, not one homepage list. This page gives Google and users a clear hub for the topic.`,
          },
          {
            title: 'How the tools connect',
            body: `Each tool links back into this category and to related tools. That creates a stronger internal-link path from broad category searches to specific high-intent pages.`,
          },
          {
            title: 'Best ranking path',
            body: `The category page targets broad searches, while each tool page targets exact queries like ${category.tools[0]?.keywords[0] ?? 'free online tool'}.`,
          },
        ].map((section) => (
          <div key={section.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{section.body}</p>
          </div>
        ))}
      </section>

      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-100 py-12">
          <h2 className="text-2xl font-bold text-gray-900">Related guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{post.tags[0] ?? 'Guide'}</p>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-gray-900">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

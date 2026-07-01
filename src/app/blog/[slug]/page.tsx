import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { ALL_TOOLS } from '@/lib/tools'
import ShareButtons from '@/components/ShareButtons'

const SITE_URL = 'https://freeltools.com'
const OG_IMAGE = `${SITE_URL}/opengraph-image`

interface Props { params: { slug: string } }

function stripMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractFaqItems(content: string) {
  const faqStart = content.search(/^##\s+FAQ\s*$/im)
  if (faqStart === -1) return []

  const faqSection = content.slice(faqStart).replace(/^##\s+FAQ\s*$/im, '')
  const nextH2 = faqSection.search(/\n##\s+(?!#)/)
  const scopedFaq = nextH2 === -1 ? faqSection : faqSection.slice(0, nextH2)
  const matches = Array.from(scopedFaq.matchAll(/^###\s+(.+?)\s*\n([\s\S]*?)(?=\n###\s+|\n##\s+|$)/gm))

  return matches
    .map((match) => ({
      question: stripMarkdown(match[1] ?? ''),
      answer: stripMarkdown(match[2] ?? ''),
    }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  const metaTitle = post.seoTitle || post.title
  const metaDescription = post.seoDescription || post.description
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.image || OG_IMAGE, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [post.image || OG_IMAGE],
    },
  }
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mt-8 text-2xl font-bold text-gray-900 sm:text-3xl" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mt-8 mb-3 text-xl font-bold text-gray-900" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-4 leading-7 text-gray-600" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-4 list-disc space-y-1.5 pl-6 text-gray-600" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="my-4 list-decimal space-y-1.5 pl-6 text-gray-600" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-7" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="my-4 border-l-4 border-brand-300 pl-4 italic text-gray-600" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800" {...props} />,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <pre className="my-4 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100" {...props} />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => <div className="my-4 overflow-x-auto"><table className="w-full border-collapse text-sm" {...props} /></div>,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => <th className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700" {...props} />,
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border border-gray-200 px-4 py-2 text-gray-600" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith('http')
    return (
      <a
        className="text-brand-600 underline hover:text-brand-700"
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      />
    )
  },
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-gray-900" {...props} />,
  hr: () => <hr className="my-8 border-gray-100" />,
}

// Pick up to 3 related posts by shared tags, excluding current
function getRelatedPosts(currentSlug: string, currentTags: string[], allPosts: ReturnType<typeof getAllPosts>) {
  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      shared: p.tags.filter((t) => currentTags.includes(t)).length,
    }))
    .filter((p) => p.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post || post.status !== 'published') notFound()

  const allPosts = getAllPosts()
  const related = getRelatedPosts(params.slug, post.tags, allPosts)
  const recentPosts = allPosts.filter((p) => p.slug !== params.slug).slice(0, 3)
  const postUrl = `${SITE_URL}/blog/${post.slug}`
  const faqItems = extractFaqItems(post.content)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image || OG_IMAGE,
    author: { '@type': 'Organization', name: 'FreelancerToolkit', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'FreelancerToolkit', url: SITE_URL },
    datePublished: post.publishDate,
    dateModified: post.date,
    url: postUrl,
    mainEntityOfPage: postUrl,
    keywords: post.tags.join(', '),
    isAccessibleForFree: true,
    inLanguage: 'en',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  const faqJsonLd = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null

  const displayRelated = related.length > 0 ? related : recentPosts

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 hover:bg-brand-100 transition"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-lg text-gray-500">{post.description}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
          <time dateTime={post.publishDate}>
            {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <span>By {post.author}</span>
        </div>

        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
          <p className="text-sm font-semibold text-gray-900">Put this guide into action</p>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use the free calculators, generators, and file tools on FreelancerToolkit while you read. No account required.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/#tools" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
              Browse all tools
            </Link>
            <Link href="/tools/freelancer-rate-calculator" className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Start with rate calculator
            </Link>
          </div>
        </div>

        {/* Share buttons — top */}
        <div className="mt-6">
          <ShareButtons title={post.title} url={postUrl} />
        </div>

        {/* Featured image */}
        {post.image && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        <hr className="my-8 border-gray-100" />

        {/* Content */}
        <div className="prose-custom">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Tool CTA — internal link to relevant tools */}
        <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <p className="text-sm font-semibold text-brand-900">Free tools for freelancers</p>
          <p className="mt-1 text-sm text-brand-700">
            Put this advice into action with our free calculators and generators — no login required.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/tools/freelancer-rate-calculator" className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition">Rate Calculator</Link>
            <Link href="/tools/invoice-generator" className="rounded-lg bg-white border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition">Invoice Generator</Link>
            <Link href="/tools/proposal-generator" className="rounded-lg bg-white border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition">Proposal Generator</Link>
            <Link href="/#tools" className="rounded-lg bg-white border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition">All {ALL_TOOLS.length} Tools →</Link>
          </div>
        </div>

        {/* Share buttons — bottom */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <p className="mb-3 text-sm font-semibold text-gray-700">Found this useful? Share it:</p>
          <ShareButtons title={post.title} url={postUrl} />
        </div>

        {/* Related / Recent posts — internal linking */}
        {displayRelated.length > 0 && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              {related.length > 0 ? 'Related Articles' : 'More from the Blog'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {displayRelated.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <div className="mb-2 flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{t}</span>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition line-clamp-2">{p.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">{p.readingTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 border-t border-gray-100 pt-6 flex items-center justify-between">
          <Link href="/blog" className="text-sm font-medium text-brand-600 hover:underline">← All Articles</Link>
          <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">Free Tools →</Link>
        </div>
      </article>
    </>
  )
}

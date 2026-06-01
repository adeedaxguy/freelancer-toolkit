import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/blog'


interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://freelancertoolkit.com/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article' },
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
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-brand-600 underline hover:text-brand-700" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-gray-900" {...props} />,
  hr: () => <hr className="my-8 border-gray-100" />,
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post || post.status !== 'published') notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Organization', name: 'FreelancerToolkit' },
    datePublished: post.publishDate,
    dateModified: post.date,
    url: `https://freelancertoolkit.com/blog/${post.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">{post.title}</span>
        </nav>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">{tag}</span>
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

        <hr className="my-8 border-gray-100" />

        {/* Content */}
        <div className="prose-custom">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Back link */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <Link href="/blog" className="text-sm font-medium text-brand-600 hover:underline">← Back to Blog</Link>
        </div>
      </article>
    </>
  )
}

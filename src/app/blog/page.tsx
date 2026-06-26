import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

const SITE_URL = 'https://freeltools.com'
const OG_IMAGE = `${SITE_URL}/opengraph-image`

export const metadata: Metadata = {
  title: 'Blog – Freelancing Tips, Guides & Resources',
  description: 'Free guides and tips for freelancers, agencies, and consultants. Learn how to set rates, win proposals, manage clients, and grow your business.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog – Freelancing Tips, Guides & Resources',
    description: 'Free guides and tips for freelancers, agencies, and consultants. Learn how to set rates, win proposals, manage clients, and grow your business.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'FreelancerToolkit blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – Freelancing Tips, Guides & Resources',
    description: 'Free guides and tips for freelancers, agencies, and consultants.',
    images: [OG_IMAGE],
  },
}

export const dynamic = 'force-dynamic'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Freelancer Blog</h1>
        <p className="mt-3 text-lg text-gray-500">Guides, tips, and resources for freelancers, agencies, and consultants.</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts published yet. Check back soon.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-brand-600">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-gray-500">{post.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <time dateTime={post.publishDate}>
                  {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
                Read article →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

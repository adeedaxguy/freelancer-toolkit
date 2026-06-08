import Link from 'next/link'
import { ALL_TOOLS } from '@/lib/tools'

export default function NotFound() {
  const popularSlugs = [
    'freelancer-rate-calculator',
    'invoice-generator',
    'proposal-generator',
    'upwork-fee-calculator',
    'project-cost-calculator',
    'scope-of-work-generator',
  ]
  const popularTools = popularSlugs
    .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-lg text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary px-6 py-3">
          Go to Homepage
        </Link>
        <Link href="/blog" className="btn-secondary px-6 py-3">
          Read the Blog
        </Link>
      </div>

      <div className="mt-16 text-left">
        <h2 className="text-lg font-semibold text-gray-900">Popular tools you might be looking for:</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {popularTools.map((tool) => tool && (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:shadow-md hover:border-brand-200"
            >
              <span className="text-xl">{tool.icon}</span>
              <p className="mt-1 font-medium text-gray-900">{tool.title}</p>
              <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

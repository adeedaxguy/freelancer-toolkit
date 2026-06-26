import Link from 'next/link'
import { getCategoryUrl } from '@/lib/categoryPages'
import { ALL_TOOLS, TOOL_CATEGORIES } from '@/lib/tools'

const popularToolSlugs = [
  'freelancer-rate-calculator',
  'project-cost-calculator',
  'invoice-generator',
  'proposal-generator',
  'germany-visa-photo-generator',
  'resize-signature-to-20kb',
  'jpg-to-pdf-converter',
  'image-compressor',
]

const resourceLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Browse all tools', href: '/#tools' },
  { label: 'Request a tool', href: '/#request-tool' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Sitemap', href: '/sitemap.xml' },
]

export default function Footer() {
  const totalTools = ALL_TOOLS.length
  const popularTools = popularToolSlugs
    .map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof ALL_TOOLS)[number] => Boolean(tool))

  return (
    <footer className="border-t border-gray-100 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr_1.2fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-white">Freelancer<span className="text-brand-400">Toolkit</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-300">
              Free calculators, generators, passport photo makers, PDF converters, and image tools for freelancers and agencies.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                `${totalTools} free tools`,
                'No login',
                'Private by default',
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Popular tools</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm leading-5 text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <span className="shrink-0 text-base leading-5">{tool.icon}</span>
                    <span className="min-w-0">{tool.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tool categories</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {TOOL_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={getCategoryUrl(category)}
                    className="group flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 text-sm leading-5 text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <span className="min-w-0">{category.name}</span>
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-300">{category.tools.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Resources</h2>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block rounded-lg px-2 py-1.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#tools"
              className="mt-5 inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Explore all tools
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} FreelancerToolkit. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            {TOOL_CATEGORIES.slice(0, 4).map((category) => (
              <Link key={category.slug} href={getCategoryUrl(category)} className="hover:text-white">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

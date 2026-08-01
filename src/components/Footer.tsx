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
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Browse all tools', href: '/#tools' },
  { label: 'Request a tool', href: '/#request-tool' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Sitemap', href: '/sitemap.xml' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/freeltoolslab/',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61592438546532',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
        <path d="M14.2 8.4V6.7c0-.8.5-1.2 1.3-1.2h1.6V2.6c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.1v1.9H7.8v3.2h2.7V21h3.4v-9.4h2.7l.5-3.2h-3Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@freeltools-b7i',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.4V8.6l5.6 3.4-5.6 3.4Z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pin.it/3iQWJMHSd',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
        <path d="M12.2 2C6.7 2 3 5.7 3 10.6c0 3.6 2 5.7 3.2 5.7.5 0 .8-1.4.8-1.8 0-.5-1.2-1.5-1.2-3.4 0-3.9 3-6.7 6.8-6.7 3.3 0 5.7 1.9 5.7 5.3 0 2.5-1 7.2-4.3 7.2-1.2 0-2.2-.9-1.9-2.1.4-1.5 1.1-3.1 1.1-4.2 0-2.7-3.8-2.2-3.8 1.3 0 1 .3 1.7.3 1.7s-1.2 5.2-1.4 6.1c-.3 1.3 0 3 .1 3.2.1.1.2.1.3 0 .1-.2 1.7-2.1 2.2-3.4.2-.5.9-3.4.9-3.4.5.9 1.8 1.6 3.2 1.6 4.2 0 7-3.8 7-8.9C22 5 18.7 2 12.2 2Z" />
      </svg>
    ),
  },
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
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Follow FreelTools</p>
              <div className="mt-3 flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow FreelTools on ${link.label}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:border-brand-400/60 hover:bg-brand-500 hover:text-white"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
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
              <li>
                <a
                  href="#"
                  className="clickio-cmp-settings-text clickio-cmp-settings-display block rounded-lg px-2 py-1.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  Your Privacy Choices
                </a>
              </li>
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
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <a href="#" className="clickio-cmp-settings-text clickio-cmp-settings-display hover:text-white">
              Privacy Choices
            </a>
            {TOOL_CATEGORIES.slice(0, 4).map((category) => (
              <Link key={category.slug} href={getCategoryUrl(category)} className="hover:text-white">
                {category.name}
              </Link>
            ))}
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
            <span className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  {link.icon}
                </a>
              ))}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

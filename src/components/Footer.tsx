import Link from 'next/link'
import { TOOL_CATEGORIES } from '@/lib/tools'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900">Freelancer<span className="text-brand-600">Toolkit</span></span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Free tools to help freelancers, agencies, and consultants run more profitable businesses.
            </p>
            <div className="mt-4 space-y-1 text-xs text-gray-400">
              <p>✓ 17 free tools</p>
              <p>✓ No login required</p>
              <p>✓ No data stored</p>
            </div>
          </div>

          {/* Tool columns by category */}
          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.slug}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">{cat.name}</h3>
              <ul className="mt-3 space-y-2">
                {cat.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`/tools/${tool.slug}`} className="text-sm text-gray-600 hover:text-brand-600">
                      {tool.icon} {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} FreelancerToolkit. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/blog" className="hover:text-brand-600">Blog</Link>
            <Link href="/about" className="hover:text-brand-600">About</Link>
            <Link href="/privacy" className="hover:text-brand-600">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/blog', label: 'Blog Posts', icon: '✍️' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { href: '/admin/traffic', label: 'Traffic', icon: '📈' },
  { href: '/admin/seo', label: 'SEO Audit', icon: '🔍' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-gray-100 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-900">FT Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-gray-600">
            ↗ View Site
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-red-500 transition">
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <span className="text-sm font-bold text-gray-900">FT Admin</span>
          <div className="flex gap-2">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg p-2 text-base hover:bg-gray-50" title={item.label}>
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

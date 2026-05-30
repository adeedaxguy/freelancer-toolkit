'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { TOOL_CATEGORIES } from '@/lib/tools'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openDropdown = (slug: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveCategory(slug)
  }

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setActiveCategory(null), 120)
  }

  const cancelClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          {/* Icon mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          {/* Wordmark */}
          <span className="hidden sm:flex items-baseline gap-0 text-[15px] font-bold tracking-tight text-gray-900 leading-none">
            Freelancer<span className="text-brand-600">Toolkit</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {TOOL_CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => openDropdown(cat.slug)}
              onMouseLeave={closeDropdown}
            >
              <button
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                aria-expanded={activeCategory === cat.slug}
                aria-haspopup="true"
              >
                {cat.name}
                <svg className={`h-3.5 w-3.5 transition-transform ${activeCategory === cat.slug ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Invisible bridge to prevent hover gap */}
              {activeCategory === cat.slug && (
                <div className="absolute left-0 top-full h-2 w-full" onMouseEnter={cancelClose} onMouseLeave={closeDropdown} />
              )}

              {/* Dropdown */}
              {activeCategory === cat.slug && (
                <div
                  className="absolute left-0 top-[calc(100%+8px)] z-50 w-60 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                  onMouseEnter={cancelClose}
                  onMouseLeave={closeDropdown}
                  role="menu"
                >
                  <p className="mb-1 px-3 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{cat.description}</p>
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition hover:bg-brand-50 hover:text-brand-700"
                      role="menuitem"
                      onClick={() => setActiveCategory(null)}
                    >
                      <span className="text-base leading-none">{tool.icon}</span>
                      <span>{tool.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — full-screen drawer */}
      {mobileOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-6 lg:hidden">
          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.slug} className="mt-4">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{cat.name}</p>
              <div className="grid grid-cols-1 gap-0.5">
                {cat.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100"
                  >
                    <span className="text-base">{tool.icon}</span>
                    {tool.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-400">
            17 free tools · No login required
          </div>
        </div>
      )}
    </header>
  )
}

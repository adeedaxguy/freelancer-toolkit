'use client'

import Link from 'next/link'
import { useMemo, useState, useRef } from 'react'
import { getCategoryUrl } from '@/lib/categoryPages'
import { TOOL_CATEGORIES, ALL_TOOLS } from '@/lib/tools'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileQuery, setMobileQuery] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasMobileQuery = mobileQuery.trim().length > 0

  const openMegaMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setMegaOpen(true)
  }

  const closeMegaMenu = (delay = 450) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setMegaOpen(false)
      timeoutRef.current = null
    }, delay)
  }

  const cancelClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const filteredCategories = useMemo(() => {
    const query = mobileQuery.trim().toLowerCase()
    if (!query) return TOOL_CATEGORIES

    return TOOL_CATEGORIES.map((category) => ({
      ...category,
      tools: category.tools.filter((tool) =>
        [tool.title, tool.description, ...tool.keywords].some((value) => value.toLowerCase().includes(query))
      ),
    })).filter((category) => category.tools.length > 0)
  }, [mobileQuery])

  const closeAllMenus = () => {
    cancelClose()
    setMobileOpen(false)
    setMegaOpen(false)
    setMobileQuery('')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={closeAllMenus}
        >
          {/* Icon mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          {/* Wordmark */}
          <span className="flex items-baseline gap-0 text-[15px] font-bold tracking-tight text-gray-900 leading-none">
            Freelancer<span className="text-brand-600">Toolkit</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
          <div className="relative" onMouseEnter={openMegaMenu} onMouseLeave={() => closeMegaMenu()}>
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onClick={() => setMegaOpen((open) => !open)}
            >
              Tools
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">{ALL_TOOLS.length}</span>
              <svg className={`h-3.5 w-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {megaOpen && (
              <div
                className="fixed left-0 right-0 top-12 h-10 cursor-default"
                onMouseEnter={cancelClose}
                onMouseLeave={() => closeMegaMenu(500)}
              />
            )}
          </div>

          <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
            Blog
          </Link>
          <Link href="/#tools" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
            Browse All
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/#request-tool" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
            Request a Tool
          </Link>
        </div>

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

      {/* Desktop mega menu */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 top-full hidden border-t border-gray-100 bg-white/95 px-4 py-3 shadow-lg backdrop-blur lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={() => closeMegaMenu(350)}
        >
          <div className="mx-auto grid max-h-[calc(100vh-88px)] max-w-6xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl lg:grid-cols-[260px_1fr]">
            <aside className="bg-gray-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">{ALL_TOOLS.length} free tools</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight">Tool library</h2>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Jump into the highest-value freelancer, photo, image, and document tools without opening a full directory.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['No login', 'Private tools', 'SEO pages'].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-2">
                <Link
                  href="/#tools"
                  onClick={() => setMegaOpen(false)}
                  className="rounded-full bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-400"
                >
                  Browse all tools
                </Link>
                <Link
                  href="/#request-tool"
                  onClick={() => setMegaOpen(false)}
                  className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                >
                  Request a tool
                </Link>
              </div>
            </aside>

            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {TOOL_CATEGORIES.map((cat) => (
                  <section key={cat.slug} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={getCategoryUrl(cat)}
                        onClick={() => setMegaOpen(false)}
                        className="group min-w-0"
                      >
                        <h3 className="text-sm font-bold leading-5 text-gray-900 group-hover:text-brand-700">{cat.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{cat.description}</p>
                      </Link>
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500 shadow-sm">
                        {cat.tools.length}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1">
                      {cat.tools.slice(0, 2).map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-white hover:text-brand-700"
                          onClick={() => setMegaOpen(false)}
                        >
                          <span className="shrink-0 text-sm leading-none">{tool.icon}</span>
                          <span className="truncate">{tool.title}</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={getCategoryUrl(cat)}
                      onClick={() => setMegaOpen(false)}
                      className="mt-2 inline-flex text-xs font-semibold text-brand-700 hover:text-brand-800"
                    >
                      View category →
                    </Link>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu — full-screen drawer */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-57px)] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-6 pt-4 shadow-xl lg:hidden">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Link
              href="/blog"
              onClick={closeAllMenus}
              className="rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-semibold text-gray-700"
            >
              Blog
            </Link>
            <Link
              href="/#request-tool"
              onClick={closeAllMenus}
              className="rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Request Tool
            </Link>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Search tools
            <input
              type="search"
              value={mobileQuery}
              onChange={(event) => setMobileQuery(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
              placeholder="Passport photo, invoice, PDF..."
            />
          </label>

          {!hasMobileQuery ? (
            <div className="mt-4 grid gap-2">
              {TOOL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={getCategoryUrl(cat)}
                  onClick={closeAllMenus}
                  className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition active:bg-brand-50"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-gray-900">{cat.name}</span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-5 text-gray-500">{cat.description}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-500 shadow-sm">
                    {cat.tools.length}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.slug} className="mt-4">
                <Link
                  href={getCategoryUrl(cat)}
                  onClick={closeAllMenus}
                  className="mb-1.5 inline-flex text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-brand-600"
                >
                  {cat.name}
                </Link>
                <div className="grid grid-cols-1 gap-0.5">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100"
                    >
                      <span className="text-base">{tool.icon}</span>
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}

          {filteredCategories.length === 0 && (
            <p className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No tools match that search yet.</p>
          )}

          <div className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-400">
            {ALL_TOOLS.length} free tools · No login required
          </div>
        </div>
      )}
    </header>
  )
}

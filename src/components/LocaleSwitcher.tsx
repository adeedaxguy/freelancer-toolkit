'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { equivalent, isLocale, localeNames, locales, type Locale } from '@/lib/i18n'

export default function LocaleSwitcher() {
  const pathname = usePathname()
  const first = pathname.split('/').filter(Boolean)[0] ?? ''
  const current: 'en' | Locale = isLocale(first) ? first : 'en'
  const [open, setOpen] = useState(false)
  const [suggestion, setSuggestion] = useState<Locale | null>(null)
  useEffect(() => {
    if (current !== 'en') return
    const saved = localStorage.getItem('freeltools_locale')
    const browser = navigator.language.toLowerCase().split('-')[0] ?? ''
    const value = isLocale(saved ?? '') ? saved as Locale : isLocale(browser) ? browser : null
    if (value) setSuggestion(value)
  }, [current])
  function remember(locale: 'en' | Locale) {
    localStorage.setItem('freeltools_locale', locale)
    document.cookie = `site_locale=${locale}; path=/; max-age=31536000; samesite=lax`
    setOpen(false); setSuggestion(null)
  }
  return <div className="fixed bottom-4 right-4 z-[90] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:bottom-6 sm:right-6">
    {suggestion && <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-3 shadow-xl" role="status"><div className="flex items-start gap-3"><span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-extrabold text-brand-700">{suggestion.toUpperCase()}</span><div><p className="text-sm font-bold text-gray-950">Open in {localeNames[suggestion]}?</p><div className="mt-2 flex gap-2"><Link href={equivalent(pathname, suggestion)} onClick={() => remember(suggestion)} className="rounded-md bg-gray-950 px-3 py-2 text-xs font-bold text-white">Open</Link><button onClick={() => setSuggestion(null)} className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold">English</button></div></div><button onClick={() => setSuggestion(null)} aria-label="Dismiss language suggestion" className="px-2 py-1 text-sm font-bold text-gray-500">Close</button></div></div>}
    {open && <div className="w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl" role="menu">{(['en', ...locales] as const).map(locale => <Link key={locale} href={equivalent(pathname, locale)} onClick={() => remember(locale)} className="flex min-h-11 items-center justify-between rounded-md px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50" role="menuitem">{localeNames[locale]}{current === locale && <span className="text-xs font-extrabold text-brand-700">Active</span>}</Link>)}</div>}
    <button onClick={() => setOpen(value => !value)} aria-label={`Language: ${localeNames[current]}`} aria-expanded={open} className="flex h-11 min-w-11 items-center justify-center rounded-full border border-gray-200 bg-white px-3 text-xs font-extrabold text-brand-700 shadow-lg hover:bg-gray-50">{current.toUpperCase()}</button>
  </div>
}

'use client'

import { useState, useEffect } from 'react'

interface ToolSubscribePopupProps {
  slug: string
}

const SUBSCRIBED_KEY = 'ft_subscribed'
const popupKey = (slug: string) => `ft_popup_${slug}`

export default function ToolSubscribePopup({ slug }: ToolSubscribePopupProps) {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Don't show if already subscribed or already shown on this tool
    if (
      localStorage.getItem(SUBSCRIBED_KEY) ||
      localStorage.getItem(popupKey(slug))
    ) {
      return
    }

    // Show after 10 seconds of being on the tool page
    const timer = setTimeout(() => {
      setVisible(true)
      localStorage.setItem(popupKey(slug), '1')
    }, 10000)

    return () => clearTimeout(timer)
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        localStorage.setItem(SUBSCRIBED_KEY, '1')
        setStatus('success')
        setTimeout(() => setVisible(false), 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe for free tools and tips"
      className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-up rounded-2xl border border-gray-100 bg-white shadow-2xl sm:bottom-8 sm:left-auto sm:right-24 sm:translate-x-0"
    >
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="p-5 sm:p-6">
        {status === 'success' ? (
          <div className="py-4 text-center">
            <div className="mb-2 text-3xl">🎉</div>
            <p className="font-semibold text-gray-900">You're in!</p>
            <p className="mt-1 text-sm text-gray-500">
              Check your inbox for a welcome email with tips.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl">
                🚀
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Get free tools &amp; tips
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Join 1,000+ freelancers. New tools, rate hacks &amp; templates — free.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={status === 'loading'}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-brand-400 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {status === 'loading' ? '…' : 'Join'}
              </button>
            </form>

            {status === 'error' && (
              <p className="mt-2 text-xs text-red-500">
                Something went wrong — please try again.
              </p>
            )}

            <p className="mt-2.5 text-center text-[10px] text-gray-400">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

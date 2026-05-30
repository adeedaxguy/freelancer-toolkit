'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to your email provider (ConvertKit, Mailchimp, etc.)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-xl bg-white/10 px-6 py-4 text-center text-brand-50">
        ✓ You're on the list! We'll notify you when new tools launch.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-80"
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
      >
        Notify Me
      </button>
    </form>
  )
}

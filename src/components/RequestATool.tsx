'use client'

import { useState } from 'react'

export default function RequestATool() {
  const [toolName, setToolName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!toolName.trim()) return
    setStatus('loading')

    try {
      const res = await fetch('/api/request-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, description, email }),
      })
      if (res.ok) {
        setStatus('success')
        setToolName('')
        setDescription('')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="request-tool" className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="mb-3 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            Shape What We Build Next
          </span>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Request a Tool
          </h2>
          <p className="mt-3 text-gray-500">
            Missing a calculator or generator for your freelance workflow? Tell us what you need — the most-requested tools get built first.
          </p>
        </div>

        {status === 'success' ? (
          <div className="rounded-2xl bg-white border border-green-100 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Request received!</h3>
            <p className="mt-2 text-gray-500 text-sm">Thanks for the suggestion. We review every request and prioritize based on demand.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-5 text-sm text-brand-600 hover:underline"
            >
              Submit another request →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                What tool do you need? <span className="text-red-400">*</span>
              </label>
              <input
                className="input-field"
                placeholder="e.g. Freelance contract generator, Time tracker, Client CRM"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Describe the problem it would solve
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="e.g. I spend hours tracking which clients owe me money — a simple payment status tracker would save me a ton of time."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your email <span className="text-gray-400 font-normal">(optional — we'll notify you when it's built)</span>
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={!toolName.trim() || status === 'loading'}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {status === 'loading' ? 'Submitting…' : 'Submit Request →'}
            </button>

            <p className="text-center text-xs text-gray-400">
              We review every submission. No spam — we only email if you asked to be notified.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

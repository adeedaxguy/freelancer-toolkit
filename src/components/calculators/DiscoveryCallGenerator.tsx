'use client'

import { useState } from 'react'
import AIResult from '@/components/AIResult'

const SERVICES = ['Web Design', 'Web Development', 'SEO', 'Content Writing', 'Social Media', 'Branding', 'Consulting', 'Mobile App', 'E-commerce', 'Video Production']
const INDUSTRIES = ['E-commerce', 'SaaS / Tech', 'Healthcare', 'Real Estate', 'Finance', 'Education', 'Restaurant & Food', 'Legal', 'Agency', 'Other']
const DURATIONS = ['15', '20', '30', '45', '60']

export default function DiscoveryCallGenerator() {
  const [form, setForm] = useState({
    service: 'Web Design',
    industry: 'E-commerce',
    duration: '30',
    goals: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const generate = async () => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'discovery', data: form }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setResult(json.content)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Call Details</h2>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Powered by Grok AI</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your Service</label>
            <select className="input-field" value={form.service} onChange={(e) => set('service', e.target.value)}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Client Industry</label>
            <select className="input-field" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Call Duration (minutes)</label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button key={d} onClick={() => set('duration', d)}
                className={"flex-1 rounded-lg border py-2 text-sm font-medium transition " + (form.duration === d ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300')}>
                {d}m
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your Goals for the Call (optional)</label>
          <textarea className="input-field min-h-[80px] resize-none" value={form.goals} onChange={(e) => set('goals', e.target.value)} placeholder="Qualify budget, understand timeline, close the project..." />
        </div>
        <button onClick={generate} disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Generating...' : '✨ Generate Discovery Script →'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex flex-col">
        {result || loading ? (
          <AIResult content={result} loading={loading} onEdit={setResult} onRegenerate={generate} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <div>
              <p className="text-3xl mb-3">📞</p>
              <p className="font-medium text-gray-700">AI Discovery Call Script</p>
              <p className="mt-1 text-sm text-gray-400">Get a structured script with the right questions to qualify clients and move them to a proposal.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

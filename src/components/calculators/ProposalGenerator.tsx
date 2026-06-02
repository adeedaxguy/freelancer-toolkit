'use client'

import { useState } from 'react'
import AIResult from '@/components/AIResult'

const SERVICES = ['Web Design', 'Web Development', 'SEO', 'Content Writing', 'Social Media Management', 'Branding & Logo', 'Video Production', 'Consulting', 'Mobile App Development', 'E-commerce']
const INDUSTRIES = ['E-commerce', 'SaaS / Tech', 'Healthcare', 'Real Estate', 'Finance', 'Education', 'Restaurant & Food', 'Legal', 'Agency', 'Non-profit', 'Other']

export default function ProposalGenerator() {
  const [form, setForm] = useState({
    freelancerName: '',
    service: 'Web Design',
    clientName: '',
    clientIndustry: 'E-commerce',
    budget: '',
    timeline: '4',
    problem: '',
    solution: '',
  })
  const [result, setResult] = useState('')
  const [provider, setProvider] = useState('')
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
        body: JSON.stringify({ tool: 'proposal', data: form }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setResult(json.content)
      setProvider(json.provider || '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Project Details</h2>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Powered by Grok AI</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your Name / Business</label>
            <input className="input-field" value={form.freelancerName} onChange={(e) => set('freelancerName', e.target.value)} placeholder="Jane Smith Design" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Client Name</label>
            <input className="input-field" value={form.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="Acme Corp" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Service Type</label>
            <select className="input-field" value={form.service} onChange={(e) => set('service', e.target.value)}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Client Industry</label>
            <select className="input-field" value={form.clientIndustry} onChange={(e) => set('clientIndustry', e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Budget</label>
            <input className="input-field" value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="$3,500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Timeline (weeks)</label>
            <input className="input-field" type="number" value={form.timeline} onChange={(e) => set('timeline', e.target.value)} min={1} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Client&apos;s Main Problem / Goal</label>
          <textarea className="input-field min-h-[80px] resize-none" value={form.problem} onChange={(e) => set('problem', e.target.value)} placeholder="They need a new website to increase leads from organic search..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your Proposed Solution</label>
          <textarea className="input-field min-h-[80px] resize-none" value={form.solution} onChange={(e) => set('solution', e.target.value)} placeholder="I'll design and build a conversion-optimised website with SEO foundations..." />
        </div>

        <button
          onClick={generate}
          disabled={loading || !form.problem}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : '✨ Generate Proposal with AI →'}
        </button>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      {/* Output */}
      <div className="flex flex-col">
        {result || loading ? (
          <AIResult
            content={result}
            provider={provider}
            loading={loading}
            plainText
            onEdit={setResult}
            onRegenerate={generate}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <div>
              <p className="text-3xl mb-3">✨</p>
              <p className="font-medium text-gray-700">AI-Powered Proposals</p>
              <p className="mt-1 text-sm text-gray-400">Fill in the details and get a concise, result-focused proposal with example websites in seconds.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

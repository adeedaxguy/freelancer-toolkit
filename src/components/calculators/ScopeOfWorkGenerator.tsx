'use client'

import { useState } from 'react'
import AIResult from '@/components/AIResult'

const SERVICE_TYPES = ['Web Design', 'Web Development', 'SEO', 'Content Writing', 'Social Media Management', 'Branding', 'Consulting', 'Mobile App', 'E-commerce', 'Video Production']

export default function ScopeOfWorkGenerator() {
  const [form, setForm] = useState({
    freelancerName: '',
    clientName: '',
    service: 'Web Design',
    deliverables: '',
    timeline: '4',
    budget: '',
    outOfScope: '',
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
        body: JSON.stringify({ tool: 'scope', data: { ...form, projectName: form.service } }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setResult(json.content)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Project Details</h2>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Powered by Grok AI</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your Name</label>
            <input className="input-field" value={form.freelancerName} onChange={(e) => set('freelancerName', e.target.value)} placeholder="Jane Smith" />
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
              {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Timeline (weeks)</label>
            <input className="input-field" type="number" value={form.timeline} onChange={(e) => set('timeline', e.target.value)} min={1} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Budget / Rate</label>
          <input className="input-field" value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="$3,500 fixed or $120/hr" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Deliverables (one per line)</label>
          <textarea className="input-field min-h-[100px] resize-none" value={form.deliverables} onChange={(e) => set('deliverables', e.target.value)} placeholder={"Homepage design\n5 inner pages\nMobile responsive\nContact form"} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">What&apos;s NOT included (optional)</label>
          <textarea className="input-field min-h-[60px] resize-none" value={form.outOfScope} onChange={(e) => set('outOfScope', e.target.value)} placeholder="Hosting, copywriting, logo design..." />
        </div>

        <button
          onClick={generate}
          disabled={loading || !form.deliverables}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : '✨ Generate Scope of Work →'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex flex-col">
        {result || loading ? (
          <AIResult content={result} loading={loading} onEdit={setResult} onRegenerate={generate} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <div>
              <p className="text-3xl mb-3">📋</p>
              <p className="font-medium text-gray-700">AI-Powered Scope of Work</p>
              <p className="mt-1 text-sm text-gray-400">Get a tight, legally-clear SOW that prevents scope creep before it starts.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

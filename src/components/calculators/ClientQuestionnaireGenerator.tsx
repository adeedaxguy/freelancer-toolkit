'use client'

import { useState } from 'react'
import AIResult from '@/components/AIResult'

const SERVICES = ['Web Design', 'Web Development', 'SEO', 'Content Writing', 'Social Media', 'Branding', 'Consulting', 'Mobile App', 'E-commerce', 'Video Production']
const CLIENT_TYPES = ['Small Business', 'Startup', 'Enterprise', 'Non-profit', 'Personal Brand', 'E-commerce Store', 'SaaS Company', 'Agency']

export default function ClientQuestionnaireGenerator() {
  const [form, setForm] = useState({
    service: 'Web Design',
    clientType: 'Small Business',
    projectType: '',
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
        body: JSON.stringify({ tool: 'questionnaire', data: form }),
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
          <h2 className="text-base font-semibold text-gray-900">Questionnaire Details</h2>
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Client Type</label>
            <select className="input-field" value={form.clientType} onChange={(e) => set('clientType', e.target.value)}>
              {CLIENT_TYPES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Project Type / Notes (optional)</label>
          <textarea className="input-field min-h-[80px] resize-none" value={form.projectType} onChange={(e) => set('projectType', e.target.value)} placeholder="e.g. Redesign of existing site, new mobile app, brand refresh..." />
        </div>
        <button onClick={generate} disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Generating...' : '✨ Generate Questionnaire →'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex flex-col">
        {result || loading ? (
          <AIResult content={result} loading={loading} onEdit={setResult} onRegenerate={generate} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <div>
              <p className="text-3xl mb-3">📝</p>
              <p className="font-medium text-gray-700">AI Client Questionnaire</p>
              <p className="mt-1 text-sm text-gray-400">Get 12-15 smart onboarding questions that save hours of back-and-forth with new clients.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

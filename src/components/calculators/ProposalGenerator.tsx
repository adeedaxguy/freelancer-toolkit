'use client'

import { useState } from 'react'

const SERVICES = ['Web Design', 'Web Development', 'SEO', 'Content Writing', 'Social Media', 'Branding & Logo', 'Video Production', 'Consulting', 'Mobile App Development', 'E-commerce']
const INDUSTRIES = ['E-commerce', 'SaaS / Tech', 'Healthcare', 'Real Estate', 'Finance', 'Education', 'Restaurant & Food', 'Legal', 'Agency', 'Non-profit', 'Other']

function generateProposal(data: {
  freelancerName: string
  service: string
  clientName: string
  clientIndustry: string
  budget: string
  timeline: string
  problem: string
  solution: string
}) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `
PROPOSAL
${data.service.toUpperCase()}
────────────────────────────────────────
Prepared by: ${data.freelancerName || '[Your Name]'}
Prepared for: ${data.clientName || '[Client Name]'}
Date: ${today}

EXECUTIVE SUMMARY
────────────────────────────────────────
Thank you for the opportunity to submit this proposal. Based on our conversation, I understand that ${data.clientName || 'your business'} is looking for expert ${data.service} services to ${data.problem || 'achieve your business goals'}.

I specialize in delivering high-quality ${data.service} solutions for ${data.clientIndustry} businesses. This proposal outlines how I plan to help you achieve your objectives.


THE CHALLENGE
────────────────────────────────────────
${data.problem || `Your current ${data.service} needs improvements that are limiting your growth and results in the ${data.clientIndustry} space.`}


MY PROPOSED SOLUTION
────────────────────────────────────────
${data.solution || `I will deliver a comprehensive ${data.service} strategy and execution plan tailored to your ${data.clientIndustry} business, designed to produce measurable results within the agreed timeline.`}


SCOPE OF WORK
────────────────────────────────────────
Phase 1: Discovery & Strategy (Week 1)
  • In-depth project kick-off call
  • Audit of existing assets and materials
  • Research and competitive analysis
  • Delivery of strategic brief for approval

Phase 2: Execution (Weeks 2–${Math.max(3, parseInt(data.timeline) - 1) || 3})
  • Core ${data.service} deliverables
  • Regular progress updates
  • Client feedback and revision rounds (2 included)

Phase 3: Delivery & Handoff (Final Week)
  • Final deliverables and assets
  • Documentation and knowledge transfer
  • 14-day post-launch support


TIMELINE
────────────────────────────────────────
Estimated Project Duration: ${data.timeline ? data.timeline + ' weeks' : 'To be confirmed'}
Project Start: Upon contract signature and deposit receipt


INVESTMENT
────────────────────────────────────────
Project Fee: ${data.budget || 'To be discussed based on final scope'}

Payment Terms:
  • 50% deposit due upon contract signing
  • 50% balance due upon project completion

Additional revisions beyond the 2 included rounds are billed at my standard hourly rate.


NEXT STEPS
────────────────────────────────────────
1. Review this proposal and let me know if you have any questions
2. Sign the agreement and submit the 50% deposit
3. We schedule our kick-off call and begin immediately

I'm excited about the opportunity to work with ${data.clientName || 'you'} and deliver exceptional results. Please don't hesitate to reach out with any questions.

Best regards,
${data.freelancerName || '[Your Name]'}
`.trim()
}

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
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleGenerate = () => {
    setGenerated(generateProposal(form))
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Project Details</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your Name / Business</label>
          <input className="input-field" value={form.freelancerName} onChange={(e) => set('freelancerName', e.target.value)} placeholder="Jane Smith Design" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Client Name</label>
          <input className="input-field" value={form.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="Acme Corp" />
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Budget / Price</label>
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
        <button onClick={handleGenerate} className="btn-primary w-full py-3">
          Generate Proposal →
        </button>
      </div>

      {/* Output */}
      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Your Proposal</h2>
          {generated && (
            <button onClick={handleCopy} className="btn-secondary py-1.5 text-xs">
              {copied ? '✓ Copied!' : 'Copy All'}
            </button>
          )}
        </div>
        {generated ? (
          <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-700 font-mono">
            {generated}
          </pre>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
            Fill in the details and click Generate →
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

const SERVICE_TYPES = ['Web Design', 'Web Development', 'SEO', 'Content Writing', 'Social Media Management', 'Branding', 'Consulting', 'Mobile App', 'E-commerce', 'Video Production']

function generateSOW(data: {
  freelancerName: string
  clientName: string
  serviceType: string
  deliverables: string
  timeline: string
  startDate: string
  rate: string
  revisions: string
}) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const deliverableList = data.deliverables.split('\n').filter(Boolean)

  return `
SCOPE OF WORK AGREEMENT
────────────────────────────────────────
Service: ${data.serviceType}
Date: ${today}

PARTIES
────────────────────────────────────────
Service Provider: ${data.freelancerName || '[Your Name]'}
Client: ${data.clientName || '[Client Name]'}


1. OVERVIEW
────────────────────────────────────────
This Scope of Work outlines the services, deliverables, timeline, and terms agreed upon between ${data.freelancerName || '[Service Provider]'} and ${data.clientName || '[Client]'} for the provision of ${data.serviceType} services.


2. DELIVERABLES
────────────────────────────────────────
The following deliverables are included in this engagement:

${deliverableList.length > 0 ? deliverableList.map((d, i) => `${i + 1}. ${d.trim()}`).join('\n') : '1. [Add your deliverables above]'}

The above represents the complete scope. Any work outside this list is considered out-of-scope and will be quoted separately.


3. TIMELINE
────────────────────────────────────────
Estimated Duration: ${data.timeline || '[X] weeks'}
${data.startDate ? `Anticipated Start Date: ${data.startDate}` : ''}

The timeline assumes timely client feedback within 48 hours of each delivery. Delays in feedback may extend the project timeline accordingly.


4. REVISIONS
────────────────────────────────────────
This engagement includes ${data.revisions || '2'} rounds of revisions on all deliverables. A revision round is defined as a consolidated list of changes submitted in a single batch.

Additional revisions are available at ${data.rate ? data.rate + '/hr' : 'the standard hourly rate'}.


5. CLIENT RESPONSIBILITIES
────────────────────────────────────────
To complete this project on time, the client agrees to:
  • Provide necessary assets, access, and information within 3 business days of request
  • Designate a single point of contact for feedback and approvals
  • Consolidate feedback from all stakeholders before submitting revisions
  • Provide final approval in writing before project closure


6. OUT OF SCOPE
────────────────────────────────────────
The following are explicitly not included unless agreed in writing:
  • Ongoing maintenance or hosting after project completion
  • Content creation not listed in Section 2
  • Third-party integrations not specified above
  • SEO optimization unless listed as a deliverable
  • Printing, production, or physical deliverables


7. PAYMENT TERMS
────────────────────────────────────────
${data.rate ? `Rate: ${data.rate}` : 'Rate: As agreed in the accompanying invoice or contract'}
  • 50% deposit required before work begins
  • 50% balance due upon project completion
  • Invoices are due within 7 days of issue
  • Late payments accrue 1.5% monthly interest


8. APPROVAL
────────────────────────────────────────
By proceeding with this engagement, both parties confirm agreement to the terms above.

Service Provider: ${data.freelancerName || '_______________________'}
Client: ${data.clientName || '_______________________'}
Date: _______________________
`.trim()
}

export default function ScopeOfWorkGenerator() {
  const [form, setForm] = useState({
    freelancerName: '',
    clientName: '',
    serviceType: 'Web Design',
    deliverables: '',
    timeline: '4 weeks',
    startDate: '',
    rate: '',
    revisions: '2',
  })
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleCopy = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Project Details</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your Name / Business</label>
            <input className="input-field" value={form.freelancerName} onChange={(e) => set('freelancerName', e.target.value)} placeholder="Jane Smith" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Client Name</label>
            <input className="input-field" value={form.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="Acme Corp" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Service Type</label>
          <select className="input-field" value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)}>
            {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Deliverables (one per line)</label>
          <textarea
            className="input-field min-h-[120px] resize-none"
            value={form.deliverables}
            onChange={(e) => set('deliverables', e.target.value)}
            placeholder={`Homepage design (desktop + mobile)\nAbout page design\n5 interior page templates\nDesign system / style guide`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Timeline</label>
            <input className="input-field" value={form.timeline} onChange={(e) => set('timeline', e.target.value)} placeholder="4 weeks" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Start Date (optional)</label>
            <input className="input-field" type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rate / Fee</label>
            <input className="input-field" value={form.rate} onChange={(e) => set('rate', e.target.value)} placeholder="$3,500 fixed / $120/hr" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Revision Rounds Included</label>
            <input className="input-field" type="number" value={form.revisions} onChange={(e) => set('revisions', e.target.value)} min={0} max={10} />
          </div>
        </div>

        <button onClick={() => { setGenerated(generateSOW(form)); setCopied(false) }} className="btn-primary w-full py-3">
          Generate Scope of Work →
        </button>
      </div>

      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Your Scope of Work</h2>
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
          <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400 min-h-[300px]">
            Fill in the details and click Generate →
          </div>
        )}
      </div>
    </div>
  )
}

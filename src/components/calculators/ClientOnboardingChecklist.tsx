'use client'

import { useState, useMemo } from 'react'

type ServiceType = 'web-design' | 'marketing' | 'photography' | 'consulting' | 'social-media' | 'copywriting' | 'development'
type ProjectType = 'one-off' | 'retainer' | 'ongoing'

interface ChecklistItem {
  id: string
  phase: string
  task: string
  details?: string
}

function buildChecklist(service: ServiceType, projectType: ProjectType): ChecklistItem[] {
  const base: ChecklistItem[] = [
    { id: 'c1', phase: 'Pre-Kickoff', task: 'Contract signed by both parties', details: 'Ensure both parties have a countersigned copy on file.' },
    { id: 'c2', phase: 'Pre-Kickoff', task: 'Deposit / first invoice paid', details: 'Confirm payment cleared before starting work.' },
    { id: 'c3', phase: 'Pre-Kickoff', task: 'NDA signed (if applicable)', details: 'Required for projects with sensitive business information.' },
    { id: 'c4', phase: 'Access & Setup', task: 'Client completes intake questionnaire', details: 'Gather goals, brand assets, logins, and preferences.' },
    { id: 'c5', phase: 'Access & Setup', task: 'Access to project management tool granted', details: 'Add client to Notion, Asana, Linear, or your preferred PM tool.' },
    { id: 'c6', phase: 'Access & Setup', task: 'Communication channel established', details: 'Set up dedicated Slack channel, email thread, or preferred contact method.' },
    { id: 'c7', phase: 'Kickoff Call', task: 'Kickoff call scheduled', details: 'Book 30–60 min to align on goals, timeline, and process.' },
    { id: 'c8', phase: 'Kickoff Call', task: 'Project goals and success metrics confirmed', details: 'What does a successful outcome look like for the client?' },
    { id: 'c9', phase: 'Kickoff Call', task: 'Revision and feedback process explained', details: 'Explain how many rounds are included and how to submit feedback.' },
    { id: 'c10', phase: 'Kickoff Call', task: 'First milestone / deliverable date confirmed', details: 'Align on the first deadline so both parties have the same expectation.' },
  ]

  const serviceSpecific: Record<ServiceType, ChecklistItem[]> = {
    'web-design': [
      { id: 's1', phase: 'Access & Setup', task: 'Access to domain registrar / DNS', details: 'Needed for deployment, subdomain setup, or domain verification.' },
      { id: 's2', phase: 'Access & Setup', task: 'Access to current hosting account', details: 'Or confirm where the new site will be hosted.' },
      { id: 's3', phase: 'Access & Setup', task: 'Existing brand assets collected (logo, fonts, colors)', details: 'Request in vector format (SVG/AI/EPS). Get brand guidelines if available.' },
      { id: 's4', phase: 'Access & Setup', task: 'Content and copy provided or planned', details: 'Confirm whether client is providing copy or if you are writing it.' },
      { id: 's5', phase: 'Project Setup', task: 'Design tool / staging environment set up', details: 'Share Figma, Webflow, or staging URL with client for review.' },
    ],
    'marketing': [
      { id: 's1', phase: 'Access & Setup', task: 'Access to Google Analytics / GA4', details: 'Required to baseline performance and track results.' },
      { id: 's2', phase: 'Access & Setup', task: 'Access to ad accounts (Google Ads, Meta, etc.)', details: 'Request editor access, not just view-only.' },
      { id: 's3', phase: 'Access & Setup', task: 'Competitor landscape reviewed', details: 'Review 3–5 key competitors before kickoff call.' },
      { id: 's4', phase: 'Project Setup', task: 'KPIs and reporting cadence agreed', details: 'Define what metrics matter and how often you\'ll report.' },
    ],
    'photography': [
      { id: 's1', phase: 'Pre-Kickoff', task: 'Shot list and creative brief confirmed', details: 'Get written confirmation of required shots, styles, and usage.' },
      { id: 's2', phase: 'Access & Setup', task: 'Location / access confirmed', details: 'Confirm venue access, permits, and any restrictions.' },
      { id: 's3', phase: 'Access & Setup', task: 'Delivery format and usage rights agreed', details: 'JPEG resolution, RAW delivery, commercial usage terms.' },
      { id: 's4', phase: 'Project Setup', task: 'Shared gallery / delivery folder created', details: 'Set up Dropbox, Google Drive, or Pixieset for delivery.' },
    ],
    'consulting': [
      { id: 's1', phase: 'Access & Setup', task: 'Stakeholder map collected', details: 'Who are the key decision-makers and their roles?' },
      { id: 's2', phase: 'Access & Setup', task: 'Relevant internal documents shared', details: 'Past reports, strategy docs, financials — anything relevant to the engagement.' },
      { id: 's3', phase: 'Kickoff Call', task: 'Problem statement validated', details: 'Confirm you and the client agree on the core problem being solved.' },
      { id: 's4', phase: 'Project Setup', task: 'Deliverable format confirmed', details: 'Slide deck, written report, workshop, or advisory calls?' },
    ],
    'social-media': [
      { id: 's1', phase: 'Access & Setup', task: 'Social media account access granted', details: 'Get admin access to all platforms being managed.' },
      { id: 's2', phase: 'Access & Setup', task: 'Brand voice and content guidelines received', details: 'Any existing guidelines, tone of voice docs, or past content.' },
      { id: 's3', phase: 'Access & Setup', task: 'Content approval workflow agreed', details: 'Define how content will be reviewed — how many days for approval?' },
      { id: 's4', phase: 'Project Setup', task: 'Content calendar template shared', details: 'Share your scheduling tool or content calendar with the client.' },
    ],
    'copywriting': [
      { id: 's1', phase: 'Access & Setup', task: 'Brand voice guide / style guide received', details: 'Get any existing guidelines, sample copy they like, and competitors to reference.' },
      { id: 's2', phase: 'Access & Setup', task: 'Target audience brief completed', details: 'Who are they writing for? Demographics, pain points, desires.' },
      { id: 's3', phase: 'Access & Setup', task: 'SEO keywords provided (if applicable)', details: 'Primary and secondary keywords for search-optimized content.' },
      { id: 's4', phase: 'Project Setup', task: 'Review and approval process agreed', details: 'Turnaround time for feedback and number of revisions included.' },
    ],
    'development': [
      { id: 's1', phase: 'Access & Setup', task: 'Repository access granted', details: 'Add to GitHub, GitLab, or Bitbucket with appropriate permissions.' },
      { id: 's2', phase: 'Access & Setup', task: 'Tech stack and architecture documented', details: 'Understand the existing system before writing a line of code.' },
      { id: 's3', phase: 'Access & Setup', task: 'Development and staging environment set up', details: 'Get local dev running; confirm deploy pipeline.' },
      { id: 's4', phase: 'Project Setup', task: 'Definition of done agreed', details: 'What does "complete" mean for each feature? Tests? Code review?' },
    ],
  }

  const retainerItems: ChecklistItem[] = projectType !== 'one-off' ? [
    { id: 'r1', phase: 'Ongoing Setup', task: 'Monthly check-in / reporting call scheduled', details: 'Book a recurring slot for status updates and strategy reviews.' },
    { id: 'r2', phase: 'Ongoing Setup', task: 'Billing and invoice cycle confirmed', details: 'First of month? Net 7? Confirm expectations to avoid payment delays.' },
    { id: 'r3', phase: 'Ongoing Setup', task: 'Scope boundaries documented', details: 'What is and is not included in the retainer to prevent scope creep.' },
  ] : []

  return [...base, ...serviceSpecific[service], ...retainerItems]
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  'web-design': 'Web Design',
  'marketing': 'Marketing',
  'photography': 'Photography',
  'consulting': 'Consulting',
  'social-media': 'Social Media Management',
  'copywriting': 'Copywriting',
  'development': 'Development',
}

export default function ClientOnboardingChecklist() {
  const [service, setService] = useState<ServiceType>('web-design')
  const [projectType, setProjectType] = useState<ProjectType>('one-off')
  const [generated, setGenerated] = useState(false)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const checklist = useMemo(() => buildChecklist(service, projectType), [service, projectType])
  const phases = useMemo(() => {
    const seen: string[] = []
    checklist.forEach((i) => { if (!seen.includes(i.phase)) seen.push(i.phase) })
    return seen
  }, [checklist])

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const progress = checklist.length > 0 ? Math.round((checked.size / checklist.length) * 100) : 0

  const copyAsText = () => {
    const lines = phases.flatMap((phase) => {
      const items = checklist.filter((i) => i.phase === phase)
      return [`\n## ${phase}`, ...items.map((i) => `- [ ] ${i.task}${i.details ? `\n      ${i.details}` : ''}`)]
    })
    navigator.clipboard.writeText(`Client Onboarding Checklist — ${SERVICE_LABELS[service]}\n${lines.join('\n')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Config */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Configure Your Checklist</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Service Type</label>
            <select
              className="input-field h-10"
              value={service}
              onChange={(e) => { setService(e.target.value as ServiceType); setGenerated(false); setChecked(new Set()) }}
            >
              {(Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Project Type</label>
            <select
              className="input-field h-10"
              value={projectType}
              onChange={(e) => { setProjectType(e.target.value as ProjectType); setGenerated(false); setChecked(new Set()) }}
            >
              <option value="one-off">One-off Project</option>
              <option value="retainer">Monthly Retainer</option>
              <option value="ongoing">Ongoing Engagement</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => { setGenerated(true); setChecked(new Set()) }}
          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition sm:w-auto sm:px-8"
        >
          Generate Checklist →
        </button>
      </div>

      {/* Checklist */}
      {generated && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {SERVICE_LABELS[service]} Onboarding Checklist
              </h2>
              <p className="text-xs text-gray-400">{checked.size} of {checklist.length} items complete</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-600">{progress}%</span>
              </div>
              <button
                onClick={copyAsText}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {copied ? '✓ Copied!' : 'Copy as Text'}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-50 px-6 py-2">
            {phases.map((phase) => (
              <div key={phase} className="py-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-600">{phase}</h3>
                <div className="space-y-3">
                  {checklist.filter((i) => i.phase === phase).map((item) => (
                    <label key={item.id} className="flex cursor-pointer items-start gap-3 group">
                      <input
                        type="checkbox"
                        checked={checked.has(item.id)}
                        onChange={() => toggleCheck(item.id)}
                        className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 text-indigo-600 accent-indigo-600"
                      />
                      <div className={checked.has(item.id) ? 'opacity-50' : ''}>
                        <p className={`text-sm font-medium text-gray-900 ${checked.has(item.id) ? 'line-through' : ''}`}>
                          {item.task}
                        </p>
                        {item.details && (
                          <p className="mt-0.5 text-xs text-gray-500">{item.details}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {progress === 100 && (
            <div className="mx-6 mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
              🎉 Onboarding complete — you&apos;re ready to start the project!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

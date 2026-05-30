'use client'

import { useState } from 'react'

const CATEGORIES: Record<string, { opening: string[]; qualifying: string[]; deepDive: string[]; closing: string[] }> = {
  'Web Agency': {
    opening: [
      'Thanks for hopping on — really excited to learn more about your business. Before I dive in, can you give me a quick overview of what [Company] does and who you serve?',
      'I reviewed your current website before this call. I noticed [observation] — can you tell me more about the background there?',
    ],
    qualifying: [
      'What made you reach out now? What\'s changed or what\'s the trigger?',
      'What\'s the main problem you\'re trying to solve with a new website?',
      'Have you worked with a web agency or freelancer before? How did that go?',
      'What does success look like 6 months after launch?',
      'What\'s your timeline — is there a hard deadline, like a launch event or campaign?',
      'Do you have a budget range in mind for this project?',
    ],
    deepDive: [
      'Who is your ideal customer and what action do you want them to take on the site?',
      'What pages do you know you need? Any specific functionality — booking, e-commerce, portal?',
      'Do you have brand guidelines or will branding be part of this engagement?',
      'Who on your team will be involved in approvals and feedback?',
      'How quickly do you typically turn around feedback?',
    ],
    closing: [
      'Based on what you\'ve shared, I think I can definitely help. Let me summarize what I\'m hearing...',
      'The next step would be for me to put together a proposal. I\'ll have that to you within [X] business days.',
      'Is there anyone else on your team who should be part of the decision before we move forward?',
      'What questions do you have for me?',
    ],
  },
  'Consultant': {
    opening: [
      'Thanks for making time. I\'d love to start by hearing you describe the challenge in your own words — what\'s going on?',
      'Before we dive in — what prompted you to reach out now, as opposed to 6 months ago?',
    ],
    qualifying: [
      'What have you already tried to address this problem?',
      'What happened? Why didn\'t it fully work?',
      'Who else is affected by this problem inside the organization?',
      'What does "solved" look like — specifically? How would you measure success?',
      'What\'s the cost of not solving this over the next 12 months?',
      'What\'s your budget for an engagement like this?',
    ],
    deepDive: [
      'Walk me through your current process / team structure / workflow.',
      'Where does it break down or slow down?',
      'Who are the key stakeholders and decision-makers involved?',
      'Are there any political or organizational constraints I should know about?',
      'What would make this engagement fail from your perspective?',
    ],
    closing: [
      'This is clearly important and time-sensitive. Based on what you\'ve told me, I\'d approach it by...',
      'I\'d like to put together a brief proposal outlining my approach and investment. Does that work?',
      'Is there a specific concern or hesitation I can address before we wrap up?',
      'What\'s your decision timeline?',
    ],
  },
  'Designer': {
    opening: [
      'Great to meet you! I\'d love to hear about this project — can you give me the short version of what you\'re looking for?',
      'I looked at your current brand before the call. Can you tell me what you love about it and what you want to change?',
    ],
    qualifying: [
      'What\'s the main goal of this design project?',
      'Who is your target audience?',
      'What\'s the timeline — when do you need this completed?',
      'Do you have a budget range in mind?',
      'Have you worked with a designer before on something like this?',
    ],
    deepDive: [
      'Share some examples of design you like — and explain what you like about them.',
      'Are there any styles, colors, or approaches you absolutely want to avoid?',
      'Do you have existing brand assets I should work within, or is this a fresh start?',
      'What formats will you need the final files in?',
      'Who will be giving feedback and approving the designs?',
    ],
    closing: [
      'I love this project — it\'s right in my wheelhouse. Here\'s how I\'d approach it...',
      'I\'ll send over a proposal with the full scope, timeline, and pricing by [date].',
      'Any questions for me before we wrap up?',
    ],
  },
}

export default function DiscoveryCallGenerator() {
  const [category, setCategory] = useState('Web Agency')
  const [freelancerName, setFreelancerName] = useState('')
  const [service, setService] = useState('')
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const script = CATEGORIES[category]

  const generate = () => {
    const output = `
DISCOVERY CALL SCRIPT
${(service || category).toUpperCase()}
────────────────────────────────────────
${freelancerName ? `Freelancer: ${freelancerName}` : ''}
Duration: 20–40 minutes
Goal: Understand fit, qualify budget/timeline, agree on next steps

────────────────────────────────────────
BEFORE THE CALL
────────────────────────────────────────
□ Review their website, LinkedIn, and any prior emails
□ Note 1–2 specific observations to reference
□ Have your calendar open to book next steps immediately
□ Have a rate card / ballpark ready in case they ask

────────────────────────────────────────
OPENING (2–3 min)
────────────────────────────────────────
${script.opening.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

────────────────────────────────────────
QUALIFYING QUESTIONS (10–15 min)
────────────────────────────────────────
${script.qualifying.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

────────────────────────────────────────
DEEP DIVE (10 min)
────────────────────────────────────────
${script.deepDive.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

────────────────────────────────────────
CLOSING & NEXT STEPS (5 min)
────────────────────────────────────────
${script.closing.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

────────────────────────────────────────
AFTER THE CALL
────────────────────────────────────────
□ Send a follow-up email within 2 hours summarizing key points
□ Include agreed next steps and timeline
□ Send proposal within the committed timeframe
□ Follow up if no response within 3 business days
`.trim()
    setGenerated(output)
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Call Details</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Service Category</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Specific Service (optional)</label>
          <input className="input-field" value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Shopify redesign, brand identity..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your Name (optional)</label>
          <input className="input-field" value={freelancerName} onChange={(e) => setFreelancerName(e.target.value)} placeholder="Jane Smith" />
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-sm">
          <p className="font-semibold text-gray-700">Script includes:</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-500">
            <li>• Pre-call checklist</li>
            <li>• Opening questions ({script.opening.length})</li>
            <li>• Qualifying questions ({script.qualifying.length})</li>
            <li>• Deep dive questions ({script.deepDive.length})</li>
            <li>• Closing + next steps ({script.closing.length})</li>
            <li>• Post-call action checklist</li>
          </ul>
        </div>

        <button onClick={generate} className="btn-primary w-full py-3">
          Generate Call Script →
        </button>
      </div>

      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Your Call Script</h2>
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
            Select a category and click Generate →
          </div>
        )}
      </div>
    </div>
  )
}

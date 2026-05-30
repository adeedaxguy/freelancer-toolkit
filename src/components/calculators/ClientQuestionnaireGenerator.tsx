'use client'

import { useState } from 'react'

const SERVICE_QUESTIONS: Record<string, string[]> = {
  'Web Design': [
    'What is the primary goal of this website? (e.g., generate leads, sell products, build brand awareness)',
    'Who is your target audience? Describe their demographics and needs.',
    'Do you have an existing website? If so, what do you like and dislike about it?',
    'List 3–5 competitor or inspiration websites you admire and explain what appeals to you.',
    'What pages do you need? (e.g., Home, About, Services, Blog, Contact)',
    'Do you have existing brand guidelines, logo, or color palette? If not, will branding be part of this project?',
    'What content will you provide vs. what will require creation?',
    'Do you need any integrations? (e.g., e-commerce, booking, CRM, newsletter)',
    'What is your timeline for launch?',
    'What is your budget range for this project?',
    'Who will be responsible for approving designs and providing feedback on your team?',
    'How will you measure success? (e.g., contact form submissions, sales, time on site)',
  ],
  'SEO': [
    'What is your website URL and what platform is it built on?',
    'What are your 3 most important products or services you want to rank for?',
    'Who is your target audience and what geography are you targeting?',
    'Who are your main competitors online?',
    'Do you have Google Analytics and Google Search Console set up?',
    'Have you done any SEO work before? If so, what was done and who did it?',
    'What are your current top-performing pages by traffic?',
    'Do you have a blog or content strategy in place?',
    'What is your monthly budget for SEO (including content creation)?',
    'What does success look like to you in 6–12 months?',
  ],
  'Branding': [
    'Describe your business in one sentence — what do you do and for whom?',
    'What are your core brand values? (pick 3–5 words)',
    'Who is your ideal client? Describe them in detail.',
    'Who are your main competitors and how do you differ from them?',
    'What adjectives should your brand evoke? (e.g., modern, trustworthy, playful, premium)',
    'Are there any colors, fonts, or styles you love or absolutely want to avoid?',
    'What deliverables do you need? (e.g., logo, color palette, typography, brand guide)',
    'Do you have existing brand assets we should reference or replace?',
    'Where will your brand appear? (website, print, social media, packaging)',
    'What is your timeline and budget for this project?',
  ],
  'Content Writing': [
    'What is the purpose of this content? (educate, convert, rank in SEO, etc.)',
    'Who is your target reader? Describe their role, pain points, and goals.',
    'What tone and voice does your brand use? (e.g., professional, conversational, expert)',
    'Do you have existing content guidelines or a style guide?',
    'What keywords or topics should the content focus on?',
    'What action should readers take after reading?',
    'Do you need SEO optimization as part of the writing?',
    'What format do you need? (blog posts, landing pages, emails, case studies)',
    'How many pieces of content and approximately how long each?',
    'Will you provide research, sources, or outlines — or should I handle all research?',
  ],
  'Social Media': [
    'Which social media platforms do you currently use or want to focus on?',
    'What are your follower counts and engagement rates currently?',
    'Who is your target audience on social media?',
    'What is the main goal of your social media presence? (brand awareness, leads, community)',
    'What type of content has performed best for you historically?',
    'Do you have brand assets (logo, templates, photography) ready to use?',
    'How many posts per week do you need, and on which platforms?',
    'Will you provide products/services information and photography, or should I source content?',
    'Do you need community management (responding to comments/DMs)?',
    'What is your monthly budget for content creation and any paid promotion?',
  ],
  'Consulting': [
    'What is the main business challenge or opportunity you want to address?',
    'What have you already tried to solve this problem?',
    'What does success look like at the end of this engagement?',
    'Who are the key stakeholders involved in this decision?',
    'What is your timeline for seeing results or making decisions?',
    'What data, reports, or internal documents can you share to help me understand the situation?',
    'Are there any political, budget, or organizational constraints I should be aware of?',
    'How often would you like to meet for updates during the engagement?',
    'What is your budget for this consulting engagement?',
    'Who will be my primary point of contact?',
  ],
}

const DEFAULT_QUESTIONS = SERVICE_QUESTIONS['Web Design']

export default function ClientQuestionnaireGenerator() {
  const [serviceType, setServiceType] = useState('Web Design')
  const [freelancerName, setFreelancerName] = useState('')
  const [clientName, setClientName] = useState('')
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const questions = SERVICE_QUESTIONS[serviceType] || DEFAULT_QUESTIONS

  const generate = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const output = `
CLIENT QUESTIONNAIRE — ${serviceType.toUpperCase()}
────────────────────────────────────────
${freelancerName ? `Prepared by: ${freelancerName}` : ''}
${clientName ? `For: ${clientName}` : ''}
Date: ${today}

Thank you for taking the time to fill out this questionnaire. Your answers help me understand your needs, plan the project accurately, and deliver the best possible results.

Please answer each question as thoroughly as you can — there are no wrong answers.

────────────────────────────────────────

${questions.map((q, i) => `${i + 1}. ${q}\n\n   Answer: _____________________________________________\n   _____________________________________________________\n`).join('\n')}

────────────────────────────────────────
ADDITIONAL NOTES
Please share anything else you think is important for me to know before we begin:

_______________________________________________
_______________________________________________
_______________________________________________

Thank you! I'll review your answers and be in touch within 1–2 business days.
${freelancerName ? `\n— ${freelancerName}` : ''}
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
        <h2 className="text-base font-semibold text-gray-900">Questionnaire Settings</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Service Type</label>
          <select className="input-field" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            {Object.keys(SERVICE_QUESTIONS).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your Name (optional)</label>
          <input className="input-field" value={freelancerName} onChange={(e) => setFreelancerName(e.target.value)} placeholder="Jane Smith Design" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Client Name (optional)</label>
          <input className="input-field" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Acme Corp" />
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Questions Included ({questions.length})</p>
          <ul className="space-y-1.5">
            {questions.slice(0, 4).map((q, i) => (
              <li key={i} className="text-xs text-gray-600 line-clamp-1">• {q}</li>
            ))}
            {questions.length > 4 && <li className="text-xs text-gray-400">+ {questions.length - 4} more questions...</li>}
          </ul>
        </div>

        <button onClick={generate} className="btn-primary w-full py-3">
          Generate Questionnaire →
        </button>
      </div>

      <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Your Questionnaire</h2>
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
            Select a service type and click Generate →
          </div>
        )}
      </div>
    </div>
  )
}

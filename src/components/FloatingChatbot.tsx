'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ALL_TOOLS } from '@/lib/tools'

const TOTAL_TOOLS = ALL_TOOLS.length

interface Message {
  role: 'user' | 'bot'
  text: string
}

const TOOLS = [
  { name: 'Freelance Rate Calculator', path: '/tools/freelancer-rate-calculator', keys: ['rate', 'hourly', 'charge', 'how much', 'pricing', 'price myself'] },
  { name: 'Invoice Generator', path: '/tools/invoice-generator', keys: ['invoice', 'bill', 'billing', 'payment'] },
  { name: 'Proposal Generator', path: '/tools/proposal-generator', keys: ['proposal', 'pitch', 'quote', 'bid'] },
  { name: 'Scope of Work Generator', path: '/tools/scope-of-work-generator', keys: ['scope', 'sow', 'scope creep', 'deliverable'] },
  { name: 'Project Cost Calculator', path: '/tools/project-cost-calculator', keys: ['project cost', 'estimate', 'quote project', 'cost estimate'] },
  { name: 'Upwork Fee Calculator', path: '/tools/upwork-fee-calculator', keys: ['upwork', 'fee', 'commission', 'platform fee'] },
  { name: 'Retainer Calculator', path: '/tools/retainer-calculator', keys: ['retainer', 'monthly', 'recurring'] },
  { name: 'Break-Even Calculator', path: '/tools/break-even-calculator', keys: ['break even', 'breakeven', 'minimum income', 'expenses'] },
  { name: 'Revenue Goal Calculator', path: '/tools/revenue-goal-calculator', keys: ['revenue', 'income goal', 'earn', 'annual income'] },
  { name: 'Commission Calculator', path: '/tools/commission-calculator', keys: ['commission', 'freelancer.com', 'fiverr', 'platform comparison'] },
  { name: 'Profit Calculator', path: '/tools/profit-calculator', keys: ['profit', 'margin', 'net income'] },
  { name: 'Agency Pricing Calculator', path: '/tools/agency-pricing-calculator', keys: ['agency', 'agency pricing', 'agency rate'] },
  { name: 'Meeting Cost Calculator', path: '/tools/meeting-cost-calculator', keys: ['meeting', 'meeting cost', 'async'] },
  { name: 'Client Questionnaire Generator', path: '/tools/client-questionnaire-generator', keys: ['questionnaire', 'onboarding', 'new client', 'intake'] },
  { name: 'Discovery Call Generator', path: '/tools/discovery-call-generator', keys: ['discovery call', 'sales call', 'client call', 'script'] },
  { name: 'Hourly vs Fixed Calculator', path: '/tools/hourly-vs-fixed-calculator', keys: ['hourly vs fixed', 'hourly or fixed', 'project based'] },
  { name: 'Freelancer Commission Calculator', path: '/tools/freelancer-commission-calculator', keys: ['freelancer commission', 'platform fees', 'compare platforms'] },
  { name: 'Germany Visa Photo Generator', path: '/tools/germany-visa-photo-generator', keys: ['germany visa photo', 'passport photo', 'visa photo', 'biometric photo'] },
  { name: 'US Passport Photo Maker', path: '/tools/us-passport-photo-maker', keys: ['us passport photo', '2x2 photo', 'passport size photo'] },
  { name: 'Image Resizer', path: '/tools/resize-photo-under-50kb', keys: ['resize image', 'compress photo', 'under 50kb', 'signature resize'] },
  { name: 'JPG to PDF Converter', path: '/tools/jpg-to-pdf-converter', keys: ['jpg to pdf', 'image to pdf', 'photo to pdf'] },
]

const FAQ: Array<{ match: string[]; answer: string; tool?: string }> = [
  {
    match: ['hello', 'hi', 'hey', 'sup', 'yo'],
    answer: "Hey! 👋 I'm the FreelancerToolkit assistant. I can help you find the right tool, answer questions about freelance rates, invoicing, proposals, and more. What are you working on?",
  },
  {
    match: ['what tools', 'list tools', 'all tools', 'what can you', 'what do you have'],
    answer: `We have ${TOTAL_TOOLS} free tools:\n\n• **Freelance business** — rate, project cost, invoices, proposals, contracts\n• **Passport & visa photos** — Germany, US, UK, Canada, India, Schengen, and more\n• **Image tools** — resize, compress, convert, signature and upload-size helpers\n• **PDF tools** — JPG/PNG/image to PDF converters\n\nAll free, no login needed. Which one sounds useful?`,
  },
  {
    match: ['free', 'cost', 'how much does', 'paid', 'subscription', 'sign up', 'login', 'account'],
    answer: "Every tool on FreelancerToolkit is 100% free. No account, no login, no credit card. We don't store any of the data you enter — everything runs in your browser.",
  },
  {
    match: ['how to set', 'set my rate', 'calculate rate', 'what should i charge', 'how do i price'],
    answer: "Great question. Your rate needs to cover your income goal, taxes (self-employment is ~15.3% on top of income tax), business expenses, and non-billable time (realistically you'll bill 20–25 hours/week, not 40).\n\nUse the **Freelance Rate Calculator** — it handles all of this automatically.",
    tool: '/tools/freelancer-rate-calculator',
  },
  {
    match: ['scope creep', 'client keeps adding', 'project growing', 'out of scope'],
    answer: "Scope creep is the #1 profitability killer for freelancers. Fix it with a clear Scope of Work document that defines what's included, what's not, and how many revision rounds are covered.\n\nTry the **Scope of Work Generator** to create one in minutes.",
    tool: '/tools/scope-of-work-generator',
  },
  {
    match: ['client not paying', "won't pay", "doesn't pay", 'late payment', 'overdue invoice', 'chase'],
    answer: "First, send a polite payment reminder referencing the invoice number and due date. If that fails, follow up with a firm email outlining late payment terms.\n\nFor future protection: always get 50% upfront, include late fee clauses in your contract, and use the **Invoice Generator** which has proper payment term fields.",
    tool: '/tools/invoice-generator',
  },
  {
    match: ['upwork', 'upwork fee', 'how much upwork'],
    answer: "Upwork says freelancer service fees can vary by contract from 0% to 15%. Check the percentage shown when you submit a proposal or receive an offer, then use the **Upwork Fee Calculator** to see what you'll take home.",
    tool: '/tools/upwork-fee-calculator',
  },
  {
    match: ['retainer', 'monthly retainer', 'ongoing client'],
    answer: "A retainer is a fixed monthly fee for an agreed set of hours or deliverables. It gives you predictable income and the client predictable availability. Typically you charge a small discount (5–10%) vs your project rate in exchange for the security.\n\nThe **Retainer Calculator** helps you set the right monthly number.",
    tool: '/tools/retainer-calculator',
  },
  {
    match: ['proposal', 'write a proposal', 'win client', 'proposal template'],
    answer: "The biggest proposal mistake: leading with your background instead of their problem. Lead with what you understand about their situation, then show your process and price transparently.\n\nThe **Proposal Generator** builds a professional proposal in under 5 minutes.",
    tool: '/tools/proposal-generator',
  },
  {
    match: ['tax', 'taxes', 'self employment tax', 'quarterly'],
    answer: "As a freelancer in the US, you pay self-employment tax (~15.3%) plus income tax. A rough rule: set aside 25–30% of every payment for taxes. Pay quarterly estimated taxes to avoid a penalty.\n\nThe **Freelance Rate Calculator** factors taxes into your minimum rate automatically.",
    tool: '/tools/freelancer-rate-calculator',
  },
  {
    match: ['request', 'suggest a tool', 'build a tool', 'can you add', 'missing tool', 'need a tool for'],
    answer: "We'd love to build more tools for you! Scroll to the bottom of any page and you'll find the **Request a Tool** section — tell us what you need and we'll prioritize the most-requested ones.",
  },
  {
    match: ['blog', 'article', 'guide', 'tips'],
    answer: "We publish practical freelancing guides on our blog — covering rates, proposals, contracts, client management, and more. Check out the [Blog](/blog) for free guides that go deeper on every topic.",
  },
]

function getBotResponse(input: string): { text: string; tool?: string } {
  const lower = input.toLowerCase()

  // Check FAQ matches
  for (const faq of FAQ) {
    if (faq.match.some((m) => lower.includes(m))) {
      return { text: faq.answer, tool: faq.tool }
    }
  }

  // Check tool matches
  for (const tool of TOOLS) {
    if (tool.keys.some((k) => lower.includes(k))) {
      return {
        text: `Sounds like you need the **${tool.name}**. It's free and works instantly in your browser.`,
        tool: tool.path,
      }
    }
  }

  // Fallback
  return {
    text: `I'm not sure about that one — could you rephrase? Or you can browse all ${TOTAL_TOOLS} tools on the [homepage](/) and find what fits your situation. Still stuck? Try asking something like "how do I calculate my rate" or "make a Germany visa photo".`,
  }
}

function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderText(text: string) {
  const parts = text.split('\n')
  return parts.map((line, i) => {
    const formatted = sanitizeHtml(line)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, linkText, url) => {
        if (/^(\/|https?:\/\/)/.test(url)) {
          return `<a href="${url}" class="underline text-brand-600 hover:text-brand-700" target="_self">${linkText}</a>`
        }
        return linkText
      })
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < parts.length - 1 && <br />}
      </span>
    )
  })
}

export default function FloatingChatbot() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi! 👋 I'm here to help you find the right tool or answer freelancing questions. What can I help with?" },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pendingTool, setPendingTool] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, messages])

  const sendMessage = (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setTyping(true)

    setTimeout(() => {
      const { text: botText, tool } = getBotResponse(text)
      setMessages((m) => [...m, { role: 'bot', text: botText }])
      if (tool) setPendingTool(tool)
      else setPendingTool(null)
      setTyping(false)
    }, 600)
  }

  const send = () => sendMessage()

  if (!mounted || pathname?.startsWith('/blog')) return null

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 transition-all duration-200"
        aria-label="Open support chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col w-[calc(100vw-2rem)] max-w-96 rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden"
          style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="flex items-center gap-3 bg-brand-600 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">FreelancerToolkit Assistant</p>
              <p className="text-xs text-brand-100">Ask me anything</p>
            </div>
            <div className="ml-auto flex h-2 w-2 rounded-full bg-green-400" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            {pendingTool && !typing && (
              <div className="flex justify-start">
                <a href={pendingTool} className="inline-flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-200 px-3.5 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors">
                  Open Tool →
                </a>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 pt-2 flex gap-2 flex-wrap border-t border-gray-100">
            {['How do I set my rate?', 'What tools exist?', 'Fix scope creep'].map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors mb-2">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-2.5">
            <input
              ref={inputRef}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:bg-white transition-colors"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button onClick={send} disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white disabled:opacity-40 hover:bg-brand-700 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

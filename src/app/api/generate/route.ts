import { NextRequest, NextResponse } from 'next/server'

// ── Model cascade (tried in order until one succeeds) ──────────────────────
// 1. OpenRouter Llama 3.1 8B free  — confirmed free
// 2. OpenRouter Gemma 2 9B free    — confirmed free
// 3. OpenRouter Mistral 7B free    — confirmed free
// 4. Template fallback             — always works

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

async function callOpenRouter(prompt: string, system: string, model: string): Promise<string | null> {
  if (!OPENROUTER_KEY) return null
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://freeltools.com',
        'X-Title': 'FreelTools',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        temperature: 0.75,
        max_tokens: 1200,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.warn(`[OpenRouter] ${model} failed ${res.status}:`, err)
      return null
    }
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content ?? null
    if (!content) console.warn(`[OpenRouter] ${model} empty response`)
    return content
  } catch (e) {
    console.warn(`[OpenRouter] ${model} error:`, e)
    return null
  }
}

const SYSTEM_PROPOSAL = `You are an expert freelance proposal writer. You write short, direct, winning proposals for platforms like Upwork, Freelancer, and direct email.

STRICT RULES:
- Plain text ONLY. Zero markdown. No ** bold **, no # headers, no bullet dashes.
- Start immediately with YOUR solution/approach — never start with "I understand you need" or "You are looking for"
- Max 250 words total
- Write in first person, confident and direct
- Include 2-3 REAL, specific example websites (with actual URLs) relevant to the client's industry and service
- Sound human, not templated
- End with one clear next step sentence`

const SYSTEM_OTHER = `You are an expert freelance business consultant. Write concise, professional documents for freelancers.
- Use clean formatting with section headers
- Be specific and results-focused
- No filler phrases`

export async function GET() {
  // Debug: test OpenRouter connection
  const key = process.env.OPENROUTER_API_KEY
  if (!key) return NextResponse.json({ error: 'OPENROUTER_API_KEY not set' })
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'HTTP-Referer': 'https://freeltools.com', 'X-Title': 'FreelTools' },
      body: JSON.stringify({ model: 'meta-llama/llama-3.1-8b-instruct:free', messages: [{ role: 'user', content: 'Say "ok" and nothing else.' }], max_tokens: 5 }),
    })
    const json = await res.json()
    return NextResponse.json({ status: res.status, response: json })
  } catch (e) {
    return NextResponse.json({ error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  const { tool, data } = await req.json()
  const prompt = buildPrompt(tool, data)
  if (!prompt) return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })

  const system = tool === 'proposal' ? SYSTEM_PROPOSAL : SYSTEM_OTHER

  // Confirmed free OpenRouter models
  const models = [
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
  ]

  let content: string | null = null
  let provider = ''

  for (const model of models) {
    content = await callOpenRouter(prompt, system, model)
    if (content) { provider = model; break }
  }

  if (!content) {
    content = buildTemplateFallback(tool, data)
    provider = 'template'
  }

  console.log(`[generate] tool=${tool} provider=${provider}`)
  return NextResponse.json({ ok: true, content, provider })
}

function buildPrompt(tool: string, d: Record<string, string>): string | null {
  switch (tool) {
    case 'proposal':
      return `Write a winning freelance proposal. Plain text only — absolutely no markdown, no ** bold **, no # headers, no bullet symbols. Just clean paragraphs.

MY DETAILS:
- Name: ${d.freelancerName || 'the freelancer'}
- Service: ${d.service}

CLIENT DETAILS:
- Name: ${d.clientName || 'the client'}
- Industry: ${d.clientIndustry}
- Their problem: ${d.problem}
- Budget: ${d.budget ? '$' + d.budget : 'to be discussed'}
- Timeline: ${d.timeline} weeks

MY SOLUTION: ${d.solution}

Structure (NO headers, plain paragraphs only):

Paragraph 1 (2-3 sentences): Open with exactly what outcome I'll deliver for their specific problem. Be direct and confident.

Paragraph 2 (2-3 sentences): Briefly explain my approach/process. Make it feel tailored to them.

Paragraph 3: Write exactly this line first: "Here are a few examples of similar work in the ${d.clientIndustry} space:" then on separate lines list 3 LESSER-KNOWN, NICHE websites (NOT famous brands like Shopify/Amazon/Nike). Pick real but smaller, industry-specific sites that demonstrate good ${d.service}. Format each as: - SiteName.com — one sentence why it's relevant to their project.

Paragraph 4 (2-3 sentences): Investment is ${d.budget ? '$' + d.budget : 'competitive'}, ${d.timeline} weeks, 50/50 payment. One genuine, specific call to action.

Sign off with just: ${d.freelancerName || ''}

Total: under 220 words. Confident, human, specific.`

    case 'scope':
      return `Write a clear scope of work document to prevent scope creep.

Project: ${d.service} for ${d.clientName || 'client'}
Provider: ${d.freelancerName || 'provider'}
Budget: ${d.budget || 'TBD'} | Timeline: ${d.timeline} weeks
Deliverables: ${d.deliverables}
Excluded: ${d.outOfScope || 'to be defined'}

Sections needed:
Project Overview (2 sentences)
Deliverables (numbered, very specific)
What's NOT Included (6 items explicitly excluded)
Timeline (phases with weeks)
Revision Policy (max rounds, cost for extras)
Acceptance Criteria`

    case 'discovery':
      return `Write a ${d.duration}-minute discovery call script for selling ${d.service} to a ${d.industry} business.
Goals: ${d.goals || 'qualify client, uncover budget, move to proposal'}

Include: opening script, 5 qualifying questions with follow-ups, 3 budget/urgency questions, how to pitch your process briefly, exact closing words, 3 red flag warning signs.`

    case 'questionnaire':
      return `Write a client onboarding questionnaire for a ${d.service} freelancer working with a ${d.clientType} client.
Project context: ${d.projectType || 'standard project'}

Write 12-15 smart questions in sections: Business & Goals, Project Specifics, Design Preferences, Technical Requirements, Timeline & Budget, Approval Process. Add a brief italic note after each question explaining why you ask it.`

    default:
      return null
  }
}

function buildTemplateFallback(tool: string, d: Record<string, string>): string {
  if (tool === 'proposal') {
    const budget = d.budget ? `$${d.budget}` : 'competitive'
    const niches: Record<string, string[]> = {
      'E-commerce': ['- TrueClassicTees.com — strong product page UX with clear CTAs', '- GymShark.com/collections — clean category structure and filtering', '- MadePura.com — excellent mobile checkout flow'],
      'SaaS / Tech': ['- Loom.com — clear value prop and onboarding flow', '- Linear.app — minimal, fast-loading SaaS design', '- Pitch.com — strong hero and feature storytelling'],
      'Healthcare': ['- HimsHers.com — trust-focused design with clear steps', '- NutritionKitchen.co.uk — clean health product layout', '- RomanHealth.com — simple consultation flow'],
      'Real Estate': ['- Compass.com — clean property search UX', '- Roofstock.com — data-rich but scannable layout', '- LoftSmart.com — student housing with clear CTAs'],
    }
    const refs = niches[d.clientIndustry] || ['- TrueClassicTees.com — strong ecommerce UX', '- Linear.app — minimal and fast SaaS design', '- Pitch.com — clear value storytelling']
    return `I can fix ${d.problem || 'your current issue'} and deliver a ${d.service.toLowerCase()} that works — in ${d.timeline} weeks. ${d.solution ? d.solution + '.' : ''}

My process is straightforward: understand your goals first, move fast, and keep you in the loop at every step. No surprises.

Here are a few examples of similar work in the ${d.clientIndustry} space:
${refs.join('\n')}

Investment is ${budget}, split 50/50 — half upfront, half on delivery. Ready to get started this week if you are.

${d.freelancerName || ''}`
  }
  return `AI generation temporarily unavailable. Please try again in a moment.`
}

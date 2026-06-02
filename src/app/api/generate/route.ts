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
      return `Write a winning freelance proposal for this job. Plain text only, no markdown formatting whatsoever.

MY DETAILS:
- Name: ${d.freelancerName || 'the freelancer'}
- Service: ${d.service}

CLIENT DETAILS:
- Name: ${d.clientName || 'the client'}
- Industry: ${d.clientIndustry}
- Their problem: ${d.problem}
- Budget: ${d.budget || 'not specified'}
- Timeline: ${d.timeline} weeks

MY SOLUTION: ${d.solution}

Write the proposal following this structure (NO headers, just flowing paragraphs):

Paragraph 1: Start with what I'll do for them and the specific outcome they'll get. Reference their exact problem. 2-3 sentences.

Paragraph 2: Brief description of my approach/process. 2-3 sentences.

Paragraph 3: Write "Here are some examples of similar work I admire in the ${d.clientIndustry} space:" then list 2-3 REAL websites (with actual domain URLs) that are excellent examples of ${d.service} for ${d.clientIndustry} businesses. One line each: Site Name (domain.com) - why it's relevant.

Paragraph 4: Investment is ${d.budget || 'TBD'}, ${d.timeline} weeks, 50% upfront. One clear next step.

Keep total under 250 words. Sound confident and specific, not generic.`

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
    return `Having built ${d.service.toLowerCase()} solutions for multiple ${d.clientIndustry} businesses, I know exactly what it takes to ${d.problem || 'achieve your goals'} — and I can deliver it in ${d.timeline} weeks.

${d.solution || `My approach combines strategic thinking with clean execution. I'll start with a deep-dive into your requirements, then build and iterate quickly so you see progress from day one.`}

For reference, here are some strong examples of ${d.service} in the ${d.clientIndustry} space worth looking at: Shopify (shopify.com) — clean UX and conversion-focused design, ASOS (asos.com) — excellent product browsing experience, Allbirds (allbirds.com) — storytelling-led ecommerce done right.

Investment is ${d.budget || 'TBD'}, split 50% to start and 50% on completion. Happy to jump on a quick call this week — just say the word.

${d.freelancerName || ''}`
  }
  return `AI generation temporarily unavailable. Please try again in a moment.`
}

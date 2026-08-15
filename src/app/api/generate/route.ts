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
- Do not invent portfolio examples, client names, case studies, numbers, or websites. If no proof is supplied, write a practical proof/process paragraph instead.
- Sound human, not templated
- End with one clear next step sentence`

const SYSTEM_OTHER = `You are an expert freelance business consultant. Write concise, professional documents for freelancers.
- Use clean formatting with section headers
- Be specific and results-focused
- No filler phrases`

// Debug endpoint removed for security

export async function POST(req: NextRequest) {
  let body: { tool?: string; data?: Record<string, string> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { tool, data } = body
  if (!tool || typeof tool !== 'string' || !data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing tool or data' }, { status: 400 })
  }

  const MAX_FIELD_LENGTH = 2000
  const sanitizedData: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string') continue
    sanitizedData[key] = value.slice(0, MAX_FIELD_LENGTH)
  }

  const prompt = buildPrompt(tool, sanitizedData)
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
    content = buildTemplateFallback(tool, sanitizedData)
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
PROOF / RELEVANT EXAMPLES I PROVIDED: ${d.proof || 'None provided. Do not invent websites or case studies.'}

Structure (NO headers, plain paragraphs only):

Paragraph 1 (2-3 sentences): Open with exactly what outcome I'll deliver for their specific problem. Be direct and confident.

Paragraph 2 (2-3 sentences): Briefly explain my approach/process. Make it feel tailored to them.

Paragraph 3 (2-3 sentences): If proof/examples were provided, reference only those. If none were provided, explain the quality checks, deliverables, and communication rhythm instead. Never create fake examples.

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
    const proof = d.proof
      ? `Relevant proof I can point to: ${d.proof}.`
      : `To keep this low-risk, I will share the first outline or draft quickly, confirm the direction before deep production, and keep decisions visible so there are no surprise revisions.`
    return `I can fix ${d.problem || 'your current issue'} and deliver a ${d.service.toLowerCase()} that works — in ${d.timeline} weeks. ${d.solution ? d.solution + '.' : ''}

My process is straightforward: understand your goals first, move fast, and keep you in the loop at every step. No surprises.

${proof}

Investment is ${budget}, split 50/50 — half upfront, half on delivery. Ready to get started this week if you are.

${d.freelancerName || ''}`
  }
  if (tool === 'scope') {
    const deliverables = (d.deliverables || 'Core deliverables to be confirmed')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item, index) => `${index + 1}. ${item}`)
      .join('\n')

    return `Scope of Work Draft

Project Overview
${d.freelancerName || 'The provider'} will deliver ${d.service || 'the agreed service'} for ${d.clientName || 'the client'} over ${d.timeline || 'the agreed'} weeks. The scope below is the working agreement for deliverables, review limits, and acceptance.

Deliverables
${deliverables}

Timeline
Week 1: kickoff, access, requirements, and first working plan.
Middle phase: production, check-ins, and agreed deliverable drafts.
Final phase: revisions, QA, handoff, and final approval.

Revision Policy
The project includes ${d.revisionRounds || 'two'} reasonable revision rounds unless the signed agreement says otherwise. New features, new pages, rewritten requirements, rush changes, or work outside the deliverables should be quoted separately.

Out of Scope
${d.outOfScope || 'Hosting, paid tools, copywriting, legal review, third-party costs, emergency support, and new deliverables are not included unless added in writing.'}

Acceptance Criteria
Work is accepted when the listed deliverables are provided, the included revision rounds are completed, and the client confirms the deliverables match the approved scope.`
  }

  if (tool === 'discovery') {
    return `Discovery Call Script

Opening
Thanks for taking the time today. I would like to understand what you are trying to achieve, what is blocking it now, and whether ${d.service || 'this project'} is something I can help with. If it is a fit, I will suggest the cleanest next step.

Qualifying Questions
1. What outcome would make this project a success?
2. What have you already tried, and what did not work?
3. Who needs to approve the direction, budget, and final delivery?
4. What deadline matters, and what happens if it slips?
5. What assets, access, or internal support are already available?

Budget and Urgency
1. Have you set aside a budget range for this?
2. Is the budget tied to a launch, sales target, investor deadline, or internal commitment?
3. If we find the right plan today, when would you want work to start?

Close
Based on what you shared, the next useful step is a short written plan with scope, timeline, and price. I can send that over after the call if you want me to map the project properly.`
  }

  if (tool === 'questionnaire') {
    return `Client Questionnaire

Business and Goals
1. What is the main business outcome this project needs to support?
2. Who is the target audience, and what do they need to do next?
3. What would make this project feel successful 30 days after launch?

Project Specifics
4. What deliverables do you expect from this project?
5. What existing assets, files, logins, or examples can you share?
6. What must be included, and what should be avoided?

Timeline and Approval
7. What is the ideal deadline, and is it flexible?
8. Who gives feedback, and who gives final approval?
9. How quickly can your team review drafts?

Budget and Scope
10. What budget range should the solution fit inside?
11. Are there third-party costs, subscriptions, or contractors involved?
12. What would count as out of scope after kickoff?

Handoff
13. What format should final files or documentation be delivered in?
14. Who will maintain the work after delivery?
15. Are there legal, brand, accessibility, privacy, or compliance requirements I should know before starting?`
  }

  return `The generator could not identify this tool. Please check the input and try again.`
}

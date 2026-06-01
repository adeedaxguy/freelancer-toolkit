import { NextRequest, NextResponse } from 'next/server'

// ── Model cascade (tried in order until one succeeds) ──────────────────────
// 1. Gemini 1.5 Flash  — free, 1,500 req/day, high quality
// 2. OpenRouter free   — free, Llama 3.1 70B, good quality
// 3. OpenRouter backup — free, Gemma 2 9B, decent quality
// 4. Template fallback — always works, no AI

const GEMINI_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

// ── Gemini ─────────────────────────────────────────────────────────────────
async function callGemini(prompt: string, system: string): Promise<string | null> {
  if (!GEMINI_KEY) return null
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
        }),
      }
    )
    if (!res.ok) {
      console.warn('[Gemini] status', res.status, await res.text())
      return null
    }
    const json = await res.json()
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? null
  } catch (e) {
    console.warn('[Gemini] error', e)
    return null
  }
}

// ── OpenRouter ─────────────────────────────────────────────────────────────
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
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })
    if (!res.ok) {
      console.warn('[OpenRouter]', model, 'status', res.status)
      return null
    }
    const json = await res.json()
    return json.choices?.[0]?.message?.content ?? null
  } catch (e) {
    console.warn('[OpenRouter] error', e)
    return null
  }
}

// ── System prompt ──────────────────────────────────────────────────────────
const SYSTEM = `You are an expert freelance business consultant. Write concise, professional, results-focused documents for freelancers and agencies.

Rules:
- Be direct and results-oriented. No fluff or filler.
- Use specific outcomes where possible
- Keep proposals under 400 words
- Format as clean markdown with ## headers
- Never use phrases like "I am pleased to submit"`

// ── Main handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { tool, data } = await req.json()

  const prompt = buildPrompt(tool, data)
  if (!prompt) {
    return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
  }

  // Try each provider in order
  let content: string | null = null
  let provider = ''

  content = await callGemini(prompt, SYSTEM)
  if (content) { provider = 'gemini' }

  if (!content) {
    content = await callOpenRouter(prompt, SYSTEM, 'meta-llama/llama-3.1-70b-instruct:free')
    if (content) { provider = 'openrouter-llama70b' }
  }

  if (!content) {
    content = await callOpenRouter(prompt, SYSTEM, 'google/gemma-2-9b-it:free')
    if (content) { provider = 'openrouter-gemma' }
  }

  if (!content) {
    content = await callOpenRouter(prompt, SYSTEM, 'mistralai/mistral-7b-instruct:free')
    if (content) { provider = 'openrouter-mistral' }
  }

  // Final fallback — smart template
  if (!content) {
    content = buildTemplateFallback(tool, data)
    provider = 'template'
  }

  console.log(`[generate] tool=${tool} provider=${provider}`)
  return NextResponse.json({ ok: true, content, provider })
}

// ── Prompts ────────────────────────────────────────────────────────────────
function buildPrompt(tool: string, d: Record<string, string>): string | null {
  switch (tool) {
    case 'proposal':
      return `Write a short, results-focused freelance proposal under 400 words.

Client: ${d.clientName || 'the client'} (${d.clientIndustry} industry)
Freelancer: ${d.freelancerName || 'the freelancer'}
Service: ${d.service}
Budget: ${d.budget || 'TBD'}
Timeline: ${d.timeline} weeks
Problem: ${d.problem}
Solution: ${d.solution}

Use these exact sections:
## The Situation
(1-2 sentences on what they need and why it matters)

## What I'll Deliver
(4-5 specific deliverable bullet points)

## How We'll Work
(3 phases, one line each)

## Investment
(Budget + 50/50 payment terms)

## Reference Work
(List 2-3 real well-known websites that are excellent examples of ${d.service} for ${d.clientIndustry}. Format: **Site Name** — domain.com — one sentence why it's relevant)

## Next Step
(One clear call to action)

Sign off: ${d.freelancerName || 'Your Name'}`

    case 'scope':
      return `Write a clear, scope-creep-preventing scope of work document.

Project: ${d.service}
Client: ${d.clientName || 'the client'}
Provider: ${d.freelancerName || 'the provider'}
Budget: ${d.budget || 'TBD'}
Timeline: ${d.timeline} weeks
Deliverables: ${d.deliverables}
Out of scope: ${d.outOfScope || 'none specified'}

## Project Overview
(2 sentences max)

## Deliverables
(Numbered list, very specific)

## What's NOT Included
(6-8 commonly assumed items explicitly excluded)

## Timeline
(Phases with week numbers)

## Revision Policy
(Max revisions included, how extras are billed)

## Acceptance Criteria
(How client signs off on completion)`

    case 'discovery':
      return `Write a practical discovery call script.

Service: ${d.service}
Client industry: ${d.industry}
Duration: ${d.duration} minutes
Goals: ${d.goals || 'qualify client and close project'}

## Opening (2 min)
(Warm intro, set agenda — exact words)

## Understand Their World (${Math.floor(parseInt(d.duration) * 0.3)} min)
(5 specific questions with follow-up prompts)

## Uncover Budget & Urgency (${Math.floor(parseInt(d.duration) * 0.25)} min)
(4 questions on budget, timeline, decision-making)

## Present Your Approach (${Math.floor(parseInt(d.duration) * 0.25)} min)
(How to pitch process without over-explaining)

## Close & Next Steps (${Math.floor(parseInt(d.duration) * 0.15)} min)
(Exact words to advance to proposal or next meeting)

## Red Flags to Watch
(3-4 warning signs this client may be trouble)`

    case 'questionnaire':
      return `Write a smart client onboarding questionnaire.

Service: ${d.service}
Client type: ${d.clientType}
Project notes: ${d.projectType || 'standard project'}

Generate 12-15 focused questions in sections:

## Business & Goals
## Project Specifics
## Design & Brand Preferences
## Technical Requirements
## Timeline & Budget
## Decision Making & Approval

For each question, add a brief italic note on why you're asking it.`

    default:
      return null
  }
}

// ── Template fallback (no AI needed) ───────────────────────────────────────
function buildTemplateFallback(tool: string, d: Record<string, string>): string {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  if (tool === 'proposal') {
    return `## The Situation
${d.clientName || 'Your business'} needs ${d.service} to ${d.problem || 'achieve key business goals'} in the ${d.clientIndustry} space.

## What I'll Deliver
- Complete ${d.service} strategy and execution
- ${d.timeline}-week delivery with clear milestones
- 2 revision rounds included
- Final handover with full documentation
- 14-day post-project support

## How We'll Work
- **Week 1:** Discovery, research, and strategic brief
- **Weeks 2–${Math.max(2, parseInt(d.timeline || '4') - 1)}:** Core delivery with regular check-ins
- **Final week:** Review, revisions, and handover

## Investment
**Project fee:** ${d.budget || 'To be confirmed'}
- 50% deposit on contract signing
- 50% on project completion

## Reference Work
See examples of excellent ${d.service} work for ${d.clientIndustry} businesses to align on direction before we begin.

## Next Step
Reply to confirm you'd like to proceed and I'll send the contract within 24 hours.

*${d.freelancerName || 'Your Name'}* · ${today}`
  }

  return `## Overview
Professional ${d.service || 'service'} document generated for ${d.clientName || 'client'}.

*AI generation temporarily unavailable — please try again in a moment.*`
}

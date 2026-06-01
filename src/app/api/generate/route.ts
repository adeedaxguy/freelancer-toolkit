import { NextRequest, NextResponse } from 'next/server'

const XAI_API_KEY = process.env.XAI_API_KEY
const XAI_BASE_URL = 'https://api.x.ai/v1'
const MODEL = 'grok-2-1212' // latest stable Grok-2 model

export async function POST(req: NextRequest) {
  if (!XAI_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 })
  }

  const { tool, data } = await req.json()

  const prompt = buildPrompt(tool, data)
  if (!prompt) {
    return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
  }

  try {
    const res = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert freelance business consultant. You write concise, professional, results-focused documents for freelancers and agencies.

Rules:
- Be direct and results-oriented. No fluff.
- Use specific numbers and outcomes where possible
- Keep proposals under 400 words total
- Format output as clean markdown with ## headers
- Never use generic filler phrases like "I am pleased to submit"`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      console.error('[xAI error]', JSON.stringify(json))
      return NextResponse.json({ error: json.error?.message ?? json.error ?? JSON.stringify(json) }, { status: res.status })
    }

    const content = json.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ ok: true, content })
  } catch (err) {
    console.error('[generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

function buildPrompt(tool: string, d: Record<string, string>): string | null {
  switch (tool) {
    case 'proposal':
      return `Write a short, results-focused freelance proposal. Keep it under 400 words. Be specific and professional.

Client: ${d.clientName || 'the client'} (${d.clientIndustry} industry)
Freelancer: ${d.freelancerName || 'the freelancer'}
Service: ${d.service}
Budget: ${d.budget || 'TBD'}
Timeline: ${d.timeline} weeks
Problem: ${d.problem}
Solution: ${d.solution}

Structure with these sections:
## The Situation
(1-2 sentences on what they need and why it matters)

## What I'll Deliver
(3-5 bullet points of specific outcomes/deliverables)

## How We'll Work
(3 phases, one line each)

## Investment
(Budget + 50/50 payment terms)

## Reference Work
(List 2-3 real, well-known example websites that are excellent examples of ${d.service} for the ${d.clientIndustry} industry. Format as: **Site Name** — url — one line why it's relevant)

## Next Step
(One clear call to action sentence)

Sign off with: ${d.freelancerName || 'the freelancer'}`

    case 'scope':
      return `Write a tight, clear scope of work document. Prevent scope creep. Be specific.

Project: ${d.projectName || d.service}
Client: ${d.clientName || 'the client'}
Service: ${d.service}
Budget: ${d.budget || 'TBD'}
Timeline: ${d.timeline} weeks
Deliverables: ${d.deliverables}
Out of scope notes: ${d.outOfScope || 'none provided'}

Structure:
## Project Overview
(2 sentences max)

## Deliverables
(Numbered list, very specific — what exactly will be handed over)

## What's NOT Included
(5-7 bullet points of common add-ons that are explicitly excluded)

## Timeline
(Phases with week numbers)

## Revision Policy
(Max revisions, how extras are billed)

## Acceptance Criteria
(How client signs off on completion)`

    case 'discovery':
      return `Write a discovery call script for a freelancer. Make it conversational but strategic.

Service: ${d.service}
Client industry: ${d.industry || 'general'}
Call duration: ${d.duration || '30'} minutes
Freelancer goals: ${d.goals || 'qualify the client and close the project'}

Structure:
## Opening (2 min)
(Warm intro script, set agenda)

## Understand Their World (8 min)
(5 specific questions to ask, with follow-up prompts)

## Dig Into the Problem (8 min)
(4 questions to uncover budget, urgency, decision-making)

## Present Your Approach (7 min)
(How to briefly pitch your process without pitching everything)

## Close & Next Steps (5 min)
(Exact words to use to move to proposal or next meeting)

## Red Flag Signals
(3-4 signs this client may be trouble)`

    case 'questionnaire':
      return `Write a client onboarding questionnaire for a freelancer. Questions should be smart and time-saving.

Service: ${d.service}
Client type: ${d.clientType || 'general business'}
Project type: ${d.projectType || 'standard project'}

Generate 12-15 focused questions organized into sections:

## Business & Goals
(3-4 questions)

## Project Specifics
(4-5 questions)

## Design & Brand Preferences
(2-3 questions — only if relevant to ${d.service})

## Technical Requirements
(2-3 questions)

## Timeline & Budget
(2 questions)

## Decision Making
(1-2 questions about who approves work and signs off)

For each question, add a brief note in italics explaining why you're asking it.`

    default:
      return null
  }
}

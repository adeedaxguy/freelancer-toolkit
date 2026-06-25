import { ALL_TOOLS, type ToolMeta } from './tools'

export type KeywordFunnelStage = 'problem-aware' | 'comparison' | 'conversion' | 'retention'

export interface KeywordIdea {
  keyword: string
  stage: KeywordFunnelStage
  contentAngle: string
  toolSlug: string
  toolTitle: string
  toolUrl: string
}

export interface ToolKeywordFunnel {
  toolSlug: string
  toolTitle: string
  toolUrl: string
  category: string
  keywordCount: number
  keywords: KeywordIdea[]
}

interface KeywordPattern {
  stage: KeywordFunnelStage
  template: string
  contentAngle: string
}

export const KEYWORD_FUNNEL_PATTERNS: KeywordPattern[] = [
  { stage: 'conversion', template: '{keyword}', contentAngle: 'Exact-match tool landing page query' },
  { stage: 'conversion', template: 'free {keyword}', contentAngle: 'Free alternative to paid or gated tools' },
  { stage: 'conversion', template: '{keyword} online', contentAngle: 'Browser-based use case' },
  { stage: 'conversion', template: '{keyword} no signup', contentAngle: 'No account or email gate' },
  { stage: 'conversion', template: '{keyword} no watermark', contentAngle: 'Clean export and download intent' },
  { stage: 'conversion', template: '{keyword} download', contentAngle: 'Download-ready output intent' },
  { stage: 'conversion', template: '{keyword} for free', contentAngle: 'High-intent free tool query' },
  { stage: 'conversion', template: '{keyword} on mobile', contentAngle: 'Mobile and application portal use case' },
  { stage: 'conversion', template: '{keyword} in browser', contentAngle: 'Private local processing angle' },
  { stage: 'comparison', template: 'best free {keyword}', contentAngle: 'Best-tool comparison query' },
  { stage: 'comparison', template: '{keyword} alternative', contentAngle: 'Alternative to paid software' },
  { stage: 'comparison', template: '{keyword} vs paid app', contentAngle: 'Free versus paid workflow comparison' },
  { stage: 'comparison', template: '{keyword} without app', contentAngle: 'No install workflow' },
  { stage: 'comparison', template: '{keyword} without account', contentAngle: 'No-login workflow' },
  { stage: 'comparison', template: '{keyword} private', contentAngle: 'Privacy and local processing concerns' },
  { stage: 'problem-aware', template: 'how to {action}', contentAngle: 'Step-by-step educational guide' },
  { stage: 'problem-aware', template: 'how to {action} for free', contentAngle: 'Free workflow tutorial' },
  { stage: 'problem-aware', template: '{keyword} guide', contentAngle: 'Long-form guide for searchers still learning' },
  { stage: 'problem-aware', template: '{keyword} checklist', contentAngle: 'Pre-submit checklist or process article' },
  { stage: 'problem-aware', template: '{keyword} requirements', contentAngle: 'Rules, limits, and submission requirements' },
  { stage: 'problem-aware', template: '{keyword} mistakes', contentAngle: 'Common rejection or pricing mistake article' },
  { stage: 'problem-aware', template: '{keyword} file size limit', contentAngle: 'Upload-limit troubleshooting' },
  { stage: 'retention', template: '{keyword} template', contentAngle: 'Reusable template or saved workflow' },
  { stage: 'retention', template: '{keyword} example', contentAngle: 'Example-led article with tool CTA' },
  { stage: 'retention', template: '{keyword} for freelancers', contentAngle: 'Freelancer-specific workflow angle' },
]

export const KEYWORD_IDEAS_PER_TOOL = KEYWORD_FUNNEL_PATTERNS.length

function cleanKeyword(value: string): string {
  return value
    .toLowerCase()
    .replace(/^free\s+/, '')
    .replace(/\s+online$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function primaryKeyword(tool: ToolMeta): string {
  return cleanKeyword(tool.keywords[0] ?? tool.title)
}

function actionPhrase(tool: ToolMeta): string {
  const keyword = primaryKeyword(tool)
  const title = tool.title.toLowerCase()

  if (title.includes('calculator')) {
    return `calculate ${keyword.replace(/\bcalculator\b/g, '').trim()}`
  }

  if (title.includes('converter')) {
    return keyword.replace(/\bconverter\b/g, '').replace(/\bto\b/g, 'to').trim()
  }

  if (title.includes('resizer') || title.includes('resize')) {
    return keyword
  }

  if (title.includes('photo maker') || title.includes('photo generator')) {
    return `make a ${keyword.replace(/\bmaker\b|\bgenerator\b/g, '').trim()}`
  }

  if (title.includes('generator')) {
    return `generate a ${keyword.replace(/\bgenerator\b/g, '').trim()}`
  }

  return `use a ${keyword}`
}

function fillPattern(pattern: KeywordPattern, tool: ToolMeta): KeywordIdea {
  const keyword = primaryKeyword(tool)
  const action = actionPhrase(tool)
  return {
    keyword: pattern.template.replace('{keyword}', keyword).replace('{action}', action).replace(/\s+/g, ' ').trim(),
    stage: pattern.stage,
    contentAngle: pattern.contentAngle,
    toolSlug: tool.slug,
    toolTitle: tool.title,
    toolUrl: `/tools/${tool.slug}`,
  }
}

export function getKeywordFunnelForTool(tool: ToolMeta): ToolKeywordFunnel {
  const keywords = KEYWORD_FUNNEL_PATTERNS.map((pattern) => fillPattern(pattern, tool))

  return {
    toolSlug: tool.slug,
    toolTitle: tool.title,
    toolUrl: `/tools/${tool.slug}`,
    category: tool.category,
    keywordCount: keywords.length,
    keywords,
  }
}

export const TOOL_KEYWORD_FUNNELS: ToolKeywordFunnel[] = ALL_TOOLS.map(getKeywordFunnelForTool)

export const TOTAL_KEYWORD_IDEAS = TOOL_KEYWORD_FUNNELS.reduce((sum, funnel) => sum + funnel.keywordCount, 0)

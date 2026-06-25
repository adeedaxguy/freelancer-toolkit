import Link from 'next/link'
import type { ToolMeta } from '@/lib/tools'
import { getKeywordFunnelForTool } from '@/lib/keywordFunnel'
import { getCategoryUrlForTool } from '@/lib/categoryPages'

interface ToolSeoContentProps {
  tool: ToolMeta
  variantLabel?: string
}

function sentenceList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function getActionVerb(tool: ToolMeta): string {
  const title = tool.title.toLowerCase()
  if (title.includes('calculator')) return 'calculate'
  if (title.includes('converter')) return 'convert'
  if (title.includes('resizer') || title.includes('resize')) return 'resize'
  if (title.includes('photo')) return 'create'
  if (title.includes('generator')) return 'generate'
  if (title.includes('timer')) return 'run'
  return 'use'
}

export default function ToolSeoContent({ tool, variantLabel }: ToolSeoContentProps) {
  const funnel = getKeywordFunnelForTool(tool)
  const conversionKeywords = funnel.keywords.filter((idea) => idea.stage === 'conversion').slice(0, 4)
  const problemKeywords = funnel.keywords.filter((idea) => idea.stage === 'problem-aware').slice(0, 3)
  const comparisonKeywords = funnel.keywords.filter((idea) => idea.stage === 'comparison').slice(0, 3)
  const actionVerb = getActionVerb(tool)
  const primaryKeyword = tool.keywords[0] ?? tool.title.toLowerCase()
  const supportingKeywords = sentenceList(tool.keywords.slice(1, 4))
  const categoryUrl = getCategoryUrlForTool(tool)
  const categoryLabel = tool.category.toLowerCase().endsWith('tools') ? tool.category.toLowerCase() : `${tool.category.toLowerCase()} tools`

  return (
    <section className="mt-12 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Tool guide</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {variantLabel ? `${tool.title} ${variantLabel}: free online workflow` : `${tool.title}: free online workflow`}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">
            <p>
              The {tool.title} is built for people searching for <strong className="font-semibold text-gray-900">{primaryKeyword}</strong>
              {supportingKeywords ? `, ${supportingKeywords},` : ''} and a fast way to {actionVerb} the result without a paid download step.
              It keeps the calculator, generator, or file workflow on the same page as the explanation, so the searcher can read the guidance and use the tool immediately.
            </p>
            <p>
              Use it when you need a practical answer, export, document, or formatted file quickly. The page is designed as a focused landing page for {tool.category.toLowerCase()} searches:
              clear instructions first, the working tool above, FAQs below, and internal links to related tools when the next step belongs somewhere else.
            </p>
            <p>
              For broader workflows, browse the <Link href={categoryUrl} className="font-medium text-brand-600 hover:underline">{tool.category}</Link> category.
              That page groups the related tools together so users can move from research to action without returning to search results.
            </p>
          </div>
        </div>

        <aside className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Search intents covered</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ready to use</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {conversionKeywords.map((idea) => (
                  <span key={idea.keyword} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">{idea.keyword}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">How-to research</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {problemKeywords.map((idea) => (
                  <span key={idea.keyword} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">{idea.keyword}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Free alternative</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {comparisonKeywords.map((idea) => (
                  <span key={idea.keyword} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">{idea.keyword}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'What it helps with',
            body: tool.description,
          },
          {
            title: 'Why it can rank',
            body: `The page targets specific ${tool.category.toLowerCase()} intent instead of sending every query to the homepage.`,
          },
          {
            title: 'Best next step',
            body: `Use the tool, then compare related ${categoryLabel} from the category page if your workflow needs another step.`,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

import { getAllPosts } from '@/lib/blog'
import { KEYWORD_IDEAS_PER_TOOL, TOOL_KEYWORD_FUNNELS, TOTAL_KEYWORD_IDEAS } from '@/lib/keywordFunnel'
import { ALL_TOOLS } from '@/lib/tools'

export const dynamic = 'force-dynamic'

const SITE = 'https://freeltools.com'

interface SeoRow {
  url: string
  title: string
  description: string
  type: 'tool' | 'blog' | 'page'
  issues: string[]
}

function checkRow(row: Omit<SeoRow, 'issues'>): SeoRow {
  const issues: string[] = []
  if (!row.title) issues.push('Missing title')
  else if (row.title.length < 30) issues.push(`Title too short (${row.title.length} chars, aim for 50–60)`)
  else if (row.title.length > 65) issues.push(`Title too long (${row.title.length} chars, keep ≤65)`)

  if (!row.description) issues.push('Missing meta description')
  else if (row.description.length < 80) issues.push(`Description short (${row.description.length} chars, aim for 120–160)`)
  else if (row.description.length > 165) issues.push(`Description too long (${row.description.length} chars)`)

  return { ...row, issues }
}

export default function SeoAuditPage() {
  // Build rows for all tools
  const toolRows: SeoRow[] = ALL_TOOLS.map((tool) =>
    checkRow({
      url: `/tools/${tool.slug}`,
      title: `${tool.title} | FreelancerToolkit`,
      description: tool.description,
      type: 'tool',
    })
  )

  // Static pages
  const staticRows: SeoRow[] = [
    checkRow({
      url: '/',
      title: `FreelancerToolkit - ${ALL_TOOLS.length} Free Tools for Freelancers & Agencies`,
      description: 'Free calculators and generators for freelancers, agencies, and consultants. Calculate your rate, quote projects, generate proposals, create invoices, and more. No login required.',
      type: 'page',
    }),
    checkRow({
      url: '/blog',
      title: 'Blog – Freelancing Tips, Guides & Resources | FreelancerToolkit',
      description: 'Free guides and tips for freelancers, agencies, and consultants. Learn how to set rates, win proposals, manage clients, and grow your business.',
      type: 'page',
    }),
  ]

  // Blog posts
  const posts = getAllPosts(true)
  const blogRows: SeoRow[] = posts.map((post) =>
    checkRow({
      url: `/blog/${post.slug}`,
      title: `${post.title} | FreelancerToolkit`,
      description: post.description,
      type: 'blog',
    })
  )

  const allRows = [...staticRows, ...toolRows, ...blogRows]
  const passing = allRows.filter((r) => r.issues.length === 0)
  const failing = allRows.filter((r) => r.issues.length > 0)
  const topKeywordFunnels = TOOL_KEYWORD_FUNNELS.slice(0, 10)

  const score = Math.round((passing.length / allRows.length) * 100)

  const TYPE_COLORS: Record<string, string> = {
    tool: 'bg-brand-50 text-brand-700',
    blog: 'bg-purple-50 text-purple-700',
    page: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Audit</h1>
        <p className="mt-1 text-sm text-gray-500">Title and description check across all {allRows.length} pages</p>
      </div>

      {/* Score */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">SEO Score</p>
          <p className={`mt-2 text-4xl font-bold ${score >= 90 ? 'text-green-600' : score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
            {score}%
          </p>
          <p className="mt-1 text-xs text-gray-400">{passing.length}/{allRows.length} pages passing</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Issues Found</p>
          <p className="mt-2 text-4xl font-bold text-gray-900">{failing.length}</p>
          <p className="mt-1 text-xs text-gray-400">pages need attention</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Pages</p>
          <p className="mt-2 text-4xl font-bold text-gray-900">{allRows.length}</p>
          <p className="mt-1 text-xs text-gray-400">{toolRows.length} tools · {blogRows.length} posts · {staticRows.length} pages</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Keyword Ideas</p>
          <p className="mt-2 text-4xl font-bold text-gray-900">{TOTAL_KEYWORD_IDEAS.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">{TOOL_KEYWORD_FUNNELS.length} tools · {KEYWORD_IDEAS_PER_TOOL} ideas/tool</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">Keyword Funnel Seeds</p>
          <p className="mt-1 text-xs text-gray-400">Each tool has problem-aware, comparison, conversion, and retention keyword ideas for future content.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                <th className="px-4 py-3 text-left">Tool</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left">Sample keywords</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topKeywordFunnels.map((funnel) => (
                <tr key={funnel.toolSlug} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a href={`${SITE}${funnel.toolUrl}`} target="_blank" className="text-xs font-semibold text-gray-800 hover:text-brand-600 hover:underline">
                      {funnel.toolTitle}
                    </a>
                    <p className="mt-1 text-xs text-gray-400">{funnel.keywordCount} ideas</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{funnel.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {funnel.keywords.slice(0, 3).map((idea) => (
                        <span key={idea.keyword} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{idea.keyword}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues section */}
      {failing.length > 0 && (
        <div className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-700">⚠ {failing.length} pages with issues</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                <th className="px-4 py-3 text-left">URL</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-left">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {failing.map((row) => (
                <tr key={row.url} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    <a href={`${SITE}${row.url}`} target="_blank" className="hover:text-brand-600 hover:underline">{row.url}</a>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[row.type]}`}>{row.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5">
                      {row.issues.map((issue) => (
                        <li key={issue} className="text-xs text-red-600">• {issue}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All pages table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">All Pages</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                <th className="px-4 py-3 text-left">URL</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Title length</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Desc length</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allRows.map((row) => (
                <tr key={row.url} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[row.type]}`}>{row.type}</span>
                      <span className="font-mono text-xs text-gray-700 truncate max-w-[180px]">{row.url}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">
                    <span className={row.title.length >= 30 && row.title.length <= 65 ? 'text-green-600' : 'text-yellow-600'}>
                      {row.title.length} chars
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs hidden lg:table-cell">
                    <span className={row.description.length >= 80 && row.description.length <= 165 ? 'text-green-600' : 'text-yellow-600'}>
                      {row.description.length} chars
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.issues.length === 0 ? (
                      <span className="text-xs text-green-600 font-medium">✓ Pass</span>
                    ) : (
                      <span className="text-xs text-red-500 font-medium">✗ {row.issues.length} issue{row.issues.length > 1 ? 's' : ''}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Technical SEO Checklist</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: 'Sitemap at /sitemap.xml', ok: true },
            { label: 'robots.txt at /robots.txt', ok: true },
            { label: 'Canonical URLs on all pages', ok: true },
            { label: 'Open Graph meta tags', ok: true },
            { label: 'Twitter card meta tags', ok: true },
            { label: 'JSON-LD structured data', ok: true },
            { label: 'Mobile responsive', ok: true },
            { label: 'Page speed (no blocking JS)', ok: true },
            { label: 'Blog with Article schema', ok: blogRows.length > 0 },
            { label: 'Internal linking (tools ↔ blog)', ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span className={item.ok ? 'text-green-500' : 'text-gray-300'}>
                {item.ok ? '✓' : '○'}
              </span>
              <span className={item.ok ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

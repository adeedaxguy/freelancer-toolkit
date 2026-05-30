'use client'

import { useState, useEffect } from 'react'

interface PageViews {
  [path: string]: number
}

export default function TrafficPage() {
  const [data, setData] = useState<PageViews>({})
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<'views' | 'path'>('views')

  useEffect(() => {
    fetch('/api/pageview')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const rows = Object.entries(data)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => sort === 'views' ? b.views - a.views : a.path.localeCompare(b.path))

  const totalViews = rows.reduce((sum, r) => sum + r.views, 0)
  const topPage = rows[0]

  // Group by section
  const toolViews = rows.filter((r) => r.path.startsWith('/tools/')).reduce((s, r) => s + r.views, 0)
  const blogViews = rows.filter((r) => r.path.startsWith('/blog/')).reduce((s, r) => s + r.views, 0)
  const homeViews = rows.find((r) => r.path === '/')?.views ?? 0

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Traffic</h1>
        <p className="mt-1 text-sm text-gray-500">Page views tracked in-app — no third-party analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Views', value: totalViews.toLocaleString() },
          { label: 'Unique Pages', value: rows.length },
          { label: 'Tool Views', value: toolViews.toLocaleString() },
          { label: 'Blog Views', value: blogViews.toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {topPage && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-5 py-4 text-sm">
          <span className="font-semibold text-brand-700">Top page:</span>{' '}
          <span className="font-mono text-brand-700">{topPage.path}</span>{' '}
          <span className="text-brand-500">— {topPage.views.toLocaleString()} views</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">Loading traffic data…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="text-2xl mb-2">📊</p>
          <p className="font-semibold text-gray-700">No data yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Page views are tracked automatically as visitors browse your site.
            Traffic will appear here once the dev server restarts with the new tracking code.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-700">{rows.length} pages tracked</p>
            <div className="flex gap-1">
              {(['views', 'path'] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                    sort === s ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}>
                  Sort by {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                  <th className="px-4 py-3 text-left">Page</th>
                  <th className="px-4 py-3 text-right">Views</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">Share</th>
                  <th className="px-4 py-3 hidden md:table-cell w-48">Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(({ path, views }) => {
                  const pct = totalViews > 0 ? (views / totalViews) * 100 : 0
                  return (
                    <tr key={path} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{path}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{views.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">{pct.toFixed(1)}%</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="h-1.5 w-full rounded-full bg-gray-100">
                          <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

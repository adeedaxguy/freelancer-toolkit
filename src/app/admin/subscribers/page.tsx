'use client'

import { useState, useEffect } from 'react'

interface Subscriber {
  id: number
  first_name: string | null
  email_address: string
  state: string
  created_at: string
}

interface SubData {
  subscribers: Subscriber[]
  total: number
  error?: string
  apiKey?: string | null
}

export default function SubscribersPage() {
  const [data, setData] = useState<SubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = (data?.subscribers ?? []).filter((s) =>
    s.email_address.toLowerCase().includes(search.toLowerCase()) ||
    (s.first_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">Live data from your ConvertKit account</p>
        </div>
        {data?.total != null && (
          <div className="rounded-xl border border-brand-100 bg-brand-50 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-brand-700">{data.total.toLocaleString()}</p>
            <p className="text-xs text-brand-500">Total subscribers</p>
          </div>
        )}
      </div>

      {/* No API key warning */}
      {!loading && data?.error?.includes('CONVERTKIT_API_SECRET not set') && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <strong>ConvertKit not connected.</strong> Add <code className="bg-yellow-100 px-1 rounded">CONVERTKIT_API_SECRET</code> to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
          <br />
          <a href="https://app.convertkit.com/account_settings/advanced_settings" target="_blank" className="underline mt-1 inline-block">Get your API secret →</a>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">Loading subscribers…</div>
      ) : data?.error && data?.subscribers.length === 0 ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{data.error}</div>
      ) : (
        <>
          {/* Search */}
          <div className="flex items-center gap-3">
            <input
              className="input-field max-w-xs text-sm"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-sm text-gray-400">{filtered.length} shown</span>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">No subscribers found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Name</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{sub.email_address}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                          {sub.first_name ?? <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            sub.state === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {sub.state}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                          {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {data?.apiKey && (
            <p className="text-xs text-gray-400">Connected with API key <code className="bg-gray-100 px-1 rounded">{data.apiKey}</code></p>
          )}
        </>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/blog'

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-50 text-green-700',
  scheduled: 'bg-blue-50 text-blue-700',
  draft: 'bg-gray-100 text-gray-500',
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all')
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  async function triggerPublish() {
    setPublishing(true)
    setPublishMsg('')
    const res = await fetch('/api/admin/publish-scheduled', { method: 'POST' })
    const data = await res.json()
    setPublishMsg(data.message)
    setPublishing(false)
    // Refresh list
    const updated = await fetch('/api/admin/blog').then((r) => r.json())
    setPosts(updated)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} total posts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={triggerPublish}
            disabled={publishing}
            className="btn-secondary text-sm px-3 py-2"
          >
            {publishing ? '…' : '⏱ Publish Scheduled'}
          </button>
          <Link href="/admin/blog/new" className="btn-primary text-sm px-4 py-2">
            + New Post
          </Link>
        </div>
      </div>

      {publishMsg && (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{publishMsg}</div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-100 bg-white p-1 shadow-sm w-fit">
        {(['all', 'published', 'scheduled', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === f ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">Loading posts…</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            No {filter === 'all' ? '' : filter} posts yet.{' '}
            <Link href="/admin/blog/new" className="text-brand-600 hover:underline">Write one now →</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Tags</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">
                    <div className="truncate">{post.title}</div>
                    <div className="text-xs text-gray-400 truncate">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[post.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell whitespace-nowrap">
                    {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/blog/${post.slug}/edit`} className="text-xs text-brand-600 hover:underline">Edit</Link>
                      {post.status === 'published' && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-gray-600">View ↗</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

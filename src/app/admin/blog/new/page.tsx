'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBlogPost() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    publishDate: today,
    tags: '',
    author: 'FreelancerToolkit',
  })

  function set(field: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/admin/blog')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
            <input
              className="input-field text-base font-semibold"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. How to Set Your Freelance Rate"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
            <input
              className="input-field"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="One-sentence summary for Google search results (max 160 chars)"
              maxLength={160}
            />
            <p className="mt-1 text-xs text-gray-400">{form.description.length}/160 chars</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Content <span className="text-gray-400 font-normal">(Markdown / MDX)</span>
            </label>
            <textarea
              className="input-field min-h-[360px] resize-y font-mono text-sm leading-relaxed"
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="## Introduction&#10;&#10;Write your post in Markdown. Use ## for headings, **bold**, *italic*, [links](/url)..."
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input
              className="input-field"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="freelancing, rates, pricing"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Author</label>
            <input
              className="input-field"
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
            />
          </div>
        </div>

        {/* Publishing options */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Publishing</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex gap-2">
              {(['draft', 'scheduled', 'published'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition ${
                    form.status === s
                      ? s === 'published' ? 'border-green-500 bg-green-50 text-green-700'
                        : s === 'scheduled' ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-400 bg-gray-100 text-gray-700'
                      : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {s === 'scheduled' ? '⏱ Scheduled' : s === 'published' ? '✓ Published' : '✎ Draft'}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {form.status === 'scheduled'
                ? 'The hourly Cowork task will auto-publish when the date below arrives.'
                : form.status === 'published'
                ? 'Post goes live immediately.'
                : 'Saved as draft — not visible on the blog.'}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {form.status === 'scheduled' ? 'Publish Date & Time' : 'Post Date'}
            </label>
            <input
              type="date"
              className="input-field"
              value={form.publishDate}
              onChange={(e) => set('publishDate', e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
            {loading ? 'Saving…' : form.status === 'published' ? 'Publish Now' : `Save as ${form.status}`}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary px-4 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditBlogPost() {
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    publishDate: '',
    tags: '',
    author: 'FreelancerToolkit',
  })

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title ?? '',
          description: data.description ?? '',
          content: data.content ?? '',
          status: data.status ?? 'draft',
          publishDate: data.publishDate ?? data.date ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          author: data.author ?? 'FreelancerToolkit',
        })
        setLoading(false)
      })
      .catch(() => { setError('Failed to load post'); setLoading(false) })
  }, [slug])

  function set(field: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [field]: val }))
    setSaved(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${form.title}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
    router.push('/admin/blog')
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-sm text-gray-400">Loading post…</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/blog')} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          {form.status === 'published' && (
            <a href={`/blog/${slug}`} target="_blank" className="text-xs text-gray-400 hover:text-brand-600">View live ↗</a>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-400 hover:text-red-600 transition"
          >
            {deleting ? 'Deleting…' : 'Delete post'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
            <input className="input-field text-base font-semibold" value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
            <input className="input-field" value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={160} />
            <p className="mt-1 text-xs text-gray-400">{form.description.length}/160 chars</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Content <span className="text-gray-400 font-normal">(Markdown / MDX)</span></label>
            <textarea
              className="input-field min-h-[400px] resize-y font-mono text-sm leading-relaxed"
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags <span className="text-gray-400 font-normal">(comma-sep)</span></label>
              <input className="input-field" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="freelancing, rates" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Author</label>
              <input className="input-field" value={form.author} onChange={(e) => set('author', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Publishing</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex gap-2">
              {(['draft', 'scheduled', 'published'] as const).map((s) => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize transition ${
                    form.status === s
                      ? s === 'published' ? 'border-green-500 bg-green-50 text-green-700'
                        : s === 'scheduled' ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-400 bg-gray-100 text-gray-700'
                      : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                  }`}>
                  {s === 'scheduled' ? '⏱ Scheduled' : s === 'published' ? '✓ Published' : '✎ Draft'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {form.status === 'scheduled' ? 'Publish Date' : 'Post Date'}
            </label>
            <input type="date" className="input-field" value={form.publishDate} onChange={(e) => set('publishDate', e.target.value)} />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">✓ Saved successfully</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.push('/admin/blog')} className="btn-secondary px-4 py-2.5">Cancel</button>
        </div>
      </form>
    </div>
  )
}

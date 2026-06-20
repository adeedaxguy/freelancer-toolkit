'use client'

import { useState } from 'react'
import Link from 'next/link'

function StatCard({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href?: string }) {
  const content = (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
  return href ? <Link href={href} className="hover:shadow-md transition-shadow block">{content}</Link> : content
}

function IndexSubmitButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ submitted?: number; results?: Record<string, unknown> } | null>(null)

  const submit = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/admin/submit-index', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setState('done')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-green-900">Submit All Pages for Indexing</p>
          <p className="mt-1 text-xs text-green-700">
            Pings IndexNow (Bing/Yandex) + Google sitemap with all {' '}
            <span className="font-semibold">tool pages, variant pages, and blog posts</span>.
            Run this after every deploy.
          </p>
        </div>
        <button
          onClick={submit}
          disabled={state === 'loading'}
          className="flex-shrink-0 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 transition"
        >
          {state === 'loading' ? 'Submitting…' : state === 'done' ? '✓ Submitted' : 'Submit Now'}
        </button>
      </div>
      {state === 'done' && result && (
        <div className="mt-3 rounded-lg bg-white border border-green-100 p-3 text-xs text-green-800">
          <strong>{result.submitted} URLs submitted.</strong>{' '}
          IndexNow: {(result.results as Record<string, {status?: number}>)?.indexNow?.status ?? '?'} ·{' '}
          Bing: {(result.results as Record<string, {status?: number}>)?.bing?.status ?? '?'} ·{' '}
          Google ping: {(result.results as Record<string, {status?: number}>)?.google?.status ?? '?'}
        </div>
      )}
      {state === 'error' && (
        <p className="mt-2 text-xs text-red-600">Something went wrong. Check the browser console.</p>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your FreelancerToolkit site</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tools Live" value={31} sub="Across 6 categories" />
        <StatCard label="Blog Posts" value="44+" sub="Published articles" href="/admin/blog" />
        <StatCard label="Indexed Pages" value="200+" sub="Static pages total" />
        <StatCard label="Avg Position" value="60.8" sub="Google Search Console" />
      </div>

      {/* Index submission — most important */}
      <IndexSubmitButton />

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/blog/new" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">✍️</span>
            <span>Write New Post</span>
          </Link>
          <Link href="/admin/subscribers" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">📧</span>
            <span>View Subscribers</span>
          </Link>
          <Link href="/admin/traffic" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">📈</span>
            <span>Traffic Report</span>
          </Link>
          <Link href="/admin/seo" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">
            <span className="text-xl">🔍</span>
            <span>SEO Audit</span>
          </Link>
        </div>
      </div>

      {/* Indexing checklist */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Post-Deploy SEO Checklist</h2>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">1.</span><span>Click <strong>Submit Now</strong> above — pings IndexNow + Google sitemap with all 200+ pages</span></li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">2.</span><span>In <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Google Search Console</a>, use URL Inspection to fast-track any specific new page</span></li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">3.</span><span>Share new tools/articles on Reddit (r/freelance), LinkedIn, and relevant communities for backlinks</span></li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">4.</span><span>Check <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">GSC Coverage report</a> 48h later to confirm pages are indexed</span></li>
        </ol>
      </div>
    </div>
  )
}

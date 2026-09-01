'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { auditHreflangReciprocity, auditSitemapCanonicals, type HreflangIssueKind, type SitemapCanonicalIssue } from '@/lib/seoAuditTools'

type ScoreItem = {
  label: string
  ok: boolean
  detail: string
}

type SeoHeading = {
  index: number
  tag: string
  level: number
  text: string
}

type SeoImage = {
  index: number
  src: string
  alt: string
  hasAltAttribute: boolean
  genericAlt: boolean
}

type SeoLink = {
  href: string
  absolute: string
  text: string
  rel: string
  internal: boolean
}

type SeoPageAnalysis = {
  requestedUrl: string
  finalUrl: string
  status: number
  title: string
  description: string
  canonical: string
  robots: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  h1: string
  h1s: string[]
  headings: SeoHeading[]
  bodyText: string
  wordCount: number
  imageCount: number
  imagesMissingAlt: number
  genericAltCount: number
  internalLinks: number
  externalLinks: number
  links: SeoLink[]
  images: SeoImage[]
}

type LinkStatusResult = {
  inputUrl: string
  url: string
  finalUrl: string
  status: number | null
  ok: boolean
  redirectCount: number
  error?: string
}

type RedirectHop = {
  url: string
  status: number | null
  location: string
  error?: string
}

type TextResourceResult = {
  requestedUrl: string
  finalUrl: string
  status: number
  contentType: string
  text: string
}

const stopWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'can',
  'for',
  'from',
  'has',
  'have',
  'how',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'our',
  'that',
  'the',
  'their',
  'this',
  'to',
  'was',
  'we',
  'with',
  'you',
  'your',
])

function getSlug(pathname: string) {
  return pathname.split('/tools/')[1]?.split('/')[0] ?? ''
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
}

function slugHost(url: string) {
  try {
    return new URL(url).host
  } catch {
    return ''
  }
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function makeSlug(value: string, separator: string, lowercase: boolean, maxLength: number) {
  const base = (lowercase ? value.toLowerCase() : value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, separator)
    .replace(new RegExp(`${separator}+`, 'g'), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '')
  return base.slice(0, Math.max(maxLength, 1)).replace(new RegExp(`${separator}$`, 'g'), '')
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function robotsPathMatches(pattern: string, testPath: string) {
  const cleanPattern = pattern.trim()
  if (!cleanPattern) return false
  if (cleanPattern === '/') return true
  const regex = new RegExp(`^${escapeRegExp(cleanPattern).replace(/\\\*/g, '.*').replace(/\\\$/g, '$')}`)
  return regex.test(testPath)
}

function csvEscape(value: string | number | boolean | null | undefined) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

function csvRows(headers: string[], rows: Array<Array<string | number | boolean | null | undefined>>) {
  return [headers.map(csvEscape).join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n')
}

function keywordCore(value: string) {
  const words = value.toLowerCase().match(/[a-z0-9]+/g) ?? []
  return words.filter((word) => word.length > 2 && !stopWords.has(word))
}

async function postSeoAnalysis<T>(payload: Record<string, unknown>) {
  const response = await fetch('/api/seo/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok || data.ok === false) {
    throw new Error(typeof data.error === 'string' ? data.error : 'SEO analysis failed')
  }
  return data as T
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {hint && <span className="mt-1 block text-xs leading-5 text-gray-400">{hint}</span>}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 7,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {hint && <span className="mt-1 block text-xs leading-5 text-gray-400">{hint}</span>}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function Stat({ label, value, detail, highlight }: { label: string; value: string; detail?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? 'border-brand-200 bg-brand-50' : 'border-gray-100 bg-white'}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? 'text-brand-700' : 'text-gray-900'}`}>{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-gray-500">{detail}</p>}
    </div>
  )
}

function CopyBox({ label, value, downloadName }: { label: string; value: string; downloadName?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const download = () => {
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = downloadName ?? `${makeSlug(label, '-', true, 80) || 'seo-output'}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-950 p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={download}
            className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            Download
          </button>
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 transition hover:bg-brand-100 active:scale-[0.96]"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <textarea
        readOnly
        value={value}
        rows={12}
        className="w-full rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-xs leading-5 text-gray-100 outline-none"
      />
    </div>
  )
}

function ScoreList({ items }: { items: ScoreItem[] }) {
  const passed = items.filter((item) => item.ok).length
  const score = Math.round((passed / items.length) * 100)

  return (
    <div className="space-y-4">
      <Stat label="SEO score" value={`${score}%`} detail={`${passed} of ${items.length} checks passed`} highlight />
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.ok ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>
              {item.ok ? '✓' : '!'}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OnPageSeoAuditTool() {
  const slug = getSlug(usePathname())
  const defaults =
    slug === 'on-page-seo-checker'
      ? {
          pageUrl: 'https://example.com/blog/on-page-seo-checklist',
          targetKeyword: 'on page seo checker',
          title: 'On Page SEO Checker for Blog Posts',
          description: 'Check whether a page has the right title, meta description, H1, canonical, content depth, links, and image alt text before publishing.',
          h1: 'On Page SEO Checker',
          canonical: 'https://example.com/blog/on-page-seo-checklist',
          content:
            'Use this on-page SEO checker before publishing a blog post, landing page, service page, or tool page. Paste the page copy or HTML to review title length, meta description clarity, H1 alignment, canonical tags, content depth, internal links, external citations, and image alt text.',
        }
      : {
          pageUrl: 'https://example.com/services/seo-audit',
          targetKeyword: 'seo audit',
          title: 'SEO Audit Services for Small Businesses',
          description: 'Get a practical SEO audit that finds technical issues, content gaps, and quick wins for your small business website.',
          h1: 'SEO Audit Services',
          canonical: 'https://example.com/services/seo-audit',
          content:
            'Paste page copy or HTML to estimate word count, keyword usage, internal links, external links, image alt text, and the basic on-page SEO checks that often decide whether a page is ready to publish.',
        }

  const [pageUrl, setPageUrl] = useState(defaults.pageUrl)
  const [targetKeyword, setTargetKeyword] = useState(defaults.targetKeyword)
  const [html, setHtml] = useState('')
  const [title, setTitle] = useState(defaults.title)
  const [description, setDescription] = useState(defaults.description)
  const [h1, setH1] = useState(defaults.h1)
  const [canonical, setCanonical] = useState(defaults.canonical)
  const [content, setContent] = useState(defaults.content)
  const [imageCount, setImageCount] = useState('4')
  const [imagesMissingAlt, setImagesMissingAlt] = useState('1')
  const [internalLinks, setInternalLinks] = useState('3')
  const [externalLinks, setExternalLinks] = useState('1')
  const [fetchingPage, setFetchingPage] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [livePage, setLivePage] = useState<SeoPageAnalysis | null>(null)

  const parseHtml = () => {
    if (!html.trim()) return
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const extractedTitle = doc.querySelector('title')?.textContent?.trim()
    const extractedDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()
    const extractedCanonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim()
    const h1s = Array.from(doc.querySelectorAll('h1')).map((node) => node.textContent?.trim()).filter(Boolean)
    const bodyText = doc.body?.textContent?.replace(/\s+/g, ' ').trim()
    const images = Array.from(doc.querySelectorAll('img'))
    const links = Array.from(doc.querySelectorAll('a[href]'))
    const host = slugHost(pageUrl)

    if (extractedTitle) setTitle(extractedTitle)
    if (extractedDescription) setDescription(extractedDescription)
    if (extractedCanonical) setCanonical(extractedCanonical)
    if (h1s.length > 0) setH1(h1s.join(' | '))
    if (bodyText) setContent(bodyText.slice(0, 20000))
    setImageCount(String(images.length))
    setImagesMissingAlt(String(images.filter((image) => !image.getAttribute('alt')?.trim()).length))
    setInternalLinks(
      String(
        links.filter((link) => {
          const href = link.getAttribute('href') ?? ''
          if (href.startsWith('/') || href.startsWith('#')) return true
          const linkHost = slugHost(href)
          return Boolean(host && linkHost === host)
        }).length
      )
    )
    setExternalLinks(
      String(
        links.filter((link) => {
          const href = link.getAttribute('href') ?? ''
          const linkHost = slugHost(href)
          return Boolean(linkHost && linkHost !== host)
        }).length
      )
    )
  }

  const fetchLivePage = async () => {
    setFetchingPage(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: SeoPageAnalysis }>({ mode: 'page', url: pageUrl })
      const result = data.result
      setLivePage(result)
      setTitle(result.title || title)
      setDescription(result.description || description)
      setCanonical(result.canonical || result.finalUrl || canonical)
      setH1(result.h1 || h1)
      setContent(result.bodyText || content)
      setImageCount(String(result.imageCount))
      setImagesMissingAlt(String(result.imagesMissingAlt))
      setInternalLinks(String(result.internalLinks))
      setExternalLinks(String(result.externalLinks))
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch the page')
    } finally {
      setFetchingPage(false)
    }
  }

  const audit = useMemo(() => {
    const words = countWords(content)
    const keyword = targetKeyword.trim().toLowerCase()
    const keywordInTitle = keyword ? title.toLowerCase().includes(keyword) : false
    const keywordInH1 = keyword ? h1.toLowerCase().includes(keyword) : false
    const keywordInDescription = keyword ? description.toLowerCase().includes(keyword) : false
    const firstScreen = content.slice(0, 900)
    const firstScreenLower = firstScreen.toLowerCase()
    const hasActionNearTop = /\b(use|try|enter|paste|upload|calculate|generate|check|download|copy|run|preview|audit)\b/i.test(firstScreen)
    const hasExtractableAnswer = keyword
      ? firstScreenLower.includes(keyword) && /\b(is|helps|checks|shows|calculates|generates|use this|this tool)\b/i.test(firstScreen)
      : firstScreen.trim().length > 120
    const hasSchemaSignal = /application\/ld\+json|schema\.org|FAQPage|SoftwareApplication|Article|BreadcrumbList/i.test(html)
    const ogTitle = livePage?.ogTitle || (html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ?? '')
    const ogDescription = livePage?.ogDescription || (html.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] ?? '')
    const ogImage = livePage?.ogImage || (html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ?? '')
    const missingAlt = Number(imagesMissingAlt) || 0
    const totalImages = Number(imageCount) || 0
    const internal = Number(internalLinks) || 0
    const external = Number(externalLinks) || 0
    const h1Count = h1.split('|').map((item) => item.trim()).filter(Boolean).length

    const items: ScoreItem[] = [
      ...(livePage ? [{ label: 'Live URL responded', ok: livePage.status >= 200 && livePage.status < 400, detail: `${livePage.status} response from ${livePage.finalUrl}` }] : []),
      { label: 'Title length', ok: title.length >= 35 && title.length <= 62, detail: `${title.length} characters. Aim for roughly 35-62 characters.` },
      { label: 'Meta description length', ok: description.length >= 110 && description.length <= 160, detail: `${description.length} characters. Aim for a useful 110-160 character summary.` },
      { label: 'Primary keyword placement', ok: keywordInTitle && keywordInH1 && keywordInDescription, detail: keyword ? `Keyword appears in title: ${keywordInTitle ? 'yes' : 'no'}, H1: ${keywordInH1 ? 'yes' : 'no'}, description: ${keywordInDescription ? 'yes' : 'no'}.` : 'Add a target keyword to check placement.' },
      { label: 'One clear H1', ok: h1Count === 1, detail: `${h1Count} H1 found. Most pages should have one primary H1.` },
      { label: 'Canonical URL', ok: canonical.startsWith('http'), detail: canonical ? `Canonical: ${canonical}` : 'Add a canonical URL.' },
      { label: 'Readable content depth', ok: words >= 600, detail: `${words} words found. Important SEO pages usually need enough original content to answer the query.` },
      { label: 'Image alt text', ok: totalImages === 0 || missingAlt === 0, detail: `${missingAlt} of ${totalImages} images missing alt text.` },
      { label: 'Internal links', ok: internal >= 3, detail: `${internal} internal links found. Add relevant links to tools, categories, and guides.` },
      { label: 'External citations', ok: external >= 1, detail: `${external} external links found. Use credible citations for facts that may change.` },
      { label: 'First screen answers and acts', ok: hasExtractableAnswer && hasActionNearTop, detail: hasExtractableAnswer && hasActionNearTop ? 'The early copy contains the topic and an action verb.' : 'Add a short answer and obvious action near the top of the page.' },
      { label: 'Schema markup is present', ok: Boolean(livePage) || hasSchemaSignal, detail: livePage ? 'Live page fetched. Confirm visible schema in source when publishing.' : hasSchemaSignal ? 'Schema-like markup detected in pasted HTML.' : 'Add truthful SoftwareApplication, Article, FAQPage, or Breadcrumb schema where visible content supports it.' },
      { label: 'Open Graph preview is complete', ok: Boolean(ogTitle && ogDescription && ogImage), detail: ogTitle && ogDescription && ogImage ? 'OG title, description, and image detected.' : 'Add OG title, description, and image so shared links look credible.' },
    ]

    const failed = items.filter((item) => !item.ok)
    const actionPlan = failed.length
      ? failed.map((item, index) => `${index + 1}. ${item.label}: ${item.detail}`)
      : ['1. Page-level SEO basics look ready. Do a final visual/mobile QA, then request indexing or publish the refresh.']
    const criticalLabels = new Set(['Live URL responded', 'Primary keyword placement', 'One clear H1', 'Canonical URL', 'First screen answers and acts'])
    const actionRows = failed.map((item) => ({
      severity: criticalLabels.has(item.label) ? 'High' : item.label.includes('Open Graph') || item.label.includes('Schema') ? 'Medium' : 'Low',
      label: item.label,
      detail: item.detail,
    }))
    const refreshBrief = `Page refresh brief

URL: ${pageUrl}
Target keyword: ${targetKeyword}
Current score: ${Math.round((items.filter((item) => item.ok).length / items.length) * 100)}%
Word count: ${words}

Highest priority fixes:
${actionRows.length ? actionRows.map((row) => `- ${row.severity}: ${row.label} — ${row.detail}`).join('\n') : '- No priority fixes from the current inputs.'}

Recommended first-screen block:
Use this ${targetKeyword || 'SEO checker'} to check the page title, meta description, H1, canonical URL, content depth, links, image alt text, schema, and share preview before publishing. Paste HTML or fetch a live URL, then fix the highest-priority warnings first.

Internal link targets to add:
- Link to the closest tool category page.
- Link to one supporting guide that explains the workflow.
- Link to the next action tool, such as schema, meta description, keyword density, heading hierarchy, or image-alt checking.

Manual QA after edits:
- Mobile first screen shows the tool and action.
- Canonical, title, meta, OG image, and schema match visible content.
- Sitemap includes the URL and the page is indexable.`

    return { words, items, actionPlan, actionRows, refreshBrief }
  }, [canonical, content, description, h1, html, imageCount, imagesMissingAlt, internalLinks, externalLinks, livePage, pageUrl, targetKeyword, title])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Audit inputs">
        <Field label="Page URL" value={pageUrl} onChange={setPageUrl} placeholder="https://example.com/page" />
        <Field label="Target keyword" value={targetKeyword} onChange={setTargetKeyword} placeholder="seo audit" />
        <TextArea label="Paste page HTML source (optional)" value={html} onChange={setHtml} rows={5} placeholder="Paste the rendered HTML or page source here." hint="Use this when you want the tool to extract title, meta description, H1s, images, and links." />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={fetchLivePage} disabled={fetchingPage} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
            {fetchingPage ? 'Fetching live page...' : 'Fetch live URL'}
          </button>
          <button type="button" onClick={parseHtml} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.96]">
            Analyze pasted HTML
          </button>
        </div>
        {fetchError && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
            {fetchError}
          </p>
        )}
        {livePage && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="HTTP status" value={`${livePage.status}`} detail={livePage.finalUrl} highlight={livePage.status < 400} />
            <Stat label="Live words" value={`${livePage.wordCount}`} detail="Extracted from visible body text." highlight={livePage.wordCount >= 600} />
            <Stat label="Links found" value={`${livePage.internalLinks + livePage.externalLinks}`} detail={`${livePage.internalLinks} internal, ${livePage.externalLinks} external`} highlight />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title tag" value={title} onChange={setTitle} />
          <Field label="Canonical URL" value={canonical} onChange={setCanonical} />
        </div>
        <TextArea label="Meta description" value={description} onChange={setDescription} rows={3} />
        <Field label="H1 text" value={h1} onChange={setH1} hint="Separate multiple H1s with a pipe character if checking manually." />
        <TextArea label="Visible body copy" value={content} onChange={setContent} rows={7} />
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Images" value={imageCount} onChange={setImageCount} type="number" />
          <Field label="Missing alt" value={imagesMissingAlt} onChange={setImagesMissingAlt} type="number" />
          <Field label="Internal links" value={internalLinks} onChange={setInternalLinks} type="number" />
          <Field label="External links" value={externalLinks} onChange={setExternalLinks} type="number" />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={audit.items} />
        <Panel title="Priority fix queue">
          {audit.actionRows.length === 0 ? (
            <p className="text-sm leading-6 text-gray-600">No priority fixes from the current inputs. Do a final visual check before publishing.</p>
          ) : (
            <div className="space-y-2">
              {audit.actionRows.map((row) => (
                <div key={`${row.severity}-${row.label}`} className="rounded-xl border border-gray-100 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">{row.label}</p>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${row.severity === 'High' ? 'bg-red-100 text-red-700' : row.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{row.severity}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{row.detail}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>
        <CopyBox label="Priority SEO fixes" value={audit.actionPlan.join('\n')} downloadName="priority-seo-fixes.txt" />
        <CopyBox label="Page refresh brief" value={audit.refreshBrief} downloadName="page-refresh-brief.txt" />
      </div>
    </div>
  )
}

function SerpSnippetPreviewTool() {
  const slug = getSlug(usePathname())
  const defaults =
    slug === 'seo-title-checker'
      ? {
          title: 'Free SEO Title Checker | Google Title Preview',
          description: 'Preview title tags before publishing and check whether the keyword, length, and search intent are strong enough for Google results.',
          url: 'https://freeltools.com/tools/seo-title-checker',
        }
      : slug === 'meta-description-checker'
        ? {
            title: 'Free Meta Description Checker | SERP Preview',
            description: 'Write and preview meta descriptions for Google search results, with length guidance and a clear snippet before your page goes live.',
            url: 'https://freeltools.com/tools/meta-description-checker',
          }
        : {
            title: 'Free On-Page SEO Checker | Title, Meta, H1 and Links',
            description: 'Check title tags, meta descriptions, H1s, canonicals, content depth, internal links, external citations, and image alt text before publishing.',
            url: 'https://freeltools.com/tools/on-page-seo-checker',
          }

  const [title, setTitle] = useState(defaults.title)
  const [description, setDescription] = useState(defaults.description)
  const [url, setUrl] = useState(defaults.url)
  const [mode, setMode] = useState('desktop')
  const [targetKeyword, setTargetKeyword] = useState(slug === 'meta-description-checker' ? 'meta description checker' : 'seo title checker')
  const [searchIntent, setSearchIntent] = useState('use a free tool before publishing')

  const titleOk = title.length >= 35 && title.length <= 62
  const descOk = description.length >= 110 && description.length <= 160
  const keyword = targetKeyword.trim().toLowerCase()
  const titleHasKeyword = keyword ? title.toLowerCase().includes(keyword) : true
  const descriptionHasAction = /\b(use|check|preview|generate|copy|download|fix|audit|create)\b/i.test(description)
  const snippetChecks: ScoreItem[] = [
    { label: 'Title working length', ok: titleOk, detail: `${title.length} characters. Titles outside the working range may still show, but rewrite/truncation risk increases.` },
    { label: 'Meta description working length', ok: descOk, detail: `${description.length} characters. Keep it long enough to be useful and short enough to scan.` },
    { label: 'Keyword alignment', ok: titleHasKeyword, detail: keyword ? (titleHasKeyword ? 'Target keyword appears in the title.' : 'Target keyword is missing from the title.') : 'Add a keyword to check alignment.' },
    { label: 'Action promise', ok: descriptionHasAction, detail: descriptionHasAction ? 'Description names what the searcher can do next.' : 'Add a verb that makes the next action obvious.' },
    { label: 'URL clarity', ok: /^https?:\/\//i.test(url), detail: /^https?:\/\//i.test(url) ? slugHost(url) : 'Use a valid full URL for launch QA.' },
  ]
  const titleVariants = [
    `${titleCase(targetKeyword)} | Free ${slug === 'seo-title-checker' ? 'Title Preview' : 'SERP Preview'} Tool`,
    `Free ${titleCase(targetKeyword)} | No Signup`,
    `${titleCase(targetKeyword)} for ${titleCase(searchIntent.replace(/\b(use|a|the|before)\b/gi, '').trim() || 'SEO Pages')}`,
  ]
  const descriptionVariants = [
    `Use this free ${targetKeyword} to ${searchIntent}, check length, preview the SERP snippet, and copy a cleaner version before publishing.`,
    `Preview ${targetKeyword} output for Google search results. Check length, keyword alignment, action clarity, and URL display without creating an account.`,
  ]
  const optimizationBrief = `Snippet optimization brief

Target keyword: ${targetKeyword}
Search intent: ${searchIntent}
URL: ${url}

Checks:
${snippetChecks.map((item) => `- ${item.ok ? 'PASS' : 'FIX'}: ${item.label} — ${item.detail}`).join('\n')}

Title variants:
${titleVariants.map((item) => `- ${item}`).join('\n')}

Meta description variants:
${descriptionVariants.map((item) => `- ${item}`).join('\n')}`

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Snippet inputs">
        <Field label="Target keyword" value={targetKeyword} onChange={setTargetKeyword} />
        <Field label="Searcher action" value={searchIntent} onChange={setSearchIntent} />
        <Field label="Title tag" value={title} onChange={setTitle} />
        <TextArea label="Meta description" value={description} onChange={setDescription} rows={4} />
        <Field label="Page URL" value={url} onChange={setUrl} />
        <SelectField
          label="Preview width"
          value={mode}
          onChange={setMode}
          options={[
            { label: 'Desktop-style preview', value: 'desktop' },
            { label: 'Mobile-style preview', value: 'mobile' },
          ]}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Title length" value={`${title.length}`} detail={titleOk ? 'Good working range.' : 'Aim for 35-62 characters.'} highlight={titleOk} />
          <Stat label="Description length" value={`${description.length}`} detail={descOk ? 'Good working range.' : 'Aim for 110-160 characters.'} highlight={descOk} />
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel title="Google-style preview">
          <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${mode === 'mobile' ? 'max-w-sm' : ''}`}>
            <p className="truncate text-sm text-gray-700">{url}</p>
            <p className="mt-1 text-xl leading-6 text-[#1a0dab]">{title}</p>
            <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>
          </div>
          <p className="text-xs leading-5 text-gray-500">Google can rewrite titles and snippets. Use this preview to check clarity, length, and search intent before publishing.</p>
        </Panel>
        <ScoreList items={snippetChecks} />
        <CopyBox label="Snippet variants and QA brief" value={optimizationBrief} downloadName="serp-snippet-brief.txt" />
      </div>
    </div>
  )
}

function MetaTagGenerator() {
  const [title, setTitle] = useState('Free SEO Tools for Small Websites')
  const [description, setDescription] = useState('Use free SEO tools to audit pages, generate schema, preview snippets, create robots.txt files, and build XML sitemaps.')
  const [canonical, setCanonical] = useState('https://example.com/free-seo-tools')
  const [image, setImage] = useState('https://example.com/og-image.jpg')
  const [robots, setRobots] = useState('index, follow')

  const tags = `<title>${escapeXml(title)}</title>
<meta name="description" content="${escapeXml(description)}" />
<link rel="canonical" href="${escapeXml(canonical)}" />
<meta name="robots" content="${escapeXml(robots)}" />
<meta property="og:title" content="${escapeXml(title)}" />
<meta property="og:description" content="${escapeXml(description)}" />
<meta property="og:url" content="${escapeXml(canonical)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${escapeXml(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeXml(title)}" />
<meta name="twitter:description" content="${escapeXml(description)}" />
<meta name="twitter:image" content="${escapeXml(image)}" />`

  const checks: ScoreItem[] = [
    { label: 'Title usable', ok: title.length >= 35 && title.length <= 70, detail: `${title.length} characters. Keep the page title clear and not overly long.` },
    { label: 'Description usable', ok: description.length >= 110 && description.length <= 170, detail: `${description.length} characters. Use one specific promise and next action.` },
    { label: 'Canonical URL valid', ok: /^https?:\/\//i.test(canonical), detail: canonical || 'Add a full canonical URL.' },
    { label: 'OG image valid', ok: /^https?:\/\//i.test(image), detail: image || 'Use an absolute image URL for social previews.' },
    { label: 'Robots directive selected', ok: robots.includes('index') || robots.includes('noindex'), detail: robots },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Meta tag inputs">
        <Field label="SEO title" value={title} onChange={setTitle} />
        <TextArea label="Meta description" value={description} onChange={setDescription} rows={4} />
        <Field label="Canonical URL" value={canonical} onChange={setCanonical} />
        <Field label="Open Graph image URL" value={image} onChange={setImage} />
        <SelectField
          label="Robots directive"
          value={robots}
          onChange={setRobots}
          options={[
            { label: 'Index, follow', value: 'index, follow' },
            { label: 'Noindex, follow', value: 'noindex, follow' },
            { label: 'Index, nofollow', value: 'index, nofollow' },
            { label: 'Noindex, nofollow', value: 'noindex, nofollow' },
          ]}
        />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={checks} />
        <CopyBox label="Head tags" value={tags} downloadName="seo-head-tags.html" />
      </div>
    </div>
  )
}

function SchemaMarkupGenerator() {
  const [schemaType, setSchemaType] = useState('FAQPage')
  const [name, setName] = useState('Free SEO Tools')
  const [description, setDescription] = useState('A collection of free SEO tools for audits, schema, snippets, robots.txt, sitemaps, and content checks.')
  const [url, setUrl] = useState('https://example.com/free-seo-tools')
  const [image, setImage] = useState('https://example.com/og-image.jpg')
  const [questionOne, setQuestionOne] = useState('What is the best free SEO tool to start with?')
  const [answerOne, setAnswerOne] = useState('Start with an on-page SEO audit tool, then use a snippet preview and schema generator before publishing.')
  const [questionTwo, setQuestionTwo] = useState('Does schema guarantee rich results?')
  const [answerTwo, setAnswerTwo] = useState('No. Schema helps search engines understand eligible content, but rich results are not guaranteed.')

  const schema = useMemo(() => {
    if (schemaType === 'FAQPage') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: questionOne, acceptedAnswer: { '@type': 'Answer', text: answerOne } },
          { '@type': 'Question', name: questionTwo, acceptedAnswer: { '@type': 'Answer', text: answerTwo } },
        ],
      }
    }
    if (schemaType === 'HowTo') {
      return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        step: [
          { '@type': 'HowToStep', name: 'Check the page basics', text: 'Review the title, meta description, H1, canonical, and indexability.' },
          { '@type': 'HowToStep', name: 'Improve the content', text: 'Add useful answers, internal links, examples, and credible citations.' },
          { '@type': 'HowToStep', name: 'Validate before publishing', text: 'Run QA for schema, mobile layout, links, and sitemap inclusion.' },
        ],
      }
    }
    if (schemaType === 'LocalBusiness') {
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name,
        description,
        url,
        image,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'City',
          addressRegion: 'State',
          addressCountry: 'US',
        },
      }
    }
    if (schemaType === 'SoftwareApplication') {
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        description,
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: name,
      description,
      image,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'Your Brand' },
      publisher: { '@type': 'Organization', name: 'Your Brand' },
    }
  }, [answerOne, answerTwo, description, image, name, questionOne, questionTwo, schemaType, url])

  const json = JSON.stringify(schema, null, 2)
  const script = `<script type="application/ld+json">
${json}
</script>`
  const schemaChecks: ScoreItem[] = [
    { label: 'Name present', ok: name.trim().length > 0, detail: name.trim() ? 'Main entity has a name/headline.' : 'Add the visible page name or headline.' },
    { label: 'Description useful', ok: description.trim().length >= 50, detail: `${description.length} characters. Schema descriptions should summarize the visible page.` },
    { label: 'URL valid', ok: /^https?:\/\//i.test(url), detail: url || 'Add the canonical page URL.' },
    { label: 'Image URL valid', ok: schemaType === 'FAQPage' || /^https?:\/\//i.test(image), detail: schemaType === 'FAQPage' ? 'FAQPage does not require an image.' : image || 'Add a representative image URL.' },
    { label: 'Visible-content match', ok: schemaType !== 'FAQPage' || (questionOne.trim().length > 0 && answerOne.trim().length > 0 && questionTwo.trim().length > 0 && answerTwo.trim().length > 0), detail: 'Only generate schema for content users can see on the page.' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Schema inputs">
        <SelectField
          label="Schema type"
          value={schemaType}
          onChange={setSchemaType}
          options={[
            { label: 'FAQPage', value: 'FAQPage' },
            { label: 'Article', value: 'Article' },
            { label: 'HowTo', value: 'HowTo' },
            { label: 'LocalBusiness', value: 'LocalBusiness' },
            { label: 'SoftwareApplication', value: 'SoftwareApplication' },
          ]}
        />
        <Field label="Name or headline" value={name} onChange={setName} />
        <TextArea label="Description" value={description} onChange={setDescription} rows={3} />
        <Field label="URL" value={url} onChange={setUrl} />
        <Field label="Image URL" value={image} onChange={setImage} />
        {schemaType === 'FAQPage' && (
          <>
            <Field label="Question 1" value={questionOne} onChange={setQuestionOne} />
            <TextArea label="Answer 1" value={answerOne} onChange={setAnswerOne} rows={3} />
            <Field label="Question 2" value={questionTwo} onChange={setQuestionTwo} />
            <TextArea label="Answer 2" value={answerTwo} onChange={setAnswerTwo} rows={3} />
          </>
        )}
      </Panel>
      <div className="space-y-4">
        <ScoreList items={schemaChecks} />
        <CopyBox label="JSON-LD schema" value={script} downloadName={`${schemaType.toLowerCase()}-schema.jsonld`} />
      </div>
    </div>
  )
}

function RobotsTxtGenerator() {
  const [sitemapUrl, setSitemapUrl] = useState('https://example.com/sitemap.xml')
  const [blockedPaths, setBlockedPaths] = useState('/admin/\n/search\n?sort=')
  const [crawlDelay, setCrawlDelay] = useState('')
  const [aiBots, setAiBots] = useState('yes')
  const [testPath, setTestPath] = useState('/admin/reports')

  const paths = blockedPaths.split('\n').map((path) => path.trim()).filter(Boolean)
  const robots = `User-agent: *
Allow: /
${paths.map((path) => `Disallow: ${path}`).join('\n')}${crawlDelay ? `\nCrawl-delay: ${crawlDelay}` : ''}

${aiBots === 'yes' ? `User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

` : ''}Sitemap: ${sitemapUrl}
`

  const blocked = paths.some((path) => robotsPathMatches(path, testPath))
  const robotsChecks: ScoreItem[] = [
    { label: 'Sitemap URL valid', ok: /^https?:\/\/.+\/.+/i.test(sitemapUrl), detail: sitemapUrl },
    { label: 'Public pages not fully blocked', ok: !paths.includes('/'), detail: paths.includes('/') ? 'Disallow: / blocks the entire site for the selected user agent.' : 'No full-site block found.' },
    { label: 'Test path result', ok: !blocked, detail: `${testPath || '/'} is ${blocked ? 'blocked' : 'allowed'} by the current Disallow rules.` },
    { label: 'Private paths listed', ok: paths.length > 0, detail: `${paths.length} disallow rule${paths.length === 1 ? '' : 's'} configured.` },
    { label: 'AI crawler choice explicit', ok: aiBots === 'yes' || aiBots === 'no', detail: aiBots === 'yes' ? 'AI crawler rules are included.' : 'Only standard crawler rules are included.' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Robots.txt inputs">
        <Field label="Sitemap URL" value={sitemapUrl} onChange={setSitemapUrl} />
        <TextArea label="Disallow paths" value={blockedPaths} onChange={setBlockedPaths} rows={5} hint="One path or pattern per line. Keep private URLs out of search, but do not use robots.txt for sensitive security." />
        <Field label="Crawl delay (optional)" value={crawlDelay} onChange={setCrawlDelay} placeholder="10" />
        <SelectField
          label="Block common AI training crawlers?"
          value={aiBots}
          onChange={setAiBots}
          options={[
            { label: 'Yes, add AI crawler disallow rules', value: 'yes' },
            { label: 'No, keep only standard crawler rules', value: 'no' },
          ]}
        />
        <Field label="Test a path" value={testPath} onChange={setTestPath} />
        <Stat label="Path test" value={blocked ? 'Blocked' : 'Allowed'} detail="Wildcard-aware check against your Disallow lines." highlight={!blocked} />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={robotsChecks} />
        <CopyBox label="robots.txt" value={robots} downloadName="robots.txt" />
      </div>
    </div>
  )
}

function RobotsTxtChecker() {
  const [robotsUrl, setRobotsUrl] = useState('https://freeltools.com/robots.txt')
  const [robotsText, setRobotsText] = useState('User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://freeltools.com/sitemap.xml')
  const [userAgent, setUserAgent] = useState('Googlebot')
  const [testPath, setTestPath] = useState('/tools/on-page-seo-checker')
  const [fetchingRobots, setFetchingRobots] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [liveResource, setLiveResource] = useState<TextResourceResult | null>(null)

  const analysis = useMemo(() => {
    type RobotsGroup = {
      agents: string[]
      rules: { directive: 'allow' | 'disallow'; value: string }[]
    }

    const groups: RobotsGroup[] = []
    const sitemaps: string[] = []
    const invalidLines: string[] = []
    const otherDirectives: string[] = []
    let current: RobotsGroup | null = null

    for (const rawLine of robotsText.split('\n')) {
      const line = rawLine.replace(/#.*$/, '').trim()
      if (!line) continue
      const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/i)
      if (!match) {
        invalidLines.push(rawLine.trim())
        continue
      }

      const directive = match[1].toLowerCase()
      const value = match[2].trim()

      if (directive === 'user-agent') {
        if (!current || current.rules.length > 0) {
          current = { agents: [], rules: [] }
          groups.push(current)
        }
        current.agents.push(value.toLowerCase())
      } else if (directive === 'allow' || directive === 'disallow') {
        if (!current) {
          current = { agents: ['*'], rules: [] }
          groups.push(current)
        }
        current.rules.push({ directive, value })
      } else if (directive === 'sitemap') {
        sitemaps.push(value)
      } else {
        otherDirectives.push(`${directive}: ${value}`)
      }
    }

    const selectedAgent = userAgent.trim().toLowerCase() || '*'
    const exactGroups = groups.filter((group) =>
      group.agents.some((agent) => agent !== '*' && (selectedAgent.includes(agent) || agent.includes(selectedAgent)))
    )
    const wildcardGroups = groups.filter((group) => group.agents.includes('*'))
    const activeGroups = exactGroups.length > 0 ? exactGroups : wildcardGroups
    const activeRules = activeGroups.flatMap((group) => group.rules)
    const path = testPath.startsWith('/') ? testPath : `/${testPath}`
    const matchedRule = activeRules
      .filter((rule) => rule.value && robotsPathMatches(rule.value, path))
      .sort((a, b) => b.value.length - a.value.length || (a.directive === 'allow' ? -1 : 1))[0]
    const pathBlocked = matchedRule?.directive === 'disallow'
    const fullSiteBlock = activeRules.some((rule) => rule.directive === 'disallow' && rule.value === '/')
    const sitemapIssues = sitemaps.filter((url) => !/^https?:\/\/.+/i.test(url))
    const ruleCount = groups.reduce((count, group) => count + group.rules.length, 0)
    const checks: ScoreItem[] = [
      { label: 'Robots.txt content found', ok: robotsText.trim().length > 0, detail: robotsText.trim() ? `${robotsText.length} characters ready to check.` : 'Fetch or paste a robots.txt file.' },
      { label: 'User-agent rules present', ok: groups.length > 0, detail: `${groups.length} user-agent group${groups.length === 1 ? '' : 's'} found.` },
      { label: 'No full-site block for selected crawler', ok: !fullSiteBlock, detail: fullSiteBlock ? `${userAgent || '*'} is blocked by Disallow: /.` : `No Disallow: / rule applies to ${userAgent || '*'}.` },
      { label: 'Important path crawlable', ok: !pathBlocked, detail: `${path} is ${pathBlocked ? 'blocked' : 'allowed'}${matchedRule ? ` by ${matchedRule.directive}: ${matchedRule.value}` : ' because no matching disallow rule was found'}.` },
      { label: 'Sitemap directive present', ok: sitemaps.length > 0 && sitemapIssues.length === 0, detail: sitemaps.length ? `${sitemaps.length} sitemap directive${sitemaps.length === 1 ? '' : 's'} found.` : 'No Sitemap directive found.' },
      { label: 'Syntax lines parsed', ok: invalidLines.length === 0, detail: invalidLines.length ? `${invalidLines.length} line${invalidLines.length === 1 ? '' : 's'} could not be parsed.` : 'No invalid robots.txt lines detected.' },
    ]

    const report = `Robots.txt check report

Source URL: ${liveResource?.finalUrl ?? robotsUrl}
HTTP status: ${liveResource ? liveResource.status : 'not fetched'}
User agent tested: ${userAgent || '*'}
Path tested: ${path}
Path result: ${pathBlocked ? 'blocked' : 'allowed'}
Matched rule: ${matchedRule ? `${matchedRule.directive}: ${matchedRule.value}` : 'none'}
Groups: ${groups.length}
Rules: ${ruleCount}
Sitemaps:
${sitemaps.length ? sitemaps.map((url) => `- ${url}`).join('\n') : '- none'}

Checks:
${checks.map((item) => `- ${item.ok ? 'PASS' : 'FIX'}: ${item.label} - ${item.detail}`).join('\n')}

Other directives:
${otherDirectives.length ? otherDirectives.map((item) => `- ${item}`).join('\n') : '- none'}

Invalid lines:
${invalidLines.length ? invalidLines.map((item) => `- ${item}`).join('\n') : '- none'}`

    return { groups, sitemaps, invalidLines, otherDirectives, matchedRule, pathBlocked, path, ruleCount, checks, report }
  }, [liveResource, robotsText, robotsUrl, testPath, userAgent])

  const fetchRobotsTxt = async () => {
    setFetchingRobots(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: TextResourceResult }>({ mode: 'text', url: robotsUrl })
      setLiveResource(data.result)
      setRobotsText(data.result.text)
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch robots.txt')
    } finally {
      setFetchingRobots(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <Panel title="Robots.txt inputs">
        <Field label="Live robots.txt URL" value={robotsUrl} onChange={setRobotsUrl} />
        <button type="button" onClick={fetchRobotsTxt} disabled={fetchingRobots} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {fetchingRobots ? 'Fetching robots.txt...' : 'Fetch robots.txt'}
        </button>
        {fetchError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{fetchError}</p>}
        {liveResource && (
          <p className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs leading-5 text-gray-600">
            Fetched {liveResource.status} from <span className="break-all">{liveResource.finalUrl}</span>
          </p>
        )}
        <TextArea label="Paste robots.txt" value={robotsText} onChange={setRobotsText} rows={12} hint="Paste the public robots.txt file. Lines beginning with # are treated as comments." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Crawler user agent" value={userAgent} onChange={setUserAgent} placeholder="Googlebot" />
          <Field label="Important path to test" value={testPath} onChange={setTestPath} placeholder="/tools/on-page-seo-checker" />
        </div>
      </Panel>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Stat label="Groups" value={`${analysis.groups.length}`} detail="User-agent groups found." highlight={analysis.groups.length > 0} />
          <Stat label="Rules" value={`${analysis.ruleCount}`} detail="Allow and disallow rules parsed." highlight={analysis.ruleCount > 0} />
          <Stat label="Path result" value={analysis.pathBlocked ? 'Blocked' : 'Allowed'} detail={analysis.matchedRule ? `${analysis.matchedRule.directive}: ${analysis.matchedRule.value}` : 'No matching block.'} highlight={!analysis.pathBlocked} />
        </div>
        <ScoreList items={analysis.checks} />
        <Panel title="Sitemap directives">
          {analysis.sitemaps.length === 0 ? (
            <p className="text-sm text-gray-600">No Sitemap directive found in this robots.txt file.</p>
          ) : (
            <div className="space-y-2">
              {analysis.sitemaps.map((url) => (
                <p key={url} className="break-all rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">{url}</p>
              ))}
            </div>
          )}
        </Panel>
        <CopyBox label="Robots.txt check report" value={analysis.report} downloadName="robots-txt-check-report.txt" />
      </div>
    </div>
  )
}

function XmlSitemapGenerator() {
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/services\nhttps://example.com/blog/seo-audit-checklist')
  const [changeFrequency, setChangeFrequency] = useState('weekly')
  const [priority, setPriority] = useState('0.8')
  const [includeLastmod, setIncludeLastmod] = useState('yes')

  const rawUrls = urls.split(/\s+/).map((url) => url.trim()).filter(Boolean)
  const parsedUrls = Array.from(new Set(rawUrls.filter((url) => /^https?:\/\//i.test(url))))
  const invalidUrls = rawUrls.filter((url) => !/^https?:\/\//i.test(url))
  const hosts = new Set(
    parsedUrls
      .map((url) => {
        try {
          return new URL(url).hostname.replace(/^www\./, '')
        } catch {
          return ''
        }
      })
      .filter(Boolean)
  )
  const today = new Date().toISOString().slice(0, 10)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${parsedUrls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>${includeLastmod === 'yes' ? `\n    <lastmod>${today}</lastmod>` : ''}
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`
  const sitemapChecks: ScoreItem[] = [
    { label: 'Valid absolute URLs', ok: parsedUrls.length > 0 && invalidUrls.length === 0, detail: `${parsedUrls.length} valid, ${invalidUrls.length} invalid or relative.` },
    { label: 'No duplicate URL bloat', ok: parsedUrls.length === rawUrls.filter((url) => /^https?:\/\//i.test(url)).length, detail: `${rawUrls.length - parsedUrls.length} duplicate or invalid row${rawUrls.length - parsedUrls.length === 1 ? '' : 's'} removed from output.` },
    { label: 'Single host set', ok: hosts.size <= 1, detail: hosts.size <= 1 ? 'All sitemap URLs share one host.' : `${hosts.size} hosts found. Split by property when needed.` },
    { label: 'Sitemap size within limit', ok: parsedUrls.length <= 50000, detail: `${parsedUrls.length} URLs. Standard sitemap files should stay under 50,000 URLs.` },
    { label: 'Priority valid', ok: Number(priority) >= 0 && Number(priority) <= 1, detail: `Priority ${priority}. Use 0.0 to 1.0.` },
  ]
  const auditCsv = csvRows(
    ['url', 'host', 'included'],
    rawUrls.map((url) => {
      let host = ''
      try {
        host = new URL(url).hostname
      } catch {
        host = ''
      }
      return [url, host, parsedUrls.includes(url) ? 'yes' : 'no']
    })
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Sitemap inputs">
        <TextArea label="URL list" value={urls} onChange={setUrls} rows={8} hint="Paste one URL per line. This lightweight generator is best for small websites and landing-page batches." />
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="Change frequency"
            value={changeFrequency}
            onChange={setChangeFrequency}
            options={['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((item) => ({ label: item, value: item }))}
          />
          <SelectField
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={['1.0', '0.9', '0.8', '0.7', '0.5', '0.3'].map((item) => ({ label: item, value: item }))}
          />
          <SelectField label="Lastmod" value={includeLastmod} onChange={setIncludeLastmod} options={[{ label: 'Include', value: 'yes' }, { label: 'Skip', value: 'no' }]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Valid URLs" value={`${parsedUrls.length}`} detail="Duplicate URLs are removed automatically." highlight />
          <Stat label="Limit note" value={parsedUrls.length > 50000 ? 'Too many' : 'OK'} detail="A sitemap file should stay under 50,000 URLs." highlight={parsedUrls.length <= 50000} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={sitemapChecks} />
        <CopyBox label="sitemap.xml" value={xml} downloadName="sitemap.xml" />
        <CopyBox label="Sitemap URL audit CSV" value={auditCsv} downloadName="sitemap-url-audit.csv" />
      </div>
    </div>
  )
}

function SitemapUrlChecker() {
  const [sitemapUrl, setSitemapUrl] = useState('https://freeltools.com/sitemap.xml')
  const [sitemapText, setSitemapText] = useState('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://freeltools.com/tools/on-page-seo-checker</loc></url>\n  <url><loc>https://freeltools.com/tools/keyword-density-checker</loc></url>\n  <url><loc>https://freeltools.com/tools/robots-txt-checker</loc></url>\n</urlset>')
  const [fetchingSitemap, setFetchingSitemap] = useState(false)
  const [checkingUrls, setCheckingUrls] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [liveResource, setLiveResource] = useState<TextResourceResult | null>(null)
  const [checkedLinks, setCheckedLinks] = useState<LinkStatusResult[]>([])

  const audit = useMemo(() => {
    const locUrls = Array.from(sitemapText.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi))
      .map((match) => decodeXmlEntities(match[1].trim()))
      .filter(Boolean)
    const lineUrls = splitLines(sitemapText).flatMap((line) => line.match(/https?:\/\/[^\s<>"']+/gi) ?? [])
    const urls = locUrls.length > 0 ? locUrls : lineUrls.map(decodeXmlEntities)
    const validUrls = urls.filter((url) => /^https?:\/\//i.test(url))
    const invalidUrls = urls.filter((url) => !/^https?:\/\//i.test(url))

    const normalize = (value: string) => {
      try {
        const url = new URL(value)
        url.hash = ''
        return url.toString().replace(/\/$/, '')
      } catch {
        return value
      }
    }

    const normalizedCounts = new Map<string, number>()
    for (const url of validUrls) {
      const normalized = normalize(url)
      normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1)
    }

    const duplicateUrls = validUrls.filter((url) => (normalizedCounts.get(normalize(url)) ?? 0) > 1)
    const hosts = new Set(
      validUrls
        .map((url) => {
          try {
            return new URL(url).hostname.replace(/^www\./, '')
          } catch {
            return ''
          }
        })
        .filter(Boolean)
    )
    const nonHttpsUrls = validUrls.filter((url) => !url.toLowerCase().startsWith('https://'))
    const parameterUrls = validUrls.filter((url) => {
      try {
        return new URL(url).search.length > 0
      } catch {
        return false
      }
    })
    const fragmentUrls = validUrls.filter((url) => {
      try {
        return new URL(url).hash.length > 0
      } catch {
        return false
      }
    })
    const checkedByInput = new Map(checkedLinks.map((link) => [link.inputUrl, link]))
    const liveFailures = checkedLinks.filter((link) => !link.ok)
    const checks: ScoreItem[] = [
      { label: 'Sitemap URLs found', ok: validUrls.length > 0, detail: `${validUrls.length} valid URL${validUrls.length === 1 ? '' : 's'} found.` },
      { label: 'All rows are absolute URLs', ok: invalidUrls.length === 0 && validUrls.length > 0, detail: invalidUrls.length ? `${invalidUrls.length} invalid or relative row${invalidUrls.length === 1 ? '' : 's'} found.` : 'All detected URLs start with http or https.' },
      { label: 'No duplicate sitemap URLs', ok: duplicateUrls.length === 0, detail: `${duplicateUrls.length} duplicate URL row${duplicateUrls.length === 1 ? '' : 's'} found after normalization.` },
      { label: 'Single host set', ok: hosts.size <= 1, detail: hosts.size <= 1 ? 'All sitemap URLs share one host.' : `${hosts.size} hosts found. Split by verified property when needed.` },
      { label: 'HTTPS URLs only', ok: nonHttpsUrls.length === 0, detail: nonHttpsUrls.length ? `${nonHttpsUrls.length} non-HTTPS URL${nonHttpsUrls.length === 1 ? '' : 's'} found.` : 'All detected URLs use HTTPS.' },
      { label: 'No parameter or fragment URLs', ok: parameterUrls.length === 0 && fragmentUrls.length === 0, detail: `${parameterUrls.length} parameter URL${parameterUrls.length === 1 ? '' : 's'}, ${fragmentUrls.length} fragment URL${fragmentUrls.length === 1 ? '' : 's'}.` },
      { label: 'Sitemap size within protocol limit', ok: validUrls.length <= 50000, detail: `${validUrls.length} URLs. Standard sitemap files should stay under 50,000 URLs.` },
      { label: 'Live sample clean', ok: liveFailures.length === 0, detail: checkedLinks.length ? `${checkedLinks.length} sampled URL${checkedLinks.length === 1 ? '' : 's'} checked, ${liveFailures.length} issue${liveFailures.length === 1 ? '' : 's'} found.` : 'Run the live sample check to test up to 25 URLs.' },
    ]

    const csv = csvRows(
      ['url', 'host', 'signal', 'live_status', 'final_url'],
      urls.map((url) => {
        let host = ''
        let signal = 'ok'
        try {
          const parsed = new URL(url)
          host = parsed.hostname
          if (!/^https:/i.test(parsed.protocol)) signal = 'non-https'
          else if (parsed.search) signal = 'parameter-url'
          else if (parsed.hash) signal = 'fragment-url'
          else if ((normalizedCounts.get(normalize(url)) ?? 0) > 1) signal = 'duplicate'
        } catch {
          signal = 'invalid-url'
        }
        const live = checkedByInput.get(url)
        return [url, host, signal, live?.status ?? live?.error ?? '', live?.finalUrl ?? '']
      })
    )

    return { urls, validUrls, invalidUrls, duplicateUrls, hosts, nonHttpsUrls, parameterUrls, fragmentUrls, liveFailures, checks, csv }
  }, [checkedLinks, sitemapText])

  const fetchSitemap = async () => {
    setFetchingSitemap(true)
    setCheckError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: TextResourceResult }>({ mode: 'text', url: sitemapUrl })
      setLiveResource(data.result)
      setSitemapText(data.result.text)
      setCheckedLinks([])
    } catch (error) {
      setCheckError(error instanceof Error ? error.message : 'Could not fetch sitemap')
    } finally {
      setFetchingSitemap(false)
    }
  }

  const checkLiveSample = async () => {
    setCheckingUrls(true)
    setCheckError('')
    try {
      const sample = audit.validUrls.slice(0, 25)
      if (sample.length === 0) throw new Error('No valid URLs found to check')
      const data = await postSeoAnalysis<{ ok: true; results: LinkStatusResult[]; limit: number }>({ mode: 'links', urls: sample })
      setCheckedLinks(data.results)
    } catch (error) {
      setCheckError(error instanceof Error ? error.message : 'Could not check sitemap URLs')
    } finally {
      setCheckingUrls(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Sitemap checker inputs">
        <Field label="Live sitemap URL" value={sitemapUrl} onChange={setSitemapUrl} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={fetchSitemap} disabled={fetchingSitemap} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
            {fetchingSitemap ? 'Fetching sitemap...' : 'Fetch sitemap'}
          </button>
          <button type="button" onClick={checkLiveSample} disabled={checkingUrls || audit.validUrls.length === 0} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-200 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
            {checkingUrls ? 'Checking URLs...' : 'Check first 25 live URLs'}
          </button>
        </div>
        {checkError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{checkError}</p>}
        {liveResource && (
          <p className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs leading-5 text-gray-600">
            Fetched {liveResource.status} from <span className="break-all">{liveResource.finalUrl}</span>
          </p>
        )}
        <TextArea label="Paste sitemap XML or URL list" value={sitemapText} onChange={setSitemapText} rows={13} hint="Paste sitemap XML, sitemap index XML, or one URL per line. The checker reads loc tags first, then plain URLs." />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="URLs" value={`${audit.validUrls.length}`} detail="Detected valid sitemap URLs." highlight={audit.validUrls.length > 0} />
          <Stat label="Hosts" value={`${audit.hosts.size}`} detail="One host per sitemap is usually cleaner." highlight={audit.hosts.size <= 1} />
          <Stat label="Live issues" value={`${audit.liveFailures.length}`} detail={checkedLinks.length ? 'From checked sample.' : 'Run sample check.'} highlight={audit.liveFailures.length === 0} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={audit.checks} />
        {checkedLinks.length > 0 && (
          <Panel title="Live sample results">
            <div className="space-y-2">
              {checkedLinks.map((link) => (
                <div key={link.inputUrl} className={`rounded-xl border p-3 text-xs leading-5 ${link.ok ? 'border-brand-100 bg-brand-50 text-brand-800' : 'border-amber-100 bg-amber-50 text-amber-800'}`}>
                  <p className="font-semibold">{link.ok ? 'OK' : 'Review'} · {link.status ?? link.error ?? 'failed'}</p>
                  <p className="mt-1 break-all">{link.inputUrl}</p>
                  {link.finalUrl !== link.url && <p className="mt-1 break-all">Final: {link.finalUrl}</p>}
                </div>
              ))}
            </div>
          </Panel>
        )}
        {audit.duplicateUrls.length > 0 && (
          <Panel title="Duplicate URLs to review">
            <div className="space-y-2">
              {Array.from(new Set(audit.duplicateUrls)).slice(0, 10).map((url) => (
                <p key={url} className="break-all rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">{url}</p>
              ))}
            </div>
          </Panel>
        )}
        <CopyBox label="Sitemap URL audit CSV" value={audit.csv} downloadName="sitemap-url-audit.csv" />
      </div>
    </div>
  )
}

function SitemapCanonicalAuditor() {
  const [preferredOrigin, setPreferredOrigin] = useState('https://example.com')
  const [input, setInput] = useState(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc></url>
  <url><loc>http://example.com/services?ref=nav</loc></url>
  <url><loc>/about#team</loc></url>
  <url><loc>https://www.example.com/contact</loc></url>
  <url><loc>https://example.com/</loc></url>
</urlset>`)
  const audit = useMemo(() => auditSitemapCanonicals(input, preferredOrigin), [input, preferredOrigin])
  const count = (issue: SitemapCanonicalIssue) => audit.rows.filter((row) => row.issues.includes(issue)).length
  const checks: ScoreItem[] = [
    { label: 'URLs detected', ok: audit.rows.length > 0, detail: `${audit.rows.length} sitemap entr${audit.rows.length === 1 ? 'y' : 'ies'} found.` },
    { label: 'Valid URL format', ok: count('malformed') === 0, detail: `${count('malformed')} malformed entr${count('malformed') === 1 ? 'y' : 'ies'} found.` },
    { label: 'Absolute URLs only', ok: count('relative') === 0, detail: `${count('relative')} relative URL${count('relative') === 1 ? '' : 's'} found.` },
    { label: 'HTTPS URLs only', ok: count('non-https') === 0, detail: `${count('non-https')} non-HTTPS URL${count('non-https') === 1 ? '' : 's'} found.` },
    { label: 'No fragments or parameters', ok: count('fragment') + count('parameter') === 0, detail: `${count('fragment')} fragment and ${count('parameter')} parameter URL${count('parameter') === 1 ? '' : 's'} found.` },
    { label: 'No duplicate canonicals', ok: count('duplicate') === 0, detail: `${count('duplicate')} duplicate row${count('duplicate') === 1 ? '' : 's'} found after normalization.` },
    { label: 'Single canonical host', ok: count('mixed-host') === 0, detail: audit.primaryHost ? `Preferred host: ${audit.primaryHost}. ${count('mixed-host')} mixed-host row${count('mixed-host') === 1 ? '' : 's'}.` : 'Add URLs or a preferred site origin.' },
  ]
  const csv = csvRows(
    ['input_url', 'suggested_canonical', 'host', 'issues'],
    audit.rows.map((row) => [row.input, row.suggested, row.host, row.issues.join('|') || 'clean'])
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Sitemap canonical inputs">
        <Field
          label="Preferred site origin"
          value={preferredOrigin}
          onChange={setPreferredOrigin}
          hint="Used to resolve relative paths and identify mixed hosts. The auditor never rewrites another valid host silently."
        />
        <TextArea
          label="Sitemap XML or URL list"
          value={input}
          onChange={setInput}
          rows={15}
          hint="Paste XML with loc elements or one URL per line. Everything is processed locally in your browser."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Entries" value={`${audit.rows.length}`} detail="Before deduplication." highlight={audit.rows.length > 0} />
          <Stat label="Hosts" value={`${audit.hosts.length}`} detail={audit.primaryHost || 'No host found.'} highlight={audit.hosts.length === 1} />
          <Stat label="Consistency" value={audit.consistency} detail="Across canonical-ready sitemap signals." highlight={audit.consistency === 'Consistent'} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={checks} />
        {audit.rows.some((row) => row.issues.length > 0) && (
          <Panel title="Entries to review">
            <div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
              {audit.rows.filter((row) => row.issues.length > 0).slice(0, 100).map((row, index) => (
                <div key={`${row.input}-${index}`} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                  <p className="font-semibold uppercase tracking-wider">{row.issues.join(' · ')}</p>
                  <p className="mt-1 break-all">{row.input}</p>
                  {row.suggested && <p className="mt-1 break-all text-gray-600">Suggested: {row.suggested}</p>}
                </div>
              ))}
            </div>
          </Panel>
        )}
        <CopyBox label="Canonical-ready fix list" value={audit.fixedUrls.join('\n')} downloadName="sitemap-canonical-fix-list.txt" />
        <CopyBox label="Canonical audit CSV" value={csv} downloadName="sitemap-canonical-audit.csv" />
      </div>
    </div>
  )
}

function HreflangReciprocityChecker() {
  const [input, setInput] = useState(`SOURCE: https://example.com/en/
CANONICAL: https://example.com/en/
en: https://example.com/en/
es: https://example.com/es/
x-default: https://example.com/

SOURCE: https://example.com/es/
CANONICAL: https://example.com/es/
en: https://example.com/en/
es: https://example.com/es/
x-default: https://example.com/`)
  const audit = useMemo(() => auditHreflangReciprocity(input), [input])
  const count = (kind: HreflangIssueKind) => audit.issues.filter((issue) => issue.kind === kind).length
  const invalidUrls = count('invalid-source') + count('invalid-url') + count('format')
  const duplicates = count('duplicate-locale') + count('duplicate-source')
  const checks: ScoreItem[] = [
    { label: 'Page sets detected', ok: audit.pages.length > 0 && invalidUrls === 0, detail: `${audit.pages.length} source page set${audit.pages.length === 1 ? '' : 's'} found.` },
    { label: 'Valid language-region tags', ok: count('invalid-locale') === 0, detail: `${count('invalid-locale')} invalid or non-canonical locale tag${count('invalid-locale') === 1 ? '' : 's'} found.` },
    { label: 'No duplicate locales', ok: duplicates === 0, detail: `${duplicates} duplicate locale or source entr${duplicates === 1 ? 'y' : 'ies'} found.` },
    { label: 'Self-references included', ok: count('missing-self') === 0, detail: `${count('missing-self')} page set${count('missing-self') === 1 ? '' : 's'} missing a self-reference.` },
    { label: 'x-default recommendation', ok: count('missing-x-default') === 0, detail: count('missing-x-default') ? `${count('missing-x-default')} page set${count('missing-x-default') === 1 ? '' : 's'} could add a global fallback.` : 'Every page set includes x-default.' },
    { label: 'Supplied pages are reciprocal', ok: count('missing-reciprocal') === 0, detail: `${audit.reciprocalPairs} reciprocal pair${audit.reciprocalPairs === 1 ? '' : 's'} verified; ${count('missing-reciprocal')} missing return link${count('missing-reciprocal') === 1 ? '' : 's'}.` },
    { label: 'Self-canonicals are consistent', ok: count('canonical-conflict') === 0, detail: `${count('canonical-conflict')} supplied canonical conflict${count('canonical-conflict') === 1 ? '' : 's'} found.` },
  ]
  const issueCsv = csvRows(
    ['issue', 'source', 'detail'],
    audit.issues.map((issue) => [issue.kind, issue.source, issue.detail])
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Hreflang page sets">
        <TextArea
          label="Alternate annotations"
          value={input}
          onChange={setInput}
          rows={22}
          hint="Use one block per page: SOURCE: URL, optional CANONICAL: URL, then locale: URL rows. Separate page blocks with a blank line."
        />
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs leading-5 text-gray-600">
          <p className="font-semibold text-gray-800">Supported format</p>
          <p className="mt-1 font-mono">SOURCE: https://example.com/en/</p>
          <p className="font-mono">CANONICAL: https://example.com/en/</p>
          <p className="font-mono">en-US: https://example.com/en/</p>
          <p className="font-mono">fr-FR: https://example.com/fr/</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Pages" value={`${audit.pages.length}`} detail="Supplied source sets." highlight={audit.pages.length > 1} />
          <Stat label="Issues" value={`${audit.issues.length}`} detail="Includes recommendations." highlight={audit.issues.length === 0} />
          <Stat label="Reciprocal pairs" value={`${audit.reciprocalPairs}`} detail="Verified across supplied pages." highlight={count('missing-reciprocal') === 0} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={checks} />
        {audit.issues.length > 0 && (
          <Panel title="Hreflang issues">
            <div className="max-h-[34rem] space-y-2 overflow-auto pr-1">
              {audit.issues.slice(0, 120).map((issue, index) => (
                <div key={`${issue.kind}-${issue.source}-${index}`} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                  <p className="font-semibold uppercase tracking-wider">{issue.kind.replace(/-/g, ' ')}</p>
                  {issue.source && <p className="mt-1 break-all text-gray-600">{issue.source}</p>}
                  <p className="mt-1">{issue.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        )}
        <CopyBox label="Hreflang issue report" value={issueCsv} downloadName="hreflang-reciprocity-report.csv" />
      </div>
    </div>
  )
}

function HreflangTagGenerator() {
  const [lines, setLines] = useState('en https://example.com/\nes https://example.com/es/\nfr https://example.com/fr/')
  const [xDefault, setXDefault] = useState('https://example.com/')

  const entries = lines
    .split('\n')
    .map((line) => line.trim().split(/\s+/))
    .filter(([lang, url]) => lang && /^https?:\/\//i.test(url))
    .map(([lang, url]) => ({ lang, url }))
  const duplicateLangs = entries.filter((entry, index) => entries.findIndex((row) => row.lang.toLowerCase() === entry.lang.toLowerCase()) !== index)
  const invalidLangs = entries.filter((entry) => !/^(x-default|[a-z]{2,3}(-[a-z0-9]{2,8})?)$/i.test(entry.lang))

  const tags = `${entries.map((entry) => `<link rel="alternate" hreflang="${entry.lang}" href="${entry.url}" />`).join('\n')}${xDefault ? `\n<link rel="alternate" hreflang="x-default" href="${xDefault}" />` : ''}`
  const hreflangChecks: ScoreItem[] = [
    { label: 'At least two alternates', ok: entries.length >= 2, detail: `${entries.length} alternate URL${entries.length === 1 ? '' : 's'} found.` },
    { label: 'Locale code format', ok: invalidLangs.length === 0, detail: invalidLangs.length ? `${invalidLangs.length} locale code${invalidLangs.length === 1 ? '' : 's'} need review.` : 'Locale codes look valid.' },
    { label: 'No duplicate languages', ok: duplicateLangs.length === 0, detail: `${duplicateLangs.length} duplicate language row${duplicateLangs.length === 1 ? '' : 's'} found.` },
    { label: 'x-default included', ok: /^https?:\/\//i.test(xDefault), detail: xDefault || 'Add a global fallback URL when the site has a language selector.' },
    { label: 'Full URL format', ok: entries.every((entry) => /^https?:\/\//i.test(entry.url)), detail: 'Every hreflang href should be an absolute URL.' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Hreflang inputs">
        <TextArea label="Language and URL pairs" value={lines} onChange={setLines} rows={7} hint="Use one pair per line, for example: en-us https://example.com/us/" />
        <Field label="x-default URL" value={xDefault} onChange={setXDefault} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Alternates" value={`${entries.length}`} detail="Each locale should usually reference every other locale." highlight={entries.length >= 2} />
          <Stat label="x-default" value={xDefault ? 'Included' : 'Missing'} detail="Helpful for language selectors or global fallback pages." highlight={Boolean(xDefault)} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={hreflangChecks} />
        <CopyBox label="Hreflang tags" value={tags} downloadName="hreflang-tags.html" />
      </div>
    </div>
  )
}

function KeywordDensityChecker() {
  const [targetKeyword, setTargetKeyword] = useState('free seo tools')
  const [relatedTerms, setRelatedTerms] = useState('title tag\nmeta description\nschema markup\nrobots.txt\nxml sitemap\ninternal links\nsearch intent')
  const [questions, setQuestions] = useState('What is a free SEO tool?\nHow do I check on-page SEO?\nWhat should I fix before publishing?')
  const [content, setContent] = useState('Free SEO tools help small website owners check title tags, meta descriptions, schema markup, robots.txt files, XML sitemaps, and content quality before publishing. A useful SEO tool should make the next action clear instead of only showing a vague score.')

  const analysis = useMemo(() => {
    const normalized = content.toLowerCase()
    const words = normalized.match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) ?? []
    const keyword = targetKeyword.trim().toLowerCase()
    const occurrences = keyword ? (normalized.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length : 0
    const density = words.length ? (occurrences / words.length) * 100 : 0
    const terms = new Map<string, number>()
    for (const word of words) {
      if (word.length < 3 || stopWords.has(word)) continue
      terms.set(word, (terms.get(word) ?? 0) + 1)
    }
    const phrases = new Map<string, number>()
    for (let index = 0; index < words.length - 1; index += 1) {
      const phraseWords = [words[index], words[index + 1]]
      if (phraseWords.some((word) => word.length < 3 || stopWords.has(word))) continue
      const phrase = phraseWords.join(' ')
      phrases.set(phrase, (phrases.get(phrase) ?? 0) + 1)
    }
    const topTerms = Array.from(terms.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12)
    const topPhrases = Array.from(phrases.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
    const targetTerms = keywordCore(targetKeyword)
    const missingTargetTerms = targetTerms.filter((term) => !terms.has(term))
    const related = splitLines(relatedTerms)
    const questionRows = splitLines(questions)
    const relatedHits = related.map((term) => ({
      term,
      covered: normalized.includes(term.toLowerCase()),
    }))
    const relatedCovered = relatedHits.filter((term) => term.covered).length
    const relatedCoverage = related.length ? Math.round((relatedCovered / related.length) * 100) : 100
    const questionHits = questionRows.map((question) => {
      const core = keywordCore(question)
      const coveredTerms = core.filter((term) => terms.has(term)).length
      return {
        question,
        coveredTerms,
        totalTerms: core.length,
        covered: core.length > 0 && coveredTerms / core.length >= 0.5,
      }
    })
    const questionCoverage = questionHits.length ? Math.round((questionHits.filter((question) => question.covered).length / questionHits.length) * 100) : 100
    const overusedTerms = topTerms.filter(([, count]) => words.length > 0 && (count / words.length) * 100 > 4)
    const checks: ScoreItem[] = [
      { label: 'Content has enough text', ok: words.length >= 300, detail: `${words.length} words found. Thin pages usually need more context, examples, and next steps.` },
      { label: 'Target keyword appears', ok: occurrences > 0, detail: `${occurrences} exact phrase use${occurrences === 1 ? '' : 's'} found.` },
      { label: 'Density not stuffed', ok: occurrences === 0 || density <= 3, detail: `${density.toFixed(2)}% exact-match density. Use natural coverage over repetition.` },
      { label: 'Core terms covered', ok: missingTargetTerms.length === 0, detail: missingTargetTerms.length ? `Missing: ${missingTargetTerms.join(', ')}` : 'All target terms appear at least once.' },
      { label: 'Term variety present', ok: topTerms.length >= 6, detail: `${topTerms.length} meaningful repeated terms detected.` },
      { label: 'Related term coverage', ok: relatedCoverage >= 60, detail: `${relatedCoverage}% of related terms are covered. Add missing terms naturally where they help the reader.` },
      { label: 'Question coverage', ok: questionCoverage >= 50, detail: `${questionCoverage}% of target questions are partly covered by the copy.` },
      { label: 'No dominant repeated term', ok: overusedTerms.length === 0, detail: overusedTerms.length ? `Review overused terms: ${overusedTerms.map(([term]) => term).join(', ')}` : 'No single non-stopword dominates the content.' },
    ]
    return {
      words: words.length,
      chars: content.length,
      occurrences,
      density,
      readingTime: Math.max(1, Math.ceil(words.length / 220)),
      topTerms,
      topPhrases,
      checks,
      missingTargetTerms,
      relatedHits,
      relatedCoverage,
      questionHits,
      questionCoverage,
      overusedTerms,
    }
  }, [content, questions, relatedTerms, targetKeyword])
  const contentReport = `Keyword quality report

Target keyword: ${targetKeyword}
Words: ${analysis.words}
Exact uses: ${analysis.occurrences}
Density: ${analysis.density.toFixed(2)}%
Estimated reading time: ${analysis.readingTime} min
Related term coverage: ${analysis.relatedCoverage}%
Question coverage: ${analysis.questionCoverage}%

Checks:
${analysis.checks.map((item) => `- ${item.ok ? 'PASS' : 'FIX'}: ${item.label} — ${item.detail}`).join('\n')}

Related terms:
${analysis.relatedHits.map((item) => `- ${item.covered ? 'Covered' : 'Missing'}: ${item.term}`).join('\n')}

Question coverage:
${analysis.questionHits.map((item) => `- ${item.covered ? 'Covered' : 'Review'}: ${item.question}`).join('\n')}

Top terms:
${analysis.topTerms.map(([term, count]) => `- ${term}: ${count}`).join('\n')}

Top phrases:
${analysis.topPhrases.map(([phrase, count]) => `- ${phrase}: ${count}`).join('\n')}

Rewrite brief:
- Keep the exact keyword natural, not repetitive.
- Add missing related terms only where they explain the topic.
- Add one short answer section for the weakest uncovered question.
- If a term is overused, replace repeats with specific examples, entity names, or clearer subtopics.`

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Content inputs">
        <Field label="Target keyword or phrase" value={targetKeyword} onChange={setTargetKeyword} />
        <TextArea label="Related terms to cover" value={relatedTerms} onChange={setRelatedTerms} rows={5} hint="One term per line. Use GSC related queries, competitor subtopics, or entities the page should naturally mention." />
        <TextArea label="Questions the page should answer" value={questions} onChange={setQuestions} rows={5} hint="One question per line. The checker looks for partial topical coverage, not exact wording." />
        <TextArea label="Paste content" value={content} onChange={setContent} rows={13} />
      </Panel>
      <div className="space-y-4">
        <Stat label="Word count" value={`${analysis.words}`} detail={`${analysis.readingTime} min estimated read time`} highlight />
        <Stat label="Keyword uses" value={`${analysis.occurrences}`} detail={`${analysis.density.toFixed(2)}% density`} highlight={analysis.occurrences > 0 && analysis.density <= 3} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Related coverage" value={`${analysis.relatedCoverage}%`} detail={`${analysis.relatedHits.filter((item) => item.covered).length} of ${analysis.relatedHits.length} related terms covered`} highlight={analysis.relatedCoverage >= 60} />
          <Stat label="Question coverage" value={`${analysis.questionCoverage}%`} detail={`${analysis.questionHits.filter((item) => item.covered).length} of ${analysis.questionHits.length} questions partly covered`} highlight={analysis.questionCoverage >= 50} />
        </div>
        <ScoreList items={analysis.checks} />
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Missing related terms</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.relatedHits.filter((item) => !item.covered).length === 0 ? (
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">All related terms covered</span>
            ) : (
              analysis.relatedHits.filter((item) => !item.covered).map((item) => (
                <span key={item.term} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {item.term}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Questions to strengthen</h3>
          <div className="mt-3 space-y-2">
            {analysis.questionHits.map((item) => (
              <div key={item.question} className={`rounded-xl border p-3 text-xs ${item.covered ? 'border-brand-100 bg-brand-50 text-brand-800' : 'border-amber-100 bg-amber-50 text-amber-800'}`}>
                <p className="font-semibold">{item.covered ? 'Covered' : 'Review'} · {item.question}</p>
                <p className="mt-1">{item.coveredTerms} of {item.totalTerms} core terms found in content.</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Top repeated terms</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.topTerms.map(([term, count]) => (
              <span key={term} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {term} · {count}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Top repeated phrases</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.topPhrases.map(([phrase, count]) => (
              <span key={phrase} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {phrase} · {count}
              </span>
            ))}
          </div>
        </div>
        <CopyBox label="Keyword quality report" value={contentReport} downloadName="keyword-quality-report.txt" />
        <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Density is a quality check, not a ranking formula. Use the result to catch missing terms or obvious stuffing, then focus on usefulness and search intent.
        </p>
      </div>
    </div>
  )
}

function HeadingHierarchyChecker() {
  const [pageUrl, setPageUrl] = useState('https://freeltools.com/tools/on-page-seo-checker')
  const [targetKeyword, setTargetKeyword] = useState('on page seo checker')
  const [html, setHtml] = useState('<main>\n  <h1>On Page SEO Checker</h1>\n  <h2>Quick answer</h2>\n  <h2>What the checker reviews</h2>\n  <h3>Title tag</h3>\n  <h3>Meta description</h3>\n  <h2>FAQ</h2>\n</main>')
  const [fetchingPage, setFetchingPage] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const fetchLiveHeadings = async () => {
    setFetchingPage(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: SeoPageAnalysis }>({ mode: 'page', url: pageUrl })
      setHtml(
        `<main>\n${data.result.headings.map((heading) => `  <${heading.tag}>${heading.text}</${heading.tag}>`).join('\n')}\n</main>`
      )
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch headings from the live URL')
    } finally {
      setFetchingPage(false)
    }
  }

  const report = useMemo(() => {
    const headings = Array.from(html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)).map((match, index) => {
      const tag = match[1].toLowerCase()
      const level = Number(tag.replace('h', ''))
      const text = (match[2] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      return {
        index: index + 1,
        level,
        tag,
        text,
        empty: text.length === 0,
      }
    })
    const keyword = targetKeyword.trim().toLowerCase()
    const h1s = headings.filter((heading) => heading.level === 1)
    const keywordInH1 = keyword ? h1s.some((heading) => heading.text.toLowerCase().includes(keyword)) : false
    const skippedLevels = headings.filter((heading, index) => {
      const previous = headings[index - 1]
      return Boolean(previous && heading.level - previous.level > 1)
    })
    const repeatedH1 = h1s.length > 1
    const items: ScoreItem[] = [
      { label: 'One clear H1', ok: h1s.length === 1, detail: `${h1s.length} H1 heading${h1s.length === 1 ? '' : 's'} found.` },
      { label: 'Primary keyword in H1', ok: !keyword || keywordInH1, detail: keyword ? (keywordInH1 ? 'Target keyword appears in the H1.' : 'Target keyword is missing from the H1.') : 'Add a target keyword if you want to check alignment.' },
      { label: 'No skipped heading levels', ok: skippedLevels.length === 0, detail: skippedLevels.length === 0 ? 'The heading order does not jump from one level to a much deeper level.' : `${skippedLevels.length} heading jump${skippedLevels.length === 1 ? '' : 's'} found.` },
      { label: 'No empty headings', ok: headings.every((heading) => !heading.empty), detail: `${headings.filter((heading) => heading.empty).length} empty heading${headings.filter((heading) => heading.empty).length === 1 ? '' : 's'} found.` },
      { label: 'Enough structure to scan', ok: headings.length >= 3, detail: `${headings.length} total heading${headings.length === 1 ? '' : 's'} found.` },
    ]

    const csv = ['order,tag,level,text,signal']
      .concat(
        headings.map((heading) => {
          const previous = headings[heading.index - 2]
          const jumped = previous && heading.level - previous.level > 1
          const signal = heading.empty ? 'empty' : jumped ? 'skipped-level' : repeatedH1 && heading.level === 1 ? 'multiple-h1' : 'ok'
          return `${heading.index},${heading.tag},${heading.level},"${heading.text.replace(/"/g, '""')}",${signal}`
        })
      )
      .join('\n')

    return { headings, h1s, skippedLevels, items, csv }
  }, [html, targetKeyword])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <Panel title="Heading inputs">
        <Field label="Live page URL" value={pageUrl} onChange={setPageUrl} />
        <button type="button" onClick={fetchLiveHeadings} disabled={fetchingPage} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {fetchingPage ? 'Fetching headings...' : 'Fetch live headings'}
        </button>
        {fetchError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{fetchError}</p>}
        <Field label="Target keyword" value={targetKeyword} onChange={setTargetKeyword} />
        <TextArea
          label="Paste page HTML"
          value={html}
          onChange={setHtml}
          rows={13}
          hint="Paste rendered HTML or the main content block to extract H1-H6 headings and check hierarchy."
        />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={report.items} />
        <CopyBox label="Heading CSV" value={report.csv} />
      </div>
      <div className="lg:col-span-2">
        <Panel title="Heading outline">
          {report.headings.length === 0 ? (
            <p className="text-sm text-gray-600">No headings found in the pasted HTML.</p>
          ) : (
            <div className="space-y-2">
              {report.headings.map((heading) => {
                const previous = report.headings[heading.index - 2]
                const jumped = Boolean(previous && heading.level - previous.level > 1)
                const signal = heading.empty ? 'Empty' : jumped ? 'Skipped level' : report.h1s.length > 1 && heading.level === 1 ? 'Multiple H1' : 'OK'
                return (
                  <div key={`${heading.index}-${heading.tag}`} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{heading.tag.toUpperCase()}</span>
                      <span className="text-xs text-gray-500">Level {heading.level}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${signal === 'OK' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>{signal}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{heading.text || '(empty heading)'}</p>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

function ImageAltTextChecker() {
  const [pageUrl, setPageUrl] = useState('https://freeltools.com/tools/on-page-seo-checker')
  const [html, setHtml] = useState('<main>\n  <img src=\"/images/on-page-checker.png\" alt=\"On-page SEO checker score panel\" />\n  <img src=\"/images/serp-preview.png\" alt=\"\" />\n  <img src=\"/images/dashboard.png\" alt=\"image\" />\n</main>')
  const [fetchingPage, setFetchingPage] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const fetchLiveImages = async () => {
    setFetchingPage(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: SeoPageAnalysis }>({ mode: 'page', url: pageUrl })
      const imageTag = 'img'
      setHtml(
        `<main>\n${data.result.images.map((image) => `  <${imageTag} src="${escapeXml(image.src)}"${image.hasAltAttribute ? ` alt="${escapeXml(image.alt)}"` : ''} />`).join('\n')}\n</main>`
      )
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch images from the live URL')
    } finally {
      setFetchingPage(false)
    }
  }

  const report = useMemo(() => {
    const readAttr = (tag: string, name: string) => tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? ''
    const imageTagPattern = new RegExp('<' + 'img\\b[^>]*>', 'gi')
    const images = Array.from(html.matchAll(imageTagPattern)).map((match, index) => {
      const tag = match[0] ?? ''
      const src = readAttr(tag, 'src')
      const alt = readAttr(tag, 'alt')
      return {
        index: index + 1,
        src,
        alt,
        missing: !/\balt\s*=/.test(tag),
        decorative: /\balt\s*=/.test(tag) && alt === '',
        generic: /^(image|photo|picture|graphic|img|screenshot)$/i.test(alt),
      }
    })

    const duplicateMap = new Map<string, number>()
    for (const image of images) {
      if (!image.alt) continue
      duplicateMap.set(image.alt.toLowerCase(), (duplicateMap.get(image.alt.toLowerCase()) ?? 0) + 1)
    }
    const duplicates = images.filter((image) => image.alt && (duplicateMap.get(image.alt.toLowerCase()) ?? 0) > 1)
    const items: ScoreItem[] = [
      { label: 'Alt attribute present', ok: images.every((image) => !image.missing), detail: `${images.filter((image) => image.missing).length} image${images.filter((image) => image.missing).length === 1 ? '' : 's'} missing an alt attribute.` },
      { label: 'No generic alt text', ok: images.filter((image) => image.generic).length === 0, detail: `${images.filter((image) => image.generic).length} generic alt text value${images.filter((image) => image.generic).length === 1 ? '' : 's'} found.` },
      { label: 'Duplicate alt text limited', ok: duplicates.length === 0, detail: `${duplicates.length} image${duplicates.length === 1 ? '' : 's'} share duplicate alt text.` },
      { label: 'Decorative images intentional', ok: images.filter((image) => image.decorative).length <= 2, detail: `${images.filter((image) => image.decorative).length} empty alt value${images.filter((image) => image.decorative).length === 1 ? '' : 's'} found.` },
      { label: 'Images detected', ok: images.length > 0, detail: `${images.length} image${images.length === 1 ? '' : 's'} found in the pasted HTML.` },
    ]

    const csv = ['order,src,alt,signal']
      .concat(
        images.map((image) => {
          const signal = image.missing ? 'missing-alt' : image.generic ? 'generic-alt' : image.decorative ? 'decorative-empty-alt' : duplicates.some((row) => row.index === image.index) ? 'duplicate-alt' : 'ok'
          return `${image.index},"${image.src.replace(/"/g, '""')}","${image.alt.replace(/"/g, '""')}",${signal}`
        })
      )
      .join('\n')

    return { images, duplicates, items, csv }
  }, [html])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <Panel title="Image inputs">
        <Field label="Live page URL" value={pageUrl} onChange={setPageUrl} />
        <button type="button" onClick={fetchLiveImages} disabled={fetchingPage} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {fetchingPage ? 'Fetching images...' : 'Fetch live images'}
        </button>
        {fetchError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{fetchError}</p>}
        <TextArea
          label="Paste page HTML"
          value={html}
          onChange={setHtml}
          rows={13}
          hint="Paste rendered HTML or a content block to extract image sources and alt text before publishing."
        />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={report.items} />
        <CopyBox label="Image alt CSV" value={report.csv} />
      </div>
      <div className="lg:col-span-2">
        <Panel title="Alt text report">
          {report.images.length === 0 ? (
            <p className="text-sm text-gray-600">No images found in the pasted HTML.</p>
          ) : (
            <div className="space-y-2">
              {report.images.map((image) => {
                const signal = image.missing ? 'Missing alt' : image.generic ? 'Generic alt' : image.decorative ? 'Decorative empty alt' : report.duplicates.some((row) => row.index === image.index) ? 'Duplicate alt' : 'OK'
                return (
                  <div key={`${image.src}-${image.index}`} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">Image {image.index}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${signal === 'OK' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>{signal}</span>
                    </div>
                    <p className="mt-2 break-all text-xs text-gray-500">{image.src || '(missing src)'}</p>
                    <p className="mt-2 text-sm text-gray-700">{image.alt || '(empty alt text)'}</p>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState('https://example.com/landing-page')
  const [source, setSource] = useState('newsletter')
  const [medium, setMedium] = useState('email')
  const [campaign, setCampaign] = useState('free_seo_tools')
  const [term, setTerm] = useState('')
  const [content, setContent] = useState('cta_button')

  const result = useMemo(() => {
    try {
      const url = new URL(baseUrl)
      const params = new URLSearchParams(url.search)
      params.set('utm_source', source.trim())
      params.set('utm_medium', medium.trim())
      params.set('utm_campaign', campaign.trim())
      if (term.trim()) params.set('utm_term', term.trim())
      else params.delete('utm_term')
      if (content.trim()) params.set('utm_content', content.trim())
      else params.delete('utm_content')
      url.search = params.toString()
      return { url: url.toString(), valid: true }
    } catch {
      return { url: 'Enter a valid URL that starts with https://', valid: false }
    }
  }, [baseUrl, campaign, content, medium, source, term])
  const utmChecks: ScoreItem[] = [
    { label: 'Destination URL valid', ok: result.valid, detail: result.valid ? 'Campaign URL generated.' : result.url },
    { label: 'Source named', ok: source.trim().length > 0, detail: source || 'Add a traffic source such as google, newsletter, linkedin, or partner.' },
    { label: 'Medium named', ok: medium.trim().length > 0, detail: medium || 'Add a medium such as organic, cpc, email, social, or referral.' },
    { label: 'Campaign naming clean', ok: /^[a-z0-9_ -]+$/i.test(campaign) && !/\s{2,}/.test(campaign), detail: 'Keep campaign names consistent so GA4 reports stay readable.' },
    { label: 'Content variant tracked', ok: content.trim().length > 0, detail: content || 'Use utm_content when testing multiple links to the same page.' },
  ]
  const campaignCsv = csvRows(
    ['destination', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'final_url'],
    [[baseUrl, source, medium, campaign, term, content, result.url]]
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="UTM inputs">
        <Field label="Destination URL" value={baseUrl} onChange={setBaseUrl} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="utm_source" value={source} onChange={setSource} placeholder="google, newsletter, linkedin" />
          <Field label="utm_medium" value={medium} onChange={setMedium} placeholder="cpc, email, social" />
        </div>
        <Field label="utm_campaign" value={campaign} onChange={setCampaign} placeholder="summer_launch" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="utm_term (optional)" value={term} onChange={setTerm} placeholder="keyword or ad group" />
          <Field label="utm_content (optional)" value={content} onChange={setContent} placeholder="button_a" />
        </div>
        <Stat label="URL status" value={result.valid ? 'Valid' : 'Check URL'} detail="Use consistent lowercase names so analytics stays clean." highlight={result.valid} />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={utmChecks} />
        <CopyBox label="Campaign URL" value={result.url} downloadName="utm-campaign-url.txt" />
        <CopyBox label="Campaign tracking CSV" value={campaignCsv} downloadName="utm-campaign.csv" />
      </div>
    </div>
  )
}

function SlugGenerator() {
  const [title, setTitle] = useState('Free SEO Audit Tool for Small Websites')
  const [separator, setSeparator] = useState('-')
  const [lowercase, setLowercase] = useState('yes')
  const [maxLength, setMaxLength] = useState('70')

  const slug = makeSlug(title, separator, lowercase === 'yes', Number(maxLength) || 70)
  const words = keywordCore(title)
  const noStopwordSlug = makeSlug(words.join(' '), separator, lowercase === 'yes', Number(maxLength) || 70)
  const shortSlug = makeSlug(words.slice(0, 5).join(' '), separator, lowercase === 'yes', 55)
  const slugChecks: ScoreItem[] = [
    { label: 'Slug generated', ok: slug.length > 0, detail: slug || 'Add a phrase to generate a slug.' },
    { label: 'Readable length', ok: slug.length > 0 && slug.length <= 70, detail: `${slug.length} characters. Short readable slugs are easier to scan.` },
    { label: 'No date/filler overload', ok: !/\b(2023|2024|2025|2026|best|ultimate|complete)\b/i.test(slug), detail: 'Avoid dated or hype terms unless they are part of the actual query intent.' },
    { label: 'Uses clean separator', ok: !/--|__/.test(slug), detail: `Separator: ${separator === '-' ? 'hyphen' : 'underscore'}.` },
  ]
  const slugOutput = `Recommended slug:
${slug}

Short variant:
${shortSlug}

Stopword-light variant:
${noStopwordSlug}

Checks:
${slugChecks.map((item) => `- ${item.ok ? 'PASS' : 'FIX'}: ${item.label} — ${item.detail}`).join('\n')}`

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Slug inputs">
        <TextArea label="Page title or phrase" value={title} onChange={setTitle} rows={4} />
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Separator" value={separator} onChange={setSeparator} options={[{ label: 'Hyphen', value: '-' }, { label: 'Underscore', value: '_' }]} />
          <SelectField label="Case" value={lowercase} onChange={setLowercase} options={[{ label: 'Lowercase', value: 'yes' }, { label: 'Keep case', value: 'no' }]} />
          <Field label="Max length" value={maxLength} onChange={setMaxLength} type="number" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Slug length" value={`${slug.length}`} detail="Short, readable slugs are easier to scan." highlight={slug.length > 0 && slug.length <= 70} />
          <Stat label="Core terms" value={`${words.length}`} detail={words.slice(0, 5).join(', ') || 'Add descriptive words.'} highlight={words.length > 0} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={slugChecks} />
        <CopyBox label="SEO slug options" value={slugOutput} downloadName="seo-slug-options.txt" />
      </div>
    </div>
  )
}

function FaqSchemaGenerator() {
  const [pageUrl, setPageUrl] = useState('https://example.com/free-seo-tools')
  const [faqText, setFaqText] = useState('What is a free SEO tool?\nA free SEO tool helps you check or generate one useful SEO item without paying for a full platform.\n\nDoes schema guarantee rich results?\nNo. Schema can help search engines understand eligible content, but rich results are not guaranteed.\n\nShould FAQs be visible on the page?\nYes. FAQ schema should match questions and answers users can actually see.')

  const faqs = useMemo(() => {
    const blocks = faqText.split(/\n\s*\n/).map((block) => splitLines(block)).filter((block) => block.length >= 2)
    return blocks.map((block) => ({ question: block[0], answer: block.slice(1).join(' ') }))
  }, [faqText])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const output = `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`
  const duplicateQuestions = faqs.filter((faq, index) => faqs.findIndex((row) => row.question.toLowerCase() === faq.question.toLowerCase()) !== index)
  const faqChecks: ScoreItem[] = [
    { label: 'Enough FAQs', ok: faqs.length >= 2, detail: `${faqs.length} valid question-answer block${faqs.length === 1 ? '' : 's'} found.` },
    { label: 'No duplicate questions', ok: duplicateQuestions.length === 0, detail: `${duplicateQuestions.length} duplicate question${duplicateQuestions.length === 1 ? '' : 's'} found.` },
    { label: 'Answers are substantial', ok: faqs.every((faq) => faq.answer.length >= 35), detail: 'Short one-word answers are rarely useful for users or structured data.' },
    { label: 'Page URL valid', ok: /^https?:\/\//i.test(pageUrl), detail: pageUrl || 'Add the page where the visible FAQ appears.' },
    { label: 'Visible content reminder', ok: true, detail: 'Only add FAQ schema when the same questions and answers are visible on the page.' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="FAQ schema inputs">
        <Field label="Page URL" value={pageUrl} onChange={setPageUrl} />
        <TextArea label="Questions and answers" value={faqText} onChange={setFaqText} rows={12} hint="Use one question, then its answer, then a blank line before the next FAQ." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="FAQ count" value={`${faqs.length}`} detail="Use only FAQs visible on the page." highlight={faqs.length >= 2} />
          <Stat label="Page URL" value={pageUrl.startsWith('http') ? 'Valid' : 'Missing'} detail="Keep schema tied to a real page." highlight={pageUrl.startsWith('http')} />
        </div>
      </Panel>
      <div className="space-y-4">
        <ScoreList items={faqChecks} />
        <CopyBox label="FAQ JSON-LD" value={output} downloadName="faq-schema.jsonld" />
      </div>
    </div>
  )
}

function CanonicalTagChecker() {
  const [pageUrl, setPageUrl] = useState('https://example.com/free-seo-tools?utm_source=newsletter')
  const [canonicalUrl, setCanonicalUrl] = useState('https://example.com/free-seo-tools')
  const [robots, setRobots] = useState('index')
  const [duplicates, setDuplicates] = useState('https://example.com/free-seo-tools/\nhttps://www.example.com/free-seo-tools\nhttps://example.com/free-seo-tools?utm_source=ad')
  const [fetchingPage, setFetchingPage] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const normalize = (value: string) => {
    try {
      const url = new URL(value)
      url.hash = ''
      url.search = ''
      return url.toString().replace(/\/$/, '')
    } catch {
      return ''
    }
  }
  const pageNormalized = normalize(pageUrl)
  const canonicalNormalized = normalize(canonicalUrl)
  const duplicateRows = splitLines(duplicates)
  const matchingDuplicates = duplicateRows.filter((row) => normalize(row) === canonicalNormalized).length
  const items: ScoreItem[] = [
    { label: 'Canonical URL is valid', ok: canonicalNormalized.length > 0, detail: canonicalUrl },
    { label: 'Page and canonical align', ok: pageNormalized === canonicalNormalized || pageUrl.includes('?'), detail: pageNormalized === canonicalNormalized ? 'Self-referencing canonical.' : 'Parameter or duplicate URL can canonicalize to the clean URL.' },
    { label: 'Page is indexable', ok: robots === 'index', detail: robots === 'index' ? 'Indexable page can use a canonical hint.' : 'Do not canonicalize noindex pages unless you understand the tradeoff.' },
    { label: 'Duplicates point to canonical', ok: duplicateRows.length === 0 || matchingDuplicates > 0, detail: `${matchingDuplicates} duplicate examples normalize to the canonical target.` },
  ]
  const fetchCanonical = async () => {
    setFetchingPage(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: SeoPageAnalysis }>({ mode: 'page', url: pageUrl })
      setPageUrl(data.result.finalUrl || pageUrl)
      setCanonicalUrl(data.result.canonical || data.result.finalUrl || canonicalUrl)
      setRobots(data.result.robots.toLowerCase().includes('noindex') ? 'noindex' : 'index')
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch canonical data')
    } finally {
      setFetchingPage(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Canonical inputs">
        <Field label="Current page URL" value={pageUrl} onChange={setPageUrl} />
        <button type="button" onClick={fetchCanonical} disabled={fetchingPage} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {fetchingPage ? 'Fetching canonical...' : 'Fetch live canonical'}
        </button>
        {fetchError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{fetchError}</p>}
        <Field label="Canonical URL" value={canonicalUrl} onChange={setCanonicalUrl} />
        <SelectField label="Robots state" value={robots} onChange={setRobots} options={[{ label: 'Indexable', value: 'index' }, { label: 'Noindex', value: 'noindex' }]} />
        <TextArea label="Duplicate or parameter URL examples" value={duplicates} onChange={setDuplicates} rows={5} />
        <CopyBox label="Canonical tag" value={`<link rel="canonical" href="${canonicalUrl}" />`} />
      </Panel>
      <ScoreList items={items} />
    </div>
  )
}

function RedirectChainChecker() {
  const [liveUrl, setLiveUrl] = useState('http://example.com/page')
  const [chainText, setChainText] = useState('http://example.com/page 301\nhttps://example.com/page 301\nhttps://www.example.com/page 200')
  const [tracing, setTracing] = useState(false)
  const [traceError, setTraceError] = useState('')
  const [traceChain, setTraceChain] = useState<RedirectHop[]>([])

  const hops = splitLines(chainText).map((line) => {
    const statusMatch = line.match(/\b([12345]\d{2})\b/)
    const urlMatch = line.match(/https?:\/\/\S+/)
    return { line, url: urlMatch?.[0] ?? line, status: statusMatch?.[1] ?? 'unknown' }
  })
  const finalHop = hops[hops.length - 1]
  const uniqueUrls = new Set(hops.map((hop) => hop.url))
  const loop = uniqueUrls.size < hops.length
  const tooMany = hops.length > 3
  const finalOk = finalHop?.status === '200'
  const traceLiveRedirects = async () => {
    setTracing(true)
    setTraceError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; chain: RedirectHop[]; limit: number }>({ mode: 'redirects', url: liveUrl })
      setTraceChain(data.chain)
      setChainText(data.chain.map((hop) => `${hop.url} ${hop.status ?? hop.error ?? ''}`).join('\n'))
    } catch (error) {
      setTraceError(error instanceof Error ? error.message : 'Could not trace redirects')
    } finally {
      setTracing(false)
    }
  }
  const traceCsv = csvRows(
    ['hop', 'url', 'status', 'location', 'error'],
    traceChain.map((hop, index) => [index + 1, hop.url, hop.status ?? '', hop.location, hop.error ?? ''])
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Redirect chain inputs">
        <Field label="Live URL to trace" value={liveUrl} onChange={setLiveUrl} />
        <button type="button" onClick={traceLiveRedirects} disabled={tracing} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {tracing ? 'Tracing redirects...' : 'Trace live redirects'}
        </button>
        {traceError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{traceError}</p>}
        <TextArea label="Paste redirect chain" value={chainText} onChange={setChainText} rows={9} hint="Paste one hop per line with the URL and status code, for example: http://example.com 301." />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Hops" value={`${hops.length}`} detail={tooMany ? 'Try to reduce to one redirect.' : 'Short chain.'} highlight={!tooMany} />
          <Stat label="Final status" value={finalHop?.status ?? 'None'} detail="Final URL should usually return 200." highlight={finalOk} />
          <Stat label="Loop check" value={loop ? 'Loop risk' : 'No loop'} detail="Repeated URLs can indicate a redirect loop." highlight={!loop} />
        </div>
      </Panel>
      <div className="space-y-3">
        {hops.map((hop, index) => (
          <div key={`${hop.url}-${index}`} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Hop {index + 1}</p>
            <p className="mt-1 break-all text-sm font-medium text-gray-900">{hop.url}</p>
            <p className="mt-1 text-xs text-gray-500">Status: {hop.status}</p>
          </div>
        ))}
        {traceChain.length > 0 && <CopyBox label="Redirect trace CSV" value={traceCsv} downloadName="redirect-trace.csv" />}
      </div>
    </div>
  )
}

function BrokenLinkChecker() {
  const [baseUrl, setBaseUrl] = useState('https://freeltools.com/tools/category/seo-tools')
  const [input, setInput] = useState('<a href="https://example.com/">Home</a>\n<a href="/old-page">Old page</a>\n<a href="#">Empty anchor</a>\nhttps://example.com/missing 404\nhttps://example.com/server-error 500')
  const [checkingLinks, setCheckingLinks] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [checkedLinks, setCheckedLinks] = useState<LinkStatusResult[]>([])

  const links = useMemo(() => {
    const htmlLinks = Array.from(input.matchAll(/href=["']([^"']+)["']/gi)).map((match) => match[1])
    const lineLinks = splitLines(input)
      .filter((line) => !line.includes('href='))
      .map((line) => {
        const status = line.match(/\b([12345]\d{2})\b/)?.[1]
        const url = line.match(/(https?:\/\/\S+|\/[^\s]+)/)?.[1]
        return url ? { url, status } : null
      })
      .filter((item): item is { url: string; status: string | undefined } => Boolean(item))
    return [...htmlLinks.map((url) => ({ url, status: undefined })), ...lineLinks]
  }, [input])

  const checkedByUrl = new Map<string, LinkStatusResult>()
  for (const link of checkedLinks) {
    checkedByUrl.set(link.inputUrl, link)
    checkedByUrl.set(link.url, link)
  }
  const broken = links.filter((link) => {
    const live = checkedByUrl.get(link.url)
    return live ? !live.ok : link.status?.startsWith('4') || link.status?.startsWith('5') || link.url === '#' || link.url.trim() === ''
  })
  const internal = links.filter((link) => link.url.startsWith('/')).length
  const external = links.filter((link) => /^https?:\/\//.test(link.url)).length
  const runLiveCheck = async () => {
    setCheckingLinks(true)
    setCheckError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; results: LinkStatusResult[]; limit: number }>({
        mode: 'links',
        baseUrl,
        urls: links.map((link) => link.url).filter((url) => url && url !== '#'),
      })
      setCheckedLinks(data.results)
    } catch (error) {
      setCheckError(error instanceof Error ? error.message : 'Could not check link statuses')
    } finally {
      setCheckingLinks(false)
    }
  }
  const liveCsv = csvRows(
    ['url', 'status', 'ok', 'finalUrl', 'error'],
    checkedLinks.map((link) => [link.inputUrl || link.url, link.status ?? '', link.ok ? 'yes' : 'no', link.finalUrl, link.error ?? ''])
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Link inputs">
        <Field label="Base URL for relative links" value={baseUrl} onChange={setBaseUrl} />
        <TextArea label="Paste HTML, URLs, or URL status rows" value={input} onChange={setInput} rows={12} hint="For status checks, paste rows like https://example.com/missing 404 from a crawler export." />
        <button type="button" onClick={runLiveCheck} disabled={checkingLinks || links.length === 0} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {checkingLinks ? 'Checking links...' : 'Check live statuses'}
        </button>
        {checkError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{checkError}</p>}
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Links found" value={`${links.length}`} detail={`${internal} internal, ${external} external`} highlight={links.length > 0} />
          <Stat label="Broken signals" value={`${broken.length}`} detail="Includes 4xx, 5xx, and empty # anchors." highlight={broken.length === 0} />
          <Stat label="Live checked" value={`${checkedLinks.length}`} detail="Up to 25 public URLs per run." highlight={checkedLinks.length > 0} />
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel title="Broken or risky links">
          {broken.length === 0 ? (
            <p className="text-sm text-gray-600">No obvious broken links found in the pasted input.</p>
          ) : (
            <div className="space-y-2">
              {broken.map((link, index) => {
                const live = checkedByUrl.get(link.url)
                return (
                  <p key={`${link.url}-${index}`} className="break-all rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    {link.url} {live ? `· ${live.status ?? live.error ?? 'failed'}` : link.status ? `· ${link.status}` : '· empty or placeholder link'}
                  </p>
                )
              })}
            </div>
          )}
        </Panel>
        {checkedLinks.length > 0 && <CopyBox label="Live link status CSV" value={liveCsv} downloadName="live-link-status.csv" />}
      </div>
    </div>
  )
}


function RobotsMetaTagChecker() {
  const [pageUrl, setPageUrl] = useState('https://freeltools.com/tools/on-page-seo-checker')
  const [html, setHtml] = useState('<!doctype html>\n<html>\n<head>\n<meta name="robots" content="index, follow">\n<link rel="canonical" href="https://example.com/page">\n</head>\n<body><h1>Example page</h1></body>\n</html>')
  const [headerNotes, setHeaderNotes] = useState('x-robots-tag: index, follow')
  const [fetchingPage, setFetchingPage] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const result = useMemo(() => {
    const readAttr = (tag: string, name: string) => tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1] ?? ''
    const metaTags = html.match(/<meta\b[^>]*>/gi) ?? []
    const robots = metaTags
      .map((tag) => ({ name: readAttr(tag, 'name'), content: readAttr(tag, 'content') }))
      .filter((row) => ['robots', 'googlebot', 'bingbot'].includes(row.name.toLowerCase()))
    const canonicalTag = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] ?? html.match(/<link\b[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["'][^>]*>/i)?.[0]) ?? ''
    const canonical = canonicalTag ? readAttr(canonicalTag, 'href') : ''
    const combined = [...robots.map((row) => row.content), headerNotes].join(' ').toLowerCase()
    const hasNoindex = combined.includes('noindex')
    const hasIndex = /\bindex\b/.test(combined) && !hasNoindex
    const hasNofollow = combined.includes('nofollow')
    const conflicts = combined.includes('index') && combined.includes('noindex')
    const headerHasRobots = /x-robots-tag/i.test(headerNotes)
    const items: ScoreItem[] = [
      { label: 'No accidental noindex', ok: !hasNoindex, detail: hasNoindex ? 'Noindex found. Confirm this is intentional before requesting indexing.' : 'No noindex directive found.' },
      { label: 'No robots conflict', ok: !conflicts, detail: conflicts ? 'Both index and noindex signals appear in the pasted data.' : 'No obvious index/noindex conflict.' },
      { label: 'Follow links allowed', ok: !hasNofollow, detail: hasNofollow ? 'Nofollow found. Check whether internal links should pass discovery signals.' : 'No nofollow directive found.' },
      { label: 'Canonical present', ok: canonical.startsWith('http'), detail: canonical || 'No canonical tag found in pasted HTML.' },
      { label: 'Header notes reviewed', ok: headerNotes.trim().length > 0, detail: headerHasRobots ? 'X-Robots-Tag header note included.' : 'No X-Robots-Tag note detected.' },
    ]
    return { robots, canonical, hasIndex, items }
  }, [headerNotes, html])
  const fetchRobotsMeta = async () => {
    setFetchingPage(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: SeoPageAnalysis }>({ mode: 'page', url: pageUrl })
      const page = data.result
      setHtml(`<!doctype html>
<html>
<head>
${page.robots ? `<meta name="robots" content="${escapeXml(page.robots)}">` : ''}
${page.canonical ? `<link rel="canonical" href="${escapeXml(page.canonical)}">` : ''}
</head>
<body><h1>${escapeXml(page.h1 || page.title)}</h1></body>
</html>`)
      setHeaderNotes(`status: ${page.status}\nfinal-url: ${page.finalUrl}`)
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch robots meta data')
    } finally {
      setFetchingPage(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Robots inputs">
        <Field label="Live page URL" value={pageUrl} onChange={setPageUrl} />
        <button type="button" onClick={fetchRobotsMeta} disabled={fetchingPage} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {fetchingPage ? 'Fetching robots tags...' : 'Fetch live robots tags'}
        </button>
        {fetchError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{fetchError}</p>}
        <TextArea label="Paste page HTML" value={html} onChange={setHtml} rows={10} hint="Paste rendered HTML, page source, or the head section from a page you want indexed." />
        <TextArea label="Header notes" value={headerNotes} onChange={setHeaderNotes} rows={4} hint="Paste X-Robots-Tag or crawler header notes when available." />
        <CopyBox label="Clean indexable default" value={'<meta name="robots" content="index, follow" />'} />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={result.items} />
        <Panel title="Detected robots tags">
          {result.robots.length === 0 ? (
            <p className="text-sm text-gray-600">No robots meta tags found in the pasted HTML.</p>
          ) : (
            <div className="space-y-2">
              {result.robots.map((row, index) => (
                <p key={`${row.name}-${index}`} className="rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
                  <strong className="text-gray-900">{row.name}</strong>: {row.content || 'empty content'}
                </p>
              ))}
            </div>
          )}
          <p className="mt-3 break-all text-xs leading-5 text-gray-500">Canonical: {result.canonical || 'not found'}</p>
        </Panel>
      </div>
    </div>
  )
}

function InternalLinkAnchorTextChecker() {
  const [domain, setDomain] = useState('freeltools.com')
  const [html, setHtml] = useState('<main>\n<a href="/tools/on-page-seo-checker">on-page SEO checker</a>\n<a href="/tools/schema-markup-generator">schema markup generator</a>\n<a href="/blog/seo-audit-checklist">read more</a>\n<a href="#">click here</a>\n</main>')
  const report = useMemo(() => {
    const generic = /^(click here|read more|learn more|more|here|this|link|visit|details)$/i
    const readAttr = (tag: string, name: string) => tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1] ?? ''
    const rows = Array.from(html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)).map((match) => {
      const attrs = match[1] ?? ''
      const href = readAttr(attrs, 'href')
      const text = (match[2] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const rel = readAttr(attrs, 'rel')
      let internal = href.startsWith('/') && !href.startsWith('//')
      try {
        const parsed = new URL(href)
        internal = parsed.hostname.replace(/^www\./, '') === domain.replace(/^www\./, '')
      } catch {
        internal = internal || href.startsWith('#')
      }
      return { href, text, rel, internal, generic: generic.test(text), empty: text.length === 0 || href === '#' }
    })
    const anchorTargets = new Map<string, Set<string>>()
    for (const row of rows.filter((item) => item.internal && item.text)) {
      const key = row.text.toLowerCase()
      const targets = anchorTargets.get(key) ?? new Set<string>()
      targets.add(row.href)
      anchorTargets.set(key, targets)
    }
    const conflicts = Array.from(anchorTargets.entries()).filter(([, urls]) => urls.size > 1)
    const internalRows = rows.filter((row) => row.internal)
    const weak = internalRows.filter((row) => row.generic || row.empty || /nofollow/i.test(row.rel))
    const items: ScoreItem[] = [
      { label: 'Internal links found', ok: internalRows.length >= 3, detail: `${internalRows.length} internal links found in pasted HTML.` },
      { label: 'Few generic anchors', ok: internalRows.filter((row) => row.generic).length === 0, detail: `${internalRows.filter((row) => row.generic).length} generic anchors found.` },
      { label: 'No empty or placeholder anchors', ok: internalRows.filter((row) => row.empty).length === 0, detail: `${internalRows.filter((row) => row.empty).length} empty or # anchors found.` },
      { label: 'No nofollow internal links', ok: internalRows.filter((row) => /nofollow/i.test(row.rel)).length === 0, detail: `${internalRows.filter((row) => /nofollow/i.test(row.rel)).length} nofollow internal links found.` },
      { label: 'No anchor conflicts', ok: conflicts.length === 0, detail: `${conflicts.length} repeated anchor texts point to multiple URLs.` },
    ]
    return { rows, internalRows, weak, conflicts, items }
  }, [domain, html])

  const csv = ['type,anchor,href,rel'].concat(report.rows.map((row) => `${row.internal ? 'internal' : 'external'},"${row.text.replace(/"/g, '""')}","${row.href.replace(/"/g, '""')}","${row.rel.replace(/"/g, '""')}"`)).join('\n')

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <Panel title="Link inputs">
        <Field label="Your domain" value={domain} onChange={setDomain} />
        <TextArea label="Paste page HTML" value={html} onChange={setHtml} rows={13} hint="Paste rendered HTML for one page. Relative links and links to your domain count as internal." />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={report.items} />
        <CopyBox label="Link CSV" value={csv} />
      </div>
      <div className="lg:col-span-2">
        <Panel title="Anchor text report">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="text-gray-400">
                <tr><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Anchor</th><th className="py-2 pr-3">Target</th><th className="py-2 pr-3">Signal</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {report.rows.map((row, index) => (
                  <tr key={`${row.href}-${index}`}>
                    <td className="py-2 pr-3">{row.internal ? 'Internal' : 'External'}</td>
                    <td className="py-2 pr-3">{row.text || '(empty)'}</td>
                    <td className="max-w-sm break-all py-2 pr-3">{row.href}</td>
                    <td className="py-2 pr-3">{row.empty ? 'Fix empty' : row.generic ? 'Generic' : /nofollow/i.test(row.rel) ? 'Nofollow' : 'OK'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}

function OpenGraphPreviewTool() {
  const [title, setTitle] = useState('Free SEO Tools for Small Websites')
  const [description, setDescription] = useState('Audit pages, generate schema, preview snippets, build sitemaps, and check content quality with free SEO tools.')
  const [url, setUrl] = useState('https://freeltools.com/tools/category/seo-tools')
  const [imageUrl, setImageUrl] = useState('https://freeltools.com/opengraph-image')
  const [fetchingPage, setFetchingPage] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const fetchOpenGraph = async () => {
    setFetchingPage(true)
    setFetchError('')
    try {
      const data = await postSeoAnalysis<{ ok: true; result: SeoPageAnalysis }>({ mode: 'page', url })
      const page = data.result
      setTitle(page.ogTitle || page.twitterTitle || page.title || title)
      setDescription(page.ogDescription || page.twitterDescription || page.description || description)
      setImageUrl(page.ogImage || page.twitterImage || imageUrl)
      setUrl(page.finalUrl || url)
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Could not fetch Open Graph tags')
    } finally {
      setFetchingPage(false)
    }
  }

  const tags = `<meta property="og:title" content="${escapeXml(title)}" />
<meta property="og:description" content="${escapeXml(description)}" />
<meta property="og:url" content="${escapeXml(url)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${escapeXml(imageUrl)}" />
<meta name="twitter:card" content="summary_large_image" />`
  const ogChecks: ScoreItem[] = [
    { label: 'Share title readable', ok: title.length > 10 && title.length <= 80, detail: `${title.length} characters.` },
    { label: 'Share description readable', ok: description.length > 40 && description.length <= 220, detail: `${description.length} characters.` },
    { label: 'Page URL valid', ok: /^https?:\/\//i.test(url), detail: url },
    { label: 'Image URL valid', ok: /^https?:\/\//i.test(imageUrl), detail: imageUrl || 'Add a 1200x630-ish absolute image URL.' },
    { label: 'Large card configured', ok: tags.includes('summary_large_image'), detail: 'Twitter/X card uses summary_large_image.' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Open Graph inputs">
        <Field label="OG title" value={title} onChange={setTitle} />
        <TextArea label="OG description" value={description} onChange={setDescription} rows={3} />
        <Field label="Page URL" value={url} onChange={setUrl} />
        <Field label="Image URL" value={imageUrl} onChange={setImageUrl} />
        <button type="button" onClick={fetchOpenGraph} disabled={fetchingPage} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.96]">
          {fetchingPage ? 'Fetching OG tags...' : 'Fetch live OG tags'}
        </button>
        {fetchError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">{fetchError}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Title length" value={`${title.length}`} detail="Keep it readable in cards." highlight={title.length <= 70} />
          <Stat label="Description length" value={`${description.length}`} detail="Short descriptions are easier to share." highlight={description.length <= 200} />
        </div>
      </Panel>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div
            className="flex aspect-[1.91/1] items-center justify-center bg-gray-100 bg-cover bg-center text-center text-xs text-gray-500"
            style={/^https?:\/\//i.test(imageUrl) ? { backgroundImage: `url("${imageUrl.replace(/"/g, '%22')}")` } : undefined}
          >
            {/^https?:\/\//i.test(imageUrl) ? (
              <span className="sr-only">Open Graph image preview</span>
            ) : (
              <span className="break-all p-4">{imageUrl || 'Add an image URL'}</span>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">{slugHost(url) || 'example.com'}</p>
            <h3 className="mt-1 text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">{description}</p>
          </div>
        </div>
        <ScoreList items={ogChecks} />
        <CopyBox label="Open Graph tags" value={tags} downloadName="open-graph-tags.html" />
      </div>
    </div>
  )
}

function KeywordClusteringTool() {
  const [keywords, setKeywords] = useState('seo audit tool\nfree seo audit tool\non page seo checker\nschema markup generator\nfaq schema generator\nrobots txt generator\nxml sitemap generator\nsitemap generator free\nkeyword density checker\nkeyword stuffing checker')
  const [primaryTopic, setPrimaryTopic] = useState('free seo tools')

  const clusters = useMemo(() => {
    const rows = splitLines(keywords)
    const genericTerms = new Set(['free', 'tool', 'tools', 'generator', 'checker', 'online', 'seo'])
    const intentFor = (keyword: string) => {
      if (/\b(vs|alternative|best|compare|comparison)\b/i.test(keyword)) return 'comparison'
      if (/\b(template|example|sample|checklist)\b/i.test(keyword)) return 'template'
      if (/\b(how|what|why|guide|learn)\b/i.test(keyword)) return 'guide'
      if (/\b(calculator|calculate|price|cost|fee)\b/i.test(keyword)) return 'calculator'
      if (/\b(generator|generate|builder|maker)\b/i.test(keyword)) return 'generator'
      if (/\b(checker|audit|test|validator|analyzer)\b/i.test(keyword)) return 'checker'
      return 'tool'
    }
    const grouped = new Map<string, { intent: string; rows: string[]; terms: Set<string> }>()
    for (const row of rows) {
      const terms = keywordCore(row)
      const label = terms.find((term) => !genericTerms.has(term)) ?? terms[0] ?? 'misc'
      const intent = intentFor(row)
      const key = `${label}:${intent}`
      const existing = grouped.get(key) ?? { intent, rows: [], terms: new Set<string>() }
      existing.rows.push(row)
      terms.forEach((term) => existing.terms.add(term))
      grouped.set(key, existing)
    }
    return Array.from(grouped.entries())
      .map(([key, group]) => {
        const [label] = key.split(':')
        const primary = group.rows.slice().sort((a, b) => a.length - b.length)[0] ?? label
        const sharedWithTopic = keywordCore(primaryTopic).filter((term) => group.terms.has(term)).length
        return {
          label,
          intent: group.intent,
          rows: group.rows,
          primary,
          sharedWithTopic,
          terms: Array.from(group.terms).filter((term) => !genericTerms.has(term)).slice(0, 8),
        }
      })
      .sort((a, b) => b.rows.length - a.rows.length || b.sharedWithTopic - a.sharedWithTopic)
  }, [keywords, primaryTopic])

  const output = clusters.map((cluster) => `# ${titleCase(cluster.label)} (${cluster.intent})
Primary page/query: ${cluster.primary}
Supporting terms: ${cluster.terms.join(', ') || 'review manually'}
Recommended action: ${cluster.rows.length >= 3 ? 'Build or strengthen one hub page, then add supporting sections.' : 'Fold into the closest existing page unless SERP intent is clearly different.'}

${cluster.rows.map((row) => `- ${row}`).join('\n')}`).join('\n\n')
  const clusterCsv = csvRows(
    ['cluster', 'intent', 'primary', 'keyword', 'recommended_action'],
    clusters.flatMap((cluster) =>
      cluster.rows.map((row) => [
        titleCase(cluster.label),
        cluster.intent,
        cluster.primary,
        row,
        cluster.rows.length >= 3 ? 'hub-or-strengthened-page' : 'fold-into-existing-page',
      ])
    )
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Keyword inputs">
        <Field label="Primary topic" value={primaryTopic} onChange={setPrimaryTopic} />
        <TextArea label="Keyword list" value={keywords} onChange={setKeywords} rows={12} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Keywords" value={`${splitLines(keywords).length}`} detail="One keyword per line." highlight />
          <Stat label="Clusters" value={`${clusters.length}`} detail="Grouped by dominant non-generic term." highlight={clusters.length > 0} />
        </div>
      </Panel>
      <div className="space-y-4">
        <CopyBox label="Keyword clusters" value={output} downloadName="keyword-clusters.md" />
        <CopyBox label="Cluster CSV" value={clusterCsv} downloadName="keyword-clusters.csv" />
      </div>
    </div>
  )
}

function KeywordCannibalizationChecker() {
  const [rows, setRows] = useState('seo audit tool | /tools/on-page-seo-audit-tool | On-Page SEO Audit Tool | 120 | 4\nseo audit tool | /blog/seo-audit-checklist | SEO Audit Checklist | 85 | 1\nschema markup generator | /tools/schema-markup-generator | Schema Markup Generator | 60 | 3\nfaq schema generator | /tools/faq-schema-generator | FAQ Schema Generator | 44 | 2')

  const grouped = useMemo(() => {
    const map = new Map<string, { url: string; title: string; impressions: number; clicks: number; intentKey: string }[]>()
    for (const line of splitLines(rows)) {
      const [keyword = '', url = '', title = '', impressions = '0', clicks = '0'] = line.split('|').map((part) => part.trim())
      if (!keyword || !url) continue
      const intentKey = keywordCore(keyword).filter((term) => !['free', 'tool', 'tools', 'online'].includes(term)).sort().join(' ')
      map.set(keyword.toLowerCase(), [...(map.get(keyword.toLowerCase()) ?? []), { url, title, impressions: Number(impressions) || 0, clicks: Number(clicks) || 0, intentKey }])
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [rows])

  const risks = grouped.filter(([, pages]) => new Set(pages.map((page) => page.url)).size > 1)
  const nearIntent = new Map<string, { keyword: string; url: string; title: string; impressions: number; clicks: number }[]>()
  grouped.forEach(([keyword, pages]) => {
    pages.forEach((page) => {
      if (!page.intentKey) return
      nearIntent.set(page.intentKey, [...(nearIntent.get(page.intentKey) ?? []), { keyword, ...page }])
    })
  })
  const nearRisks = Array.from(nearIntent.entries()).filter(([, pages]) => new Set(pages.map((page) => page.url)).size > 1)
  const report = csvRows(
    ['keyword_or_intent', 'url', 'title', 'impressions', 'clicks', 'signal', 'recommended_action'],
    [
      ...risks.flatMap(([keyword, pages]) =>
        pages.map((page) => [
          keyword,
          page.url,
          page.title,
          page.impressions,
          page.clicks,
          'same-keyword-conflict',
          page.clicks > 0 ? 'protect-or-merge-carefully' : 'differentiate-merge-or-redirect',
        ])
      ),
      ...nearRisks.flatMap(([intent, pages]) =>
        pages.map((page) => [
          intent,
          page.url,
          page.title,
          page.impressions,
          page.clicks,
          'near-intent-overlap',
          'review-serp-intent-and-internal-links',
        ])
      ),
    ]
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Cannibalization inputs">
        <TextArea label="Keyword | URL | Title | Impressions | Clicks rows" value={rows} onChange={setRows} rows={12} hint="Paste GSC or keyword-map rows separated by pipes. Impressions/clicks are optional but help prioritize." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Keyword groups" value={`${grouped.length}`} detail="Unique target keywords found." highlight />
          <Stat label="Possible conflicts" value={`${risks.length + nearRisks.length}`} detail="Same-keyword and near-intent overlaps." highlight={risks.length + nearRisks.length === 0} />
        </div>
      </Panel>
      <div className="space-y-4">
        <Panel title="Cannibalization report">
          {grouped.map(([keyword, pages]) => (
            <div key={keyword} className={`rounded-xl border p-3 ${pages.length > 1 ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
              <p className="text-sm font-semibold text-gray-900">{keyword}</p>
              <div className="mt-2 space-y-1">
                {pages.map((page) => (
                  <p key={`${keyword}-${page.url}`} className="break-all text-xs leading-5 text-gray-600">
                    {page.url} {page.title ? `· ${page.title}` : ''} {page.impressions || page.clicks ? `· ${page.impressions} impressions · ${page.clicks} clicks` : ''}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Panel>
        <CopyBox label="Cannibalization action CSV" value={report} downloadName="keyword-cannibalization-report.csv" />
      </div>
    </div>
  )
}

function ContentBriefGenerator() {
  const [keyword, setKeyword] = useState('free seo audit tool')
  const [audience, setAudience] = useState('small business owners and freelancers')
  const [pageType, setPageType] = useState('tool page')
  const [competitors, setCompetitors] = useState('SEO checker tools that only show a score\nPaid audit platforms that require signup\nBlog posts with checklists but no working tool')
  const [primaryToolUrl, setPrimaryToolUrl] = useState('/tools/on-page-seo-audit-tool')
  const [conversionAction, setConversionAction] = useState('run the free SEO audit tool')
  const [serpFormat, setSerpFormat] = useState('tool-first page with supporting guide')

  const brief = useMemo(() => {
    const related = keywordCore(keyword).filter((term) => term !== 'free')
    const competitorAngles = splitLines(competitors)
    const titleOptions = [
      `Free ${titleCase(keyword)} | No Signup`,
      `${titleCase(keyword)}: Practical Workflow and Tool`,
      `How to Use a ${titleCase(keyword)} Before Publishing`,
    ]
    return `# SEO Content Brief: ${titleCase(keyword)}

## Search intent
People searching "${keyword}" want a practical ${pageType} for ${audience}. The expected SERP format is: ${serpFormat}. The page should answer the query quickly and let the visitor act without a signup wall.

## Title options
${titleOptions.map((titleOption) => `- ${titleOption}`).join('\n')}

## H1
${titleCase(keyword)}

## First-screen answer
Use this page to ${pageType.includes('tool') ? 'run the tool immediately' : 'get the answer quickly'}, then explain the workflow, limitations, and next step below the main action. The first visible CTA should invite visitors to ${conversionAction}.

## Tool or CTA path
Primary action: ${conversionAction}
Primary URL: ${primaryToolUrl}

## Recommended outline
| Section | Job |
|---|---|
| Direct answer | Define the task and the result in 2-3 sentences. |
| Working tool or template | Let the visitor complete the job before the long explanation. |
| How to use the output | Explain each input, result, score, or export. |
| Example workflow | Show a realistic before/after or checklist. |
| Mistakes to avoid | Cover risky SEO shortcuts, thin content, fake guarantees, or invalid schema. |
| Related tools | Link to the next useful FreelTools SEO tool. |
| FAQ | Answer exact objections and People Also Ask style questions. |

## Terms and entities to cover
${related.map((term) => `- ${term}`).join('\n')}

## Competitor gaps to beat
${competitorAngles.map((angle) => `- ${angle}`).join('\n')}

## FAQ ideas
- What is ${keyword}?
- Is this tool free?
- What should I do after using it?
- Does this replace a full SEO audit?
- How accurate is the result?
- What should I check manually after using it?

## Internal links
- Link to the SEO Tools category
- Link to ${primaryToolUrl}
- Link to related schema, meta, sitemap, or content tools when relevant

## Schema and rich-result notes
- Use SoftwareApplication schema for a working tool page.
- Use FAQPage schema only when the FAQ is visible on the page.
- Use Article schema for supporting guides.
- Do not add fake ratings, fake review counts, or hidden FAQ content.

## Acceptance checklist
- The first screen states the offer and shows the action.
- The tool or template works without login.
- The page includes at least one example, one export/copy action, and related internal links.
- Title, meta, canonical, schema, mobile layout, and sitemap inclusion are checked before publish.

## CTA
Use the free tool, copy the output, then run the next SEO QA step before publishing.`
  }, [audience, competitors, conversionAction, keyword, pageType, primaryToolUrl, serpFormat])
  const briefChecks: ScoreItem[] = [
    { label: 'Keyword defined', ok: keyword.trim().length > 0, detail: keyword || 'Add a primary keyword.' },
    { label: 'Audience defined', ok: audience.trim().length > 0, detail: audience || 'Add the target reader.' },
    { label: 'Competitor gaps captured', ok: splitLines(competitors).length >= 2, detail: `${splitLines(competitors).length} gap note${splitLines(competitors).length === 1 ? '' : 's'} included.` },
    { label: 'Tool/CTA path included', ok: primaryToolUrl.trim().length > 0 && conversionAction.trim().length > 0, detail: `${conversionAction} → ${primaryToolUrl}` },
    { label: 'SERP format named', ok: serpFormat.trim().length > 0, detail: serpFormat },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Brief inputs">
        <Field label="Target keyword" value={keyword} onChange={setKeyword} />
        <Field label="Audience" value={audience} onChange={setAudience} />
        <SelectField
          label="Page type"
          value={pageType}
          onChange={setPageType}
          options={[
            { label: 'Tool page', value: 'tool page' },
            { label: 'Blog post', value: 'blog post' },
            { label: 'Category page', value: 'category page' },
            { label: 'Landing page', value: 'landing page' },
          ]}
        />
        <Field label="SERP format to beat" value={serpFormat} onChange={setSerpFormat} />
        <Field label="Primary tool or CTA URL" value={primaryToolUrl} onChange={setPrimaryToolUrl} />
        <Field label="Conversion action" value={conversionAction} onChange={setConversionAction} />
        <TextArea label="Competitor gaps or SERP notes" value={competitors} onChange={setCompetitors} rows={5} />
      </Panel>
      <div className="space-y-4">
        <ScoreList items={briefChecks} />
        <CopyBox label="SEO content brief" value={brief} downloadName="seo-content-brief.md" />
      </div>
    </div>
  )
}

export default function SeoToolsCalculator() {
  const pathname = usePathname()
  const slug = getSlug(pathname)

  if (slug === 'on-page-seo-checker' || slug === 'on-page-seo-audit-tool') return <OnPageSeoAuditTool />
  if (slug === 'seo-title-ctr-optimizer') return <SerpSnippetPreviewTool />
  if (slug === 'gsc-indexing-issue-triage-tool') return <RobotsMetaTagChecker />
  if (slug === 'heading-hierarchy-checker') return <HeadingHierarchyChecker />
  if (slug === 'image-alt-text-checker') return <ImageAltTextChecker />
  if (slug === 'seo-title-checker' || slug === 'meta-description-checker') return <SerpSnippetPreviewTool />
  if (slug === 'serp-snippet-preview-tool') return <SerpSnippetPreviewTool />
  if (slug === 'meta-tag-generator') return <MetaTagGenerator />
  if (slug === 'schema-markup-generator') return <SchemaMarkupGenerator />
  if (slug === 'robots-txt-generator') return <RobotsTxtGenerator />
  if (slug === 'robots-txt-checker') return <RobotsTxtChecker />
  if (slug === 'xml-sitemap-generator') return <XmlSitemapGenerator />
  if (slug === 'sitemap-url-checker') return <SitemapUrlChecker />
  if (slug === 'sitemap-canonical-auditor') return <SitemapCanonicalAuditor />
  if (slug === 'hreflang-tag-generator') return <HreflangTagGenerator />
  if (slug === 'hreflang-reciprocity-checker') return <HreflangReciprocityChecker />
  if (slug === 'keyword-density-checker') return <KeywordDensityChecker />
  if (slug === 'utm-builder') return <UtmBuilder />
  if (slug === 'url-slug-generator') return <SlugGenerator />
  if (slug === 'faq-schema-generator') return <FaqSchemaGenerator />
  if (slug === 'robots-meta-tag-checker') return <RobotsMetaTagChecker />
  if (slug === 'canonical-tag-checker') return <CanonicalTagChecker />
  if (slug === 'internal-link-anchor-text-checker') return <InternalLinkAnchorTextChecker />
  if (slug === 'redirect-chain-checker') return <RedirectChainChecker />
  if (slug === 'broken-link-checker') return <BrokenLinkChecker />
  if (slug === 'open-graph-preview-tool') return <OpenGraphPreviewTool />
  if (slug === 'keyword-clustering-tool') return <KeywordClusteringTool />
  if (slug === 'keyword-cannibalization-checker') return <KeywordCannibalizationChecker />
  if (slug === 'content-brief-generator') return <ContentBriefGenerator />

  return <OnPageSeoAuditTool />
}

'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type ScoreItem = {
  label: string
  ok: boolean
  detail: string
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

function slugHost(url: string) {
  try {
    return new URL(url).host
  } catch {
    return ''
  }
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

function CopyBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-950 p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 transition hover:bg-brand-100"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
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
  const [pageUrl, setPageUrl] = useState('https://example.com/services/seo-audit')
  const [targetKeyword, setTargetKeyword] = useState('seo audit')
  const [html, setHtml] = useState('')
  const [title, setTitle] = useState('SEO Audit Services for Small Businesses')
  const [description, setDescription] = useState('Get a practical SEO audit that finds technical issues, content gaps, and quick wins for your small business website.')
  const [h1, setH1] = useState('SEO Audit Services')
  const [canonical, setCanonical] = useState('https://example.com/services/seo-audit')
  const [content, setContent] = useState('Paste page copy or HTML to estimate word count, keyword usage, internal links, external links, image alt text, and the basic on-page SEO checks that often decide whether a page is ready to publish.')
  const [imageCount, setImageCount] = useState('4')
  const [imagesMissingAlt, setImagesMissingAlt] = useState('1')
  const [internalLinks, setInternalLinks] = useState('3')
  const [externalLinks, setExternalLinks] = useState('1')

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

  const audit = useMemo(() => {
    const words = countWords(content)
    const keyword = targetKeyword.trim().toLowerCase()
    const keywordInTitle = keyword ? title.toLowerCase().includes(keyword) : false
    const keywordInH1 = keyword ? h1.toLowerCase().includes(keyword) : false
    const keywordInDescription = keyword ? description.toLowerCase().includes(keyword) : false
    const missingAlt = Number(imagesMissingAlt) || 0
    const totalImages = Number(imageCount) || 0
    const internal = Number(internalLinks) || 0
    const external = Number(externalLinks) || 0
    const h1Count = h1.split('|').map((item) => item.trim()).filter(Boolean).length

    const items: ScoreItem[] = [
      { label: 'Title length', ok: title.length >= 35 && title.length <= 62, detail: `${title.length} characters. Aim for roughly 35-62 characters.` },
      { label: 'Meta description length', ok: description.length >= 110 && description.length <= 160, detail: `${description.length} characters. Aim for a useful 110-160 character summary.` },
      { label: 'Primary keyword placement', ok: keywordInTitle && keywordInH1 && keywordInDescription, detail: keyword ? `Keyword appears in title: ${keywordInTitle ? 'yes' : 'no'}, H1: ${keywordInH1 ? 'yes' : 'no'}, description: ${keywordInDescription ? 'yes' : 'no'}.` : 'Add a target keyword to check placement.' },
      { label: 'One clear H1', ok: h1Count === 1, detail: `${h1Count} H1 found. Most pages should have one primary H1.` },
      { label: 'Canonical URL', ok: canonical.startsWith('http'), detail: canonical ? `Canonical: ${canonical}` : 'Add a canonical URL.' },
      { label: 'Readable content depth', ok: words >= 600, detail: `${words} words found. Important SEO pages usually need enough original content to answer the query.` },
      { label: 'Image alt text', ok: totalImages === 0 || missingAlt === 0, detail: `${missingAlt} of ${totalImages} images missing alt text.` },
      { label: 'Internal links', ok: internal >= 3, detail: `${internal} internal links found. Add relevant links to tools, categories, and guides.` },
      { label: 'External citations', ok: external >= 1, detail: `${external} external links found. Use credible citations for facts that may change.` },
    ]

    return { words, items }
  }, [canonical, content, description, h1, imageCount, imagesMissingAlt, internalLinks, externalLinks, targetKeyword, title])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Audit inputs">
        <Field label="Page URL" value={pageUrl} onChange={setPageUrl} placeholder="https://example.com/page" />
        <Field label="Target keyword" value={targetKeyword} onChange={setTargetKeyword} placeholder="seo audit" />
        <TextArea label="Paste page HTML source (optional)" value={html} onChange={setHtml} rows={5} placeholder="Paste the rendered HTML or page source here." hint="Use this when you want the tool to extract title, meta description, H1s, images, and links." />
        <button type="button" onClick={parseHtml} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
          Analyze pasted HTML
        </button>
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
      <ScoreList items={audit.items} />
    </div>
  )
}

function SerpSnippetPreviewTool() {
  const [title, setTitle] = useState('Free SEO Audit Tool | Check Title, Meta, H1 and Links')
  const [description, setDescription] = useState('Run a fast on-page SEO audit for titles, meta descriptions, H1 tags, canonicals, content depth, links, and image alt text.')
  const [url, setUrl] = useState('https://freeltools.com/tools/on-page-seo-audit-tool')
  const [mode, setMode] = useState('desktop')

  const titleOk = title.length >= 35 && title.length <= 62
  const descOk = description.length >= 110 && description.length <= 160

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Snippet inputs">
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
      <Panel title="Google-style preview">
        <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${mode === 'mobile' ? 'max-w-sm' : ''}`}>
          <p className="truncate text-sm text-gray-700">{url}</p>
          <p className="mt-1 text-xl leading-6 text-[#1a0dab]">{title}</p>
          <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>
        </div>
        <p className="text-xs leading-5 text-gray-500">Google can rewrite titles and snippets. Use this preview to check clarity, length, and search intent before publishing.</p>
      </Panel>
    </div>
  )
}

function MetaTagGenerator() {
  const [title, setTitle] = useState('Free SEO Tools for Small Websites')
  const [description, setDescription] = useState('Use free SEO tools to audit pages, generate schema, preview snippets, create robots.txt files, and build XML sitemaps.')
  const [canonical, setCanonical] = useState('https://example.com/free-seo-tools')
  const [image, setImage] = useState('https://example.com/og-image.jpg')
  const [robots, setRobots] = useState('index, follow')

  const tags = `<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${canonical}" />
<meta name="robots" content="${robots}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />`

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
      <CopyBox label="Head tags" value={tags} />
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
      <CopyBox label="JSON-LD schema" value={script} />
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

  const blocked = paths.some((path) => testPath.startsWith(path.replace('*', '')))

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
        <Stat label="Path test" value={blocked ? 'Blocked' : 'Allowed'} detail="Simple prefix check against your Disallow lines." highlight={!blocked} />
      </Panel>
      <CopyBox label="robots.txt" value={robots} />
    </div>
  )
}

function XmlSitemapGenerator() {
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/services\nhttps://example.com/blog/seo-audit-checklist')
  const [changeFrequency, setChangeFrequency] = useState('weekly')
  const [priority, setPriority] = useState('0.8')
  const [includeLastmod, setIncludeLastmod] = useState('yes')

  const parsedUrls = Array.from(
    new Set(
      urls
        .split(/\s+/)
        .map((url) => url.trim())
        .filter((url) => /^https?:\/\//i.test(url))
    )
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
      <CopyBox label="sitemap.xml" value={xml} />
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

  const tags = `${entries.map((entry) => `<link rel="alternate" hreflang="${entry.lang}" href="${entry.url}" />`).join('\n')}${xDefault ? `\n<link rel="alternate" hreflang="x-default" href="${xDefault}" />` : ''}`

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
      <CopyBox label="Hreflang tags" value={tags} />
    </div>
  )
}

function KeywordDensityChecker() {
  const [targetKeyword, setTargetKeyword] = useState('free seo tools')
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
    const topTerms = Array.from(terms.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12)
    return {
      words: words.length,
      chars: content.length,
      occurrences,
      density,
      readingTime: Math.max(1, Math.ceil(words.length / 220)),
      topTerms,
    }
  }, [content, targetKeyword])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Content inputs">
        <Field label="Target keyword or phrase" value={targetKeyword} onChange={setTargetKeyword} />
        <TextArea label="Paste content" value={content} onChange={setContent} rows={13} />
      </Panel>
      <div className="space-y-4">
        <Stat label="Word count" value={`${analysis.words}`} detail={`${analysis.readingTime} min estimated read time`} highlight />
        <Stat label="Keyword uses" value={`${analysis.occurrences}`} detail={`${analysis.density.toFixed(2)}% density`} highlight={analysis.occurrences > 0 && analysis.density <= 3} />
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
        <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Density is a quality check, not a ranking formula. Use the result to catch missing terms or obvious stuffing, then focus on usefulness and search intent.
        </p>
      </div>
    </div>
  )
}

export default function SeoToolsCalculator() {
  const pathname = usePathname()
  const slug = getSlug(pathname)

  if (slug === 'on-page-seo-audit-tool') return <OnPageSeoAuditTool />
  if (slug === 'serp-snippet-preview-tool') return <SerpSnippetPreviewTool />
  if (slug === 'meta-tag-generator') return <MetaTagGenerator />
  if (slug === 'schema-markup-generator') return <SchemaMarkupGenerator />
  if (slug === 'robots-txt-generator') return <RobotsTxtGenerator />
  if (slug === 'xml-sitemap-generator') return <XmlSitemapGenerator />
  if (slug === 'hreflang-tag-generator') return <HreflangTagGenerator />
  if (slug === 'keyword-density-checker') return <KeywordDensityChecker />

  return <OnPageSeoAuditTool />
}

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

function keywordCore(value: string) {
  const words = value.toLowerCase().match(/[a-z0-9]+/g) ?? []
  return words.filter((word) => word.length > 2 && !stopWords.has(word))
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
      <CopyBox label="Campaign URL" value={result.url} />
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
      <CopyBox label="SEO slug" value={slug} />
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
      <CopyBox label="FAQ JSON-LD" value={output} />
    </div>
  )
}

function CanonicalTagChecker() {
  const [pageUrl, setPageUrl] = useState('https://example.com/free-seo-tools?utm_source=newsletter')
  const [canonicalUrl, setCanonicalUrl] = useState('https://example.com/free-seo-tools')
  const [robots, setRobots] = useState('index')
  const [duplicates, setDuplicates] = useState('https://example.com/free-seo-tools/\nhttps://www.example.com/free-seo-tools\nhttps://example.com/free-seo-tools?utm_source=ad')

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Canonical inputs">
        <Field label="Current page URL" value={pageUrl} onChange={setPageUrl} />
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
  const [chainText, setChainText] = useState('http://example.com/page 301\nhttps://example.com/page 301\nhttps://www.example.com/page 200')

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Redirect chain inputs">
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
      </div>
    </div>
  )
}

function BrokenLinkChecker() {
  const [input, setInput] = useState('<a href="https://example.com/">Home</a>\n<a href="/old-page">Old page</a>\n<a href="#">Empty anchor</a>\nhttps://example.com/missing 404\nhttps://example.com/server-error 500')

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

  const broken = links.filter((link) => link.status?.startsWith('4') || link.status?.startsWith('5') || link.url === '#' || link.url.trim() === '')
  const internal = links.filter((link) => link.url.startsWith('/')).length
  const external = links.filter((link) => /^https?:\/\//.test(link.url)).length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Link inputs">
        <TextArea label="Paste HTML, URLs, or URL status rows" value={input} onChange={setInput} rows={12} hint="For status checks, paste rows like https://example.com/missing 404 from a crawler export." />
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Links found" value={`${links.length}`} detail={`${internal} internal, ${external} external`} highlight={links.length > 0} />
          <Stat label="Broken signals" value={`${broken.length}`} detail="Includes 4xx, 5xx, and empty # anchors." highlight={broken.length === 0} />
          <Stat label="Need crawler?" value="Maybe" detail="Browser-only tools cannot fetch every URL status safely." />
        </div>
      </Panel>
      <Panel title="Broken or risky links">
        {broken.length === 0 ? (
          <p className="text-sm text-gray-600">No obvious broken links found in the pasted input.</p>
        ) : (
          <div className="space-y-2">
            {broken.map((link, index) => (
              <p key={`${link.url}-${index}`} className="break-all rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                {link.url} {link.status ? `· ${link.status}` : '· empty or placeholder link'}
              </p>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}


function RobotsMetaTagChecker() {
  const [html, setHtml] = useState('<!doctype html>\n<html>\n<head>\n<meta name="robots" content="index, follow">\n<link rel="canonical" href="https://example.com/page">\n</head>\n<body><h1>Example page</h1></body>\n</html>')
  const [headerNotes, setHeaderNotes] = useState('x-robots-tag: index, follow')

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Panel title="Robots inputs">
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

  const tags = `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${imageUrl}" />
<meta name="twitter:card" content="summary_large_image" />`

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Open Graph inputs">
        <Field label="OG title" value={title} onChange={setTitle} />
        <TextArea label="OG description" value={description} onChange={setDescription} rows={3} />
        <Field label="Page URL" value={url} onChange={setUrl} />
        <Field label="Image URL" value={imageUrl} onChange={setImageUrl} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Title length" value={`${title.length}`} detail="Keep it readable in cards." highlight={title.length <= 70} />
          <Stat label="Description length" value={`${description.length}`} detail="Short descriptions are easier to share." highlight={description.length <= 200} />
        </div>
      </Panel>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex aspect-[1.91/1] items-center justify-center bg-gray-100 p-4 text-center text-xs text-gray-500">
            <span className="break-all">{imageUrl}</span>
          </div>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">{slugHost(url) || 'example.com'}</p>
            <h3 className="mt-1 text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">{description}</p>
          </div>
        </div>
        <CopyBox label="Open Graph tags" value={tags} />
      </div>
    </div>
  )
}

function KeywordClusteringTool() {
  const [keywords, setKeywords] = useState('seo audit tool\nfree seo audit tool\non page seo checker\nschema markup generator\nfaq schema generator\nrobots txt generator\nxml sitemap generator\nsitemap generator free\nkeyword density checker\nkeyword stuffing checker')

  const clusters = useMemo(() => {
    const rows = splitLines(keywords)
    const grouped = new Map<string, string[]>()
    for (const row of rows) {
      const terms = keywordCore(row)
      const label = terms.find((term) => !['free', 'tool', 'generator', 'checker'].includes(term)) ?? terms[0] ?? 'misc'
      grouped.set(label, [...(grouped.get(label) ?? []), row])
    }
    return Array.from(grouped.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [keywords])

  const output = clusters.map(([label, rows]) => `# ${titleCase(label)}\n${rows.map((row) => `- ${row}`).join('\n')}`).join('\n\n')

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Keyword inputs">
        <TextArea label="Keyword list" value={keywords} onChange={setKeywords} rows={12} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Keywords" value={`${splitLines(keywords).length}`} detail="One keyword per line." highlight />
          <Stat label="Clusters" value={`${clusters.length}`} detail="Grouped by dominant non-generic term." highlight={clusters.length > 0} />
        </div>
      </Panel>
      <CopyBox label="Keyword clusters" value={output} />
    </div>
  )
}

function KeywordCannibalizationChecker() {
  const [rows, setRows] = useState('seo audit tool | /tools/on-page-seo-audit-tool | On-Page SEO Audit Tool\nseo audit tool | /blog/seo-audit-checklist | SEO Audit Checklist\nschema markup generator | /tools/schema-markup-generator | Schema Markup Generator\nfaq schema generator | /tools/faq-schema-generator | FAQ Schema Generator')

  const grouped = useMemo(() => {
    const map = new Map<string, { url: string; title: string }[]>()
    for (const line of splitLines(rows)) {
      const [keyword = '', url = '', title = ''] = line.split('|').map((part) => part.trim())
      if (!keyword || !url) continue
      map.set(keyword.toLowerCase(), [...(map.get(keyword.toLowerCase()) ?? []), { url, title }])
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [rows])

  const risks = grouped.filter(([, pages]) => new Set(pages.map((page) => page.url)).size > 1)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <Panel title="Cannibalization inputs">
        <TextArea label="Keyword | URL | Title rows" value={rows} onChange={setRows} rows={12} hint="Paste export rows or write one target keyword, URL, and title per line separated by pipes." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Keyword groups" value={`${grouped.length}`} detail="Unique target keywords found." highlight />
          <Stat label="Possible conflicts" value={`${risks.length}`} detail="More than one URL targets the same keyword." highlight={risks.length === 0} />
        </div>
      </Panel>
      <Panel title="Cannibalization report">
        {grouped.map(([keyword, pages]) => (
          <div key={keyword} className={`rounded-xl border p-3 ${pages.length > 1 ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
            <p className="text-sm font-semibold text-gray-900">{keyword}</p>
            <div className="mt-2 space-y-1">
              {pages.map((page) => (
                <p key={`${keyword}-${page.url}`} className="break-all text-xs leading-5 text-gray-600">
                  {page.url} {page.title ? `· ${page.title}` : ''}
                </p>
              ))}
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}

function ContentBriefGenerator() {
  const [keyword, setKeyword] = useState('free seo audit tool')
  const [audience, setAudience] = useState('small business owners and freelancers')
  const [pageType, setPageType] = useState('tool page')
  const [competitors, setCompetitors] = useState('SEO checker tools that only show a score\nPaid audit platforms that require signup\nBlog posts with checklists but no working tool')

  const brief = useMemo(() => {
    const related = keywordCore(keyword).filter((term) => term !== 'free')
    const competitorAngles = splitLines(competitors)
    return `# SEO Content Brief: ${titleCase(keyword)}

## Search intent
People searching "${keyword}" want a practical ${pageType} for ${audience}. The page should answer the query quickly and let the visitor act without a signup wall.

## Recommended title
Free ${titleCase(keyword)} | No Signup

## H1
${titleCase(keyword)}

## First-screen answer
Use this page to ${pageType.includes('tool') ? 'run the tool immediately' : 'get the answer quickly'}, then explain the workflow, limitations, and next step below the main action.

## Sections to include
- What the tool does
- When to use it
- Inputs required
- How to interpret the result
- Common mistakes
- Related tools and next steps
- FAQ

## Terms and entities to cover
${related.map((term) => `- ${term}`).join('\n')}

## Competitor gaps to beat
${competitorAngles.map((angle) => `- ${angle}`).join('\n')}

## FAQ ideas
- What is ${keyword}?
- Is this tool free?
- What should I do after using it?
- Does this replace a full SEO audit?

## Internal links
- Link to the SEO Tools category
- Link to the On-Page SEO Audit Tool
- Link to related schema, meta, sitemap, or content tools when relevant

## CTA
Use the free tool, copy the output, then run the next SEO QA step before publishing.`
  }, [audience, competitors, keyword, pageType])

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
        <TextArea label="Competitor gaps or SERP notes" value={competitors} onChange={setCompetitors} rows={5} />
      </Panel>
      <CopyBox label="SEO content brief" value={brief} />
    </div>
  )
}

export default function SeoToolsCalculator() {
  const pathname = usePathname()
  const slug = getSlug(pathname)

  if (slug === 'on-page-seo-checker' || slug === 'on-page-seo-audit-tool') return <OnPageSeoAuditTool />
  if (slug === 'seo-title-checker' || slug === 'meta-description-checker') return <SerpSnippetPreviewTool />
  if (slug === 'serp-snippet-preview-tool') return <SerpSnippetPreviewTool />
  if (slug === 'meta-tag-generator') return <MetaTagGenerator />
  if (slug === 'schema-markup-generator') return <SchemaMarkupGenerator />
  if (slug === 'robots-txt-generator') return <RobotsTxtGenerator />
  if (slug === 'xml-sitemap-generator') return <XmlSitemapGenerator />
  if (slug === 'hreflang-tag-generator') return <HreflangTagGenerator />
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

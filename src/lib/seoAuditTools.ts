export type SitemapCanonicalIssue =
  | 'malformed'
  | 'relative'
  | 'non-https'
  | 'fragment'
  | 'parameter'
  | 'duplicate'
  | 'mixed-host'

export type SitemapCanonicalRow = {
  input: string
  suggested: string
  host: string
  issues: SitemapCanonicalIssue[]
}

export type SitemapCanonicalAudit = {
  rows: SitemapCanonicalRow[]
  primaryHost: string
  hosts: string[]
  fixedUrls: string[]
  consistency: 'Consistent' | 'Needs normalization' | 'Conflicting'
}

export type HreflangIssueKind =
  | 'format'
  | 'invalid-source'
  | 'invalid-url'
  | 'invalid-locale'
  | 'duplicate-locale'
  | 'duplicate-source'
  | 'missing-self'
  | 'missing-x-default'
  | 'missing-reciprocal'
  | 'canonical-conflict'

export type HreflangIssue = {
  kind: HreflangIssueKind
  source: string
  detail: string
}

export type HreflangAlternate = {
  locale: string
  url: string
}

export type HreflangPage = {
  source: string
  canonical: string
  alternates: HreflangAlternate[]
}

export type HreflangAudit = {
  pages: HreflangPage[]
  issues: HreflangIssue[]
  suppliedTargets: number
  reciprocalPairs: number
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
}

function absoluteHttpUrl(value: string, base?: string) {
  try {
    const url = base ? new URL(value, base) : new URL(value)
    return /^https?:$/.test(url.protocol) ? url : null
  } catch {
    return null
  }
}

function comparableUrl(value: string) {
  const url = absoluteHttpUrl(value)
  if (!url) return ''
  url.hash = ''
  const path = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')
  return `${url.protocol}//${url.host.toLowerCase()}${path}${url.search}`
}

function sitemapInputs(input: string) {
  const locs = Array.from(input.matchAll(/<loc\b[^>]*>\s*([\s\S]*?)\s*<\/loc>/gi)).map((match) => decodeXml(match[1].trim()))
  if (locs.length) return locs.filter(Boolean)
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function auditSitemapCanonicals(input: string, preferredOrigin = ''): SitemapCanonicalAudit {
  const preferredUrl = absoluteHttpUrl(preferredOrigin)
  const base = preferredUrl?.origin
  const provisional = sitemapInputs(input).map((raw) => {
    const relative = !/^[a-z][a-z\d+.-]*:\/\//i.test(raw)
    const parsed = absoluteHttpUrl(raw, relative ? base : undefined)
    const malformed = !parsed || /\s/.test(raw)
    const issues: SitemapCanonicalIssue[] = []
    if (malformed) issues.push('malformed')
    if (relative) issues.push('relative')
    if (parsed?.protocol === 'http:') issues.push('non-https')
    if (parsed?.hash) issues.push('fragment')
    if (parsed?.search) issues.push('parameter')

    let suggested = ''
    if (parsed && !malformed) {
      parsed.protocol = 'https:'
      parsed.hash = ''
      parsed.search = ''
      suggested = parsed.toString()
    }

    return { input: raw, suggested, host: parsed?.host.toLowerCase() ?? '', issues }
  })

  const hostCounts = new Map<string, number>()
  for (const row of provisional) {
    if (row.host) hostCounts.set(row.host, (hostCounts.get(row.host) ?? 0) + 1)
  }
  const preferredHost = preferredUrl?.host.toLowerCase() ?? ''
  const primaryHost = preferredHost || Array.from(hostCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  const hosts = Array.from(hostCounts.keys())
  const duplicateCounts = new Map<string, number>()
  for (const row of provisional) {
    const key = comparableUrl(row.suggested)
    if (key) duplicateCounts.set(key, (duplicateCounts.get(key) ?? 0) + 1)
  }

  const rows = provisional.map((row) => {
    const issues = [...row.issues]
    if (row.suggested && (duplicateCounts.get(comparableUrl(row.suggested)) ?? 0) > 1) issues.push('duplicate')
    if (row.host && primaryHost && row.host !== primaryHost) issues.push('mixed-host')
    return { ...row, issues }
  })
  const fixedUrls = Array.from(new Set(rows.map((row) => row.suggested).filter(Boolean)))
  const hasConflict = rows.some((row) => row.issues.includes('malformed') || row.issues.includes('mixed-host'))
  const hasIssues = rows.some((row) => row.issues.length > 0)

  return {
    rows,
    primaryHost,
    hosts,
    fixedUrls,
    consistency: hasConflict ? 'Conflicting' : hasIssues ? 'Needs normalization' : 'Consistent',
  }
}

function parseHreflangBlocks(input: string) {
  const pages: HreflangPage[] = []
  const issues: HreflangIssue[] = []
  const blocks = input.split(/\r?\n\s*\r?\n/).map((block) => block.trim()).filter(Boolean)

  for (const block of blocks) {
    const page: HreflangPage = { source: '', canonical: '', alternates: [] }
    for (const line of block.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
      const match = line.match(/^([^:]+):\s*(.+)$/)
      if (!match) {
        issues.push({ kind: 'format', source: page.source, detail: `Could not read line: ${line}` })
        continue
      }
      const key = match[1].trim()
      const value = match[2].trim()
      if (key.toLowerCase() === 'source') page.source = value
      else if (key.toLowerCase() === 'canonical') page.canonical = value
      else page.alternates.push({ locale: key, url: value })
    }
    if (!page.source) issues.push({ kind: 'format', source: '', detail: 'Every page block needs a SOURCE line.' })
    pages.push(page)
  }

  return { pages, issues }
}

function localeProblem(locale: string) {
  if (locale.toLowerCase() === 'x-default') return ''
  try {
    const canonical = Intl.getCanonicalLocales(locale)[0]
    if (!canonical) return 'Use a BCP 47 language or language-region tag.'
    if (canonical.toLowerCase() !== locale.toLowerCase()) return `Use the canonical tag ${canonical}.`
    return ''
  } catch {
    return 'Use a BCP 47 tag such as en, en-US, es-ES, or fr-CA.'
  }
}

export function auditHreflangReciprocity(input: string): HreflangAudit {
  const parsed = parseHreflangBlocks(input)
  const issues = [...parsed.issues]
  const sourceCounts = new Map<string, number>()

  for (const page of parsed.pages) {
    const sourceKey = comparableUrl(page.source)
    if (!sourceKey) issues.push({ kind: 'invalid-source', source: page.source, detail: 'SOURCE must be an absolute HTTP or HTTPS URL.' })
    else sourceCounts.set(sourceKey, (sourceCounts.get(sourceKey) ?? 0) + 1)

    if (page.canonical && !comparableUrl(page.canonical)) {
      issues.push({ kind: 'invalid-url', source: page.source, detail: `Canonical URL is invalid: ${page.canonical}` })
    } else if (page.canonical && comparableUrl(page.canonical) !== sourceKey) {
      issues.push({ kind: 'canonical-conflict', source: page.source, detail: `Canonical points to ${page.canonical} instead of the source page.` })
    }

    const localeCounts = new Map<string, number>()
    for (const alternate of page.alternates) {
      const localeKey = alternate.locale.toLowerCase()
      localeCounts.set(localeKey, (localeCounts.get(localeKey) ?? 0) + 1)
      const problem = localeProblem(alternate.locale)
      if (problem) issues.push({ kind: 'invalid-locale', source: page.source, detail: `${alternate.locale}: ${problem}` })
      if (!comparableUrl(alternate.url)) issues.push({ kind: 'invalid-url', source: page.source, detail: `${alternate.locale} has an invalid URL: ${alternate.url}` })
    }
    for (const [locale, count] of Array.from(localeCounts.entries())) {
      if (count > 1) issues.push({ kind: 'duplicate-locale', source: page.source, detail: `${locale} appears ${count} times in this page block.` })
    }
    if (!page.alternates.some((alternate) => comparableUrl(alternate.url) === sourceKey)) {
      issues.push({ kind: 'missing-self', source: page.source, detail: 'The alternate set does not include a self-reference to this SOURCE URL.' })
    }
    if (!page.alternates.some((alternate) => alternate.locale.toLowerCase() === 'x-default')) {
      issues.push({ kind: 'missing-x-default', source: page.source, detail: 'Consider adding x-default for the global fallback or language selector.' })
    }
  }

  for (const [source, count] of Array.from(sourceCounts.entries())) {
    if (count > 1) issues.push({ kind: 'duplicate-source', source, detail: `This SOURCE page is supplied ${count} times.` })
  }

  const pagesBySource = new Map<string, HreflangPage>()
  for (const page of parsed.pages) {
    const source = comparableUrl(page.source)
    if (source) pagesBySource.set(source, page)
  }
  const reciprocalKeys = new Set<string>()
  let suppliedTargets = 0
  let reciprocalPairs = 0

  for (const page of parsed.pages) {
    const sourceKey = comparableUrl(page.source)
    for (const alternate of page.alternates) {
      const targetKey = comparableUrl(alternate.url)
      const targetPage = pagesBySource.get(targetKey)
      if (!sourceKey || !targetKey || targetKey === sourceKey || !targetPage) continue
      suppliedTargets += 1
      const pairKey = [sourceKey, targetKey].sort().join('|')
      const reciprocal = targetPage.alternates.some((targetAlternate) => comparableUrl(targetAlternate.url) === sourceKey)
      if (reciprocal) {
        if (!reciprocalKeys.has(pairKey)) reciprocalPairs += 1
        reciprocalKeys.add(pairKey)
      } else if (!reciprocalKeys.has(`missing:${sourceKey}|${targetKey}`)) {
        issues.push({ kind: 'missing-reciprocal', source: page.source, detail: `${alternate.locale} points to ${alternate.url}, but that supplied page does not link back.` })
        reciprocalKeys.add(`missing:${sourceKey}|${targetKey}`)
      }
    }
  }

  return { pages: parsed.pages, issues, suppliedTargets, reciprocalPairs }
}

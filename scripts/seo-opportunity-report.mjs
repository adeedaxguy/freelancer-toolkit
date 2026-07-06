import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SEO_DIR = path.join(ROOT, 'seo')
const EXPORT_DIR = path.join(SEO_DIR, 'exports')
const REPORTS_DIR = path.join(SEO_DIR, 'reports')
const BLOG_DIR = path.join(ROOT, 'src/content/blog')
const TOOL_FILES = [
  path.join(ROOT, 'src/lib/tools.ts'),
  path.join(ROOT, 'src/lib/advancedTools.ts'),
]

const EXPECTED_EXPORTS = [
  ['ahrefs-organic-keywords.csv', 'Ahrefs Site Explorer > Organic keywords'],
  ['ahrefs-top-pages.csv', 'Ahrefs Site Explorer > Top pages'],
  ['ahrefs-content-gap.csv', 'Ahrefs Content Gap'],
  ['ahrefs-competing-pages.csv', 'Ahrefs Competing pages or domains'],
  ['ahrefs-backlinks.csv', 'Ahrefs Backlinks'],
  ['ahrefs-broken-backlinks.csv', 'Ahrefs Broken backlinks'],
  ['ahrefs-site-audit.csv', 'Ahrefs Site Audit issues'],
  ['gsc-queries-3m.csv', 'Google Search Console queries, last 3 months'],
  ['gsc-pages-3m.csv', 'Google Search Console pages, last 3 months'],
]

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function exists(filePath) {
  return fs.existsSync(filePath)
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      cell += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(cell)
      cell = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1
      row.push(cell)
      if (row.some((value) => value.trim() !== '')) rows.push(row)
      row = []
      cell = ''
      continue
    }

    cell += char
  }

  row.push(cell)
  if (row.some((value) => value.trim() !== '')) rows.push(row)
  if (rows.length === 0) return []

  const headers = rows[0].map(normalizeHeader)
  return rows.slice(1).map((values) => {
    const record = {}
    headers.forEach((header, index) => {
      if (!header) return
      record[header] = String(values[index] || '').trim()
    })
    return record
  })
}

function loadCsv(fileName) {
  const filePath = path.join(EXPORT_DIR, fileName)
  if (!exists(filePath)) return []
  return parseCsv(read(filePath))
}

function firstValue(row, keys) {
  for (const key of keys) {
    const normalized = normalizeHeader(key)
    if (row[normalized] !== undefined && row[normalized] !== '') return row[normalized]
  }
  return ''
}

function toNumber(value) {
  const cleaned = String(value || '').replace(/[$,%\s,]/g, '')
  const number = Number.parseFloat(cleaned)
  return Number.isFinite(number) ? number : 0
}

function wordCount(content) {
  return content.trim().split(/\s+/).filter(Boolean).length
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { data: {}, content: raw }
  const end = raw.indexOf('\n---', 4)
  if (end === -1) return { data: {}, content: raw }
  const yaml = raw.slice(4, end).trim()
  const content = raw.slice(end + 4).replace(/^\n/, '')
  const data = {}

  for (const line of yaml.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue
    const key = match[1]
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }

  return { data, content }
}

function collectToolSlugs() {
  const slugs = new Set()
  for (const file of TOOL_FILES) {
    if (!exists(file)) continue
    const content = read(file)
    for (const match of content.matchAll(/slug:\s*'([^']+)'/g)) slugs.add(match[1])
  }
  return [...slugs].sort()
}

function collectBlogPosts() {
  if (!exists(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx') && !file.startsWith('_'))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file)
      const { data, content } = parseFrontmatter(read(filePath))
      return {
        file,
        slug: file.replace(/\.mdx$/, ''),
        title: data.title || file.replace(/\.mdx$/, ''),
        seoTitle: data.seoTitle || data.title || '',
        description: data.seoDescription || data.description || '',
        words: wordCount(content),
        hasFaq: /^##\s+FAQ\s*$/im.test(content),
        hasToolLink: content.includes('/tools/'),
      }
    })
}

function inferCluster(keyword, url = '') {
  const haystack = `${keyword} ${url}`.toLowerCase()
  if (/passport|visa|photo|image|jpg|png|resize|compress|pdf|dpi|signature/.test(haystack)) return 'Image, passport, and document tools'
  if (/fiverr|upwork|freelancer\.com|platform|commission|fee/.test(haystack)) return 'Marketplace fees'
  if (/price|pricing|rate|quote|cost|profit|retainer|tax|invoice|late fee/.test(haystack)) return 'Pricing and profitability'
  if (/proposal|scope|contract|client|questionnaire|onboarding|discovery/.test(haystack)) return 'Client acquisition'
  return 'General freelancer tools'
}

function businessValue(keyword, url = '') {
  const haystack = `${keyword} ${url}`.toLowerCase()
  let score = 0
  if (/calculator|generator|maker|converter|resizer|compressor|template|tool|download/.test(haystack)) score += 18
  if (/free|online|no watermark|without login|under \d+kb|to \d+kb|35x45|2x2|600x600/.test(haystack)) score += 10
  if (/fiverr|upwork|invoice|proposal|contract|passport|visa|photo|pdf|pricing|rate|fee/.test(haystack)) score += 10
  if (url.includes('/tools/')) score += 10
  if (url.includes('/blog/')) score += 5
  if (/meaning|definition|what is|history|reddit/.test(haystack)) score -= 8
  return score
}

function scoreKeyword(row, source) {
  const keyword = firstValue(row, ['keyword', 'query', 'keywords'])
  const url = firstValue(row, ['url', 'page', 'target url', 'current url'])
  const position = toNumber(firstValue(row, ['position', 'pos', 'current position']))
  const previousPosition = toNumber(firstValue(row, ['previous position', 'previous_position', 'prev position']))
  const volume = toNumber(firstValue(row, ['volume', 'search volume', 'vol']))
  const kd = toNumber(firstValue(row, ['kd', 'keyword difficulty', 'difficulty']))
  const traffic = toNumber(firstValue(row, ['traffic', 'organic traffic']))
  const impressions = toNumber(firstValue(row, ['impressions']))
  const clicks = toNumber(firstValue(row, ['clicks']))
  const serpFeatures = firstValue(row, ['serp features', 'features'])
  const country = firstValue(row, ['country', 'database'])

  if (!keyword) return null

  let score = businessValue(keyword, url)

  if (source === 'content gap') score += 24
  if (position >= 4 && position <= 10) score += 30
  else if (position >= 11 && position <= 20) score += 26
  else if (position >= 21 && position <= 50) score += 16
  else if (position > 50) score += 6
  else if (position > 0 && position <= 3) score += 8

  if (previousPosition && position && previousPosition > position) score += 4
  if (volume >= 1000) score += 16
  else if (volume >= 300) score += 11
  else if (volume >= 50) score += 6
  if (impressions >= 100) score += 8
  if (clicks === 0 && impressions >= 30) score += 6
  if (kd > 0 && kd <= 15) score += 12
  else if (kd <= 30) score += 7
  else if (kd >= 60) score -= 8
  if (/featured snippet|snippet|people also ask|image pack|video/i.test(serpFeatures)) score += 4

  let action = 'Review intent and map to an existing page.'
  if (!url || source === 'content gap') action = 'Create or map a page/tool if intent is commercial.'
  else if (url.includes('/tools/') && position >= 4 && position <= 20) action = 'Improve tool first screen, FAQs, title, and supporting content.'
  else if (url.includes('/blog/') && position >= 4 && position <= 20) action = 'Refresh blog answer block, metadata, FAQ, and links to tool.'
  else if (clicks === 0 && impressions >= 30) action = 'Rewrite title/meta and strengthen first-screen CTA.'
  else if (position > 20) action = 'Add internal links and build supporting content.'

  return {
    keyword,
    source,
    cluster: inferCluster(keyword, url),
    score: Math.round(score),
    position,
    previousPosition,
    volume,
    kd,
    traffic,
    impressions,
    clicks,
    country,
    url,
    action,
  }
}

function localContentOpportunities(posts) {
  return posts
    .map((post) => {
      let score = 0
      const issues = []
      if (post.words < 650) {
        score += 16
        issues.push(`${post.words} words`)
      }
      if (post.seoTitle.length > 65) {
        score += 10
        issues.push(`long SEO title (${post.seoTitle.length})`)
      }
      if (post.description.length > 165) {
        score += 8
        issues.push(`long meta description (${post.description.length})`)
      }
      if (post.words >= 1000 && !post.hasFaq) {
        score += 9
        issues.push('missing FAQ')
      }
      if (!post.hasToolLink) {
        score += 14
        issues.push('missing tool link')
      }
      return {
        slug: post.slug,
        title: post.title,
        score,
        issues,
        url: `/blog/${post.slug}`,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

function topRows(rows, limit = 25) {
  return rows
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function markdownTable(headers, rows) {
  if (rows.length === 0) return '_No rows yet._'
  const escapeCell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
  const header = `| ${headers.map(escapeCell).join(' | ')} |`
  const divider = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`).join('\n')
  return `${header}\n${divider}\n${body}`
}

function backlinkRows(rows, source) {
  return rows.slice(0, 20).map((row) => ({
    source,
    referringPage: firstValue(row, ['referring page', 'referring url', 'source url', 'url']),
    domainRating: firstValue(row, ['dr', 'domain rating', 'domain_rating']),
    anchor: firstValue(row, ['anchor', 'anchor text']),
    target: firstValue(row, ['target url', 'target', 'url to', 'linked url']),
    status: firstValue(row, ['lost status', 'status', 'link status']),
  }))
}

function buildReport() {
  ensureDir(EXPORT_DIR)
  ensureDir(REPORTS_DIR)

  const tools = collectToolSlugs()
  const posts = collectBlogPosts()

  const organic = loadCsv('ahrefs-organic-keywords.csv').map((row) => scoreKeyword(row, 'ahrefs organic keywords'))
  const contentGap = loadCsv('ahrefs-content-gap.csv').map((row) => scoreKeyword(row, 'content gap'))
  const gscQueries = loadCsv('gsc-queries-3m.csv').map((row) => scoreKeyword(row, 'gsc queries'))
  const scoredKeywords = topRows([...organic, ...contentGap, ...gscQueries], 30)

  const topPages = loadCsv('ahrefs-top-pages.csv')
  const siteAudit = loadCsv('ahrefs-site-audit.csv')
  const backlinks = backlinkRows(loadCsv('ahrefs-backlinks.csv'), 'backlinks')
  const brokenBacklinks = backlinkRows(loadCsv('ahrefs-broken-backlinks.csv'), 'broken backlinks')
  const localContent = localContentOpportunities(posts)

  const missingExports = EXPECTED_EXPORTS
    .filter(([fileName]) => !exists(path.join(EXPORT_DIR, fileName)))
    .map(([fileName, label]) => ({ fileName, label }))

  const report = {
    generatedAt: new Date().toISOString(),
    project: 'FreelTools.com',
    exportDir: path.relative(ROOT, EXPORT_DIR),
    inventory: {
      tools: tools.length,
      blogPosts: posts.length,
    },
    missingExports,
    scoredKeywords,
    localContent,
    topPages: topPages.slice(0, 20),
    siteAudit: siteAudit.slice(0, 30),
    backlinks,
    brokenBacklinks,
  }

  const keywordRows = scoredKeywords.map((item) => [
    item.score,
    item.keyword,
    item.cluster,
    item.position || '',
    item.volume || item.impressions || '',
    item.kd || '',
    item.url || '',
    item.action,
  ])

  const contentRows = localContent.map((item) => [
    item.score,
    item.url,
    item.issues.join(', '),
    'Refresh metadata, answer block, FAQ, and tool links.',
  ])

  const topPageRows = topPages.slice(0, 15).map((row) => [
    firstValue(row, ['url', 'page']),
    firstValue(row, ['traffic', 'organic traffic']),
    firstValue(row, ['keywords', 'organic keywords']),
    firstValue(row, ['top keyword', 'keyword']),
    firstValue(row, ['backlinks']),
    firstValue(row, ['referring domains', 'ref domains']),
  ])

  const auditRows = siteAudit.slice(0, 15).map((row) => [
    firstValue(row, ['severity', 'importance', 'priority']),
    firstValue(row, ['issue', 'issue type', 'problem']),
    firstValue(row, ['url', 'affected url', 'page']),
    firstValue(row, ['recommendation', 'how to fix', 'fix']),
  ])

  const linkRows = [...brokenBacklinks, ...backlinks].slice(0, 20).map((row) => [
    row.source,
    row.referringPage,
    row.domainRating,
    row.anchor,
    row.target,
    row.status,
  ])

  const missingList = missingExports.length
    ? missingExports.map((item) => `- \`${item.fileName}\` - ${item.label}`).join('\n')
    : '- All expected exports are present.'

  const md = `# FreelTools SEO Opportunities

Generated: ${report.generatedAt}

This file is generated by \`npm run seo:opportunities\`. Put Ahrefs, GSC, and audit exports in \`seo/exports/\`, then rerun the command.

## Inventory

- Tools detected: ${tools.length}
- Blog posts detected: ${posts.length}
- Export folder: \`${path.relative(ROOT, EXPORT_DIR)}\`

## Missing Data Exports

${missingList}

## Keyword And Page Opportunities

${markdownTable(['Score', 'Keyword', 'Cluster', 'Pos', 'Vol/Impr', 'KD', 'URL', 'Action'], keywordRows)}

## Local Content QA Opportunities

${markdownTable(['Score', 'URL', 'Issues', 'Action'], contentRows)}

## Ahrefs Top Pages

${markdownTable(['URL', 'Traffic', 'Keywords', 'Top keyword', 'Backlinks', 'Ref domains'], topPageRows)}

## Site Audit Issues

${markdownTable(['Severity', 'Issue', 'URL', 'Recommendation'], auditRows)}

## Backlink And Reclamation Leads

${markdownTable(['Source', 'Referring page', 'DR', 'Anchor', 'Target', 'Status'], linkRows)}

## Next Operating Rules

1. Existing matching tool or blog page beats creating a duplicate page.
2. Prioritize positions 4-20, high impressions with low CTR, low KD commercial terms, and pages with clear tool intent.
3. Use Ahrefs backlinks and broken backlinks only for relevant, editorial, non-spam outreach.
4. Record every published SEO change in \`seo/reports/\`.
`

  fs.writeFileSync(path.join(SEO_DIR, 'opportunities.md'), md)
  fs.writeFileSync(path.join(REPORTS_DIR, 'latest-opportunity-report.json'), JSON.stringify(report, null, 2))

  console.log(`SEO opportunity report generated with ${scoredKeywords.length} keyword rows and ${localContent.length} local content rows.`)
  console.log(`Wrote ${path.relative(ROOT, path.join(SEO_DIR, 'opportunities.md'))}`)
  console.log(`Wrote ${path.relative(ROOT, path.join(REPORTS_DIR, 'latest-opportunity-report.json'))}`)
}

buildReport()

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'src/content/blog')
const APP_DIR = path.join(ROOT, 'src/app')
const PUBLIC_SEO_SOURCE_FILES = [
  path.join(ROOT, 'src/app/layout.tsx'),
  path.join(ROOT, 'src/app/page.tsx'),
  path.join(ROOT, 'src/app/opengraph-image.tsx'),
  path.join(ROOT, 'src/app/admin/seo/page.tsx'),
  path.join(ROOT, 'src/components/Header.tsx'),
  path.join(ROOT, 'src/components/Footer.tsx'),
]
const TOOL_FILES = [
  path.join(ROOT, 'src/lib/tools.ts'),
  path.join(ROOT, 'src/lib/advancedTools.ts'),
]

const errors = []
const warnings = []

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function exists(filePath) {
  return fs.existsSync(filePath)
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
    } else if (value === 'true') {
      data[key] = true
      continue
    } else if (value === 'false') {
      data[key] = false
      continue
    }

    data[key] = value
  }

  return { data, content }
}

function normalizeInternalHref(href) {
  return href.split('#')[0].split('?')[0].replace(/\/$/, '')
}

function collectToolSlugs() {
  const slugs = new Set()

  for (const file of TOOL_FILES) {
    if (!exists(file)) continue
    const content = read(file)
    for (const match of content.matchAll(/slug:\s*'([^']+)'/g)) {
      slugs.add(match[1])
    }
  }

  const toolsDir = path.join(APP_DIR, 'tools')
  if (exists(toolsDir)) {
    for (const entry of fs.readdirSync(toolsDir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith('[') && entry.name !== 'category') {
        slugs.add(entry.name)
      }
    }
  }

  return slugs
}

function collectBlogFiles() {
  if (!exists(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx') && !file.startsWith('_'))
    .map((file) => path.join(BLOG_DIR, file))
}

function checkAdSenseVerificationSignals() {
  const layout = path.join(APP_DIR, 'layout.tsx')
  const adsTxt = path.join(ROOT, 'public/ads.txt')
  const publisherId = 'ca-pub-7517734428269304'
  const adsTxtLine = 'google.com, pub-7517734428269304, DIRECT, f08c47fec0942fa0'

  if (!exists(layout) || !read(layout).includes(`client=${publisherId}`)) {
    errors.push('AdSense verification failed: global AdSense script is missing from src/app/layout.tsx')
  }

  if (!exists(adsTxt)) {
    errors.push('AdSense verification failed: public/ads.txt is missing')
  } else if (!read(adsTxt).includes(adsTxtLine)) {
    errors.push('AdSense verification failed: public/ads.txt is missing the Google authorized seller line')
  }
}

function checkAdSenseReadinessSignals() {
  const requiredRoutes = ['about', 'contact', 'privacy', 'terms']
  const sitemap = path.join(APP_DIR, 'sitemap.ts')
  const footer = path.join(ROOT, 'src/components/Footer.tsx')
  const privacy = path.join(APP_DIR, 'privacy/page.tsx')
  const terms = path.join(APP_DIR, 'terms/page.tsx')

  for (const route of requiredRoutes) {
    const routeFile = path.join(APP_DIR, route, 'page.tsx')
    if (!exists(routeFile)) {
      errors.push(`AdSense readiness failed: missing /${route} page`)
    }
  }

  if (exists(sitemap)) {
    const sitemapContent = read(sitemap)
    for (const route of requiredRoutes) {
      if (!sitemapContent.includes(`/${route}`)) {
        errors.push(`AdSense readiness failed: /${route} is missing from sitemap.ts`)
      }
    }
  }

  if (exists(footer)) {
    const footerContent = read(footer)
    for (const route of requiredRoutes) {
      if (!footerContent.includes(`href="/${route}"`) && !footerContent.includes(`href: '/${route}'`)) {
        errors.push(`AdSense readiness failed: footer does not link /${route}`)
      }
    }
  }

  if (exists(privacy)) {
    const privacyContent = read(privacy).toLowerCase()
    for (const term of ['cookies', 'analytics', 'advertising', 'children', 'contact']) {
      if (!privacyContent.includes(term)) {
        errors.push(`AdSense readiness failed: privacy policy is missing ${term} coverage`)
      }
    }
  }

  if (exists(terms)) {
    const termsContent = read(terms).toLowerCase()
    for (const term of ['advertising', 'third-party', 'professional advice', 'contact']) {
      if (!termsContent.includes(term)) {
        errors.push(`AdSense readiness failed: terms page is missing ${term} coverage`)
      }
    }
  }
}

function checkPublicToolCountSource() {
  const hardcodedCountPattern = /\b\d{2,4}\s+(?:Free\s+)?Tools?\b/i

  for (const file of PUBLIC_SEO_SOURCE_FILES) {
    if (!exists(file)) continue
    const rel = path.relative(ROOT, file)
    const content = read(file)

    for (const [index, line] of content.split('\n').entries()) {
      if (hardcodedCountPattern.test(line)) {
        errors.push(
          `${rel}:${index + 1} contains a hardcoded public tool count. Use ALL_TOOLS.length/TOTAL_TOOLS so title, schema, OG, nav, and previews stay current.`
        )
      }
    }
  }

  const homepage = path.join(APP_DIR, 'page.tsx')
  if (exists(homepage)) {
    const content = read(homepage)
    const requiredHomepageSignals = [
      ['metadata title uses dynamic tool count label', /title:\s*`[^`]*\$\{TOOL_COUNT_LABEL\}[^`]*Free Tools/i],
      ['Open Graph title uses dynamic tool count label', /openGraph:[\s\S]*?title:\s*`[^`]*\$\{TOOL_COUNT_LABEL\}[^`]*Free Tools/i],
      ['Twitter title uses dynamic tool count label', /twitter:[\s\S]*?title:\s*`[^`]*\$\{TOOL_COUNT_LABEL\}[^`]*Free Tools/i],
      ['ItemList schema exposes numberOfItems', /numberOfItems:\s*allTools\.length/],
      ['homepage FAQ schema uses dynamic tool count label', /FAQPage[\s\S]*\$\{TOOL_COUNT_LABEL\}/],
    ]

    for (const [label, pattern] of requiredHomepageSignals) {
      if (!pattern.test(content)) {
        errors.push(`src/app/page.tsx schema QA failed: ${label}`)
      }
    }
  }

  const layout = path.join(APP_DIR, 'layout.tsx')
  if (exists(layout)) {
    const content = read(layout)
    const requiredLayoutSignals = [
      ['Organization schema description uses dynamic tool count label', /Organization[\s\S]*description:\s*`[^`]*\$\{TOOL_COUNT_LABEL\}/],
      ['Open Graph image alt uses dynamic tool count label', /alt:\s*`\$\{TOOL_COUNT_LABEL\}\s+free tools/i],
    ]

    for (const [label, pattern] of requiredLayoutSignals) {
      if (!pattern.test(content)) {
        errors.push(`src/app/layout.tsx schema QA failed: ${label}`)
      }
    }
  }
}

function checkInternalLink(href, sourceFile, blogSlugs, toolSlugs) {
  const normalized = normalizeInternalHref(href)
  if (!normalized || normalized === '/') return
  if (normalized === '/blog' || normalized === '/privacy' || normalized === '/terms') return
  if (normalized === '/sitemap.xml' || normalized.startsWith('/#')) return
  if (normalized.startsWith('/tools/category/')) return

  if (normalized.startsWith('/blog/')) {
    const slug = normalized.replace('/blog/', '').split('/')[0]
    if (!blogSlugs.has(slug)) {
      errors.push(`${path.relative(ROOT, sourceFile)} links to missing blog post: ${href}`)
    }
    return
  }

  if (normalized.startsWith('/tools/')) {
    const slug = normalized.replace('/tools/', '').split('/')[0]
    if (!toolSlugs.has(slug)) {
      errors.push(`${path.relative(ROOT, sourceFile)} links to missing tool: ${href}`)
    }
    return
  }

  const appRoute = path.join(APP_DIR, normalized.slice(1))
  if (!exists(appRoute) && !exists(`${appRoute}.tsx`)) {
    warnings.push(`${path.relative(ROOT, sourceFile)} links to unchecked internal path: ${href}`)
  }
}

function checkBlogPost(filePath, data, content, seenTitles, seenDescriptions, blogSlugs, toolSlugs) {
  const rel = path.relative(ROOT, filePath)
  const slug = path.basename(filePath, '.mdx')
  const title = String(data.title ?? '').trim()
  const description = String(data.description ?? '').trim()
  const seoTitle = String(data.seoTitle ?? title).trim()
  const seoDescription = String(data.seoDescription ?? description).trim()
  const status = data.status ?? (data.published === true ? 'published' : 'draft')
  const words = wordCount(content)

  if (!title) errors.push(`${rel} is missing title`)
  if (!description) errors.push(`${rel} is missing description`)
  if (!data.date && !data.publishDate) errors.push(`${rel} is missing date or publishDate`)
  if (status !== 'published' && data.published !== true) warnings.push(`${rel} is not published`)

  if (seoTitle.length > 65) warnings.push(`${rel} seoTitle/title is ${seoTitle.length} characters; aim for 50-60`)
  if (seoDescription.length > 165) warnings.push(`${rel} seoDescription/description is ${seoDescription.length} characters; aim for 145-160`)
  if (words < 650 && status === 'published') warnings.push(`${rel} has ${words} words; consider more depth or mark draft`)
  if (words >= 1000 && !/^##\s+FAQ\s*$/im.test(content)) warnings.push(`${rel} is long-form but has no ## FAQ section`)

  if (seenTitles.has(title)) warnings.push(`${rel} duplicates blog title: ${title}`)
  if (seenDescriptions.has(description)) warnings.push(`${rel} duplicates blog description`)
  seenTitles.add(title)
  seenDescriptions.add(description)

  const markdownLinks = [...content.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g)]
  for (const match of markdownLinks) {
    checkInternalLink(match[1], filePath, blogSlugs, toolSlugs)
  }

  if (!content.includes('/tools/') && status === 'published') {
    warnings.push(`${rel} has no internal tool link; every SEO post should funnel to a tool`)
  }

  if (slug.length > 85) warnings.push(`${rel} slug is long; keep future slugs concise when possible`)
}

const blogFiles = collectBlogFiles()
const blogSlugs = new Set(blogFiles.map((file) => path.basename(file, '.mdx')))
const toolSlugs = collectToolSlugs()
const seenTitles = new Set()
const seenDescriptions = new Set()

checkPublicToolCountSource()
checkAdSenseReadinessSignals()
checkAdSenseVerificationSignals()

for (const file of blogFiles) {
  const { data, content } = parseFrontmatter(read(file))
  checkBlogPost(file, data, content, seenTitles, seenDescriptions, blogSlugs, toolSlugs)
}

console.log(`SEO QA checked ${blogFiles.length} blog posts and ${toolSlugs.size} tool slugs.`)

if (warnings.length) {
  console.log('\nWarnings:')
  for (const warning of warnings) console.log(`- ${warning}`)
}

if (errors.length) {
  console.error('\nErrors:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('\nSEO QA passed.')

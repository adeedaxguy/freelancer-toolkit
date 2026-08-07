import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns/promises'
import net from 'net'

export const runtime = 'nodejs'

const MAX_HTML_BYTES = 900_000
const FETCH_TIMEOUT_MS = 8500
const MAX_LINK_CHECKS = 25
const MAX_REDIRECT_HOPS = 8

type LinkStatus = {
  inputUrl: string
  url: string
  finalUrl: string
  status: number | null
  ok: boolean
  redirectCount: number
  error?: string
}

function isPrivateIp(address: string) {
  const version = net.isIP(address)
  if (version === 4) {
    const [a = 0, b = 0] = address.split('.').map((part) => Number(part))
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    )
  }

  if (version === 6) {
    const lower = address.toLowerCase()
    return lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80:')
  }

  return false
}

function coerceUrl(value: string, baseUrl?: string) {
  const raw = value.trim()
  if (!raw) throw new Error('URL is required')
  if (/^https?:\/\//i.test(raw)) return new URL(raw)
  if (raw.startsWith('/') && baseUrl) return new URL(raw, baseUrl)
  return new URL(`https://${raw}`)
}

async function assertPublicUrl(url: URL) {
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http and https URLs are supported')

  const host = url.hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
    throw new Error('Local/private hosts are not supported')
  }

  if (net.isIP(host)) {
    if (isPrivateIp(host)) throw new Error('Private IP addresses are not supported')
    return
  }

  const addresses = await dns.lookup(host, { all: true, verbatim: true })
  if (addresses.some((entry) => isPrivateIp(entry.address))) {
    throw new Error('Private network destinations are not supported')
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'user-agent': 'FreelTools SEO Analyzer (+https://freeltools.com)',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(init.headers ?? {}),
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function readLimitedText(response: Response) {
  const contentLength = Number(response.headers.get('content-length') ?? 0)
  if (contentLength > MAX_HTML_BYTES) throw new Error('Page is too large for a quick browser audit')

  const text = await response.text()
  if (text.length > MAX_HTML_BYTES) return text.slice(0, MAX_HTML_BYTES)
  return text
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function readAttr(tag: string, name: string) {
  return decodeHtml(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? '')
}

function readMeta(html: string, key: string) {
  const metas = html.match(/<meta\b[^>]*>/gi) ?? []
  const wanted = key.toLowerCase()
  for (const tag of metas) {
    const name = readAttr(tag, 'name').toLowerCase()
    const property = readAttr(tag, 'property').toLowerCase()
    if (name === wanted || property === wanted) return readAttr(tag, 'content')
  }
  return ''
}

function readCanonical(html: string) {
  const links = html.match(/<link\b[^>]*>/gi) ?? []
  const canonical = links.find((tag) => readAttr(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'))
  return canonical ? readAttr(canonical, 'href') : ''
}

function extractPageSeo(html: string, pageUrl: string, status: number, finalUrl: string) {
  const base = new URL(finalUrl || pageUrl)
  const title = stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
  const description = readMeta(html, 'description')
  const canonical = readCanonical(html)
  const robots = readMeta(html, 'robots')
  const ogTitle = readMeta(html, 'og:title')
  const ogDescription = readMeta(html, 'og:description')
  const ogImage = readMeta(html, 'og:image')
  const twitterTitle = readMeta(html, 'twitter:title')
  const twitterDescription = readMeta(html, 'twitter:description')
  const twitterImage = readMeta(html, 'twitter:image')

  const headings = Array.from(html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)).map((match, index) => {
    const tag = match[1].toLowerCase()
    return {
      index: index + 1,
      tag,
      level: Number(tag.replace('h', '')),
      text: stripTags(match[2] ?? ''),
    }
  })

  const imageTagPattern = new RegExp('<' + 'img\\b[^>]*>', 'gi')
  const images = Array.from(html.matchAll(imageTagPattern)).slice(0, 300).map((match, index) => {
    const tag = match[0]
    const alt = readAttr(tag, 'alt')
    return {
      index: index + 1,
      src: readAttr(tag, 'src'),
      alt,
      hasAltAttribute: /\balt\s*=/.test(tag),
      genericAlt: /^(image|photo|picture|graphic|img|screenshot)$/i.test(alt),
    }
  })

  const links = Array.from(html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)).slice(0, 600).map((match) => {
    const attrs = match[1] ?? ''
    const href = readAttr(attrs, 'href')
    let absolute = href
    try {
      absolute = new URL(href, base).toString()
    } catch {
      absolute = href
    }
    const text = stripTags(match[2] ?? '')
    const host = (() => {
      try {
        return new URL(absolute).hostname.replace(/^www\./, '')
      } catch {
        return ''
      }
    })()
    return {
      href,
      absolute,
      text,
      rel: readAttr(attrs, 'rel'),
      internal: href.startsWith('#') || host === base.hostname.replace(/^www\./, ''),
    }
  })

  const bodyText = stripTags(html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html).slice(0, 45_000)
  const h1s = headings.filter((heading) => heading.level === 1)

  return {
    requestedUrl: pageUrl,
    finalUrl,
    status,
    title,
    description,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    h1s: h1s.map((heading) => heading.text),
    h1: h1s.map((heading) => heading.text).join(' | '),
    headings,
    bodyText,
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
    imageCount: images.length,
    imagesMissingAlt: images.filter((image) => !image.hasAltAttribute || (!image.alt && !image.hasAltAttribute)).length,
    genericAltCount: images.filter((image) => image.genericAlt).length,
    internalLinks: links.filter((link) => link.internal).length,
    externalLinks: links.filter((link) => !link.internal && /^https?:\/\//i.test(link.absolute)).length,
    links,
    images,
  }
}

async function analyzePage(urlValue: string) {
  const url = coerceUrl(urlValue)
  await assertPublicUrl(url)
  const response = await fetchWithTimeout(url.toString(), { redirect: 'follow' })
  const contentType = response.headers.get('content-type') ?? ''
  if (!/text\/html|application\/xhtml\+xml|application\/xml/i.test(contentType)) {
    throw new Error(`URL returned ${contentType || 'a non-HTML response'}`)
  }
  const html = await readLimitedText(response)
  return extractPageSeo(html, url.toString(), response.status, response.url || url.toString())
}

async function checkOneLink(value: string, baseUrl?: string): Promise<LinkStatus> {
  try {
    const url = coerceUrl(value, baseUrl)
    await assertPublicUrl(url)
    let response = await fetchWithTimeout(url.toString(), { method: 'HEAD', redirect: 'follow' })
    if ([403, 405, 501].includes(response.status)) {
      response = await fetchWithTimeout(url.toString(), { method: 'GET', redirect: 'follow' })
    }
    return {
      inputUrl: value,
      url: url.toString(),
      finalUrl: response.url || url.toString(),
      status: response.status,
      ok: response.status < 400,
      redirectCount: response.redirected && response.url !== url.toString() ? 1 : 0,
    }
  } catch (error) {
    return {
      inputUrl: value,
      url: value,
      finalUrl: value,
      status: null,
      ok: false,
      redirectCount: 0,
      error: error instanceof Error ? error.message : 'Could not check URL',
    }
  }
}

async function traceRedirects(urlValue: string) {
  let current = coerceUrl(urlValue)
  const chain: { url: string; status: number | null; location: string; error?: string }[] = []

  for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop += 1) {
    try {
      await assertPublicUrl(current)
      let response = await fetchWithTimeout(current.toString(), { method: 'HEAD', redirect: 'manual' })
      if ([403, 405, 501].includes(response.status)) {
        response = await fetchWithTimeout(current.toString(), { method: 'GET', redirect: 'manual' })
      }
      const location = response.headers.get('location') ?? ''
      chain.push({ url: current.toString(), status: response.status, location })

      if (response.status < 300 || response.status >= 400 || !location) break
      current = new URL(location, current)
      if (chain.some((hopRow) => hopRow.url === current.toString())) {
        chain.push({ url: current.toString(), status: null, location: '', error: 'Redirect loop detected' })
        break
      }
    } catch (error) {
      chain.push({
        url: current.toString(),
        status: null,
        location: '',
        error: error instanceof Error ? error.message : 'Could not trace redirect',
      })
      break
    }
  }

  return chain
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const mode = String(body.mode ?? 'page')

    if (mode === 'page') {
      const result = await analyzePage(String(body.url ?? ''))
      return NextResponse.json({ ok: true, result })
    }

    if (mode === 'links') {
      const rawUrls: unknown[] = Array.isArray(body.urls) ? body.urls : []
      const urls = rawUrls.map((url: unknown) => String(url)).filter(Boolean).slice(0, MAX_LINK_CHECKS)
      const results = await Promise.all(urls.map((url) => checkOneLink(url, typeof body.baseUrl === 'string' ? body.baseUrl : undefined)))
      return NextResponse.json({ ok: true, results, limit: MAX_LINK_CHECKS })
    }

    if (mode === 'redirects') {
      const chain = await traceRedirects(String(body.url ?? ''))
      return NextResponse.json({ ok: true, chain, limit: MAX_REDIRECT_HOPS })
    }

    return NextResponse.json({ ok: false, error: 'Unknown SEO analysis mode' }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'SEO analysis failed' },
      { status: 400 }
    )
  }
}

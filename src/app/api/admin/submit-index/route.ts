import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ALL_TOOLS } from '@/lib/tools'
import { getAllPosts } from '@/lib/blog'

const BASE_URL = 'https://freeltools.com'
const INDEXNOW_KEY = 'b7f3a9e2c1d84f56b0e7a3d9c2f18e45'

function getAllUrls(): string[] {
  const urls: string[] = [BASE_URL, `${BASE_URL}/blog`]

  // All tool pages + variants
  for (const tool of ALL_TOOLS) {
    urls.push(`${BASE_URL}/tools/${tool.slug}`)
    for (const v of tool.programmaticVariants ?? []) {
      urls.push(`${BASE_URL}/tools/${tool.slug}/${v.slug}`)
    }
  }

  // Published blog posts
  const posts = getAllPosts()
  for (const post of posts) {
    urls.push(`${BASE_URL}/blog/${post.slug}`)
  }

  return urls
}

export async function POST() {
  // Admin auth check
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('admin_session')
  if (!adminCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const urls = getAllUrls()
  const results: Record<string, unknown> = {}

  // 1. IndexNow — covers Bing, Yandex, and others
  try {
    const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'freeltools.com',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })
    results.indexNow = { status: indexNowRes.status, urls: urls.length }
  } catch (e) {
    results.indexNow = { error: String(e) }
  }

  // 2. Bing directly (redundant but belt-and-suspenders)
  try {
    const bingRes = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'freeltools.com',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })
    results.bing = { status: bingRes.status }
  } catch (e) {
    results.bing = { error: String(e) }
  }

  // 3. Google sitemap ping (best-effort, deprecated but still works)
  try {
    const googleRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE_URL}/sitemap.xml`)}`,
      { method: 'GET' }
    )
    results.google = { status: googleRes.status }
  } catch (e) {
    results.google = { error: String(e) }
  }

  return NextResponse.json({
    ok: true,
    submitted: urls.length,
    results,
    urls,
  })
}

export async function GET() {
  // Return the list of URLs that would be submitted (preview mode)
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('admin_session')
  if (!adminCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const urls = getAllUrls()
  return NextResponse.json({ total: urls.length, urls })
}

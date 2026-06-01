import { NextResponse } from 'next/server'
import matter from 'gray-matter'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO // e.g. "adeedaxguy/freelancer-toolkit"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
const BLOG_PATH = 'src/content/blog'

interface GitHubFile {
  name: string
  path: string
  sha: string
  download_url: string
}

async function getRepoFiles(): Promise<GitHubFile[]> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOG_PATH}?ref=${GITHUB_BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data.filter((f: GitHubFile) => f.name.endsWith('.mdx')) : []
}

async function getFileContent(file: GitHubFile): Promise<{ content: string; sha: string }> {
  const res = await fetch(file.download_url)
  const content = await res.text()
  return { content, sha: file.sha }
}

async function updateFile(path: string, sha: string, content: string, message: string) {
  const encoded = Buffer.from(content).toString('base64')
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, content: encoded, sha, branch: GITHUB_BRANCH }),
    }
  )
  return res.ok
}

// POST /api/admin/publish-scheduled
// Called by the Cowork scheduled task every hour to auto-publish scheduled posts
export async function POST() {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json({ ok: false, message: 'GITHUB_TOKEN or GITHUB_REPO not configured' }, { status: 500 })
  }

  try {
    const now = new Date()
    const files = await getRepoFiles()
    const published: string[] = []

    for (const file of files) {
      const { content: raw, sha } = await getFileContent(file)
      const { data, content } = matter(raw)

      if (data.status === 'scheduled' && data.publishDate) {
        const pubDate = new Date(data.publishDate)
        if (pubDate <= now) {
          const updated = matter.stringify(content, { ...data, status: 'published' })
          const slug = file.name.replace('.mdx', '')
          const ok = await updateFile(
            `${BLOG_PATH}/${file.name}`,
            sha,
            updated,
            `Auto-publish: ${slug}`
          )
          if (ok) published.push(slug)
        }
      }
    }

    return NextResponse.json({
      ok: true,
      published,
      count: published.length,
      message: published.length > 0
        ? `Published ${published.length} post(s): ${published.join(', ')}`
        : 'No scheduled posts ready to publish',
    })
  } catch (err) {
    console.error('Publish scheduled error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

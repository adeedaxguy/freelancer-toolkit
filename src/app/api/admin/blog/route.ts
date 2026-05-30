import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, savePost, slugify } from '@/lib/blog'

// GET /api/admin/blog — list all posts (including drafts/scheduled)
export async function GET() {
  const posts = getAllPosts(true)
  return NextResponse.json(posts)
}

// POST /api/admin/blog — create a new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, content, status, publishDate, tags, author } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content required' }, { status: 400 })
    }

    const slug = slugify(title)
    const today = new Date().toISOString().split('T')[0]

    savePost(slug, {
      title,
      description: description ?? '',
      content,
      status: status ?? 'draft',
      date: today,
      publishDate: publishDate ?? today,
      tags: Array.isArray(tags) ? tags : (tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
      author: author ?? 'FreelancerToolkit',
    })

    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

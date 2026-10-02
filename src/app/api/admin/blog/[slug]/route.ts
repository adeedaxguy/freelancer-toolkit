import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, savePost, deletePost } from '@/lib/blog'

interface Params { params: Promise<{ slug: string }> }

// GET single post
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

// PUT — update a post
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const body = await req.json()
    const existing = getPostBySlug(slug)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    savePost(slug, {
      ...existing,
      ...body,
      // Preserve created date
      date: existing.date,
    })
    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — remove a post
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const existing = getPostBySlug(slug)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  deletePost(slug)
  return NextResponse.json({ ok: true })
}

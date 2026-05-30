import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, savePost, deletePost } from '@/lib/blog'

interface Params { params: { slug: string } }

// GET single post
export async function GET(_req: NextRequest, { params }: Params) {
  const post = getPostBySlug(params.slug)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

// PUT — update a post
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const existing = getPostBySlug(params.slug)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    savePost(params.slug, {
      ...existing,
      ...body,
      // Preserve created date
      date: existing.date,
    })
    return NextResponse.json({ ok: true, slug: params.slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — remove a post
export async function DELETE(_req: NextRequest, { params }: Params) {
  const existing = getPostBySlug(params.slug)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  deletePost(params.slug)
  return NextResponse.json({ ok: true })
}

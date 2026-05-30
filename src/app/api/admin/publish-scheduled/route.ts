import { NextResponse } from 'next/server'
import { publishScheduledPosts } from '@/lib/blog'

// POST /api/admin/publish-scheduled
// Called by the Cowork scheduled task every hour to auto-publish scheduled posts
export async function POST() {
  if (process.env.VERCEL) {
    return NextResponse.json({ ok: false, message: 'Admin write operations run locally only — commit & push MDX files to publish.' })
  }
  try {
    const published = publishScheduledPosts()
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

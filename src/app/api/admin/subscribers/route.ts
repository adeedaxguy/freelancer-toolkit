import { NextResponse } from 'next/server'

export async function GET() {
  const apiSecret = process.env.CONVERTKIT_API_SECRET
  const apiKey = process.env.CONVERTKIT_API_KEY

  if (!apiSecret) {
    return NextResponse.json({ error: 'CONVERTKIT_API_SECRET not set', subscribers: [], total: 0 })
  }

  try {
    // Fetch subscribers from ConvertKit v3 API
    const res = await fetch(
      `https://api.convertkit.com/v3/subscribers?api_secret=${apiSecret}&sort_field=created_at&sort_order=desc&page=1&per_page=100`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'ConvertKit API error', subscribers: [], total: 0 }, { status: 502 })
    }

    const data = await res.json()

    // Also get total count
    const countRes = await fetch(
      `https://api.convertkit.com/v3/subscribers?api_secret=${apiSecret}`,
      { next: { revalidate: 60 } }
    )
    const countData = await countRes.json()

    return NextResponse.json({
      subscribers: data.subscribers ?? [],
      total: countData.total_subscribers ?? 0,
      page: data.page ?? 1,
      totalPages: data.total_pages ?? 1,
      apiKey: apiKey ? `${apiKey.slice(0, 6)}…` : null,
    })
  } catch (err) {
    console.error('ConvertKit error:', err)
    return NextResponse.json({ error: 'Failed to fetch subscribers', subscribers: [], total: 0 }, { status: 500 })
  }
}

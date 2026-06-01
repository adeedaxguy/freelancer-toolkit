import { NextRequest, NextResponse } from 'next/server'
import { readRequests, writeRequests } from '@/lib/requests'
import { sendEmail, toolRequestEmail } from '@/lib/email'

export async function GET() {
  const requests = readRequests()
  const sorted = [...requests].sort((a, b) => b.votes - a.votes)
  return NextResponse.json(sorted)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { toolName, description, email } = body

    if (!toolName || toolName.trim().length < 3) {
      return NextResponse.json({ error: 'Tool name too short' }, { status: 400 })
    }

    let total = 1

    if (!process.env.VERCEL) {
      const requests = readRequests()
      requests.push({
        id: Date.now().toString(),
        toolName: toolName.trim(),
        description: description?.trim() || '',
        email: email?.trim() || '',
        votes: 1,
        createdAt: new Date().toISOString(),
      })
      writeRequests(requests)
      total = requests.length
    }

    const tmpl = toolRequestEmail({
      toolName: toolName.trim(),
      description: description?.trim() || '',
      email: email?.trim() || '',
      total,
    })
    await sendEmail(tmpl)

    return NextResponse.json({ ok: true, message: 'Request submitted!' })
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (process.env.VERCEL) return NextResponse.json({ ok: true })

    const requests = readRequests()
    const idx = requests.findIndex((r) => r.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    requests[idx].votes++
    writeRequests(requests)
    return NextResponse.json({ ok: true, votes: requests[idx].votes })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ToolRequest {
  id: string
  toolName: string
  description: string
  useCase: string
  email: string
  votes: number
  createdAt: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'tool-requests.json')

function readRequests(): ToolRequest[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeRequests(requests: ToolRequest[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2))
}

export async function GET() {
  const requests = readRequests()
  const sorted = [...requests].sort((a, b) => b.votes - a.votes).slice(0, 10)
  return NextResponse.json(sorted)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { toolName, description, useCase, email } = body

    if (!toolName || toolName.trim().length < 3) {
      return NextResponse.json({ error: 'Tool name too short' }, { status: 400 })
    }

    // On Vercel, we can't write to disk — just return success (in prod you'd use a DB or email)
    if (process.env.VERCEL) {
      // In production: could forward to email or a webhook here
      console.log('Tool request received:', { toolName, description, useCase, email })
      return NextResponse.json({ ok: true, message: 'Request received!' })
    }

    const requests = readRequests()
    const newRequest: ToolRequest = {
      id: Date.now().toString(),
      toolName: toolName.trim(),
      description: description?.trim() || '',
      useCase: useCase?.trim() || '',
      email: email?.trim() || '',
      votes: 1,
      createdAt: new Date().toISOString(),
    }
    requests.push(newRequest)
    writeRequests(requests)

    return NextResponse.json({ ok: true, message: 'Request submitted!' })
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // Upvote a request
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

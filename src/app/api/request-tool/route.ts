import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { sendEmail, toolRequestEmail } from '@/lib/email'

export interface ToolRequest {
  id: string
  toolName: string
  description: string
  email: string
  votes: number
  createdAt: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'tool-requests.json')

export function readRequests(): ToolRequest[] {
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
      // Local / self-hosted: persist to disk
      const requests = readRequests()
      const newRequest: ToolRequest = {
        id: Date.now().toString(),
        toolName: toolName.trim(),
        description: description?.trim() || '',
        email: email?.trim() || '',
        votes: 1,
        createdAt: new Date().toISOString(),
      }
      requests.push(newRequest)
      writeRequests(requests)
      total = requests.length
    }

    // Always send email notification (works on both local + Vercel)
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

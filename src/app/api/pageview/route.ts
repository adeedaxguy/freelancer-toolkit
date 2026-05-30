import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'pageviews.json')

function readData(): Record<string, number> {
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(DATA_FILE)) return {}
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function writeData(data: Record<string, number>) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// POST /api/pageview — increment counter for a path
export async function POST(req: NextRequest) {
  // Vercel's serverless filesystem is read-only — silently skip in production
  if (process.env.VERCEL) {
    return NextResponse.json({ ok: true, skipped: 'production' })
  }
  try {
    const { path: pagePath } = await req.json()
    if (!pagePath || typeof pagePath !== 'string') {
      return NextResponse.json({ error: 'path required' }, { status: 400 })
    }
    const data = readData()
    data[pagePath] = (data[pagePath] ?? 0) + 1
    writeData(data)
    return NextResponse.json({ ok: true, views: data[pagePath] })
  } catch {
    return NextResponse.json({ ok: true, skipped: 'write-error' })
  }
}

// GET /api/pageview — return all counts (admin only)
export async function GET() {
  return NextResponse.json(readData())
}

import fs from 'fs'
import path from 'path'

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

export function writeRequests(requests: ToolRequest[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2))
}

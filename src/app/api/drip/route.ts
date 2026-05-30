import { NextResponse } from 'next/server'
import { sendEmail, DRIP_SEQUENCE } from '@/lib/email'
import fs from 'fs'
import path from 'path'

interface DripSubscriber {
  email: string
  subscribedAt: string
  sentDays: number[]
}

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers-drip.json')

function readSubscribers(): DripSubscriber[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return []
  }
}

function writeSubscribers(subscribers: DripSubscriber[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2))
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export async function GET() {
  // Vercel read-only filesystem — drip runs locally only
  if (process.env.VERCEL) {
    return NextResponse.json({ skipped: true, reason: 'vercel_readonly' })
  }

  const subscribers = readSubscribers()
  const results: { email: string; day: number; sent: boolean }[] = []

  for (const sub of subscribers) {
    const age = daysSince(sub.subscribedAt)

    for (const drip of DRIP_SEQUENCE) {
      // Send if: subscriber is old enough AND this day hasn't been sent yet
      if (age >= drip.day && !sub.sentDays.includes(drip.day)) {
        try {
          await sendEmail({
            to: sub.email,
            subject: drip.subject,
            html: drip.html,
          })
          sub.sentDays.push(drip.day)
          results.push({ email: sub.email, day: drip.day, sent: true })
        } catch (err) {
          console.error(`[drip] failed sending day ${drip.day} to ${sub.email}:`, err)
          results.push({ email: sub.email, day: drip.day, sent: false })
        }
      }
    }
  }

  // Save updated state
  writeSubscribers(subscribers)

  return NextResponse.json({ processed: subscribers.length, results })
}

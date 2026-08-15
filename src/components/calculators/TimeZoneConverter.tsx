'use client'

import { useEffect, useMemo, useState } from 'react'

const TIMEZONES = [
  { label: 'New York (EST/EDT)', tz: 'America/New_York' },
  { label: 'Los Angeles (PST/PDT)', tz: 'America/Los_Angeles' },
  { label: 'Chicago (CST/CDT)', tz: 'America/Chicago' },
  { label: 'Denver (MST/MDT)', tz: 'America/Denver' },
  { label: 'Toronto', tz: 'America/Toronto' },
  { label: 'Vancouver', tz: 'America/Vancouver' },
  { label: 'Sao Paulo', tz: 'America/Sao_Paulo' },
  { label: 'Mexico City', tz: 'America/Mexico_City' },
  { label: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
  { label: 'London (GMT/BST)', tz: 'Europe/London' },
  { label: 'Paris / Berlin (CET)', tz: 'Europe/Paris' },
  { label: 'Amsterdam', tz: 'Europe/Amsterdam' },
  { label: 'Madrid', tz: 'Europe/Madrid' },
  { label: 'Stockholm', tz: 'Europe/Stockholm' },
  { label: 'Warsaw', tz: 'Europe/Warsaw' },
  { label: 'Istanbul', tz: 'Europe/Istanbul' },
  { label: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { label: 'Riyadh', tz: 'Asia/Riyadh' },
  { label: 'Mumbai / Delhi (IST)', tz: 'Asia/Kolkata' },
  { label: 'Dhaka (BST)', tz: 'Asia/Dhaka' },
  { label: 'Bangkok', tz: 'Asia/Bangkok' },
  { label: 'Singapore / KL', tz: 'Asia/Singapore' },
  { label: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { label: 'Shanghai / Beijing', tz: 'Asia/Shanghai' },
  { label: 'Tokyo / Seoul', tz: 'Asia/Tokyo' },
  { label: 'Sydney', tz: 'Australia/Sydney' },
  { label: 'Melbourne', tz: 'Australia/Melbourne' },
  { label: 'Auckland', tz: 'Pacific/Auckland' },
  { label: 'Honolulu (HST)', tz: 'Pacific/Honolulu' },
]

type ZonedParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const zonedFormatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(timeZone: string) {
  const cached = zonedFormatterCache.get(timeZone)
  if (cached) return cached
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  zonedFormatterCache.set(timeZone, formatter)
  return formatter
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = getFormatter(timeZone).formatToParts(date)
  const values: Record<string, number> = {}
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = Number(part.value)
  }
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  }
}

function getOffsetMs(timeZone: string, date: Date) {
  const parts = getZonedParts(date, timeZone)
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  return asUtc - date.getTime()
}

function wallTimeToUtc(dateValue: string, timeValue: string, timeZone: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hour, minute] = timeValue.split(':').map(Number)
  const wallTimeAsUtc = Date.UTC(year, month - 1, day, hour || 0, minute || 0, 0)
  let utcMs = wallTimeAsUtc

  for (let i = 0; i < 3; i += 1) {
    utcMs = wallTimeAsUtc - getOffsetMs(timeZone, new Date(utcMs))
  }

  return new Date(utcMs)
}

function formatInZone(date: Date, tz: string): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDateInZone(date: Date, tz: string): string {
  return date.toLocaleDateString('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function hourInZone(date: Date, tz: string) {
  return getZonedParts(date, tz).hour
}

function isBusinessHour(date: Date, tz: string): boolean {
  const hour = hourInZone(date, tz)
  return hour >= 9 && hour < 18
}

function formatOffset(hours: number) {
  if (Math.abs(hours) < 0.01) return 'same time'
  const direction = hours > 0 ? 'ahead' : 'behind'
  const absolute = Math.abs(hours)
  const whole = Math.trunc(absolute)
  const minutes = Math.round((absolute - whole) * 60)
  return `${whole}${minutes ? `h ${minutes}m` : 'h'} ${direction}`
}

export default function TimeZoneConverter() {
  const [myTz, setMyTz] = useState('America/New_York')
  const [clientTz, setClientTz] = useState('Europe/London')
  const [baseDate, setBaseDate] = useState('2026-01-01')
  const [timeInput, setTimeInput] = useState('09:00')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const now = new Date()
    setBaseDate(now.toISOString().split('T')[0])
    setTimeInput(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
  }, [])

  const results = useMemo(() => {
    const selectedInstant = wallTimeToUtc(baseDate, timeInput, myTz)
    const myOffset = getOffsetMs(myTz, selectedInstant)
    const clientOffset = getOffsetMs(clientTz, selectedInstant)
    const diffHours = (clientOffset - myOffset) / (1000 * 60 * 60)

    const myBusiness = isBusinessHour(selectedInstant, myTz)
    const clientBusiness = isBusinessHour(selectedInstant, clientTz)

    const hours: { hour: number; myLabel: string; clientLabel: string; overlap: boolean }[] = []
    for (let h = 0; h < 24; h += 1) {
      const instant = wallTimeToUtc(baseDate, `${String(h).padStart(2, '0')}:00`, myTz)
      hours.push({
        hour: h,
        myLabel: formatInZone(instant, myTz),
        clientLabel: formatInZone(instant, clientTz),
        overlap: isBusinessHour(instant, myTz) && isBusinessHour(instant, clientTz),
      })
    }

    const overlapHours = hours.filter((h) => h.overlap)

    return { selectedInstant, myBusiness, clientBusiness, hours, overlapHours, diffHours }
  }, [myTz, clientTz, timeInput, baseDate])

  const myTzLabel = TIMEZONES.find((t) => t.tz === myTz)?.label ?? myTz
  const clientTzLabel = TIMEZONES.find((t) => t.tz === clientTz)?.label ?? clientTz

  const meetingSummary = `${formatDateInZone(results.selectedInstant, myTz)} ${formatInZone(results.selectedInstant, myTz)} (${myTzLabel}) = ${formatDateInZone(results.selectedInstant, clientTz)} ${formatInZone(results.selectedInstant, clientTz)} (${clientTzLabel}). The client is ${formatOffset(results.diffHours)}.`
  const myStatusClass = results.myBusiness
    ? 'bg-green-200 text-green-800'
    : 'bg-slate-200 text-slate-700'
  const clientStatusClass = results.clientBusiness
    ? 'bg-green-200 text-green-800'
    : 'bg-amber-200 text-amber-800'

  async function copyMeetingSummary() {
    try {
      await navigator.clipboard.writeText(meetingSummary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Your time zone</label>
          <select className="input-field h-10" value={myTz} onChange={(e) => setMyTz(e.target.value)}>
            {TIMEZONES.map((t) => <option key={t.tz} value={t.tz}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Client time zone</label>
          <select className="input-field h-10" value={clientTz} onChange={(e) => setClientTz(e.target.value)}>
            {TIMEZONES.map((t) => <option key={t.tz} value={t.tz}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Meeting date</label>
          <input type="date" className="input-field h-10" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Your local meeting time</label>
          <input type="time" className="input-field h-10" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Meeting conversion</h2>
            <p className="mt-1 text-sm leading-6 text-brand-900">{meetingSummary}</p>
          </div>
          <button type="button" className="btn-primary shrink-0" onClick={copyMeetingSummary}>
            {copied ? 'Copied' : 'Copy meeting time'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-2xl border p-5 ${results.myBusiness ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">You ({myTzLabel})</p>
          <p className="text-3xl font-bold text-gray-900">{formatInZone(results.selectedInstant, myTz)}</p>
          <p className="mt-0.5 text-sm text-gray-500">{formatDateInZone(results.selectedInstant, myTz)}</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${myStatusClass}`}>
            {results.myBusiness ? 'Business hours' : 'Outside business hours'}
          </span>
        </div>
        <div className={`rounded-2xl border p-5 ${results.clientBusiness ? 'border-green-200 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Client ({clientTzLabel})</p>
          <p className="text-3xl font-bold text-gray-900">{formatInZone(results.selectedInstant, clientTz)}</p>
          <p className="mt-0.5 text-sm text-gray-500">{formatDateInZone(results.selectedInstant, clientTz)}</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${clientStatusClass}`}>
            {results.clientBusiness ? 'Business hours' : 'Outside business hours'}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Business-hours overlap</h2>
        <p className="mb-4 text-sm text-gray-500">Green slots mean both sides are between 9am and 6pm in their own time zone.</p>
        {results.overlapHours.length > 0 ? (
          <div className="space-y-1">
            <p className="mb-3 text-sm font-medium text-green-700">
              {results.overlapHours.length}h overlap: {results.overlapHours[0].myLabel} to {results.overlapHours[results.overlapHours.length - 1].myLabel} your time.
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs sm:grid-cols-3">
              {results.overlapHours.map((h) => (
                <div key={h.hour} className="flex justify-between gap-3 rounded-lg bg-green-50 px-3 py-1.5">
                  <span className="text-gray-700">{h.myLabel}</span>
                  <span className="font-medium text-green-700">{h.clientLabel}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
            No overlapping business hours found. Consider an async update, a recorded walkthrough, or a one-off early/late meeting.
          </div>
        )}
      </div>

      <details className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-gray-700">
          View full 24-hour schedule
        </summary>
        <div className="border-t border-gray-100 px-6 pb-4 pt-2">
          <div className="mb-2 grid grid-cols-3 gap-1 px-2 text-xs font-semibold text-gray-400">
            <span>Hour</span><span>You</span><span>Client</span>
          </div>
          <div className="max-h-64 space-y-0.5 overflow-y-auto">
            {results.hours.map((h) => {
              const rowClass = h.overlap
                ? 'grid grid-cols-3 gap-1 rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-800'
                : 'grid grid-cols-3 gap-1 rounded px-2 py-1 text-xs text-slate-600'
              return (
                <div key={h.hour} className={rowClass}>
                  <span>{String(h.hour).padStart(2, '0')}:00</span>
                  <span>{h.myLabel}</span>
                  <span>{h.clientLabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      </details>
    </div>
  )
}

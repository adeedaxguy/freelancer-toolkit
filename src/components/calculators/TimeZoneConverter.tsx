'use client'

import { useEffect, useMemo, useState } from 'react'

const TIMEZONES = [
  { label: 'New York (EST/EDT)', tz: 'America/New_York' },
  { label: 'Los Angeles (PST/PDT)', tz: 'America/Los_Angeles' },
  { label: 'Chicago (CST/CDT)', tz: 'America/Chicago' },
  { label: 'Denver (MST/MDT)', tz: 'America/Denver' },
  { label: 'Toronto', tz: 'America/Toronto' },
  { label: 'Vancouver', tz: 'America/Vancouver' },
  { label: 'São Paulo', tz: 'America/Sao_Paulo' },
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

function getOffsetHours(tz: string, date: Date): number {
  const utcMs = date.getTime()
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }))
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
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
  })
}

function isBusinessHour(date: Date, tz: string): boolean {
  const hour = parseInt(date.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', hour12: false }))
  return hour >= 9 && hour < 18
}

export default function TimeZoneConverter() {
  const [myTz, setMyTz] = useState('America/New_York')
  const [clientTz, setClientTz] = useState('Europe/London')
  const [baseDate, setBaseDate] = useState('2026-01-01')
  const [timeInput, setTimeInput] = useState('09:00')

  useEffect(() => {
    const now = new Date()
    setBaseDate(now.toISOString().split('T')[0])
    setTimeInput(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
  }, [])

  const results = useMemo(() => {
    const [hh, mm] = timeInput.split(':').map(Number)
    const now = new Date(`${baseDate}T00:00:00`)
    now.setHours(hh, mm, 0, 0)

    // Convert: input is in myTz, output in clientTz
    const myOffset = getOffsetHours(myTz, now)
    const clientOffset = getOffsetHours(clientTz, now)
    const diffHours = clientOffset - myOffset

    const clientTime = new Date(now.getTime() + diffHours * 60 * 60 * 1000)

    const myBusiness = isBusinessHour(now, myTz)
    const clientBusiness = isBusinessHour(clientTime, clientTz)

    // Build a 24-hour overlap table
    const hours: { hour: number; myLabel: string; clientLabel: string; overlap: boolean }[] = []
    for (let h = 0; h < 24; h++) {
      const d = new Date(now)
      d.setHours(h, 0, 0, 0)
      const cd = new Date(d.getTime() + diffHours * 60 * 60 * 1000)
      const myH = parseInt(d.toLocaleTimeString('en-US', { timeZone: myTz, hour: '2-digit', hour12: false }))
      const clientH = parseInt(cd.toLocaleTimeString('en-US', { timeZone: clientTz, hour: '2-digit', hour12: false }))
      hours.push({
        hour: h,
        myLabel: d.toLocaleTimeString('en-US', { timeZone: myTz, hour: '2-digit', minute: '2-digit', hour12: true }),
        clientLabel: cd.toLocaleTimeString('en-US', { timeZone: clientTz, hour: '2-digit', minute: '2-digit', hour12: true }),
        overlap: myH >= 9 && myH < 18 && clientH >= 9 && clientH < 18,
      })
    }
    const overlapHours = hours.filter((h) => h.overlap)

    return { clientTime, myBusiness, clientBusiness, hours, overlapHours, diffHours }
  }, [myTz, clientTz, timeInput, baseDate])

  const myTzLabel = TIMEZONES.find((t) => t.tz === myTz)?.label ?? myTz
  const clientTzLabel = TIMEZONES.find((t) => t.tz === clientTz)?.label ?? clientTz

  const [hh, mm] = timeInput.split(':').map(Number)
  const inputDate = new Date(`${baseDate}T00:00:00`)
  inputDate.setHours(hh, mm, 0, 0)
  const clientDate = new Date(inputDate.getTime() + results.diffHours * 60 * 60 * 1000)

  return (
    <div className="space-y-6">
      {/* Config */}
      <div className="grid gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Your Time Zone</label>
          <select className="input-field h-10" value={myTz} onChange={(e) => setMyTz(e.target.value)}>
            {TIMEZONES.map((t) => <option key={t.tz} value={t.tz}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Client Time Zone</label>
          <select className="input-field h-10" value={clientTz} onChange={(e) => setClientTz(e.target.value)}>
            {TIMEZONES.map((t) => <option key={t.tz} value={t.tz}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Your Time</label>
          <input type="time" className="input-field h-10" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} />
        </div>
      </div>

      {/* Result cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-2xl border p-5 ${results.myBusiness ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">You ({myTzLabel})</p>
          <p className="text-3xl font-bold text-gray-900">{formatInZone(inputDate, myTz)}</p>
          <p className="text-sm text-gray-500 mt-0.5">{formatDateInZone(inputDate, myTz)}</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${results.myBusiness ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
            {results.myBusiness ? '✓ Business hours' : '✗ Outside business hours'}
          </span>
        </div>
        <div className={`rounded-2xl border p-5 ${results.clientBusiness ? 'border-green-200 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Client ({clientTzLabel})</p>
          <p className="text-3xl font-bold text-gray-900">{formatInZone(clientDate, clientTz)}</p>
          <p className="text-sm text-gray-500 mt-0.5">{formatDateInZone(clientDate, clientTz)}</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${results.clientBusiness ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
            {results.clientBusiness ? '✓ Business hours' : '✗ Outside business hours'}
          </span>
        </div>
      </div>

      {/* Overlap */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Business Hours Overlap</h2>
        <p className="mb-4 text-xs text-gray-400">Green = both parties are in business hours (9am–6pm)</p>
        {results.overlapHours.length > 0 ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-700 mb-3">
              ✓ {results.overlapHours.length}h overlap — {results.overlapHours[0].myLabel} to {results.overlapHours[results.overlapHours.length - 1].myLabel} your time
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs sm:grid-cols-3">
              {results.overlapHours.map((h) => (
                <div key={h.hour} className="flex justify-between rounded-lg bg-green-50 px-3 py-1.5">
                  <span className="text-gray-700">{h.myLabel}</span>
                  <span className="text-green-700 font-medium">{h.clientLabel}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
            ⚠ No overlapping business hours found. Consider a very early morning or evening meeting, or async communication.
          </div>
        )}
      </div>

      {/* Full day table */}
      <details className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-gray-700">
          View Full 24-Hour Schedule ▾
        </summary>
        <div className="border-t border-gray-100 px-6 pb-4 pt-2">
          <div className="grid grid-cols-3 gap-1 text-xs font-semibold text-gray-400 mb-2 px-2">
            <span>Hour</span><span>You</span><span>Client</span>
          </div>
          <div className="space-y-0.5 max-h-64 overflow-y-auto">
            {results.hours.map((h) => (
              <div key={h.hour} className={`grid grid-cols-3 gap-1 rounded px-2 py-1 text-xs ${h.overlap ? 'bg-green-50 text-green-800 font-medium' : 'text-gray-600'}`}>
                <span>{String(h.hour).padStart(2, '0')}:00</span>
                <span>{h.myLabel}</span>
                <span>{h.clientLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

interface Attendee {
  id: number
  role: string
  rate: number
}

let nextId = 4

export default function MeetingCostCalculator() {
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 1, role: 'Project Manager', rate: 75 },
    { id: 2, role: 'Developer', rate: 100 },
    { id: 3, role: 'Designer', rate: 85 },
  ])
  const [duration, setDuration] = useState(60)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const costPerMinute = useMemo(() => {
    const totalHourly = attendees.reduce((sum, a) => sum + a.rate, 0)
    return totalHourly / 60
  }, [attendees])

  const plannedCost = useMemo(() => costPerMinute * duration, [costPerMinute, duration])
  const liveCost = useMemo(() => costPerMinute * (elapsed / 60), [costPerMinute, elapsed])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running])

  const toggleTimer = () => setRunning((r) => !r)
  const resetTimer = () => { setRunning(false); setElapsed(0) }

  const updateAttendee = (id: number, field: keyof Attendee, value: string | number) =>
    setAttendees((list) => list.map((a) => (a.id === id ? { ...a, [field]: value } : a)))

  const addAttendee = () =>
    setAttendees((list) => [...list, { id: nextId++, role: 'Attendee', rate: 75 }])

  const removeAttendee = (id: number) =>
    setAttendees((list) => list.filter((a) => a.id !== id))

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const overtimeMinutes = Math.max(0, elapsed / 60 - duration)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendees */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Meeting Attendees</h2>

          {attendees.map((a) => (
            <div key={a.id} className="flex gap-2 items-center">
              <input
                className="input-field flex-1 text-sm"
                value={a.role}
                onChange={(e) => updateAttendee(a.id, 'role', e.target.value)}
                placeholder="Role"
              />
              <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                <span className="px-2 text-sm text-gray-400">$</span>
                <input
                  className="w-20 py-2 text-sm text-gray-900 focus:outline-none pr-2"
                  type="number"
                  value={a.rate}
                  onChange={(e) => updateAttendee(a.id, 'rate', Number(e.target.value))}
                  min={0}
                />
                <span className="pr-2 text-xs text-gray-400">/hr</span>
              </div>
              <button onClick={() => removeAttendee(a.id)} className="text-gray-300 hover:text-red-400 text-xl leading-none">×</button>
            </div>
          ))}

          <button onClick={addAttendee} className="text-sm text-brand-600 hover:underline">+ Add attendee</button>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Planned Duration</label>
            <div className="flex gap-2">
              {[30, 45, 60, 90, 120].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition ${duration === d ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Meeting Cost</h2>
          <ResultCard label={`Planned Cost (${duration} min)`} value={fmt(plannedCost)} highlight sublabel={`${fmt(costPerMinute)}/min for ${attendees.length} people`} />
          <ResultCard label="Total Team Hourly Rate" value={`${fmt(costPerMinute * 60)}/hr`} sublabel={attendees.map((a) => `${a.role}: $${a.rate}`).join(' · ')} />

          {/* Live timer */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Live Meeting Cost</p>
            <p className="text-4xl font-bold text-gray-900 tabular-nums">{fmt(liveCost)}</p>
            <p className="mt-1 text-sm text-gray-400">{formatElapsed(elapsed)} elapsed</p>
            {overtimeMinutes > 0 && (
              <p className="mt-1 text-xs font-semibold text-red-500">⚠️ {overtimeMinutes.toFixed(1)} min overtime (+{fmt(overtimeMinutes * costPerMinute)})</p>
            )}
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={toggleTimer} className={`btn-primary px-6 ${running ? 'bg-red-500 hover:bg-red-600' : ''}`}>
                {running ? '⏸ Pause' : elapsed > 0 ? '▶ Resume' : '▶ Start Timer'}
              </button>
              {elapsed > 0 && (
                <button onClick={resetTimer} className="btn-secondary px-4">Reset</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

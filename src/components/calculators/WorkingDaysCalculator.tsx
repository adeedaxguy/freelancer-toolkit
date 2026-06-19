'use client'

import { useState, useMemo } from 'react'
import ResultCard from '@/components/ResultCard'

const US_HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-05-25',
  '2026-07-04', '2026-09-07', '2026-11-26', '2026-11-27', '2026-12-25',
]

function getWorkingDays(start: Date, end: Date, excludeHolidays: boolean): number {
  let count = 0
  const cur = new Date(start)
  cur.setHours(0, 0, 0, 0)
  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)

  while (cur <= endDate) {
    const day = cur.getDay()
    const isWeekend = day === 0 || day === 6
    const dateStr = cur.toISOString().split('T')[0]
    const isHoliday = excludeHolidays && US_HOLIDAYS_2026.includes(dateStr)
    if (!isWeekend && !isHoliday) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

function addWorkingDays(start: Date, days: number, excludeHolidays: boolean): Date {
  const result = new Date(start)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    const isWeekend = day === 0 || day === 6
    const dateStr = result.toISOString().split('T')[0]
    const isHoliday = excludeHolidays && US_HOLIDAYS_2026.includes(dateStr)
    if (!isWeekend && !isHoliday) added++
  }
  return result
}

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const toInputDate = (d: Date) => d.toISOString().split('T')[0]

export default function WorkingDaysCalculator() {
  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setDate(today.getDate() + 30)

  const [mode, setMode] = useState<'range' | 'add'>('range')
  const [startDate, setStartDate] = useState(toInputDate(today))
  const [endDate, setEndDate] = useState(toInputDate(nextMonth))
  const [daysToAdd, setDaysToAdd] = useState(10)
  const [excludeHolidays, setExcludeHolidays] = useState(true)

  const rangeResult = useMemo(() => {
    if (mode !== 'range') return null
    const s = new Date(startDate + 'T00:00:00')
    const e = new Date(endDate + 'T00:00:00')
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return null
    const totalDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const workingDays = getWorkingDays(s, e, excludeHolidays)
    const weekendDays = totalDays - workingDays - (excludeHolidays ? US_HOLIDAYS_2026.filter(h => {
      const hd = new Date(h + 'T00:00:00')
      const day = hd.getDay()
      return hd >= s && hd <= e && day !== 0 && day !== 6
    }).length : 0)
    return { totalDays, workingDays, weekendDays }
  }, [mode, startDate, endDate, excludeHolidays])

  const addResult = useMemo(() => {
    if (mode !== 'add') return null
    const s = new Date(startDate + 'T00:00:00')
    if (isNaN(s.getTime())) return null
    const resultDate = addWorkingDays(s, daysToAdd, excludeHolidays)
    const calendarDays = Math.round((resultDate.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
    return { resultDate, calendarDays }
  }, [mode, startDate, daysToAdd, excludeHolidays])

  return (
    <div className="space-y-8">
      {/* Mode toggle */}
      <div className="flex gap-3">
        {(['range', 'add'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
              mode === m
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {m === 'range' ? 'Days Between Two Dates' : 'Add Working Days'}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            {mode === 'range' ? 'Date Range' : 'Start Date + Days'}
          </h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {mode === 'range' ? 'Start Date' : 'Start Date'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field h-10 w-full"
            />
          </div>
          {mode === 'range' ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field h-10 w-full"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Working Days to Add</label>
              <input
                type="number"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(Math.max(1, Number(e.target.value)))}
                min={1}
                style={{ fontSize: 'max(16px, 0.875rem)' }}
                className="input-field h-10 w-full"
              />
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={excludeHolidays}
              onChange={(e) => setExcludeHolidays(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600"
            />
            Exclude US public holidays
          </label>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Result</h2>
          {mode === 'range' && rangeResult ? (
            <>
              <ResultCard
                label="Working Days"
                value={rangeResult.workingDays.toString()}
                highlight
                sublabel={`Business days (Mon–Fri${excludeHolidays ? ', excl. holidays' : ''})`}
              />
              <ResultCard
                label="Total Calendar Days"
                value={rangeResult.totalDays.toString()}
                sublabel="Including weekends and holidays"
              />
              <ResultCard
                label="Weekend Days"
                value={rangeResult.weekendDays.toString()}
                sublabel="Saturdays and Sundays in range"
              />
            </>
          ) : mode === 'add' && addResult ? (
            <>
              <ResultCard
                label="Deadline Date"
                value={fmtDate(addResult.resultDate)}
                highlight
                sublabel={`${daysToAdd} working days from start`}
              />
              <ResultCard
                label="Calendar Days"
                value={`${addResult.calendarDays} days`}
                sublabel="Total days including weekends"
              />
            </>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-gray-400">
              Enter valid dates to see results
            </div>
          )}
        </div>
      </div>

      {/* Freelancer tip */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 className="mb-2 font-semibold text-blue-900">Freelancer Tip: Building Deadlines</h3>
        <p className="text-sm text-blue-800">
          When quoting a project deadline, use the <strong>Add Working Days</strong> mode. Add your estimated working days, then add extra buffer (10–20%) for revisions and client feedback. Always quote the <em>padded</em> deadline to clients — deliver early rather than late.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

function addWorkdays(start: Date, days: number): Date {
  const result = new Date(start)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function daysBetween(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export default function ProjectDeadlineCalculator() {
  const [totalHours, setTotalHours] = useState(40)
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [revisions, setRevisions] = useState(2)
  const [revisionHours, setRevisionHours] = useState(3)
  const [feedbackDays, setFeedbackDays] = useState(3)
  const [bufferPercent, setBufferPercent] = useState(15)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])

  const results = useMemo(() => {
    const baseWorkdays = hoursPerDay > 0 ? Math.ceil(totalHours / hoursPerDay) : 0
    const revisionWorkdays = revisions * (Math.ceil(revisionHours / hoursPerDay) + feedbackDays)
    const bufferDays = Math.ceil((baseWorkdays + revisionWorkdays) * (bufferPercent / 100))
    const totalWorkdays = baseWorkdays + revisionWorkdays + bufferDays

    const start = new Date(startDate + 'T00:00:00')
    const completion = addWorkdays(start, totalWorkdays)
    const calendarDays = daysBetween(start, completion)

    // Internal deadline (1 week before delivery)
    const internalDeadline = addWorkdays(completion, -5)

    return {
      baseWorkdays,
      revisionWorkdays,
      bufferDays,
      totalWorkdays,
      completion,
      calendarDays,
      internalDeadline,
    }
  }, [totalHours, hoursPerDay, revisions, revisionHours, feedbackDays, bufferPercent, startDate])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Project Details</h2>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Project Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field h-10"
          />
        </div>

        <InputField
          label="Estimated Total Hours"
          value={totalHours}
          onChange={setTotalHours}
          min={1}
          suffix="hrs"
          hint="Your best estimate of total work hours"
        />
        <InputField
          label="Hours Available Per Day"
          value={hoursPerDay}
          onChange={setHoursPerDay}
          min={0.5}
          max={16}
          step={0.5}
          suffix="hrs/day"
          hint="Time dedicated to this project daily (not total work day)"
        />
        <InputField
          label="Revision Rounds"
          value={revisions}
          onChange={setRevisions}
          min={0}
          max={10}
          suffix="rounds"
          hint="How many feedback-and-revise cycles are included"
        />
        <InputField
          label="Hours to Implement Each Revision"
          value={revisionHours}
          onChange={setRevisionHours}
          min={0}
          suffix="hrs"
          hint="Your implementation time per revision round"
        />
        <InputField
          label="Client Feedback Window"
          value={feedbackDays}
          onChange={setFeedbackDays}
          min={0}
          suffix="days"
          hint="Business days client needs to review and respond"
        />
        <InputField
          label="Buffer"
          value={bufferPercent}
          onChange={setBufferPercent}
          min={0}
          max={50}
          suffix="%"
          hint="Padding for unexpected complexity (10–20% recommended)"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Project Timeline</h2>

        <ResultCard
          label="Projected Completion Date"
          value={formatDate(results.completion)}
          highlight
          sublabel={`${results.calendarDays} calendar days from start`}
        />
        <ResultCard
          label="Your Internal Deadline"
          value={formatDate(results.internalDeadline)}
          sublabel="5 business days before client delivery — aim for this"
        />
        <ResultCard
          label="Total Working Days"
          value={`${results.totalWorkdays} days`}
          sublabel={`At ${hoursPerDay}h/day on this project`}
        />

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="mb-2 font-semibold">Timeline Breakdown</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Base work ({totalHours}h ÷ {hoursPerDay}h/day)</span>
              <span className="font-medium">{results.baseWorkdays} days</span>
            </div>
            <div className="flex justify-between">
              <span>Revision cycles ({revisions} × {Math.ceil(revisionHours / hoursPerDay) + feedbackDays} days)</span>
              <span className="font-medium">{results.revisionWorkdays} days</span>
            </div>
            <div className="flex justify-between">
              <span>Buffer ({bufferPercent}%)</span>
              <span className="font-medium">{results.bufferDays} days</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-1 font-semibold">
              <span>Total working days</span>
              <span>{results.totalWorkdays} days</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          Calculation uses business days (Mon–Fri). Excludes public holidays. Add buffer for your planned time off.
        </div>
      </div>
    </div>
  )
}

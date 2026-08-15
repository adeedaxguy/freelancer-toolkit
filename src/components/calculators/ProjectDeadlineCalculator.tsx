'use client'

import { useMemo, useState } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

function addWorkdays(start: Date, days: number): Date {
  const result = new Date(start)
  const direction = days >= 0 ? 1 : -1
  let moved = 0
  const target = Math.abs(days)

  while (moved < target) {
    result.setDate(result.getDate() + direction)
    const day = result.getDay()
    if (day !== 0 && day !== 6) moved += 1
  }

  return result
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function daysBetween(a: Date, b: Date): number {
  return Math.max(0, Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)))
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function ProjectDeadlineCalculator() {
  const [totalHours, setTotalHours] = useState(40)
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [revisions, setRevisions] = useState(2)
  const [revisionHours, setRevisionHours] = useState(3)
  const [feedbackDays, setFeedbackDays] = useState(3)
  const [bufferPercent, setBufferPercent] = useState(15)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => {
    const dailyCapacity = Math.max(0.5, hoursPerDay)
    const baseWorkdays = Math.ceil(Math.max(0, totalHours) / dailyCapacity)
    const revisionImplementationDays = Math.max(0, revisions) * Math.ceil(Math.max(0, revisionHours) / dailyCapacity)
    const feedbackWorkdays = Math.max(0, revisions) * Math.max(0, feedbackDays)
    const revisionWorkdays = revisionImplementationDays + feedbackWorkdays
    const bufferDays = Math.ceil((baseWorkdays + revisionWorkdays) * (Math.max(0, bufferPercent) / 100))
    const totalWorkdays = baseWorkdays + revisionWorkdays + bufferDays

    const start = new Date(`${startDate}T00:00:00`)
    const firstDraft = addWorkdays(start, baseWorkdays)
    const firstReviewDue = addWorkdays(firstDraft, Math.max(0, feedbackDays))
    const internalDeadline = addWorkdays(start, Math.max(0, totalWorkdays - 5))
    const completion = addWorkdays(start, totalWorkdays)
    const calendarDays = daysBetween(start, completion)

    const riskLevel =
      bufferPercent < 10 || feedbackDays < 2 ? 'Tight timeline' :
      bufferPercent >= 20 && feedbackDays >= 3 ? 'Safer client promise' :
      'Balanced timeline'

    return {
      baseWorkdays,
      revisionImplementationDays,
      feedbackWorkdays,
      revisionWorkdays,
      bufferDays,
      totalWorkdays,
      completion,
      calendarDays,
      firstDraft,
      firstReviewDue,
      internalDeadline,
      riskLevel,
      dailyCapacity,
    }
  }, [totalHours, hoursPerDay, revisions, revisionHours, feedbackDays, bufferPercent, startDate])

  const summary = useMemo(() => {
    return [
      'Freelance project delivery plan',
      '',
      `Start date: ${formatDate(new Date(`${startDate}T00:00:00`))}`,
      `Client delivery date: ${formatDate(results.completion)}`,
      `Internal target date: ${formatDate(results.internalDeadline)}`,
      `First draft target: ${formatDate(results.firstDraft)}`,
      `First client feedback due: ${formatDate(results.firstReviewDue)}`,
      '',
      `Total working days: ${results.totalWorkdays}`,
      `Calendar days: ${results.calendarDays}`,
      `Base production: ${results.baseWorkdays} workdays`,
      `Revision implementation: ${results.revisionImplementationDays} workdays`,
      `Client feedback windows: ${results.feedbackWorkdays} workdays`,
      `Buffer: ${results.bufferDays} workdays (${bufferPercent}%)`,
      '',
      `Assumption: ${hoursPerDay} focused hours per workday on this project.`,
    ].join('\n')
  }, [bufferPercent, hoursPerDay, results, startDate])

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const milestones = [
    ['Kickoff / start', formatDate(new Date(`${startDate}T00:00:00`)), 'Confirm scope, access, timeline, and approval owner.'],
    ['First draft target', formatDate(results.firstDraft), `${results.baseWorkdays} focused production workdays.`],
    ['First feedback due', formatDate(results.firstReviewDue), `${feedbackDays} workdays reserved for client review.`],
    ['Internal deadline', formatDate(results.internalDeadline), 'Aim to finish before the client promise date.'],
    ['Client delivery', formatDate(results.completion), `${results.totalWorkdays} workdays / ${results.calendarDays} calendar days from start.`],
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Deadline planner with revision and feedback windows</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-900">
              Calculate a delivery date from actual capacity, revision time, client review windows, and buffer.
              This uses workdays and keeps an internal target before the client-facing deadline.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm">
            {results.riskLevel}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Project details</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Project start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field h-10"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Estimated total hours"
              value={totalHours}
              onChange={setTotalHours}
              min={0}
              suffix="hrs"
              hint="Your best estimate of production work."
            />
            <InputField
              label="Focused hours per workday"
              value={hoursPerDay}
              onChange={setHoursPerDay}
              min={0.5}
              max={16}
              step={0.5}
              suffix="hrs/day"
              hint="Time dedicated to this project, not your whole workday."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Revision rounds"
              value={revisions}
              onChange={setRevisions}
              min={0}
              max={20}
              suffix="rounds"
            />
            <InputField
              label="Hours per revision"
              value={revisionHours}
              onChange={setRevisionHours}
              min={0}
              suffix="hrs"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Client feedback window"
              value={feedbackDays}
              onChange={setFeedbackDays}
              min={0}
              suffix="workdays"
              hint="Time the client needs to review and respond."
            />
            <InputField
              label="Buffer"
              value={bufferPercent}
              onChange={setBufferPercent}
              min={0}
              max={75}
              suffix="%"
              hint="10-20% is normal; use more for unclear scopes."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Project timeline</h2>

          <ResultCard
            label="Client delivery date"
            value={formatDate(results.completion)}
            highlight
            sublabel={`${results.calendarDays} calendar days from start`}
          />
          <ResultCard
            label="Internal target date"
            value={formatDate(results.internalDeadline)}
            sublabel="Finish by this date to protect handoff and QA time"
          />
          <ResultCard
            label="Total working days"
            value={`${results.totalWorkdays} days`}
            sublabel={`At ${results.dailyCapacity}h/day on this project`}
          />
          <ResultCard
            label="Buffer days"
            value={`${results.bufferDays} days`}
            sublabel={`${bufferPercent}% protection for unknowns`}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Milestone schedule</h2>
            <p className="mt-1 text-sm text-gray-500">Use this to set expectations before kickoff.</p>
          </div>
          <div className="divide-y divide-gray-50">
            {milestones.map(([label, date, note]) => (
              <div key={label} className="grid gap-2 px-5 py-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{date}</p>
                </div>
                <p className="text-sm leading-6 text-gray-600">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Timeline breakdown</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ['Base production', `${results.baseWorkdays} days`],
              ['Revision work', `${results.revisionImplementationDays} days`],
              ['Client feedback', `${results.feedbackWorkdays} days`],
              ['Buffer', `${results.bufferDays} days`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-500">
            Calculation excludes weekends and public holidays. Add holidays, vacations, and approval delays manually before promising the date.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Copyable delivery plan</h2>
            <p className="mt-1 text-sm text-gray-500">Paste this into your proposal, SOW, or kickoff email.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={copySummary}>{copied ? 'Copied' : 'Copy plan'}</button>
            <button type="button" className="btn-primary" onClick={() => downloadText('freeltools-project-delivery-plan.txt', summary)}>Download TXT</button>
          </div>
        </div>
        <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">{summary}</pre>
      </div>
    </div>
  )
}

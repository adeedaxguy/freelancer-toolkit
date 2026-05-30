'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function RevenueGoalCalculator() {
  const [annualGoal, setAnnualGoal] = useState(120000)
  const [avgProjectValue, setAvgProjectValue] = useState(3000)
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(5)
  const [vacationWeeks, setVacationWeeks] = useState(4)

  const results = useMemo(() => {
    const workingWeeks = 52 - vacationWeeks
    const workingDays = workingWeeks * workingDaysPerWeek
    const monthly = annualGoal / 12
    const weekly = annualGoal / workingWeeks
    const daily = annualGoal / workingDays
    const projectsPerYear = avgProjectValue > 0 ? annualGoal / avgProjectValue : 0
    const projectsPerMonth = projectsPerYear / 12
    const projectsPerWeek = projectsPerYear / workingWeeks
    return { monthly, weekly, daily, projectsPerYear, projectsPerMonth, projectsPerWeek, workingDays, workingWeeks }
  }, [annualGoal, avgProjectValue, workingDaysPerWeek, vacationWeeks])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Your Revenue Goal</h2>
        <InputField label="Annual Revenue Goal" value={annualGoal} onChange={setAnnualGoal} prefix="$" min={1} />
        <InputField label="Average Project Value" value={avgProjectValue} onChange={setAvgProjectValue} prefix="$" min={1} hint="Average amount you charge per project or client" />
        <InputField label="Working Days per Week" value={workingDaysPerWeek} onChange={setWorkingDaysPerWeek} min={1} max={7} suffix="days" />
        <InputField label="Vacation Weeks per Year" value={vacationWeeks} onChange={setVacationWeeks} min={0} max={20} suffix="weeks" />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Your Breakdown</h2>
        <ResultCard label="Monthly Target" value={fmt(results.monthly)} highlight sublabel={`To hit ${fmt(annualGoal)}/year`} />
        <ResultCard label="Weekly Target" value={fmt(results.weekly)} sublabel={`Over ${results.workingWeeks} working weeks`} />
        <ResultCard label="Daily Target" value={fmt(results.daily)} sublabel={`Over ${results.workingDays} working days`} />

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Projects Needed</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{results.projectsPerYear.toFixed(0)}</p>
              <p className="text-xs text-gray-400">per year</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{results.projectsPerMonth.toFixed(1)}</p>
              <p className="text-xs text-gray-400">per month</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{results.projectsPerWeek.toFixed(1)}</p>
              <p className="text-xs text-gray-400">per week</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">Based on {fmt(avgProjectValue)} average project value</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          <strong>Tip:</strong> These are gross revenue targets. Subtract taxes (~25–30%) and expenses to find your actual take-home. Use our <a href="/tools/freelancer-rate-calculator" className="text-brand-600 hover:underline">Rate Calculator</a> for a full breakdown.
        </div>
      </div>
    </div>
  )
}

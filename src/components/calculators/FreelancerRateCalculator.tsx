'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function FreelancerRateCalculator() {
  const [income, setIncome] = useState(80000)
  const [weeks, setWeeks] = useState(48)
  const [hoursPerWeek, setHoursPerWeek] = useState(30)
  const [tax, setTax] = useState(25)
  const [expenses, setExpenses] = useState(5000)

  const results = useMemo(() => {
    const grossNeeded = income / (1 - tax / 100) + expenses
    const totalBillableHours = weeks * hoursPerWeek
    const hourly = totalBillableHours > 0 ? grossNeeded / totalBillableHours : 0
    const daily = hourly * hoursPerWeek / 5
    const monthly = grossNeeded / 12
    const minProject = hourly * 8 // 1-day minimum
    return { hourly, daily, monthly, minProject, grossNeeded }
  }, [income, weeks, hoursPerWeek, tax, expenses])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Your Details</h2>
        <InputField
          label="Desired Annual Income"
          value={income}
          onChange={setIncome}
          prefix="$"
          hint="After-tax take-home you want"
        />
        <InputField
          label="Working Weeks per Year"
          value={weeks}
          onChange={setWeeks}
          min={1}
          max={52}
          suffix="weeks"
          hint="Exclude holidays and time off"
        />
        <InputField
          label="Billable Hours per Week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          min={1}
          max={80}
          suffix="hrs"
          hint="Hours you can actually bill (not admin time)"
        />
        <InputField
          label="Tax Rate"
          value={tax}
          onChange={setTax}
          min={0}
          max={60}
          step={0.5}
          suffix="%"
          hint="Self-employment + income tax estimate"
        />
        <InputField
          label="Annual Business Expenses"
          value={expenses}
          onChange={setExpenses}
          prefix="$"
          hint="Software, equipment, insurance, etc."
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Your Rates</h2>
        <ResultCard label="Hourly Rate" value={fmt(results.hourly)} highlight sublabel="Minimum to hit your goal" />
        <ResultCard label="Daily Rate" value={fmt(results.daily)} sublabel={`Based on ${hoursPerWeek / 5}h/day avg`} />
        <ResultCard label="Monthly Revenue Target" value={fmt(results.monthly)} sublabel="Total gross needed per month" />
        <ResultCard label="Minimum Project Size" value={fmt(results.minProject)} sublabel="1-day engagement minimum" />

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Gross revenue needed:</strong> {fmt(results.grossNeeded)}/year (before tax + expenses)
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          Formula: (Desired income ÷ (1 − tax rate)) + expenses = gross needed → divide by billable hours.
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const fmtRate = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

export default function RateIncreaseCalculator() {
  const [currentRate, setCurrentRate] = useState(75)
  const [increasePercent, setIncreasePercent] = useState(20)
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25)
  const [weeksPerYear, setWeeksPerYear] = useState(48)

  const results = useMemo(() => {
    const newRate = currentRate * (1 + increasePercent / 100)
    const rateIncrease = newRate - currentRate
    const currentAnnual = currentRate * billableHoursPerWeek * weeksPerYear
    const newAnnual = newRate * billableHoursPerWeek * weeksPerYear
    const annualIncrease = newAnnual - currentAnnual
    const monthlyIncrease = annualIncrease / 12
    return { newRate, rateIncrease, currentAnnual, newAnnual, annualIncrease, monthlyIncrease }
  }, [currentRate, increasePercent, billableHoursPerWeek, weeksPerYear])

  const scenarios = useMemo(() => {
    return [10, 15, 20, 25, 30].map((pct) => {
      const newRate = currentRate * (1 + pct / 100)
      const newAnnual = newRate * billableHoursPerWeek * weeksPerYear
      return { pct, newRate, newAnnual, increase: newAnnual - currentRate * billableHoursPerWeek * weeksPerYear }
    })
  }, [currentRate, billableHoursPerWeek, weeksPerYear])

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Your Current Situation</h2>
          <InputField
            label="Current Hourly Rate"
            value={currentRate}
            onChange={setCurrentRate}
            prefix="$"
            min={1}
          />
          <InputField
            label="Rate Increase"
            value={increasePercent}
            onChange={setIncreasePercent}
            suffix="%"
            min={1}
            max={200}
            hint="10–25% is typical for annual increases. 25–50% when changing niche or target client."
          />
          <InputField
            label="Billable Hours per Week"
            value={billableHoursPerWeek}
            onChange={setBillableHoursPerWeek}
            suffix="hrs"
            min={1}
            max={60}
          />
          <InputField
            label="Billable Weeks per Year"
            value={weeksPerYear}
            onChange={setWeeksPerYear}
            suffix="wks"
            min={1}
            max={52}
            hint="Most freelancers work 44–50 billable weeks after PTO and holidays."
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">After Your Rate Increase</h2>
          <ResultCard
            label="New Hourly Rate"
            value={fmtRate(results.newRate)}
            highlight
            sublabel={`Up ${increasePercent}% from ${fmtRate(currentRate)}/hr`}
          />
          <ResultCard
            label="Additional Revenue Per Year"
            value={fmt(results.annualIncrease)}
            sublabel="At the same number of billable hours"
          />
          <ResultCard
            label="New Annual Revenue"
            value={fmt(results.newAnnual)}
            sublabel={`vs ${fmt(results.currentAnnual)} currently`}
          />
          <ResultCard
            label="Extra Per Month"
            value={fmt(results.monthlyIncrease)}
            sublabel="Monthly revenue increase"
          />
        </div>
      </div>

      {/* Scenario comparison */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Rate Increase Scenarios</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-left font-semibold text-gray-700">Increase</th>
                <th className="pb-2 text-right font-semibold text-gray-700">New Rate</th>
                <th className="pb-2 text-right font-semibold text-gray-700">New Annual</th>
                <th className="pb-2 text-right font-semibold text-gray-700">Extra/Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scenarios.map((s) => (
                <tr key={s.pct} className={s.pct === increasePercent ? 'bg-brand-50' : ''}>
                  <td className="py-2.5 font-medium text-gray-700">+{s.pct}%</td>
                  <td className="py-2.5 text-right text-gray-700">{fmtRate(s.newRate)}/hr</td>
                  <td className="py-2.5 text-right text-gray-700">{fmt(s.newAnnual)}</td>
                  <td className="py-2.5 text-right font-semibold text-green-600">+{fmt(s.increase)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client notice template */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Rate Increase Notice Template</h2>
        <p className="mb-1 text-xs text-gray-400">Best practice: give clients 30–60 days notice. Send this email:</p>
        <div className="mt-3 rounded-lg bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-700 whitespace-pre-wrap select-all">
{`Hi [Client Name],

I wanted to give you advance notice that my hourly rate will be increasing from ${fmtRate(currentRate)} to ${fmtRate(results.newRate)} effective [DATE — 30–60 days from now].

This reflects [increased demand for my services / rising costs / the expanded scope and expertise I bring to your projects].

All work completed before [DATE] will continue to be billed at ${fmtRate(currentRate)}/hr. Any projects or retainers starting after that date will be at the new rate.

I value our working relationship and look forward to continuing to deliver great results for you. Please don't hesitate to reach out if you have any questions.

Best,
[Your Name]`}
        </div>
      </div>
    </div>
  )
}

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
  const [clientRetentionPercent, setClientRetentionPercent] = useState(85)
  const [noticeDays, setNoticeDays] = useState(45)

  const results = useMemo(() => {
    const newRate = currentRate * (1 + increasePercent / 100)
    const rateIncrease = newRate - currentRate
    const currentAnnual = currentRate * billableHoursPerWeek * weeksPerYear
    const newAnnual = newRate * billableHoursPerWeek * weeksPerYear
    const annualIncrease = newAnnual - currentAnnual
    const monthlyIncrease = annualIncrease / 12
    const retentionRate = Math.min(100, Math.max(0, clientRetentionPercent)) / 100
    const retainedHoursPerWeek = billableHoursPerWeek * retentionRate
    const retainedAnnual = newRate * retainedHoursPerWeek * weeksPerYear
    const breakEvenHoursPerWeek = newRate > 0 && weeksPerYear > 0 ? currentAnnual / newRate / weeksPerYear : 0
    const hoursYouCanLose = Math.max(0, billableHoursPerWeek - breakEvenHoursPerWeek)
    const profitSafe = retainedAnnual >= currentAnnual
    const today = new Date()
    today.setDate(today.getDate() + noticeDays)
    const effectiveDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return {
      newRate,
      rateIncrease,
      currentAnnual,
      newAnnual,
      annualIncrease,
      monthlyIncrease,
      retainedHoursPerWeek,
      retainedAnnual,
      breakEvenHoursPerWeek,
      hoursYouCanLose,
      profitSafe,
      effectiveDate,
    }
  }, [clientRetentionPercent, currentRate, increasePercent, billableHoursPerWeek, noticeDays, weeksPerYear])

  const scenarios = useMemo(() => {
    return [10, 15, 20, 25, 30].map((pct) => {
      const newRate = currentRate * (1 + pct / 100)
      const newAnnual = newRate * billableHoursPerWeek * weeksPerYear
      const currentAnnual = currentRate * billableHoursPerWeek * weeksPerYear
      const breakEvenHours = newRate > 0 ? currentAnnual / newRate / weeksPerYear : 0
      return { pct, newRate, newAnnual, increase: newAnnual - currentAnnual, loseHours: Math.max(0, billableHoursPerWeek - breakEvenHours) }
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
          <InputField
            label="Expected Client Retention"
            value={clientRetentionPercent}
            onChange={setClientRetentionPercent}
            suffix="%"
            min={0}
            max={100}
            hint="Use a conservative estimate if some clients may reject the new rate."
          />
          <InputField
            label="Notice Period"
            value={noticeDays}
            onChange={setNoticeDays}
            suffix="days"
            min={0}
            max={180}
            hint="30–60 days gives current clients time to plan."
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
          <ResultCard
            label="Break-even Workload"
            value={`${results.breakEvenHoursPerWeek.toFixed(1)} hrs/wk`}
            sublabel={`You can lose ${results.hoursYouCanLose.toFixed(1)} hrs/wk and still match current revenue`}
          />
          <ResultCard
            label="Retention-adjusted Revenue"
            value={fmt(results.retainedAnnual)}
            sublabel={`${clientRetentionPercent}% retained workload at the new rate`}
          />
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${results.profitSafe ? 'border-green-100 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
        <h2 className={`text-base font-semibold ${results.profitSafe ? 'text-green-900' : 'text-amber-900'}`}>Decision check</h2>
        <p className={`mt-2 text-sm leading-6 ${results.profitSafe ? 'text-green-800' : 'text-amber-800'}`}>
          {results.profitSafe
            ? `This increase still beats your current annual revenue if you keep about ${clientRetentionPercent}% of your billable workload. The effective date can be ${results.effectiveDate} with your current notice setting.`
            : `At ${clientRetentionPercent}% retained workload, this increase may drop below your current annual revenue. Consider a smaller increase, a longer notice period, or raising only new-client pricing first.`}
        </p>
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
                <th className="pb-2 text-right font-semibold text-gray-700">Can Lose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scenarios.map((s) => (
                <tr key={s.pct} className={s.pct === increasePercent ? 'bg-brand-50' : ''}>
                  <td className="py-2.5 font-medium text-gray-700">+{s.pct}%</td>
                  <td className="py-2.5 text-right text-gray-700">{fmtRate(s.newRate)}/hr</td>
                  <td className="py-2.5 text-right text-gray-700">{fmt(s.newAnnual)}</td>
                  <td className="py-2.5 text-right font-semibold text-green-600">+{fmt(s.increase)}</td>
                  <td className="py-2.5 text-right text-gray-700">{s.loseHours.toFixed(1)} hrs/wk</td>
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

I wanted to give you advance notice that my hourly rate will be increasing from ${fmtRate(currentRate)} to ${fmtRate(results.newRate)} effective ${results.effectiveDate}.

This reflects [increased demand for my services / rising costs / the expanded scope and expertise I bring to your projects].

All work completed before ${results.effectiveDate} will continue to be billed at ${fmtRate(currentRate)}/hr. Any projects or retainers starting after that date will be at the new rate.

I value our working relationship and look forward to continuing to deliver great results for you. Please don't hesitate to reach out if you have any questions.

Best,
[Your Name]`}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function HourlyVsFixedCalculator() {
  const [estimatedHours, setEstimatedHours] = useState(40)
  const [hourlyRate, setHourlyRate] = useState(100)
  const [fixedPrice, setFixedPrice] = useState(4500)
  const [actualHours, setActualHours] = useState(45)

  const results = useMemo(() => {
    const hourlyTotal = actualHours * hourlyRate
    const hourlyEffectiveRate = actualHours > 0 ? hourlyTotal / actualHours : 0
    const fixedEffectiveRate = actualHours > 0 ? fixedPrice / actualHours : 0
    const fixedIfHourly = estimatedHours * hourlyRate
    const fixedDiff = fixedPrice - fixedIfHourly
    const earningsGap = hourlyTotal - fixedPrice
    const overrunHours = actualHours - estimatedHours
    const overrunCost = overrunHours * hourlyRate
    return { hourlyTotal, hourlyEffectiveRate, fixedEffectiveRate, fixedIfHourly, fixedDiff, earningsGap, overrunHours, overrunCost }
  }, [estimatedHours, hourlyRate, fixedPrice, actualHours])

  const winner = results.hourlyTotal >= fixedPrice ? 'hourly' : 'fixed'

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Project Parameters</h2>
          <InputField label="Estimated Hours (your quote)" value={estimatedHours} onChange={setEstimatedHours} min={1} suffix="hrs" />
          <InputField label="Your Hourly Rate" value={hourlyRate} onChange={setHourlyRate} min={1} prefix="$" />
          <InputField label="Fixed Price Quote" value={fixedPrice} onChange={setFixedPrice} min={1} prefix="$" />
          <div className="border-t border-gray-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Actual Outcome</p>
            <InputField
              label="Actual Hours Spent"
              value={actualHours}
              onChange={setActualHours}
              min={1}
              suffix="hrs"
              hint="What it actually took — adjust to see scenarios"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Earnings Comparison</h2>

          <div className={`rounded-xl border-2 p-4 ${winner === 'hourly' ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white'}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Hourly Earnings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(results.hourlyTotal)}</p>
            <p className="text-xs text-gray-500">{actualHours}h × {fmt(hourlyRate)}/hr = {fmt(results.hourlyTotal)}</p>
            {winner === 'hourly' && <span className="mt-2 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Better for this project</span>}
          </div>

          <div className={`rounded-xl border-2 p-4 ${winner === 'fixed' ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white'}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Fixed Price Earnings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(fixedPrice)}</p>
            <p className="text-xs text-gray-500">Effective rate: {fmt(results.fixedEffectiveRate)}/hr</p>
            {winner === 'fixed' && <span className="mt-2 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Better for this project</span>}
          </div>

          <ResultCard
            label="Earnings Difference"
            value={`${fmt(Math.abs(results.earningsGap))} more with ${winner}`}
            sublabel={`Based on ${actualHours} actual hours`}
          />

          {results.overrunHours > 0 && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              <strong>Scope overrun:</strong> {results.overrunHours}h over estimate = {fmt(results.overrunCost)} of unpaid work on fixed price.
            </div>
          )}
          {results.overrunHours < 0 && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
              <strong>Efficiency win:</strong> Finished {Math.abs(results.overrunHours)}h under estimate — fixed price pays you a {fmt(Math.abs(results.overrunHours) * hourlyRate)} efficiency bonus.
            </div>
          )}
        </div>
      </div>

      {/* Guide */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">When to Use Each Model</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-brand-700">✓ Use Hourly When</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Scope is unclear or likely to change</li>
              <li>• Client makes frequent revision requests</li>
              <li>• Research-heavy or exploratory work</li>
              <li>• Ongoing maintenance or support</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-brand-700">✓ Use Fixed Price When</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Scope is well-defined with clear deliverables</li>
              <li>• You're experienced and can estimate accurately</li>
              <li>• You want to earn more by working efficiently</li>
              <li>• Client prefers budget certainty</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

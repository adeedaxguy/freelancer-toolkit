'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function AgencyPricingCalculator() {
  const [teamCost, setTeamCost] = useState(15000)
  const [overhead, setOverhead] = useState(3000)
  const [margin, setMargin] = useState(30)

  const results = useMemo(() => {
    const totalCost = teamCost + overhead
    const clientPrice = totalCost / (1 - margin / 100)
    const grossProfit = clientPrice - totalCost
    const actualMargin = clientPrice > 0 ? (grossProfit / clientPrice) * 100 : 0
    const markup = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0
    return { totalCost, clientPrice, grossProfit, actualMargin, markup }
  }, [teamCost, overhead, margin])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Agency Cost Structure</h2>
        <InputField
          label="Team Cost (Monthly)"
          value={teamCost}
          onChange={setTeamCost}
          prefix="$"
          hint="Salaries, contractors, freelancers on this project"
        />
        <InputField
          label="Overhead (Monthly)"
          value={overhead}
          onChange={setOverhead}
          prefix="$"
          hint="Software, office, admin allocated to this project"
        />
        <InputField
          label="Desired Gross Margin"
          value={margin}
          onChange={setMargin}
          min={0}
          max={90}
          step={0.5}
          suffix="%"
          hint="20–40% is typical for agencies"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Pricing Results</h2>
        <ResultCard label="Recommended Client Price" value={fmt(results.clientPrice)} highlight sublabel="Monthly retainer or project fee" />
        <ResultCard label="Total Monthly Cost" value={fmt(results.totalCost)} sublabel="Team + overhead" />
        <ResultCard label="Gross Profit" value={fmt(results.grossProfit)} sublabel={`${results.actualMargin.toFixed(1)}% gross margin`} />
        <ResultCard label="Markup on Cost" value={`${results.markup.toFixed(1)}%`} sublabel="How much above cost you're billing" />

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          <strong>Tip:</strong> Agencies typically target 25–45% gross margin. Below 20% leaves little room for growth or errors.
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function ProjectCostCalculator() {
  const [hours, setHours] = useState(40)
  const [rate, setRate] = useState(100)
  const [buffer, setBuffer] = useState(20)
  const [revisions, setRevisions] = useState(2)
  const [revisionHours, setRevisionHours] = useState(3)

  const results = useMemo(() => {
    const baseCost = hours * rate
    const bufferAmount = baseCost * (buffer / 100)
    const revisionCost = revisions * revisionHours * rate
    const quote = baseCost + bufferAmount + revisionCost
    const profit = bufferAmount
    const profitMargin = quote > 0 ? (profit / quote) * 100 : 0
    return { baseCost, bufferAmount, revisionCost, quote, profit, profitMargin }
  }, [hours, rate, buffer, revisions, revisionHours])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Project Details</h2>
        <InputField label="Estimated Hours" value={hours} onChange={setHours} min={1} suffix="hrs" />
        <InputField label="Your Hourly Rate" value={rate} onChange={setRate} min={1} prefix="$" />
        <InputField
          label="Scope Buffer"
          value={buffer}
          onChange={setBuffer}
          min={0}
          max={100}
          suffix="%"
          hint="Padding for unexpected work (15–25% is typical)"
        />
        <InputField label="Number of Revision Rounds" value={revisions} onChange={setRevisions} min={0} max={10} />
        <InputField
          label="Hours per Revision Round"
          value={revisionHours}
          onChange={setRevisionHours}
          min={0}
          suffix="hrs"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Quote Breakdown</h2>
        <ResultCard label="Recommended Quote" value={fmt(results.quote)} highlight sublabel="What to charge the client" />
        <ResultCard label="Base Project Cost" value={fmt(results.baseCost)} sublabel={`${hours}h × ${fmt(rate)}/hr`} />
        <ResultCard label="Buffer Amount" value={fmt(results.bufferAmount)} sublabel={`${buffer}% scope contingency`} />
        <ResultCard
          label="Revision Cost"
          value={fmt(results.revisionCost)}
          sublabel={`${revisions} rounds × ${revisionHours}h × ${fmt(rate)}/hr`}
        />
        <ResultCard
          label="Estimated Profit"
          value={`${fmt(results.profit)} (${results.profitMargin.toFixed(1)}%)`}
          sublabel="Buffer is your built-in profit cushion"
        />
      </div>
    </div>
  )
}

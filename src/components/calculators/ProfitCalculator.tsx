'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const pct = (n: number) => `${n.toFixed(1)}%`

export default function ProfitCalculator() {
  const [revenue, setRevenue] = useState(10000)
  const [cogs, setCogs] = useState(3000)
  const [opex, setOpex] = useState(2000)
  const [tax, setTax] = useState(25)

  const results = useMemo(() => {
    const grossProfit = revenue - cogs
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0
    const operatingProfit = grossProfit - opex
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0
    const taxAmount = Math.max(0, operatingProfit * (tax / 100))
    const netProfit = operatingProfit - taxAmount
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
    return { grossProfit, grossMargin, operatingProfit, operatingMargin, taxAmount, netProfit, netMargin }
  }, [revenue, cogs, opex, tax])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Financial Inputs</h2>
        <InputField
          label="Revenue"
          value={revenue}
          onChange={setRevenue}
          prefix="$"
          hint="Total money earned this period"
        />
        <InputField
          label="Cost of Goods Sold (COGS)"
          value={cogs}
          onChange={setCogs}
          prefix="$"
          hint="Direct costs: subcontractors, materials, tools used to deliver"
        />
        <InputField
          label="Operating Expenses (OpEx)"
          value={opex}
          onChange={setOpex}
          prefix="$"
          hint="Overhead: software, marketing, admin, rent"
        />
        <InputField
          label="Tax Rate"
          value={tax}
          onChange={setTax}
          min={0}
          max={60}
          step={0.5}
          suffix="%"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Profit Breakdown</h2>
        <ResultCard
          label="Net Profit"
          value={`${fmt(results.netProfit)} (${pct(results.netMargin)})`}
          highlight
          sublabel="After all costs and taxes"
        />
        <ResultCard
          label="Gross Profit"
          value={`${fmt(results.grossProfit)} (${pct(results.grossMargin)})`}
          sublabel="Revenue minus direct costs"
        />
        <ResultCard
          label="Operating Profit"
          value={`${fmt(results.operatingProfit)} (${pct(results.operatingMargin)})`}
          sublabel="After COGS and OpEx, before tax"
        />
        <ResultCard label="Tax Owed" value={fmt(results.taxAmount)} sublabel={`At ${tax}% rate`} />

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500 space-y-1">
          <p><strong>Gross margin</strong> benchmarks: Freelancers 60–80%, Agencies 30–50%</p>
          <p><strong>Net margin</strong> benchmarks: Healthy freelance 30–50%, Agency 10–20%</p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(5000)
  const [avgProjectPrice, setAvgProjectPrice] = useState(2500)
  const [variableCost, setVariableCost] = useState(500)
  const [currentRevenue, setCurrentRevenue] = useState(8000)

  const results = useMemo(() => {
    const contributionMargin = avgProjectPrice - variableCost
    const contributionMarginPct = avgProjectPrice > 0 ? (contributionMargin / avgProjectPrice) * 100 : 0
    const breakEvenProjects = contributionMargin > 0 ? fixedCosts / contributionMargin : Infinity
    const breakEvenRevenue = breakEvenProjects * avgProjectPrice
    const profitAtCurrentRevenue = currentRevenue - fixedCosts - (currentRevenue / avgProjectPrice) * variableCost
    const safetyMargin = currentRevenue - breakEvenRevenue
    const safetyMarginPct = currentRevenue > 0 ? (safetyMargin / currentRevenue) * 100 : 0
    const monthlyProjectsNeeded = Math.ceil(breakEvenProjects)
    return { contributionMargin, contributionMarginPct, breakEvenProjects, breakEvenRevenue, profitAtCurrentRevenue, safetyMargin, safetyMarginPct, monthlyProjectsNeeded }
  }, [fixedCosts, avgProjectPrice, variableCost, currentRevenue])

  const isProfitable = results.profitAtCurrentRevenue > 0

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Business Costs</h2>
        <InputField
          label="Monthly Fixed Costs"
          value={fixedCosts}
          onChange={setFixedCosts}
          prefix="$"
          hint="Software, rent, insurance, subscriptions — costs that don't change"
        />
        <InputField
          label="Average Project Price"
          value={avgProjectPrice}
          onChange={setAvgProjectPrice}
          prefix="$"
          hint="What you charge per project or client per month"
        />
        <InputField
          label="Variable Cost per Project"
          value={variableCost}
          onChange={setVariableCost}
          prefix="$"
          hint="Subcontractors, stock assets, per-project tools"
        />
        <div className="border-t border-gray-100 pt-4">
          <InputField
            label="Current Monthly Revenue"
            value={currentRevenue}
            onChange={setCurrentRevenue}
            prefix="$"
            hint="To calculate your safety margin above break-even"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Break-Even Analysis</h2>
        <ResultCard
          label="Break-Even Revenue"
          value={fmt(results.breakEvenRevenue)}
          highlight
          sublabel={`${Math.ceil(results.breakEvenProjects)} projects × ${fmt(avgProjectPrice)}`}
        />
        <ResultCard
          label="Projects Needed to Break Even"
          value={`${Math.ceil(results.breakEvenProjects)} projects`}
          sublabel="Per month to cover all fixed costs"
        />
        <ResultCard
          label="Contribution Margin per Project"
          value={`${fmt(results.contributionMargin)} (${results.contributionMarginPct.toFixed(0)}%)`}
          sublabel="Revenue minus variable cost per project"
        />

        <div className={`rounded-xl border p-4 ${isProfitable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '✓ Currently Profitable' : '⚠ Currently Below Break-Even'}
          </p>
          <p className={`text-xl font-bold ${isProfitable ? 'text-green-700' : 'text-red-700'}`}>
            {isProfitable ? '+' : ''}{fmt(results.profitAtCurrentRevenue)}/mo
          </p>
          {isProfitable ? (
            <p className="text-xs text-green-600 mt-1">
              Safety margin: {fmt(results.safetyMargin)} ({results.safetyMarginPct.toFixed(0)}%) above break-even
            </p>
          ) : (
            <p className="text-xs text-red-600 mt-1">
              You need {fmt(Math.abs(results.safetyMargin))} more revenue to break even
            </p>
          )}
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          <strong>Formula:</strong> Break-Even = Fixed Costs ÷ (Price − Variable Cost per Unit)
        </div>
      </div>
    </div>
  )
}

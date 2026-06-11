'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const QUARTERLY_DUE_DATES = [
  { quarter: 'Q1 (Jan–Mar)', due: 'April 15' },
  { quarter: 'Q2 (Apr–May)', due: 'June 15' },
  { quarter: 'Q3 (Jun–Aug)', due: 'September 15' },
  { quarter: 'Q4 (Sep–Dec)', due: 'January 15' },
]

// 2024 federal tax brackets (single filer)
function calcFederalTax(taxableIncome: number, status: string): number {
  // Married filing jointly brackets approximately double single brackets
  const multiplier = status === 'married' ? 2 : status === 'hoh' ? 1.5 : 1
  const brackets = [
    { rate: 0.10, limit: 11600 * multiplier },
    { rate: 0.12, limit: 47150 * multiplier },
    { rate: 0.22, limit: 100525 * multiplier },
    { rate: 0.24, limit: 191950 * multiplier },
    { rate: 0.32, limit: 243725 * multiplier },
    { rate: 0.35, limit: 609350 * multiplier },
    { rate: 0.37, limit: Infinity },
  ]
  let tax = 0
  let prev = 0
  for (const bracket of brackets) {
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, bracket.limit) - prev
    tax += taxable * bracket.rate
    prev = bracket.limit
  }
  return tax
}

export default function FreelancerTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(80000)
  const [expenses, setExpenses] = useState(8000)
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'hoh'>('single')

  const results = useMemo(() => {
    const netSEIncome = Math.max(0, grossIncome - expenses)
    // SE tax: 92.35% of net SE income × 15.3%
    const seBase = netSEIncome * 0.9235
    const seTax = seBase * 0.153
    // Deduct half of SE tax from AGI
    const halfSE = seTax / 2
    const standardDeduction = filingStatus === 'married' ? 29200 : filingStatus === 'hoh' ? 21900 : 14600
    const agi = netSEIncome - halfSE
    const taxableIncome = Math.max(0, agi - standardDeduction)
    const federalTax = calcFederalTax(taxableIncome, filingStatus)
    const totalTax = seTax + federalTax
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0
    const quarterly = totalTax / 4
    const takeHome = grossIncome - totalTax - expenses

    return { netSEIncome, seTax, federalTax, totalTax, effectiveRate, quarterly, takeHome, taxableIncome }
  }, [grossIncome, expenses, filingStatus])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Your Income Details</h2>
        <InputField
          label="Gross Annual Freelance Income"
          value={grossIncome}
          onChange={setGrossIncome}
          prefix="$"
          hint="Total income before any deductions"
        />
        <InputField
          label="Business Expenses (Deductions)"
          value={expenses}
          onChange={setExpenses}
          prefix="$"
          hint="Software, home office, equipment, professional development"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Filing Status</label>
          <p className="mb-1.5 text-xs text-gray-400">Affects your standard deduction and tax brackets</p>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married' | 'hoh')}
            className="input-field h-10"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="hoh">Head of Household</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Your Tax Estimate</h2>
        <ResultCard
          label="Total Estimated Tax"
          value={fmt(results.totalTax)}
          highlight
          sublabel={`Effective rate: ${results.effectiveRate.toFixed(1)}%`}
        />
        <ResultCard label="Self-Employment Tax" value={fmt(results.seTax)} sublabel="15.3% on 92.35% of net SE income" />
        <ResultCard label="Federal Income Tax" value={fmt(results.federalTax)} sublabel={`On ${fmt(results.taxableIncome)} taxable income`} />
        <ResultCard label="Quarterly Payment" value={fmt(results.quarterly)} sublabel="Pay each quarter to avoid penalties" />
        <ResultCard label="Estimated Take-Home" value={fmt(results.takeHome)} sublabel="After tax and expenses" />

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="mb-2 font-semibold">Quarterly Due Dates (2025)</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {QUARTERLY_DUE_DATES.map((d) => (
              <div key={d.quarter} className="flex justify-between gap-2">
                <span>{d.quarter}</span>
                <span className="font-medium">{d.due}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          Estimates use 2024 federal brackets and standard deduction. Excludes state taxes. Not tax advice — consult a CPA.
        </div>
      </div>
    </div>
  )
}

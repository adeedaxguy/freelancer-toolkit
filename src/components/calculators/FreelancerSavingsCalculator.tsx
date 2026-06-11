'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

// 2024 retirement limits
const SEP_IRA_MAX = 69000
const SOLO_401K_EMPLOYEE_MAX = 23000
const SOLO_401K_CATCHUP = 7500
const IRA_MAX = 7000

export default function FreelancerSavingsCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(7000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000)
  const [variability, setVariability] = useState<'low' | 'medium' | 'high'>('medium')
  const [age, setAge] = useState(35)
  const [monthlySavings, setMonthlySavings] = useState(500)

  const results = useMemo(() => {
    const annualIncome = monthlyIncome * 12
    // Emergency fund months based on variability
    const efMonths = variability === 'low' ? 4 : variability === 'medium' ? 6 : 9
    const emergencyFundTarget = monthlyExpenses * efMonths
    const monthsToEmergencyFund = monthlySavings > 0 ? Math.ceil(emergencyFundTarget / monthlySavings) : Infinity

    // SEP IRA: 25% of net SE income (approx 20% of gross after SE tax deduction)
    const netSE = annualIncome * 0.9235
    const sepMax = Math.min(Math.floor(netSE * 0.25), SEP_IRA_MAX)

    // Solo 401k employee contribution
    const solo401kEmployee = Math.min(SOLO_401K_EMPLOYEE_MAX, annualIncome)
    // Employer contribution (25% of net SE)
    const solo401kEmployer = Math.min(Math.floor(netSE * 0.25), SEP_IRA_MAX - solo401kEmployee)
    const solo401kTotal = Math.min(solo401kEmployee + solo401kEmployer + (age >= 50 ? SOLO_401K_CATCHUP : 0), SEP_IRA_MAX + (age >= 50 ? SOLO_401K_CATCHUP : 0))

    const iraContribution = IRA_MAX + (age >= 50 ? 1000 : 0)

    // Recommended savings breakdown
    const taxReserve = monthlyIncome * 0.28
    const retirementMonthly = Math.min(sepMax / 12, monthlyIncome * 0.15)
    const efContribution = monthlyIncome * 0.05
    const takeHome = monthlyIncome - taxReserve - retirementMonthly - efContribution

    return {
      emergencyFundTarget, efMonths, monthsToEmergencyFund,
      sepMax, solo401kTotal, iraContribution,
      taxReserve, retirementMonthly, efContribution, takeHome,
    }
  }, [monthlyIncome, monthlyExpenses, variability, age, monthlySavings])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Your Financial Details</h2>
        <InputField
          label="Average Monthly Freelance Income"
          value={monthlyIncome}
          onChange={setMonthlyIncome}
          prefix="$"
          hint="Use a conservative average, not your best month"
        />
        <InputField
          label="Monthly Living + Business Expenses"
          value={monthlyExpenses}
          onChange={setMonthlyExpenses}
          prefix="$"
          hint="Everything you spend each month to live and operate"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Income Variability</label>
          <p className="mb-1.5 text-xs text-gray-400">How consistent is your monthly income?</p>
          <select
            value={variability}
            onChange={(e) => setVariability(e.target.value as 'low' | 'medium' | 'high')}
            className="input-field h-10"
          >
            <option value="low">Low — fairly consistent month to month</option>
            <option value="medium">Medium — varies but predictable</option>
            <option value="high">High — feast and famine cycles</option>
          </select>
        </div>
        <InputField
          label="Your Age"
          value={age}
          onChange={setAge}
          min={18}
          max={75}
          suffix="yrs"
          hint="Affects retirement catch-up contribution limits"
        />
        <InputField
          label="Current Monthly Savings Amount"
          value={monthlySavings}
          onChange={setMonthlySavings}
          prefix="$"
          hint="How much you're saving each month right now"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Your Savings Plan</h2>
        <ResultCard
          label="Emergency Fund Target"
          value={fmt(results.emergencyFundTarget)}
          highlight
          sublabel={`${results.efMonths} months of expenses (${variability} variability)`}
        />
        {results.monthsToEmergencyFund < Infinity && (
          <ResultCard
            label="Time to Build Emergency Fund"
            value={`${results.monthsToEmergencyFund} months`}
            sublabel={`At your current ${fmt(monthlySavings)}/month savings rate`}
          />
        )}
        <ResultCard
          label="Max SEP IRA Contribution (2024)"
          value={fmt(results.sepMax)}
          sublabel="25% of net self-employment income, max $69,000"
        />
        <ResultCard
          label="Max Solo 401(k) Contribution (2024)"
          value={fmt(results.solo401kTotal)}
          sublabel={age >= 50 ? 'Includes $7,500 catch-up contribution' : 'Employee + employer contributions combined'}
        />

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="mb-2 font-semibold">Recommended Monthly Split</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span>Tax reserve (28%)</span><span className="font-medium">{fmt(results.taxReserve)}</span></div>
            <div className="flex justify-between"><span>Retirement savings</span><span className="font-medium">{fmt(results.retirementMonthly)}</span></div>
            <div className="flex justify-between"><span>Emergency fund top-up</span><span className="font-medium">{fmt(results.efContribution)}</span></div>
            <div className="flex justify-between border-t border-blue-200 pt-1 font-semibold"><span>Take-home</span><span>{fmt(results.takeHome)}</span></div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
          Based on 2024 IRS limits. Roth IRA limit: {fmt(results.iraContribution)}/year. Not financial advice — consult a CFP.
        </div>
      </div>
    </div>
  )
}

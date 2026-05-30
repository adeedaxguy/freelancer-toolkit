'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function RetainerCalculator() {
  const [hours, setHours] = useState(20)
  const [rate, setRate] = useState(100)
  const [discount, setDiscount] = useState(10)

  const results = useMemo(() => {
    const fullPrice = hours * rate
    const discountAmount = fullPrice * (discount / 100)
    const retainer = fullPrice - discountAmount
    const effectiveRate = hours > 0 ? retainer / hours : 0
    const annualValue = retainer * 12
    const clientSavings = discountAmount * 12
    return { fullPrice, discountAmount, retainer, effectiveRate, annualValue, clientSavings }
  }, [hours, rate, discount])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Retainer Details</h2>
        <InputField
          label="Monthly Hours Committed"
          value={hours}
          onChange={setHours}
          min={1}
          suffix="hrs"
          hint="Hours you'll dedicate each month"
        />
        <InputField label="Standard Hourly Rate" value={rate} onChange={setRate} min={1} prefix="$" />
        <InputField
          label="Retainer Discount"
          value={discount}
          onChange={setDiscount}
          min={0}
          max={50}
          step={0.5}
          suffix="%"
          hint="Reward for commitment (5–15% is common)"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Retainer Pricing</h2>
        <ResultCard label="Monthly Retainer Fee" value={fmt(results.retainer)} highlight sublabel="What to invoice each month" />
        <ResultCard label="Effective Hourly Rate" value={`${fmt(results.effectiveRate)}/hr`} sublabel="After discount applied" />
        <ResultCard label="Full-Price Value" value={fmt(results.fullPrice)} sublabel="What this would cost hourly" />
        <ResultCard label="Annual Contract Value" value={fmt(results.annualValue)} sublabel="Total if renewed for 12 months" />

        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
          Client saves <strong>{fmt(results.clientSavings)}/year</strong> vs. hourly — a compelling reason to sign a retainer.
        </div>
      </div>
    </div>
  )
}

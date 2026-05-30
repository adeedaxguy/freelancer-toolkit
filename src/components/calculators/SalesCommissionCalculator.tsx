'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

interface Tier {
  id: number
  upTo: number
  rate: number
}

export default function SalesCommissionCalculator() {
  const [saleAmount, setSaleAmount] = useState(10000)
  const [commissionRate, setCommissionRate] = useState(10)
  const [mode, setMode] = useState<'flat' | 'tiered'>('flat')
  const [tiers, setTiers] = useState<Tier[]>([
    { id: 1, upTo: 10000, rate: 5 },
    { id: 2, upTo: 50000, rate: 8 },
    { id: 3, upTo: Infinity, rate: 12 },
  ])

  const flatResults = useMemo(() => {
    const commission = saleAmount * (commissionRate / 100)
    const remaining = saleAmount - commission
    return { commission, remaining }
  }, [saleAmount, commissionRate])

  const tieredResults = useMemo(() => {
    let remaining = saleAmount
    let totalCommission = 0
    let prevCeiling = 0
    const breakdown: { label: string; amount: number; rate: number; commission: number }[] = []

    for (const tier of tiers) {
      if (remaining <= 0) break
      const tierMax = tier.upTo === Infinity ? remaining : Math.min(remaining, tier.upTo - prevCeiling)
      const tierAmount = Math.min(remaining, tierMax)
      const tierCommission = tierAmount * (tier.rate / 100)
      totalCommission += tierCommission
      breakdown.push({
        label: tier.upTo === Infinity ? `Above $${prevCeiling.toLocaleString()}` : `$${prevCeiling.toLocaleString()} – $${tier.upTo.toLocaleString()}`,
        amount: tierAmount,
        rate: tier.rate,
        commission: tierCommission,
      })
      remaining -= tierAmount
      prevCeiling = tier.upTo
    }

    const effectiveRate = saleAmount > 0 ? (totalCommission / saleAmount) * 100 : 0
    return { totalCommission, effectiveRate, breakdown }
  }, [saleAmount, tiers])

  const updateTier = (id: number, field: 'upTo' | 'rate', value: number) =>
    setTiers((t) => t.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)))

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-3">
        {(['flat', 'tiered'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition ${mode === m ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {m === 'flat' ? 'Flat Rate Commission' : 'Tiered Commission'}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Commission Details</h2>
          <InputField label="Sale Amount" value={saleAmount} onChange={setSaleAmount} prefix="$" min={0} />

          {mode === 'flat' ? (
            <InputField label="Commission Rate" value={commissionRate} onChange={setCommissionRate} suffix="%" min={0} max={100} step={0.5} />
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Commission Tiers</label>
              {tiers.map((tier, i) => (
                <div key={tier.id} className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <label className="text-xs text-gray-400">Up to ($)</label>
                    <input
                      className="input-field text-sm"
                      type="number"
                      value={tier.upTo === Infinity ? '' : tier.upTo}
                      onChange={(e) => updateTier(tier.id, 'upTo', e.target.value === '' ? Infinity : Number(e.target.value))}
                      placeholder="No limit"
                      disabled={i === tiers.length - 1}
                    />
                    {i === tiers.length - 1 && <p className="text-xs text-gray-400 mt-0.5">No limit (final tier)</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Rate (%)</label>
                    <input
                      className="input-field text-sm"
                      type="number"
                      value={tier.rate}
                      onChange={(e) => updateTier(tier.id, 'rate', Number(e.target.value))}
                      min={0}
                      max={100}
                      step={0.5}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Your Commission</h2>
          {mode === 'flat' ? (
            <>
              <ResultCard label="Commission Earned" value={fmt(flatResults.commission)} highlight sublabel={`${commissionRate}% of ${fmt(saleAmount)}`} />
              <ResultCard label="Remaining to Business" value={fmt(flatResults.remaining)} sublabel="After commission deducted" />
            </>
          ) : (
            <>
              <ResultCard label="Total Commission" value={fmt(tieredResults.totalCommission)} highlight sublabel={`Effective rate: ${tieredResults.effectiveRate.toFixed(2)}%`} />
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Tier Breakdown</p>
                <div className="space-y-2">
                  {tieredResults.breakdown.map((b, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{b.label} at {b.rate}%</span>
                      <span className="font-medium text-gray-900">{fmt(b.commission)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

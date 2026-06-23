'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

const DEFAULT_FEE_RATE = 10

export default function UpworkFeeCalculator() {
  const [projectValue, setProjectValue] = useState(1000)
  const [contractType, setContractType] = useState<'fixed' | 'hourly'>('fixed')
  const [feeRate, setFeeRate] = useState(DEFAULT_FEE_RATE)
  const normalizedFeeRate = Math.min(Math.max(feeRate, 0), 15) / 100

  const results = useMemo(() => {
    const fee = projectValue * normalizedFeeRate
    const netEarnings = projectValue - fee
    const effectiveCut = projectValue > 0 ? (fee / projectValue) * 100 : 0
    return { fee, netEarnings, effectiveCut }
  }, [projectValue, normalizedFeeRate])

  // Calculate what to charge to net a target amount
  const [targetNet, setTargetNet] = useState(900)
  const toChargeForTarget = useMemo(() => targetNet / (1 - normalizedFeeRate), [targetNet, normalizedFeeRate])

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Project Details</h2>

          {/* Contract type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Contract Type</label>
            <div className="flex gap-3">
              {(['fixed', 'hourly'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setContractType(type)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                    contractType === type
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type === 'fixed' ? 'Fixed Price' : 'Hourly'}
                </button>
              ))}
            </div>
          </div>

          <InputField
            label={contractType === 'fixed' ? 'Project Value' : 'Total Earnings (before fee)'}
            value={projectValue}
            onChange={setProjectValue}
            prefix="$"
            min={1}
          />

          <InputField
            label="Upwork Freelancer Service Fee"
            value={feeRate}
            onChange={setFeeRate}
            suffix="%"
            min={0}
            max={15}
          />

          <p className="text-xs leading-5 text-gray-400">
            Upwork says freelancer service fees can vary by contract from 0% to 15%. Use the exact percentage shown when you submit a proposal or receive an offer.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Your Earnings</h2>
          <ResultCard label="You Receive" value={fmt(results.netEarnings)} highlight sublabel={`After Upwork's ${feeRate}% freelancer service fee`} />
          <ResultCard label={`Upwork Fee (${feeRate}%)`} value={fmt(results.fee)} sublabel="Deducted from your earnings" />
          <ResultCard label="Effective Cut" value={`${results.effectiveCut.toFixed(1)}%`} sublabel="Of the gross contract amount" />

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <strong>Upwork fee note:</strong> The calculator uses your chosen freelancer service fee. Check the fee shown in Upwork before bidding because the rate can vary by contract.
          </div>
        </div>
      </div>

      {/* Reverse calculator */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Reverse Calculator: What to Charge</h2>
        <p className="mb-4 text-sm text-gray-500">Enter the amount you want to <em>take home</em> and we&apos;ll tell you what to quote.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <InputField label="Desired Net Earnings" value={targetNet} onChange={setTargetNet} prefix="$" min={1} />
          <div className="flex flex-col justify-end">
            <ResultCard
              label="Quote This Amount to Client"
              value={fmt(toChargeForTarget)}
              highlight
              sublabel={`After ${feeRate}% fee -> ${fmt(targetNet)} net`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

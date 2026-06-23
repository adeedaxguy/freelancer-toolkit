'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

const FIVERR_FEE = 0.20 // Fiverr takes 20% from sellers

export default function FiverrFeeCalculator() {
  const [orderValue, setOrderValue] = useState(100)
  const [targetNet, setTargetNet] = useState(80)

  const results = useMemo(() => {
    const fee = orderValue * FIVERR_FEE
    const netEarnings = orderValue - fee
    const effectiveRate = orderValue > 0 ? (fee / orderValue) * 100 : 0
    // Buyer also pays a service fee (5.5% + $0.50 under $75, capped)
    const buyerFee = orderValue < 75 ? orderValue * 0.055 + 0.5 : orderValue * 0.055
    const buyerTotal = orderValue + buyerFee
    return { fee, netEarnings, effectiveRate, buyerTotal, buyerFee }
  }, [orderValue])

  const toChargeForTarget = useMemo(() => targetNet / (1 - FIVERR_FEE), [targetNet])

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Order Details</h2>
          <InputField
            label="Order / Gig Price"
            value={orderValue}
            onChange={setOrderValue}
            prefix="$"
            min={5}
            hint="The price you set for your Fiverr gig or order"
          />
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Fiverr Fee:</strong> Fiverr deducts a flat <strong>20%</strong> from every order you receive as a seller.
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Your Earnings</h2>
          <ResultCard
            label="You Receive"
            value={fmt(results.netEarnings)}
            highlight
            sublabel="After Fiverr's 20% seller fee"
          />
          <ResultCard
            label="Fiverr Takes (20%)"
            value={fmt(results.fee)}
            sublabel="Deducted from your order value"
          />
          <ResultCard
            label="Buyer Pays Total"
            value={fmt(results.buyerTotal)}
            sublabel={`Order + ~5.5% buyer service fee`}
          />
        </div>
      </div>

      {/* Reverse calculator */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-gray-900">Reverse: What to Charge to Net Your Target</h2>
        <p className="mb-4 text-sm text-gray-500">
          Enter the amount you want to <em>take home</em> and see what to set your Fiverr gig price at.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <InputField
            label="Desired Net Earnings"
            value={targetNet}
            onChange={setTargetNet}
            prefix="$"
            min={1}
          />
          <div className="flex flex-col justify-end">
            <ResultCard
              label="Set Your Gig Price At"
              value={fmt(toChargeForTarget)}
              highlight
              sublabel={`After 20% fee → ${fmt(targetNet)} net`}
            />
          </div>
        </div>
      </div>

      {/* Fee comparison */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Platform Fee Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-left font-semibold text-gray-700">Platform</th>
                <th className="pb-2 text-right font-semibold text-gray-700">Seller Fee</th>
                <th className="pb-2 text-right font-semibold text-gray-700">You Keep (on ${orderValue})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="bg-amber-50">
                <td className="py-2.5 font-medium text-amber-800">Fiverr</td>
                <td className="py-2.5 text-right text-amber-800">20%</td>
                <td className="py-2.5 text-right font-semibold text-amber-800">{fmt(orderValue * 0.80)}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600">Upwork</td>
                <td className="py-2.5 text-right text-gray-600">0-15%*</td>
                <td className="py-2.5 text-right text-gray-700">{fmt(orderValue * 0.90)}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600">Freelancer.com</td>
                <td className="py-2.5 text-right text-gray-600">10%</td>
                <td className="py-2.5 text-right text-gray-700">{fmt(orderValue * 0.90)}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-600">PeoplePerHour</td>
                <td className="py-2.5 text-right text-gray-600">20%</td>
                <td className="py-2.5 text-right text-gray-700">{fmt(orderValue * 0.80)}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-gray-400">*Upwork row shows 10% example take-home; confirm the actual freelancer service fee shown on the contract.</p>
        </div>
      </div>
    </div>
  )
}

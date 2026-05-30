'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

const PLATFORMS = [
  {
    id: 'upwork',
    name: 'Upwork',
    logo: '🔵',
    calculateFee: (amount: number) => amount * 0.10,
    notes: 'Flat 10% on all earnings (updated 2023)',
  },
  {
    id: 'fiverr',
    name: 'Fiverr',
    logo: '🟢',
    calculateFee: (amount: number) => amount * 0.20,
    notes: 'Flat 20% on all seller earnings',
  },
  {
    id: 'freelancer',
    name: 'Freelancer.com',
    logo: '🔷',
    calculateFee: (amount: number) => Math.max(amount * 0.10, 5),
    notes: '10% or $5 minimum (fixed price); 10% hourly',
  },
  {
    id: 'pph',
    name: 'PeoplePerHour',
    logo: '🟠',
    calculateFee: (amount: number) => {
      if (amount <= 350) return amount * 0.20
      if (amount <= 7000) return 70 + (amount - 350) * 0.075
      return 70 + (7000 - 350) * 0.075 + (amount - 7000) * 0.035
    },
    notes: '20% up to £350 / 7.5% up to £7k / 3.5% above',
  },
]

export default function FreelancerCommissionCalculator() {
  const [amount, setAmount] = useState(1000)
  const [selected, setSelected] = useState<string[]>(['upwork', 'fiverr', 'freelancer', 'pph'])

  const results = useMemo(() =>
    PLATFORMS.map((p) => {
      const fee = p.calculateFee(amount)
      const net = amount - fee
      const pct = amount > 0 ? (fee / amount) * 100 : 0
      return { ...p, fee, net, pct }
    }),
    [amount]
  )

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Project Details</h2>
          <InputField label="Project / Order Value" value={amount} onChange={setAmount} prefix="$" min={1} />
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">Compare Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    selected.includes(p.id)
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-500'
                  }`}
                >
                  {p.logo} {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Best Platform for This Amount</h2>
          {(() => {
            const filtered = results.filter((r) => selected.includes(r.id))
            const best = filtered.reduce((a, b) => (a.net > b.net ? a : b), filtered[0])
            if (!best) return <p className="text-sm text-gray-400">Select at least one platform.</p>
            return (
              <div className="space-y-3">
                <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Best Net Earnings</p>
                  <p className="mt-1 text-xl font-bold text-brand-700">{best.logo} {best.name}</p>
                  <p className="text-2xl font-bold text-brand-900">{fmt(best.net)}</p>
                  <p className="text-xs text-brand-600">{best.pct.toFixed(1)}% fee → {fmt(best.fee)} deducted</p>
                </div>
                <p className="text-xs text-gray-400">{best.notes}</p>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[400px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-5">Platform</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-5">Fee</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-5">Fee %</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-5">You Receive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {results
              .filter((r) => selected.includes(r.id))
              .sort((a, b) => b.net - a.net)
              .map((r, i) => (
                <tr key={r.id} className={i === 0 ? 'bg-brand-50/50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3.5 font-medium text-gray-900 sm:px-5">{r.logo} {r.name}</td>
                  <td className="px-4 py-3.5 text-right text-red-600 sm:px-5">{fmt(r.fee)}</td>
                  <td className="px-4 py-3.5 text-right text-gray-500 sm:px-5">{r.pct.toFixed(1)}%</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-gray-900 sm:px-5">{fmt(r.net)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

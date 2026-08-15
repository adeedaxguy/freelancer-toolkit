'use client'

import { useMemo, useState } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  }).format(Number.isFinite(n) ? n : 0)

const pct = (n: number) => `${n.toFixed(n % 1 === 0 ? 0 : 1)}%`

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function ProjectCostCalculator() {
  const [deliveryHours, setDeliveryHours] = useState(40)
  const [adminHours, setAdminHours] = useState(6)
  const [rate, setRate] = useState(100)
  const [buffer, setBuffer] = useState(20)
  const [revisions, setRevisions] = useState(2)
  const [revisionHours, setRevisionHours] = useState(3)
  const [expenses, setExpenses] = useState(250)
  const [paymentFeePercent, setPaymentFeePercent] = useState(3)
  const [profitMarginPercent, setProfitMarginPercent] = useState(15)
  const [taxReservePercent, setTaxReservePercent] = useState(25)
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => {
    const cleanDeliveryHours = Math.max(0, deliveryHours)
    const cleanAdminHours = Math.max(0, adminHours)
    const cleanRevisionHours = Math.max(0, revisions) * Math.max(0, revisionHours)
    const laborHours = cleanDeliveryHours + cleanAdminHours + cleanRevisionHours
    const hourlyRate = Math.max(0, rate)
    const directExpenses = Math.max(0, expenses)
    const paymentRate = Math.min(Math.max(paymentFeePercent, 0), 40) / 100
    const profitRate = Math.min(Math.max(profitMarginPercent, 0), 60) / 100
    const taxRate = Math.min(Math.max(taxReservePercent, 0), 60) / 100
    const combinedGrossUp = Math.min(paymentRate + profitRate, 0.85)

    const laborValue = laborHours * hourlyRate
    const preRiskCost = laborValue + directExpenses
    const bufferAmount = preRiskCost * (Math.max(0, buffer) / 100)
    const protectedDeliveryCost = preRiskCost + bufferAmount
    const quote = combinedGrossUp >= 0.85 ? protectedDeliveryCost / 0.15 : protectedDeliveryCost / (1 - combinedGrossUp)
    const paymentFees = quote * paymentRate
    const targetProfit = quote * profitRate
    const revenueAfterFeesAndExpenses = quote - paymentFees - directExpenses
    const taxReserve = Math.max(0, revenueAfterFeesAndExpenses * taxRate)
    const cashAfterTaxReserve = revenueAfterFeesAndExpenses - taxReserve
    const effectiveHourly = laborHours > 0 ? cashAfterTaxReserve / laborHours : 0
    const minimumBreakEven = protectedDeliveryCost + paymentFees
    const revisionCost = cleanRevisionHours * hourlyRate

    const riskLevel =
      buffer >= 25 || revisions >= 4 ? 'High-scope protection' :
      buffer >= 15 || revisions >= 2 ? 'Healthy protection' :
      'Thin protection'

    return {
      laborHours,
      cleanDeliveryHours,
      cleanAdminHours,
      cleanRevisionHours,
      laborValue,
      directExpenses,
      bufferAmount,
      protectedDeliveryCost,
      quote,
      paymentFees,
      targetProfit,
      taxReserve,
      cashAfterTaxReserve,
      effectiveHourly,
      minimumBreakEven,
      revisionCost,
      riskLevel,
      combinedGrossUp,
    }
  }, [adminHours, buffer, deliveryHours, expenses, paymentFeePercent, profitMarginPercent, rate, revisionHours, revisions, taxReservePercent])

  const summary = useMemo(() => {
    return [
      'Freelance project quote summary',
      '',
      `Recommended quote: ${fmt(results.quote)}`,
      `Delivery hours: ${results.cleanDeliveryHours}h production + ${results.cleanAdminHours}h admin/client work + ${results.cleanRevisionHours}h revisions`,
      `Hourly rate: ${fmt(rate)}/hr`,
      `Direct expenses: ${fmt(results.directExpenses)}`,
      `Scope buffer: ${pct(buffer)} (${fmt(results.bufferAmount)})`,
      `Payment/platform fee allowance: ${pct(paymentFeePercent)} (${fmt(results.paymentFees)})`,
      `Profit room: ${pct(profitMarginPercent)} (${fmt(results.targetProfit)})`,
      `Suggested tax reserve: ${pct(taxReservePercent)} (${fmt(results.taxReserve)})`,
      `Cash left after fees, expenses, and tax reserve: ${fmt(results.cashAfterTaxReserve)}`,
      `Effective hourly after reserve: ${fmt(results.effectiveHourly, 2)}/hr`,
      '',
      'Suggested payment split:',
      `Deposit 50%: ${fmt(results.quote * 0.5)}`,
      `Milestone 30%: ${fmt(results.quote * 0.3)}`,
      `Final 20%: ${fmt(results.quote * 0.2)}`,
    ].join('\n')
  }, [buffer, paymentFeePercent, profitMarginPercent, rate, results, taxReservePercent])

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const quoteRows = [
    ['Production labor', `${results.cleanDeliveryHours}h x ${fmt(rate)}/hr`, fmt(results.cleanDeliveryHours * rate)],
    ['Admin, calls, handoff', `${results.cleanAdminHours}h x ${fmt(rate)}/hr`, fmt(results.cleanAdminHours * rate)],
    ['Revision allowance', `${revisions} rounds x ${revisionHours}h`, fmt(results.revisionCost)],
    ['Direct expenses', 'Software, contractors, stock, tools', fmt(results.directExpenses)],
    ['Scope buffer', `${pct(buffer)} contingency`, fmt(results.bufferAmount)],
    ['Payment/platform fees', `${pct(paymentFeePercent)} allowance`, fmt(results.paymentFees)],
    ['Profit room', `${pct(profitMarginPercent)} of quote`, fmt(results.targetProfit)],
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Advanced project quote worksheet</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-900">
              Build a client-ready price from production hours, admin time, revision allowance, expenses, risk buffer,
              payment fees, profit room, and tax reserve. The result is meant to be defendable in a proposal, not just a rough estimate.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm">
            {results.riskLevel}
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Estimate the real work</h2>
            <p className="mt-1 text-sm text-gray-500">Include client calls, project management, QA, and handoff time so the quote does not punish delivery work.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField label="Production hours" value={deliveryHours} onChange={setDeliveryHours} min={0} suffix="hrs" />
            <InputField label="Admin / client hours" value={adminHours} onChange={setAdminHours} min={0} suffix="hrs" hint="Calls, planning, QA, handoff, project management." />
            <InputField label="Hourly rate" value={rate} onChange={setRate} min={0} prefix="$" />
            <InputField label="Direct expenses" value={expenses} onChange={setExpenses} min={0} prefix="$" hint="Tools, contractors, stock assets, travel, or pass-through costs." />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <InputField label="Revision rounds" value={revisions} onChange={setRevisions} min={0} max={20} />
            <InputField label="Hours per revision" value={revisionHours} onChange={setRevisionHours} min={0} suffix="hrs" />
            <InputField label="Scope buffer" value={buffer} onChange={setBuffer} min={0} max={100} suffix="%" hint="15-25% is typical for fixed-scope work." />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <InputField label="Payment/platform fee" value={paymentFeePercent} onChange={setPaymentFeePercent} min={0} max={40} step={0.1} suffix="%" />
            <InputField label="Profit room" value={profitMarginPercent} onChange={setProfitMarginPercent} min={0} max={60} step={0.5} suffix="%" />
            <InputField label="Tax reserve" value={taxReservePercent} onChange={setTaxReservePercent} min={0} max={60} step={0.5} suffix="%" hint="For planning only. Confirm with your accountant." />
          </div>

          {results.combinedGrossUp >= 0.85 && (
            <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
              Your fee plus profit settings are very high, so the quote is capped to avoid impossible math. Lower one of those percentages for a cleaner estimate.
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Quote result</h2>
          <ResultCard
            label="Recommended client quote"
            value={fmt(results.quote)}
            highlight
            sublabel={`Covers ${results.laborHours}h, expenses, buffer, fees, and profit room`}
          />
          <ResultCard
            label="Protected delivery cost"
            value={fmt(results.protectedDeliveryCost)}
            sublabel={`Labor + expenses + ${fmt(results.bufferAmount)} risk buffer`}
          />
          <ResultCard
            label="Break-even floor"
            value={fmt(results.minimumBreakEven)}
            sublabel="Do not quote below this unless you intentionally discount"
          />
          <ResultCard
            label="Effective hourly after reserve"
            value={`${fmt(results.effectiveHourly, 2)}/hr`}
            sublabel={`After payment fees, expenses, and ${pct(taxReservePercent)} tax reserve`}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Quote anatomy</h2>
            <p className="mt-1 text-sm text-gray-500">Use this breakdown to explain why the quote is not just hours times rate.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Line item</th>
                  <th className="px-5 py-3 font-semibold">Basis</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quoteRows.map(([label, basis, amount]) => (
                  <tr key={label}>
                    <td className="px-5 py-3 font-medium text-gray-900">{label}</td>
                    <td className="px-5 py-3 text-gray-600">{basis}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Suggested payment split</h2>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ['Deposit to start', 0.5],
              ['Midpoint milestone', 0.3],
              ['Final handoff', 0.2],
            ].map(([label, share]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">{fmt(results.quote * Number(share))}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-500">
            Pair this with a written scope, revision limit, payment terms, and acceptance criteria before work starts.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Copyable proposal note</h2>
            <p className="mt-1 text-sm text-gray-500">Paste this into a proposal, estimate, or internal pricing doc.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={copySummary}>{copied ? 'Copied' : 'Copy summary'}</button>
            <button type="button" className="btn-primary" onClick={() => downloadText('freeltools-project-quote-summary.txt', summary)}>Download TXT</button>
          </div>
        </div>
        <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">{summary}</pre>
      </div>
    </div>
  )
}

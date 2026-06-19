'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

export default function LatePaymentCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState(2500)
  const [daysOverdue, setDaysOverdue] = useState(30)
  const [annualRate, setAnnualRate] = useState(18) // 1.5%/month = 18% annual, common standard

  const results = useMemo(() => {
    const dailyRate = annualRate / 100 / 365
    const interest = invoiceAmount * dailyRate * daysOverdue
    const totalOwed = invoiceAmount + interest
    const monthlyRate = annualRate / 12
    const interestPerMonth = invoiceAmount * (monthlyRate / 100)
    return { interest, totalOwed, interestPerMonth, dailyRate: dailyRate * 100 }
  }, [invoiceAmount, daysOverdue, annualRate])

  const scenarios = useMemo(() => {
    const dailyRate = annualRate / 100 / 365
    return [30, 60, 90].map((days) => ({
      days,
      interest: invoiceAmount * dailyRate * days,
      total: invoiceAmount + invoiceAmount * dailyRate * days,
    }))
  }, [invoiceAmount, annualRate])

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Invoice Details</h2>
          <InputField
            label="Original Invoice Amount"
            value={invoiceAmount}
            onChange={setInvoiceAmount}
            prefix="$"
            min={1}
          />
          <InputField
            label="Days Overdue"
            value={daysOverdue}
            onChange={setDaysOverdue}
            suffix="days"
            min={1}
            hint="Number of days past the invoice due date"
          />
          <InputField
            label="Annual Late Fee Rate"
            value={annualRate}
            onChange={setAnnualRate}
            suffix="%"
            min={0}
            max={100}
            step={0.5}
            hint="Standard is 1.5%/month (18%/year). Check your contract or local laws."
          />
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <strong>Tip:</strong> Include your late fee rate in every contract and invoice. The US standard is 1.5%/month. Some states cap late fees — always check local law.
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Late Fee Calculation</h2>
          <ResultCard
            label="Total Amount Now Owed"
            value={fmt(results.totalOwed)}
            highlight
            sublabel={`Original invoice + ${daysOverdue}-day late fee`}
          />
          <ResultCard
            label="Late Fee Charge"
            value={fmt(results.interest)}
            sublabel={`At ${annualRate}% annual rate for ${daysOverdue} days`}
          />
          <ResultCard
            label="Monthly Interest Accrual"
            value={fmt(results.interestPerMonth)}
            sublabel={`${(annualRate / 12).toFixed(2)}%/month on $${invoiceAmount.toLocaleString()}`}
          />
        </div>
      </div>

      {/* Scenario table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Late Fee Timeline</h2>
        <p className="mb-4 text-sm text-gray-500">
          How the fee grows over time at {annualRate}% annual rate on a {fmt(invoiceAmount)} invoice.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-left font-semibold text-gray-700">Days Overdue</th>
                <th className="pb-2 text-right font-semibold text-gray-700">Late Fee</th>
                <th className="pb-2 text-right font-semibold text-gray-700">Total Owed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scenarios.map((s) => (
                <tr key={s.days} className={s.days === daysOverdue ? 'bg-brand-50' : ''}>
                  <td className="py-2.5 font-medium text-gray-700">{s.days} days</td>
                  <td className="py-2.5 text-right text-red-600">{fmt(s.interest)}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-900">{fmt(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template text */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Late Payment Notice Template</h2>
        <p className="mb-3 text-sm text-gray-500">Copy this into your follow-up email to the client:</p>
        <div className="rounded-lg bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-700 whitespace-pre-wrap select-all">
{`Hi [Client Name],

This is a reminder that Invoice #[NUMBER] for ${fmt(invoiceAmount)} was due on [DUE DATE] and is now ${daysOverdue} days overdue.

Per our agreement, a late payment fee of ${annualRate}% per annum applies to overdue balances.

Updated amount now due: ${fmt(results.totalOwed)}
(Original: ${fmt(invoiceAmount)} + Late fee: ${fmt(results.interest)})

Please arrange payment at your earliest convenience. If you have already sent payment, please disregard this notice.

Thank you,
[Your Name]`}
        </div>
      </div>
    </div>
  )
}

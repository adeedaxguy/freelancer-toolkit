'use client'

import { useState, useMemo } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

export default function LatePaymentCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState(2500)
  const [amountPaid, setAmountPaid] = useState(0)
  const [daysOverdue, setDaysOverdue] = useState(30)
  const [graceDays, setGraceDays] = useState(0)
  const [annualRate, setAnnualRate] = useState(18) // 1.5%/month = 18% annual, common standard
  const [adminFee, setAdminFee] = useState(0)

  const results = useMemo(() => {
    const remainingBalance = Math.max(0, invoiceAmount - amountPaid)
    const chargeableDays = Math.max(0, daysOverdue - graceDays)
    const dailyRate = annualRate / 100 / 365
    const interest = remainingBalance * dailyRate * chargeableDays
    const totalOwed = remainingBalance + interest + adminFee
    const monthlyRate = annualRate / 12
    const interestPerMonth = remainingBalance * (monthlyRate / 100)
    const stage = daysOverdue >= 90
      ? 'Final demand / collections review'
      : daysOverdue >= 60
        ? 'Pause work and send firm notice'
        : daysOverdue >= 30
          ? 'Second reminder with updated balance'
          : 'Friendly reminder'
    const suggestedNow = Math.max(totalOwed * 0.5, remainingBalance * 0.25)
    return { remainingBalance, chargeableDays, interest, totalOwed, interestPerMonth, dailyRate: dailyRate * 100, stage, suggestedNow }
  }, [adminFee, amountPaid, invoiceAmount, daysOverdue, graceDays, annualRate])

  const scenarios = useMemo(() => {
    const dailyRate = annualRate / 100 / 365
    const remainingBalance = Math.max(0, invoiceAmount - amountPaid)
    return [15, 30, 45, 60, 90].map((days) => ({
      days,
      interest: remainingBalance * dailyRate * Math.max(0, days - graceDays),
      total: remainingBalance + remainingBalance * dailyRate * Math.max(0, days - graceDays) + adminFee,
    }))
  }, [adminFee, amountPaid, graceDays, invoiceAmount, annualRate])

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
            label="Payments Already Received"
            value={amountPaid}
            onChange={setAmountPaid}
            prefix="$"
            min={0}
            max={invoiceAmount}
            hint="Use this if the client made a partial payment."
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
            label="Grace Days"
            value={graceDays}
            onChange={setGraceDays}
            suffix="days"
            min={0}
            max={120}
            hint="Optional courtesy period before late fees start."
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
          <InputField
            label="Admin / Recovery Fee"
            value={adminFee}
            onChange={setAdminFee}
            prefix="$"
            min={0}
            hint="Only include if your contract or local rules allow it."
          />
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <strong>Tip:</strong> Include your late fee rate in every contract and invoice. Some places cap fees or require specific wording, so confirm your contract and local rules before charging.
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Late Fee Calculation</h2>
          <ResultCard
            label="Total Amount Now Owed"
            value={fmt(results.totalOwed)}
            highlight
            sublabel={`Remaining balance + ${results.chargeableDays}-day late fee${adminFee > 0 ? ' + admin fee' : ''}`}
          />
          <ResultCard
            label="Late Fee Charge"
            value={fmt(results.interest)}
            sublabel={`At ${annualRate}% annual rate for ${results.chargeableDays} chargeable days`}
          />
          <ResultCard
            label="Monthly Interest Accrual"
            value={fmt(results.interestPerMonth)}
            sublabel={`${(annualRate / 12).toFixed(2)}%/month on ${fmt(results.remainingBalance)}`}
          />
          <ResultCard
            label="Suggested Next Action"
            value={results.stage}
            sublabel={`Ask for at least ${fmt(results.suggestedNow)} now if offering a payment plan`}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Remaining balance', fmt(results.remainingBalance), 'Invoice minus partial payments.'],
          ['Chargeable days', `${results.chargeableDays} days`, `${graceDays} grace days removed from the fee calculation.`],
          ['Payment-plan floor', fmt(results.suggestedNow), 'A practical minimum first payment before extending terms.'],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-sm leading-6 text-gray-500">{note}</p>
          </div>
        ))}
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
(Remaining balance: ${fmt(results.remainingBalance)} + Late fee: ${fmt(results.interest)}${adminFee > 0 ? ` + Admin fee: ${fmt(adminFee)}` : ''})

If full payment is difficult, please send at least ${fmt(results.suggestedNow)} now and confirm the date for the remaining balance.

Please arrange payment at your earliest convenience. If you have already sent payment, please disregard this notice.

Thank you,
[Your Name]`}
        </div>
      </div>
    </div>
  )
}

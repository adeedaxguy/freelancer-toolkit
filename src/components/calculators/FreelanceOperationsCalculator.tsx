'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0)

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)

function BillableUtilizationCalculator() {
  const [workingHours, setWorkingHours] = useState(40)
  const [billableHours, setBillableHours] = useState(24)
  const [workingWeeks, setWorkingWeeks] = useState(46)
  const [hourlyRate, setHourlyRate] = useState(85)

  const result = useMemo(() => {
    const safeWorkingHours = Math.max(workingHours, 1)
    const safeBillableHours = Math.min(Math.max(billableHours, 0), safeWorkingHours)
    const utilization = (safeBillableHours / safeWorkingHours) * 100
    const annualBillableHours = safeBillableHours * Math.max(workingWeeks, 0)
    const annualWorkingHours = safeWorkingHours * Math.max(workingWeeks, 0)
    return {
      utilization,
      annualBillableHours,
      annualWorkingHours,
      annualNonBillableHours: annualWorkingHours - annualBillableHours,
      capacityRevenue: annualBillableHours * Math.max(hourlyRate, 0),
    }
  }, [workingHours, billableHours, workingWeeks, hourlyRate])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Weekly capacity</h2>
        <InputField label="Total working hours per week" value={workingHours} onChange={setWorkingHours} min={1} max={100} suffix="hours" />
        <InputField label="Billable hours per week" value={billableHours} onChange={setBillableHours} min={0} max={workingHours} suffix="hours" />
        <InputField label="Working weeks per year" value={workingWeeks} onChange={setWorkingWeeks} min={1} max={52} suffix="weeks" />
        <InputField label="Average billed hourly rate" value={hourlyRate} onChange={setHourlyRate} min={0} prefix="$" />
        <p className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-sky-800">
          Count only client-delivery time as billable. Sales, proposals, bookkeeping, learning, and internal admin belong in non-billable capacity.
        </p>
      </div>
      <div className="space-y-4">
        <ResultCard label="Billable utilization" value={`${formatNumber(result.utilization, 1)}%`} highlight sublabel={`${formatNumber(result.annualBillableHours)} billable hours per year`} />
        <ResultCard label="Annual revenue capacity" value={formatMoney(result.capacityRevenue)} sublabel="At the average billed rate entered" />
        <ResultCard label="Annual non-billable time" value={`${formatNumber(result.annualNonBillableHours)} hours`} sublabel="Sales, admin, gaps, and business development" />
        <ResultCard label="Annual working capacity" value={`${formatNumber(result.annualWorkingHours)} hours`} sublabel={`${workingWeeks} working weeks`} />
      </div>
    </div>
  )
}

function EffectiveHourlyRateCalculator() {
  const [projectFee, setProjectFee] = useState(3500)
  const [deliveryHours, setDeliveryHours] = useState(32)
  const [adminHours, setAdminHours] = useState(6)
  const [revisionHours, setRevisionHours] = useState(5)
  const [directExpenses, setDirectExpenses] = useState(180)
  const [paymentFeePercent, setPaymentFeePercent] = useState(3)

  const result = useMemo(() => {
    const totalHours = Math.max(0, deliveryHours) + Math.max(0, adminHours) + Math.max(0, revisionHours)
    const paymentFees = Math.max(0, projectFee) * (Math.max(0, paymentFeePercent) / 100)
    const netRevenue = Math.max(0, projectFee) - Math.max(0, directExpenses) - paymentFees
    const effectiveRate = totalHours > 0 ? netRevenue / totalHours : 0
    const nonDeliveryShare = totalHours > 0 ? ((Math.max(0, adminHours) + Math.max(0, revisionHours)) / totalHours) * 100 : 0
    return { totalHours, paymentFees, netRevenue, effectiveRate, nonDeliveryShare }
  }, [projectFee, deliveryHours, adminHours, revisionHours, directExpenses, paymentFeePercent])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Completed project numbers</h2>
        <InputField label="Client project fee" value={projectFee} onChange={setProjectFee} min={0} prefix="$" />
        <InputField label="Delivery hours" value={deliveryHours} onChange={setDeliveryHours} min={0} suffix="hours" />
        <InputField label="Admin and meeting hours" value={adminHours} onChange={setAdminHours} min={0} suffix="hours" />
        <InputField label="Revision and rework hours" value={revisionHours} onChange={setRevisionHours} min={0} suffix="hours" />
        <InputField label="Direct project expenses" value={directExpenses} onChange={setDirectExpenses} min={0} prefix="$" />
        <InputField label="Payment or platform fees" value={paymentFeePercent} onChange={setPaymentFeePercent} min={0} max={100} suffix="%" />
      </div>
      <div className="space-y-4">
        <ResultCard label="Effective hourly rate" value={formatMoney(result.effectiveRate)} highlight sublabel="Net project revenue divided by every hour worked" />
        <ResultCard label="Net project revenue" value={formatMoney(result.netRevenue)} sublabel="After direct expenses and payment fees" />
        <ResultCard label="Total time invested" value={`${formatNumber(result.totalHours, 1)} hours`} sublabel={`${formatNumber(result.nonDeliveryShare, 1)}% spent on admin or revisions`} />
        <ResultCard label="Payment fees" value={formatMoney(result.paymentFees)} sublabel={`${paymentFeePercent}% of the client fee`} />
      </div>
    </div>
  )
}

export default function FreelanceOperationsCalculator() {
  const slug = usePathname().split('/tools/')[1]?.split('/')[0]
  return slug === 'billable-utilization-calculator' ? <BillableUtilizationCalculator /> : <EffectiveHourlyRateCalculator />
}

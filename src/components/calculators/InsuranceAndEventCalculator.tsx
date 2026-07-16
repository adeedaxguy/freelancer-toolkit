'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const money = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0)

const number = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(Number.isFinite(value) ? value : 0)

const percent = (value: number, maximumFractionDigits = 1) => `${number(value, maximumFractionDigits)}%`

function InsightBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-gray-600">{children}</div>
    </div>
  )
}

function EstimateDisclaimer() {
  return (
    <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
      Planning estimate only. Insurance policies, state rules, deductibles, endorsements, fees, and claim handling can change the final number. Confirm the result with your insurer, lender, agent, or policy documents before acting.
    </p>
  )
}

function GapInsuranceRefundCalculator() {
  const [premium, setPremium] = useState(895)
  const [termMonths, setTermMonths] = useState(60)
  const [monthsUsed, setMonthsUsed] = useState(18)
  const [cancellationFee, setCancellationFee] = useState(25)

  const result = useMemo(() => {
    const safeTerm = Math.max(termMonths, 1)
    const used = Math.min(Math.max(monthsUsed, 0), safeTerm)
    const remaining = safeTerm - used
    const unusedRatio = remaining / safeTerm
    const grossRefund = premium * unusedRatio
    const estimatedRefund = Math.max(0, grossRefund - cancellationFee)
    return { used, remaining, unusedRatio, grossRefund, estimatedRefund }
  }, [premium, termMonths, monthsUsed, cancellationFee])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">GAP refund inputs</h2>
        <InputField label="Original GAP premium" value={premium} onChange={setPremium} min={0} prefix="$" />
        <InputField label="Original term" value={termMonths} onChange={setTermMonths} min={1} suffix="months" />
        <InputField label="Months used before cancellation/payoff" value={monthsUsed} onChange={setMonthsUsed} min={0} max={termMonths} suffix="months" />
        <InputField label="Cancellation or admin fee" value={cancellationFee} onChange={setCancellationFee} min={0} prefix="$" />
        <EstimateDisclaimer />
      </div>
      <div className="space-y-4">
        <ResultCard label="Estimated refund" value={money(result.estimatedRefund)} highlight sublabel={`${percent(result.unusedRatio * 100)} of the GAP term remains`} />
        <ResultCard label="Gross unused premium" value={money(result.grossRefund)} sublabel={`${result.remaining} of ${termMonths} months unused`} />
        <ResultCard label="Estimated fee deducted" value={money(cancellationFee)} sublabel="Use the fee shown in your GAP contract if different" />
        <InsightBox title="What to ask for">
          <p>Ask the dealer, lender, or administrator for a prorated cancellation quote, the cancellation effective date, and whether any non-refundable fees apply.</p>
        </InsightBox>
      </div>
    </div>
  )
}

function HomeReplacementCostCalculator() {
  const [squareFeet, setSquareFeet] = useState(2200)
  const [costPerSqFt, setCostPerSqFt] = useState(225)
  const [qualityMultiplier, setQualityMultiplier] = useState(110)
  const [detachedStructures, setDetachedStructures] = useState(25000)
  const [debrisPermits, setDebrisPermits] = useState(12)
  const [inflationBuffer, setInflationBuffer] = useState(10)

  const result = useMemo(() => {
    const base = squareFeet * costPerSqFt
    const qualityAdjusted = base * (qualityMultiplier / 100)
    const debrisAndPermits = qualityAdjusted * (debrisPermits / 100)
    const beforeBuffer = qualityAdjusted + detachedStructures + debrisAndPermits
    const buffer = beforeBuffer * (inflationBuffer / 100)
    const recommended = beforeBuffer + buffer
    return { base, qualityAdjusted, debrisAndPermits, beforeBuffer, buffer, recommended }
  }, [squareFeet, costPerSqFt, qualityMultiplier, detachedStructures, debrisPermits, inflationBuffer])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Replacement cost inputs</h2>
        <InputField label="Finished square feet" value={squareFeet} onChange={setSquareFeet} min={100} suffix="sq ft" />
        <InputField label="Local rebuild cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} min={50} prefix="$" />
        <InputField label="Quality/custom feature adjustment" value={qualityMultiplier} onChange={setQualityMultiplier} min={70} max={200} suffix="%" hint="100% is standard build quality; increase for custom finishes." />
        <InputField label="Detached structures or special features" value={detachedStructures} onChange={setDetachedStructures} min={0} prefix="$" />
        <InputField label="Debris removal, permits, code costs" value={debrisPermits} onChange={setDebrisPermits} min={0} max={50} suffix="%" />
        <InputField label="Inflation / demand surge buffer" value={inflationBuffer} onChange={setInflationBuffer} min={0} max={50} suffix="%" />
        <EstimateDisclaimer />
      </div>
      <div className="space-y-4">
        <ResultCard label="Estimated replacement cost" value={money(result.recommended)} highlight sublabel="Planning target for dwelling coverage" />
        <ResultCard label="Base rebuild cost" value={money(result.base)} sublabel={`${number(squareFeet)} sq ft x ${money(costPerSqFt)}/sq ft`} />
        <ResultCard label="Quality adjusted cost" value={money(result.qualityAdjusted)} sublabel={`${qualityMultiplier}% quality/custom adjustment`} />
        <ResultCard label="Debris, permits, code allowance" value={money(result.debrisAndPermits)} sublabel={`${debrisPermits}% of adjusted rebuild cost`} />
        <ResultCard label="Inflation buffer" value={money(result.buffer)} sublabel={`${inflationBuffer}% added after structures and allowances`} />
      </div>
    </div>
  )
}

function DwellingCoverageCalculator() {
  const [replacementCost, setReplacementCost] = useState(620000)
  const [currentCoverage, setCurrentCoverage] = useState(500000)
  const [extendedReplacement, setExtendedReplacement] = useState(25)
  const [deductible, setDeductible] = useState(5000)

  const result = useMemo(() => {
    const maxAvailable = currentCoverage * (1 + extendedReplacement / 100)
    const gap = replacementCost - maxAvailable
    const currentGap = replacementCost - currentCoverage
    const insuredRatio = replacementCost > 0 ? currentCoverage / replacementCost : 0
    return { maxAvailable, gap, currentGap, insuredRatio, outOfPocketAfterDeductible: Math.max(0, gap + deductible) }
  }, [replacementCost, currentCoverage, extendedReplacement, deductible])

  const status = result.gap > 0 ? 'Coverage gap' : 'Coverage cushion'

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Dwelling coverage inputs</h2>
        <InputField label="Estimated replacement cost" value={replacementCost} onChange={setReplacementCost} min={0} prefix="$" />
        <InputField label="Current Coverage A / dwelling limit" value={currentCoverage} onChange={setCurrentCoverage} min={0} prefix="$" />
        <InputField label="Extended replacement endorsement" value={extendedReplacement} onChange={setExtendedReplacement} min={0} max={100} suffix="%" hint="Enter 0 if your policy does not include extended replacement cost." />
        <InputField label="Deductible" value={deductible} onChange={setDeductible} min={0} prefix="$" />
        <EstimateDisclaimer />
      </div>
      <div className="space-y-4">
        <ResultCard label={status} value={money(Math.abs(result.gap))} highlight sublabel={result.gap > 0 ? 'Estimated amount not covered by the dwelling limit plus extension' : 'Estimated cushion after extension'} />
        <ResultCard label="Maximum available dwelling coverage" value={money(result.maxAvailable)} sublabel={`${money(currentCoverage)} limit + ${extendedReplacement}% extension`} />
        <ResultCard label="Gap before extension" value={money(Math.max(0, result.currentGap))} sublabel={`Current limit covers ${percent(result.insuredRatio * 100)} of replacement cost`} />
        <ResultCard label="Possible out-of-pocket in total loss" value={money(result.outOfPocketAfterDeductible)} sublabel="Gap plus deductible, if the gap is positive" />
        <InsightBox title="Useful next step">
          <p>If the gap is positive, ask your insurer for an updated replacement cost estimate and quote higher Coverage A or an extended replacement cost endorsement.</p>
        </InsightBox>
      </div>
    </div>
  )
}

function ActualCashValueCalculator() {
  const [replacementCost, setReplacementCost] = useState(3500)
  const [ageYears, setAgeYears] = useState(4)
  const [usefulLife, setUsefulLife] = useState(10)
  const [conditionAdjustment, setConditionAdjustment] = useState(0)
  const [deductible, setDeductible] = useState(500)

  const result = useMemo(() => {
    const safeLife = Math.max(usefulLife, 1)
    const depreciationRate = Math.min(0.95, Math.max(0, ageYears / safeLife))
    const conditionValue = replacementCost * (conditionAdjustment / 100)
    const depreciation = replacementCost * depreciationRate
    const acvBeforeDeductible = Math.max(0, replacementCost - depreciation + conditionValue)
    const estimatedPayout = Math.max(0, acvBeforeDeductible - deductible)
    return { depreciationRate, depreciation, conditionValue, acvBeforeDeductible, estimatedPayout }
  }, [replacementCost, ageYears, usefulLife, conditionAdjustment, deductible])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Actual cash value inputs</h2>
        <InputField label="Replacement cost today" value={replacementCost} onChange={setReplacementCost} min={0} prefix="$" />
        <InputField label="Item age" value={ageYears} onChange={setAgeYears} min={0} suffix="years" />
        <InputField label="Expected useful life" value={usefulLife} onChange={setUsefulLife} min={1} suffix="years" />
        <InputField label="Condition adjustment" value={conditionAdjustment} onChange={setConditionAdjustment} min={-50} max={50} suffix="%" hint="Use positive for excellent condition, negative for heavy wear." />
        <InputField label="Deductible" value={deductible} onChange={setDeductible} min={0} prefix="$" />
        <EstimateDisclaimer />
      </div>
      <div className="space-y-4">
        <ResultCard label="Estimated ACV payout" value={money(result.estimatedPayout)} highlight sublabel="Actual cash value after deductible" />
        <ResultCard label="ACV before deductible" value={money(result.acvBeforeDeductible)} sublabel={`${percent(result.depreciationRate * 100)} depreciation applied`} />
        <ResultCard label="Estimated depreciation" value={money(result.depreciation)} sublabel={`${ageYears} of ${usefulLife} useful-life years`} />
        <ResultCard label="Condition adjustment" value={money(result.conditionValue)} sublabel="Added to or subtracted from ACV before deductible" />
        <InsightBox title="ACV formula">
          <p>Planning formula: replacement cost minus age-based depreciation, plus or minus condition adjustment, then minus deductible.</p>
        </InsightBox>
      </div>
    </div>
  )
}

function CoinsurancePenaltyCalculator() {
  const [propertyValue, setPropertyValue] = useState(1000000)
  const [coinsurancePercent, setCoinsurancePercent] = useState(80)
  const [insuranceCarried, setInsuranceCarried] = useState(650000)
  const [lossAmount, setLossAmount] = useState(200000)
  const [deductible, setDeductible] = useState(2500)

  const result = useMemo(() => {
    const requiredInsurance = propertyValue * (coinsurancePercent / 100)
    const complianceRatio = requiredInsurance > 0 ? Math.min(1, insuranceCarried / requiredInsurance) : 1
    const claimBeforeDeductible = lossAmount * complianceRatio
    const estimatedPayout = Math.max(0, claimBeforeDeductible - deductible)
    const penalty = Math.max(0, lossAmount - claimBeforeDeductible)
    const shortage = Math.max(0, requiredInsurance - insuranceCarried)
    return { requiredInsurance, complianceRatio, claimBeforeDeductible, estimatedPayout, penalty, shortage }
  }, [propertyValue, coinsurancePercent, insuranceCarried, lossAmount, deductible])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Coinsurance inputs</h2>
        <InputField label="Property replacement value" value={propertyValue} onChange={setPropertyValue} min={0} prefix="$" />
        <InputField label="Coinsurance requirement" value={coinsurancePercent} onChange={setCoinsurancePercent} min={1} max={100} suffix="%" />
        <InputField label="Insurance carried" value={insuranceCarried} onChange={setInsuranceCarried} min={0} prefix="$" />
        <InputField label="Covered loss amount" value={lossAmount} onChange={setLossAmount} min={0} prefix="$" />
        <InputField label="Deductible" value={deductible} onChange={setDeductible} min={0} prefix="$" />
        <EstimateDisclaimer />
      </div>
      <div className="space-y-4">
        <ResultCard label="Estimated claim payout" value={money(result.estimatedPayout)} highlight sublabel="After coinsurance penalty and deductible" />
        <ResultCard label="Insurance required" value={money(result.requiredInsurance)} sublabel={`${percent(coinsurancePercent)} of replacement value`} />
        <ResultCard label="Compliance ratio" value={percent(result.complianceRatio * 100)} sublabel={result.shortage > 0 ? `${money(result.shortage)} below requirement` : 'Meets or exceeds the requirement'} />
        <ResultCard label="Estimated coinsurance penalty" value={money(result.penalty)} sublabel="Loss amount not paid because the property was underinsured" />
        <InsightBox title="Coinsurance formula">
          <p>Payout before deductible = loss amount x insurance carried / insurance required. The ratio is capped at 100%.</p>
        </InsightBox>
      </div>
    </div>
  )
}

const zones = [
  { label: 'US Eastern (EDT, UTC-4)', short: 'New York', offset: -4 },
  { label: 'US Central (CDT, UTC-5)', short: 'Chicago', offset: -5 },
  { label: 'US Pacific (PDT, UTC-7)', short: 'Los Angeles', offset: -7 },
  { label: 'UK (BST, UTC+1)', short: 'London', offset: 1 },
  { label: 'Central Europe (CEST, UTC+2)', short: 'Berlin', offset: 2 },
  { label: 'UAE (UTC+4)', short: 'Dubai', offset: 4 },
  { label: 'Pakistan (UTC+5)', short: 'Karachi', offset: 5 },
  { label: 'India (UTC+5:30)', short: 'India', offset: 5.5 },
  { label: 'Bangladesh (UTC+6)', short: 'Dhaka', offset: 6 },
  { label: 'Australia Eastern (AEST, UTC+10)', short: 'Sydney', offset: 10 },
]

function formatZoneTime(utcDate: Date, offset: number) {
  const shifted = new Date(utcDate.getTime() + offset * 60 * 60 * 1000)
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(shifted)
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(shifted)
  return `${date}, ${time}`
}

function buildUtcDate(date: string, time: string, offset: number) {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - offset * 60 * 60 * 1000)
}

function WorldCupMatchTimeConverter() {
  const [date, setDate] = useState('2026-07-19')
  const [time, setTime] = useState('15:00')
  const [sourceOffset, setSourceOffset] = useState(-4)

  const utcDate = useMemo(() => buildUtcDate(date, time, sourceOffset), [date, time, sourceOffset])
  const sourceZone = zones.find((zone) => zone.offset === sourceOffset) ?? zones[0]

  const calendarUrl = useMemo(() => {
    const start = utcDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
    const end = new Date(utcDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'World Cup match',
      dates: `${start}/${end}`,
      details: 'Converted with the free World Cup Match Time Converter on FreelTools.',
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }, [utcDate])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Match kickoff</h2>
          <p className="mt-1 text-sm text-gray-500">The default is the 2026 World Cup final kickoff planning time: July 19, 2026 at 3:00 PM US Eastern.</p>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Match date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="input-field mt-1.5 h-10"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Kickoff time
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="input-field mt-1.5 h-10"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Kickoff time zone
          <select
            value={sourceOffset}
            onChange={(event) => setSourceOffset(Number(event.target.value))}
            className="input-field mt-1.5 h-10"
          >
            {zones.map((zone) => (
              <option key={zone.label} value={zone.offset}>{zone.label}</option>
            ))}
          </select>
        </label>
        <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
          Add converted kickoff to Google Calendar
        </a>
        <p className="text-xs leading-5 text-gray-500">Time zone offsets use the listed daylight-saving status. For official fixtures, always confirm the final kickoff with the tournament organizer or broadcaster.</p>
      </div>
      <div className="space-y-4">
        <ResultCard label={`Kickoff in ${sourceZone.short}`} value={formatZoneTime(utcDate, sourceZone.offset)} highlight sublabel="Source time you entered" />
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Converted kickoff times</h3>
          <div className="mt-4 divide-y divide-gray-100">
            {zones.map((zone) => (
              <div key={zone.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="font-medium text-gray-700">{zone.short}</span>
                <span className="text-right text-gray-900">{formatZoneTime(utcDate, zone.offset)}</span>
              </div>
            ))}
          </div>
        </div>
        <InsightBox title="Best SEO angle">
          <p>This is safer than betting/prediction content: it answers match-time intent, supports country variants, and can be updated for finals, semi-finals, and major football events.</p>
        </InsightBox>
      </div>
    </div>
  )
}

export default function InsuranceAndEventCalculator() {
  const pathname = usePathname()
  const slug = pathname.split('/tools/')[1]?.split('/')[0] ?? ''

  if (slug === 'home-replacement-cost-calculator') return <HomeReplacementCostCalculator />
  if (slug === 'dwelling-coverage-calculator') return <DwellingCoverageCalculator />
  if (slug === 'actual-cash-value-calculator') return <ActualCashValueCalculator />
  if (slug === 'coinsurance-penalty-calculator') return <CoinsurancePenaltyCalculator />
  if (slug === 'world-cup-match-time-converter') return <WorldCupMatchTimeConverter />

  return <GapInsuranceRefundCalculator />
}

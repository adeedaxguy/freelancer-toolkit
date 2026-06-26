'use client'

import { useMemo, useState } from 'react'
import InputField from '@/components/InputField'
import ResultCard from '@/components/ResultCard'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

const pct = (n: number) => `${n.toFixed(n % 1 === 0 ? 0 : 1)}%`

const examplePrices = [5, 25, 50, 100, 500, 1000]

export default function FiverrFeeCalculator() {
  const [orderValue, setOrderValue] = useState(100)
  const [tipValue, setTipValue] = useState(0)
  const [targetNet, setTargetNet] = useState(80)
  const [sellerFeePercent, setSellerFeePercent] = useState(20)
  const [buyerServiceFeePercent, setBuyerServiceFeePercent] = useState(5.5)
  const [smallOrderThreshold, setSmallOrderThreshold] = useState(50)
  const [smallOrderFee, setSmallOrderFee] = useState(2)

  const results = useMemo(() => {
    const sellerRate = Math.max(0, sellerFeePercent) / 100
    const buyerRate = Math.max(0, buyerServiceFeePercent) / 100
    const gigPrice = Math.max(0, orderValue)
    const tip = Math.max(0, tipValue)
    const sellerGross = gigPrice + tip
    const sellerFee = sellerGross * sellerRate
    const sellerNet = sellerGross - sellerFee
    const buyerFee = gigPrice * buyerRate + (gigPrice < smallOrderThreshold ? Math.max(0, smallOrderFee) : 0)
    const buyerTotal = gigPrice + buyerFee
    const targetGross = sellerRate >= 1 ? 0 : Math.max(0, targetNet) / (1 - sellerRate)

    return {
      buyerFee,
      buyerRate,
      buyerTotal,
      sellerFee,
      sellerGross,
      sellerNet,
      sellerRate,
      targetGross,
    }
  }, [buyerServiceFeePercent, orderValue, sellerFeePercent, smallOrderFee, smallOrderThreshold, targetNet, tipValue])

  const exampleRows = useMemo(() => {
    const sellerRate = Math.max(0, sellerFeePercent) / 100
    const buyerRate = Math.max(0, buyerServiceFeePercent) / 100

    return examplePrices.map((price) => {
      const sellerFee = price * sellerRate
      const sellerNet = price - sellerFee
      const buyerFee = price * buyerRate + (price < smallOrderThreshold ? Math.max(0, smallOrderFee) : 0)
      return {
        price,
        sellerFee,
        sellerNet,
        buyerFee,
        buyerTotal: price + buyerFee,
      }
    })
  }, [buyerServiceFeePercent, sellerFeePercent, smallOrderFee, smallOrderThreshold])

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">2026 Fiverr fee planning assumptions</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">Seller, buyer, and reverse gig price calculator</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              Defaults use a {pct(sellerFeePercent)} Fiverr seller commission, {pct(buyerServiceFeePercent)} buyer service fee,
              and a {fmt(smallOrderFee)} small-order fee below {fmt(smallOrderThreshold)}. Adjust the assumptions if Fiverr shows a different fee in your account or checkout.
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm">
            No signup. Instant math.
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="min-w-0 space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Order details</h2>
            <p className="mt-1 text-sm text-gray-500">Use this for a Fiverr gig package, custom offer, milestone, or tip.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Gig / order price"
              value={orderValue}
              onChange={setOrderValue}
              prefix="$"
              min={0}
              step={5}
              hint="The listed Fiverr order value before buyer service fees."
            />
            <InputField
              label="Tip amount"
              value={tipValue}
              onChange={setTipValue}
              prefix="$"
              min={0}
              step={5}
              hint="Fiverr seller commission usually applies to tips too."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Seller fee"
              value={sellerFeePercent}
              onChange={setSellerFeePercent}
              suffix="%"
              min={0}
              max={100}
              step={0.5}
              hint="Default: 20% seller commission."
            />
            <InputField
              label="Buyer service fee"
              value={buyerServiceFeePercent}
              onChange={setBuyerServiceFeePercent}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
              hint="Default: 5.5% buyer fee."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Small-order threshold"
              value={smallOrderThreshold}
              onChange={setSmallOrderThreshold}
              prefix="$"
              min={0}
              step={5}
              hint="Default: add small-order fee below $50."
            />
            <InputField
              label="Small-order fee"
              value={smallOrderFee}
              onChange={setSmallOrderFee}
              prefix="$"
              min={0}
              step={0.5}
              hint="Default: $2 extra buyer fee."
            />
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Fee breakdown</h2>
          <ResultCard
            label="Seller receives"
            value={fmt(results.sellerNet)}
            highlight
            sublabel={`After ${pct(sellerFeePercent)} seller fee on ${fmt(results.sellerGross)}`}
          />
          <ResultCard
            label="Fiverr seller fee"
            value={fmt(results.sellerFee)}
            sublabel={`${pct(sellerFeePercent)} of order + tip`}
          />
          <ResultCard
            label="Buyer pays total"
            value={fmt(results.buyerTotal)}
            sublabel={`Order + ${fmt(results.buyerFee)} estimated buyer fee`}
          />
          <ResultCard
            label="Buyer service fee"
            value={fmt(results.buyerFee)}
            sublabel={`${pct(buyerServiceFeePercent)}${orderValue < smallOrderThreshold ? ` + ${fmt(smallOrderFee)} small-order fee` : ''}`}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Reverse: what to charge to net your target</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Start with what you want to keep. The calculator gross-ups the Fiverr gig price so the seller fee is already covered.
          </p>
          <div className="mt-5 grid gap-5">
            <InputField
              label="Desired seller take-home"
              value={targetNet}
              onChange={setTargetNet}
              prefix="$"
              min={0}
              step={10}
            />
            <ResultCard
              label="Set your Fiverr price at"
              value={fmt(results.targetGross)}
              highlight
              sublabel={`${fmt(results.targetGross)} minus ${pct(sellerFeePercent)} = ${fmt(targetNet)} net`}
            />
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Common Fiverr price examples</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Quick reference for low-cost gigs, standard packages, and larger custom offers using your current fee assumptions.
          </p>
          <div className="mt-4 min-w-0 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-2 font-semibold">Gig price</th>
                  <th className="pb-2 text-right font-semibold">Seller fee</th>
                  <th className="pb-2 text-right font-semibold">Seller keeps</th>
                  <th className="pb-2 text-right font-semibold">Buyer fee</th>
                  <th className="pb-2 text-right font-semibold">Buyer total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {exampleRows.map((row) => (
                  <tr key={row.price}>
                    <td className="py-2.5 font-medium text-gray-900">{fmt(row.price)}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmt(row.sellerFee)}</td>
                    <td className="py-2.5 text-right font-semibold text-brand-700">{fmt(row.sellerNet)}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmt(row.buyerFee)}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-900">{fmt(row.buyerTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Seller formula',
            body: `Seller net = (gig price + tip) x ${pct(100 - sellerFeePercent)} after the Fiverr seller fee.`,
          },
          {
            title: 'Buyer formula',
            body: `Buyer total = gig price + ${pct(buyerServiceFeePercent)} buyer service fee${orderValue < smallOrderThreshold ? ` + ${fmt(smallOrderFee)} small-order fee` : ''}.`,
          },
          {
            title: 'Pricing rule',
            body: `To net a target amount, divide the target by ${(1 - results.sellerRate).toFixed(2)}. Example: ${fmt(targetNet)} net needs ${fmt(results.targetGross)} gross.`,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        <strong>Important:</strong> Fiverr can change fees, apply local taxes, currency conversion, payment processor charges, or special program rules.
        Use this as a planning calculator and confirm the final fee shown inside Fiverr before you publish a gig, accept an order, or withdraw funds.
      </div>
    </div>
  )
}

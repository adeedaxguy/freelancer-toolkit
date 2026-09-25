'use client'

import { useMemo, useState } from 'react'
import type { Locale } from '@/lib/i18n'

const labels = {
  es: { amount: 'Importe del proyecto', gross: 'Pago del cliente', fee: 'Comisión estimada', net: 'Recibes aproximadamente', note: 'Estimación orientativa. Confirma siempre las tarifas actuales en la plataforma.' },
  fr: { amount: 'Montant du projet', gross: 'Paiement du client', fee: 'Frais estimés', net: 'Vous recevez environ', note: 'Estimation indicative. Vérifiez toujours les frais actuels sur la plateforme.' },
  it: { amount: 'Importo del progetto', gross: 'Pagamento del cliente', fee: 'Commissione stimata', net: 'Ricevi circa', note: 'Stima indicativa. Verifica sempre le tariffe attuali sulla piattaforma.' },
}

export default function LocalizedFeeCalculator({ locale, platform }: { locale: Locale; platform: 'fiverr' | 'upwork' }) {
  const [amount, setAmount] = useState(500)
  const copy = labels[locale]
  const result = useMemo(() => {
    const feeRate = platform === 'fiverr' ? 0.2 : 0.1
    const fee = Math.max(0, amount) * feeRate
    return { fee, net: Math.max(0, amount) - fee }
  }, [amount, platform])
  return <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <label className="block text-sm font-bold text-gray-900" htmlFor="localized-fee-amount">{copy.amount}</label>
    <div className="mt-2 flex items-center rounded-lg border border-gray-300 bg-white px-4 focus-within:ring-2 focus-within:ring-brand-500"><span className="text-gray-500">$</span><input id="localized-fee-amount" type="number" min="0" value={amount} onChange={event => setAmount(Number(event.target.value))} className="min-h-12 w-full px-3 text-lg font-semibold outline-none"/></div>
    <dl className="mt-5 divide-y divide-gray-100 rounded-lg bg-gray-50 px-4">
      <div className="flex justify-between gap-4 py-4"><dt className="text-sm text-gray-600">{copy.gross}</dt><dd className="font-bold text-gray-950">${amount.toFixed(2)}</dd></div>
      <div className="flex justify-between gap-4 py-4"><dt className="text-sm text-gray-600">{copy.fee}</dt><dd className="font-bold text-red-600">-${result.fee.toFixed(2)}</dd></div>
      <div className="flex justify-between gap-4 py-4"><dt className="text-sm font-semibold text-gray-800">{copy.net}</dt><dd className="text-lg font-extrabold text-brand-700">${result.net.toFixed(2)}</dd></div>
    </dl>
    <p className="mt-4 text-xs leading-5 text-gray-500">{copy.note}</p>
  </div>
}

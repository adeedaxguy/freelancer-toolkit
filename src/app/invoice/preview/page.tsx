'use client'

import { useEffect, useState } from 'react'

interface LineItem {
  id: number
  description: string
  quantity: string
  rate: string
}

interface InvoiceData {
  from: { name: string; email: string; address: string }
  to: { name: string; email: string; address: string }
  invoiceNumber: string
  issueDate: string
  dueDate: string
  notes: string
  taxRate: number
  lineItems: LineItem[]
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

export default function InvoicePreviewPage() {
  const [data, setData] = useState<InvoiceData | null>(null)

  useEffect(() => {
    document.body.classList.add('invoice-preview')
    try {
      const raw = localStorage.getItem('ft_invoice_preview')
      if (raw) setData(JSON.parse(raw))
    } catch {
      // ignore
    }
    return () => document.body.classList.remove('invoice-preview')
  }, [])

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">No invoice data found. <a href="/tools/invoice-generator" className="text-blue-600 underline">Go back</a></p>
      </div>
    )
  }

  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0),
    0
  )
  const tax = subtotal * (data.taxRate / 100)
  const total = subtotal + tax

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .invoice-page { box-shadow: none !important; border: none !important; margin: 0 !important; }
        }
        @page { margin: 15mm; }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-gray-900 px-6 py-3 text-white shadow">
        <div className="flex items-center gap-3">
          <a href="/tools/invoice-generator" className="text-sm text-gray-300 hover:text-white">← Back to Editor</a>
          <span className="text-gray-600">|</span>
          <span className="text-sm font-semibold">{data.invoiceNumber}</span>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 active:scale-95 transition"
        >
          ⬇️ Save as PDF / Print
        </button>
      </div>

      {/* Invoice */}
      <div className="no-print pt-16" />
      <div className="invoice-page mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 shadow-lg my-8 print:my-0 print:rounded-none print:shadow-none">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">INVOICE</h1>
            <p className="mt-2 text-sm font-semibold text-gray-700">{data.invoiceNumber}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Issued: {data.issueDate}</p>
            {data.dueDate && <p>Due: {data.dueDate}</p>}
          </div>
        </div>

        {/* From / To */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          {[
            { label: 'From', info: data.from },
            { label: 'Bill To', info: data.to },
          ].map(({ label, info }) => (
            <div key={label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
              <p className="font-semibold text-gray-900">{info.name || '—'}</p>
              {info.email && <p className="text-sm text-gray-600">{info.email}</p>}
              {info.address && <p className="text-sm text-gray-600 whitespace-pre-line">{info.address}</p>}
            </div>
          ))}
        </div>

        {/* Line Items */}
        <div className="mt-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-900 text-left">
                <th className="pb-3 font-semibold text-gray-900 w-1/2">Description</th>
                <th className="pb-3 font-semibold text-gray-900 text-right w-16">Qty</th>
                <th className="pb-3 font-semibold text-gray-900 text-right w-28">Rate</th>
                <th className="pb-3 font-semibold text-gray-900 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.lineItems.filter(item => item.description || parseFloat(item.rate) > 0).map((item) => (
                <tr key={item.id}>
                  <td className="py-3 pr-4 text-gray-800">{item.description || '—'}</td>
                  <td className="py-3 pr-4 text-right text-gray-700">{item.quantity || '1'}</td>
                  <td className="py-3 pr-4 text-right text-gray-700">{fmt(parseFloat(item.rate) || 0)}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    {fmt((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax ({data.taxRate}%)</span>
                <span>{fmt(tax)}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-gray-900 pt-3 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mt-10 border-t border-gray-100 pt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Notes / Payment Instructions</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 border-t border-gray-100 pt-4 text-center text-xs text-gray-300">
          Generated by FreelTools.com
        </div>
      </div>
    </>
  )
}

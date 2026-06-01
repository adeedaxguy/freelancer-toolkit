'use client'

import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface LineItem {
  id: number
  description: string
  quantity: string
  rate: string
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

let nextId = 4

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: '', email: '', address: '' })
  const [to, setTo] = useState({ name: '', email: '', address: '' })
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: '', quantity: '1', rate: '' },
    { id: 2, description: '', quantity: '1', rate: '' },
    { id: 3, description: '', quantity: '1', rate: '' },
  ])
  const [showPreview, setShowPreview] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0)
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [lineItems, taxRate])

  const updateItem = (id: number, field: keyof LineItem, value: string) =>
    setLineItems((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))

  const addItem = () => {
    setLineItems((items) => [...items, { id: nextId++, description: '', quantity: '1', rate: '' }])
  }

  const removeItem = (id: number) => {
    setLineItems((items) => items.filter((item) => item.id !== id))
  }

  const filledItems = lineItems.filter(item => item.description || parseFloat(item.rate) > 0)

  return (
    <>
      {/* Print styles — only show #invoice-print-area when printing */}
      {/* Global print styles injected once */}
      <style>{`
        @media print {
          body > *:not(#invoice-print-root) { display: none !important; }
          #invoice-print-root { display: block !important; background: white; }
          .invoice-no-print { display: none !important; }
        }
        @page { margin: 15mm; size: A4; }
      `}</style>

      {/* ── Print overlay rendered as direct body child via Portal ── */}
      {mounted && showPreview && createPortal(
        <div id="invoice-print-root" className="fixed inset-0 z-50 bg-white overflow-auto">
        {/* Toolbar */}
        <div className="invoice-no-print sticky top-0 z-10 flex items-center justify-between gap-4 bg-gray-900 px-6 py-3 text-white shadow">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(false)}
              className="text-sm text-gray-300 hover:text-white"
            >
              ← Back to Editor
            </button>
            <span className="text-gray-600">|</span>
            <span className="text-sm font-semibold">{invoiceNumber}</span>
          </div>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 active:scale-95 transition"
          >
            ⬇️ Save as PDF / Print
          </button>
        </div>

        {/* Invoice */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 shadow-lg my-8 print:my-0 print:rounded-none print:shadow-none print:border-none">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">INVOICE</h1>
              <p className="mt-2 text-sm font-semibold text-gray-700">{invoiceNumber}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Issued: {issueDate}</p>
              {dueDate && <p>Due: {dueDate}</p>}
            </div>
          </div>

          {/* From / To */}
          <div className="mt-8 grid grid-cols-2 gap-8">
            {[
              { label: 'From', info: from },
              { label: 'Bill To', info: to },
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
                {(filledItems.length > 0 ? filledItems : lineItems).map((item) => (
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
                <span>{fmt(totals.subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({taxRate}%)</span>
                  <span>{fmt(totals.tax)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-gray-900 pt-3 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{fmt(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="mt-10 border-t border-gray-100 pt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Notes / Payment Instructions</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 border-t border-gray-100 pt-4 text-center text-xs text-gray-300">
            Generated by FreelTools.com
          </div>
        </div>
      </div>,
      document.body
      )}

      {/* ── Editor ── */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="btn-primary flex items-center gap-2"
          >
            👁️ Preview &amp; Download PDF
          </button>
          <p className="text-xs text-gray-400">Opens a clean preview — use &quot;Save as PDF&quot; or print from there.</p>
        </div>

        {/* Invoice preview */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <div className="mt-3 space-y-1">
                <input
                  className="input-field text-sm w-48"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Invoice #"
                />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 justify-end">
                  <label className="text-xs text-gray-400 whitespace-nowrap">Issue Date</label>
                  <input type="date" className="input-field text-sm w-36" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <label className="text-xs text-gray-400 whitespace-nowrap">Due Date</label>
                  <input type="date" className="input-field text-sm w-36" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            {[
              { label: 'From', data: from, set: setFrom },
              { label: 'Bill To', data: to, set: setTo },
            ].map(({ label, data, set }) => (
              <div key={label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
                <div className="space-y-2">
                  <input className="input-field text-sm" placeholder="Name / Business" value={data.name} onChange={(e) => set({ ...data, name: e.target.value })} />
                  <input className="input-field text-sm" placeholder="Email" value={data.email} onChange={(e) => set({ ...data, email: e.target.value })} />
                  <textarea className="input-field text-sm resize-none" rows={2} placeholder="Address" value={data.address} onChange={(e) => set({ ...data, address: e.target.value })} />
                </div>
              </div>
            ))}
          </div>

          {/* Line Items */}
          <div className="mt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-900 text-left">
                  <th className="pb-2 font-semibold text-gray-900 w-1/2">Description</th>
                  <th className="pb-2 font-semibold text-gray-900 text-right w-16">Qty</th>
                  <th className="pb-2 font-semibold text-gray-900 text-right w-24">Rate</th>
                  <th className="pb-2 font-semibold text-gray-900 text-right w-24">Amount</th>
                  <th className="pb-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 pr-3">
                      <input
                        className="input-field text-sm"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Service description"
                      />
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <input
                        className="input-field text-sm text-right w-16"
                        inputMode="decimal"
                        value={item.quantity}
                        placeholder="1"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <input
                        className="input-field text-sm text-right w-24"
                        inputMode="decimal"
                        value={item.rate}
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                      />
                    </td>
                    <td className="py-2 text-right font-medium">{fmt((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0))}</td>
                    <td className="py-2 pl-2">
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addItem} className="mt-3 text-sm text-brand-600 hover:underline">
              + Add line item
            </button>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{fmt(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 items-center">
                <span>
                  Tax{' '}
                  <input
                    className="input-field text-xs w-14 inline-block py-0.5 px-1"
                    inputMode="decimal"
                    value={taxRate === 0 ? '' : taxRate}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  />
                  %
                </span>
                <span>{fmt(totals.tax)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{fmt(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Notes / Payment Instructions</p>
            <textarea
              className="input-field text-sm resize-none w-full"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={'Bank transfer: BSB 000-000, Account 12345678\nPayment due within 7 days. Thank you for your business!'}
            />
          </div>
        </div>
      </div>
    </>
  )
}

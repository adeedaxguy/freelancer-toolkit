'use client'

import { useState, useMemo } from 'react'

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

  const handlePreviewAndDownload = () => {
    const data = { from, to, invoiceNumber, issueDate, dueDate, notes, taxRate, lineItems }
    localStorage.setItem('ft_invoice_preview', JSON.stringify(data))
    window.open('/invoice/preview', '_blank')
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handlePreviewAndDownload}
          className="btn-primary flex items-center gap-2"
        >
          👁️ Preview &amp; Download PDF
        </button>
        <p className="text-xs text-gray-400">Opens a clean preview — use "Save as PDF" or print from there.</p>
      </div>

      {/* Invoice preview */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <div className="mt-3 space-y-1">
              <input
                className="pdf-hide input-field text-sm w-48"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Invoice #"
              />
              <p className="hidden pdf-show text-sm font-semibold text-gray-700">{invoiceNumber}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="pdf-hide grid gap-1">
              <div className="flex items-center gap-2 justify-end">
                <label className="text-xs text-gray-400 whitespace-nowrap">Issue Date</label>
                <input type="date" className="input-field text-sm w-36" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <label className="text-xs text-gray-400 whitespace-nowrap">Due Date</label>
                <input type="date" className="input-field text-sm w-36" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <div className="hidden pdf-show text-sm text-gray-600">
              <p>Issued: {issueDate}</p>
              {dueDate && <p>Due: {dueDate}</p>}
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
              <div className="pdf-hide space-y-2">
                <input className="input-field text-sm" placeholder="Name / Business" value={data.name} onChange={(e) => set({ ...data, name: e.target.value })} />
                <input className="input-field text-sm" placeholder="Email" value={data.email} onChange={(e) => set({ ...data, email: e.target.value })} />
                <textarea className="input-field text-sm resize-none" rows={2} placeholder="Address" value={data.address} onChange={(e) => set({ ...data, address: e.target.value })} />
              </div>
              <div className="hidden pdf-show text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold">{data.name || '—'}</p>
                {data.email && <p>{data.email}</p>}
                {data.address && <p className="whitespace-pre-line">{data.address}</p>}
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
                <th className="pb-2 w-8 pdf-hide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 pr-3">
                    <input
                      className="pdf-hide input-field text-sm"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Service description"
                    />
                    <span className="hidden pdf-show">{item.description || '—'}</span>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <input
                      className="pdf-hide input-field text-sm text-right w-16"
                      inputMode="decimal"
                      value={item.quantity}
                      placeholder="1"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    />
                    <span className="hidden pdf-show">{item.quantity || '1'}</span>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <input
                      className="pdf-hide input-field text-sm text-right w-24"
                      inputMode="decimal"
                      value={item.rate}
                      placeholder="0.00"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                    />
                    <span className="hidden pdf-show">{fmt(parseFloat(item.rate) || 0)}</span>
                  </td>
                  <td className="py-2 text-right font-medium">{fmt((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0))}</td>
                  <td className="py-2 pl-2 pdf-hide">
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={addItem} className="pdf-hide mt-3 text-sm text-brand-600 hover:underline">
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
                  className="pdf-hide input-field text-xs w-14 inline-block py-0.5 px-1"
                  inputMode="decimal"
                  value={taxRate === 0 ? '' : taxRate}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                />
                <span className="hidden pdf-show-inline">{taxRate}%</span>
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
            className="pdf-hide input-field text-sm resize-none w-full"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bank transfer: BSB 000-000, Account 12345678 &#10;Payment due within 7 days. Thank you for your business!"
          />
          {notes && <p className="hidden pdf-show text-sm text-gray-600 whitespace-pre-line">{notes}</p>}
        </div>
      </div>
    </div>
  )
}

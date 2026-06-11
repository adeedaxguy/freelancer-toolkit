'use client'

import { useState, useRef, useCallback } from 'react'

declare global {
  interface Window {
    /* eslint-disable */
    pdfjsLib: any
    /* eslint-enable */
  }
}

interface PageResult {
  dataUrl: string
  pageNum: number
  width: number
  height: number
}

function loadPdfJs(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      resolve(window.pdfjsLib)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve(window.pdfjsLib)
    }
    script.onerror = () => reject(new Error('Failed to load PDF.js'))
    document.head.appendChild(script)
  })
}

export default function PdfToJpgConverter() {
  const [pages, setPages] = useState<PageResult[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState('')
  const [quality, setQuality] = useState(92)
  const [scale, setScale] = useState(2)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }
    setLoading(true)
    setError('')
    setPages([])
    setProgress(0)

    try {
      const pdfjsLib = await loadPdfJs()
      const arrayBuffer = await file.arrayBuffer()
      /* eslint-disable */
      const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise
      /* eslint-enable */
      const numPages: number = pdf.numPages
      setTotalPages(numPages)

      const results: PageResult[] = []
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport }).promise
        const dataUrl = canvas.toDataURL('image/jpeg', quality / 100)
        results.push({ dataUrl, pageNum: i, width: Math.round(viewport.width), height: Math.round(viewport.height) })
        setProgress(Math.round((i / numPages) * 100))
        // Yield to browser between pages
        await new Promise((r) => setTimeout(r, 0))
      }
      setPages(results)
    } catch (e) {
      setError('Could not process this PDF. Make sure it is not password-protected and try again.')
    } finally {
      setLoading(false)
    }
  }, [quality, scale])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const downloadPage = (page: PageResult) => {
    const a = document.createElement('a')
    a.href = page.dataUrl
    a.download = `page-${page.pageNum}.jpg`
    a.click()
  }

  const downloadAll = () => {
    pages.forEach((page) => {
      setTimeout(() => downloadPage(page), page.pageNum * 150)
    })
  }

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Output Quality: {quality}%</label>
          <p className="mb-1.5 text-xs text-gray-400">80–90% is indistinguishable from original at half the size</p>
          <input type="range" min={50} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-indigo-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>50% (smallest)</span><span>100% (lossless)</span></div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Render Scale: {scale}×</label>
          <p className="mb-1.5 text-xs text-gray-400">2× = ~144 DPI. Higher = sharper but larger files and slower</p>
          <input type="range" min={1} max={4} step={0.5} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-indigo-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1× (72 DPI)</span><span>4× (288 DPI)</span></div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition ${
          dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <span className="text-4xl">📄</span>
        <p className="mt-3 text-sm font-medium text-gray-700">Drop your PDF here or click to browse</p>
        <p className="mt-1 text-xs text-gray-400">Runs 100% in your browser — nothing uploaded</p>
        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
          <p className="text-sm font-medium text-gray-700 mb-3">Converting page {Math.round(progress * totalPages / 100)} of {totalPages}…</p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-gray-400">{progress}% complete</p>
        </div>
      )}

      {/* Results */}
      {pages.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">{pages.length} page{pages.length !== 1 ? 's' : ''} converted</h2>
              <p className="text-xs text-gray-400">Click a page to download it individually</p>
            </div>
            <button
              onClick={downloadAll}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Download All ({pages.length} JPGs)
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((page) => (
              <button
                key={page.pageNum}
                onClick={() => downloadPage(page)}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition hover:border-indigo-300 hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                  <span className="scale-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 transition group-hover:scale-100">
                    ↓ Download
                  </span>
                </div>
                <p className="p-2 text-center text-xs text-gray-500">Page {page.pageNum} · {page.width}×{page.height}px</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
        🔒 Your PDF never leaves your device. Conversion uses PDF.js — the same engine Mozilla Firefox uses to display PDFs.
      </div>
    </div>
  )
}

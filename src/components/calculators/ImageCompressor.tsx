'use client'

import { useState, useRef, useCallback } from 'react'

interface ImageResult {
  originalUrl: string
  compressedUrl: string
  originalSize: number
  compressedSize: number
  originalDimensions: [number, number]
  compressedDimensions: [number, number]
  fileName: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function dataUrlToBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.round((base64.length * 3) / 4)
}

export default function ImageCompressor() {
  const [result, setResult] = useState<ImageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg')
  const [dragging, setDragging] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const compress = useCallback(async (file: File, q: number, mw: number, fmt: 'jpeg' | 'png' | 'webp') => {
    setLoading(true)
    return new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const scale = Math.min(1, mw / img.width)
          const w = Math.round(img.width * scale)
          const h = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, w, h)
          const mimeType = fmt === 'png' ? 'image/png' : fmt === 'webp' ? 'image/webp' : 'image/jpeg'
          const compressedUrl = canvas.toDataURL(mimeType, q / 100)
          const originalUrl = e.target!.result as string
          setResult({
            originalUrl,
            compressedUrl,
            originalSize: file.size,
            compressedSize: dataUrlToBytes(compressedUrl),
            originalDimensions: [img.width, img.height],
            compressedDimensions: [w, h],
            fileName: file.name.replace(/\.[^.]+$/, '') + '.' + (fmt === 'jpeg' ? 'jpg' : fmt),
          })
          setLoading(false)
          resolve()
        }
        img.src = e.target!.result as string
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).')
      return
    }
    setCurrentFile(file)
    compress(file, quality, maxWidth, outputFormat)
  }, [compress, quality, maxWidth, outputFormat])

  const recompress = () => {
    if (currentFile) compress(currentFile, quality, maxWidth, outputFormat)
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.compressedUrl
    a.download = result.fileName
    a.click()
  }

  const saving = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Output Format</label>
          <select className="input-field h-10" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as 'jpeg' | 'png' | 'webp')}>
            <option value="jpeg">JPEG (best for photos)</option>
            <option value="png">PNG (lossless, supports transparency)</option>
            <option value="webp">WebP (modern, smallest size)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Max Width: {maxWidth}px</label>
          <p className="mb-1 text-xs text-gray-400">Images narrower than this stay unchanged</p>
          <select className="input-field h-10" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))}>
            <option value={640}>640px (mobile)</option>
            <option value={1280}>1280px (HD)</option>
            <option value={1920}>1920px (Full HD)</option>
            <option value={2560}>2560px (2K)</option>
            <option value={9999}>No resize</option>
          </select>
        </div>
        {outputFormat !== 'png' && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Quality: {quality}%</label>
            <p className="mb-1 text-xs text-gray-400">80% is nearly indistinguishable from original at ~50% smaller size</p>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10% (smallest)</span><span>100% (original quality)</span></div>
          </div>
        )}
        {currentFile && (
          <div className="sm:col-span-2">
            <button onClick={recompress} className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
              Recompress with New Settings
            </button>
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onClick={() => fileRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition ${
          dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <span className="text-4xl">🖼️</span>
        <p className="mt-3 text-sm font-medium text-gray-700">Drop an image here or click to browse</p>
        <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP supported · Runs locally in your browser</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500">Compressing…</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {saving > 0 ? `${saving}% smaller` : 'Compressed'}
              </h2>
              <p className="text-xs text-gray-400">{formatBytes(result.originalSize)} → {formatBytes(result.compressedSize)}</p>
            </div>
            <button onClick={download} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
              Download {result.fileName}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
            {[
              { label: 'Original Size', value: formatBytes(result.originalSize) },
              { label: 'Compressed Size', value: formatBytes(result.compressedSize) },
              { label: 'Size Reduction', value: saving > 0 ? `−${saving}%` : `+${Math.abs(saving)}%` },
              { label: 'Output Dimensions', value: `${result.compressedDimensions[0]}×${result.compressedDimensions[1]}px` },
            ].map((s) => (
              <div key={s.label} className="bg-white p-4 text-center">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Original ({result.originalDimensions[0]}×{result.originalDimensions[1]}px)</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.originalUrl} alt="Original" className="w-full rounded-xl border border-gray-200 object-contain" style={{ maxHeight: 300 }} />
            </div>
            <div>
              <p className="mb-2 text-center text-xs font-medium text-indigo-600 uppercase tracking-wider">Compressed ({result.compressedDimensions[0]}×{result.compressedDimensions[1]}px)</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.compressedUrl} alt="Compressed" className="w-full rounded-xl border border-indigo-200 object-contain" style={{ maxHeight: 300 }} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-500">
        🔒 Your images never leave your device. Compression uses the browser Canvas API — no server, no upload, no storage.
      </div>
    </div>
  )
}

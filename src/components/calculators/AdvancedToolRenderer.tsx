'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { AdvancedToolConfig } from '@/lib/advancedTools'

type AdvancedToolRendererProps = {
  config: AdvancedToolConfig
}

type ImageState = {
  fileName: string
  fileSize: number
  dataUrl: string
  width: number
  height: number
}

const mmToPx = (mm: number, dpi: number) => Math.round((mm / 25.4) * dpi)
const inToPx = (inches: number, dpi: number) => Math.round(inches * dpi)
const formatMime = (format: 'jpeg' | 'png' | 'webp') => `image/${format}`
const extensionForFormat = (format: 'jpeg' | 'png' | 'webp') => (format === 'jpeg' ? 'jpg' : format)
const labelForFormat = (format: 'jpeg' | 'png' | 'webp') => format === 'jpeg' ? 'JPG' : format === 'webp' ? 'WebP' : 'PNG'

function labelForFileFormat(value: string) {
  const normalized = value.toLowerCase()
  if (normalized === 'jpg' || normalized === 'jpeg') return 'JPG'
  if (normalized === 'webp') return 'WebP'
  if (normalized === 'png') return 'PNG'
  return value.toUpperCase()
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatRatio(width: number, height: number) {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(width, height)
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`
}

function checkTone(passed: boolean | null) {
  if (passed === true) return 'border-green-100 bg-green-50 text-green-800'
  if (passed === false) return 'border-amber-100 bg-amber-50 text-amber-800'
  return 'border-gray-100 bg-gray-50 text-gray-700'
}

function checkLabel(passed: boolean | null) {
  if (passed === true) return 'Pass'
  if (passed === false) return 'Review'
  return 'Info'
}

function cleanFileBase(filename: string) {
  return filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'freeltools-image'
}

function blobFromCanvas(canvas: HTMLCanvasElement, mime: string, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not create image file.'))
    }, mime, quality)
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function loadImageFile(file: File): Promise<ImageState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read this image.'))
    reader.onload = () => {
      const dataUrl = String(reader.result)
      const img = new Image()
      img.onload = () => resolve({ fileName: file.name, fileSize: file.size, dataUrl, width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => reject(new Error('Could not load this image.'))
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load this image for export.'))
    img.src = dataUrl
  })
}

async function ensureImageReady(image: HTMLImageElement) {
  if (image.complete) {
    if (image.naturalWidth > 0) return
    throw new Error('Could not load this image for export.')
  }

  if (typeof image.decode === 'function') {
    await image.decode()
    if (image.naturalWidth > 0) return
  }

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Could not load this image for export.'))
  })
}

function drawImageToCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
  fit: 'cover' | 'contain',
  zoom: number,
  offsetX: number,
  offsetY: number,
  background = '#ffffff'
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available.')

  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
  }

  const baseScale = fit === 'cover'
    ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
    : Math.min(width / image.naturalWidth, height / image.naturalHeight)
  const scale = baseScale * zoom
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const x = (width - drawWidth) / 2 + offsetX
  const y = (height - drawHeight) / 2 + offsetY
  ctx.drawImage(image, x, y, drawWidth, drawHeight)

  return canvas
}

function useImageLoader() {
  const [image, setImage] = useState<ImageState | null>(null)
  const [error, setError] = useState('')

  async function onFile(file: File | undefined) {
    if (!file) return
    setError('')
    try {
      setImage(await loadImageFile(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this file.')
    }
  }

  return { image, error, onFile }
}

function DocumentPhotoTool({ config }: { config: Extract<AdvancedToolConfig, { kind: 'document-photo' }> }) {
  const { image, error, onFile } = useImageLoader()
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [background, setBackground] = useState('#ffffff')
  const previewRef = useRef<HTMLImageElement | null>(null)
  const outputWidth = mmToPx(config.widthMm, config.dpi)
  const outputHeight = mmToPx(config.heightMm, config.dpi)

  const ratio = `${config.widthMm}:${config.heightMm}`
  const sourceResolutionOk = image ? image.width >= outputWidth && image.height >= outputHeight : null
  const sourceScale = image ? Math.min(image.width / outputWidth, image.height / outputHeight) : null
  const readinessChecks = [
    { label: 'Export size', value: `${outputWidth} x ${outputHeight}px`, passed: true },
    { label: 'Print size', value: `${config.widthMm} x ${config.heightMm}mm at ${config.dpi} DPI`, passed: true },
    {
      label: 'Source resolution',
      value: image ? `${image.width} x ${image.height}px (${sourceScale ? sourceScale.toFixed(1) : '0'}x export)` : 'Upload a photo to check',
      passed: sourceResolutionOk,
    },
    { label: 'Background target', value: config.background, passed: null },
    { label: 'Crop guide', value: config.headSize ?? 'Center face, eyes level, shoulders visible', passed: null },
  ]

  async function renderPhotoCanvas() {
    if (!image || !previewRef.current) throw new Error('Upload a photo first.')
    return drawImageToCanvas(previewRef.current, outputWidth, outputHeight, 'cover', zoom, offsetX, offsetY, background)
  }

  async function downloadPhoto() {
    const canvas = await renderPhotoCanvas()
    const blob = await blobFromCanvas(canvas, 'image/jpeg', 0.92)
    downloadBlob(blob, `${config.documentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${outputWidth}x${outputHeight}.jpg`)
  }

  async function downloadPrintSheet() {
    const photoCanvas = await renderPhotoCanvas()
    const sheet = document.createElement('canvas')
    sheet.width = inToPx(6, config.dpi)
    sheet.height = inToPx(4, config.dpi)
    const ctx = sheet.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, sheet.width, sheet.height)

    const gap = Math.round(config.dpi * 0.08)
    const cols = Math.max(1, Math.floor((sheet.width + gap) / (photoCanvas.width + gap)))
    const rows = Math.max(1, Math.floor((sheet.height + gap) / (photoCanvas.height + gap)))
    const usedWidth = cols * photoCanvas.width + (cols - 1) * gap
    const usedHeight = rows * photoCanvas.height + (rows - 1) * gap
    const startX = Math.floor((sheet.width - usedWidth) / 2)
    const startY = Math.floor((sheet.height - usedHeight) / 2)

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        ctx.drawImage(photoCanvas, startX + col * (photoCanvas.width + gap), startY + row * (photoCanvas.height + gap))
      }
    }

    const blob = await blobFromCanvas(sheet, 'image/jpeg', 0.92)
    downloadBlob(blob, `${config.documentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-4x6-sheet.jpg`)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <label className="block rounded-xl border border-dashed border-brand-200 bg-brand-50 p-5 text-center">
            <span className="block text-sm font-semibold text-gray-900">Upload a clear front-facing photo</span>
            <span className="mt-1 block text-xs text-gray-500">JPG, PNG, or WebP. Processing stays in your browser.</span>
            <input
              type="file"
              accept="image/*"
              className="mt-4 block w-full cursor-pointer rounded-lg border border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium text-gray-700">
              Zoom
              <input className="mt-2 w-full accent-brand-600" type="range" min="0.7" max="2.8" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Move left/right
              <input className="mt-2 w-full accent-brand-600" type="range" min={-outputWidth / 2} max={outputWidth / 2} step="1" value={offsetX} onChange={(event) => setOffsetX(Number(event.target.value))} />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Move up/down
              <input className="mt-2 w-full accent-brand-600" type="range" min={-outputHeight / 2} max={outputHeight / 2} step="1" value={offsetY} onChange={(event) => setOffsetY(Number(event.target.value))} />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Background
              <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-9 w-12 rounded border border-gray-200" />
            </label>
            <button type="button" className="btn-primary" disabled={!image} onClick={downloadPhoto}>Download Photo</button>
            <button type="button" className="btn-secondary" disabled={!image} onClick={downloadPrintSheet}>Download 4x6 Sheet</button>
          </div>

          {image && (
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mx-auto overflow-hidden border border-gray-200 bg-white shadow-sm" style={{ aspectRatio: ratio, maxWidth: 260 }}>
                <div
                  className="relative h-full w-full bg-white"
                  style={{
                    backgroundColor: background,
                    backgroundImage: `url(${image.dataUrl})`,
                    backgroundSize: `${zoom * 100}% auto`,
                    backgroundPosition: `calc(50% + ${offsetX / 8}px) calc(50% + ${offsetY / 8}px)`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="pointer-events-none absolute left-1/2 top-[8%] h-[58%] w-[48%] -translate-x-1/2 rounded-full border-2 border-white/90 shadow-[0_0_0_1px_rgba(15,23,42,0.25)]" />
                  <div className="pointer-events-none absolute inset-x-[18%] top-1/2 border-t border-dashed border-white/90 shadow-[0_1px_0_rgba(15,23,42,0.25)]" />
                  <div className="pointer-events-none absolute inset-x-[16%] bottom-[15%] rounded border border-dashed border-white/80 shadow-[0_0_0_1px_rgba(15,23,42,0.18)]" />
                  <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white">
                    Align face inside guide
                  </span>
                </div>
              </div>
              <img ref={previewRef} src={image.dataUrl} alt="" className="hidden" />
            </div>
          )}
        </div>

        <aside className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Output settings</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div><dt className="text-gray-500">Document</dt><dd className="font-medium text-gray-900">{config.documentName}</dd></div>
            <div><dt className="text-gray-500">Print size</dt><dd className="font-medium text-gray-900">{config.widthMm} x {config.heightMm} mm</dd></div>
            <div><dt className="text-gray-500">Pixel export</dt><dd className="font-medium text-gray-900">{outputWidth} x {outputHeight}px at {config.dpi} DPI</dd></div>
            <div><dt className="text-gray-500">Background</dt><dd className="font-medium text-gray-900">{config.background}</dd></div>
            {config.headSize && <div><dt className="text-gray-500">Head guide</dt><dd className="font-medium text-gray-900">{config.headSize}</dd></div>}
          </dl>
          {config.sourceUrl && (
            <a href={config.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800">
              Check official guidance
            </a>
          )}
          <div className="mt-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Readiness checks</h3>
            {readinessChecks.map((item) => (
              <div key={item.label} className={`rounded-lg border p-3 text-xs ${checkTone(item.passed)}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">{item.label}</span>
                  <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">{checkLabel(item.passed)}</span>
                </div>
                <p className="mt-1 leading-5">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            {config.warning}
          </p>
        </aside>
      </div>
    </div>
  )
}

function ImageResizerTool({ config }: { config: Extract<AdvancedToolConfig, { kind: 'image-resizer' }> }) {
  const { image, error, onFile } = useImageLoader()
  const isConverter = config.presetName.toLowerCase().includes('converter')
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>(config.format)
  const [resizeMode, setResizeMode] = useState<'original' | 'preset' | 'custom'>(isConverter ? 'original' : 'preset')
  const [customWidth, setCustomWidth] = useState(config.targetWidth)
  const [customHeight, setCustomHeight] = useState(config.targetHeight)
  const [quality, setQuality] = useState(0.85)
  const [targetSizeInput, setTargetSizeInput] = useState(config.maxSizeKb ? String(config.maxSizeKb) : '')
  const [fit, setFit] = useState<'cover' | 'contain'>(config.fit)
  const [background, setBackground] = useState<'white' | 'transparent'>('white')
  const [result, setResult] = useState<{
    sizeKb: number
    url: string
    blob: Blob
    width: number
    height: number
    format: 'jpeg' | 'png' | 'webp'
    qualityUsed: number
    fileName: string
  } | null>(null)
  const [resultError, setResultError] = useState('')
  const [generating, setGenerating] = useState(false)
  const previewRef = useRef<HTMLImageElement | null>(null)

  const outputWidth = resizeMode === 'original' && image ? image.width : resizeMode === 'custom' ? Math.max(1, Math.round(customWidth)) : config.targetWidth
  const outputHeight = resizeMode === 'original' && image ? image.height : resizeMode === 'custom' ? Math.max(1, Math.round(customHeight)) : config.targetHeight
  const targetSizeKb = Number(targetSizeInput) > 0 ? Number(targetSizeInput) : null
  const qaDpi = config.dpi ?? 300
  const sourceFormat = image?.fileName.split('.').pop()
  const sourceLabel = sourceFormat ? labelForFileFormat(sourceFormat) : 'Image'
  const outputLabel = labelForFormat(outputFormat)
  const conversionLabel = image ? `${sourceLabel} to ${outputLabel}` : `Image to ${outputLabel}`
  const imageDataUrl = image?.dataUrl
  const imageWidth = image?.width
  const imageHeight = image?.height
  const targetMet = result && targetSizeKb ? result.blob.size <= targetSizeKb * 1024 : null
  const savedPercent = result && image ? ((image.fileSize - result.blob.size) / image.fileSize) * 100 : null
  const outputChecks = [
    {
      label: 'File-size target',
      value: targetSizeKb
        ? result
          ? `${formatBytes(result.blob.size)} of ${targetSizeKb}KB target`
          : `Will try to stay under ${targetSizeKb}KB`
        : 'No KB target set',
      passed: targetSizeKb ? targetMet : null,
    },
    {
      label: 'Dimensions',
      value: `${outputWidth} x ${outputHeight}px (${formatRatio(outputWidth, outputHeight)})`,
      passed: true,
    },
    {
      label: 'Format',
      value: `${outputLabel}${outputFormat === 'jpeg' ? ' with white background' : background === 'transparent' ? ' with transparent background' : ''}`,
      passed: true,
    },
    {
      label: 'Compression change',
      value: savedPercent === null ? 'Convert to calculate savings' : savedPercent >= 0 ? `${savedPercent.toFixed(1)}% smaller than original` : `${Math.abs(savedPercent).toFixed(1)}% larger than original`,
      passed: savedPercent === null ? null : savedPercent >= 0,
    },
    {
      label: 'Print estimate',
      value: `${(outputWidth / qaDpi).toFixed(2)} x ${(outputHeight / qaDpi).toFixed(2)} in at ${qaDpi} DPI`,
      passed: null,
    },
  ]

  useEffect(() => {
    if (imageWidth && imageHeight && isConverter) {
      setCustomWidth(imageWidth)
      setCustomHeight(imageHeight)
    }
  }, [imageDataUrl, imageHeight, imageWidth, isConverter])

  useEffect(() => {
    setResult(null)
    setResultError('')
  }, [background, customHeight, customWidth, fit, imageDataUrl, outputFormat, quality, resizeMode, targetSizeInput])

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url)
    }
  }, [result?.url])

  function updateFile(file: File | undefined) {
    void onFile(file)
  }

  function updateWidth(value: string) {
    const nextWidth = Math.max(1, Math.round(Number(value) || 1))
    setResizeMode('custom')
    setCustomWidth(nextWidth)
    if (image?.width) setCustomHeight(Math.max(1, Math.round((nextWidth * image.height) / image.width)))
  }

  function updateHeight(value: string) {
    const nextHeight = Math.max(1, Math.round(Number(value) || 1))
    setResizeMode('custom')
    setCustomHeight(nextHeight)
    if (image?.height) setCustomWidth(Math.max(1, Math.round((nextHeight * image.width) / image.height)))
  }

  async function exportImage() {
    if (!image || !previewRef.current) return
    setGenerating(true)
    setResultError('')
    try {
      await ensureImageReady(previewRef.current)
      const canvasBackground = outputFormat === 'jpeg' || background === 'white' ? '#ffffff' : 'transparent'
      const canvas = drawImageToCanvas(previewRef.current, outputWidth, outputHeight, fit, 1, 0, 0, canvasBackground)
      let nextQuality = outputFormat === 'png' ? 1 : quality
      let blob = await blobFromCanvas(canvas, formatMime(outputFormat), nextQuality)

      if (targetSizeKb && outputFormat !== 'png') {
        while (blob.size / 1024 > targetSizeKb && nextQuality > 0.35) {
          nextQuality = Math.max(0.35, nextQuality - 0.06)
          blob = await blobFromCanvas(canvas, formatMime(outputFormat), nextQuality)
        }
      }

      const fileName = `${cleanFileBase(image.fileName)}-${outputWidth}x${outputHeight}.${extensionForFormat(outputFormat)}`
      setResult({
        sizeKb: Math.round(blob.size / 1024),
        url: URL.createObjectURL(blob),
        blob,
        width: outputWidth,
        height: outputHeight,
        format: outputFormat,
        qualityUsed: nextQuality,
        fileName,
      })
    } catch (err) {
      setResult(null)
      setResultError(err instanceof Error ? err.message : 'Could not convert this image.')
    } finally {
      setGenerating(false)
    }
  }

  function downloadResult() {
    if (!result) return
    downloadBlob(result.blob, result.fileName)
  }

  async function copyResultSpecs() {
    if (!result) return
    const specs = [
      `File: ${result.fileName}`,
      `Dimensions: ${result.width} x ${result.height}px`,
      `Format: ${labelForFormat(result.format)}`,
      `Size: ${formatBytes(result.blob.size)}`,
      `Quality: ${Math.round(result.qualityUsed * 100)}%`,
      targetSizeKb ? `Target: under ${targetSizeKb}KB ${targetMet ? '(met)' : '(review)'}` : null,
    ].filter(Boolean).join('\n')
    await navigator.clipboard?.writeText(specs).catch(() => undefined)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Image conversion workbench</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">{conversionLabel}</h2>
              <p className="mt-1 text-sm text-gray-500">{image ? `${image.fileName} · ${formatBytes(image.fileSize)}` : 'Convert, resize, compress, and download in your browser.'}</p>
            </div>
            <label className="block text-sm font-semibold text-gray-700 sm:w-44">
              Convert to
              <select className="input mt-2" value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as 'jpeg' | 'png' | 'webp')}>
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </label>
          </div>

          <label
            className="block cursor-pointer rounded-xl border border-dashed border-brand-200 bg-brand-50 p-6 text-center transition hover:border-brand-400 hover:bg-brand-100"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              updateFile(event.dataTransfer.files?.[0])
            }}
          >
            <span className="block text-base font-semibold text-gray-900">{image ? 'Replace image' : 'Choose image file'}</span>
            <span className="mt-1 block text-sm text-gray-500">JPG, PNG, WebP, GIF, or HEIC where your browser supports it. Files stay on this device.</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => updateFile(event.target.files?.[0])}
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">Resize</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={resizeMode === 'original'} onChange={() => setResizeMode('original')} className="accent-brand-600" />
                  Original size
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={resizeMode === 'preset'} onChange={() => setResizeMode('preset')} className="accent-brand-600" />
                  Preset {config.targetWidth} x {config.targetHeight}px
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={resizeMode === 'custom'} onChange={() => setResizeMode('custom')} className="accent-brand-600" />
                  Custom dimensions
                </label>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Width
                  <input className="input mt-1" type="number" min="1" value={outputWidth} disabled={resizeMode !== 'custom'} onChange={(event) => updateWidth(event.target.value)} />
                </label>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Height
                  <input className="input mt-1" type="number" min="1" value={outputHeight} disabled={resizeMode !== 'custom'} onChange={(event) => updateHeight(event.target.value)} />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">Options</h3>
              <label className="mt-3 block text-sm font-medium text-gray-700">
                Fit mode
                <select className="input mt-2" value={fit} onChange={(event) => setFit(event.target.value as 'cover' | 'contain')}>
                  <option value="cover">Crop to fill</option>
                  <option value="contain">Fit inside</option>
                </select>
              </label>
              <label className="mt-3 block text-sm font-medium text-gray-700">
                Background
                <select className="input mt-2" value={background} onChange={(event) => setBackground(event.target.value as 'white' | 'transparent')}>
                  <option value="white">White</option>
                  <option value="transparent">Transparent</option>
                </select>
              </label>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">Compress</h3>
              <label className="mt-3 block text-sm font-medium text-gray-700">
                Quality: {outputFormat === 'png' ? 'Lossless' : `${Math.round(quality * 100)}%`}
                <input className="mt-2 w-full accent-brand-600 disabled:opacity-40" type="range" min="0.35" max="0.98" step="0.01" value={quality} disabled={outputFormat === 'png'} onChange={(event) => setQuality(Number(event.target.value))} />
              </label>
              <label className="mt-3 block text-sm font-medium text-gray-700">
                Target file size KB
                <input className="input mt-2" type="number" min="1" placeholder={config.maxSizeKb ? String(config.maxSizeKb) : 'Optional'} value={targetSizeInput} onChange={(event) => setTargetSizeInput(event.target.value)} />
              </label>
              {outputFormat === 'png' && targetSizeKb && <p className="mt-2 text-xs leading-5 text-amber-700">PNG is exported losslessly, so exact KB targets work best with JPG or WebP.</p>}
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" disabled={!image || generating} onClick={exportImage}>
              {generating ? 'Converting...' : `Convert to ${outputLabel}`}
            </button>
            <button type="button" className="btn-secondary" disabled={!result} onClick={downloadResult}>Download</button>
            {result && <span className="text-sm font-medium text-gray-600">{result.fileName}</span>}
          </div>

          {resultError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{resultError}</p>}

          {image && (
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Original</p>
                  <p className="text-xs text-gray-500">{image.width} x {image.height}px · {formatBytes(image.fileSize)}</p>
                </div>
                <img ref={previewRef} src={image.dataUrl} alt="Uploaded preview" className="max-h-80 w-full rounded-lg bg-white object-contain" />
              </section>

              <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Converted</p>
                  <p className="text-xs text-gray-500">{outputWidth} x {outputHeight}px · {outputLabel}</p>
                </div>
                {result ? (
                  <>
                    <img
                      src={result.url}
                      alt="Converted preview"
                      className="max-h-80 w-full rounded-lg bg-white object-contain"
                      onError={() => setResultError('The converted preview could not be displayed. Try converting again, or download the file.')}
                    />
                    <p className="mt-2 text-xs text-gray-500">{formatBytes(result.blob.size)} · quality {Math.round(result.qualityUsed * 100)}%</p>
                  </>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg bg-white text-sm text-gray-400">Converted preview appears here</div>
                )}
              </section>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Output summary</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div><dt className="text-gray-500">Conversion</dt><dd className="font-medium text-gray-900">{conversionLabel}</dd></div>
              <div><dt className="text-gray-500">Output</dt><dd className="font-medium text-gray-900">{outputWidth} x {outputHeight}px</dd></div>
              <div><dt className="text-gray-500">Format</dt><dd className="font-medium text-gray-900">{outputLabel}</dd></div>
              <div><dt className="text-gray-500">Fit</dt><dd className="font-medium text-gray-900">{fit === 'cover' ? 'Crop to fill' : 'Fit inside'}</dd></div>
              {targetSizeKb && <div><dt className="text-gray-500">Target size</dt><dd className="font-medium text-gray-900">Under {targetSizeKb}KB when possible</dd></div>}
              {config.dpi && <div><dt className="text-gray-500">DPI note</dt><dd className="font-medium text-gray-900">{config.dpi} DPI equivalent</dd></div>}
              {config.note && <div><dt className="text-gray-500">Use case</dt><dd className="font-medium text-gray-900">{config.note}</dd></div>}
            </dl>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-4">
            <h2 className="text-sm font-semibold text-gray-900">Output QA</h2>
            <div className="mt-3 space-y-2">
              {outputChecks.map((item) => (
                <div key={item.label} className={`rounded-lg border p-3 text-xs ${checkTone(item.passed)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold">{item.label}</span>
                    <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">{checkLabel(item.passed)}</span>
                  </div>
                  <p className="mt-1 leading-5">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-brand-100 bg-brand-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Ready file</h2>
            {result ? (
              <div className="mt-3 space-y-3 text-sm">
                <p className="font-medium text-gray-900">{result.fileName}</p>
                <p className="text-gray-600">{result.width} x {result.height}px · {formatBytes(result.blob.size)}</p>
                <button type="button" className="btn-primary w-full justify-center" onClick={downloadResult}>Download converted image</button>
                <button type="button" className="btn-secondary w-full justify-center" onClick={copyResultSpecs}>Copy file specs</button>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-600">Upload an image, set the output, then convert to create a downloadable file.</p>
            )}
            <p className="mt-4 border-t border-brand-100 pt-3 text-xs leading-5 text-brand-800">Private browser-based processing. No account required.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}

function ImageToPdfTool({ config }: { config: Extract<AdvancedToolConfig, { kind: 'image-to-pdf' }> }) {
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function createPdf() {
    if (files.length === 0) return
    setBusy(true)
    setError('')
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: config.orientation, unit: 'pt', format: config.pageSize === '4x6' ? [432, 288] : config.pageSize })
      for (let index = 0; index < files.length; index += 1) {
        if (index > 0) pdf.addPage()
        const loaded = await loadImageFile(files[index])
        const imageElement = await loadImageElement(loaded.dataUrl)
        const canvas = drawImageToCanvas(imageElement, loaded.width, loaded.height, 'contain', 1, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.92)
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 28
        const maxWidth = pageWidth - margin * 2
        const maxHeight = pageHeight - margin * 2
        const scale = Math.min(maxWidth / loaded.width, maxHeight / loaded.height)
        const width = loaded.width * scale
        const height = loaded.height * scale
        const x = (pageWidth - width) / 2
        const y = (pageHeight - height) / 2
        pdf.addImage(imageData, 'JPEG', x, y, width, height)
      }
      pdf.save(`${config.presetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-5">
        <input
          type="file"
          multiple
          accept="image/*"
          className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Files</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{files.length}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Page</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{config.pageSize.toUpperCase()}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Watermark</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">None</p>
          </div>
        </div>
        {files.length > 0 && (
          <ul className="max-h-44 overflow-auto rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600">
            {files.map((file) => <li key={`${file.name}-${file.size}`} className="truncate py-1">{file.name}</li>)}
          </ul>
        )}
        <button type="button" className="btn-primary" disabled={files.length === 0 || busy} onClick={createPdf}>
          {busy ? 'Creating PDF...' : 'Create PDF'}
        </button>
        {config.note && <p className="text-sm text-gray-500">{config.note}</p>}
      </div>
    </div>
  )
}

const templateOutput = (template: Extract<AdvancedToolConfig, { kind: 'text-generator' }>['template'], values: Record<string, string>) => {
  const client = values.client || '[Client Name]'
  const project = values.project || '[Project / Topic]'
  const service = values.service || '[Service]'
  const sender = values.sender || '[Your Name]'
  const amount = values.amount || '[Amount]'

  const templates: Record<typeof template, string> = {
    nda: `Mutual Non-Disclosure Agreement Outline\n\nParties: ${sender} and ${client}\nPurpose: Discussions and work related to ${project}.\n\n1. Confidential Information: Both parties may share business, technical, financial, client, strategy, process, and project information that is not publicly known.\n2. Use Restriction: Confidential information may only be used to evaluate or perform ${service}.\n3. Protection: Each party agrees to use reasonable care to protect confidential information.\n4. Exclusions: Information is not confidential if it is public, already known, independently developed, or received lawfully from a third party.\n5. Term: Confidentiality obligations continue for 2 years after disclosure unless local law or a signed agreement says otherwise.\n\nLegal review recommended before signing.`,
    'contract-clause': `Contract Clause Draft for ${project}\n\nScope: ${sender} will provide ${service} for ${client} as described in the approved proposal or statement of work.\n\nRevisions: The fee includes two reasonable revision rounds. Additional changes, new features, or work outside the agreed scope will be quoted separately.\n\nPayment: ${client} agrees to pay ${amount}. Work may pause if invoices become overdue.\n\nOwnership: Final deliverables transfer after full payment. Working files, templates, and pre-existing materials remain the property of ${sender} unless stated otherwise.`,
    'proposal-follow-up': `Subject: Quick follow-up on ${project}\n\nHi ${client},\n\nI wanted to follow up on the proposal for ${project}. I am happy to answer questions, adjust the scope, or walk through the timeline if that would help.\n\nIf the direction still looks good, the next step is approving the proposal so I can reserve time for ${service}.\n\nBest,\n${sender}`,
    'late-payment': `Subject: Friendly reminder: invoice for ${project}\n\nHi ${client},\n\nI hope you are well. I am following up on the outstanding invoice for ${amount} related to ${project}. It looks like the payment is now past due.\n\nCould you confirm when the payment will be processed? If there is an issue with the invoice details, send it over and I will correct it quickly.\n\nThanks,\n${sender}`,
    'testimonial-request': `Subject: Could I ask for a short testimonial?\n\nHi ${client},\n\nIt was a pleasure working with you on ${project}. If you were happy with the ${service}, would you be open to sending a short testimonial?\n\nA few sentences about the result, the process, and what changed for your business would be perfect.\n\nThanks again,\n${sender}`,
    'offboarding-checklist': `Client Offboarding Checklist for ${project}\n\n- Confirm all final deliverables are approved.\n- Send final files, links, credentials, and documentation.\n- Confirm ownership and usage rights after final payment.\n- Send the final invoice for ${amount}.\n- Ask ${client} for a testimonial or referral.\n- Archive project files and notes.\n- Schedule a check-in or maintenance offer if relevant.`,
    'seo-meta': `${project} | ${service} by ${sender}\n\nGet ${service} for ${project}. Clear process, practical deliverables, and fast turnaround for ${client}.`,
    'case-study': `Case Study Outline: ${project}\n\nClient: ${client}\nService: ${service}\n\n1. Situation: What problem was the client facing?\n2. Constraints: What made it difficult?\n3. Approach: What did ${sender} do differently?\n4. Deliverables: What was shipped?\n5. Results: What changed for the client?\n6. Quote: Add a client testimonial if available.\n7. CTA: Invite similar clients to discuss a project.`,
    'payment-terms': `Payment Terms for ${project}\n\n${client} agrees to pay ${amount} for ${service}. A deposit may be required before work begins. Remaining balances are due according to the invoice schedule. Late payments may pause delivery timelines and may incur late fees if allowed by the signed agreement and local law.`,
    'rate-card': `${sender} Rate Card\n\nService: ${service}\nProject type: ${project}\nStarting price: ${amount}\n\nIncludes:\n- Discovery and planning\n- Core delivery work\n- Two revision rounds\n- Final handoff\n\nNot included:\n- Out-of-scope additions\n- Third-party software costs\n- Rush delivery unless agreed in writing`,
    'guest-post-pitch': `Subject: Useful resource for ${project}\n\nHi ${client},\n\nI found your article or resource while researching ${project}. I noticed it helps readers with ${service}, so I wanted to share one practical angle that could make the piece more useful.\n\nFreelTools has a free resource that helps users act on this topic without signup: ${amount || '[Add the target URL or data point]'}. If you think it fits your readers, I can send a short paragraph, screenshot, or original checklist you can use.\n\nNo pressure either way. I only wanted to suggest it because it adds a useful next step for readers.\n\nBest,\n${sender}`,
    'backlink-qualification': `Backlink Prospect Qualification for ${project}\n\nProspect or site: ${client}\nTarget page: ${amount}\nAsset to pitch: ${service}\nOwner: ${sender}\n\nPass/fail checks:\n- Topical relevance: does the site already cover this audience or problem?\n- Real audience: is there visible traffic, comments, editorial updates, community, or useful content?\n- Link safety: reject paid links, PBNs, auto-generated directories, hacked pages, link exchanges, and fake metrics.\n- Placement fit: is there a resource page, article update, expert quote, data citation, or tool roundup where the asset genuinely helps?\n- Anchor plan: use branded or natural anchors, not repeated exact-match spam.\n- Proof: record the source URL, target URL, outreach angle, and why the link would help readers.\n\nRecommendation: qualify in Ahrefs/SEMrush and manual review before any outreach.`,
    'related-search-plan': `People Also Search Keyword Plan for ${project}\n\nSeed keyword: ${project}\nAudience: ${client}\nPrimary tool/page: ${service}\nTarget URL: ${amount}\nOwner: ${sender}\n\n1. Search the seed keyword in Google.\n2. Scroll to the bottom and copy related searches that match the same user job.\n3. Group related searches by intent: tool, guide, template, comparison, PDF, free, price, or near me.\n4. Decide whether each cluster belongs on the existing page or needs a supporting page.\n5. Add an AI answer box, FAQ, internal links, and schema to the target page.\n6. Log the keyword, target URL, live URL, and next GSC inspection action.\n\nDo not publish thin one-keyword pages when one stronger page can satisfy the whole intent.`,
    'gsc-insights-refresh-plan': 'GSC Insights Refresh Plan for ' + project + '\n\nTop page or query: ' + client + '\nTarget URL: ' + amount + '\nBusiness goal: ' + service + '\nOwner: ' + sender + '\n\nDaily actions:\n1. Open GSC Insights and identify top-click, rising, or declining content.\n2. Match the page to one business action: tool use, signup, lead, download, or contact.\n3. Capture the query/page gap and related searches from Google.\n4. Update the first screen with a direct answer, tool path, or CTA.\n5. Add 4-5 useful visuals, FAQ/schema, and internal links.\n6. Recheck indexability, sitemap coverage, and live layout.\n7. Measure in 7, 14, and 28 days.\n\nDo not refresh only for word count. Refresh when the page can better satisfy intent and business outcome.',
    'backlink-risk-review': 'Backlink Risk Review Checklist for ' + project + '\n\nDomain or prospect: ' + client + '\nTarget URL: ' + amount + '\nEvidence source: ' + service + '\nOwner: ' + sender + '\n\nClassification:\n- Keep: relevant editorial mention, natural anchor, real audience.\n- Monitor: low-value scraper, no pattern, no manual action.\n- Removal request: artificial or brand-risk link with a real contact route.\n- Disavow candidate: severe spam pattern, paid/PBN footprint, hacked source, or manual-action risk.\n\nRequired evidence before escalation:\n1. GSC Links, Ahrefs, or SEMrush evidence.\n2. Manual page review and anchor review.\n3. Pattern check across referring domains.\n4. Risk note and affected target URL.\n5. Owner approval before any disavow upload.\n\nDo not disavow random weak links just because a third-party score looks scary.',
    'answer-box-brief': `AI Overview Answer Box Brief for ${project}\n\nPrimary query: ${project}\nAudience: ${client}\nTarget URL: ${amount}\nOffer or tool path: ${service}\nOwner: ${sender}\n\n1. Direct answer: Write a neutral 2-3 sentence answer that satisfies the query without hype.\n2. Entity tie: Mention the brand, tool, page type, and core task together in natural language.\n3. Proof block: Add a checklist, table, example, or data-drop that makes the answer cite-worthy.\n4. Follow-up questions: Add FAQ items that match People also ask, related searches, and GSC query variants.\n5. Conversion path: Place the closest tool, signup, consultation, or lead action immediately after the answer.\n6. Schema: Use Article, FAQPage, HowTo, SoftwareApplication, Product, or Service schema only when it matches visible content.\n7. QA: Confirm the answer is crawlable text, not hidden in an image or script-only component.\n\nAvoid fake numbers, unsupported best claims, and keyword stuffing.`,
    'indexing-issue-triage': `GSC Indexing Issue Triage Plan for ${project}\n\nIssue or reason: ${project}\nExample URL: ${amount}\nBusiness impact: ${service}\nOwner: ${sender}\nEvidence source: ${client}\n\n1. Classify the URL: intentional redirect, canonical alternate, duplicate, thin page, stale page, blocked page, or important index target.\n2. Check live response: status code, canonical, robots, noindex, redirect chain, sitemap inclusion, and internal links.\n3. Decide action: keep excluded, redirect cleanly, canonicalize, improve content, add internal links, fix 404, or request indexing.\n4. Group by pattern: never fix one URL if the same template or sitemap rule is creating the issue across many pages.\n5. Add business priority: fix signup, tool, service, money, and top-click pages before low-value archive URLs.\n6. Validate: live check the final URL, update sitemap, inspect in GSC, and note the validation date.\n\nDo not force-index redirect URLs or low-value duplicates. Fix the intended canonical page instead.`,
    'content-gap-brief': `Content Gap Brief for ${project}\n\nPrimary keyword: ${project}\nAudience: ${client}\nMain offer/tool: ${service}\nTarget URL or reference: ${amount}\n\n1. Search intent: What does the searcher need to finish today?\n2. Competitor angle: Which competing pages answer the query, and what do they miss?\n3. AI answer box: Write a direct 2-3 sentence answer near the top.\n4. Required sections: definition, checklist, decision table, examples, mistakes, FAQ, and next tool.\n5. Internal links: Link to the closest FreelTools calculator, checker, or generator.\n6. Authority hook: Add a reusable stat, checklist, or template worth citing.\n7. QA: Confirm title, meta description, canonical, schema, sitemap, mobile layout, and live URL.\n\nPrepared by ${sender}.`,
  }

  return templates[template]
}

function TextGeneratorTool({ config }: { config: Extract<AdvancedToolConfig, { kind: 'text-generator' }> }) {
  const [values, setValues] = useState({ sender: '', client: '', project: '', service: '', amount: '' })
  const output = useMemo(() => templateOutput(config.template, values), [config.template, values])

  function updateField(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function copyOutput() {
    navigator.clipboard.writeText(output)
  }

  function downloadOutput() {
    downloadBlob(new Blob([output], { type: 'text/plain' }), `${config.resultLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          {[
            ['sender', 'Your name / business'],
            ['client', 'Client name'],
            ['project', 'Project or topic'],
            ['service', 'Service'],
            ['amount', 'Amount or price'],
          ].map(([field, label]) => (
            <label key={field} className="block text-sm font-medium text-gray-700">
              {label}
              <input className="input mt-1" value={values[field as keyof typeof values]} onChange={(event) => updateField(field as keyof typeof values, event.target.value)} />
            </label>
          ))}
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={copyOutput}>Copy</button>
            <button type="button" className="btn-secondary" onClick={downloadOutput}>Download TXT</button>
          </div>
        </div>
        <textarea className="min-h-[420px] rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-6 text-gray-800" value={output} onChange={() => undefined} />
      </div>
      {config.note && <p className="mt-4 text-sm text-gray-500">{config.note}</p>}
    </div>
  )
}

export default function AdvancedToolRenderer({ config }: AdvancedToolRendererProps) {
  if (config.kind === 'document-photo') return <DocumentPhotoTool config={config} />
  if (config.kind === 'image-resizer') return <ImageResizerTool config={config} />
  if (config.kind === 'image-to-pdf') return <ImageToPdfTool config={config} />
  return <TextGeneratorTool config={config} />
}

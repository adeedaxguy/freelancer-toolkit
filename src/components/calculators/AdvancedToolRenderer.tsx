'use client'

/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, useState } from 'react'
import type { AdvancedToolConfig } from '@/lib/advancedTools'

type AdvancedToolRendererProps = {
  config: AdvancedToolConfig
}

type ImageState = {
  fileName: string
  dataUrl: string
  width: number
  height: number
}

const mmToPx = (mm: number, dpi: number) => Math.round((mm / 25.4) * dpi)
const inToPx = (inches: number, dpi: number) => Math.round(inches * dpi)
const formatMime = (format: 'jpeg' | 'png' | 'webp') => `image/${format}`

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
      img.onload = () => resolve({ fileName: file.name, dataUrl, width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => reject(new Error('Could not load this image.'))
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
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

  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)

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
                  className="h-full w-full bg-white"
                  style={{
                    backgroundColor: background,
                    backgroundImage: `url(${image.dataUrl})`,
                    backgroundSize: `${zoom * 100}% auto`,
                    backgroundPosition: `calc(50% + ${offsetX / 8}px) calc(50% + ${offsetY / 8}px)`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
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
  const [quality, setQuality] = useState(0.85)
  const [fit, setFit] = useState<'cover' | 'contain'>(config.fit)
  const [result, setResult] = useState<{ sizeKb: number; url: string; blob: Blob } | null>(null)
  const previewRef = useRef<HTMLImageElement | null>(null)

  async function exportImage() {
    if (!previewRef.current) return
    const canvas = drawImageToCanvas(previewRef.current, config.targetWidth, config.targetHeight, fit, 1, 0, 0)
    let nextQuality = quality
    let blob = await blobFromCanvas(canvas, formatMime(config.format), nextQuality)
    if (config.maxSizeKb && config.format === 'jpeg') {
      while (blob.size / 1024 > config.maxSizeKb && nextQuality > 0.35) {
        nextQuality -= 0.08
        blob = await blobFromCanvas(canvas, formatMime(config.format), nextQuality)
      }
    }
    setResult({ sizeKb: Math.round(blob.size / 1024), url: URL.createObjectURL(blob), blob })
  }

  function downloadResult() {
    if (!result) return
    const ext = config.format === 'jpeg' ? 'jpg' : config.format
    downloadBlob(result.blob, `${config.presetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${ext}`)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <input
            type="file"
            accept="image/*"
            className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-sm text-gray-600 file:mr-3 file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Quality: {Math.round(quality * 100)}%
              <input className="mt-2 w-full accent-brand-600" type="range" min="0.35" max="0.98" step="0.01" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Fit mode
              <select className="input mt-2" value={fit} onChange={(event) => setFit(event.target.value as 'cover' | 'contain')}>
                <option value="cover">Crop to fill</option>
                <option value="contain">Fit inside</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" disabled={!image} onClick={exportImage}>Generate Image</button>
            <button type="button" className="btn-secondary" disabled={!result} onClick={downloadResult}>Download</button>
          </div>
          {image && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Original</p>
                <img ref={previewRef} src={image.dataUrl} alt="Uploaded preview" className="max-h-72 w-full rounded-lg object-contain" />
                <p className="mt-2 text-xs text-gray-500">{image.width} x {image.height}px</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Generated</p>
                {result ? (
                  <>
                    <img src={result.url} alt="Generated preview" className="max-h-72 w-full rounded-lg object-contain" />
                    <p className="mt-2 text-xs text-gray-500">{config.targetWidth} x {config.targetHeight}px · {result.sizeKb}KB</p>
                  </>
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-lg bg-white text-sm text-gray-400">Generate to preview</div>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Preset</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div><dt className="text-gray-500">Output</dt><dd className="font-medium text-gray-900">{config.targetWidth} x {config.targetHeight}px</dd></div>
            <div><dt className="text-gray-500">Format</dt><dd className="font-medium text-gray-900">{config.format.toUpperCase()}</dd></div>
            {config.maxSizeKb && <div><dt className="text-gray-500">Target size</dt><dd className="font-medium text-gray-900">Under {config.maxSizeKb}KB when possible</dd></div>}
            {config.dpi && <div><dt className="text-gray-500">DPI note</dt><dd className="font-medium text-gray-900">{config.dpi} DPI equivalent</dd></div>}
            {config.note && <div><dt className="text-gray-500">Use case</dt><dd className="font-medium text-gray-900">{config.note}</dd></div>}
          </dl>
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
        const format = files[index].type.includes('png') ? 'PNG' : 'JPEG'
        pdf.addImage(loaded.dataUrl, format, x, y, width, height)
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

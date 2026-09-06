'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const LOAD_DELAY_MS = 15000

function appendScript(src: string, attributes: Record<string, string> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return

  const script = document.createElement('script')
  script.src = src
  script.async = true
  Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, value))
  document.head.appendChild(script)
}

export default function DeferredTracking() {
  useEffect(() => {
    let loaded = false
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchstart', 'keydown', 'scroll']

    const load = () => {
      if (loaded) return
      loaded = true
      events.forEach((eventName) => window.removeEventListener(eventName, load))
      window.clearTimeout(timer)

      appendScript('https://clickiocmp.com/t/consent_249850.js')
      appendScript('https://s.clickiocdn.com/t/249850/di.js')
      appendScript('https://s.clickiocdn.com/t/249850_wv.js', { 'data-cfasync': 'false' })

      window.dataLayer = window.dataLayer || []
      window.gtag = window.gtag || function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', 'G-ZC1CQELSW4')
      appendScript('https://www.googletagmanager.com/gtag/js?id=G-ZC1CQELSW4')
    }

    events.forEach((eventName) => window.addEventListener(eventName, load, { once: true, passive: true }))
    const timer = window.setTimeout(load, LOAD_DELAY_MS)

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, load))
      window.clearTimeout(timer)
    }
  }, [])

  return null
}

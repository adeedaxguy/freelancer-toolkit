import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedToolsPage, { type PageKey } from '@/components/LocalizedToolsPage'
import { alternates, isLocale, localizedPath, locales, pilotPaths, type PilotPath } from '@/lib/i18n'

type Props = { params: Promise<{ locale: string; slug?: string[] }> }
const keys: Record<PilotPath, PageKey> = { '': 'home', '/tools/fiverr-fee-calculator': 'fiverr', '/tools/upwork-fee-calculator': 'upwork' }
function resolve(value: { locale: string; slug?: string[] }) {
  if (!isLocale(value.locale)) return null
  const path = value.slug?.length ? `/${value.slug.join('/')}` : ''
  if (!pilotPaths.includes(path as PilotPath)) return null
  return { locale: value.locale, path: path as PilotPath, pageKey: keys[path as PilotPath] }
}
export function generateStaticParams() { return locales.flatMap(locale => pilotPaths.map(path => ({ locale, slug: path ? path.slice(1).split('/') : [] }))) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const value = resolve(await params); if (!value) return {}
  const names = { es: { home: 'Herramientas gratis para freelancers', fiverr: 'Calculadora de comisiones Fiverr', upwork: 'Calculadora de comisiones Upwork' }, fr: { home: 'Outils gratuits pour freelances', fiverr: 'Calculateur de frais Fiverr', upwork: 'Calculateur de frais Upwork' }, it: { home: 'Strumenti gratuiti per freelance', fiverr: 'Calcolatore commissioni Fiverr', upwork: 'Calcolatore commissioni Upwork' } } as const
  const title = names[value.locale][value.pageKey]
  const canonical = `https://freeltools.com${localizedPath(value.locale, value.path)}`
  return { title: { absolute: `${title} | FreelancerToolkit` }, description: `${title}. Free, browser-first calculator with no account required.`, alternates: { canonical, languages: alternates(value.path) }, openGraph: { title, description: title, url: canonical, siteName: 'FreelancerToolkit', type: 'website' }, robots: { index: true, follow: true } }
}
export default async function LocalizedRoute({ params }: Props) {
  const value = resolve(await params)
  if (!value) notFound()
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(value.locale)}` }} />
      <LocalizedToolsPage locale={value.locale} pageKey={value.pageKey}/>
    </>
  )
}

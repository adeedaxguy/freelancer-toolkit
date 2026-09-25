export const locales = ['es', 'fr', 'it'] as const
export type Locale = (typeof locales)[number]
export const pilotPaths = ['', '/tools/fiverr-fee-calculator', '/tools/upwork-fee-calculator'] as const
export type PilotPath = (typeof pilotPaths)[number]
export const localeNames = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano' } as const

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale)
export function localizedPath(locale: 'en' | Locale, path: string) {
  const normalized = path === '/' ? '' : path.replace(/\/$/, '')
  return locale === 'en' ? normalized || '/' : `/${locale}${normalized}`
}
export function alternates(path: PilotPath) {
  const base = 'https://freeltools.com'
  return Object.fromEntries((['en', ...locales] as const).map(locale => [locale, `${base}${localizedPath(locale, path)}`]).concat([['x-default', `${base}${localizedPath('en', path)}`]]))
}
export function equivalent(pathname: string, locale: 'en' | Locale) {
  const bare = pathname.replace(/^\/(es|fr|it)(?=\/|$)/, '') || '/'
  const path = bare === '/' ? '' : bare.replace(/\/$/, '')
  return localizedPath(locale, pilotPaths.includes(path as PilotPath) ? path : '')
}

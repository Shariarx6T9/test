import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './lib/i18n/navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const activeLocale = locales.includes(requested as (typeof locales)[number])
    ? (requested as (typeof locales)[number])
    : defaultLocale // 'bn'

  let messages
  try {
    messages = (await import(`./lib/i18n/${activeLocale}.json`)).default
  } catch {
    messages = (await import('./lib/i18n/bn.json')).default
  }

  return { locale: activeLocale, messages }
})

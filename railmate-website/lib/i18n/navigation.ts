import { createNavigation } from 'next-intl/navigation'

export const locales = ['bn', 'en'] as const
export type Locale = (typeof locales)[number]

/**
 * Bengali is the default locale — no URL prefix.
 *   /           → Bengali (majority BD audience)
 *   /en/...     → English
 *
 * This keeps root URLs clean for the target audience and lets Google index
 * Bengali content at canonical root paths.
 */
export const defaultLocale: Locale = 'bn'

/**
 * 'as-needed': the default locale (bn) gets no prefix.
 * Non-default locales (en) get their prefix (/en/).
 */
export const localePrefix = 'as-needed' as const

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
  defaultLocale,
})

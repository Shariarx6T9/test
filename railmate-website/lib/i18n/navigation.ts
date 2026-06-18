import { createNavigation } from 'next-intl/navigation'

export const locales = ['bn', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'bn'

// 'always' — every locale gets a prefix (/bn/, /en/).
// Middleware redirects / → /bn/ automatically, so users land in Bengali.
export const localePrefix = 'always' as const

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
  defaultLocale,
})

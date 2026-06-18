import { MetadataRoute } from 'next'
import { TOP_ROUTES }    from '@/lib/train-search'

/**
 * URL structure after localePrefix 'as-needed' with defaultLocale 'bn':
 *   /           → Bengali homepage
 *   /en/        → English homepage
 *   /search     → Bengali search
 *   /en/search  → English search
 *   /train/...  → Bengali route page (no prefix)
 *   /en/train/  → English route page
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bhairail.vercel.app').replace(/\/$/, '')

  const staticPaths = [
    '',
    '/features',
    '/about',
    '/download',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/copyright',
    '/search',
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    // Bengali version at root (no /bn/ prefix)
    entries.push({
      url:             `${siteUrl}${path}`,
      lastModified:    new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority:        path === '' ? 1.0 : 0.7,
    })
    // English version at /en/
    entries.push({
      url:             `${siteUrl}/en${path}`,
      lastModified:    new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority:        path === '' ? 0.8 : 0.6,
    })
  }

  // Train route pages — Bengali at root, English at /en/train/
  for (const { fromCode, toCode } of TOP_ROUTES) {
    const slug = `${fromCode.toLowerCase()}-to-${toCode.toLowerCase()}`
    entries.push({
      url:             `${siteUrl}/train/${slug}`,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        0.9,
    })
    entries.push({
      url:             `${siteUrl}/en/train/${slug}`,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        0.8,
    })
  }

  return entries
}

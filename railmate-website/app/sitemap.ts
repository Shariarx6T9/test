import { MetadataRoute } from 'next'
import { TOP_ROUTES }    from '@/lib/train-search'

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
    entries.push({
      url:             `${siteUrl}/bn${path}`,
      lastModified:    new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority:        path === '' ? 1.0 : 0.7,
    })
    entries.push({
      url:             `${siteUrl}/en${path}`,
      lastModified:    new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority:        path === '' ? 0.8 : 0.6,
    })
  }

  for (const { fromCode, toCode } of TOP_ROUTES) {
    const slug = `${fromCode.toLowerCase()}-to-${toCode.toLowerCase()}`
    entries.push({ url: `${siteUrl}/bn/train/${slug}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 })
    entries.push({ url: `${siteUrl}/en/train/${slug}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 })
  }

  return entries
}

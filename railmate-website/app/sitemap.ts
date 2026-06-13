import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/navigation'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://railmatebd.com';

  const pages = [
    '',
    '/features',
    '/about',
    '/download',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/copyright'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    pages.forEach(page => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
      });
    });
  });

  return sitemapEntries;
}

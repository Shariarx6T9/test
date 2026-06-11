import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://railmatebd.com";

export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const imageUrl = `${BASE_URL}/logo.png`; // Fallback to logo.png since og-image.png is missing

  return {
    title: `${title} | RailMate Bangladesh`,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: `${BASE_URL}${path}` },
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: `${title} | RailMate Bangladesh`,
      description,
      url: `${BASE_URL}${path}`,
      siteName: "RailMate Bangladesh",
      type: "website",
      locale: "en_BD",
      images: [{ url: imageUrl, width: 512, height: 512 }],
    },
    twitter: {
      card: "summary",
      title: `${title} | RailMate Bangladesh`,
      description,
      images: [imageUrl],
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.png',
      apple: '/logo.png',
    }
  };
}

import type { Metadata } from "next";

const BASE_URL = "https://www.railmatebd.com";

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
  const imageUrl = `${BASE_URL}/og-image.png`;

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
      locale: "en_US",
      images: [
        { 
          url: imageUrl, 
          width: 1200, 
          height: 630,
          alt: "RailMate Bangladesh"
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
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

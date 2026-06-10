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
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | RailMate Bangladesh`,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { 
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires 'unsafe-eval' and 'unsafe-inline' for dev
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://via.placeholder.com", // Allow placeholder images
            "font-src 'self'",
            "connect-src 'self' https:", // Allow API calls to other domains
            "form-action 'self'",
            "frame-ancestors 'none'", // Equivalent to X-Frame-Options: DENY
          ].join("; ")
        },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);

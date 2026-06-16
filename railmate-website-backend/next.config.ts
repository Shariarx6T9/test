// ============================================================
// RailMate Bangladesh – Next.js Configuration
//
// Fix: @supabase/ssr's createBrowserClient pulls in
// @supabase/supabase-js which uses process.version — a Node.js
// API unavailable in Edge Runtime (middleware).
//
// Solution: alias the full @supabase/ssr barrel to the
// server-only entry point when bundling for Edge, which
// excludes createBrowserClient and its Node.js dependency chain.
// ============================================================
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ── Server-side packages that must not be bundled ─────────
  // Keeps @supabase/supabase-js as a Node.js external in API
  // routes and Server Components (Node runtime only).
  serverExternalPackages: ["@supabase/supabase-js"],

  // ── Webpack customisation ─────────────────────────────────
  webpack(config, { nextRuntime }) {
    if (nextRuntime === "edge") {
      // When bundling the Edge Runtime (middleware), alias the
      // full @supabase/ssr barrel to the server-only module so
      // createBrowserClient — and its Node.js dependency on
      // process.version — is never included in the Edge bundle.
      config.resolve.alias = {
        ...config.resolve.alias,
        "@supabase/ssr": path.resolve(
          "./node_modules/@supabase/ssr/dist/module/createServerClient.js"
        ),
      };
    }
    return config;
  },
};

export default nextConfig;

// ============================================================
// RailMate Bangladesh – Next.js Configuration
//
// Fix 1 (Edge Runtime warning):
//   @supabase/ssr's createServerClient.js imports
//   @supabase/supabase-js which uses process.version — a Node.js
//   API unavailable in Edge Runtime. The SSR package is designed
//   to run correctly in Edge despite this static analysis warning.
//   We suppress it via webpack ignoreWarnings so the warning
//   doesn't surface in Vercel build output.
// ============================================================
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent @supabase/supabase-js from being bundled into
  // the Node.js server bundle (API routes, Server Components).
  serverExternalPackages: ["@supabase/supabase-js"],

  webpack(config, { nextRuntime }) {
    if (nextRuntime === "edge") {
      // Suppress the "Node.js API used in Edge Runtime" warning
      // for @supabase/supabase-js. The warning is a static analysis
      // false positive — createServerClient is built for Edge and
      // never exercises the process.version code path at runtime.
      config.ignoreWarnings = [
        ...(config.ignoreWarnings ?? []),
        {
          module: /node_modules\/@supabase\/supabase-js/,
          message: /process\.version/,
        },
      ];
    }
    return config;
  },
};

export default nextConfig;

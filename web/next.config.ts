import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No cacheComponents: on Cloudflare its pages are never refreshed.
  // The site's addresses are /privacy/ and /attribution/.
  trailingSlash: true,
  poweredByHeader: false,
  turbopack: { root: path.join(__dirname) },
  // The same headers public/_headers gives the static site.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // The test address is not for search engines.
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.workers\\.dev" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/app/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;

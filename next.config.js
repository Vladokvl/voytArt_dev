/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { env } from "./src/env.js";
import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import("next").NextConfig} */
const config = {
  allowedDevOrigins: ["testing.zhovtok.work"],
  output: "standalone",
  compress: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "gsap",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-slot",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/pm",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Базові security-заголовки для всіх маршрутів
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' res.cloudinary.com images.unsplash.com data: blob:; media-src 'self' res.cloudinary.com data: blob:; font-src 'self' data:; connect-src 'self' ipwho.is https://res.cloudinary.com; frame-ancestors 'none';",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};


// Аналіз розміру бандла: ANALYZE=true npm run build
const wrappedConfig =
  process.env.ANALYZE === "true"
    ? withBundleAnalyzer({ enabled: true })(config)
    : config;

export default wrappedConfig;

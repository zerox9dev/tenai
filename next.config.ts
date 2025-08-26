import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = bundleAnalyzer({
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@tanstack/react-query", "framer-motion"],
    // Оптимизации производительности  
    scrollRestoration: true,
  },
  // Компрессия и минификация
  compress: true,
  poweredByHeader: false,
  // Оптимизация бандла (убрали @phosphor-icons/react - ломает импорты)
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
  serverExternalPackages: ["shiki", "vscode-oniguruma"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Автоматическая оптимизация изображений
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

})

export default nextConfig

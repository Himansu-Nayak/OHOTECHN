import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* High-performance production configuration */
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 100],
  },
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;

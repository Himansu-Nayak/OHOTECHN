import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 100],
  },
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap', 'lenis'],
  },
};

export default nextConfig;

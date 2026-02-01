import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization for pages that use client-side only features
  experimental: {
    // This allows client components with hooks to work properly
  }
};

export default nextConfig;

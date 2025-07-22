import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@/components", "@/lib"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

export default nextConfig;

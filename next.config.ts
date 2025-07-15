import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}
 
export default nextConfig;

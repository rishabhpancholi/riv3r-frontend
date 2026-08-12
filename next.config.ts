import type { NextConfig } from "next";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

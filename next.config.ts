import type { NextConfig } from "next";

const BACKEND_API_URL = (
  process.env.BACKEND_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");
const PUBLIC_API_PATH = `/${(
  process.env.NEXT_PUBLIC_API_URL ?? "/api"
).replace(/^\/+|\/+$/g, "")}`;

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: `${PUBLIC_API_PATH}/:path*`,
        destination: `${BACKEND_API_URL}${PUBLIC_API_PATH}/:path*`,
      },
    ];
  },
};

export default nextConfig;

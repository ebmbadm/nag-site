import type { NextConfig } from "next";
import { tildaRedirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle for the Timeweb Docker image (.next/standalone/server.js).
  output: "standalone",
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return tildaRedirects;
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import { tildaRedirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return tildaRedirects;
  },
};

export default nextConfig;

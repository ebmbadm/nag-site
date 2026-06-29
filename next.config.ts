import type { NextConfig } from "next";

// GitHub Pages serves a project site under /<repo>. The deploy workflow sets
// PAGES_BASE_PATH=/nag-site; it stays empty for local dev and any root-domain
// (custom-domain) deploy, so links/assets resolve correctly in both cases.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static HTML export — GitHub Pages has no Node server at runtime.
  output: "export",
  basePath,
  // Emit /route/index.html so Pages can serve clean directory URLs.
  trailingSlash: true,
  // Pin the workspace root — a stray lockfile in the home dir otherwise misleads inference.
  turbopack: {
    root: import.meta.dirname,
  },
  // Static export can't run next/image optimization. A custom loader ships plain
  // <img> tags AND prepends basePath to public-folder src (which next/image
  // otherwise leaves unprefixed → 404 on a project Pages site). See image-loader.ts.
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;

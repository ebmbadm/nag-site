// Custom next/image loader for static export on GitHub Pages.
// next/image does NOT prepend basePath to string `src`, so public-folder images
// (e.g. "/products/d-8000/x.jpg") would 404 under a project site served at
// /<repo>. This loader prepends PAGES_BASE_PATH so they resolve. Empty base
// (local dev / custom root domain) returns the src unchanged.
const basePath = process.env.PAGES_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string; width: number; quality?: number }): string {
  // Leave already-absolute (http/https/data) sources untouched.
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  return `${basePath}${src}`;
}

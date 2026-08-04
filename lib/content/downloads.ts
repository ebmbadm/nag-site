import fs from "node:fs";
import path from "node:path";
import { getProduct, getProductSlugs } from "./products";

export interface DownloadLink {
  label: string;
  href: string;
  /** "PDF" / "ZIP" / … — from the extension of a local file. */
  ext?: string;
  /** "4,8 МБ" — only for files served from /public. */
  size?: string;
}

export interface DownloadGroup {
  slug: string;
  name: string;
  category: string;
  links: DownloadLink[];
}

const mb = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

/** Attach extension + on-disk size to a docs entry. External URLs get neither. */
export function describeDownload(doc: { label: string; href: string }): DownloadLink {
  if (!doc.href.startsWith("/")) return doc;
  const ext = path.extname(doc.href).replace(".", "").toUpperCase() || undefined;
  let size: string | undefined;
  try {
    const bytes = fs.statSync(path.join(process.cwd(), "public", doc.href)).size;
    size =
      bytes >= 1024 * 1024
        ? `${mb.format(bytes / 1024 / 1024)} МБ`
        : `${Math.round(bytes / 1024)} КБ`;
  } catch {
    // Missing file — render the link without a size rather than failing the build.
  }
  return { ...doc, ext, size };
}

/** Every product that has downloads, for the /zagruzki page. */
export function getDownloadGroups(): DownloadGroup[] {
  return getProductSlugs()
    .map((slug) => getProduct(slug).frontmatter)
    .filter((p) => p.docs && p.docs.length > 0)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      links: p.docs!.map(describeDownload),
    }))
    .sort((a, b) => a.category.localeCompare(b.category, "ru") || a.name.localeCompare(b.name, "ru"));
}

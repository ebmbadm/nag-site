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

/**
 * Discontinued equipment whose product page was retired. The files stayed in /public and
 * were linked from nowhere, while /catalog/arhiv told visitors to look for them here.
 * Listed under the archive hub so the claim on that page is true.
 */
const RETIRED_DOCS: Omit<DownloadGroup, "links"> & { docs: { label: string; href: string }[] } = {
  slug: "arhiv",
  name: "AMP By NAG CX · NAG TDX",
  category: "Архив",
  docs: [
    { label: "AMP By NAG CX — руководство пользователя", href: "/downloads/amp-by-nag-cx-manual-ru.pdf" },
    { label: "NAG TDX — DSP Control ADF v3.3.8", href: "/downloads/nag-tdx-dsp-control-adf-v3.3.8.zip" },
  ],
};

/** Every product that has downloads, for the /zagruzki page. */
export function getDownloadGroups(): DownloadGroup[] {
  const fromProducts = getProductSlugs()
    .map((slug) => getProduct(slug).frontmatter)
    .filter((p) => p.docs && p.docs.length > 0)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      links: p.docs!.map(describeDownload),
    }))
    .sort((a, b) => a.category.localeCompare(b.category, "ru") || a.name.localeCompare(b.name, "ru"));

  // Archive last, after the live catalogue.
  const { docs, ...group } = RETIRED_DOCS;
  return [...fromProducts, { ...group, links: docs.map(describeDownload) }];
}

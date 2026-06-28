import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { productFrontmatterSchema, type ProductFrontmatter } from "./schema";

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");

export interface ProductDoc {
  frontmatter: ProductFrontmatter;
  body: string; // raw MDX (description prose)
}

function fileForSlug(slug: string) {
  return path.join(PRODUCTS_DIR, `${slug}.mdx`);
}

/** All product slugs (filenames without extension). */
export function getProductSlugs(): string[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Load + validate one product. Throws (fails the build) on invalid frontmatter. */
export function getProduct(slug: string): ProductDoc {
  const raw = fs.readFileSync(fileForSlug(slug), "utf8");
  const { data, content } = matter(raw);
  const parsed = productFrontmatterSchema.safeParse({ slug, ...data });
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/products/${slug}.mdx:\n${JSON.stringify(
        parsed.error.flatten(),
        null,
        2,
      )}`,
    );
  }
  return { frontmatter: parsed.data, body: content };
}

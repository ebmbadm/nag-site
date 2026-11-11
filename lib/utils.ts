import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * The site type scale (text-site-display … text-site-caption) is a font-size, not a colour.
 * Without this tailwind-merge files it with text-ink and drops one of the two.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["site-display", "site-section", "site-title", "site-lead", "site-body", "site-small", "site-caption"] }],
    },
  },
});

/** Merge Tailwind classes safely (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

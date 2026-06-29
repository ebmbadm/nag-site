import { boutique, savers, converters } from "@/content/boutique/boutique";
import type { BoutiquePage } from "./types";

/** Boutique landing content. */
export function getBoutique(): BoutiquePage {
  return boutique;
}

/** Savers page content. */
export function getSavers(): BoutiquePage {
  return savers;
}

/** Converters page content. */
export function getConverters(): BoutiquePage {
  return converters;
}

import { z } from "zod";

const media = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const productFrontmatterSchema = z.object({
  slug: z.string(),
  name: z.string(),
  line: z.string(),
  subtitle: z.string().optional(),
  badges: z.array(z.string()).default([]),
  archived: z.boolean().default(false),
  category: z.string(),
  breadcrumb: z
    .array(z.object({ label: z.string(), href: z.string().optional() }))
    .default([]),

  // §6.1 — price optional, onRequest variant
  price: z
    .object({
      amount: z.number().optional(),
      currency: z.string().default("₽"),
      onRequest: z.boolean().optional(),
      note: z.string().optional(),
    })
    .optional(),

  // §6.2 — partner logo strip
  partnerLogos: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        width: z.number(),
        height: z.number(),
      }),
    )
    .optional(),

  summary: z.string(),
  specChips: z.array(z.string()).default([]),
  gallery: z.array(media).min(1),

  // §6.4 — multi-model series pages
  models: z
    .array(
      z.object({
        name: z.string(),
        config: z.string().optional(),
        price: z.number().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),

  // §6.5 — download links (software / manuals): local /downloads/… or external URL
  docs: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().refine((h) => h.startsWith("/") || URL.canParse(h), {
          message: "href must be an absolute URL or a site-root path (/downloads/…)",
        }),
      }),
    )
    .optional(),

  // §6 — N-column comparison table for series pages
  specMatrix: z
    .object({
      columns: z.array(z.string()),
      rows: z.array(
        z.object({
          label: z.string(),
          values: z.array(z.string().nullable()),
        }),
      ),
      caption: z.string().optional(),
    })
    .optional(),

  features: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      cards: z.array(
        z.object({
          icon: z.string().optional(),
          title: z.string(),
          text: z.string(),
        }),
      ),
    })
    .optional(),
  tech: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      lede: z.string().optional(),
      cards: z.array(
        z.object({ label: z.string(), chip: z.string(), text: z.string() }),
      ),
      image: media.optional(),
    })
    .optional(),
  software: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      lede: z.string().optional(),
      hero: media,
      items: z.array(
        media.extend({ title: z.string(), text: z.string().optional() }),
      ),
    })
    .optional(),
  specGroups: z.array(
    z.object({
      title: z.string(),
      defaultOpen: z.boolean().optional(),
      rows: z.array(z.object({ label: z.string(), value: z.string() })),
    }),
  ),
})
  // A discontinued model has no purchasable price. Leaving one in frontmatter leaks it
  // into the meta description and the archive card while the page itself hides the price
  // and the buy CTA — the snippet then promises what the landing page refuses to show.
  .refine((p) => !(p.archived && (typeof p.price?.amount === "number" || p.price?.onRequest)), {
    message: "archived product must not carry a price (amount or onRequest)",
    path: ["price"],
  });

export type ProductFrontmatter = z.infer<typeof productFrontmatterSchema>;

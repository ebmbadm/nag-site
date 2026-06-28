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

  // §6.5 — download links (software / manuals)
  docs: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
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
});

export type ProductFrontmatter = z.infer<typeof productFrontmatterSchema>;

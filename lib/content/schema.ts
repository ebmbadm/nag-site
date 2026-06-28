import { z } from "zod";

/* ============================================================
   Product frontmatter schema (MDX + frontmatter pattern).
   Frontmatter carries structured data; MDX body carries the
   long description prose.
   ============================================================ */

const media = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const productFrontmatterSchema = z.object({
  slug: z.string(),
  name: z.string(),
  line: z.string(), // eyebrow, e.g. "DSP Processor · NAG Pro Audio"
  subtitle: z.string().optional(),
  badges: z.array(z.string()).default([]),
  category: z.string(), // e.g. "Процессоры"
  breadcrumb: z.array(z.object({ label: z.string(), href: z.string().optional() })).default([]),
  price: z.object({
    amount: z.number(),
    currency: z.string().default("₽"),
    note: z.string().optional(),
  }),
  summary: z.string(), // hero description paragraph
  specChips: z.array(z.string()).default([]),
  gallery: z.array(media).min(1),
  features: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      cards: z.array(z.object({ icon: z.string().optional(), title: z.string(), text: z.string() })),
    })
    .optional(),
  tech: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      lede: z.string().optional(),
      cards: z.array(z.object({ label: z.string(), chip: z.string(), text: z.string() })),
      image: media.optional(),
    })
    .optional(),
  software: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      lede: z.string().optional(),
      hero: media,
      items: z.array(media.extend({ title: z.string(), text: z.string().optional() })),
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

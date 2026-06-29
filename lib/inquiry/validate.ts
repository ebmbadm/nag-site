import { z } from "zod";

export const inquirySchema = z.object({
  kind: z.enum(["contact", "product", "boutique"]),
  product_slug: z.string().optional(),
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  source_url: z.string().optional(),
  website: z.literal(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

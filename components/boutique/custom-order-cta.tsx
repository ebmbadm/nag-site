"use client";
import { useState } from "react";
import { Section, buttonVariants } from "@/components/ds";
import { InquiryModal } from "@/components/inquiry";
import type { BoutiqueCustom } from "@/lib/content/types";

export function CustomOrderCta({ custom }: { custom: BoutiqueCustom }) {
  const [open, setOpen] = useState(false);

  return (
    <Section id="custom" title={custom.title}>
      <div className="max-w-2xl">
        {custom.body.map((p, i) => (
          <p key={i} className="mt-0 mb-4 text-ink-2">
            {p}
          </p>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={buttonVariants({ variant: "primary", className: "mt-2 cursor-pointer" })}
        >
          {custom.cta.label}
        </button>
      </div>
      <InquiryModal open={open} onClose={() => setOpen(false)} kind="boutique" />
    </Section>
  );
}

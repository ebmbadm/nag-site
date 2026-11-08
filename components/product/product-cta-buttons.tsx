"use client";
import { useState } from "react";
import { buttonVariants } from "@/components/ds";
import { InquiryModal } from "@/components/inquiry";
import type { ProductFrontmatter } from "@/lib/content/schema";

interface ProductCtaButtonsProps {
  price: ProductFrontmatter["price"];
  archived?: boolean;
  name: string;
  slug: string;
}

export function ProductCtaButtons({ price, archived, name, slug }: ProductCtaButtonsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}
      >
        {archived ? "Обмен и ремонт" : price?.onRequest ? "Запросить расчёт" : "Оставить заявку"}
      </button>
      <InquiryModal
        open={open}
        onClose={() => setOpen(false)}
        kind="product"
        productName={name}
        productSlug={slug}
        messagePlaceholder={archived ? "Модель и что нужно: ремонт, схема или обмен" : undefined}
      />
    </>
  );
}

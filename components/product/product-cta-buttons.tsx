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
      <div className="flex flex-wrap gap-3">
        {archived || price?.onRequest ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
          >
            {archived ? "Обмен и ремонт" : "Запросить расчёт"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
            >
              Оставить заявку
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Купить в 1 клик
            </button>
          </>
        )}
      </div>
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

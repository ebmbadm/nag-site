"use client";
import { useState } from "react";
import { buttonVariants } from "@/components/ds";
import { InquiryModal } from "@/components/inquiry";
import type { ProductFrontmatter } from "@/lib/content/schema";

interface ProductCtaButtonsProps {
  price: ProductFrontmatter["price"];
  name: string;
  slug: string;
}

export function ProductCtaButtons({ price, name, slug }: ProductCtaButtonsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {price?.onRequest ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
          >
            Запросить расчёт
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
            >
              В корзину
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
      />
    </>
  );
}

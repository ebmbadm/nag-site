import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eyebrow, Badge } from "./primitives";
import { formatPrice } from "@/lib/format";

export type ProductCardProps = {
  slug: string;
  name: string;
  eyebrow?: string;
  image: { src: string; alt: string; width?: number; height?: number };
  price?: { amount?: number; onRequest?: boolean };
  badge?: string;
  className?: string;
};

/** Catalog grid card — links to /catalog/[slug]. */
export function ProductCard({
  slug,
  name,
  eyebrow,
  image,
  price,
  badge,
  className,
}: ProductCardProps) {
  const priceText =
    price?.onRequest
      ? "По запросу"
      : price?.amount != null
        ? formatPrice(price.amount)
        : null;

  return (
    <Link
      href={`/catalog/${slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg transition-[box-shadow,border-color] duration-[var(--dur-base)]",
        "hover:border-accent hover:shadow-[var(--shadow-2)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
        className,
      )}
    >
      {/* Badge overlay */}
      {badge && (
        <div className="absolute left-3 top-3 z-10">
          <Badge>{badge}</Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-surface-2">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-contain p-4 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <p
          className="font-display uppercase text-text"
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: "var(--lh-snug)",
            letterSpacing: "var(--ls-tight)",
          }}
        >
          {name}
        </p>
        {priceText && (
          <p className="mt-auto pt-3 font-mono text-sm text-text-muted tabular">
            {priceText}
          </p>
        )}
      </div>
    </Link>
  );
}

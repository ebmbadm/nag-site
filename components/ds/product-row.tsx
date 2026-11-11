import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type ProductRowProps = {
  name: string;
  href: string;
  /** Front-panel photo on white. Rack units share one width so 1U / 2U read from the height. */
  image?: { src: string; alt: string; width?: number; height?: number };
  /** Non-rack products (modules, tube heads): photo at a fixed 200px height. */
  boxed?: boolean;
  summary?: React.ReactNode;
  spec?: React.ReactNode;
  /** Formatted price ("199 900 ₽", "от 70 000 ₽"). null/undefined → «По запросу». */
  price?: string | null;
  priceNote?: string;
  className?: string;
};

/** Catalog row: photo, name, summary, one or two key numbers, price on the right. */
export function ProductRow({
  name,
  href,
  image,
  boxed,
  summary,
  spec,
  price,
  priceNote,
  className,
}: ProductRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line py-8 text-ink no-underline first:pt-0",
        className,
      )}
    >
      {image ? (
        <div className="flex min-w-0 flex-[0_1_var(--spacing-photo-rack)] bg-photo">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 800}
            height={image.height ?? (boxed ? 400 : 160)}
            sizes="(max-width: 640px) 100vw, 400px"
            className={cn("block", boxed ? "h-50 w-auto max-w-full object-contain" : "h-auto w-full")}
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-[1_1_200px]">
        <h3 className="m-0 text-site-title underline decoration-transparent transition-quick group-hover:decoration-current">{name}</h3>
        {summary ? <p className="mt-1 mb-0 text-site-small text-ink-2">{summary}</p> : null}
        {spec ? <p className="mt-2 mb-0 text-site-small">{spec}</p> : null}
      </div>
      {price ? (
        <p className="m-0 shrink-0 text-right text-lg font-semibold">
          {price}
          {priceNote ? <small className="block text-site-caption font-normal text-ink-3">{priceNote}</small> : null}
        </p>
      ) : (
        <p className="m-0 shrink-0 text-right text-base font-medium text-ink-2">По запросу</p>
      )}
    </Link>
  );
}

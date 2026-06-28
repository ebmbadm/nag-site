import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Framed image with mono caption — equipment photos, screenshots. */
export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 750,
  className,
  imgClassName,
  priority,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2 shadow-[var(--shadow-2)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={cn("h-auto w-full object-cover", imgClassName)}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

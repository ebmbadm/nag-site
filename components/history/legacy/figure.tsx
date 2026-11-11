"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox } from "./lightbox";

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
  unoptimized = false,
  zoomable = true,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  unoptimized?: boolean;
  zoomable?: boolean;
}) {
  const [zoomed, setZoomed] = React.useState(false);
  // Mounted only after the first open: the dialog would otherwise put a second
  // copy of every figure in the DOM. Once mounted it stays, so closing keeps
  // its exit transition.
  const [mounted, setMounted] = React.useState(false);

  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={unoptimized}
      className={cn(
        "h-auto w-full object-cover",
        zoomable &&
          "transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover/fig:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/fig:scale-100",
        imgClassName,
      )}
    />
  );

  return (
    <figure className={cn("reveal m-0", className)}>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2 shadow-[var(--shadow-2)]">
        {zoomable ? (
          <button
            type="button"
            onClick={() => {
              setMounted(true);
              setZoomed(true);
            }}
            aria-label={`Открыть фото: ${alt}`}
            className="group/fig block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
          >
            {image}
          </button>
        ) : (
          image
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
          {caption}
        </figcaption>
      ) : null}
      {zoomable && mounted ? (
        <Lightbox
          src={src}
          alt={alt}
          caption={caption}
          open={zoomed}
          onClose={() => setZoomed(false)}
        />
      ) : null}
    </figure>
  );
}

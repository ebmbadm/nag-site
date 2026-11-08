"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox } from "./lightbox";

/** Photo on white, no frame or rounding, caption in site-caption. Click opens it full screen. */
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
  // The dialog mounts on first open so every figure isn't duplicated in the DOM.
  const [mounted, setMounted] = React.useState(false);

  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={unoptimized}
      className={cn("block h-auto w-full", imgClassName)}
    />
  );

  return (
    <figure className={cn("m-0", className)}>
      <div className="bg-photo">
        {zoomable ? (
          <button
            type="button"
            onClick={() => {
              setMounted(true);
              setZoomed(true);
            }}
            aria-label={`Открыть фото: ${alt}`}
            className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
          >
            {image}
          </button>
        ) : (
          image
        )}
      </div>
      {caption ? <figcaption className="mt-2 text-site-caption text-ink-3">{caption}</figcaption> : null}
      {zoomable && mounted ? (
        <Lightbox src={src} alt={alt} caption={caption} open={zoomed} onClose={() => setZoomed(false)} />
      ) : null}
    </figure>
  );
}

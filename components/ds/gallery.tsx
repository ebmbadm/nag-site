"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Lightbox } from "./lightbox";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Product gallery — embla viewport + synced thumbnail strip + caption. */
export function Gallery({ images, className }: { images: GalleryImage[]; className?: string }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = React.useState(0);
  // The index survives the close so the dialog can animate out before it is
  // hidden; `zoomOpen` is what actually drives showModal/close.
  const [zoomIndex, setZoomIndex] = React.useState<number | null>(null);
  const [zoomOpen, setZoomOpen] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  React.useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  // A swipe ends in a click on the slide; without this a drag would open the
  // lightbox. Embla 8 exposes no clickAllowed(), so measure the travel here.
  const pressAt = React.useRef<{ x: number; y: number } | null>(null);
  const wasDrag = (e: React.MouseEvent) => {
    const from = pressAt.current;
    return !!from && Math.hypot(e.clientX - from.x, e.clientY - from.y) > 8;
  };

  const scrollTo = (i: number) => {
    const jump = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    embla?.scrollTo(i, jump);
  };

  return (
    <section
      role="region"
      aria-label="Галерея изображений"
      className={cn("flex flex-col gap-3", className)}
    >
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2",
          images.length > 1 && "cursor-grab active:cursor-grabbing",
        )}
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="group relative min-w-0 flex-[0_0_100%]">
              <button
                type="button"
                onPointerDown={(e) => {
                  pressAt.current = { x: e.clientX, y: e.clientY };
                }}
                onClick={(e) => {
                  if (wasDrag(e)) return;
                  setZoomIndex(i);
                  setZoomOpen(true);
                }}
                aria-label={`Открыть фото: ${img.alt}`}
                className="relative block aspect-[16/10] w-full cursor-zoom-in p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 900px) 100vw, 600px"
                  className="object-contain p-2 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Фото ${i + 1}`}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 bg-photo-backdrop transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
                i === selected
                  ? "border-accent"
                  : "border-border opacity-70 hover:opacity-100 hover:border-accent/40",
              )}
            >
              <Image src={img.src} alt={img.alt} fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}

      {images[selected]?.caption ? (
        <p className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
          {images[selected].caption}
        </p>
      ) : null}

      {zoomIndex !== null ? (
        <Lightbox
          src={images[zoomIndex].src}
          alt={images[zoomIndex].alt}
          caption={images[zoomIndex].caption}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      ) : null}
    </section>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Product gallery — embla viewport + synced thumbnail strip + caption. */
export function Gallery({ images, className }: { images: GalleryImage[]; className?: string }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = React.useState(0);

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
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-2" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[16/10] w-full p-4">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 900px) 100vw, 600px"
                  className="object-contain p-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Фото ${i + 1}`}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
                i === selected
                  ? "border-accent"
                  : "border-border opacity-70 hover:opacity-100 hover:border-accent/40",
              )}
            >
              <Image src={img.src} alt={img.alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {images[selected]?.caption ? (
        <p className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
          {images[selected].caption}
        </p>
      ) : null}
    </section>
  );
}

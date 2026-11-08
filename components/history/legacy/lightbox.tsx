"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * Full-bleed photo view on a native <dialog>: Esc, focus trapping and the
 * top layer come from the platform, the enter/exit animation from the
 * `dialog` rules in globals.css.
 */
export function Lightbox({
  src,
  alt,
  caption,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={alt}
      className="m-0 max-h-none max-w-none border-0 bg-transparent p-0"
      style={{ width: "100vw", height: "100dvh" }}
    >
      {/* Click anywhere but the picture closes it — the usual lightbox reflex. */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="relative flex size-full flex-col items-center justify-center gap-4 p-[clamp(16px,4vw,48px)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть фото"
          className="absolute right-[clamp(12px,3vw,28px)] top-[clamp(12px,3vw,28px)] inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-[rgb(255_255_255/0.18)] text-ivory transition-colors hover:border-[rgb(255_255_255/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
        >
          <X className="size-5" aria-hidden />
        </button>
        <Image
          src={src}
          alt={alt}
          width={1800}
          height={1200}
          sizes="92vw"
          className="h-auto max-h-[84dvh] w-auto max-w-full object-contain"
        />
        {caption ? (
          <p className="max-w-prose text-center font-mono text-2xs uppercase tracking-[var(--ls-label)] text-[rgb(255_255_255/0.62)]">
            {caption}
          </p>
        ) : null}
      </div>
    </dialog>
  );
}

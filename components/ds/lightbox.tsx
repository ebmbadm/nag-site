"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

/** Full-screen photo view on a native <dialog>: Esc, focus trap and top layer come from the platform. */
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
      data-theme="dark"
      className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0"
    >
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="relative flex size-full flex-col items-center justify-center gap-4 p-4 sm:p-12"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть фото"
          className="absolute top-4 right-4 inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-line-control bg-bg text-ink transition-quick hover:bg-surface"
        >
          <X size={20} strokeWidth={1.75} aria-hidden />
        </button>
        <div className="bg-photo">
          <Image
            src={src}
            alt={alt}
            width={1800}
            height={1200}
            sizes="92vw"
            className="block h-auto max-h-[84dvh] w-auto max-w-full object-contain"
          />
        </div>
        {caption ? <p className="m-0 max-w-prose text-center text-site-caption text-ink-2">{caption}</p> : null}
      </div>
    </dialog>
  );
}

"use client";
import { useState } from "react";
import { buttonVariants } from "@/components/ds";
import { InquiryModal } from "@/components/inquiry";

export function TubesInquiryCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonVariants({ variant: "primary", size: "lg" })}
      >
        Запросить модель
      </button>
      <InquiryModal open={open} onClose={() => setOpen(false)} kind="boutique" />
    </>
  );
}

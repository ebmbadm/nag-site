"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ds";
import { InquiryModal } from "./inquiry-modal";

/** The page's one red action: opens the inquiry form. */
export function InquiryButton({
  children = "Подобрать оборудование",
  messagePlaceholder = "Где будет работать система, какая акустика",
}: {
  children?: React.ReactNode;
  messagePlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonVariants({ variant: "primary", className: "cursor-pointer" })}
      >
        {children}
      </button>
      <InquiryModal open={open} onClose={() => setOpen(false)} kind="product" messagePlaceholder={messagePlaceholder} />
    </>
  );
}

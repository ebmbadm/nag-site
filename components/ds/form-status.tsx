"use client";
import type { InquiryResult } from "@/app/actions/submit-inquiry";
import { Notice } from "./primitives";

export function FormStatus({ state }: { state: InquiryResult | null }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <Notice role="status" title="Заявка отправлена">
        Мы свяжемся с вами в ближайшее время.
      </Notice>
    );
  }
  return (
    <Notice role="alert" tone="error" title="Заявка не отправлена">
      {state.error}
    </Notice>
  );
}

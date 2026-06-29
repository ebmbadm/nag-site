"use client";
import type { InquiryResult } from "@/app/actions/submit-inquiry";

export function FormStatus({ state }: { state: InquiryResult | null }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text"
      >
        Заявка отправлена. Мы свяжемся с вами в ближайшее время.
      </div>
    );
  }
  return (
    <p role="alert" className="font-mono text-2xs text-accent">
      {state.error}
    </p>
  );
}

"use client";
import { useRef, useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { buttonVariants, Field, Input, Textarea, FormStatus } from "@/components/ds";
import { submitInquiry, type InquiryResult } from "@/app/actions/submit-inquiry";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  kind: "product" | "boutique";
  productName?: string;
  productSlug?: string;
}

export function InquiryModal({
  open,
  onClose,
  kind,
  productName,
  productSlug,
}: InquiryModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setResult(null);
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitInquiry({
        kind,
        product_slug: productSlug,
        name: fd.get("name") as string,
        contact: fd.get("contact") as string,
        message: (fd.get("message") as string) || undefined,
        source_url: typeof window !== "undefined" ? window.location.href : undefined,
        website: fd.get("website") as string,
      });
      setResult(res);
      if (res.ok) {
        setTimeout(onClose, 2000);
      }
    });
  }

  const title =
    kind === "product"
      ? productName
        ? `Заявка: ${productName}`
        : "Отправить заявку"
      : "Индивидуальный заказ";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto max-w-lg w-full rounded-[var(--radius-lg)] border border-border bg-bg p-6 shadow-[var(--shadow-3)] backdrop:bg-[rgb(0_0_0/0.5)]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2
          className="font-display text-lg uppercase text-text"
          style={{ letterSpacing: "var(--ls-tight)" }}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="shrink-0 text-text-faint hover:text-text"
        >
          <X size={20} />
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          defaultValue=""
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
        <Field label="Имя" htmlFor="modal-name">
          <Input id="modal-name" name="name" type="text" placeholder="Ваше имя" required />
        </Field>
        <Field label="Телефон или e-mail" htmlFor="modal-contact">
          <Input
            id="modal-contact"
            name="contact"
            type="text"
            placeholder="+7 900 000 00 00 или mail@example.com"
            required
          />
        </Field>
        <Field label="Комментарий" htmlFor="modal-message">
          <Textarea
            id="modal-message"
            name="message"
            rows={3}
            placeholder="Дополнительная информация"
          />
        </Field>
        <button
          type="submit"
          disabled={isPending}
          className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}
        >
          {isPending ? "Отправляем..." : "Отправить"}
        </button>
        <FormStatus state={result} />
      </form>
    </dialog>
  );
}

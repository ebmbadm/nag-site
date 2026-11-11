"use client";
import { useId, useRef, useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { buttonVariants, Field, Input, Textarea, FormStatus } from "@/components/ds";
import { submitInquiry, type InquiryResult } from "@/app/actions/submit-inquiry";
import { reachGoal } from "@/components/analytics/yandex-metrika";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  kind: "product" | "boutique";
  productName?: string;
  productSlug?: string;
  messagePlaceholder?: string;
}

export function InquiryModal({
  open,
  onClose,
  kind,
  productName,
  productSlug,
  messagePlaceholder = "Дополнительная информация",
}: InquiryModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // Several modals can share a page (home has two inquiry buttons): ids must be unique.
  const uid = useId();
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setResult(null);
      ref.current?.showModal();
      // Micro-conversion. Opening the form is ~10-20x more frequent than sending
      // it, which is what Direct's auto-strategies need to learn on: six leads a
      // quarter is not enough signal for them.
      reachGoal("inquiry_open", { kind, product: productSlug });
    } else {
      ref.current?.close();
    }
  }, [open, kind, productSlug]);

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
        source_url: window.location.href,
        website: fd.get("website") as string,
      });
      setResult(res);
      if (res.ok) {
        reachGoal("lead", { kind, product: productSlug });
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
      aria-modal="true"
      aria-labelledby={`${uid}-inquiry-modal-title`}
      className="m-auto w-full max-w-lg rounded-lg border-0 bg-bg p-6 text-ink"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 id={`${uid}-inquiry-modal-title`} className="m-0 text-site-title">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-ink-2 transition-quick hover:bg-surface hover:text-ink"
        >
          <X size={20} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          defaultValue=""
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
        <Field label="Имя" htmlFor={`${uid}-modal-name`}>
          <Input id={`${uid}-modal-name`} name="name" type="text" placeholder="Ваше имя" required />
        </Field>
        <Field label="Телефон или e-mail" htmlFor={`${uid}-modal-contact`}>
          <Input
            id={`${uid}-modal-contact`}
            name="contact"
            type="text"
            placeholder="+7 900 000 00 00 или mail@example.com"
            required
          />
        </Field>
        <Field label="Комментарий" htmlFor={`${uid}-modal-message`}>
          <Textarea
            id={`${uid}-modal-message`}
            name="message"
            rows={3}
            placeholder={messagePlaceholder}
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

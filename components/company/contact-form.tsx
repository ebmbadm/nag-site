"use client";
import { useState, useTransition } from "react";
import { buttonVariants, Field, Input, Textarea, FormStatus } from "@/components/ds";
import { submitInquiry, type InquiryResult } from "@/app/actions/submit-inquiry";
import { reachGoal } from "@/components/analytics/yandex-metrika";
import type { ContactsContent } from "@/lib/content/types";

export function ContactForm({ form }: { form: ContactsContent["form"] }) {
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitInquiry({
        kind: "contact",
        name: fd.get("name") as string,
        contact: fd.get("contact") as string,
        message: (fd.get("message") as string) || undefined,
        source_url: window.location.href,
        website: fd.get("website") as string,
      });
      setResult(res);
      if (res.ok) {
        reachGoal("lead", { kind: "contact" });
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <form className="flex max-w-xl flex-col gap-6" onSubmit={handleSubmit} aria-label={form.title}>
      {/* Honeypot — bots fill it, humans don't */}
      <input type="text" name="website" defaultValue="" className="hidden" tabIndex={-1} aria-hidden="true" />
      <Field label="Имя" htmlFor="name">
        <Input id="name" name="name" type="text" placeholder="Ваше имя" required />
      </Field>
      <Field label="Телефон или e-mail" htmlFor="contact">
        <Input id="contact" name="contact" type="text" placeholder="+7 900 000 00 00 или mail@example.com" required />
      </Field>
      <Field label="Сообщение" htmlFor="message">
        <Textarea id="message" name="message" rows={4} placeholder="Чем можем помочь?" />
      </Field>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" disabled={isPending} className={buttonVariants({ variant: "primary", size: "lg" })}>
          {isPending ? "Отправляем..." : "Отправить"}
        </button>
        <p className="m-0 text-site-caption text-ink-3">{form.note}</p>
      </div>
      <FormStatus state={result} />
    </form>
  );
}

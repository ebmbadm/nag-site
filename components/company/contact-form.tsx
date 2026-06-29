"use client";
import { useState, useTransition } from "react";
import { buttonVariants, Field, Input, Textarea, FormStatus } from "@/components/ds";
import { submitInquiry, type InquiryResult } from "@/app/actions/submit-inquiry";
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
      if (res.ok) (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
      <h2
        className="font-display text-lg uppercase text-text"
        style={{ letterSpacing: "var(--ls-tight)" }}
      >
        {form.title}
      </h2>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {/* Honeypot — bots fill it, humans don't */}
        <input
          type="text"
          name="website"
          defaultValue=""
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
        <Field label="Имя" htmlFor="name">
          <Input id="name" name="name" type="text" placeholder="Ваше имя" required />
        </Field>
        <Field label="Телефон или e-mail" htmlFor="contact">
          <Input
            id="contact"
            name="contact"
            type="text"
            placeholder="+7 900 000 00 00 или mail@example.com"
            required
          />
        </Field>
        <Field label="Сообщение" htmlFor="message">
          <Textarea id="message" name="message" rows={4} placeholder="Чем можем помочь?" />
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
      <p className="mt-3 font-mono text-2xs text-text-faint">{form.note}</p>
    </div>
  );
}

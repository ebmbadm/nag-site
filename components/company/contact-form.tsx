import { buttonVariants } from "@/components/ds";
import type { ContactsContent } from "@/lib/content/types";

const FIELDS = [
  { id: "name", label: "Имя", type: "text" },
  { id: "phone", label: "Телефон", type: "tel" },
  { id: "email", label: "E-mail", type: "email" },
] as const;

/** Stubbed inquiry form — non-submitting in P3. */
export function ContactForm({ form }: { form: ContactsContent["form"] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
      <h2 className="font-display text-lg uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
        {form.title}
      </h2>
      {/* TODO(P5): wire to Supabase server action */}
      <form className="mt-5 space-y-4" aria-disabled="true">
        {FIELDS.map((f) => (
          <div key={f.id} className="flex flex-col gap-1.5">
            <label htmlFor={f.id} className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {f.label}
            </label>
            <input
              id={f.id}
              name={f.id}
              type={f.type}
              disabled
              className="h-11 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 text-sm text-text disabled:opacity-60"
            />
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Сообщение
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled
            className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm text-text disabled:opacity-60"
          />
        </div>
        <button type="submit" disabled className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}>
          Отправить
        </button>
      </form>
      <p className="mt-3 font-mono text-2xs text-text-faint">{form.note}</p>
    </div>
  );
}

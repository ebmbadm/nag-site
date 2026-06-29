import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
}

export function Field({ label, htmlFor, children, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="font-mono text-2xs text-accent">{error}</p>
      ) : null}
    </div>
  );
}

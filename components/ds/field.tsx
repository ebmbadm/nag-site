import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  /** Hint under the control. */
  help?: string;
  /** Replaces the hint. Name the problem and the way out. */
  error?: string;
}

/** Label above the control, hint under it, error in place of the hint. */
export function Field({ label, htmlFor, children, help, error }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={htmlFor} className="text-site-small font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="m-0 text-site-caption text-danger">{error}</p>
      ) : help ? (
        <p className="m-0 text-site-caption text-ink-3">{help}</p>
      ) : null}
    </div>
  );
}

/** Shared control look: 48px, line-control border (3:1), ink ring on focus, danger when invalid. */
export const controlClass =
  "w-full rounded-sm border border-line-control bg-bg text-site-body text-ink placeholder:text-ink-3 focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--ink)] focus:outline-none aria-invalid:border-danger";

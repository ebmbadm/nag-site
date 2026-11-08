"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClass } from "./field";

/** Native select with the system chevron. */
export function Select({
  id,
  label,
  options,
  help,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: Array<string | { value: string; label: string }>;
  help?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={id} className="text-site-small font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <select id={id} className={cn(controlClass, "h-12 appearance-none pr-10 pl-4")} {...props}>
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-2"
        />
      </div>
      {help ? <p className="m-0 text-site-caption text-ink-3">{help}</p> : null}
    </div>
  );
}

/** Native checkbox, 20px, ink when checked. */
export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3 text-base text-ink", className)}>
      <input type="checkbox" className="m-0 size-5 accent-[var(--ink)]" {...props} />
      {label}
    </label>
  );
}

/** On/off switch. Ink track when on — never red. */
export function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  className,
}: {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (on: boolean) => void;
  className?: string;
}) {
  const [inner, setInner] = React.useState(defaultChecked ?? false);
  const on = checked ?? inner;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        if (checked === undefined) setInner(!on);
        onChange?.(!on);
      }}
      className={cn("inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-base text-ink", className)}
    >
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full border transition-quick",
          on ? "border-ink bg-ink" : "border-line-control bg-bg",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 size-4 rounded-full",
            on ? "translate-x-4 bg-bg" : "bg-ink-2",
          )}
        />
      </span>
      {label}
    </button>
  );
}

export type SegmentedOption<T extends string> = { value: T; label: React.ReactNode };

/** Segmented control: options on a surface track, the active one raised. */
export function Segmented<T extends string>({
  label,
  ariaLabel,
  options,
  value,
  defaultValue,
  onChange,
  className,
}: {
  label?: string;
  ariaLabel?: string;
  options: SegmentedOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}) {
  const [inner, setInner] = React.useState<T | undefined>(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const labelId = React.useId();
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {label ? (
        <span id={labelId} className="text-site-small font-medium">
          {label}
        </span>
      ) : null}
      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        className="inline-flex flex-wrap gap-1 rounded-md bg-surface p-1"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={o.value === current}
            onClick={() => {
              if (value === undefined) setInner(o.value);
              onChange?.(o.value);
            }}
            className={cn(
              "h-9 min-w-12 cursor-pointer rounded-sm border-0 px-4 text-site-small transition-quick",
              o.value === current
                ? "bg-surface-raised font-medium text-ink shadow-raised"
                : "bg-transparent text-ink-2 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

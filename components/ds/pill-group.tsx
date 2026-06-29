"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PillGroupOption = { value: string; label: string };

export type PillGroupProps = {
  options: PillGroupOption[];
  value: string;
  onChange: (value: string) => void;
  tabRole?: boolean;
  className?: string;
};

/** Controlled pill selector. Use tabRole for Tabs; default for standalone filters. */
export function PillGroup({
  options,
  value,
  onChange,
  tabRole = false,
  className,
}: PillGroupProps) {
  return (
    <div
      role={tabRole ? "tablist" : "group"}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            id={tabRole ? `tab-${opt.value}` : undefined}
            type="button"
            role={tabRole ? "tab" : undefined}
            aria-selected={tabRole ? isSelected : undefined}
            onClick={() => {
              if (!isSelected) onChange(opt.value);
            }}
            className={cn(
              "inline-flex items-center rounded-[var(--radius-pill)] border px-3.5 py-1.5 font-mono text-xs uppercase tracking-[var(--ls-label)] transition-colors duration-[var(--dur-base)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
              isSelected
                ? "border-accent bg-accent text-on-accent"
                : "border-border text-text-muted hover:border-accent hover:text-accent",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

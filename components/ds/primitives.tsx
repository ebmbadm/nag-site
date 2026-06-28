import * as React from "react";
import { cn } from "@/lib/utils";

/** Page width container with fluid gutter. */
export function Container({
  className,
  wide,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { wide?: boolean }) {
  return (
    <div
      className={cn("mx-auto w-full px-[var(--gutter)]", className)}
      style={{ maxWidth: wide ? "var(--container-wide)" : "var(--container)" }}
      {...props}
    />
  );
}

/** Mono uppercase label — eyebrows, kickers, instrument labels. */
export function Eyebrow({
  className,
  accent,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { accent?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-[var(--ls-label)]",
        accent ? "text-accent" : "text-text-faint",
        className,
      )}
      {...props}
    />
  );
}

/** Solid signal badge — BEST SELLER, NEW, etc. */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] bg-accent px-2 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[var(--ls-wide)] text-on-accent",
        className,
      )}
      {...props}
    />
  );
}

/** Spec chip — small bordered mono token (e.g. "32 bit DSP"). */
export function Chip({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs tracking-[var(--ls-mono)] text-text-muted tabular",
        className,
      )}
      {...props}
    />
  );
}

/** Hairline divider. */
export function Divider({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("border-0 border-t border-border", className)} {...props} />;
}

/** 3px signal-red accent rule. */
export function Rule({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-[var(--border-w-rule)] w-10 bg-accent", className)}
      role="presentation"
      {...props}
    />
  );
}

/**
 * Surface scope — flips semantic tokens to dark.
 * Wrap any band that should render on the dark chassis palette.
 */
export function Surface({
  mode = "light",
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { mode?: "light" | "dark" }) {
  return (
    <div
      data-surface={mode}
      className={cn("bg-bg text-text", className)}
      style={style}
      {...props}
    />
  );
}

/** Section header — eyebrow + display title (+ optional lede). */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <Eyebrow accent className="mb-3 inline-block">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className="font-display uppercase text-text"
        style={{
          fontSize: "clamp(var(--text-2xl), 4vw, var(--text-4xl))",
          lineHeight: "var(--lh-tight)",
          letterSpacing: "var(--ls-tight)",
        }}
      >
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 max-w-prose text-md text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
          {lede}
        </p>
      ) : null}
    </header>
  );
}

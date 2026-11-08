import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Info, TriangleAlert, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page width (container 1200px) with page margins from 16px (phone) to 40px (desktop). */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-page px-4 sm:px-6 lg:px-10", className)} {...props} />;
}

/**
 * Theme scope. `dark` is for the one dark band on a page: every role flips,
 * the components stay the same.
 */
export function Theme({
  dark,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return <div data-theme={dark ? "dark" : "light"} className={cn("bg-bg text-ink", className)} {...props} />;
}

/** Lucide icon at the system size: 20 on the site, stroke 1.75, colour of the text next to it. */
export function Icon({
  as: Glyph,
  size = 20,
  label,
  className,
}: {
  as: LucideIcon;
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.75}
      className={cn("shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}

/**
 * Page section: title column (1 part) and content (3 parts), 48px apart, a
 * line-strong rule above. Columns stack on a phone.
 */
export function Section({
  title,
  description,
  aside,
  id,
  as: Heading = "h2",
  className,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Extra content under the description: a link to the full list, a note. */
  aside?: React.ReactNode;
  id?: string;
  as?: "h2" | "h3";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex scroll-mt-6 flex-wrap gap-x-12 gap-y-6 border-t border-line-strong pt-6",
        className,
      )}
    >
      <div className="reveal flex min-w-0 flex-[1_1_240px] flex-col items-start gap-2">
        <Heading className="m-0 text-site-section">{title}</Heading>
        {description ? <div className="text-site-small text-ink-2">{description}</div> : null}
        {aside ? <div className="mt-2 text-site-small">{aside}</div> : null}
      </div>
      <div className="reveal-children min-w-0 flex-[3_1_640px]">{children}</div>
    </section>
  );
}

/** Page heading: one per page, site-display, with an optional site-lead under it. */
export function PageHeader({
  title,
  lead,
  className,
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("enter max-w-3xl", className)}>
      <h1 className="m-0 text-site-section sm:text-site-display">{title}</h1>
      {lead ? <p className="mt-4 mb-0 text-site-lead text-ink-2">{lead}</p> : null}
      {children}
    </header>
  );
}

/** Small outlined label: a series member, a connector, a channel count. */
export function Tag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center whitespace-nowrap rounded-sm border border-line-strong px-2 text-site-caption text-ink-2",
        className,
      )}
      {...props}
    />
  );
}

/** Status: a dot and a word. Colour never stands without the word. */
export function Status({
  tone = "ok",
  className,
  children,
}: {
  tone?: "ok" | "warn" | "danger" | "off";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-site-small",
        tone === "off" ? "text-ink-2" : "text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          tone === "ok" && "bg-ok",
          tone === "warn" && "bg-warn",
          tone === "danger" && "bg-danger",
          tone === "off" && "border border-ink-3",
        )}
      />
      {children}
    </span>
  );
}

const NOTICE_ICON = { info: Info, warn: TriangleAlert, error: CircleX } as const;

/** Notice: a short message on a soft fill. Title in the tone colour, text in ink. */
export function Notice({
  tone = "info",
  title,
  className,
  children,
  role,
}: {
  tone?: "info" | "warn" | "error";
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <div
      role={role}
      className={cn(
        "flex gap-3 rounded-md p-4 text-site-small text-ink",
        tone === "info" && "bg-surface",
        tone === "warn" && "bg-warn-soft",
        tone === "error" && "bg-danger-soft",
        className,
      )}
    >
      <Icon
        as={NOTICE_ICON[tone]}
        className={cn("mt-px", tone === "warn" && "text-warn", tone === "error" && "text-danger")}
      />
      <div className="min-w-0">
        {title ? (
          <p
            className={cn(
              "m-0 font-semibold",
              tone === "warn" && "text-warn",
              tone === "error" && "text-danger",
            )}
          >
            {title}
          </p>
        ) : null}
        {children ? <div className={cn(title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  );
}

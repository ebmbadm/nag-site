import * as React from "react";
import { cn } from "@/lib/utils";

/** MDX body styles: site-body, 40em measure, sentence-case headings. */
export function Prose({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-2xl text-site-body text-ink",
        "[&_h2]:mt-12 [&_h2]:mb-0 [&_h2]:text-site-section [&_h3]:mt-8 [&_h3]:mb-0 [&_h3]:text-site-title",
        "[&_p]:mt-4 [&_p]:mb-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2",
        "[&_blockquote]:mt-6 [&_blockquote]:ml-0 [&_blockquote]:text-ink-2",
        "[&_strong]:font-semibold [&_a]:text-ink [&_a]:underline [&_a:hover]:text-danger",
        "[&>*:first-child]:mt-0",
        className,
      )}
      {...props}
    />
  );
}

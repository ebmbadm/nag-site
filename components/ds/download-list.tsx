import { Download, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DownloadLink } from "@/lib/content/downloads";

function Icon({ ext }: { ext?: string }) {
  if (!ext) return <ExternalLink className="size-4 shrink-0 text-text-faint" aria-hidden />;
  if (ext === "PDF") return <FileText className="size-4 shrink-0 text-accent" aria-hidden />;
  return <Download className="size-4 shrink-0 text-accent" aria-hidden />;
}

/** Download rows — manuals and software, local files or external links. */
export function DownloadList({
  links,
  className,
}: {
  links: DownloadLink[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-2 sm:grid-cols-2", className)}>
      {links.map((link) => {
        const external = !link.href.startsWith("/");
        return (
          <li key={link.href}>
            <a
              href={link.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : { download: true })}
              className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 transition-colors hover:border-accent"
            >
              <Icon ext={link.ext} />
              <span className="min-w-0 flex-1 text-sm text-text group-hover:text-accent">
                {link.label}
              </span>
              <span className="shrink-0 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint tabular">
                {[link.ext, link.size].filter(Boolean).join(" · ")}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

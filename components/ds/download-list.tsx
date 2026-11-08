import { Download, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DownloadLink } from "@/lib/content/downloads";

/** Download rows — a name on the left, format and size on the right. */
export function DownloadList({ links, className }: { links: DownloadLink[]; className?: string }) {
  return (
    <ul className={cn("m-0 list-none p-0", className)}>
      {links.map((link) => {
        const external = !link.href.startsWith("/");
        const Glyph = !link.ext ? ExternalLink : link.ext === "PDF" ? FileText : Download;
        return (
          <li key={link.href} className="border-t border-line last:border-b">
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
              className="group flex items-center gap-3 py-4 text-ink no-underline"
            >
              <Glyph size={20} strokeWidth={1.75} aria-hidden className="shrink-0 text-ink-2" />
              <span className="min-w-0 flex-1 underline decoration-transparent transition-quick group-hover:decoration-current">{link.label}</span>
              <span className="shrink-0 text-site-small text-ink-3">
                {external ? "Внешняя ссылка" : [link.ext, link.size].filter(Boolean).join(" · ")}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

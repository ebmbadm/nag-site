import Link from "next/link";
import type { CompanyHubCard } from "@/lib/content/types";

/** List row: title and one line of text, a rule under it. The kicker is not shown. */
export function HubCard({ card }: { card: Pick<CompanyHubCard, "title" | "text" | "href"> }) {
  return (
    <Link href={card.href} className="group block border-b border-line py-6 text-ink no-underline first:pt-0">
      <span className="block text-site-title group-hover:underline">{card.title}</span>
      <span className="mt-1 block text-site-small text-ink-2">{card.text}</span>
    </Link>
  );
}

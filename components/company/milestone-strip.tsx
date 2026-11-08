import Link from "next/link";
import { Section, Tag } from "@/components/ds";
import type { CompanyMilestone } from "@/lib/content/types";

/** History and model timeline as a plain list year → event; links to the long-form history. */
export function MilestoneStrip({
  milestones,
  periods,
  continuation,
}: {
  milestones: CompanyMilestone[];
  periods: { range: string; label: string }[];
  continuation: { range: string; title: string; text: string };
}) {
  return (
    <Section
      id="daty"
      title="История и компания в датах"
      description={
        <ul className="m-0 list-none p-0">
          {periods.map((period) => (
            <li key={period.range}>
              {period.range} — <span>{period.label}</span>
            </li>
          ))}
        </ul>
      }
      aside={
        <Link href="/istoriya" className="text-ink">
          Читать историю целиком
        </Link>
      }
    >
      <dl className="m-0">
        {milestones.map((milestone) => (
          <div
            key={`${milestone.year}-${milestone.label}`}
            className="flex flex-wrap gap-x-8 gap-y-1 border-t border-line py-4 last:border-b"
          >
            <dt className="w-28 shrink-0 font-semibold">{milestone.year}</dt>
            <dd className="m-0 min-w-0 flex-[1_1_320px]">
              {milestone.label}
              {milestone.accentLabel ? <Tag className="ml-3">{milestone.accentLabel}</Tag> : null}
              {milestone.text ? <p className="mt-1 mb-0 text-site-small text-ink-2">{milestone.text}</p> : null}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 mb-0 max-w-2xl text-site-small text-ink-2">
        <span className="font-semibold text-ink">
          {continuation.title}, {continuation.range}.
        </span>{" "}
        {continuation.text}
      </p>
    </Section>
  );
}

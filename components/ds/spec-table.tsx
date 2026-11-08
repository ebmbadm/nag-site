import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  label: React.ReactNode;
  value: React.ReactNode;
}

/** Label | value table. Labels in ink-2 on the left, values right-aligned, tabular figures. */
export function SpecTable({
  rows,
  caption,
  compact,
  className,
}: {
  rows: SpecRow[];
  caption?: React.ReactNode;
  /** 15px rows for the order box; the full table uses 16px. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <table className={cn("w-full border-collapse", compact ? "text-site-small" : "text-base", className)}>
      {caption ? (
        <caption className="pb-2 text-left text-site-body font-semibold">{caption}</caption>
      ) : null}
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-line last:border-b">
            <th
              scope="row"
              className={cn("pr-6 text-left align-top font-normal text-ink-2", compact ? "py-2" : "py-3")}
            >
              {row.label}
            </th>
            <td className={cn("text-right align-top", compact ? "py-2" : "py-3")}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Several captioned SpecTables, 32px apart. */
export function SpecGroups({
  groups,
  className,
}: {
  groups: { title: string; rows: SpecRow[] }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {groups.map((g) => (
        <SpecTable key={g.title} caption={g.title} rows={g.rows} />
      ))}
    </div>
  );
}

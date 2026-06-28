import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  label: string;
  value: React.ReactNode;
}

/** Striped two-column spec table — label | value, mono values, tabular nums. */
export function SpecTable({
  rows,
  className,
}: {
  rows: SpecRow[];
  className?: string;
}) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={cn(i % 2 === 1 && "bg-surface-2")}>
            <th
              scope="row"
              className="w-1/2 border-b border-border-faint px-4 py-3 text-left align-top font-normal text-text-muted"
            >
              {row.label}
            </th>
            <td className="border-b border-border-faint px-4 py-3 text-left align-top font-mono text-text tabular">
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export type SpecMatrixProps = {
  columns: string[];
  rows: { label: string; values: (string | null)[] }[];
  caption?: string;
};

/** N-column spec comparison table — for series pages and category comparisons. */
export function SpecMatrixTable({ columns, rows, caption }: SpecMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-left">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-border">
            <th className="w-40 py-3 pr-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {/* spec label column — no header text */}
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="py-3 px-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-text text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={cn(
                "border-b border-border",
                i % 2 === 1 && "bg-surface-2",
              )}
            >
              <td className="py-3 pr-4 font-mono text-xs text-text-muted">
                {row.label}
              </td>
              {columns.map((col, j) => (
                <td
                  key={col}
                  className="py-3 px-4 text-sm text-text text-center tabular"
                >
                  {row.values[j] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

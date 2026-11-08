import * as React from "react";

export type SpecMatrixProps = {
  columns: string[];
  rows: { label: string; values: (string | null)[] }[];
  caption?: string;
};

/** N-column comparison: model names as column heads, labels in ink-2, row rules in line. */
export function SpecMatrixTable({ columns, rows, caption }: SpecMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-120 border-collapse text-left text-base">
        {caption && <caption className="pb-2 text-left text-site-body font-semibold">{caption}</caption>}
        <thead>
          <tr className="border-b border-line-strong">
            <td className="py-3 pr-4" />
            {columns.map((col) => (
              <th key={col} scope="col" className="px-4 py-3 text-right font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th scope="row" className="py-3 pr-4 font-normal text-ink-2">
                {row.label}
              </th>
              {columns.map((col, j) => (
                <td key={col} className="px-4 py-3 text-right">
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

"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

// A simple sortable table. Click a header to sort; click again to flip direction.
//   columns: what to show.  sortValue: the raw value used for sorting (number or text).

export type Column<Row> = {
  key: string;
  label: string;
  render: (row: Row) => React.ReactNode;
  sortValue?: (row: Row) => number | string | null;
  align?: "left" | "right";
};

export default function DataTable<Row>({ columns, rows }: { columns: Column<Row>[]; rows: Row[] }) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [desc, setDesc] = useState(false);

  function clickHeader(key: string) {
    if (sortKey === key) setDesc(!desc);
    else {
      setSortKey(key);
      setDesc(false);
    }
  }

  const sortCol = columns.find((c) => c.key === sortKey);
  const sorted = sortCol?.sortValue
    ? [...rows].sort((a, b) => {
        const va = sortCol.sortValue!(a);
        const vb = sortCol.sortValue!(b);
        if (va === null) return 1; // empty values always at the bottom
        if (vb === null) return -1;
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return desc ? -cmp : cmp;
      })
    : rows;

  return (
    <div className="overflow-x-auto">
      <table className="tabular w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-faint">
            {columns.map((c) => {
              const Icon = sortKey !== c.key ? ArrowUpDown : desc ? ArrowDown : ArrowUp;
              return (
                <th key={c.key} className={`whitespace-nowrap px-2 py-2 font-medium ${c.align === "right" ? "text-right" : ""}`}>
                  {c.sortValue ? (
                    <button onClick={() => clickHeader(c.key)} className="inline-flex items-center gap-1 hover:text-accent-text">
                      {c.label}
                      <Icon className={`h-3 w-3 ${sortKey === c.key ? "text-accent" : "opacity-50"}`} />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0 hover:bg-accent-soft">
              {columns.map((c) => (
                <td key={c.key} className={`whitespace-nowrap px-2 py-1.5 ${c.align === "right" ? "text-right" : ""}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

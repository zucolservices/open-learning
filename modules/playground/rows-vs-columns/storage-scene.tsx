"use client";

import { LayoutGroup, motion } from "motion/react";
import { cn } from "@/lib/cn";

export type Layout = "row" | "column";

export const columns = ["order_id", "customer", "country", "amount", "status"] as const;
export const QUERIED = "amount";

const rows: string[][] = [
  ["1001", "Asha", "IN", "420", "paid"],
  ["1002", "Ben", "UK", "95", "paid"],
  ["1003", "Chen", "SG", "310", "refund"],
  ["1004", "Dev", "IN", "780", "paid"],
  ["1005", "Elif", "TR", "150", "open"],
  ["1006", "Farah", "IN", "260", "paid"],
];

/** Cells per disk page. Reads happen a page at a time, never a single value. */
const PAGE = 6;

interface Cell {
  key: string;
  col: string;
  value: string;
}

function onDisk(layout: Layout): Cell[] {
  const cells: Cell[] = [];
  if (layout === "row") {
    rows.forEach((r, ri) =>
      r.forEach((v, ci) => cells.push({ key: `${ri}-${ci}`, col: columns[ci], value: v })),
    );
  } else {
    columns.forEach((c, ci) =>
      rows.forEach((r, ri) => cells.push({ key: `${ri}-${ci}`, col: c, value: r[ci] })),
    );
  }
  return cells;
}

export function pagesRead(layout: Layout): { read: number; total: number } {
  const cells = onDisk(layout);
  const pages = new Set<number>();
  cells.forEach((c, i) => c.col === QUERIED && pages.add(Math.floor(i / PAGE)));
  return { read: pages.size, total: Math.ceil(cells.length / PAGE) };
}

export function TableView({ highlight }: { highlight: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[26rem] border-separate border-spacing-0 font-mono text-xs">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className={cn(
                  "border-line text-muted border-b px-3 py-2 text-left font-medium",
                  highlight && c === QUERIED && "text-accent",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((v, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "border-line border-b px-3 py-1.5",
                    highlight && columns[ci] === QUERIED && "bg-accent-soft text-accent",
                  )}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The same 30 values laid out on disk, split into pages. Cells glide between layouts. */
export function DiskView({ layout, query }: { layout: Layout; query: boolean }) {
  const cells = onDisk(layout);
  const pages = Array.from({ length: Math.ceil(cells.length / PAGE) }, (_, p) =>
    cells.slice(p * PAGE, (p + 1) * PAGE),
  );

  return (
    <LayoutGroup>
      <div className="flex flex-wrap gap-2.5">
        {pages.map((page, p) => {
          const touched = query && page.some((c) => c.col === QUERIED);
          return (
            <div
              key={p}
              className={cn(
                "rounded-xl border p-1.5 transition-colors duration-500",
                touched ? "border-viz-compute bg-viz-compute/10" : "border-line bg-surface",
              )}
            >
              <p className="text-subtle px-1 pb-1 font-mono text-[10px]">page {p + 1}</p>
              <div className="flex gap-1">
                {page.map((c) => (
                  <motion.div
                    layout
                    layoutId={c.key}
                    key={c.key}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    title={`${c.col} = ${c.value}`}
                    className={cn(
                      "grid h-9 w-11 place-items-center rounded-md font-mono text-[10px]",
                      c.col === QUERIED ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                      query && touched && c.col !== QUERIED && "text-fg",
                    )}
                  >
                    {c.value}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

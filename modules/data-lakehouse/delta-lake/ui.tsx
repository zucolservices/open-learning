"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { FILES, type Action, type ActionType, type FileState, type Row } from "./data";

/** Short, recognisable label for a data file: the hex fragment of its name. */
export const fileTag = (id: string) => FILES[id].path.slice(11, 15);

export const fileStateStyle: Record<FileState | "vacuumed", string> = {
  live: "border-viz-data/60 bg-viz-data/20 text-fg",
  added: "border-viz-add bg-viz-add/25 text-fg",
  removed: "border-viz-remove border-dashed bg-viz-remove/10 text-viz-remove",
  storage: "border-line-strong border-dashed text-subtle",
  future: "border-line border-dashed text-transparent opacity-40",
  vacuumed: "border-bad/50 border-dashed bg-transparent text-bad/70 opacity-60",
};

export const fileStateLabel: Record<FileState, string> = {
  added: "added by this commit",
  live: "in the table",
  removed: "removed by this commit",
  storage: "in storage only",
  future: "not written yet",
};

export function FileTile({
  id,
  state,
  selected,
  onClick,
  className,
}: {
  id: string;
  state: FileState | "vacuumed";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? motion.button : motion.div;
  return (
    <Tag
      layout
      type={onClick ? "button" : undefined}
      onClick={onClick}
      title={FILES[id].path}
      animate={{ scale: state === "added" ? [0.7, 1.08, 1] : state === "vacuumed" ? 0.88 : 1 }}
      transition={{ duration: 0.45 }}
      className={cn(
        "relative grid h-14 w-12 place-items-center rounded-lg border font-mono text-[10px] transition-colors duration-500",
        fileStateStyle[state],
        (state === "removed" || state === "storage" || state === "vacuumed") && "line-through",
        selected && "ring-accent ring-offset-surface ring-2 ring-offset-2",
        onClick && "cursor-pointer hover:brightness-125",
        className,
      )}
    >
      <span className="absolute top-0 right-0 size-2.5 rounded-bl-md bg-current/40 opacity-60" />
      {fileTag(id)}
    </Tag>
  );
}

export function FileLegend({ states }: { states: FileState[] }) {
  return (
    <ul className="text-muted flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
      {states.map((s) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded-sm border", fileStateStyle[s])} />
          {fileStateLabel[s]}
        </li>
      ))}
    </ul>
  );
}

/** Table rows that animate in and out as the version changes. */
export function RowsTable({ rows, compact }: { rows: Row[]; compact?: boolean }) {
  return (
    <div className="border-line bg-surface overflow-hidden rounded-xl border">
      <table className="w-full font-mono text-xs">
        <thead className="bg-surface-2/60 text-muted">
          <tr>
            {["order_id", "customer", "amount", "status"].map((h) => (
              <th key={h} className={cn("px-3 text-left font-medium", compact ? "py-1.5" : "py-2")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.tr
                key={`${row.order_id}`}
                layout
                initial={{ opacity: 0, backgroundColor: "var(--accent-soft)" }}
                animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="border-line border-t"
              >
                <td className={cn("px-3", compact ? "py-1" : "py-1.5")}>{row.order_id}</td>
                <td className="px-3">{row.customer}</td>
                <td
                  className={cn("px-3 tabular-nums", row.amount === 0 && "text-bad font-semibold")}
                >
                  {row.amount}
                </td>
                <td
                  className={cn("px-3", row.status === "open" ? "text-viz-compute" : "text-muted")}
                >
                  {row.status}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="text-subtle px-3 py-4 text-center">
                (no rows)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export const actionColor: Record<ActionType, string> = {
  commitInfo: "text-muted",
  protocol: "text-viz-meta",
  metaData: "text-viz-meta",
  add: "text-viz-add",
  remove: "text-viz-remove",
};

/** One newline-delimited JSON action, syntax-coloured by key. */
export function ActionLine({
  action,
  active,
  onSelect,
  wrap,
}: {
  action: Action;
  active?: boolean;
  onSelect?: () => void;
  wrap?: boolean;
}) {
  const json = JSON.stringify(action.body);
  const Tag = onSelect ? "button" : "div";
  return (
    <Tag
      type={onSelect ? "button" : undefined}
      onClick={onSelect}
      className={cn(
        "block w-full rounded-md px-2 py-1 text-left font-mono text-[11px] leading-relaxed transition-colors",
        wrap ? "break-all whitespace-pre-wrap" : "truncate",
        onSelect && "hover:bg-surface-2",
        active && "bg-accent-soft ring-accent/40 ring-1",
      )}
    >
      <span className="text-subtle">{"{"}</span>
      <span className={cn("font-semibold", actionColor[action.type])}>
        &quot;{action.type}&quot;
      </span>
      <span className="text-subtle">:</span>
      <span className="text-muted">{json}</span>
      <span className="text-subtle">{"}"}</span>
    </Tag>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] font-medium", className)}>
      {children}
    </span>
  );
}

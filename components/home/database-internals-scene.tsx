"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: one query's journey down through the engine, then what keeps data safe. */
const PARTS: Part[] = [
  {
    id: "query",
    name: "A query arrives",
    text: "SQL text over a connection: what you want, not how to get it (module 1).",
  },
  {
    id: "planner",
    name: "The planner",
    text: "parses the SQL and picks the cheapest plan from statistics and cost estimates (modules 10–12).",
  },
  {
    id: "executor",
    name: "The executor",
    text: "runs scans and joins, using an index when one fits (modules 6–9, 11).",
  },
  {
    id: "buffer",
    name: "The buffer pool",
    text: "keeps hot pages in memory so most reads never touch the disk (modules 2, 5).",
  },
  {
    id: "storage",
    name: "Pages on disk",
    text: "rows packed into fixed-size pages: heaps, B-trees, LSM files, rows or columns (modules 3, 4, 6, 8).",
  },
  {
    id: "wal",
    name: "The write-ahead log",
    text: "every change is logged before pages are written, so a crash loses nothing committed (modules 13, 14).",
  },
  {
    id: "txn",
    name: "Transactions",
    text: "isolation levels, locks and row versions keep concurrent users from tripping over each other (modules 15–17).",
  },
  {
    id: "replica",
    name: "Copies elsewhere",
    text: "the log streams to replicas, or to consensus groups across machines (modules 18, 19).",
  },
];

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className={cn("font-mono text-[7.5px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (ids: string[]) => ({
    opacity: ids.includes(active) ? 1 : 0.35,
    transition: { duration: 0.35 },
  });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  const flow = (d: string, ids: string[], key: string) => (
    <motion.path
      key={key}
      d={d}
      className="stroke-accent"
      strokeWidth={1.3}
      strokeDasharray="3 4"
      animate={{ strokeDashoffset: [14, 0], opacity: ids.includes(active) ? 1 : 0.35 }}
      transition={{ strokeDashoffset: { repeat: Infinity, duration: 1.1, ease: "linear" } }}
    />
  );
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <motion.g animate={f(["query"])} {...hit("query")}>
        <Box x={8} y={14} w={150} h={22} label="SELECT … WHERE id = 42" on={active === "query"} />
      </motion.g>
      {flow("M83 36V48", ["query", "planner"], "a")}
      <motion.g animate={f(["planner"])} {...hit("planner")}>
        <Box x={28} y={50} w={110} h={22} label="parse → plan" on={active === "planner"} />
      </motion.g>
      {flow("M83 72V84", ["planner", "executor"], "b")}
      <motion.g animate={f(["executor"])} {...hit("executor")}>
        <Box x={28} y={86} w={110} h={22} label="Index Scan" on={active === "executor"} />
      </motion.g>
      {flow("M83 108V120", ["executor", "buffer"], "c")}
      <motion.g animate={f(["buffer"])} {...hit("buffer")}>
        <Box x={8} y={122} w={150} h={22} label="buffer pool (memory)" on={active === "buffer"} />
      </motion.g>
      {flow("M83 144V156", ["buffer", "storage"], "d")}
      <motion.g animate={f(["storage"])} {...hit("storage")}>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <rect
            key={k}
            x={12 + k * 24}
            y={158}
            width={20}
            height={18}
            rx={2}
            className={
              active === "storage" && k === 2
                ? "fill-viz-data/30 stroke-viz-data"
                : "fill-surface stroke-line-strong"
            }
            strokeWidth={1}
          />
        ))}
        <text x={12} y={188} className="fill-muted font-mono text-[6.5px]">
          8 KB pages on disk
        </text>
      </motion.g>
      <motion.g animate={f(["wal"])} {...hit("wal")}>
        <path d="M158 133H196" className="stroke-viz-meta" strokeWidth={1.3} />
        {[0, 1, 2, 3, 4].map((k) => (
          <rect
            key={k}
            x={198 + k * 14}
            y={126}
            width={12}
            height={14}
            rx={2}
            className={
              active === "wal"
                ? "fill-viz-meta/25 stroke-viz-meta"
                : "fill-surface stroke-line-strong"
            }
            strokeWidth={1}
          />
        ))}
        <text x={198} y={152} className="fill-muted font-mono text-[6.5px]">
          write-ahead log
        </text>
      </motion.g>
      <motion.g animate={f(["txn"])} {...hit("txn")}>
        <Box x={196} y={50} w={96} h={22} label="T1 · T2 · locks" on={active === "txn"} />
        <text x={196} y={84} className="fill-muted font-mono text-[6.5px]">
          isolation · MVCC
        </text>
      </motion.g>
      <motion.g animate={f(["replica", "wal"])} {...hit("replica")}>
        {flow("M268 133H306", ["replica", "wal"], "e")}
        <Box x={308} y={122} w={64} h={22} label="replica" on={active === "replica"} />
        <Box x={308} y={152} w={64} h={22} label="replica" on={active === "replica"} />
      </motion.g>
      <text x={196} y={30} className="fill-muted font-mono text-[7px]">
        one query&apos;s journey
      </text>
    </svg>
  );
}

/** Database Internals showcase: a query's journey through the engine; click any part. */
export function DatabaseInternalsScene() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((n) => (n + 1) % PARTS.length), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const part = PARTS[i];
  return (
    <div className="flex flex-col gap-3">
      <Diagram
        active={part.id}
        onSelect={(id) => {
          setAuto(false);
          setI(PARTS.findIndex((p) => p.id === id));
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={part.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{part.name}:</span> {part.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

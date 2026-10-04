"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from producers to the people who rely on the numbers. */
const PARTS: Part[] = [
  {
    id: "contracts",
    name: "Producers and contracts",
    text: "a written, checked promise about shape, meaning and freshness, with schema rules so changes don't break readers (modules 8–9).",
  },
  {
    id: "tests",
    name: "Tests where data lands",
    text: "rules as code run before data is published; bad rows are quarantined or the load stops (modules 3–7).",
  },
  {
    id: "tables",
    name: "Tables with owners",
    text: "every important dataset has an owner and a freshness objective with an error budget (modules 10–11).",
  },
  {
    id: "monitors",
    name: "Monitors on the data",
    text: "freshness, volume, schema and distributions, judged against a learned, seasonal baseline (modules 12–13).",
  },
  {
    id: "lineage",
    name: "Lineage",
    text: "the map that finds a fault's cause upstream and everyone it touched downstream (module 14).",
  },
  {
    id: "recon",
    name: "Reconciliation",
    text: "counts, totals and row diffs against an independent source prove nothing was lost (modules 16–18).",
  },
  {
    id: "consumers",
    name: "Reports, models and AI",
    text: "the decisions the data must be fit for, including machine learning and AI applications (modules 1–2, 19).",
  },
  {
    id: "incident",
    name: "When something slips through",
    text: "declare, contain, tell people, repair with idempotent backfills, then a blameless review (module 15).",
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
        className={cn("font-mono text-[7px]", on ? "fill-accent" : "fill-fg")}
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
  const on = (id: string) => active === id;
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <motion.g animate={f(["contracts"])} {...hit("contracts")}>
        {["checkout", "payments", "partner"].map((t, i) => (
          <Box key={t} x={8} y={18 + i * 28} w={58} h={18} label={t} on={on("contracts")} />
        ))}
        <path d="M66 27 H80 M66 55 H80 M66 83 H80" className="stroke-line-strong" strokeWidth={1} />
        <Box x={80} y={18} w={22} h={83} label="✎" on={on("contracts")} />
      </motion.g>
      <motion.g animate={f(["tests"])} {...hit("tests")}>
        <path d="M102 60 H116" className="stroke-line-strong" strokeWidth={1} />
        <Box x={116} y={44} w={54} h={32} label="tests ✓" on={on("tests")} />
        <Box x={116} y={88} w={54} h={14} label="quarantine" on={on("tests")} />
      </motion.g>
      <motion.g animate={f(["tables", "lineage"])} {...hit("tables")}>
        <path d="M170 60 H186" className="stroke-line-strong" strokeWidth={1} />
        {["orders", "revenue", "customers"].map((t, i) => (
          <Box key={t} x={186} y={22 + i * 28} w={60} h={18} label={t} on={on("tables")} />
        ))}
      </motion.g>
      <motion.g animate={f(["lineage"])} {...hit("lineage")}>
        <path
          d="M246 31 C 262 31, 262 50, 278 50 M246 59 C 262 59, 262 50, 278 50 M246 59 C 262 59, 262 90, 278 90"
          className={on("lineage") ? "stroke-accent" : "stroke-line-strong"}
          strokeWidth={1}
        />
      </motion.g>
      <motion.g animate={f(["consumers"])} {...hit("consumers")}>
        {["board report", "ML model"].map((t, i) => (
          <Box key={t} x={278} y={40 + i * 40} w={92} h={20} label={t} on={on("consumers")} />
        ))}
      </motion.g>
      <motion.g animate={f(["monitors"])} {...hit("monitors")}>
        <Box x={186} y={112} w={60} h={18} label="monitors" on={on("monitors")} />
        <path d="M216 112 V104" className="stroke-line-strong" strokeWidth={1} />
        {[0, 1, 2].map((k) => (
          <circle key={k} r={2.2} className="fill-viz-meta">
            <animateMotion
              dur="2.4s"
              begin={`-${k * 0.8}s`}
              repeatCount="indefinite"
              path="M216 104 V112"
            />
          </circle>
        ))}
      </motion.g>
      <motion.g animate={f(["recon"])} {...hit("recon")}>
        <Box x={278} y={112} w={92} h={18} label="reconcile vs bank" on={on("recon")} />
        <path
          d="M324 112 V100"
          className="stroke-line-strong"
          strokeWidth={1}
          strokeDasharray="2 2"
        />
      </motion.g>
      <motion.g animate={f(["incident"])} {...hit("incident")}>
        <Box
          x={8}
          y={146}
          w={238}
          h={20}
          label="incident: contain · tell · repair · review"
          on={on("incident")}
        />
      </motion.g>
      <text x={10} y={192} className="fill-muted font-mono text-[7px]">
        defences at every stage, from producer to decision
      </text>
    </svg>
  );
}

/** Data Quality showcase: a pipeline with its defences, toured part by part; click any part. */
export function DataQualityScene() {
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

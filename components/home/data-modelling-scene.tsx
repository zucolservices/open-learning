"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from source systems to the numbers people see. */
const PARTS: Part[] = [
  {
    id: "sources",
    name: "Source systems",
    text: "apps and payments, modelled to keep each fact once: keys and normalisation (modules 3–5).",
  },
  {
    id: "staging",
    name: "Staging and integration",
    text: "cleaned one source at a time; a vault or normalised layer if many sources must be integrated (modules 12, 13, 16).",
  },
  {
    id: "facts",
    name: "Fact tables",
    text: "one declared grain each: transactions, snapshots, pipelines (modules 6–8).",
  },
  {
    id: "dims",
    name: "Conformed dimensions",
    text: "shared by every fact, with patterns for roles and flags, and history kept on purpose (modules 9–11).",
  },
  {
    id: "semantic",
    name: "The semantic layer",
    text: "metrics defined once, so every tool gets the same numbers (module 15).",
  },
  {
    id: "consumers",
    name: "Dashboards, notebooks, AI",
    text: "reading stars or wide tables built from them (module 14).",
  },
  {
    id: "change",
    name: "Change, safely",
    text: "names, contracts, versions and dates on every fact (modules 19–20).",
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
      <motion.g animate={f(["sources"])} {...hit("sources")}>
        {["shop app", "payments", "CRM"].map((t, i) => (
          <Box key={t} x={10} y={20 + i * 30} w={60} h={20} label={t} on={on("sources")} />
        ))}
      </motion.g>
      <motion.g animate={f(["staging"])} {...hit("staging")}>
        <path d="M70 30 H90 M70 60 H90 M70 90 H90" className="stroke-line-strong" strokeWidth={1} />
        <Box x={90} y={20} w={60} h={90} label="stg / vault" on={on("staging")} />
      </motion.g>
      <motion.g animate={f(["dims", "facts"])} {...hit("dims")}>
        {[
          [175, 14, "date"],
          [255, 14, "customer"],
          [175, 100, "restaurant"],
          [255, 100, "zone"],
        ].map(([x, y, t]) => (
          <Box
            key={t as string}
            x={x as number}
            y={y as number}
            w={56}
            h={16}
            label={t as string}
            on={on("dims")}
          />
        ))}
      </motion.g>
      <motion.g animate={f(["facts"])} {...hit("facts")}>
        <path d="M150 65 H185" className="stroke-line-strong" strokeWidth={1} />
        <Box x={185} y={50} w={44} h={30} label="orders" on={on("facts")} />
        <Box x={245} y={50} w={56} h={30} label="deliveries" on={on("facts")} />
        <path
          d="M203 30 V50 M283 30 V50 M203 80 V100 M283 80 V100"
          className="stroke-line-strong"
          strokeWidth={0.8}
        />
      </motion.g>
      <motion.g animate={f(["semantic"])} {...hit("semantic")}>
        <Box
          x={175}
          y={136}
          w={126}
          h={18}
          label="semantic layer: metrics once"
          on={on("semantic")}
        />
        {[0, 1, 2].map((k) => (
          <circle key={k} r={2.5} className="fill-viz-meta">
            <animateMotion
              dur="2.6s"
              begin={`-${k * 0.9}s`}
              repeatCount="indefinite"
              path="M301 145 H344 V102"
            />
          </circle>
        ))}
      </motion.g>
      <motion.g animate={f(["consumers"])} {...hit("consumers")}>
        {["dashboards", "notebooks", "AI"].map((t, i) => (
          <Box key={t} x={315} y={40 + i * 40} w={58} h={22} label={t} on={on("consumers")} />
        ))}
      </motion.g>
      <motion.g animate={f(["change"])} {...hit("change")}>
        <Box
          x={10}
          y={150}
          w={140}
          h={20}
          label="contracts · versions · catalog"
          on={on("change")}
        />
      </motion.g>
      <text x={10} y={192} className="fill-muted font-mono text-[7px]">
        from source systems to one set of numbers
      </text>
    </svg>
  );
}

/** Data Modelling showcase: a modelled warehouse, toured part by part; click any part. */
export function DataModellingScene() {
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

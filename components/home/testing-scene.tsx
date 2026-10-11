"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: the safety nets around a change, from choosing tests to production. */
const PARTS: Part[] = [
  {
    id: "choose",
    name: "Choosing what to test",
    text: "partitions, boundaries and a deliberate mix of test sizes (modules 1–4).",
  },
  {
    id: "unit",
    name: "Unit tests",
    text: "fast, focused checks of small pieces, with stand-ins, readable names and small test-first loops (modules 5–8).",
  },
  {
    id: "integration",
    name: "Integration and contracts",
    text: "real databases and queues in throwaway containers; agreements between teams (modules 9–10).",
  },
  {
    id: "e2e",
    name: "UI and end-to-end",
    text: "query what users see; a few critical journeys through a real browser (modules 11–12).",
  },
  {
    id: "quality",
    name: "Test quality",
    text: "coverage as a flashlight, mutants that test your tests, flaky tests fixed, fresh data (modules 13–16).",
  },
  {
    id: "advanced",
    name: "Advanced techniques",
    text: "properties and fuzzing, performance budgets, and safety nets for legacy code (modules 17–19).",
  },
  {
    id: "ci",
    name: "Every change, in CI",
    text: "fast pipelines that keep the main branch green (module 20).",
  },
  {
    id: "prod",
    name: "Exploring and production",
    text: "people exploring what scripts can't, and gradual rollouts behind flags (modules 21–22).",
  },
];

function Box({
  x,
  y,
  w,
  label,
  on,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  on: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={22}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + 14}
        textAnchor="middle"
        className={cn("font-mono text-[7px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (id: string) => ({ opacity: id === active ? 1 : 0.4, transition: { duration: 0.35 } });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  const layer = (id: string, x: number, y: number, w: number, label: string) => (
    <motion.g animate={f(id)} {...hit(id)}>
      <rect
        x={x}
        y={y}
        width={w}
        height={26}
        rx={4}
        className={
          active === id ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"
        }
        strokeWidth={active === id ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + 16}
        textAnchor="middle"
        className={cn("font-mono text-[7px]", active === id ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </motion.g>
  );
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      {layer("e2e", 80, 40, 70, "end-to-end")}
      {layer("integration", 55, 72, 120, "integration · contract")}
      {layer("unit", 30, 104, 170, "unit tests")}
      {layer("choose", 30, 136, 170, "choose cases · mix sizes")}
      <motion.g animate={f("quality")} {...hit("quality")}>
        <path
          d="M212 70 A30 30 0 1 1 212 130"
          className={active === "quality" ? "stroke-accent" : "stroke-line-strong"}
          strokeWidth={1.4}
        />
        <text x={250} y={104} textAnchor="middle" className="fill-muted font-mono text-[7px]">
          quality
        </text>
      </motion.g>
      <motion.g animate={f("advanced")} {...hit("advanced")}>
        <Box x={290} y={86} w={80} label="properties · perf" on={active === "advanced"} />
      </motion.g>
      <motion.g animate={f("ci")} {...hit("ci")}>
        <Box x={290} y={40} w={80} label="CI on every change" on={active === "ci"} />
      </motion.g>
      <motion.g animate={f("prod")} {...hit("prod")}>
        <Box x={290} y={136} w={80} label="explore · roll out" on={active === "prod"} />
      </motion.g>
      <text x={10} y={20} className="fill-muted font-mono text-[7px]">
        the safety nets around every change
      </text>
    </svg>
  );
}

/** Testing showcase: the layers of safety nets a change passes through, toured part by part; click any part. */
export function TestingScene() {
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

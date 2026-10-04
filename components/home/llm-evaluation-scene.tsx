"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: round the evaluation loop, from defining good to watching production. */
const PARTS: Part[] = [
  {
    id: "criteria",
    name: "Success criteria",
    text: "decide what good means, with thresholds, before measuring anything (modules 1–2).",
  },
  {
    id: "set",
    name: "The eval set",
    text: "real cases, edge cases and attacks, with a held-out test set, kept out of training (modules 3, 13).",
  },
  {
    id: "graders",
    name: "Graders",
    text: "code checks where possible, similarity metrics with care, LLM judges for the rest (modules 4–6).",
  },
  {
    id: "people",
    name: "People",
    text: "experts calibrate the judge and rate what only people can (modules 7–8).",
  },
  {
    id: "stats",
    name: "Statistics",
    text: "error bars, paired comparisons and several runs per case, so noise isn't mistaken for progress (modules 9–11).",
  },
  {
    id: "risk",
    name: "Safety and fairness",
    text: "attack and over-refusal sets, swap tests, and whole-system checks for RAG and agents (modules 14–16).",
  },
  {
    id: "ship",
    name: "Ship",
    text: "evals as tests in CI, then a canary release (module 17).",
  },
  {
    id: "watch",
    name: "Watch production",
    text: "online judges, rules and feedback; new failures become new cases (modules 18–19).",
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
  const PATH =
    "M60 51 H320 Q350 51 350 85 V109 Q350 141 320 141 H60 Q30 141 30 109 V85 Q30 51 60 51";
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <path d={PATH} className="stroke-line-strong" strokeWidth={1} />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} r={2.4} className="fill-accent">
          <animateMotion dur="6s" begin={`-${k * 1.5}s`} repeatCount="indefinite" path={PATH} />
        </circle>
      ))}
      <motion.g animate={f(["criteria"])} {...hit("criteria")}>
        <Box x={36} y={40} w={70} h={22} label="criteria" on={on("criteria")} />
      </motion.g>
      <motion.g animate={f(["set"])} {...hit("set")}>
        <Box x={122} y={40} w={70} h={22} label="eval set" on={on("set")} />
      </motion.g>
      <motion.g animate={f(["graders"])} {...hit("graders")}>
        <Box x={208} y={40} w={70} h={22} label="graders" on={on("graders")} />
      </motion.g>
      <motion.g animate={f(["people"])} {...hit("people")}>
        <Box x={294} y={40} w={70} h={22} label="people" on={on("people")} />
      </motion.g>
      <motion.g animate={f(["stats"])} {...hit("stats")}>
        <Box x={294} y={130} w={70} h={22} label="error bars" on={on("stats")} />
      </motion.g>
      <motion.g animate={f(["risk"])} {...hit("risk")}>
        <Box x={208} y={130} w={70} h={22} label="safety · fairness" on={on("risk")} />
      </motion.g>
      <motion.g animate={f(["ship"])} {...hit("ship")}>
        <Box x={122} y={130} w={70} h={22} label="CI · canary" on={on("ship")} />
      </motion.g>
      <motion.g animate={f(["watch"])} {...hit("watch")}>
        <Box x={36} y={130} w={70} h={22} label="production" on={on("watch")} />
      </motion.g>
      <text x={190} y={100} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        failures become new cases
      </text>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        the evaluation loop, from defining good to watching production
      </text>
    </svg>
  );
}

/** LLM Evaluation showcase: the evaluation loop, toured part by part; click any part. */
export function LlmEvaluationScene() {
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

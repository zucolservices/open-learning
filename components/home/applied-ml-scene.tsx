"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: round the ML lifecycle, from framing a question to watching a live model. */
const PARTS: Part[] = [
  {
    id: "frame",
    name: "Frame",
    text: "turn a business question into a label, a baseline and an action (modules 1–3).",
  },
  {
    id: "data",
    name: "Data",
    text: "honest train, validation and test splits; useful features; no leaks from the future (modules 4–6).",
  },
  {
    id: "model",
    name: "Model",
    text: "linear models, trees and boosted ensembles, balancing underfitting and overfitting (modules 7–11).",
  },
  {
    id: "evaluate",
    name: "Evaluate",
    text: "metrics that fit the decision: precision and recall, regression errors, rare events, calibrated probabilities (modules 12–15).",
  },
  {
    id: "improve",
    name: "Tune and explain",
    text: "search hyperparameters without fooling yourself, and explain what the model relies on (modules 16–17).",
  },
  {
    id: "serve",
    name: "Serve",
    text: "batch, online or on device, with one feature definition for training and serving (module 19).",
  },
  {
    id: "watch",
    name: "Monitor",
    text: "watch drift, predictions and outcomes; retrain when the world moves (module 20).",
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
      <motion.g animate={f(["frame"])} {...hit("frame")}>
        <Box x={36} y={40} w={70} h={22} label="frame" on={on("frame")} />
      </motion.g>
      <motion.g animate={f(["data"])} {...hit("data")}>
        <Box x={122} y={40} w={70} h={22} label="data · features" on={on("data")} />
      </motion.g>
      <motion.g animate={f(["model"])} {...hit("model")}>
        <Box x={208} y={40} w={70} h={22} label="model" on={on("model")} />
      </motion.g>
      <motion.g animate={f(["evaluate"])} {...hit("evaluate")}>
        <Box x={294} y={40} w={70} h={22} label="evaluate" on={on("evaluate")} />
      </motion.g>
      <motion.g animate={f(["improve"])} {...hit("improve")}>
        <Box x={294} y={130} w={70} h={22} label="tune · explain" on={on("improve")} />
      </motion.g>
      <motion.g animate={f(["serve"])} {...hit("serve")}>
        <Box x={165} y={130} w={70} h={22} label="serve" on={on("serve")} />
      </motion.g>
      <motion.g animate={f(["watch"])} {...hit("watch")}>
        <Box x={36} y={130} w={70} h={22} label="monitor" on={on("watch")} />
      </motion.g>
      <text x={190} y={100} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        drift sends you back to the data
      </text>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        the ML lifecycle, from a business question to a model you keep watching
      </text>
    </svg>
  );
}

/** Applied ML showcase: the ML lifecycle, toured part by part; click any part. */
export function AppliedMlScene() {
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

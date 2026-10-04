"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: one query, from code on the driver to files on storage. */
const PARTS: Part[] = [
  {
    id: "code",
    name: "Your code",
    text: "a DataFrame query or SQL, written once; nothing runs until an action (modules 3–6).",
  },
  {
    id: "catalyst",
    name: "Catalyst",
    text: "turns it into an optimised plan: filters pushed down, columns pruned, a join strategy picked (modules 7 and 10).",
  },
  {
    id: "stages",
    name: "Stages and tasks",
    text: "the driver cuts the plan at each shuffle and runs one task per partition (modules 5 and 8).",
  },
  {
    id: "shuffle",
    name: "The shuffle",
    text: "every map task sends a block to every reduce task: the costliest step (module 9).",
  },
  {
    id: "aqe",
    name: "Adaptive execution",
    text: "looks at real sizes after each shuffle and re-plans: merge tiny partitions, split skewed ones (modules 11 and 13).",
  },
  {
    id: "executors",
    name: "Executors",
    text: "run tasks in fused, vectorised code, with memory shared between work and cache (modules 12, 14 and 15).",
  },
  {
    id: "files",
    name: "Files",
    text: "read only the folders and columns needed; written as a few big files, not millions of tiny ones (module 16).",
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
      <motion.g animate={f(["code"])} {...hit("code")}>
        <Box x={10} y={10} w={80} h={20} label="df.groupBy(…)" on={on("code")} />
      </motion.g>
      <motion.g animate={f(["catalyst"])} {...hit("catalyst")}>
        <path d="M90 20 H108" className="stroke-line-strong" strokeWidth={1} />
        <Box x={108} y={10} w={80} h={20} label="Catalyst plan" on={on("catalyst")} />
      </motion.g>
      <motion.g animate={f(["stages", "shuffle", "aqe"])} {...hit("stages")}>
        <path d="M188 20 H206" className="stroke-line-strong" strokeWidth={1} />
        <rect
          x={206}
          y={6}
          width={164}
          height={28}
          rx={6}
          className={on("stages") ? "fill-accent/10 stroke-accent" : "stroke-line-strong"}
          strokeDasharray="4 3"
        />
        <text x={288} y={23} textAnchor="middle" className="fill-muted font-mono text-[7px]">
          driver: job → stages → tasks
        </text>
      </motion.g>
      <motion.g animate={f(["stages", "executors"])} {...hit("executors")}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={i}
            x={22 + i * 22}
            y={56}
            width={16}
            height={40}
            rx={3}
            className={
              on("executors")
                ? "fill-viz-compute/30 stroke-viz-compute"
                : "fill-viz-data/20 stroke-viz-data"
            }
          />
        ))}
        <text x={82} y={50} textAnchor="middle" className="fill-muted font-mono text-[6.5px]">
          stage 1 · map tasks
        </text>
      </motion.g>
      <motion.g animate={f(["shuffle"])} {...hit("shuffle")}>
        {[0, 1, 2, 3, 4, 5].map((i) =>
          [0, 1, 2].map((j) => (
            <path
              key={`${i}${j}`}
              d={`M${38 + i * 22} 76 L${224 + j * 50} 76`}
              className={on("shuffle") ? "stroke-accent/50" : "stroke-line"}
              strokeWidth={0.6}
            />
          )),
        )}
        {[0, 1, 2].map((k) => (
          <rect key={k} width={6} height={4} rx={1} className="fill-accent">
            <animateMotion
              dur="2.4s"
              begin={`-${k * 0.8}s`}
              repeatCount="indefinite"
              path={`M${60 + k * 30} 74 L${226 + k * 50} 74`}
            />
          </rect>
        ))}
      </motion.g>
      <motion.g animate={f(["aqe"])} {...hit("aqe")}>
        <Box x={168} y={104} w={92} h={18} label="AQE: re-plan" on={on("aqe")} />
      </motion.g>
      <motion.g animate={f(["stages", "executors", "aqe"])} {...hit("executors")}>
        {[0, 1, 2].map((j) => (
          <rect
            key={j}
            x={226 + j * 50}
            y={56}
            width={36}
            height={40}
            rx={3}
            className={
              on("executors")
                ? "fill-viz-compute/30 stroke-viz-compute"
                : "fill-viz-data/20 stroke-viz-data"
            }
          />
        ))}
        <text x={300} y={50} textAnchor="middle" className="fill-muted font-mono text-[6.5px]">
          stage 2 · reduce tasks
        </text>
      </motion.g>
      <motion.g animate={f(["files"])} {...hit("files")}>
        {["date=…01/", "date=…02/", "date=…03/"].map((t, i) => (
          <Box key={t} x={20 + i * 70} y={142} w={62} h={18} label={t} on={on("files")} />
        ))}
        <Box x={232} y={142} w={138} h={18} label="few big Parquet files" on={on("files")} />
        <path
          d="M82 96 V142"
          className="stroke-line-strong"
          strokeWidth={1}
          strokeDasharray="3 2"
        />
        <path
          d="M300 96 V142"
          className="stroke-line-strong"
          strokeWidth={1}
          strokeDasharray="3 2"
        />
      </motion.g>
      <text x={10} y={190} className="fill-muted font-mono text-[7px]">
        one query, from code to files
      </text>
    </svg>
  );
}

/** Apache Spark showcase: one query's journey, toured part by part; click any part. */
export function SparkScene() {
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

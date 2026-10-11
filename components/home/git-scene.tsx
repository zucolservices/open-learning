"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: a change's journey through Git, from your editor to the team and back. */
const PARTS: Part[] = [
  {
    id: "areas",
    name: "The three areas",
    text: "edit in the working tree, stage what belongs together, commit it to the repository (modules 1–3).",
  },
  {
    id: "commits",
    name: "Commits",
    text: "snapshots named by a hash of their content, each pointing to its parent (modules 2, 4).",
  },
  {
    id: "branch",
    name: "Branches",
    text: "cheap pointers, so you can try an idea without touching main (module 5).",
  },
  {
    id: "merge",
    name: "Merge, rebase, conflicts",
    text: "bring work back together, and resolve it calmly when two people changed the same lines (modules 6–9).",
  },
  {
    id: "remote",
    name: "Remotes and pull requests",
    text: "fetch, push and propose changes for review, with a branching strategy the team agrees on (modules 10–13).",
  },
  {
    id: "undo",
    name: "Undo and recovery",
    text: "restore, reset, revert, the reflog, stash and bisect: almost nothing is truly lost (modules 14–17).",
  },
  {
    id: "scale",
    name: "Scale and security",
    text: "big repositories, monorepos, signed commits, secrets and hooks (modules 18–21).",
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
  const dot = (x: number, y: number, cls = "fill-viz-data/30 stroke-viz-data") => (
    <>
      <circle cx={x} cy={y} r={6} className="fill-surface" />
      <circle cx={x} cy={y} r={6} className={cls} strokeWidth={1.4} />
    </>
  );
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <motion.g animate={f("areas")} {...hit("areas")}>
        {["working", "staging", "repo"].map((l, i) => (
          <Box key={l} x={14} y={60 + i * 34} w={58} label={l} on={active === "areas"} />
        ))}
      </motion.g>
      <path d="M76 139 H104" className="stroke-line-strong" strokeWidth={1} strokeDasharray="3 3" />
      <motion.g animate={f("commits")} {...hit("commits")}>
        <path d="M112 139 H186" className="stroke-line-strong" strokeWidth={1.4} />
        {dot(112, 139)}
        {dot(149, 139)}
        {dot(186, 139, active === "commits" ? "fill-accent/30 stroke-accent" : undefined)}
      </motion.g>
      <motion.g animate={f("branch")} {...hit("branch")}>
        <path
          d="M149 139 C170 139 170 100 196 100 H232"
          className="stroke-line-strong"
          strokeWidth={1.4}
        />
        {dot(196, 100, "fill-viz-meta/30 stroke-viz-meta")}
        {dot(232, 100, "fill-viz-meta/30 stroke-viz-meta")}
      </motion.g>
      <motion.g animate={f("merge")} {...hit("merge")}>
        <path
          d="M186 139 H262 M232 100 C250 100 250 139 262 139"
          className="stroke-line-strong"
          strokeWidth={1.4}
        />
        {dot(
          262,
          139,
          active === "merge" ? "fill-accent/30 stroke-accent" : "fill-viz-meta/30 stroke-viz-meta",
        )}
      </motion.g>
      <motion.g animate={f("remote")} {...hit("remote")}>
        <Box x={236} y={30} w={100} label="origin · pull request" on={active === "remote"} />
        <path
          d="M268 130 L284 56"
          className="stroke-line-strong"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      </motion.g>
      <motion.g animate={f("undo")} {...hit("undo")}>
        <path
          d="M262 152 Q187 188 112 152"
          className={active === "undo" ? "stroke-accent" : "stroke-line-strong"}
          strokeWidth={1.2}
          strokeDasharray="3 3"
        />
        <text x={187} y={190} textAnchor="middle" className="fill-muted font-mono text-[7px]">
          reflog · revert · reset
        </text>
      </motion.g>
      <motion.g animate={f("scale")} {...hit("scale")}>
        <Box x={296} y={128} w={72} label="hooks · signing" on={active === "scale"} />
      </motion.g>
      <text x={10} y={20} className="fill-muted font-mono text-[7px]">
        a change&apos;s journey through Git
      </text>
    </svg>
  );
}

/** Git showcase: a change’s journey through Git, toured part by part; click any part. */
export function GitScene() {
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

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from a commit to users, then the guard rails. */
const PARTS: Part[] = [
  {
    id: "commit",
    name: "A small commit",
    text: "a short-lived branch and a pull request, merged into main at least daily (module 2).",
  },
  {
    id: "ci",
    name: "Continuous integration",
    text: "every change built from a lockfile and tested within minutes, on fresh runners (modules 3–6).",
  },
  {
    id: "gates",
    name: "Quality gates",
    text: "required checks, a reviewer, code owners and a merge queue keep main releasable (module 7).",
  },
  {
    id: "artifact",
    name: "One artifact",
    text: "built once, given a version that never changes, stored in a registry (modules 8, 9).",
  },
  {
    id: "envs",
    name: "Environments",
    text: "the same artifact promoted through test and staging; only settings change (modules 10, 11).",
  },
  {
    id: "canary",
    name: "Canary release",
    text: "production sees it first on a few users; metrics widen the rollout or pull it back (modules 12, 13, 16).",
  },
  {
    id: "flags",
    name: "Feature flags",
    text: "deployed code switched on gradually, with a kill switch (module 14).",
  },
  {
    id: "secure",
    name: "A locked-down pipeline",
    text: "short-lived OIDC credentials, pinned actions and signed provenance (modules 17, 18).",
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

const ROW = 70;

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
  const stages: [string, string, number, number][] = [
    ["commit", "commit", 8, 44],
    ["ci", "build + test", 62, 58],
    ["gates", "gates", 130, 44],
    ["artifact", "artifact", 184, 48],
    ["envs", "staging", 242, 50],
    ["canary", "canary", 302, 50],
  ];
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      {stages.map(([id, , x, w], k) => {
        const next = stages[k + 1];
        const end = next ? next[2] : 352;
        return (
          <motion.path
            key={`link-${id}`}
            d={`M${x + w} ${ROW + 11}H${end}`}
            className="stroke-accent"
            strokeWidth={1.2}
            strokeDasharray="3 4"
            animate={{ strokeDashoffset: [14, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
        );
      })}
      {stages.map(([id, label, x, w]) => (
        <motion.g key={id} animate={f([id])} {...hit(id)}>
          <Box x={x} y={ROW} w={w} h={22} label={label} on={active === id} />
        </motion.g>
      ))}
      <text x={356} y={ROW + 14} className="fill-muted font-mono text-[7px]">
        users
      </text>
      {/* canary users */}
      <motion.g animate={f(["canary", "flags"])} {...hit("canary")}>
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx={300 + (i % 5) * 11}
            cy={120 + Math.floor(i / 5) * 11}
            r={3.5}
            className={
              i === 0
                ? "fill-viz-compute/60 stroke-viz-compute"
                : "fill-viz-data/25 stroke-viz-data"
            }
          />
        ))}
      </motion.g>
      <motion.g animate={f(["flags"])} {...hit("flags")}>
        <rect
          x={200}
          y={118}
          width={34}
          height={16}
          rx={8}
          className="fill-viz-add/20 stroke-viz-add"
        />
        <motion.circle
          cx={208}
          cy={126}
          r={6}
          className="fill-viz-add"
          animate={{ x: active === "flags" ? [0, 18, 18] : 18 }}
          transition={{ duration: 1.4, repeat: active === "flags" ? Infinity : 0 }}
        />
        <text x={190} y={148} className="fill-muted font-mono text-[7px]">
          new-checkout
        </text>
      </motion.g>
      <motion.g animate={f(["secure"])} {...hit("secure")}>
        <path
          d="M70 122l12 4v8c0 7-5 11-12 14-7-3-12-7-12-14v-8z"
          className={
            active === "secure" ? "fill-accent/20 stroke-accent" : "fill-surface stroke-line-strong"
          }
          strokeWidth={1.3}
        />
        <text x={92} y={136} className="fill-muted font-mono text-[7px]">
          OIDC · pinned · signed
        </text>
      </motion.g>
      <motion.g animate={f(["ci"])} {...hit("ci")}>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${78 + i * 12} ${ROW - 14}l3 3 6-6`}
            className="stroke-viz-add"
            strokeWidth={1.4}
          />
        ))}
      </motion.g>
      <text x={8} y={186} className="fill-muted font-mono text-[7px]">
        minutes from commit to the first users
      </text>
    </svg>
  );
}

/** CI/CD showcase: a delivery pipeline, toured part by part; click any part. */
export function CiCdScene() {
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

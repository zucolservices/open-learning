"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: an organisation's estate, from teams to legacy, and what keeps it changeable. */
const PARTS: Part[] = [
  {
    id: "teams",
    name: "Teams",
    text: "organised around business streams, so most changes stay inside one team (Conway's law, module 2).",
  },
  {
    id: "contexts",
    name: "Bounded contexts",
    text: "each with its own model and language: Applications, Eligibility, Payments (modules 3–7).",
  },
  {
    id: "events",
    name: "Messaging between them",
    text: "events on a broker, routed and transformed, with orchestration where one team owns a process (modules 8–12).",
  },
  {
    id: "inside",
    name: "Inside each service",
    text: "a core of business rules with adapters at the edge; data owned, not shared (modules 13–16).",
  },
  {
    id: "facade",
    name: "The façade",
    text: "routes each request to the old system or the new one, so legacy can be replaced piece by piece (module 17).",
  },
  {
    id: "legacy",
    name: "The legacy system",
    text: "still running, reached through an anticorruption layer and a change-data feed (module 18).",
  },
  {
    id: "governance",
    name: "Governance that guides",
    text: "decision records, fitness functions, a radar and a paved road (modules 19–20).",
  },
];

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
  dashed?: boolean;
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
        strokeDasharray={dashed ? "4 3" : undefined}
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
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <motion.g animate={f(["teams"])} {...hit("teams")}>
        {["apply team", "eligibility team", "payments team"].map((t, i) => (
          <Box key={t} x={20 + i * 92} y={8} w={84} h={18} label={t} on={active === "teams"} />
        ))}
      </motion.g>
      <motion.g animate={f(["contexts", "inside"])} {...hit("contexts")}>
        {["Applications", "Eligibility", "Payments"].map((t, i) => (
          <g key={t}>
            <rect
              x={20 + i * 92}
              y={36}
              width={84}
              height={52}
              rx={10}
              className={
                active === "contexts"
                  ? "fill-accent/10 stroke-accent"
                  : "stroke-line-strong fill-none"
              }
              strokeDasharray="4 3"
            />
            <text
              x={62 + i * 92}
              y={48}
              textAnchor="middle"
              className="fill-muted font-mono text-[6.5px]"
            >
              {t}
            </text>
          </g>
        ))}
      </motion.g>
      <motion.g animate={f(["inside"])} {...hit("inside")}>
        {[0, 1, 2].map((i) => (
          <polygon
            key={i}
            points={`${62 + i * 92},54 ${76 + i * 92},61 ${76 + i * 92},75 ${62 + i * 92},82 ${48 + i * 92},75 ${48 + i * 92},61`}
            className={
              active === "inside"
                ? "fill-accent/20 stroke-accent"
                : "fill-surface stroke-line-strong"
            }
          />
        ))}
      </motion.g>
      <motion.g animate={f(["events"])} {...hit("events")}>
        <rect
          x={20}
          y={96}
          width={268}
          height={14}
          rx={7}
          className={
            active === "events"
              ? "fill-viz-meta/20 stroke-viz-meta"
              : "fill-surface stroke-line-strong"
          }
        />
        <text x={154} y={106} textAnchor="middle" className="fill-fg font-mono text-[6.5px]">
          event broker
        </text>
        {[0, 1, 2].map((k) => (
          <circle key={k} r={2.5} className="fill-viz-meta">
            <animateMotion dur="3s" begin={`-${k}s`} repeatCount="indefinite" path="M30 103 H278" />
          </circle>
        ))}
      </motion.g>
      <motion.g animate={f(["facade", "legacy"])} {...hit("facade")}>
        <Box x={300} y={36} w={72} h={22} label="façade" on={active === "facade"} />
        <path d="M336 58V128" className="stroke-line-strong" strokeWidth={1} />
        <path d="M300 47H290" className="stroke-line-strong" strokeWidth={1} />
      </motion.g>
      <motion.g animate={f(["legacy"])} {...hit("legacy")}>
        <Box x={300} y={150} w={72} h={30} label="legacy" on={active === "legacy"} dashed />
        <Box x={300} y={128} w={72} h={14} label="ACL + CDC" on={active === "legacy"} />
        <path
          d="M288 110 C300 120 300 126 300 135"
          className="stroke-viz-meta"
          strokeWidth={1}
          strokeDasharray="3 2"
        />
      </motion.g>
      <motion.g animate={f(["governance"])} {...hit("governance")}>
        <Box
          x={20}
          y={140}
          w={130}
          h={20}
          label="ADRs · fitness functions"
          on={active === "governance"}
        />
        <Box
          x={160}
          y={140}
          w={128}
          h={20}
          label="radar · paved road"
          on={active === "governance"}
        />
      </motion.g>
      <text x={20} y={192} className="fill-muted font-mono text-[7px]">
        an estate built to keep changing
      </text>
    </svg>
  );
}

/** Enterprise Patterns showcase: a modernised estate, toured part by part; click any part. */
export function EnterprisePatternsScene() {
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

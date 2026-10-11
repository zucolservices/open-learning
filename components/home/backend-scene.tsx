"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from one request to a production service. */
const PARTS: Part[] = [
  {
    id: "found",
    name: "Foundations",
    text: "what a backend does, HTTP from the server's side, and handling many requests at once (modules 1–3).",
  },
  {
    id: "build",
    name: "Building a service",
    text: "structure, middleware, validation and errors, configuration and secrets (modules 4–7).",
  },
  {
    id: "data",
    name: "Data",
    text: "database access, migrations, transactions and caching (modules 8–11).",
  },
  { id: "id", name: "Identity", text: "authentication and authorization (modules 12–13)." },
  {
    id: "async",
    name: "Beyond request and response",
    text: "background jobs, webhooks, real-time connections and file uploads (modules 14–17).",
  },
  {
    id: "prod",
    name: "Production",
    text: "rate limits, resilience, logs and health checks, deployment; then a capstone order service (modules 18–22).",
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

const FLOW: [string, string, number][] = [
  ["found", "basics", 22],
  ["build", "service", 82],
  ["data", "data", 142],
  ["id", "identity", 202],
  ["async", "async", 262],
  ["prod", "prod", 322],
];

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (id: string) => ({ opacity: id === active ? 1 : 0.4, transition: { duration: 0.35 } });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  const PATH = "M20 101 H360";
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <path d={PATH} className="stroke-line-strong" strokeWidth={1} />
      {[0, 1, 2].map((k) => (
        <circle key={k} r={2.6} className="fill-viz-data">
          <animateMotion dur="7s" begin={`-${k * 2.3}s`} repeatCount="indefinite" path={PATH} />
        </circle>
      ))}
      {FLOW.map(([id, , x]) => (
        <rect key={`u-${id}`} x={x} y={90} width={50} height={22} rx={4} className="fill-surface" />
      ))}
      {FLOW.map(([id, label, x]) => (
        <motion.g key={id} animate={f(id)} {...hit(id)}>
          <Box x={x} y={90} w={50} label={label} on={active === id} />
        </motion.g>
      ))}
      <rect
        x={140}
        y={24}
        width={100}
        height={36}
        rx={5}
        className="fill-surface stroke-line-strong"
        strokeWidth={1}
      />
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={150}
          y={32 + k * 8}
          width={[70, 54, 62][k]}
          height={3.5}
          rx={1.75}
          className="fill-viz-idle/50"
        />
      ))}
      <line
        x1={190}
        y1={60}
        x2={190}
        y2={86}
        className="stroke-line-strong"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={190} y={150} textAnchor="middle" className="fill-muted font-mono text-[8px]">
        request → rules → data → response
      </text>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        correct, fast and safe under real traffic
      </text>
    </svg>
  );
}

/** Backend showcase: the track as a tour from one request to production; click any part. */
export function BackendScene() {
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

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * System Design showcase: one app's architecture growing from 100 users to 100 million.
 * Advances on its own; each stage can be picked.
 */

type Kind = "users" | "edge" | "lb" | "app" | "cache" | "db" | "replica" | "queue";
interface N {
  id: string;
  label: string;
  kind: Kind;
  x: number;
  y: number;
  from: number;
}

const STAGES = [
  { users: "100", text: "One server runs the app and the database. Perfectly fine." },
  { users: "10,000", text: "The database moves to its own machine so each can grow." },
  { users: "100,000", text: "A load balancer spreads users over several app servers." },
  { users: "1 million", text: "A cache answers hot reads; a replica takes the rest." },
  { users: "10 million", text: "A CDN serves files from near users; a queue absorbs slow work." },
  { users: "100 million", text: "A second region, for latency and for surviving disasters." },
];

const NODES: N[] = [
  { id: "users", label: "Users", kind: "users", x: 150, y: 16, from: 0 },
  { id: "cdn", label: "CDN", kind: "edge", x: 150, y: 52, from: 4 },
  { id: "lb", label: "Load balancer", kind: "lb", x: 150, y: 88, from: 2 },
  { id: "solo", label: "App + DB", kind: "app", x: 150, y: 128, from: 0 },
  { id: "app1", label: "App", kind: "app", x: 150, y: 128, from: 1 },
  { id: "app2", label: "App", kind: "app", x: 84, y: 128, from: 2 },
  { id: "app3", label: "App", kind: "app", x: 216, y: 128, from: 2 },
  { id: "cache", label: "Cache", kind: "cache", x: 70, y: 172, from: 3 },
  { id: "db", label: "Database", kind: "db", x: 150, y: 172, from: 1 },
  { id: "rep", label: "Replica", kind: "replica", x: 230, y: 172, from: 3 },
  { id: "queue", label: "Queue", kind: "queue", x: 150, y: 212, from: 4 },
  { id: "region", label: "Region 2", kind: "edge", x: 262, y: 88, from: 5 },
];

const FILL: Record<Kind, string> = {
  users: "var(--accent-soft)",
  edge: "var(--viz-meta)",
  lb: "var(--viz-compute)",
  app: "var(--viz-compute)",
  cache: "var(--viz-data)",
  db: "var(--viz-data)",
  replica: "var(--viz-data)",
  queue: "var(--viz-meta)",
};

const LINKS: [string, string, number][] = [
  ["users", "solo", 0],
  ["users", "app1", 1],
  ["users", "lb", 2],
  ["users", "cdn", 4],
  ["lb", "app1", 2],
  ["lb", "app2", 2],
  ["lb", "app3", 2],
  ["app1", "db", 1],
  ["app1", "cache", 3],
  ["app1", "rep", 3],
  ["app1", "queue", 4],
  ["lb", "region", 5],
];

function visible(n: N, stage: number) {
  if (n.id === "solo") return stage === 0;
  if (n.id === "app1") return stage >= 1;
  return stage >= n.from;
}

export function ScaleScene() {
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1">
        {STAGES.map((s, i) => (
          <button
            key={s.users}
            type="button"
            onClick={() => {
              setAuto(false);
              setStage(i);
            }}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[11px] transition",
              i === stage ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {s.users}
          </button>
        ))}
      </div>
      <svg
        viewBox="0 0 300 232"
        className="mx-auto w-full max-w-lg"
        role="img"
        aria-label="Architecture growing with its users"
      >
        {LINKS.map(([a, b, from]) => {
          const na = byId[a];
          const nb = byId[b];
          const on =
            stage >= from &&
            visible(na, stage) &&
            visible(nb, stage) &&
            !(a === "users" && b === "app1" && stage >= 2);
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="var(--line-strong)"
              strokeWidth={1.2}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
            />
          );
        })}
        <AnimatePresence>
          {NODES.filter((n) => visible(n, stage)).map((n) => (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            >
              <rect x={n.x - 30} y={n.y - 11} width={60} height={22} rx={6} fill="var(--surface)" />
              <rect
                x={n.x - 30}
                y={n.y - 11}
                width={60}
                height={22}
                rx={6}
                fill={FILL[n.kind]}
                fillOpacity={n.kind === "users" ? 1 : 0.22}
                stroke={FILL[n.kind]}
              />
              <text
                x={n.x}
                y={n.y + 3.5}
                textAnchor="middle"
                className="fill-fg text-[8.5px] font-medium"
              >
                {n.label}
              </text>
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
      <AnimatePresence mode="wait">
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{STAGES[stage].users} users.</span>{" "}
          {STAGES[stage].text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: follow a payment from the phone to every place it ends up. */
const PARTS: Part[] = [
  {
    id: "app",
    name: "Producers",
    text: "the payments app publishes each payment as an event, the moment it happens (module 2).",
  },
  {
    id: "schema",
    name: "Schema registry",
    text: "rejects an incompatible change before it can break every reader (module 9).",
  },
  {
    id: "partitions",
    name: "Partitions",
    text: "the topic is split by payer, so each payer's events stay in order and the work can be shared (module 3).",
  },
  {
    id: "replicas",
    name: "Replication",
    text: "three copies on three brokers: lose one and nothing acknowledged is lost (module 5).",
  },
  {
    id: "job",
    name: "Stream job",
    text: "a consumer group runs the fraud check: five-minute windows per payer, by event time (modules 4, 12–14).",
  },
  {
    id: "checkpoint",
    name: "Checkpoints",
    text: "state and offsets saved together, so a crash resumes exactly where it left off (module 15).",
  },
  {
    id: "dlq",
    name: "Dead-letter topic",
    text: "a malformed event is parked with its error instead of blocking the partition (module 18).",
  },
  {
    id: "alerts",
    name: "Alerts",
    text: "suspicious payers are flagged within seconds of paying (module 11).",
  },
  {
    id: "olap",
    name: "Real-time store",
    text: "merchants see a payment on their dashboard within seconds (module 21).",
  },
  {
    id: "lake",
    name: "Lakehouse",
    text: "every payment kept for years in an Iceberg table, compacted behind the stream (module 20).",
  },
];

const T = "fill-muted font-mono text-[8px]";

function focusFor(active: string) {
  return (ids: string[]) => ({
    opacity: ids.includes(active) ? 1 : 0.35,
    transition: { duration: 0.35 },
  });
}

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
  cls = "fill-surface stroke-line-strong",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
  cls?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : cls}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className={cn("font-mono text-[8px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

const LANES = [62, 92, 122];
const LANE_CLS = ["fill-viz-data", "fill-viz-compute", "fill-viz-meta"];

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = focusFor(active);
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  return (
    <svg
      viewBox="0 0 380 224"
      className="w-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Producer and schema registry */}
      <motion.g animate={f(["app"])} {...hit("app")}>
        <rect
          x={14}
          y={78}
          width={34}
          height={56}
          rx={6}
          className={
            active === "app" ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"
          }
          strokeWidth={active === "app" ? 1.6 : 1}
        />
        <text x={31} y={110} textAnchor="middle" className="fill-fg font-mono text-[11px]">
          ₹
        </text>
        <text x={31} y={148} textAnchor="middle" className={T}>
          app
        </text>
      </motion.g>
      <motion.g animate={f(["schema"])} {...hit("schema")}>
        <Box
          x={8}
          y={24}
          w={56}
          h={20}
          label="registry"
          on={active === "schema"}
          cls="fill-viz-meta/10 stroke-viz-meta"
        />
        <path d="M31 44v34" className="stroke-viz-meta" strokeDasharray="2 2" />
      </motion.g>
      <path d="M48 106h20" className="stroke-line-strong" />

      {/* Kafka topic */}
      <rect
        x={70}
        y={24}
        width={138}
        height={176}
        rx={8}
        className="fill-surface-2/40 stroke-line-strong"
      />
      <text x={78} y={37} className={T}>
        topic: payments
      </text>
      <motion.g animate={f(["partitions"])} {...hit("partitions")}>
        {LANES.map((y, p) => (
          <g key={p}>
            <text x={78} y={y + 4} className={T}>
              P{p}
            </text>
            <rect
              x={94}
              y={y - 9}
              width={106}
              height={18}
              rx={3}
              className={active === "partitions" ? "stroke-accent" : "stroke-line-strong"}
              strokeWidth={active === "partitions" ? 1.4 : 0.8}
            />
            {[0, 1, 2].map((k) => (
              <motion.rect
                key={k}
                y={y - 5}
                width={10}
                height={10}
                rx={2}
                className={LANE_CLS[p]}
                initial={{ x: 96 }}
                animate={{ x: [96, 188] }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + p * 0.4,
                  delay: k * 1.05 + p * 0.3,
                  ease: "linear",
                }}
              />
            ))}
          </g>
        ))}
      </motion.g>
      <motion.g animate={f(["replicas"])} {...hit("replicas")}>
        {[0, 1, 2].map((b) => (
          <g key={b}>
            <rect
              x={86 + b * 40}
              y={150}
              width={32}
              height={30}
              rx={4}
              className={
                active === "replicas"
                  ? "fill-accent/10 stroke-accent"
                  : "fill-surface stroke-line-strong"
              }
            />
            <text x={102 + b * 40} y={169} textAnchor="middle" className={T}>
              b{b + 1}
            </text>
          </g>
        ))}
        <text x={139} y={194} textAnchor="middle" className={T}>
          3 copies
        </text>
      </motion.g>

      {/* Stream job */}
      <path d="M208 92h14" className="stroke-line-strong" />
      <motion.g animate={f(["job"])} {...hit("job")}>
        <rect
          x={222}
          y={52}
          width={70}
          height={82}
          rx={6}
          className={
            active === "job"
              ? "fill-accent/15 stroke-accent"
              : "fill-viz-compute/10 stroke-viz-compute"
          }
          strokeWidth={active === "job" ? 1.6 : 1}
        />
        <text x={257} y={66} textAnchor="middle" className="fill-fg font-mono text-[8px]">
          fraud check
        </text>
        {[0, 1, 2].map((w) => (
          <rect
            key={w}
            x={230 + w * 19}
            y={76}
            width={16}
            height={22}
            rx={2}
            className="stroke-viz-meta"
            strokeDasharray="2 2"
          />
        ))}
        <text x={257} y={114} textAnchor="middle" className={T}>
          windows
        </text>
        <text x={257} y={125} textAnchor="middle" className={T}>
          per payer
        </text>
      </motion.g>
      <motion.g animate={f(["checkpoint"])} {...hit("checkpoint")}>
        <ellipse
          cx={257}
          cy={160}
          rx={18}
          ry={5}
          className={
            active === "checkpoint"
              ? "fill-accent/15 stroke-accent"
              : "fill-viz-meta/15 stroke-viz-meta"
          }
        />
        <path
          d="M239 160v18a18 5 0 0 0 36 0v-18"
          className={active === "checkpoint" ? "stroke-accent" : "stroke-viz-meta"}
        />
        <path d="M257 134v21" className="stroke-viz-meta" strokeDasharray="2 2" />
        <text x={257} y={198} textAnchor="middle" className={T}>
          checkpoints
        </text>
      </motion.g>

      {/* Outputs */}
      <path d="M292 72h8M292 92h8M292 112h8M300 40v152" className="stroke-line-strong" />
      <motion.g animate={f(["alerts"])} {...hit("alerts")}>
        <Box
          x={306}
          y={30}
          w={66}
          h={20}
          label="alerts"
          on={active === "alerts"}
          cls="fill-viz-remove/10 stroke-viz-remove"
        />
        <path d="M300 40h6" className="stroke-line-strong" />
      </motion.g>
      <motion.g animate={f(["dlq"])} {...hit("dlq")}>
        <Box
          x={306}
          y={70}
          w={66}
          h={20}
          label="dead letters"
          on={active === "dlq"}
          cls="fill-viz-meta/10 stroke-viz-meta"
        />
        <path d="M300 80h6" className="stroke-line-strong" />
      </motion.g>
      <motion.g animate={f(["olap"])} {...hit("olap")}>
        <Box
          x={306}
          y={110}
          w={66}
          h={20}
          label="dashboards"
          on={active === "olap"}
          cls="fill-viz-compute/10 stroke-viz-compute"
        />
        <path d="M300 120h6" className="stroke-line-strong" />
      </motion.g>
      <motion.g animate={f(["lake"])} {...hit("lake")}>
        <Box
          x={306}
          y={150}
          w={66}
          h={40}
          label="lakehouse"
          on={active === "lake"}
          cls="fill-viz-data/10 stroke-viz-data"
        />
        <path d="M300 170h6" className="stroke-line-strong" />
      </motion.g>
      <motion.circle
        cx={222}
        cy={92}
        initial={{ cx: 222, cy: 92 }}
        r={2.5}
        className="fill-accent"
        animate={{ cx: [222, 300, 306], cy: [92, 92, 40], opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Streaming Data Systems showcase: one payments pipeline, toured part by part; click any part. */
export function StreamingScene() {
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

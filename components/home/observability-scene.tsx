"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from a request to the person who gets paged. */
const PARTS: Part[] = [
  {
    id: "services",
    name: "Instrumented services",
    text: "every service emits telemetry through OpenTelemetry, so one request can be followed end to end (modules 1–3).",
  },
  {
    id: "metrics",
    name: "Metrics",
    text: "counters, gauges and histograms with a few bounded labels: the golden signals at a glance (modules 4–7).",
  },
  {
    id: "logs",
    name: "Logs",
    text: "structured events with trace IDs, masked and filtered on their way to storage (modules 8, 9).",
  },
  {
    id: "traces",
    name: "Traces",
    text: "each request's path as spans, sampled so every error and slow one survives (modules 10–12).",
  },
  {
    id: "collector",
    name: "The Collector",
    text: "receives everything, drops noise, samples and sends it to whichever backends you choose (modules 3, 20).",
  },
  {
    id: "slo",
    name: "SLOs and alerts",
    text: "targets for what users feel; burn-rate alerts page only when the error budget is really at risk (modules 13–15).",
  },
  {
    id: "dash",
    name: "Dashboards",
    text: "are users OK, where, why: the starting point of every investigation (modules 16, 17).",
  },
  {
    id: "oncall",
    name: "People",
    text: "an on-call engineer, an incident commander and a blameless postmortem afterwards (modules 18, 19).",
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

const SIGNALS: [string, string, number, string][] = [
  ["metrics", "metrics", 40, "stroke-viz-data"],
  ["logs", "logs", 92, "stroke-viz-meta"],
  ["traces", "traces", 144, "stroke-viz-compute"],
];

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
      {/* services */}
      <motion.g animate={f(["services"])} {...hit("services")}>
        {["app", "api", "payments", "bank"].map((l, i) => (
          <Box key={l} x={8} y={22 + i * 38} w={56} h={22} label={l} on={active === "services"} />
        ))}
      </motion.g>
      {/* signal lanes */}
      {SIGNALS.map(([id, label, y, cls]) => (
        <motion.g key={id} animate={f([id, "collector"])} {...hit(id)}>
          <motion.path
            d={`M68 ${y + 11}H150`}
            className={cls}
            strokeWidth={1.6}
            strokeDasharray="3 4"
            animate={{ strokeDashoffset: [14, 0] }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
          />
          <text x={86} y={y + 6} className="fill-muted font-mono text-[7px]">
            {label}
          </text>
        </motion.g>
      ))}
      <motion.g animate={f(["collector"])} {...hit("collector")}>
        <Box x={152} y={70} w={56} h={50} label="Collector" on={active === "collector"} />
      </motion.g>
      <motion.path
        d="M208 95H236"
        className="stroke-accent"
        strokeWidth={1.2}
        strokeDasharray="3 4"
        animate={{ strokeDashoffset: [14, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.g animate={f(["slo"])} {...hit("slo")}>
        <Box x={238} y={40} w={64} h={24} label="SLO 99.9%" on={active === "slo"} />
        <motion.path
          d="M316 44c0-4 3-6 5-6s5 2 5 6v5l2 3h-14l2-3z"
          className="fill-viz-remove/30 stroke-viz-remove"
          strokeWidth={1.2}
          animate={active === "slo" ? { rotate: [0, -12, 12, 0] } : { rotate: 0 }}
          transition={{ duration: 0.6, repeat: active === "slo" ? Infinity : 0, repeatDelay: 0.8 }}
          style={{ transformOrigin: "321px 45px" }}
        />
      </motion.g>
      <motion.g animate={f(["dash"])} {...hit("dash")}>
        <rect
          x={238}
          y={84}
          width={92}
          height={46}
          rx={4}
          className={
            active === "dash" ? "fill-accent/10 stroke-accent" : "fill-surface stroke-line-strong"
          }
          strokeWidth={1.2}
        />
        {[0, 1, 2, 3].map((i) => (
          <polyline
            key={i}
            points={[0.3, 0.35, 0.3, i === 2 ? 0.9 : 0.4, i === 2 ? 0.8 : 0.38]
              .map(
                (v, k) => `${244 + (i % 2) * 44 + k * 9},${104 + Math.floor(i / 2) * 20 - v * 14}`,
              )
              .join(" ")}
            className={i === 2 ? "stroke-viz-remove" : "stroke-viz-data"}
            strokeWidth={1.2}
          />
        ))}
      </motion.g>
      <motion.g animate={f(["oncall"])} {...hit("oncall")}>
        <circle
          cx={268}
          cy={160}
          r={7}
          className="fill-surface stroke-line-strong"
          strokeWidth={1.2}
        />
        <path d="M256 182c2-8 22-8 24 0" className="stroke-line-strong" strokeWidth={1.2} />
        <text x={286} y={168} className="fill-muted font-mono text-[7px]">
          on-call · IC
        </text>
      </motion.g>
      <text x={8} y={192} className="fill-muted font-mono text-[7px]">
        from one request to the person who gets paged
      </text>
    </svg>
  );
}

/** Observability showcase: telemetry from services to people, toured part by part. */
export function ObservabilityScene() {
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

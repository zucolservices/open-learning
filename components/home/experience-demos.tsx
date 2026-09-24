"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useTicker } from "@/lib/use-ticker";
import { cn } from "@/lib/cn";

/** "How you'll learn": each experience type shown as a tiny looping demo. */
export function ExperienceDemos() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DemoCard title="3D models" body="Open up systems and look inside, layer by layer.">
        <Exploded />
      </DemoCard>
      <DemoCard title="Live simulations" body="Change a parameter and watch the trade-offs move.">
        <Simulation />
      </DemoCard>
      <DemoCard title="Step-throughs" body="Play a process forward and back at your own pace.">
        <StepThrough />
      </DemoCard>
      <DemoCard
        title="Build & connect"
        body="Assemble pipelines and architectures that actually run."
      >
        <BuildConnect />
      </DemoCard>
      <DemoCard title="Fix the problem" body="Diagnose a broken system from the evidence.">
        <FixIt />
      </DemoCard>
      <DemoCard title="Sandboxes" body="Real SQL and code, running right in your browser.">
        <Sandbox />
      </DemoCard>
    </div>
  );
}

function DemoCard({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="border-line bg-surface shadow-card group overflow-hidden rounded-[var(--radius-card)] border">
      <div className="dot-grid border-line relative grid h-44 place-items-center overflow-hidden border-b">
        {children}
      </div>
      <div className="p-5">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <p className="text-muted mt-1 text-sm">{body}</p>
      </div>
    </div>
  );
}

const spring = { type: "spring", stiffness: 140, damping: 18 } as const;

function Exploded() {
  const { ref, tick } = useTicker<HTMLDivElement>(1600);
  const open = tick % 2 === 1;
  const layers = [
    { label: "footer · stats", cls: "fill-viz-meta/25 stroke-viz-meta" },
    { label: "row group 2", cls: "fill-viz-data/20 stroke-viz-data" },
    { label: "row group 1", cls: "fill-viz-data/20 stroke-viz-data" },
  ];
  return (
    <div ref={ref} className="h-full w-full">
      <svg viewBox="0 0 240 170" className="h-full w-full">
        {layers
          .map((l, i) => ({ ...l, i }))
          .reverse()
          .map(({ label, cls, i }) => {
            const base = 70 + i * 16;
            return (
              <motion.g key={label} animate={{ y: open ? (i - 1) * 28 : 0 }} transition={spring}>
                <polygon
                  points={`90,${base - 22} 150,${base} 90,${base + 22} 30,${base}`}
                  className={cls}
                  strokeWidth={1}
                />
                <polygon
                  points={`30,${base} 90,${base + 22} 90,${base + 30} 30,${base + 8}`}
                  className={cls}
                  opacity={0.6}
                />
                <polygon
                  points={`90,${base + 22} 150,${base} 150,${base + 8} 90,${base + 30}`}
                  className={cls}
                  opacity={0.8}
                />
                <motion.text
                  x={162}
                  y={base + 4}
                  className="fill-muted font-mono text-[9px]"
                  animate={{ opacity: open ? 1 : 0 }}
                >
                  {label}
                </motion.text>
              </motion.g>
            );
          })}
      </svg>
    </div>
  );
}

function Simulation() {
  const { ref, tick } = useTicker<HTMLDivElement>(1300);
  const values = [0.15, 0.4, 0.7, 0.95, 0.7, 0.4];
  const v = values[tick % values.length];
  const partitions = Math.round(4 + v * 996);
  const files = v;
  // Query time is U-shaped: too few partitions scan too much, too many drown in small files.
  const time = 0.25 + 1.6 * (v - 0.45) ** 2 + (v > 0.8 ? 0.35 : 0);
  return (
    <div ref={ref} className="w-full px-6">
      <div className="text-muted mb-1 flex justify-between font-mono text-[10px]">
        <span>partitions</span>
        <span className="text-fg tabular-nums">{partitions}</span>
      </div>
      <div className="bg-surface-2 relative h-1.5 rounded-full">
        <motion.div
          className="bg-accent absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${v * 100}%` }}
          transition={spring}
        />
        <motion.div
          className="bg-accent border-surface absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow"
          animate={{ left: `${v * 100}%` }}
          transition={spring}
        />
      </div>
      <div className="mt-5 grid gap-2.5 font-mono text-[10px]">
        <Bar label="files" value={files} cls="bg-viz-data" />
        <Bar
          label="query time"
          value={Math.min(time, 1)}
          cls={time > 0.6 ? "bg-viz-remove" : "bg-viz-add"}
        />
      </div>
    </div>
  );
}

function Bar({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted w-16">{label}</span>
      <div className="bg-surface-2 h-2.5 flex-1 overflow-hidden rounded-full">
        <motion.div
          className={cn("h-full rounded-full transition-colors", cls)}
          animate={{ width: `${value * 100}%` }}
          transition={spring}
        />
      </div>
    </div>
  );
}

function StepThrough() {
  const { ref, tick } = useTicker<HTMLDivElement>(1000);
  const msgs = [
    { text: "read _delta_log", dir: 1 },
    { text: "write part-0007.parquet", dir: 1 },
    { text: "put 00004.json if absent", dir: 1 },
    { text: "✓ committed v4", dir: -1 },
  ];
  const shown = tick % (msgs.length + 2);
  return (
    <div ref={ref} className="relative h-full w-full px-6 py-4 font-mono text-[10px]">
      <div className="text-muted flex justify-between">
        <span className="bg-viz-compute/15 text-viz-compute rounded px-1.5 py-0.5">writer</span>
        <span className="bg-viz-idle/20 text-fg rounded px-1.5 py-0.5">object store</span>
      </div>
      <div className="bg-line absolute top-10 bottom-3 left-10 w-px" />
      <div className="bg-line absolute top-10 right-12 bottom-3 w-px" />
      <div className="mt-3 grid gap-2">
        {msgs.map((m, i) => (
          <motion.div
            key={m.text}
            initial={false}
            animate={{ opacity: i < shown ? 1 : 0, x: i < shown ? 0 : m.dir * -12 }}
            className={cn("flex items-center gap-1", m.dir < 0 && "text-viz-add flex-row-reverse")}
          >
            <span className="whitespace-nowrap">{m.text}</span>
            <span className={cn("h-px flex-1", m.dir < 0 ? "bg-viz-add" : "bg-viz-compute")} />
            <span>{m.dir > 0 ? "▶" : "◀"}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BuildConnect() {
  const { ref, tick } = useTicker<HTMLDivElement>(900);
  const nodes = [
    { x: 30, label: "source", cls: "fill-viz-idle/30 stroke-viz-idle" },
    { x: 90, label: "bronze", cls: "fill-tier-bronze/25 stroke-tier-bronze" },
    { x: 150, label: "silver", cls: "fill-tier-silver/25 stroke-tier-silver" },
    { x: 210, label: "gold", cls: "fill-tier-gold/25 stroke-tier-gold" },
  ];
  const links = tick % 6; // 0..3 links drawn, then hold
  return (
    <div ref={ref} className="h-full w-full">
      <svg viewBox="0 0 240 170" className="h-full w-full">
        {nodes.slice(1).map((n, i) => (
          <motion.line
            key={n.label}
            x1={nodes[i].x + 18}
            y1={85}
            x2={n.x - 18}
            y2={85}
            className="stroke-accent"
            strokeWidth={2}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: i < links ? 1 : 0, opacity: i < links ? 1 : 0.2 }}
            transition={{ duration: 0.6 }}
          />
        ))}
        {links >= 3 &&
          [0, 1, 2].map((d) => (
            <motion.circle
              key={d}
              r={2.5}
              cy={85}
              className="fill-accent"
              initial={{ cx: 48, opacity: 0 }}
              animate={{ cx: [48, 192], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.4, delay: d * 0.45, repeat: Infinity }}
            />
          ))}
        {nodes.map((n, i) => (
          <g key={n.label}>
            <motion.rect
              x={n.x - 18}
              y={67}
              width={36}
              height={36}
              rx={9}
              className={n.cls}
              strokeWidth={1.2}
              animate={{ scale: i === links ? [1, 1.12, 1] : 1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <text x={n.x} y={122} textAnchor="middle" className="fill-muted font-mono text-[9px]">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function FixIt() {
  const { ref, tick } = useTicker<HTMLDivElement>(1300);
  const phase = tick % 4; // 0 healthy · 1 broken · 2 diagnosing · 3 fixed
  const broken = phase === 1 || phase === 2;
  return (
    <div ref={ref} className="w-full px-6 font-mono text-[10px]">
      <div className="flex items-center justify-between gap-2">
        {["producer", "consumer group", "table"].map((n, i) => (
          <div key={n} className="flex flex-1 items-center gap-2 last:flex-none">
            <motion.div
              animate={{ scale: i === 1 && phase === 1 ? [1, 1.08, 1] : 1 }}
              transition={{ repeat: i === 1 && phase === 1 ? Infinity : 0, duration: 0.6 }}
              className={cn(
                "rounded-lg border px-2 py-2 text-center transition-colors duration-500",
                i === 1 && broken
                  ? "border-viz-remove bg-viz-remove/15 text-viz-remove"
                  : i === 1 && phase === 3
                    ? "border-viz-add bg-viz-add/15 text-viz-add"
                    : "border-line-strong bg-surface text-fg",
              )}
            >
              {n}
            </motion.div>
            {i < 2 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors",
                  broken && i === 1 ? "bg-viz-remove" : "bg-line-strong",
                )}
              />
            )}
          </div>
        ))}
      </div>
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "mt-5 text-center",
          broken ? "text-viz-remove" : phase === 3 ? "text-viz-add" : "text-muted",
        )}
      >
        {
          [
            "all healthy",
            "⚠ lag: 42,000 messages",
            "one hot partition, one busy consumer",
            "✓ rebalanced, lag 0",
          ][phase]
        }
      </motion.p>
    </div>
  );
}

const SQL = "SELECT country, SUM(amount)\nFROM 'orders.parquet'\nGROUP BY 1;";

function Sandbox() {
  const { ref, tick } = useTicker<HTMLDivElement>(90);
  const cycle = SQL.length + 30;
  const t = tick % cycle;
  const typed = SQL.slice(0, t);
  const done = t >= SQL.length + 4;
  return (
    <div ref={ref} className="w-full px-5 font-mono text-[10px]">
      <div className="border-line bg-bg rounded-lg border p-3">
        <pre className="text-fg min-h-[3.2rem] whitespace-pre-wrap">
          {typed}
          <span className="bg-accent ml-px inline-block h-3 w-1.5 animate-pulse align-middle" />
        </pre>
      </div>
      <motion.div
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
        className="text-muted mt-2 grid grid-cols-2 gap-x-4 px-1"
      >
        <span className="text-subtle">country</span>
        <span className="text-subtle">sum</span>
        <span>IN</span>
        <span className="text-fg">1,460</span>
        <span>UK</span>
        <span className="text-fg">95</span>
      </motion.div>
    </div>
  );
}

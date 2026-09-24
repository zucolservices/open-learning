"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { simulate, waitMultiple } from "./sim";
import type { LatencyState } from "./state";

export const UTILS = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95];
export const fmtMin = (s: number) => (s < 60 ? `${Math.round(s)} s` : `${(s / 60).toFixed(1)} min`);

/* 1 ─ The coffee counter ⭐ ---------------------------------------------------------------------- */

function Curve({ rho }: { rho: number }) {
  const W = 300;
  const H = 150;
  const maxY = 20;
  const x = (u: number) => 30 + ((u - 0.2) / 0.78) * (W - 40);
  const y = (m: number) => H - 20 - (Math.min(m, maxY) / maxY) * (H - 30);
  const pts: string[] = [];
  for (let u = 0.2; u <= 0.975; u += 0.005) pts.push(`${x(u)},${y(waitMultiple(u))}`);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Waiting time against how busy the counter is"
    >
      {[0, 5, 10, 15, 20].map((m) => (
        <g key={m}>
          <line x1={30} x2={W - 10} y1={y(m)} y2={y(m)} stroke="var(--line)" strokeWidth={0.6} />
          <text x={24} y={y(m) + 3} textAnchor="end" className="fill-subtle text-[8px]">
            {m}×
          </text>
        </g>
      ))}
      {[0.3, 0.5, 0.7, 0.9].map((u) => (
        <text key={u} x={x(u)} y={H - 6} textAnchor="middle" className="fill-subtle text-[8px]">
          {Math.round(u * 100)}%
        </text>
      ))}
      <polyline points={pts.join(" ")} fill="none" stroke="var(--accent)" strokeWidth={2} />
      <motion.circle
        r={4.5}
        fill="var(--bad)"
        initial={false}
        animate={{ cx: x(rho), cy: y(waitMultiple(rho)) }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      />
    </svg>
  );
}

export function CoffeeCounter() {
  const [s, set] = useSceneState<LatencyState>();
  const rho = UTILS[s.util];
  const r = useMemo(() => simulate(rho), [rho]);
  const avgInShop = rho / (1 - rho); // M/M/1: average number in the system
  const inShop = Math.max(1, Math.round(avgInShop));
  const hot = rho >= 0.85;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The coffee counter"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <label className="grid gap-1">
            <span className="flex justify-between text-xs">
              <span className="text-muted">How busy is the barista?</span>
              <span className="font-mono">{Math.round(rho * 100)}% busy</span>
            </span>
            <input
              type="range"
              min={0}
              max={UTILS.length - 1}
              value={s.util}
              aria-label="Utilisation"
              onChange={(e) => set({ util: Number(e.target.value) })}
              className="accent-[var(--accent)]"
            />
          </label>

          <div className="border-line bg-surface flex min-h-16 flex-wrap items-center gap-1 rounded-xl border px-3 py-2">
            <span className="bg-viz-compute/20 border-viz-compute mr-2 rounded border px-1.5 py-0.5 text-[10px]">
              ☕ counter
            </span>
            {Array.from({ length: Math.min(inShop, 40) }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={cn("size-3 rounded-full", i === 0 ? "bg-viz-compute" : "bg-viz-idle")}
              />
            ))}
            {inShop > 40 && <span className="text-muted text-xs">+{inShop - 40}</span>}
            <span className="text-subtle ml-auto text-[10px]">
              about {avgInShop.toFixed(1)} people in the shop on average
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Throughput" value={`${Math.round(r.throughputPerMin * 60)} coffees/h`} />
            <Stat label="Typical (p50)" value={fmtMin(r.p50)} />
            <Stat label="p95" value={fmtMin(r.p95)} bad={hot} />
            <Stat label="p99" value={fmtMin(r.p99)} bad={hot} />
          </div>

          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 text-[11px]">
              Average wait in line, as a multiple of the time to make one coffee
            </p>
            <Curve rho={rho} />
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              hot ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
            )}
          >
            {hot
              ? `At ${Math.round(rho * 100)}% busy, the barista is only a little busier, but the average wait is ${waitMultiple(rho).toFixed(0)}× the time it takes to make a coffee, and the unlucky 1% wait ${fmtMin(r.p99)}.`
              : `Throughput rises with demand, and waits stay modest. Keep going: the curve bends sharply near the top.`}
          </p>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this simulation works</summary>
            <p className="mt-2">
              80,000 simulated customers arrive at random, and each coffee takes a random time
              averaging one minute (an &ldquo;M/M/1&rdquo; queue). The curve is the textbook
              formula, wait = ρ/(1−ρ) × service time; the numbers above come from the simulation and
              match it.
            </p>
          </details>
        </div>
      }
    >
      <p>
        At a coffee counter, <Term id="latency">latency</Term> is how long you wait for your coffee.{" "}
        <Term id="throughput">Throughput</Term> is how many coffees the counter serves per hour.
        They sound like the same thing. They aren&apos;t.
      </p>
      <p>
        Slide the barista from relaxed to flat out. Throughput climbs steadily; waiting does
        something very different. The share of time the barista is busy is called{" "}
        <Term id="utilisation">utilisation</Term>.
      </p>
      <p className="text-muted text-sm">
        Servers, databases and disks behave exactly like this counter. That&apos;s why teams aim to
        run them well below 100% busy.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 2 ─ Predict ------------------------------------------------------------------------------------- */

export function PredictWait() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How long is the line?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="predict-wait"
            prompt="A server takes 10 ms per request and is busy 90% of the time. Requests arrive at random. On average, how many milliseconds does a request wait in line before it's even started?"
            min={0}
            max={200}
            step={5}
            unit=" ms"
            answer={90}
            tolerance={20}
            explanation="Wait = ρ/(1−ρ) × service time = 0.9/0.1 × 10 ms = 90 ms, nine times the work itself. At 60% busy it would be 15 ms. That's why a system at 90% feels far slower than one at 60%, though it's only 50% busier."
          />
        </div>
      }
    >
      <p>Use the curve: at 90% busy, the average wait is how many times the service time?</p>
    </StepLayout>
  );
}

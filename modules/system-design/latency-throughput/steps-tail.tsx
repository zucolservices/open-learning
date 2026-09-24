"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { fanoutSlow, simulate } from "./sim";
import { fmtMin } from "./steps-queue";
import type { LatencyState } from "./state";

/* 3 ─ Averages lie ⭐ ---------------------------------------------------------------------------- */

const VISITS = [1, 5, 20, 50, 100];

export function AveragesLie() {
  const [s, set] = useSceneState<LatencyState>();
  const r = useMemo(() => simulate(0.8), []);
  const max = r.p99 * 1.15;
  const bins = 40;
  const counts = new Array(bins).fill(0);
  for (const t of r.totals) if (t < max) counts[Math.floor((t / max) * bins)]++;
  const top = Math.max(...counts);
  const marks = [
    { label: "average", v: r.mean, cls: "bg-viz-meta" },
    { label: "p50", v: r.p50, cls: "bg-good" },
    { label: "p95", v: r.p95, cls: "bg-viz-compute" },
    { label: "p99", v: r.p99, cls: "bg-bad" },
  ];
  const n = VISITS[s.visitRequests];
  const chance = 1 - Math.pow(0.99, n);
  return (
    <StepLayout
      eyebrow="Percentiles"
      title="Averages lie"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">
              80,000 customers at 80% busy: how long each one took
            </p>
            <div className="relative flex h-32 items-end gap-px">
              {counts.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(c / top) * 100}%` }}
                  transition={{ delay: i * 0.01 }}
                  className="bg-viz-data/60 flex-1 rounded-t-sm"
                />
              ))}
              {marks.map((m) => (
                <div
                  key={m.label}
                  className="absolute inset-y-0"
                  style={{ left: `${(m.v / max) * 100}%` }}
                >
                  <div className={cn("h-full w-0.5", m.cls)} />
                </div>
              ))}
            </div>
            <div className="text-subtle mt-1 flex justify-between text-[9px]">
              <span>0</span>
              <span>{fmtMin(max)}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4">
              {marks.map((m) => (
                <p key={m.label} className="flex items-center gap-1.5 text-xs">
                  <span className={cn("size-2 rounded-full", m.cls)} />
                  {m.label}: <span className="font-mono">{fmtMin(m.v)}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="border-line bg-surface grid gap-2 rounded-xl border p-3">
            <label className="grid gap-1">
              <span className="flex justify-between text-xs">
                <span className="text-muted">Requests behind one visit to a web page</span>
                <span className="font-mono">{n}</span>
              </span>
              <input
                type="range"
                min={0}
                max={VISITS.length - 1}
                value={s.visitRequests}
                aria-label="Requests per visit"
                onChange={(e) => set({ visitRequests: Number(e.target.value) })}
                className="accent-[var(--accent)]"
              />
            </label>
            <p className="text-sm">
              Chance a visitor hits at least one p99-slow request:{" "}
              <motion.span
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono font-semibold"
              >
                {Math.round(chance * 100)}%
              </motion.span>
            </p>
            <p className="text-subtle text-[11px]">
              1 − 0.99^{n}, assuming each request is independently slow 1% of the time.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The average hides the unlucky customers. A <Term id="percentile">percentile</Term> says
        &ldquo;this share of requests were faster than X&rdquo;: p50 is the typical case, p99 is the
        slowest 1%.
      </p>
      <p>
        &ldquo;Only 1% are slow&rdquo; sounds harmless, until you remember that one page load or app
        screen makes many requests. Slide it up.
      </p>
      <p className="text-muted text-sm">
        That&apos;s why engineers watch the <Term id="tail-latency">tail</Term> (p95, p99, p99.9),
        not the average.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fan-out and the tail at scale ⭐ ---------------------------------------------------------- */

const SERVERS = [1, 10, 50, 100, 500, 2000];
const PSLOW = [0.01, 0.001, 0.0001];

export function FanOut() {
  const [s, set] = useSceneState<LatencyState>();
  const n = SERVERS[s.servers];
  const p = PSLOW[s.pSlow];
  // Hedging: after the p95 wait, send a copy elsewhere; slow only if both are slow (independence assumed).
  const pEff = s.hedge ? p * p : p;
  const slow = fanoutSlow(pEff, n);
  const dots = Math.min(n, 400);
  const slowDots = Math.round(dots * p * (s.hedge ? p : 1));
  const reds = new Set<number>();
  for (let i = 0; i < Math.max(slowDots, !s.hedge && slow > 0.5 ? 1 : 0); i++)
    reds.add((i * 97) % dots);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The tail at scale"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <label className="grid gap-1">
            <span className="flex justify-between text-xs">
              <span className="text-muted">Servers one request waits for</span>
              <span className="font-mono">{n.toLocaleString("en-US")}</span>
            </span>
            <input
              type="range"
              min={0}
              max={SERVERS.length - 1}
              value={s.servers}
              aria-label="Servers per request"
              onChange={(e) => set({ servers: Number(e.target.value) })}
              className="accent-[var(--accent)]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Each server is slow</span>
            {PSLOW.map((x, i) => (
              <button
                key={x}
                type="button"
                onClick={() => set({ pSlow: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1",
                  s.pSlow === i ? "border-accent bg-accent-soft text-accent" : "border-line",
                )}
              >
                1 in {Math.round(1 / x).toLocaleString("en-US")}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.hedge}
              onChange={(e) => set({ hedge: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Hedge: if a server hasn&apos;t answered by its usual p95 time, ask another copy too
          </label>
          <div className="border-line bg-surface flex flex-wrap gap-0.5 rounded-xl border p-3">
            {Array.from({ length: dots }, (_, i) => (
              <span
                key={i}
                className={cn("size-2 rounded-[2px]", reds.has(i) ? "bg-bad" : "bg-viz-compute/50")}
              />
            ))}
            {n > dots && (
              <span className="text-subtle ml-1 text-[10px]">
                showing 400 of {n.toLocaleString("en-US")}
              </span>
            )}
          </div>
          <div
            className={cn(
              "rounded-xl border px-4 py-3",
              slow > 0.1 ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            <p className="text-muted text-xs">Requests that end up slow</p>
            <motion.p
              key={slow.toFixed(4)}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="font-mono text-2xl"
            >
              {slow < 0.001 ? "< 0.1%" : `${(slow * 100).toFixed(slow < 0.1 ? 1 : 0)}%`}
            </motion.p>
            <p className="text-muted mt-1 text-xs">
              {s.hedge
                ? "Costs about 5% more requests, and needs requests that are safe to send twice."
                : "The request is only as fast as the slowest server it waits for."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Big systems answer one request by asking many servers at once (a search across many index
        shards, a page built from dozens of services) and waiting for all of them. This is{" "}
        <Term id="fan-out">fan-out</Term>.
      </p>
      <p>
        Google&apos;s &ldquo;The Tail at Scale&rdquo; paper put it starkly: if each server is slow 1
        time in 100 and a request needs 100 servers, 63% of requests are slow. Try it, then try
        hedging.
      </p>
      <p className="text-muted text-sm">
        In the paper, hedging after 10 ms cut a real service&apos;s 99.9th-percentile latency from
        1,800 ms to 74 ms for just 2% more requests. The maths here assumes slowness is random and
        independent.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Little's Law -------------------------------------------------------------------------------- */

const RATES = [10, 100, 1000, 5000];
const TIMES = [0.01, 0.05, 0.2, 1, 5];

export function LittlesLaw() {
  const [s, set] = useSceneState<LatencyState>();
  const lam = RATES[s.rate];
  const w = TIMES[s.time];
  const L = lam * w;
  return (
    <StepLayout
      eyebrow="A law with no exceptions"
      title="Little's Law"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3 text-center font-mono">
            <span className="text-2xl">L = λ × W</span>
            <p className="text-muted mt-1 text-xs">
              requests in flight = arrivals per second × seconds each one spends inside
            </p>
          </div>
          <Slider
            label="Arrivals per second (λ)"
            value={s.rate}
            max={RATES.length - 1}
            display={lam.toLocaleString("en-US")}
            onChange={(v) => set({ rate: v })}
          />
          <Slider
            label="Time each request spends inside (W)"
            value={s.time}
            max={TIMES.length - 1}
            display={w < 1 ? `${w * 1000} ms` : `${w} s`}
            onChange={(v) => set({ time: v })}
          />
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-xs">Requests in flight at any moment (L)</p>
            <motion.p
              key={L}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="font-mono text-3xl"
            >
              {L.toLocaleString("en-US")}
            </motion.p>
            <p className="text-muted mt-1 text-xs">
              So you need about {Math.ceil(L).toLocaleString("en-US")} database connections, threads
              or worker slots, or requests start queueing.
            </p>
          </div>
          <p className="text-subtle text-xs">
            Try it: 1,000 per second × 200 ms = 200 in flight. If the database slows to 1 s, the
            same traffic needs 1,000.
          </p>
        </div>
      }
    >
      <p>
        A café that serves one customer a minute, where each stays five minutes, has five people
        inside on average. That&apos;s <Term id="littles-law">Little&apos;s Law</Term>, and it holds
        for any stable system, whatever the pattern of arrivals.
      </p>
      <p>
        It&apos;s how engineers size connection pools and thread pools, and it explains why a slow
        dependency suddenly exhausts them: when requests take longer, more of them are inside at
        once.
      </p>
    </StepLayout>
  );
}

function Slider({
  label,
  value,
  max,
  display,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  onChange(v: number): void;
}) {
  return (
    <label className="grid gap-1">
      <span className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono">{display}</span>
      </span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-[var(--accent)]"
      />
    </label>
  );
}

/* 6 ─ Checkpoint: averaging percentiles ---------------------------------------------------------- */

export function PercentileCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The dashboard trap"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="avg-percentiles"
            prompt="A dashboard shows the p99 latency of each of ten servers, and a 'fleet p99' that is the average of those ten numbers. What's wrong?"
            options={[
              {
                id: "average",
                label:
                  "Percentiles can't be averaged: the fleet's p99 must be computed from all the requests together (e.g. by merging histograms)",
                correct: true,
                feedback:
                  "Right. The average of ten p99s isn't the p99 of anything. One busy, slow server can hide or dominate depending on traffic.",
              },
              {
                id: "median",
                label: "It should use the median of the ten p99s instead",
                feedback:
                  "Still not the fleet's p99. You need the underlying distribution, not a summary of summaries.",
              },
              {
                id: "fine",
                label: "Nothing: averaging is fine if servers get similar traffic",
                feedback:
                  "Even then it's only an approximation, and servers rarely behave the same, which is exactly when it matters.",
              },
              {
                id: "p50",
                label: "It should show p50 instead, which can be averaged",
                feedback: "No percentile can be averaged meaningfully, p50 included.",
              },
            ]}
            explanation="Collect latency as histograms and merge them; compute percentiles last. Monitoring tools like Prometheus say this explicitly."
          />
        </div>
      }
    >
      <p>A mistake found on many real dashboards.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Latency ≠ throughput", "Throughput can keep rising while latency explodes."],
  [
    "Don't run hot",
    "Waits grow as ρ/(1−ρ): 1× at 50% busy, 9× at 90%, 19× at 95%. Leave headroom.",
  ],
  ["Watch the tail", "Averages hide the unlucky; p95/p99 are what users remember."],
  [
    "Fan-out amplifies the tail",
    "Waiting on many servers makes rare slowness common. Hedging helps.",
  ],
  [
    "L = λ × W",
    "In-flight work equals rate times time: size pools with it, and expect slow dependencies to exhaust them.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>You can now describe &ldquo;fast&rdquo; and &ldquo;slow&rdquo; precisely.</p>
      <p>Next: turning a vague brief into numbers with back-of-the-envelope estimation.</p>
    </StepLayout>
  );
}

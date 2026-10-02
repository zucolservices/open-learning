"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUCKETS, rate, restart, start, tick, type MetricsState } from "./model";
import type { TypesState } from "./state";

/* 1 ─ Three ways to count ⭐ ---------------------------------------------------------------------- */

function Spark({ values, cls }: { values: number[]; cls: string }) {
  const max = Math.max(...values, 1);
  return (
    <svg viewBox="0 0 120 40" className="w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        className={cls}
        strokeWidth={1.6}
        points={values.map((v, i) => `${(i / 39) * 120},${38 - (v / max) * 34}`).join(" ")}
      />
    </svg>
  );
}

export function ThreeWays() {
  const [s, set] = useSceneState<TypesState>();
  const [m, setM] = useState<MetricsState>(start);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setM((x) => tick(x, s.rps, s.slow)), 400);
    return () => clearInterval(id);
  }, [running, s.rps, s.slow]);
  const total = m.buckets[m.buckets.length - 1] || 1;
  const r = rate(m.history, 10);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Three ways to count"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs">
              Traffic
              <input
                type="range"
                min={5}
                max={60}
                value={s.rps}
                onChange={(e) => set({ rps: Number(e.target.value) })}
                className="accent-accent w-28"
                aria-label="Requests per second"
              />
              <span className="font-mono">{s.rps}/s</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.slow}
                onChange={(e) => set({ slow: e.target.checked })}
                className="accent-accent"
              />
              Server struggling
            </label>
            <button
              type="button"
              onClick={() => setM((x) => restart(x))}
              className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
            >
              <RotateCcw className="size-3" /> Restart server
            </button>
            <button
              type="button"
              onClick={() => setRunning((x) => !x)}
              aria-label={running ? "Pause" : "Play"}
              className="border-line hover:bg-surface-2 rounded-full border p-1.5"
            >
              {running ? <Pause className="size-3" /> : <Play className="size-3" />}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted font-mono text-[10px]">counter · http_requests_total</p>
              <p className="font-mono text-lg font-semibold">{m.counter.toLocaleString("en-IN")}</p>
              <Spark values={m.history.map((h) => h.counter)} cls="stroke-viz-data" />
              <p className="text-muted font-mono text-[10px]">rate over 10 s: {r.toFixed(1)}/s</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted font-mono text-[10px]">gauge · in_flight_requests</p>
              <p className="font-mono text-lg font-semibold">{m.gauge}</p>
              <Spark values={m.history.map((h) => h.gauge)} cls="stroke-viz-compute" />
              <p className="text-muted font-mono text-[10px]">goes up and down</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted font-mono text-[10px]">
                histogram · request_duration_seconds
              </p>
              <div className="mt-1 flex h-16 items-end gap-1">
                {BUCKETS.map((b, i) => (
                  <div
                    key={b}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-0.5"
                  >
                    <motion.div
                      animate={{ height: `${(m.buckets[i] / total) * 100}%` }}
                      className="bg-viz-meta/50 w-full rounded-t-sm"
                    />
                    <span className="text-muted font-mono text-[8px]">
                      {b === Infinity ? "+Inf" : `≤${b}`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted font-mono text-[10px]">cumulative bucket counts</p>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative traffic to one server; one tick is one second.
          </p>
        </div>
      }
    >
      <p>
        One server, live traffic, three <Term id="metric">metrics</Term>. Change the traffic, make
        the server struggle, restart it, and watch how each type reacts.
      </p>
      <p>
        A <Term id="counter">counter</Term> &ldquo;can only increase or be reset to zero on
        restart&rdquo;. A <Term id="gauge">gauge</Term> &ldquo;can arbitrarily go up and
        down&rdquo;. A <Term id="histogram">histogram</Term> sorts each measurement into buckets:
        &ldquo;essentially a bucketed counter&rdquo;. (Definitions from the Prometheus docs.)
      </p>
      <p>
        Nobody reads a raw counter. What you want is its <em>rate</em>, requests per second, and
        notice that the rate stays sensible even when a restart sends the counter back to zero.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rate first, then sum ------------------------------------------------------------------------ */

export function RateFirst() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rate first, then sum"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`# requests per second, per server, over the last 5 minutes
rate(http_requests_total[5m])

# then add the servers together
sum(rate(http_requests_total[5m]))

# 95th percentile latency from a histogram
histogram_quantile(0.95,
  sum by (le) (rate(request_duration_seconds_bucket[5m])))`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good/40 bg-good/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">rate(), then sum()</p>
              <p className="text-muted">Each server&apos;s resets are handled before adding.</p>
            </div>
            <div className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">sum(), then rate()</p>
              <p className="text-muted">
                One server restarting looks like the total dropping: rate() sees a reset that
                didn&apos;t happen, and the result is wrong.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Prometheus&apos;s query language, PromQL, turns counters into useful numbers.{" "}
        <span className="font-mono text-sm">rate()</span> gives the per-second average over a window
        and copes with resets; <span className="font-mono text-sm">increase()</span> gives the total
        added in the window.
      </p>
      <p>
        The rule from the docs: &ldquo;always take a rate() first, then aggregate&rdquo;.
        OpenTelemetry has the same types under slightly different names: Counter, UpDownCounter,
        Gauge and Histogram.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Pull or push -------------------------------------------------------------------------------- */

export function PullOrPush() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Pull or push"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`$ curl http://payments:8080/metrics
# TYPE http_requests_total counter
http_requests_total{method="POST",route="/pay",status="200"} 120394
# TYPE in_flight_requests gauge
in_flight_requests 7
# TYPE request_duration_seconds histogram
request_duration_seconds_bucket{le="0.1"} 98110
request_duration_seconds_bucket{le="0.25"} 117502
request_duration_seconds_bucket{le="+Inf"} 120394`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Pull (Prometheus)</p>
              <p className="text-muted">
                The app exposes /metrics; Prometheus scrapes it on a schedule (the default is every
                minute; most setups use 15 seconds). A failed scrape tells you the target is down.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Push (OTLP, Pushgateway)</p>
              <p className="text-muted">
                The app sends metrics out, as OpenTelemetry does by default. Prometheus&apos;s
                Pushgateway is only for short batch jobs that end before a scrape could reach them.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        <Term id="prometheus">Prometheus</Term> began at SoundCloud in 2012, became the CNCF&apos;s
        second project in 2016 and its second graduate in 2018. Its pull model is why so many tools
        expose a /metrics page in this simple text format.
      </p>
      <p>
        Prometheus 3 can also accept OpenTelemetry&apos;s OTLP pushes, once its receiver is switched
        on, so the two models now meet in the middle.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which type? --------------------------------------------------------------------------------- */

export function WhichType() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which type?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-metric-type"
            prompt="Which metric type fits each measurement?"
            categories={[
              { id: "counter", label: "Counter" },
              { id: "gauge", label: "Gauge" },
              { id: "histogram", label: "Histogram" },
            ]}
            items={[
              {
                id: "payments",
                label: "Payments processed since start-up",
                category: "counter",
                why: "Only ever goes up; you'll query its rate.",
              },
              {
                id: "bytes",
                label: "Bytes sent to the bank's API",
                category: "counter",
                why: "A running total; rate() gives bytes per second.",
              },
              {
                id: "queue",
                label: "Jobs waiting in the queue right now",
                category: "gauge",
                why: "Goes up and down; a counter here would be wrong.",
              },
              {
                id: "mem",
                label: "Memory in use",
                category: "gauge",
                why: "A current level, not a running total.",
              },
              {
                id: "latency",
                label: "How long each payment takes",
                category: "histogram",
                why: "Buckets let you compute percentiles across servers.",
              },
              {
                id: "size",
                label: "Size of each uploaded receipt",
                category: "histogram",
                why: "A distribution of values, so a histogram.",
              },
            ]}
            explanation="Running totals are counters, current levels are gauges, and distributions of individual measurements are histograms. A classic mistake is a counter for something that can go down, such as running jobs."
          />
        </div>
      }
    >
      <p>Pick the type by asking: does it only go up, go up and down, or vary per event?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Counter", "Only goes up (or resets); query its rate."],
  ["Gauge", "A current level that rises and falls."],
  ["Histogram", "Measurements sorted into buckets; percentiles come from it."],
  ["Rate, then sum", "Handle resets per series before adding."],
  ["Pull or push", "Prometheus scrapes; OpenTelemetry pushes; both work together."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className={cn("border-line bg-surface rounded-lg border px-3 py-2")}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        There&apos;s also the summary type, which works out percentiles inside each app; they
        can&apos;t be combined across servers, so the Prometheus docs now recommend native
        histograms (stable since Prometheus 3.8) over both classic histograms and summaries.
      </p>
      <p>Next: why averages lie, and what percentiles tell you instead.</p>
    </StepLayout>
  );
}

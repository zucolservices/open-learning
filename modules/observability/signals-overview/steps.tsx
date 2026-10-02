"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { fmtBytes, perDay } from "./model";
import type { Signal, SignalsState } from "./state";

/* 1 ─ One slow request, three ways ⭐ -------------------------------------------------------------- */

const LATENCY = [
  180, 190, 185, 200, 195, 190, 210, 205, 900, 2400, 2600, 2500, 2300, 800, 220, 210,
];

function MetricView() {
  const max = 2800;
  return (
    <div>
      <p className="text-muted mb-1 font-mono text-[10px]">
        checkout latency, p99 (ms) · 14:00–14:16
      </p>
      <div className="flex h-28 items-end gap-1">
        {LATENCY.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ delay: i * 0.03 }}
            className={cn("flex-1 rounded-t-sm", v > 1000 ? "bg-bad/70" : "bg-viz-data/50")}
          />
        ))}
      </div>
    </div>
  );
}

const LOGS = [
  ["14:09:02.114", "INFO", "order.created order_id=8812 trace_id=4bf9…"],
  ["14:09:02.120", "INFO", "payment.started order_id=8812 bank=Bank C"],
  ["14:09:04.931", "WARN", "db.query slow duration_ms=2794 table=ledger"],
  ["14:09:04.950", "INFO", "payment.completed order_id=8812"],
];

function LogView() {
  return (
    <div className="bg-surface-2 rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed">
      {LOGS.map(([t, lvl, m]) => (
        <p key={t} className={lvl === "WARN" ? "text-viz-compute" : ""}>
          <span className="text-muted">{t}</span> {lvl.padEnd(4)} {m}
        </p>
      ))}
    </div>
  );
}

const SPANS: [string, number, number, number][] = [
  ["POST /checkout", 0, 3000, 0],
  ["cart-service", 20, 80, 1],
  ["payment-service", 110, 2870, 1],
  ["ledger DB query", 120, 2794, 2],
  ["bank-gateway", 2915, 60, 2],
];

function TraceView() {
  const total = 3000;
  return (
    <div className="flex flex-col gap-1">
      {SPANS.map(([n, start, dur, depth]) => (
        <div key={n} className="grid grid-cols-[7.5rem_1fr] items-center gap-2">
          <span className="truncate font-mono text-[10px]" style={{ paddingLeft: depth * 8 }}>
            {n}
          </span>
          <div className="relative h-3.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dur / total) * 100}%` }}
              className={cn(
                "absolute inset-y-0 rounded-sm",
                n === "ledger DB query" ? "bg-bad/70" : "bg-viz-meta/45",
              )}
              style={{ left: `${(start / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-muted font-mono text-[10px]">one request, 3.0 s · trace 4bf9…</p>
    </div>
  );
}

const VIEWS: Record<Signal, { can: string[]; cant: string[] }> = {
  metric: {
    can: ["Something got slow at 14:08, for everyone", "How bad, and for how long"],
    cant: ["Which requests, or why"],
  },
  log: {
    can: ["Exact details of what happened to order 8812", "A slow query on the ledger table"],
    cant: ["How often this happens overall, cheaply", "Where the time went across services"],
  },
  trace: {
    can: ["Where the 3 s went: nearly all in the ledger query", "Which services the request passed through"],
    cant: ["Trends over a week (traces are usually sampled)"],
  },
};

export function ThreeWays() {
  const [s, set] = useSceneState<SignalsState>();
  const v = VIEWS[s.signal];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="One slow checkout, three ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Signal>
              size="sm"
              value={s.signal}
              onChange={(signal) => set({ signal })}
              options={[
                ["metric", "Metric"],
                ["log", "Logs"],
                ["trace", "Trace"],
              ]}
            />
          </div>
          <motion.div
            key={s.signal}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-3 py-3"
          >
            {s.signal === "metric" ? (
              <MetricView />
            ) : s.signal === "log" ? (
              <LogView />
            ) : (
              <TraceView />
            )}
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good/40 bg-good/5 rounded-lg border px-3 py-2">
              <p className="text-xs font-semibold">Tells you</p>
              {v.can.map((c) => (
                <p key={c} className="text-muted flex items-start gap-1.5 text-xs">
                  <Check className="text-good mt-0.5 size-3 shrink-0" />
                  {c}
                </p>
              ))}
            </div>
            <div className="border-bad/30 bg-bad/5 rounded-lg border px-3 py-2">
              <p className="text-xs font-semibold">Can&apos;t tell you</p>
              {v.cant.map((c) => (
                <p key={c} className="text-muted flex items-start gap-1.5 text-xs">
                  <X className="text-bad mt-0.5 size-3 shrink-0" />
                  {c}
                </p>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        At 14:08 checkout slowed down. Look at the same moment through each kind of{" "}
        <Term id="telemetry">telemetry</Term>.
      </p>
      <p>
        A <Term id="metric">metric</Term> is &ldquo;a measurement captured at runtime&rdquo;: here,
        latency summarised every minute. A <Term id="log">log</Term> is &ldquo;a recording of an
        event&rdquo;. A <Term id="trace">trace</Term> records &ldquo;the path of a request&rdquo;
        through every service it touched, as <Term id="span">spans</Term>. (The quotes are
        OpenTelemetry&apos;s definitions.)
      </p>
      <p>
        Metrics tell you <em>that</em> and <em>when</em>; traces tell you <em>where</em>; logs tell
        you <em>exactly what</em>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ What each one costs ------------------------------------------------------------------------- */

export function WhatItCosts() {
  const [s, set] = useSceneState<SignalsState>();
  const d = perDay(s.rps, 0.1);
  const max = Math.max(d.metrics, d.logs, d.traces);
  const rows: [string, number, string][] = [
    ["Metrics", d.metrics, "bg-viz-data/60"],
    ["Logs", d.logs, "bg-viz-compute/60"],
    ["Traces (10% kept)", d.traces, "bg-viz-meta/60"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What each one costs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="grid grid-cols-[8rem_1fr_5rem] items-center gap-2 text-xs">
            <span>Requests per second</span>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={Math.log10(s.rps)}
              onChange={(e) => set({ rps: 10 ** Number(e.target.value) })}
              className="accent-accent"
              aria-label="Requests per second"
            />
            <span className="text-right font-mono">{s.rps.toLocaleString("en-IN")}</span>
          </label>
          <div className="flex flex-col gap-2">
            {rows.map(([n, b, cls]) => (
              <div key={n} className="grid grid-cols-[8rem_1fr_5rem] items-center gap-2 text-xs">
                <span>{n}</span>
                <span className="bg-surface-2 h-5 overflow-hidden rounded">
                  <motion.span
                    animate={{ width: `${Math.max(1, (b / max) * 100)}%` }}
                    className={cn("block h-full rounded", cls)}
                  />
                </span>
                <span className="text-right font-mono">{fmtBytes(b)}</span>
              </div>
            ))}
          </div>
          <p className="text-muted font-mono text-[10px]">
            stored per day, before compression of logs and traces
          </p>
          <p className="text-muted text-[10px]">
            Illustrative: 2,000 metric series scraped every 15 s at about 1.5 bytes per sample; two
            500-byte log lines per request; six 400-byte spans per kept trace.
          </p>
        </div>
      }
    >
      <p>
        Slide the traffic up a thousandfold. The metrics barely change: they&apos;re counts and
        summaries, and Prometheus &ldquo;stores an average of only 1-2 bytes per sample&rdquo;. Logs
        grow with every request; traces too, which is why most teams keep only a sample.
      </p>
      <p>
        That&apos;s the usual division of labour: metrics for watching everything cheaply, traces
        and logs for the details when you need them. What makes metrics expensive is a different
        thing, the number of label combinations, and it has its own module.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Joined up ----------------------------------------------------------------------------------- */

const LINKS: [string, string][] = [
  [
    "Exemplars",
    "An exemplar: a metric data point carries the trace ID of one example request, so you can jump from a spike on a graph straight to a trace.",
  ],
  [
    "Trace IDs in logs",
    "Every log line written while handling a request includes its trace_id, so a trace leads to its logs and back.",
  ],
  [
    "Shared names",
    "OpenTelemetry's semantic conventions give attributes standard names, such as http.request.method and http.response.status_code, so every tool means the same thing.",
  ],
  [
    "Baggage",
    "Key–value context (say, a customer tier) passed along with a request, so later services can add it to their own telemetry.",
  ],
];

export function JoinedUp() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Joined up, not three silos"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LINKS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Metrics, logs and traces are &ldquo;often known as the three pillars&rdquo;, as Cindy
        Sridharan wrote in 2018. Many practitioners dislike the picture. Ben Sigelman, a creator of
        Google&apos;s Dapper tracing system, said they &ldquo;are just data – they are the fuel, not
        the car.&rdquo;
      </p>
      <p>
        The value comes from moving between them during one investigation: an{" "}
        <Term id="exemplar">exemplar</Term> leads from a graph to a trace, and{" "}
        <Term id="semantic-conventions">semantic conventions</Term> make the names line up. A fourth
        signal is on its way: OpenTelemetry&apos;s profiles reached public alpha in March 2026.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which signal first? ------------------------------------------------------------------------- */

export function WhichFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which signal first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-signal-first"
            prompt="Which signal would you reach for first to answer each question?"
            categories={[
              { id: "metric", label: "Metric" },
              { id: "trace", label: "Trace" },
              { id: "log", label: "Log" },
            ]}
            items={[
              {
                id: "rps",
                label: "How many checkouts per second are we handling?",
                category: "metric",
                why: "A count over time: exactly what metrics are for.",
              },
              {
                id: "trend",
                label: "Has the error rate been rising all week?",
                category: "metric",
                why: "Cheap to keep for weeks; logs and traces are usually sampled or expire sooner.",
              },
              {
                id: "where",
                label: "Which service added two seconds to this slow request?",
                category: "trace",
                why: "The waterfall shows each service's share of the time.",
              },
              {
                id: "path",
                label: "Does this request wait on the database or on the bank?",
                category: "trace",
                why: "Spans show what the request was waiting for, and in what order.",
              },
              {
                id: "msg",
                label: "What exactly did the payment service report when order 8812 failed?",
                category: "log",
                why: "The event's full detail, with its own fields and message.",
              },
              {
                id: "audit",
                label: "When did someone change this customer's payout account?",
                category: "log",
                why: "A specific event with who, what and when.",
              },
            ]}
            explanation="Metrics for that and when, traces for where, logs for exactly what. Investigations usually move through all three."
          />
        </div>
      }
    >
      <p>Pick the cheapest signal that can answer the question.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Metrics", "Cheap numbers over time: that and when."],
  ["Traces", "One request's journey: where the time went."],
  ["Logs", "Detailed events: exactly what happened."],
  ["Costs differ", "Metrics scale with series, logs and traces with traffic."],
  ["Link them", "Exemplars, trace IDs in logs and shared attribute names."],
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
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Honeycomb argues for going further: &ldquo;The building block of o11y 2.0 is wide,
        structured log events&rdquo;, one per request with many fields, from which metrics and
        traces can be derived. It&apos;s a view worth knowing even if your tools don&apos;t work
        that way.
      </p>
      <p>Next: how telemetry gets out of your code in the first place.</p>
    </StepLayout>
  );
}

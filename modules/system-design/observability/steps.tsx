"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, INCIDENTS, errorSeries, evaluate } from "./slo";
import type { ObsState } from "./state";

/* 1 ─ Three ways to see ⭐ ------------------------------------------------------------------------ */

const P99 = [180, 175, 190, 182, 178, 186, 181, 640, 2350, 2410, 2380, 2290, 700, 190, 184, 179];
const LOGS = [
  ["14:05:11.204", "INFO", "checkout", "order_id=7731 trace_id=4bf9…4736 POST /checkout started"],
  ["14:05:11.221", "INFO", "pricing", "trace_id=4bf9…4736 quote requested items=2"],
  ["14:05:13.418", "WARN", "tax", "trace_id=4bf9…4736 query took 2140ms table=tax_rates"],
  ["14:05:13.574", "INFO", "payment", "order_id=7731 trace_id=4bf9…4736 authorised"],
  ["14:05:13.602", "INFO", "checkout", "order_id=7731 trace_id=4bf9…4736 completed 2398ms"],
];

export function ThreeWays() {
  const [s, set] = useSceneState<ObsState>();
  const max = 2600;
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Three ways to see"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.signal}
            options={[
              ["metrics", "Metrics"],
              ["logs", "Logs"],
              ["traces", "Traces"],
            ]}
            onChange={(v) => set({ signal: v as ObsState["signal"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.signal}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border p-3"
            >
              {s.signal === "metrics" && (
                <div>
                  <p className="text-muted mb-2 text-[10px]">
                    Checkout latency, 99th percentile, per minute (ms)
                  </p>
                  <div className="flex h-36 items-end gap-1">
                    {P99.map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / max) * 100}%` }}
                        transition={{ delay: i * 0.02 }}
                        className={cn(
                          "flex-1 rounded-t-sm",
                          v > 500 ? "bg-bad/70" : "bg-viz-data/60",
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-subtle mt-1 flex justify-between text-[9px]">
                    <span>13:58</span>
                    <span>14:05</span>
                    <span>14:13</span>
                  </div>
                  <p className="mt-2 text-xs">
                    Something got slow at 14:05. Cheap to store, great for alerts and trends, but it
                    can&apos;t say why.
                  </p>
                </div>
              )}
              {s.signal === "logs" && (
                <div>
                  <div className="space-y-1 font-mono text-[10px]">
                    {LOGS.map(([t, lvl, svc, msg]) => (
                      <p key={t} className={cn("break-all", lvl === "WARN" && "text-bad")}>
                        <span className="text-muted">{t}</span> {lvl} [{svc}] {msg}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-xs">
                    Detailed records of individual events: the tax service logged a 2.1-second
                    query. Searching billions of lines is slow and costly, so keep them structured.
                  </p>
                </div>
              )}
              {s.signal === "traces" && (
                <div>
                  <div className="space-y-1">
                    {[
                      ["checkout", 0, 2398, 0],
                      ["pricing", 17, 2230, 1],
                      ["tax", 30, 2195, 2],
                      ["tax_rates query", 45, 2140, 3],
                      ["payment", 2262, 110, 1],
                    ].map(([n, start, dur, depth]) => (
                      <div key={n as string} className="flex items-center gap-2 text-[10px]">
                        <span
                          className="text-muted w-24 shrink-0 truncate"
                          style={{ paddingLeft: (depth as number) * 6 }}
                        >
                          {n}
                        </span>
                        <span className="bg-surface-2 relative h-3.5 flex-1 rounded">
                          <span
                            className={cn(
                              "absolute inset-y-0 rounded",
                              n === "tax_rates query" ? "bg-bad/70" : "bg-viz-compute/60",
                            )}
                            style={{
                              left: `${((start as number) / 2400) * 100}%`,
                              width: `${((dur as number) / 2400) * 100}%`,
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs">
                    One request&apos;s journey through every service, with timings: the time went on
                    the tax_rates query.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A car tells you about itself three ways: dashboard gauges (speed, fuel), a service history
        of what happened when, and, if you follow one journey, a map of where the time went.
      </p>
      <p>
        Software has the same three: <Term id="metric">metrics</Term>, <Term id="log">logs</Term>{" "}
        and <Term id="trace">traces</Term>. Together they&apos;re called{" "}
        <Term id="observability">observability</Term>. Look at one slow checkout through each.
      </p>
      <p className="text-muted text-sm">
        The shared trace ID in the logs is what ties the three together: from a spike on a chart, to
        the slow requests, to their log lines.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow one request ⭐ ------------------------------------------------------------------------ */

interface Span {
  id: string;
  name: string;
  svc: string;
  start: number;
  dur: number;
  depth: number;
  attrs: string;
}

const SPANS: Span[] = [
  {
    id: "a",
    name: "POST /checkout",
    svc: "web",
    start: 0,
    dur: 2398,
    depth: 0,
    attrs: "http.status=200 user=u-4471",
  },
  {
    id: "b",
    name: "checkout.place",
    svc: "checkout",
    start: 12,
    dur: 2375,
    depth: 1,
    attrs: "order_id=7731 items=2",
  },
  {
    id: "c",
    name: "inventory.reserve",
    svc: "inventory",
    start: 20,
    dur: 64,
    depth: 2,
    attrs: "sku=GR-200 qty=1",
  },
  {
    id: "d",
    name: "pricing.quote",
    svc: "pricing",
    start: 20,
    dur: 2231,
    depth: 2,
    attrs: "currency=INR",
  },
  { id: "e", name: "tax.calculate", svc: "tax", start: 33, dur: 2196, depth: 3, attrs: "state=KA" },
  {
    id: "f",
    name: "SELECT tax_rates",
    svc: "tax-db",
    start: 45,
    dur: 2140,
    depth: 4,
    attrs: "db.statement=SELECT … WHERE hsn_code=? rows_scanned=4,812,300",
  },
  {
    id: "g",
    name: "payment.authorize",
    svc: "payment",
    start: 2262,
    dur: 110,
    depth: 2,
    attrs: "provider=cards amount=1499",
  },
];

const T_FRAMES: { title: string; text: string; focus: string[]; tone?: "good" | "bad" }[] = [
  {
    title: "One request, 2.4 seconds",
    text: "The top bar is the whole checkout request. Each bar is a span: one piece of work, with a start time and a duration.",
    focus: ["a"],
  },
  {
    title: "Spans nest",
    text: "The web server called the checkout service, which called three others. A span's children show where its time went.",
    focus: ["b", "c", "d", "g"],
  },
  {
    title: "Parallel, then sequential",
    text: "Inventory and pricing ran at the same time; payment waited until pricing finished. So pricing sits on the critical path.",
    focus: ["c", "d", "g"],
  },
  {
    title: "Found it",
    text: "Almost all of pricing's time is one database query in the tax service, scanning 4.8 million rows. A missing index: fixing it would cut checkout from 2.4 s to about 0.3 s.",
    focus: ["f"],
    tone: "bad",
  },
  {
    title: "How the pieces connect",
    text: "Each service passes a traceparent header to the next, carrying the trace ID and the caller's span ID. Every span reports those IDs, so the tracing system can stitch the tree back together.",
    focus: ["a", "b", "d", "e", "f"],
  },
];

export function Waterfall() {
  const [s, set] = useSceneState<ObsState>();
  const step = Math.min(s.tFrame, T_FRAMES.length - 1);
  const f = T_FRAMES[step];
  const picked = SPANS.find((x) => x.id === s.picked);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Follow one request"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="text-subtle mb-1 flex justify-between pr-16 pl-32 text-[9px]">
              <span>0 ms</span>
              <span>1,200 ms</span>
              <span>2,400 ms</span>
            </div>
            <div className="space-y-1">
              {SPANS.map((x) => {
                const on = f.focus.includes(x.id);
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => set({ picked: x.id })}
                    className={cn(
                      "flex w-full items-center gap-2 rounded text-left transition",
                      !on && "opacity-35",
                      s.picked === x.id && "ring-accent ring-1",
                    )}
                  >
                    <span
                      className="w-30 shrink-0 truncate text-[10px]"
                      style={{ paddingLeft: x.depth * 7 }}
                    >
                      {x.name}
                    </span>
                    <span className="bg-surface-2 relative h-4 flex-1 rounded">
                      <motion.span
                        className={cn(
                          "absolute inset-y-0 rounded",
                          x.id === "f" && step >= 3 ? "bg-bad/75" : "bg-viz-compute/60",
                        )}
                        initial={false}
                        animate={{
                          left: `${(x.start / 2400) * 100}%`,
                          width: `${Math.max(0.8, (x.dur / 2400) * 100)}%`,
                        }}
                      />
                    </span>
                    <span className="text-muted w-14 shrink-0 text-right font-mono text-[9px]">
                      {x.dur.toLocaleString("en-IN")} ms
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-muted mt-2 min-h-8 font-mono text-[10px]">
              {picked
                ? `${picked.svc} · ${picked.name} · ${picked.attrs}`
                : "Click any span to see its details."}
            </p>
          </div>
          <Stepper step={step} count={T_FRAMES.length} onChange={(n) => set({ tFrame: n })} />
          <FrameCaption frameKey={step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          {step === T_FRAMES.length - 1 && (
            <Code>
              {
                "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n            version-trace id (32 hex)---------parent span id--flags"
              }
            </Code>
          )}
        </div>
      }
    >
      <p>
        A <Term id="trace">trace</Term> is like a parcel&apos;s tracking history: every stop, with a
        timestamp. Step through Brewline&apos;s slow checkout and find where the 2.4 seconds went.
      </p>
      <p className="text-muted text-sm">
        The header format is a W3C standard (Trace Context), so traces can cross services written in
        different languages and even different vendors&apos; tools.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: which signal? --------------------------------------------------------------------- */

export function WhichSignal() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which signal?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-signal"
            prompt="Which signal answers each question best?"
            categories={[
              { id: "metrics", label: "Metrics" },
              { id: "logs", label: "Logs" },
              { id: "traces", label: "Traces" },
            ]}
            items={[
              {
                id: "rising",
                label: "Is the error rate rising right now?",
                category: "metrics",
                why: "A number over time: cheap to compute and alert on.",
              },
              {
                id: "why",
                label: "What exactly went wrong with order 7731?",
                category: "logs",
                why: "The detailed event records for that order, found by its ID.",
              },
              {
                id: "which",
                label: "Which service makes checkout slow?",
                category: "traces",
                why: "Traces show where time goes across services.",
              },
              {
                id: "disk",
                label: "Will the database disk fill up this month?",
                category: "metrics",
                why: "A trend in a single number.",
              },
              {
                id: "user",
                label: "What did this user's failed request send?",
                category: "logs",
                why: "Individual events with their details.",
              },
              {
                id: "fanout",
                label: "Why does one page call the pricing service 40 times?",
                category: "traces",
                why: "A trace shows every call a request made, in order.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Useful checklists for what to measure: Google&apos;s four golden signals (latency, traffic,
        errors, saturation); RED for services (rate, errors, duration); USE for resources
        (utilisation, saturation, errors).
      </p>
    </StepLayout>
  );
}

/* 4 ─ The error budget ⭐ ------------------------------------------------------------------------- */

const SLOS = [0.99, 0.995, 0.999, 0.9995];

function BudgetChart({
  left,
  marks,
}: {
  left: number[];
  marks: { at: number; kind: "page" | "ticket" }[];
}) {
  const W = 360;
  const H = 140;
  const lo = Math.min(-0.2, ...left);
  const x = (h: number) => 30 + (h / (DAYS * 24)) * (W - 38);
  const y = (v: number) => 12 + ((1 - v) / (1 - lo)) * (H - 32);
  const d = left.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Error budget remaining over 30 days"
    >
      <line x1={30} x2={W - 8} y1={y(0)} y2={y(0)} stroke="var(--bad)" strokeDasharray="3 3" />
      <text x={26} y={y(0) + 3} textAnchor="end" className="fill-subtle text-[7px]">
        0%
      </text>
      <text x={26} y={y(1) + 3} textAnchor="end" className="fill-subtle text-[7px]">
        100%
      </text>
      {INCIDENTS.map((inc) => (
        <rect
          key={inc.id}
          x={x(inc.day * 24)}
          y={10}
          width={Math.max(1.5, x(inc.hours) - 30)}
          height={H - 28}
          fill="var(--viz-compute)"
          opacity={0.15}
        />
      ))}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--fg)"
        strokeWidth={1.5}
        initial={{ d }}
        animate={{ d }}
      />
      {marks.map((m, i) => (
        <path
          key={i}
          d={`M${x(m.at / 60)},${H - 16} l-3,5 h6 z`}
          fill={m.kind === "page" ? "var(--bad)" : "var(--viz-compute)"}
        />
      ))}
      {[0, 10, 20, 30].map((dd) => (
        <text
          key={dd}
          x={x(dd * 24)}
          y={H - 1}
          textAnchor={dd === 30 ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          day {dd}
        </text>
      ))}
    </svg>
  );
}

export function ErrorBudget() {
  const [s, set] = useSceneState<ObsState>();
  const errs = useMemo(() => errorSeries(), []);
  const slo = SLOS[s.slo];
  const r = useMemo(() => evaluate(slo, errs), [slo, errs]);
  const marks =
    s.alerting === "burn"
      ? r.alerts.map((a) => ({ at: a.minute, kind: a.kind }))
      : r.naive.map((a) => ({ at: a.minute, kind: a.kind }));
  const out = r.finalLeft < 0;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Spend the error budget"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-20 text-xs">SLO</span>
            <Segmented
              size="sm"
              value={String(s.slo)}
              options={SLOS.map(
                (v, i) =>
                  [String(i), `${(v * 100).toFixed(v === 0.9995 ? 2 : 1)}%`] as [string, string],
              )}
              onChange={(v) => set({ slo: Number(v) })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-20 text-xs">Alerting</span>
            <Segmented
              size="sm"
              value={s.alerting}
              options={[
                ["naive", "Errors > 1% for 5 min"],
                ["burn", "Burn-rate alerts"],
              ]}
              onChange={(v) => set({ alerting: v as ObsState["alerting"] })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <BudgetChart left={r.budgetLeft} marks={marks} />
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-fg h-px w-4" /> budget left
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute/30 size-2.5" /> incident
              </span>
              <span className="flex items-center gap-1">
                <span className="text-bad">▲</span> page
              </span>
              {s.alerting === "burn" && (
                <span className="flex items-center gap-1">
                  <span className="text-viz-compute">▲</span> ticket
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-1.5">
            {INCIDENTS.map((inc) => {
              const det = r.detected[inc.id];
              const got = s.alerting === "burn" ? det.burn : det.naive ? "page" : null;
              return (
                <div
                  key={inc.id}
                  className="border-line bg-surface flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs"
                >
                  <span>{inc.label}</span>
                  <span
                    className={cn("shrink-0 font-mono text-[10px]", got ? "text-fg" : "text-bad")}
                  >
                    {got ?? "missed"}
                  </span>
                </div>
              );
            })}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              out ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            {out
              ? `Budget overspent (${Math.round(r.finalLeft * 100)}% left). Under an error-budget policy, risky launches pause and the team works on reliability until it recovers.`
              : `${Math.round(r.finalLeft * 100)}% of the budget left at day 30: room for faster releases and experiments.`}{" "}
            {s.alerting === "naive"
              ? "The simple threshold never noticed the slow leak, the incident that cost the most budget."
              : "Fast burns page someone now; slow burns open a ticket for working hours."}
          </p>
        </div>
      }
    >
      <p>
        An <Term id="slo">SLO</Term> is a reliability target you choose, such as &ldquo;99.9% of
        checkout requests succeed over 30 days&rdquo;. The thing you measure (here, the share of
        successful requests) is the <Term id="sli">SLI</Term>. An SLA is the contract with
        penalties, and is usually looser.
      </p>
      <p>
        The 0.1% you&apos;re allowed to fail is your <Term id="error-budget">error budget</Term>.
        Watch three incidents spend it, and compare two ways of alerting.
      </p>
      <p className="text-muted text-sm">
        Burn-rate alerts (from Google&apos;s SRE Workbook) page when the budget is being used up
        fast, such as 2% of a month&apos;s budget in one hour, and file a ticket for slow burns,
        such as 10% in three days.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Tools ---------------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "OpenTelemetry",
    "The vendor-neutral standard for producing metrics, logs and traces (APIs, SDKs, the OTLP protocol and a Collector). It graduated in the CNCF in 2026.",
  ],
  [
    "Open source",
    "Prometheus for metrics, Grafana for dashboards, Jaeger (v2 is built on the OpenTelemetry Collector) and Tempo for traces, Loki or OpenSearch for logs.",
  ],
  [
    "AWS",
    "CloudWatch metrics, logs and Application Signals (with SLOs and burn rates). X-Ray's own SDKs reach end of support in February 2027, in favour of OpenTelemetry.",
  ],
  ["Azure", "Azure Monitor: metrics, Log Analytics and Application Insights for traces."],
  ["Google Cloud", "Cloud Monitoring (with SLO monitoring), Cloud Logging and Cloud Trace."],
  [
    "Commercial",
    "Datadog, New Relic, Honeycomb, Grafana Cloud, Dynatrace and others accept OpenTelemetry data.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Observability tools"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Instrument with OpenTelemetry and you can send the same data to any of these, and switch
        later.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Three signals", "Metrics say something's wrong; traces say where; logs say what."],
  ["Propagate context", "One trace ID across every service ties the signals together."],
  ["Choose an SLO", "A target users would notice missing; 100% isn't one."],
  ["Spend the budget", "Reliability to spare buys speed; an overspent budget slows launches."],
  ["Alert on burn rate", "Page for fast burns, ticket for slow ones; skip noisy thresholds."],
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
      <p>That completes reliability.</p>
      <p>Next chapter: classic design problems, starting with a URL shortener.</p>
    </StepLayout>
  );
}

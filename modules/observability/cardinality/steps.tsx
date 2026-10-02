"use client";

import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LABELS, costs, fmtNum, fmtUsd, series, type Label } from "./model";
import type { CardState } from "./state";

/* 1 ─ One label too many ⭐ ----------------------------------------------------------------------- */

export function OneTooMany() {
  const [s, set] = useSceneState<CardState>();
  const on = s.labels ?? [];
  const n = series(on);
  const c = costs(n);
  const toggle = (l: Label) =>
    set({ labels: on.includes(l) ? on.filter((x) => x !== l) : [...on, l] });
  const danger = n > 100_000;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One label too many"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="font-mono text-xs">
            http_requests_total{"{"}
            {on.map((l, i) => (
              <span
                key={l}
                className={l === "customer" || l === "pod" ? "text-bad" : "text-accent"}
              >
                {i ? ", " : ""}
                {LABELS[l].name}=…
              </span>
            ))}
            {"}"}
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {(Object.keys(LABELS) as Label[]).map((l) => {
              const sel = on.includes(l);
              const risky = l === "customer" || l === "pod";
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => toggle(l)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left",
                    sel
                      ? risky
                        ? "border-bad bg-bad/10"
                        : "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-semibold">{LABELS[l].name}</span>
                    <span className="text-muted font-mono text-[10px]">
                      × {LABELS[l].values.toLocaleString("en-IN")}
                    </span>
                  </span>
                  <span className="text-muted block text-[10px]">{LABELS[l].note}</span>
                </button>
              );
            })}
          </div>
          <div
            className={cn(
              "rounded-xl border px-4 py-3",
              danger ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
            )}
          >
            <p className="text-muted text-[10px]">
              Time series for this one metric (every possible combination)
            </p>
            <motion.p
              key={n}
              initial={{ scale: 0.95, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn("font-mono text-2xl font-semibold", danger && "text-bad")}
            >
              {fmtNum(n)}
            </motion.p>
            {danger && (
              <p className="text-bad mt-1 flex items-center gap-1 text-xs">
                <AlertTriangle className="size-3" /> enough to slow or crash a Prometheus server
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Grafana Cloud", c.grafana],
              ["Datadog", c.datadog],
              ["CloudWatch (at least)", c.cloudwatch],
            ].map(([k, v]) => (
              <div
                key={k as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{k}</p>
                <p className="font-mono text-sm font-semibold">{fmtUsd(v as number)}/mo</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            List prices read 3 October 2026, for this metric alone: Grafana Cloud $6.50 per 1,000
            active series after 10,000 free; Datadog about $5 per 100 custom metrics (before
            per-host allowances); CloudWatch $0.30 per metric for the first 10,000, lower tiers
            after. Contracts vary.
          </p>
        </div>
      }
    >
      <p>
        <Term id="label">Labels</Term> let one metric be sliced: requests by method, by route, by
        status. But every unique combination of label values is stored as its own{" "}
        <Term id="time-series">time series</Term>, so labels multiply.
      </p>
      <p>
        Add the sensible labels one at a time and the count stays in the thousands. Then add pod
        names that change on every deploy, or a customer ID. That&apos;s{" "}
        <Term id="cardinality">high cardinality</Term>, and it can bring a metrics system down or
        multiply a bill a thousandfold.
      </p>
      <p>
        The Prometheus docs warn: &ldquo;Do not use labels to store dimensions with high cardinality
        (many different label values), such as user IDs, email addresses, or other unbounded sets of
        values.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Where the detail belongs -------------------------------------------------------------------- */

export function WhereDetail() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the detail belongs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">Metric labels</p>
              <p className="text-muted mt-1 text-xs">
                A few small, fixed sets: method, route template, status class, region. Prometheus
                suggests most metrics have no labels, and keeping each metric&apos;s cardinality
                below 10 as a general guideline.
              </p>
            </div>
            <div className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">Traces, logs and events</p>
              <p className="text-muted mt-1 text-xs">
                Customer IDs, order IDs, exact URLs, trace IDs. Each event is stored once, so a
                unique value costs nothing extra; tools like Honeycomb let you group or filter on
                any attribute, whatever its cardinality.
              </p>
            </div>
          </div>
          <Code>{`# OpenTelemetry SDK view: keep only the labels you allow
views:
  - selector: { instrument_name: http.server.request.duration }
    stream:
      attribute_keys: [http.request.method, http.route,
                       http.response.status_code]`}</Code>
          <p className="text-muted text-xs">
            OpenTelemetry SDKs also cap each metric at 2,000 combinations by default and fold the
            rest into one overflow series, a safety net rather than a design.
          </p>
        </div>
      }
    >
      <p>
        The fix isn&apos;t to throw the detail away. It&apos;s to put it where it&apos;s cheap. Ask
        &ldquo;which customer?&rdquo; of traces or events, and keep metrics for the questions you
        ask all the time across everyone.
      </p>
      <p>
        Vendors sell tools for the mess too: Datadog&apos;s Metrics without Limits lets you choose
        which tags are indexed, and Grafana&apos;s Adaptive Metrics aggregates away series nobody
        queries.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Label or not? ------------------------------------------------------------------------------- */

export function LabelOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Label or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="label-or-not"
            prompt="Is each a sensible metric label, or detail that belongs in traces and logs?"
            categories={[
              { id: "label", label: "Metric label" },
              { id: "trace", label: "Traces and logs" },
            ]}
            items={[
              {
                id: "method",
                label: "HTTP method",
                category: "label",
                why: "A handful of values, fixed.",
              },
              {
                id: "route",
                label: "Route template, such as /orders/{id}",
                category: "label",
                why: "Bounded by the number of endpoints in your code.",
              },
              {
                id: "status",
                label: "Status code class (2xx, 4xx, 5xx)",
                category: "label",
                why: "Tiny and fixed.",
              },
              {
                id: "customer",
                label: "Customer ID",
                category: "trace",
                why: "Unbounded: one series per customer. Put it on spans and log lines.",
              },
              {
                id: "url",
                label: "Full URL, such as /orders/88123",
                category: "trace",
                why: "Every order ID makes a new series; use the route template instead.",
              },
              {
                id: "traceid",
                label: "Trace ID",
                category: "trace",
                why: "Unique per request. Link it with exemplars, never as a label.",
              },
            ]}
            explanation="Labels must come from small, fixed sets. Anything that grows with users, orders or requests belongs on traces, logs or events."
          />
        </div>
      }
    >
      <p>The test: can you list every value the label will ever have?</p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Labels multiply", "Series = the product of each label's values."],
  ["Bounded only", "Small, fixed sets; route templates, not URLs."],
  ["Watch churn", "Pod names that change on every deploy add series too."],
  ["Detail on events", "IDs go on traces, logs and wide events."],
  ["Guard rails", "SDK views, cardinality limits and vendor tooling."],
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
        Cardinality is the most common reason a metrics bill surprises a team. Review new labels the
        way you review database schema changes: they&apos;re cheap to add and expensive to live
        with.
      </p>
      <p>Next: the four numbers every service should show first.</p>
    </StepLayout>
  );
}

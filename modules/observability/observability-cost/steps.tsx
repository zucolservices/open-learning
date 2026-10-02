"use client";

import { motion } from "motion/react";
import { Activity, Check, Database, EyeOff, FileText, Server, Waypoints } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LEVERS, PRICES_AS_OF, UNITS, bills, volume, type Lever } from "./model";
import type { CostState } from "./state";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/* 1 ─ Same calls, different bills ----------------------------------------------------------------- */

const MONTH = [
  { icon: Server, v: "20", l: "hosts" },
  { icon: FileText, v: "500 GB", l: "of logs" },
  { icon: Activity, v: "50,000", l: "metric series" },
  { icon: Waypoints, v: "100 GB", l: "of traces" },
];

export function PhonePlans() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Same calls, different bills"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <p className="text-muted font-mono text-[10px]">
            one month of telemetry from a mid-sized service
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MONTH.map(({ icon: Icon, v, l }, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-3 py-3"
              >
                <Icon className="text-accent size-4" />
                <p className="font-mono text-lg font-semibold">{v}</p>
                <p className="text-muted text-xs">{l}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["31%", "name cost as a top concern"],
              ["65%", "say cost matters when choosing tools, the top answer"],
              ["90%", "expect to spend the same or more next year"],
            ].map(([n, l]) => (
              <div key={n} className="border-line bg-surface rounded-lg border px-2 py-2">
                <p className="text-accent font-mono text-base font-semibold">{n}</p>
                <p className="text-muted text-[10px] leading-tight">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Grafana Labs Observability Survey 2026, 1,363 responses. The month above is
            illustrative.
          </p>
        </div>
      }
    >
      <p>
        Two friends make the same calls and use the same data. One plan charges per minute, the
        other per gigabyte, a third per line. Their bills differ wildly, and neither friend did
        anything differently.
      </p>
      <p>
        Observability is priced the same way. Every platform counts something different: hosts,
        gigabytes of <Term id="ingestion">ingestion</Term>, metric series, events, users. Learn what
        each one counts, and what your telemetry is made of, and the bill stops being a surprise.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Cut the bill ⭐ ----------------------------------------------------------------------------- */

const BASE = Math.max(...bills(volume([])).map((b) => b.total));

export function CutTheBill() {
  const [s, set] = useSceneState<CostState>();
  const on = s.levers ?? [];
  const toggle = (l: Lever) =>
    set({ levers: on.includes(l) ? on.filter((x) => x !== l) : [...on, l] });
  const now = bills(volume(on));
  const before = bills(volume([]));
  const blind = on.includes("notraces");
  const safe = LEVERS.filter((l) => !l.blind).every((l) => on.includes(l.id)) && !blind;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Cut the bill"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {LEVERS.map((l) => {
              const active = on.includes(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(l.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                    active
                      ? l.blind
                        ? "border-bad/60 bg-bad/10"
                        : "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded border",
                      active ? "border-accent bg-accent text-accent-fg" : "border-line",
                    )}
                  >
                    {active && <Check className="size-2.5" />}
                  </span>
                  <span>
                    <span className="font-medium">{l.label}</span>
                    {active && <span className="text-muted block text-[11px]">{l.note}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            {now.map((b, i) => (
              <div key={b.name}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-medium">{b.name}</span>
                  <span className="font-mono">
                    {on.length > 0 && (
                      <span className="text-subtle mr-1.5 line-through">
                        {usd(before[i].total)}
                      </span>
                    )}
                    <span className="font-semibold">{usd(b.total)}</span>
                    <span className="text-muted">/mo</span>
                  </span>
                </div>
                <div className="bg-surface-2 mt-1 h-2 overflow-hidden rounded-full">
                  <motion.div
                    animate={{ width: `${Math.max(1, (b.total / BASE) * 100)}%` }}
                    className="bg-viz-data/70 h-full rounded-full"
                  />
                </div>
                <p className="text-muted mt-0.5 hidden text-[10px] sm:block">
                  biggest line: {[...b.parts].sort((x, y) => y[1] - x[1])[0][0]}
                </p>
              </div>
            ))}
          </div>
          {blind ? (
            <p className="text-bad flex items-center gap-1.5 text-xs">
              <EyeOff className="size-3.5" /> Cheaper, and blind: the next slow-checkout
              investigation has no traces to follow.
            </p>
          ) : safe ? (
            <p className="text-good text-xs">
              Every bill falls, most by more than half, and you can still investigate anything that
              matters.
            </p>
          ) : null}
          <p className="text-subtle text-[10px]">
            Public US list prices as of {PRICES_AS_OF}, annual billing where it differs.
            Illustrative workload; ignores discounts, extra features, longer retention and people.
            Not a ranking.
          </p>
        </div>
      }
    >
      <p>
        The same month of telemetry, priced on four platforms. Switch on the cost levers one by one
        and watch which bills move.
      </p>
      <p>
        Notice what dominates. Per-series metric pricing makes{" "}
        <Term id="cardinality">cardinality</Term> the bill on some platforms; per-event indexing
        makes log volume the bill on others. CloudWatch now also offers OpenTelemetry metrics at
        $0.50 per GB with no per-series charge, which changes the picture again.
      </p>
      <p>
        The levers are the ones you met earlier: dropping at the Collector,{" "}
        <Term id="tail-sampling">tail sampling</Term>, shorter <Term id="retention">retention</Term>
        . One of them saves money by making you blind.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What you pay for ---------------------------------------------------------------------------- */

export function PricingUnits() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What you pay for"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface overflow-hidden rounded-xl border text-xs">
            {UNITS.map(([n, unit, eg], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "grid gap-x-3 px-3 py-1.5 sm:grid-cols-[8rem_1fr_1fr]",
                  i > 0 && "border-line border-t",
                )}
              >
                <span className="font-semibold">{n}</span>
                <span className="text-muted">{unit}</span>
                <span className="font-mono text-[11px]">{eg}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Public US list prices as of {PRICES_AS_OF}. Prices change often; check before you
            budget.
          </p>
        </div>
      }
    >
      <p>
        Four common pricing units, often mixed: <em>per host</em> (predictable, but punishes many
        small containers), <em>per GB</em> (rewards dropping noise), <em>per series or event</em>{" "}
        (rewards low cardinality and sampling), and <em>per user</em> (cheap data, costly seats).
      </p>
      <p>
        Watch the hidden multipliers too: indexing versus just storing, how long data is kept,
        querying (CloudWatch Logs Insights charges per GB scanned), and moving data between regions
        or clouds.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Build or buy -------------------------------------------------------------------------------- */

export function BuildOrBuy() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Build or buy"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Database className="text-accent size-5" />
            <p className="font-semibold">Run it yourselves</p>
            <p className="text-muted text-xs">
              Prometheus or Mimir, Loki, Tempo or Jaeger, Grafana, OpenSearch. No licence fee; you
              pay in servers, <Term id="object-storage">object storage</Term> and the people who
              keep it running at 3 a.m.
            </p>
            <p className="text-muted text-xs">
              Self-managed teams in Grafana&apos;s survey most often cite complexity and overhead.
            </p>
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Activity className="text-accent size-5" />
            <p className="font-semibold">Pay a platform</p>
            <p className="text-muted text-xs">
              Datadog, New Relic, Honeycomb, Elastic, Grafana Cloud, Splunk or your cloud&apos;s own
              tools. Running it is their problem; the bill grows with your data.
            </p>
            <p className="text-muted text-xs">
              SaaS users in the same survey most often cite cost.
            </p>
          </div>
          <div className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3 text-xs sm:col-span-2">
            Instrument with OpenTelemetry either way. Changing backend then means reconfiguring a
            Collector, not re-instrumenting every service, which keeps{" "}
            <Term id="vendor-lock-in">lock-in</Term> and your negotiating position in check.
          </div>
        </div>
      }
    >
      <p>
        Open-source backends are designed to be cheap to run at scale. Loki &ldquo;does not index
        the contents of the logs, but rather a set of labels for each log stream&rdquo;; Mimir keeps
        long-term data in object storage, &ldquo;ubiquitous, cost-effective, high-durability&rdquo;.
      </p>
      <p>
        Many teams mix: about half of the survey&apos;s respondents run mostly or entirely
        self-managed setups, often with SaaS for some signals. There is no cheapest option in
        general, only cheapest for your data, your scale and your team.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Saving or going blind? ---------------------------------------------------------------------- */

export function SafeOrBlind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Saving or going blind?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-or-blind"
            prompt="Does each change cut cost safely, or remove something you'll need in an incident?"
            categories={[
              { id: "safe", label: "Safe saving" },
              { id: "blind", label: "Going blind" },
            ]}
            items={[
              {
                id: "debug",
                label: "Drop debug-level logs from production at the Collector",
                category: "safe",
                why: "Rarely read, often the bulk of the volume.",
              },
              {
                id: "tail",
                label: "Tail-sample traces, keeping every error and slow trace",
                category: "safe",
                why: "The traces you'd investigate all survive.",
              },
              {
                id: "pod",
                label: "Remove a pod-ID label from a metric no dashboard or alert groups by",
                category: "safe",
                why: "Fewer series, no lost answers.",
              },
              {
                id: "archive",
                label: "Keep verbose logs 7 days hot, then move them to cheap archive storage",
                category: "safe",
                why: "Recent logs stay fast to search; old ones are still there if needed.",
              },
              {
                id: "bank",
                label: "Remove the bank label from the payment-failure metric",
                category: "blind",
                why: "That's exactly the dimension you slice by when one bank is failing.",
              },
              {
                id: "errors1",
                label: "Sample error traces at 1%, the same as everything else",
                category: "blind",
                why: "Errors are rare and precious; keep them all.",
              },
            ]}
            explanation="Cut what nobody uses; keep the dimensions, errors and slow requests that investigations depend on."
          />
        </div>
      }
    >
      <p>Every cut is a bet that you won&apos;t need that data. Make the bets you&apos;d win.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Know the unit", "Hosts, GB, series, events or users: it decides what's expensive."],
  ["Cardinality and volume drive it", "Labels and log levels are cost decisions."],
  ["Cut at the source", "Drop, aggregate and sample before data is billed."],
  ["Don't cut the answers", "Keep errors, slow requests and the dimensions you slice by."],
  ["OpenTelemetry keeps options open", "Switch backends without re-instrumenting."],
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
        Treat telemetry like any other spend: know who sends what, review the biggest sources
        regularly, and ask of each one whether it has ever answered a question.
      </p>
      <p>Next, the capstone: observing a payments platform from end to end.</p>
    </StepLayout>
  );
}

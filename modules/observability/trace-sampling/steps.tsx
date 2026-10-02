"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COMPLAINT, TRACES, keep, type Mode } from "./model";
import type { SamplingState } from "./state";

/* 1 ─ Keep the one that mattered ⭐ --------------------------------------------------------------- */

/** Show 400 traces: all errors and slow ones, plus normal ones, so the picture stays readable. */
const SHOWN = (() => {
  const special = TRACES.filter((t) => t.kind !== "ok");
  const ok = TRACES.filter((t) => t.kind === "ok");
  const step = Math.floor(ok.length / (400 - special.length));
  const normal = ok.filter((_, i) => i % step === 0).slice(0, 400 - special.length);
  return [...special, ...normal].sort((a, b) => a.id - b.id);
})();

export function KeepIt() {
  const [s, set] = useSceneState<SamplingState>();
  const policy = { errors: s.keepErrors, slow: s.keepSlow, rest: s.rest };
  const r = keep(s.mode, s.headPct, policy);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Keep the trace that mattered"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Mode>
              size="sm"
              value={s.mode}
              onChange={(mode) => set({ mode })}
              options={[
                ["head", "Head sampling"],
                ["tail", "Tail sampling"],
              ]}
            />
          </div>
          {s.mode === "head" ? (
            <label className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-xs">
              <span>Keep, decided at the start</span>
              <input
                type="range"
                min={1}
                max={50}
                value={s.headPct}
                onChange={(e) => set({ headPct: Number(e.target.value) })}
                className="accent-accent"
                aria-label="Head sampling percentage"
              />
              <span className="text-right font-mono">{s.headPct}%</span>
            </label>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={s.keepErrors}
                  onChange={(e) => set({ keepErrors: e.target.checked })}
                  className="accent-accent"
                />
                Keep every trace with an error
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={s.keepSlow}
                  onChange={(e) => set({ keepSlow: e.target.checked })}
                  className="accent-accent"
                />
                Keep every trace slower than 1 s
              </label>
              <span className="text-muted">plus {s.rest}% of the rest</span>
            </div>
          )}
          <div
            className="grid grid-cols-[repeat(25,minmax(0,1fr))] gap-[2px] sm:grid-cols-[repeat(40,minmax(0,1fr))]"
            aria-hidden
          >
            {SHOWN.map((t) => {
              const kept = r.set.has(t.id);
              return (
                <div
                  key={t.id}
                  className={cn(
                    "aspect-square rounded-[2px]",
                    t.id === COMPLAINT && "ring-fg ring-1",
                    t.kind === "error"
                      ? kept
                        ? "bg-bad"
                        : "bg-bad/20"
                      : t.kind === "slow"
                        ? kept
                          ? "bg-viz-compute"
                          : "bg-viz-compute/20"
                        : kept
                          ? "bg-viz-data/70"
                          : "bg-viz-idle/20",
                  )}
                />
              );
            })}
          </div>
          <p className="text-muted font-mono text-[10px]">
            bright = kept · red = error · amber = slow · outlined = tomorrow&apos;s complaint
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Traces kept", `${r.kept.toLocaleString("en-IN")} of 10,000`, false],
              ["Errors kept", `${r.errors[0]} of ${r.errors[1]}`, r.errors[0] < r.errors[1]],
              ["Slow kept", `${r.slow[0]} of ${r.slow[1]}`, r.slow[0] < r.slow[1]],
              ["The complaint", r.complaint ? "kept" : "lost", !r.complaint],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p
                  className={cn("font-mono text-sm font-semibold", bad ? "text-bad" : "text-good")}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: 10,000 traces in an hour, 0.5% with errors and 1% slow (400 shown).
          </p>
        </div>
      }
    >
      <p>
        Storing every trace of a busy system costs a fortune, so teams keep a sample. The question
        is which ones.
      </p>
      <p>
        <Term id="head-sampling">Head sampling</Term> decides when the trace starts, by a coin toss
        on its ID. In OpenTelemetry&apos;s words, the decision is made &ldquo;as early as possible …
        not made by inspecting the trace as a whole&rdquo;. It&apos;s cheap, but blind: at 1% you
        lose 99% of the errors.
      </p>
      <p>
        <Term id="tail-sampling">Tail sampling</Term> decides after the trace is complete, so it can
        keep every failure and every slow request, plus a small share of normal ones. Switch modes
        and compare: fewer traces kept, and the one that mattered is among them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How tail sampling works --------------------------------------------------------------------- */

const FRAMES = [
  {
    t: "Spans arrive from everywhere",
    d: "Each service sends its spans as it finishes them. One trace's spans come from several services, over several seconds.",
  },
  {
    t: "Route each trace to one place",
    d: "A first layer of collectors uses the load_balancing exporter, keyed on trace ID, so every span of a trace reaches the same tail-sampling collector.",
  },
  {
    t: "Wait, then decide",
    d: "The tail_sampling processor holds each trace in memory for decision_wait (30 seconds by default), then applies the policies: error status, latency, a probabilistic share, rate limits, attributes.",
  },
  {
    t: "The costs",
    d: "Memory for every trace in flight (num_traces defaults to 50,000), extra collectors, and spans that arrive after the decision. It's worth it on busy systems; small ones can keep everything.",
  },
];

export function HowTail() {
  const [s, set] = useSceneState<SamplingState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="How tail sampling works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`processors:
  tail_sampling:
    decision_wait: 30s
    policies:
      - { name: errors, type: status_code, status_code: { status_codes: [ERROR] } }
      - { name: slow,   type: latency,     latency: { threshold_ms: 1000 } }
      - { name: some,   type: probabilistic, probabilistic: { sampling_percentage: 1 } }`}</Code>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={f.t}>
            {f.d}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Tail sampling usually runs in the OpenTelemetry Collector (or in tools like Honeycomb&apos;s
        Refinery and vendor retention filters, which all keep errors and slow traces by default).
      </p>
      <p>
        Head sampling has a role too. The SDK default, ParentBased, makes every service follow the
        decision recorded in the traceparent&apos;s last two digits (01 = sampled), so traces are
        either complete or absent, never half there.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Count first, then sample -------------------------------------------------------------------- */

export function CountFirst() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Count first, then sample"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">Metrics from every span</p>
            <p className="text-muted mt-1 text-sm">
              The Collector&apos;s span_metrics connector turns all spans into request, error and
              duration metrics before any are thrown away. Your error rates stay exact even when you
              keep 1% of traces.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="font-semibold">Exemplars back to traces</p>
            <p className="text-muted mt-1 text-sm">
              Exemplars are &ldquo;references to data outside of the MetricSet&rdquo;, such as trace
              IDs. A spike on the latency graph links to a kept trace from that moment.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Never compute rates from sampled traces: a 1% sample makes every count a guess. Count from
        all spans, then sample what you store. Datadog documents the same rule: its APM metrics
        &ldquo;are always calculated based on all traces&rdquo;.
      </p>
      <p>
        Google&apos;s Dapper paper showed how far sampling can go: &ldquo;one sampled trace for
        every 1024 candidates&rdquo; was still enough for its high-volume services.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Head or tail? ------------------------------------------------------------------------------- */

export function HeadOrTail() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Head or tail?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="head-or-tail"
            prompt="Which sampling gives you each set of traces reliably?"
            categories={[
              { id: "head", label: "Head sampling is enough" },
              { id: "tail", label: "Needs tail sampling" },
            ]}
            items={[
              {
                id: "baseline",
                label: "A random 1% of all requests, for typical latency",
                category: "head",
                why: "A coin toss at the start gives an unbiased random sample.",
              },
              {
                id: "capacity",
                label: "A steady share of traffic for capacity planning",
                category: "head",
                why: "Random and proportional is exactly what head sampling provides.",
              },
              {
                id: "errors",
                label: "Every request that failed",
                category: "tail",
                why: "Failure is only known at the end, so only a decision after the trace can keep them all.",
              },
              {
                id: "slow",
                label: "Every request slower than 2 seconds",
                category: "tail",
                why: "Duration is known only when the trace is complete.",
              },
              {
                id: "downstream",
                label: "Requests where a downstream bank call timed out",
                category: "tail",
                why: "The timeout happens deep in the trace; the root can't know at the start.",
              },
            ]}
            explanation="Head sampling gives cheap random samples. Anything defined by how the request turned out needs a decision at the tail."
          />
        </div>
      }
    >
      <p>Ask: can you know at the start whether you&apos;ll want this trace?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Sample to afford traces", "Keep a share, not everything."],
  ["Head: cheap and random", "Decided at the start; misses rare failures."],
  ["Tail: keep what matters", "Every error and slow trace, plus a little of the rest."],
  ["Count before sampling", "Metrics from all spans; exemplars to kept traces."],
  ["Keep traces whole", "Route by trace ID; follow the parent's decision."],
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
        OpenTelemetry&apos;s classic ratio sampler, TraceIdRatioBased, is being replaced by a
        composable ProbabilitySampler, part of work on consistent probability sampling that is still
        in development (October 2026).
      </p>
      <p>Next: profiles, the signal that shows which lines of code are burning the time.</p>
    </StepLayout>
  );
}

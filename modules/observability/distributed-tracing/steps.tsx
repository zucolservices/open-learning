"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CULPRIT, FRAMES, SPANS, TOTAL, type Span } from "./model";
import type { TraceState } from "./state";

/* 1 ─ Follow one checkout ⭐ ---------------------------------------------------------------------- */

const SERVICE_CLS: Record<string, string> = {
  gateway: "bg-viz-idle/60",
  orders: "bg-viz-data/55",
  cart: "bg-viz-add/55",
  inventory: "bg-viz-compute/60",
  payments: "bg-viz-meta/55",
};

function depth(s: Span): number {
  let d = 0;
  let p = s.parent;
  while (p) {
    d++;
    p = SPANS.find((x) => x.id === p)?.parent;
  }
  return d;
}

export function FollowCheckout() {
  const [s, set] = useSceneState<TraceState>();
  const f = FRAMES[s.frame];
  const last = s.frame === FRAMES.length - 1;
  const visible = SPANS.filter((x) => x.at <= s.frame);
  const picked = SPANS.find((x) => x.id === s.pick);
  const correct = s.pick === CULPRIT;
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Follow one checkout"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-3 py-3">
            <div className="text-muted mb-1 grid grid-cols-[7rem_1fr] font-mono text-[9px] sm:grid-cols-[10rem_1fr]">
              <span>span</span>
              <span className="flex justify-between">
                <span>0 ms</span>
                <span>{TOTAL} ms</span>
              </span>
            </div>
            {visible.map((x) => (
              <motion.button
                key={x.id}
                type="button"
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                disabled={!last}
                onClick={() => set({ pick: x.id })}
                className={cn(
                  "grid grid-cols-[7rem_1fr] items-center gap-2 rounded text-left disabled:cursor-default sm:grid-cols-[10rem_1fr]",
                  last && "hover:bg-surface-2",
                  s.pick === x.id && (correct ? "bg-good/10" : "bg-bad/10"),
                )}
              >
                <span
                  className="truncate font-mono text-[10px]"
                  style={{ paddingLeft: depth(x) * 8 }}
                >
                  {x.name}
                  <span className="text-muted"> · {x.service}</span>
                </span>
                <span className="relative h-3.5">
                  <span
                    className={cn("absolute inset-y-0 rounded-sm", SERVICE_CLS[x.service])}
                    style={{
                      left: `${(x.start / TOTAL) * 100}%`,
                      width: `${Math.max(0.6, (x.dur / TOTAL) * 100)}%`,
                    }}
                  />
                  <span
                    className="text-muted absolute top-0 hidden font-mono text-[8px] leading-[14px] sm:block"
                    style={{ left: `${Math.min(88, ((x.start + x.dur) / TOTAL) * 100 + 0.5)}%` }}
                  >
                    {x.dur} ms
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
          {f.header && (
            <code className="bg-surface-2 self-start rounded px-2 py-1 font-mono text-[10px] break-all">
              {f.header}
            </code>
          )}
          {last && picked && (
            <p className={cn("text-sm", correct ? "text-good" : "text-bad")}>
              {correct
                ? "Yes: one query waited 1.86 s for a row lock, and everything after it had to wait too. It sits on the critical path, so fixing it shortens the whole request."
                : picked.id === "a" || picked.id === "b" || picked.id === "d"
                  ? "That span is long, but only because something inside it is. Look for the deepest span that accounts for the time."
                  : "That one is quick. Find where most of the 2.6 seconds went."}
            </p>
          )}
          <Stepper step={s.frame} count={FRAMES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A checkout took 2.6 seconds. It passed through five services. Step through how its{" "}
        <Term id="trace">trace</Term> is built, one <Term id="span">span</Term> at a time, then find
        the span to blame.
      </p>
      <p>
        The magic is <Term id="context-propagation">context propagation</Term>: each call carries a
        small header with the trace ID and the caller&apos;s span ID, so every service adds its
        spans to the same tree, even though none of them can see the others.
      </p>
      <p>
        A long parent span usually isn&apos;t the problem; it&apos;s just waiting for its children.
        The <Term id="critical-path">critical path</Term> is the chain of spans the request actually
        had to wait for.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The header that holds it together ----------------------------------------------------------- */

const PARTS: [string, string, string][] = [
  ["00", "version", "Always 00 today."],
  [
    "4bf92f3577b34da6a3ce929d0e0e4736",
    "trace-id",
    "32 lowercase hex characters, shared by every span in the trace.",
  ],
  ["00f067aa0ba902b7", "parent-id", "16 hex characters: the span that made this call."],
  ["01", "trace-flags", "01 means this trace is being sampled (recorded)."],
];

export function Traceparent() {
  const [s, set] = useSceneState<TraceState>();
  const p = PARTS[s.part] ?? PARTS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The header that holds it together"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <p className="font-mono text-xs break-all">
            <span className="text-muted">traceparent: </span>
            {PARTS.map(([v], i) => (
              <span key={v}>
                {i > 0 && <span className="text-muted">-</span>}
                <button
                  type="button"
                  onClick={() => set({ part: i })}
                  className={cn(
                    "rounded px-0.5",
                    i === s.part ? "bg-accent-soft text-accent" : "hover:bg-surface-2",
                  )}
                >
                  {v}
                </button>
              </span>
            ))}
          </p>
          <motion.div
            key={s.part}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-mono text-sm font-semibold">{p[1]}</p>
            <p className="text-muted text-sm">{p[2]}</p>
          </motion.div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Through a queue</p>
            <p className="text-muted mt-1">
              When work goes through a message queue, the producer puts the trace context in the
              message (Kafka carries it as a traceparent header). The consumer&apos;s span can then
              link back to it, even if it runs minutes later in a batch with other messages.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The format is a W3C standard, Trace Context, a Recommendation since November 2021, which is
        why services written in different languages, instrumented with different tools, can share
        one trace. Click each part of the header.
      </p>
      <p>
        If any service in the chain drops the header (say, an old proxy that doesn&apos;t pass it
        on), the trace breaks in two at that point.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The gap ------------------------------------------------------------------------------------- */

export function TheGap() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The gap"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="trace-gap"
            prompt="A trace shows POST /refund at 3.1 s in the refunds service. Its only child span, a 250 ms call to payments, starts 2.7 s in. Before that, nothing. What's the most likely explanation?"
            options={[
              {
                id: "payments",
                label: "The payments service is slow",
                feedback: "Its span is only 250 ms; it isn't where the time went.",
              },
              {
                id: "inside",
                label:
                  "The refunds service spent 2.7 s on work that has no span: uninstrumented code, a library without instrumentation, or waiting",
                correct: true,
                feedback:
                  "A gap with no child spans is time spent inside the service itself. Add a span around the suspect code, or look at a profile.",
              },
              {
                id: "network",
                label: "The network between the user and the gateway",
                feedback: "That would happen before the server span starts, not inside it.",
              },
              {
                id: "fine",
                label: "Nothing: traces always have gaps",
                feedback: "Small gaps are normal; 2.7 seconds is the whole story.",
              },
            ]}
            explanation="Traces show only what was instrumented. Unexplained time inside a span points at code that needs its own span, or at a profiler."
          />
        </div>
      }
    >
      <p>What a trace doesn&apos;t show can be just as telling.</p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Trace = tree of spans", "One trace ID; each span a timed operation with a parent."],
  ["Context travels", "The traceparent header carries it from call to call."],
  ["Read the waterfall", "Find the deepest span on the critical path."],
  ["Mind the gaps", "Time without child spans is uninstrumented work."],
  ["Queues need links", "Pass context in messages and link the spans."],
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
        Google&apos;s 2010 Dapper paper started it, and found that sampling as few as one request in
        1,024 was enough on busy services. Twitter open-sourced Zipkin in 2012; Jaeger (Uber, CNCF
        graduated 2019, rebuilt on the OpenTelemetry Collector in 2024) and Grafana Tempo followed.
        AWS has put its X-Ray SDKs into maintenance mode in favour of OpenTelemetry.
      </p>
      <p>Next: since keeping every trace is expensive, how to choose which ones to keep.</p>
    </StepLayout>
  );
}

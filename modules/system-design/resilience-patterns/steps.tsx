"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BULKHEAD, SECONDS, SLOW, THREADS, TIMEOUT, simulate } from "./sim";
import { limit } from "./limiter";
import type { ResState } from "./state";

/* 1 ─ One slow service ⭐ ---------------------------------------------------------------------------- */

function CascadeChart({
  full,
  degraded,
  failed,
  open,
}: {
  full: number[];
  degraded: number[];
  failed: number[];
  open: boolean[];
}) {
  const W = 360;
  const H = 140;
  const max = 260;
  const bw = (W - 36) / SECONDS;
  const x = (i: number) => 28 + i * bw;
  const y = (v: number) => H - 18 - (v / max) * (H - 30);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Pages per second"
    >
      <rect
        x={x(SLOW[0])}
        y={8}
        width={(SLOW[1] - SLOW[0]) * bw}
        height={H - 26}
        fill="var(--viz-compute)"
        opacity={0.08}
      />
      <text x={x(SLOW[0]) + 3} y={16} className="fill-muted text-[7px]">
        Recommendations slow
      </text>
      {full.map((f, i) => {
        const d = degraded[i];
        const e = failed[i];
        return (
          <g key={i}>
            <rect
              x={x(i) + 0.4}
              y={y(f)}
              width={bw - 0.8}
              height={H - 18 - y(f)}
              fill="var(--good)"
              opacity={0.75}
            />
            <rect
              x={x(i) + 0.4}
              y={y(f + d)}
              width={bw - 0.8}
              height={y(f) - y(f + d)}
              fill="var(--viz-compute)"
              opacity={0.7}
            />
            <rect
              x={x(i) + 0.4}
              y={y(f + d + e)}
              width={bw - 0.8}
              height={y(f + d) - y(f + d + e)}
              fill="var(--bad)"
              opacity={0.7}
            />
            {open[i] && <rect x={x(i)} y={H - 16} width={bw} height={3} fill="var(--bad)" />}
          </g>
        );
      })}
      {[0, 100, 200].map((v) => (
        <text key={v} x={24} y={y(v) + 3} textAnchor="end" className="fill-subtle text-[7px]">
          {v}
        </text>
      ))}
      {[0, 10, 20, 30, 40].map((sec) => (
        <text
          key={sec}
          x={x(sec)}
          y={H - 4}
          textAnchor={sec === 40 ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          {sec}s
        </text>
      ))}
    </svg>
  );
}

export function Cascade() {
  const [s, set] = useSceneState<ResState>();
  const r = useMemo(
    () => simulate({ timeout: s.timeout, breaker: s.breaker, bulkhead: s.bulkhead }),
    [s.timeout, s.breaker, s.bulkhead],
  );
  const peakBusy = Math.max(...r.busy.slice(SLOW[0], SLOW[1]));
  const toggles: [keyof ResState, string, string][] = [
    ["timeout", `Timeout (${TIMEOUT * 1000} ms)`, "timeout"],
    ["breaker", "Circuit breaker", "circuit-breaker"],
    ["bulkhead", `Bulkhead (${BULKHEAD} threads max)`, "bulkhead"],
  ];
  const msg =
    r.totals.failed > 2000
      ? s.breaker
        ? "The breaker never trips: it counts failures, and without a timeout the slow calls don't fail, they just hang. Every thread ends up waiting."
        : "Every thread ends up waiting on Recommendations. New visitors queue for a thread, then give up. The whole site is down because of a sidebar."
      : r.totals.failed > 0
        ? "The timeout frees each thread after 300 ms instead of 4 s, but that's still six times longer than normal: 40 threads can't keep up, and some visitors still give up."
        : s.breaker && s.timeout
          ? "After a burst of timeouts, the breaker opens: pages skip Recommendations entirely and render in 30 ms. It lets one test call through every 5 s and closes when that succeeds."
          : "Recommendations can only ever tie up a limited number of threads; the rest keep serving pages without the sidebar.";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One slow service"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {toggles.map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(s[k])}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <CascadeChart
              full={r.full}
              degraded={r.degraded}
              failed={r.failed}
              open={r.breakerOpen}
            />
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-good/75 size-2.5" /> full page
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute/70 size-2.5" /> page without recommendations
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-bad/70 size-2.5" /> visitor gave up
              </span>
              {s.breaker && (
                <span className="flex items-center gap-1">
                  <span className="bg-bad h-0.5 w-4" /> breaker open
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Visitors who gave up"
              value={r.totals.failed.toLocaleString("en-IN")}
              bad={r.totals.failed > 0}
            />
            <Stat label="Pages without recs" value={r.totals.degraded.toLocaleString("en-IN")} />
            <Stat
              label="Threads busy (peak)"
              value={`${Math.round(peakBusy)} / ${THREADS}`}
              bad={peakBusy >= THREADS - 1}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.timeout}${s.breaker}${s.bulkhead}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                r.totals.failed ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {msg}
            </motion.p>
          </AnimatePresence>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this simulation works</summary>
            <p className="mt-2">
              200 page views a second; {THREADS} worker threads. A page takes 30 ms for orders plus
              about 50 ms for recommendations, which takes about 4 s from {SLOW[0]} s to {SLOW[1]}{" "}
              s. Visitors waiting more than 2 s for a thread give up. The breaker opens when over
              half of the last 20 calls failed, and tries one call after 5 s.
            </p>
          </details>
        </div>
      }
    >
      <p>
        Picture a call centre where agents must check with the warehouse before answering. One day
        the warehouse is slow to pick up. Soon every agent is on hold, and nobody answers new calls,
        even ones that had nothing to do with the warehouse.
      </p>
      <p>
        That&apos;s a <Term id="cascading-failure">cascading failure</Term>. Here, product pages
        call a Recommendations service for a &ldquo;you may also like&rdquo; sidebar. Watch what
        happens when it slows down, then add protections one at a time.
      </p>
      <p className="text-muted text-sm">
        Showing a page without the sidebar is <em>graceful degradation</em>: a worse page beats no
        page.
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

/* 2 ─ How a circuit breaker works ------------------------------------------------------------------ */

const B_FRAMES: {
  state: "closed" | "open" | "half";
  title: string;
  text: string;
  tone?: "good" | "bad";
}[] = [
  {
    state: "closed",
    title: "Closed: calls flow",
    text: "Like a household circuit breaker, 'closed' means current flows. Every call goes through, and the breaker counts how many fail or time out.",
    tone: "good",
  },
  {
    state: "closed",
    title: "Failures pile up",
    text: "Over half of the recent calls have failed. Continuing only wastes threads and hammers a struggling service.",
    tone: "bad",
  },
  {
    state: "open",
    title: "Open: fail fast",
    text: "The breaker trips. Calls fail immediately without being attempted, and the caller uses a fallback (here, no sidebar). The struggling service gets room to recover.",
  },
  {
    state: "half",
    title: "Half-open: test the water",
    text: "After a cool-down (5 s here), one trial call is let through.",
  },
  {
    state: "closed",
    title: "Closed again",
    text: "The trial succeeded, so normal traffic resumes. If it had failed, the breaker would reopen for another cool-down.",
    tone: "good",
  },
];

export function BreakerStates() {
  const [s, set] = useSceneState<ResState>();
  const step = Math.min(s.bFrame, B_FRAMES.length - 1);
  const f = B_FRAMES[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Inside a circuit breaker"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["closed", "Closed"],
                ["open", "Open"],
                ["half", "Half-open"],
              ] as const
            ).map(([k, label]) => (
              <motion.div
                key={k}
                animate={{ scale: f.state === k ? 1.04 : 1 }}
                className={cn(
                  "rounded-xl border px-3 py-4 text-center",
                  f.state === k
                    ? k === "open"
                      ? "border-bad bg-bad/10"
                      : k === "half"
                        ? "border-viz-compute bg-viz-compute/10"
                        : "border-good bg-good/10"
                    : "border-line bg-surface opacity-50",
                )}
              >
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-muted text-[10px]">
                  {k === "closed"
                    ? "calls go through"
                    : k === "open"
                      ? "calls fail fast"
                      : "one trial call"}
                </p>
              </motion.div>
            ))}
          </div>
          <Stepper step={step} count={B_FRAMES.length} onChange={(n) => set({ bFrame: n })} />
          <FrameCaption frameKey={step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        The pattern was popularised by Michael Nygard&apos;s book <em>Release It!</em> (2007).
        Libraries such as Resilience4j (Java) and Polly (.NET) implement it, and service meshes like
        Envoy and Istio offer similar protection without code changes.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: breaker alone ------------------------------------------------------------------- */

export function BreakerCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why didn't the breaker trip?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="breaker-alone"
            prompt="With only the circuit breaker on, the site still went down. Why?"
            options={[
              {
                id: "timeout",
                label:
                  "Slow calls never failed, so there were no failures to count; a timeout turns slowness into failures",
                correct: true,
                feedback:
                  "Right. Breakers act on failures. Pair them with timeouts, or use a breaker that also counts slow calls (Resilience4j has a slow-call threshold).",
              },
              {
                id: "threshold",
                label: "The 50% threshold was too high",
                feedback:
                  "Even at 1%, the breaker needs failures to count, and hanging calls produce none until they finish.",
              },
              {
                id: "bug",
                label: "Breakers only work for errors, never for slowness",
                feedback:
                  "They can handle slowness, but only if slowness is measured: via timeouts or a slow-call threshold.",
              },
              {
                id: "window",
                label: "The breaker's window was too short",
                feedback: "The window wasn't the problem: nothing in it was a failure.",
              },
            ]}
            explanation="Timeouts first, everywhere: every network call needs one. Then breakers and bulkheads build on top."
          />
        </div>
      }
    >
      <p>Go back and try it if you skipped that combination.</p>
    </StepLayout>
  );
}

/* 4 ─ Rate limiting ⭐ ------------------------------------------------------------------------------ */

export function RateLimit() {
  const [s, set] = useSceneState<ResState>();
  const r = useMemo(() => limit(s.algo, s.rate, s.burst), [s.algo, s.rate, s.burst]);
  const W = 360;
  const H = 120;
  const x = (t: number) => 40 + (t / 10) * (W - 50);
  const yL = (v: number) => H - 18 - (v / 20) * 50;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rate limiting"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.algo}
            options={[
              ["token", "Token bucket"],
              ["fixed", "Fixed window"],
              ["sliding", "Sliding window"],
            ]}
            onChange={(v) => set({ algo: v as ResState["algo"] })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted text-xs">Limit</span>
            <Segmented
              size="sm"
              value={String(s.rate)}
              options={[5, 10, 20].map((n) => [String(n), `${n}/s`] as [string, string])}
              onChange={(v) => set({ rate: Number(v) })}
            />
            {s.algo === "token" && (
              <>
                <span className="text-muted text-xs">Bucket size</span>
                <Segmented
                  size="sm"
                  value={String(s.burst)}
                  options={[1, 10, 20].map((n) => [String(n), String(n)] as [string, string])}
                  onChange={(v) => set({ burst: Number(v) })}
                />
              </>
            )}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Requests accepted and rejected"
            >
              {s.algo === "fixed" &&
                Array.from({ length: 11 }, (_, i) => (
                  <line key={i} x1={x(i)} x2={x(i)} y1={8} y2={H - 16} stroke="var(--line)" />
                ))}
              {s.algo === "token" && (
                <path
                  d={r.level.map(([t, v], i) => `${i === 0 ? "M" : "L"}${x(t)},${yL(v)}`).join(" ")}
                  fill="none"
                  stroke="var(--viz-compute)"
                  strokeWidth={1.2}
                />
              )}
              {r.reqs.map((q, i) => (
                <circle
                  key={i}
                  cx={x(q.t)}
                  cy={q.ok ? 22 : 38}
                  r={2.2}
                  fill={q.ok ? "var(--good)" : "var(--bad)"}
                  opacity={0.85}
                />
              ))}
              <text x={4} y={25} className="fill-muted text-[7px]">
                allowed
              </text>
              <text x={4} y={41} className="fill-muted text-[7px]">
                429
              </text>
              {[0, 2, 4, 6, 8, 10].map((t) => (
                <text
                  key={t}
                  x={x(t)}
                  y={H - 4}
                  textAnchor={t === 10 ? "end" : "middle"}
                  className="fill-subtle text-[8px]"
                >
                  {t}s
                </text>
              ))}
            </svg>
            {s.algo === "token" && (
              <p className="text-muted text-center text-[10px]">Line: tokens left in the bucket</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Allowed" value={String(r.accepted)} />
            <Stat label="Rejected (429)" value={String(r.rejected)} />
            <Stat
              label="Most allowed in any 1 s"
              value={String(r.maxInOneSecond)}
              bad={r.maxInOneSecond > s.rate * 1.5}
            />
          </div>
          <p className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            {s.algo === "token"
              ? "Tokens drip in at the limit rate; each request takes one. A full bucket lets a short burst through, then the client is held to the rate."
              : s.algo === "fixed"
                ? "Simple counters per clock second, but look at 7 s: a burst straddling the boundary gets double the limit through."
                : "Counts requests in the last second, whenever that is. Never more than the limit, but it must remember recent request times (or approximate them)."}
          </p>
        </div>
      }
    >
      <p>
        Timeouts and breakers protect you from slow <em>dependencies</em>. A{" "}
        <Term id="rate-limit">rate limit</Term> protects you from your <em>callers</em>: one noisy
        client shouldn&apos;t use up capacity everyone shares.
      </p>
      <p>
        One client sends a steady trickle, a burst at 3 s, and a burst across the 7 s mark. Compare
        the three classic algorithms.
      </p>
      <p className="text-muted text-sm">
        Rejected requests get HTTP 429 Too Many Requests, ideally with a Retry-After header telling
        the client when to try again.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: shed load ----------------------------------------------------------------------- */

export function ShedOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to drop first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="shed-order"
            prompt="Brewline is overloaded on sale day. Order these from 'drop first' to 'protect at all costs'."
            items={[
              { id: "recs", label: "'You may also like' recommendations" },
              { id: "browse", label: "Browsing product pages" },
              { id: "cart", label: "Adding to cart" },
              { id: "pay", label: "Taking payment" },
            ]}
            explanation="Load shedding drops the least valuable work first, so the most valuable keeps its capacity. Decide the order before the incident; tag requests with a priority so servers can shed low-priority ones automatically."
          />
        </div>
      }
    >
      <p>
        When demand exceeds capacity, something gets dropped. <em>Load shedding</em> means choosing
        what, rather than letting everything slow down together.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Tools ---------------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "Timeouts and deadlines",
    "gRPC sets no deadline by default: always set one. Pass one overall deadline down the call chain, so services don't keep working on requests the user has abandoned.",
  ],
  [
    "Libraries",
    "Resilience4j (Java) and Polly (.NET) provide breakers, bulkheads, rate limiters and timeouts. Netflix's Hystrix is in maintenance mode and points to Resilience4j.",
  ],
  [
    "Service meshes",
    "Envoy (and Istio, which configures it) limit connections, pending requests and retries per upstream (1,024 / 1,024 / 3 by default) and eject misbehaving hosts.",
  ],
  [
    "API gateways",
    "AWS API Gateway throttles with a token bucket (by default 10,000 requests/s with a 5,000 burst per account and Region; lower in newer Regions). Azure API Management and Google Cloud Armor have rate-limit rules too.",
  ],
  [
    "Load shedding",
    "Google's SRE book: reject work above a concurrency limit with a quick 503, and prefer serving the newest requests when a queue builds up.",
  ],
  [
    "Headers",
    "429 Too Many Requests (RFC 6585) with Retry-After. A standard RateLimit header is being drafted at the IETF.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Where these live"
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
        You rarely build these from scratch; you configure them. Check their defaults, and make sure
        every network call has a timeout.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Slow is worse than down", "A hanging dependency ties up every caller's threads."],
  ["Timeouts on every call", "They turn slowness into failures you can handle."],
  ["Breakers and bulkheads", "Fail fast, and cap what one dependency can consume."],
  ["Limit your callers", "Token buckets allow short bursts but hold clients to a rate."],
  ["Degrade on purpose", "Decide in advance what to drop, and keep the core working."],
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
      <p>These patterns keep one region healthy. What if the whole region goes dark?</p>
      <p>Next: multi-region architecture and disaster recovery.</p>
    </StepLayout>
  );
}

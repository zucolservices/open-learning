"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { run, type Retry } from "./model";
import type { ResState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Fuse() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The fuse box"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "A faulty kettle",
              "Without a fuse, the fault overheats the wiring and the whole house goes dark.",
            ],
            ["With a fuse", "The kettle's circuit trips; the lights and fridge keep working."],
            ["Try again later", "Once the fault is fixed, flip the switch back."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 1 ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A fuse stops one faulty appliance from taking down the whole house. It cuts that circuit
        quickly, and you reset it once things are safe.
      </p>
      <p>
        Services need the same protection from slow dependencies: <Term id="timeout">timeouts</Term>
        , careful retries, and a <Term id="circuit-breaker">circuit breaker</Term> that stops
        calling a failing service for a while.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Simulate() {
  const [s, set] = useSceneState<ResState>();
  const r = run(s.timeout, s.retry, s.breaker, s.fallback);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The payment provider is crawling"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.timeout}
              onChange={() => set({ timeout: !s.timeout })}
            />
            2-second timeout on payment calls
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Retries</span>
            <Segmented<Retry>
              size="sm"
              value={s.retry}
              onChange={(retry) => set({ retry })}
              options={[
                ["none", "None"],
                ["immediate", "3 at once"],
                ["backoff", "3 with backoff"],
              ]}
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.breaker}
              onChange={() => set({ breaker: !s.breaker })}
            />
            Circuit breaker: stop calling after repeated failures, test again later
          </label>
          <label className={cn("flex items-center gap-2 text-xs", !s.breaker && "opacity-40")}>
            <input
              type="checkbox"
              disabled={!s.breaker}
              checked={s.fallback && s.breaker}
              onChange={() => set({ fallback: !s.fallback })}
            />
            Fallback: queue the payment and confirm later
          </label>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <div className="flex justify-between">
              <span>Worker slots in use</span>
              <span className="font-mono">{r.busy} / 50</span>
            </div>
            <div className="bg-surface-2 mt-1 h-2.5 rounded">
              <motion.div
                animate={{ width: `${(r.busy / 50) * 100}%` }}
                className={cn("h-2.5 rounded", r.down ? "bg-bad/70" : "bg-viz-data/70")}
              />
            </div>
          </div>
          <div className="grid gap-1 text-xs">
            <div
              className={cn(
                "rounded-lg border px-3 py-1.5",
                r.down ? "border-bad/40 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <span className="text-muted">Rest of the app: </span>
              {r.down ? "down, all slots stuck waiting" : "healthy"}
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <span className="text-muted">Load on the struggling provider: </span>
              {r.load}
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <span className="text-muted">Customer paying sees: </span>
              {r.customer}
            </div>
          </div>
        </div>
      }
    >
      <p>
        The café&apos;s payment provider has slowed to ten seconds per call. Payment requests arrive
        20 a second, and the service has 50 worker slots shared by every endpoint.
      </p>
      <p>
        Without protection, one slow dependency takes the whole app down. Try each defence. Numbers
        are illustrative.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Advice --------------------------------------------------------------------------------------- */

export function Advice() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Hard-won advice from AWS"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Set every timeout",
              "Base it on the dependency's real latency, such as its 99.9th percentile, plus a little headroom.",
            ],
            [
              "Retry in one layer only",
              "Five layers each retrying three times means 243 times the load at the bottom.",
            ],
            ["Back off, with jitter", "Full jitter worked best in Marc Brooker's 2015 analysis."],
            [
              "Cap retries",
              "A retry budget, such as a local token bucket, stops retries from multiplying an outage.",
            ],
            ["Only retry what's safe", "Idempotent operations, or ones with an idempotency key."],
            [
              "Budget your timeouts",
              "The outer timeout must cover the inner attempts, or callers give up while work continues.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The AWS Builders&apos; Library article &ldquo;Timeouts, retries, and backoff with
        jitter&rdquo; collects lessons from running very large services. One notable view: its
        author prefers capping retries to circuit breakers, which add hard-to-test modes.
      </p>
      <p>
        Both approaches aim at the same thing: when a dependency struggles, don&apos;t make it
        worse.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Libraries ------------------------------------------------------------------------------------ */

export function Libraries() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Libraries that do this for you"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Java",
              "Resilience4j 2.4: circuit breaker, retry, bulkhead, time limiter. Netflix's Hystrix has been in maintenance since 2018.",
            ],
            [
              "Spring",
              "Spring Framework 7 added @Retryable to its core (no jitter by default, no circuit breaker).",
            ],
            [
              ".NET",
              "Polly 8 and Microsoft's standard resilience handler: total timeout, retries with jitter, circuit breaker and per-attempt timeout in one call.",
            ],
            [
              "Bulkheads",
              "Separate pools per dependency, so one slow service can only use its own slots.",
            ],
            [
              "Hedging",
              "For read requests, send a second copy if the first is slow, and take whichever answers first.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Michael Nygard&apos;s book <em>Release It!</em> (2007) popularised the circuit breaker:
        closed (calls flow), open (fail fast), and half-open (let a test call through).
      </p>
      <p>
        Check the defaults: Microsoft&apos;s standard handler retries POST requests too, so make
        those idempotent or adjust the settings.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ResCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Helps or hurts?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-resilience"
            prompt="When a dependency is slow or failing, does each practice help or hurt?"
            categories={[
              { id: "help", label: "Helps" },
              { id: "hurt", label: "Hurts" },
            ]}
            items={[
              {
                id: "notimeout",
                label: "HTTP calls with no timeout",
                category: "hurt",
                why: "Every stuck call holds a worker forever.",
              },
              {
                id: "every",
                label: "Retrying at every layer of the stack",
                category: "hurt",
                why: "Multiplies load on the failing service.",
              },
              {
                id: "jitter",
                label: "Capped retries with backoff and jitter, for idempotent calls",
                category: "help",
                why: "Gives the service room to recover.",
              },
              {
                id: "breaker",
                label: "A circuit breaker with a sensible fallback",
                category: "help",
                why: "Fails fast and keeps the rest healthy.",
              },
              {
                id: "budget",
                label: "An outer timeout shorter than the inner retries take",
                category: "hurt",
                why: "Callers give up while work continues.",
              },
            ]}
            explanation="Bound every wait, retry gently and in one place, fail fast when a dependency is down, and offer a fallback."
          />
        </div>
      }
    >
      <p>Sort each practice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Timeouts everywhere", "Based on real latency."],
        ["Retry gently, in one place", "Backoff, jitter, a cap."],
        ["Fail fast when it's down", "Circuit breakers."],
        ["Isolate dependencies", "Bulkheads."],
        ["Offer a fallback", "Degrade, don't collapse."],
      ]}
    >
      <p>Next: logs, health checks and shutting down cleanly.</p>
    </WrapStep>
  );
}

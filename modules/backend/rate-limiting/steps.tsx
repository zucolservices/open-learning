"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { served, type Limit } from "./model";
import type { RlState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Buffet() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The all-you-can-eat buffet"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["No rules", "One guest piles ten plates; the rest find empty trays."],
            [
              "A rule for the whole room",
              "Only 100 plates an hour in total: the greedy guest still takes most of them.",
            ],
            ["A rule per guest", "Two plates at a time, refilled as you finish. Everyone eats."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 2 ? "border-good/50 bg-good/10" : "border-line bg-surface",
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
        A buffet with no limits works until one guest takes everything. A limit per guest keeps it
        fair, and the kitchen keeps up.
      </p>
      <p>
        Services have limited capacity too. <Term id="rate-limit">Rate limiting</Term> shares it
        fairly between clients; load shedding protects the service when everything arrives at once.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Simulate() {
  const [s, set] = useSceneState<RlState>();
  const r = served(s.limit, s.shed);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Protect the API from a runaway client"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Limit>
            size="sm"
            value={s.limit}
            onChange={(limit) => set({ limit })}
            options={[
              ["none", "No limit"],
              ["global", "One limit for everyone"],
              ["per", "Token bucket per client"],
            ]}
          />
          <label
            className={cn("flex items-center gap-2 text-xs", s.limit !== "none" && "opacity-40")}
          >
            <input
              type="checkbox"
              disabled={s.limit !== "none"}
              checked={s.shed && s.limit === "none"}
              onChange={() => set({ shed: !s.shed })}
            />
            Shed load: reject excess requests immediately instead of queueing them
          </label>
          <div className="grid gap-2">
            {r.rows.map((c) => (
              <div
                key={c.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {c.label}{" "}
                    <span className="text-subtle font-mono text-[10px]">({c.rate} req/s)</span>
                  </span>
                  <span className="font-mono">{c.pct}% served</span>
                </div>
                <div className="bg-surface-2 mt-1 h-2 rounded">
                  <motion.div
                    animate={{ width: `${c.pct}%` }}
                    className={cn(
                      "h-2 rounded",
                      c.id === "bot"
                        ? "bg-viz-idle/70"
                        : c.pct === 100
                          ? "bg-good/70"
                          : "bg-bad/60",
                    )}
                  />
                </div>
                <p className="text-muted mt-0.5 text-[10px]">{c.status}</p>
              </div>
            ))}
          </div>
          <p className={cn("text-xs", r.ok ? "text-good" : "text-bad")}>{r.health}</p>
        </div>
      }
    >
      <p>
        The café API handles 100 requests a second. Two apps send 10 each; a buggy script sends 300.
        Try no limit, a single shared limit, and a limit per client. Numbers are illustrative.
      </p>
      <p>
        The per-client limit here is a <Term id="token-bucket">token bucket</Term>: 20 requests a
        second, with bursts up to 40.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Algorithms ----------------------------------------------------------------------------------- */

export function Algorithms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four ways to count"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Token bucket",
              "Tokens refill steadily up to a maximum; each request spends one. Allows short bursts.",
            ],
            [
              "Leaky bucket",
              "Requests queue and drain at a constant rate. Smooth output; a full queue means rejection.",
            ],
            [
              "Fixed window",
              "A counter per minute. Simple, but up to twice the limit can slip through around the boundary.",
            ],
            ["Sliding window", "Counts over the last N seconds, so there's no boundary effect."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Limit by API key, user or tenant where you can; IP addresses are crude, because many people
        can share one. Expensive endpoints deserve lower limits.
      </p>
      <p>
        With several server instances, keep counters in a shared store like Redis or Valkey, or the
        real limit is multiplied by the number of instances.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Telling clients ------------------------------------------------------------------------------ */

export function Telling() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Telling clients, and protecting yourself"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "429 Too Many Requests",
              "Defined in RFC 6585 (2012), with Retry-After saying when to try again.",
            ],
            [
              "Quota headers",
              "An IETF draft for standard RateLimit headers is still a draft in 2026; many APIs use their own X-RateLimit headers.",
            ],
            [
              "A real example",
              "GitHub's REST API: 5,000 requests an hour when signed in, 60 when not.",
            ],
            [
              "Load shedding",
              "When overloaded, reject early so the requests you keep finish quickly (AWS Builders' Library).",
            ],
            [
              "Backpressure",
              "Bounded queues and flow control push “slow down” back to whoever is sending.",
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
        Rate limits are about fairness and abuse; load shedding and backpressure are about survival.
        Queueing everything feels kind but turns overload into an outage: every request waits, then
        times out.
      </p>
      <p>
        Gateways and CDNs (Cloudflare, API gateways, Envoy, NGINX) can enforce limits before traffic
        reaches your code.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RlCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Being a good client"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-rate-limiting"
            prompt="Your service calls a partner API and gets 429 Too Many Requests with Retry-After: 30. What should your code do?"
            options={[
              {
                id: "loop",
                label: "Retry immediately until it works",
                feedback:
                  "That's exactly the traffic the limit is there to stop, and it may get you blocked.",
              },
              {
                id: "wait",
                label:
                  "Wait at least 30 seconds, then retry, backing off further if it happens again",
                correct: true,
                feedback: "Right: honour Retry-After, and use backoff with jitter for repeats.",
              },
              {
                id: "fail",
                label: "Fail permanently and alert someone",
                feedback: "429 is temporary; waiting and retrying is the expected response.",
              },
            ]}
            explanation="429 means “slow down”, not “broken”. Respect Retry-After and back off."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Limit per client", "Fair shares, not one shared pot."],
        ["Token buckets allow bursts", "And refill steadily."],
        ["429 plus Retry-After", "Tell clients when to return."],
        ["Shed load early", "Don't queue everything."],
        ["Shared counters", "Across instances."],
      ]}
    >
      <p>Next: timeouts, retries and circuit breakers.</p>
    </WrapStep>
  );
}

"use client";

import { motion } from "motion/react";
import { Droplets } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PATTERNS, peak, run, type Algo, type Pattern } from "./model";
import type { RlState } from "./state";

/* 1 ─ A tank with a tap --------------------------------------------------------------------------- */

export function WaterTank() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A tank with a tap"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Droplets className="text-viz-data size-6" />
          <div className="border-line relative h-36 w-28 overflow-hidden rounded-b-xl border-2 border-t-0">
            <motion.div
              className="bg-viz-data/40 absolute inset-x-0 bottom-0"
              animate={{ height: ["90%", "30%", "30%", "90%"] }}
              transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.3, 1] }}
            />
          </div>
          <p className="text-muted text-center text-xs">
            Fills at a steady drip; each request draws a cupful. A full tank absorbs a burst; an
            empty one makes you wait.
          </p>
        </div>
      }
    >
      <p>
        A building&apos;s water tank fills slowly from the mains, but you can run a bath quickly
        because the tank holds a reserve. Run baths all day, though, and you&apos;re back to the
        trickle.
      </p>
      <p>
        That&apos;s a <Term id="token-bucket">token bucket</Term>, a common way to apply a{" "}
        <Term id="rate-limit">rate limit</Term>. Each client has a bucket of tokens that refills at
        a steady rate; each request spends one. It protects the API from overload and stops one
        client from crowding out the rest.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Same limit, different shape ⭐ -------------------------------------------------------------- */

export function TwoLimiters() {
  const [s, set] = useSceneState<RlState>();
  const rs = run(s.pattern, s.algo);
  const ok = rs.filter((r) => r.ok).length;
  const x = (t: number) => `${(t / 120) * 100}%`;
  const firstReject = rs.find((r) => !r.ok);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same limit, different shape"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(PATTERNS) as Pattern[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={s.pattern === p}
                onClick={() => set({ pattern: p })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.pattern === p
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {PATTERNS[p].label}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{PATTERNS[s.pattern].note}</p>
          <div>
            <Segmented<Algo>
              size="sm"
              value={s.algo}
              onChange={(algo) => set({ algo })}
              options={[
                ["window", "Fixed window: 10 per clock minute"],
                ["bucket", "Token bucket: 10 tokens, +1 every 6 s"],
              ]}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-3">
            <div className="relative h-14">
              <div className="bg-line absolute top-0 bottom-0 w-px" style={{ left: "50%" }} />
              <span
                className="text-muted absolute -top-0.5 font-mono text-[9px]"
                style={{ left: "50.5%" }}
              >
                1:00
              </span>
              {rs.map((r, i) => (
                <motion.div
                  key={`${s.pattern}-${s.algo}-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.01 * i }}
                  className={cn(
                    "absolute size-2 -translate-x-1/2 rounded-full",
                    r.ok ? "bg-good top-4" : "bg-bad top-9",
                  )}
                  style={{ left: x(r.t) }}
                />
              ))}
            </div>
            <div className="text-muted flex justify-between font-mono text-[9px]">
              <span>0:00</span>
              <span>green: accepted · red: 429</span>
              <span>2:00</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Accepted", `${ok} / ${rs.length}`],
              ["Most in any 10 s", String(peak(rs))],
              ["First Retry-After", firstReject ? `${firstReject.retryAfter} s` : "—"],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-sm">
            {s.pattern === "edge"
              ? s.algo === "window"
                ? "All 20 get through in 10 seconds: double the intended rate, because they straddle two windows."
                : "The bucket lets the first 10 through, then only what has refilled."
              : s.pattern === "steady"
                ? s.algo === "window"
                  ? "Requests late in each minute are refused, then the counter resets and a new burst is allowed."
                  : "The bucket refuses a few requests evenly as it runs low, instead of a block at the end of each minute."
                : "Both allow the first 10 of the spike and refuse the rest; what differs is how soon each recovers."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative traffic.</p>
        </div>
      }
    >
      <p>
        Two limiters, both meant to allow ten requests a minute. Send three traffic patterns through
        each and compare what gets through.
      </p>
      <p>
        The simple fixed window has a known weak spot: a burst at the boundary between two windows
        can let through, as Kong&apos;s engineers put it, &ldquo;twice the rate of requests&rdquo;.
        A token bucket smooths that out while still allowing short bursts.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tell them when to come back ----------------------------------------------------------------- */

export function TellThem() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tell them when to come back"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/problem+json

{ "title": "Rate limit exceeded",
  "detail": "10 requests per minute; try again in 30 s." }`}</Code>
          <Code>{`# GitHub's headers, on every response
x-ratelimit-limit: 5000
x-ratelimit-remaining: 4987
x-ratelimit-used: 13
x-ratelimit-reset: 1791103600

# The IETF draft's proposed fields (not yet an RFC)
RateLimit-Policy: "default";q=100;w=60
RateLimit: "default";r=50;t=30`}</Code>
        </div>
      }
    >
      <p>
        The standard answer is <code>429 Too Many Requests</code> (RFC 6585). Add{" "}
        <code>Retry-After</code>, which RFC 9110 says &ldquo;can be either an HTTP-date or a number
        of seconds&rdquo;, so well-behaved clients wait exactly as long as needed.
      </p>
      <p>
        Better still, tell clients how close they are <em>before</em> they hit the limit. GitHub
        sends remaining-count headers on every response (and answers 403 or 429 when you run out).
        An IETF draft, at revision 11 in 2026, proposes standard <code>RateLimit</code> fields for
        everyone.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Limits in the wild -------------------------------------------------------------------------- */

const WILD: [string, string][] = [
  [
    "GitHub",
    "60 requests an hour without signing in, 5,000 with; secondary limits such as 100 concurrent requests.",
  ],
  [
    "Stripe",
    "Two rate limiters (requests per second, concurrent requests) and two load shedders that protect critical traffic when the system is under strain. Token buckets, on Redis.",
  ],
  [
    "AWS API Gateway",
    "Token bucket with a rate (refill per second) and a burst (bucket size); in most Regions accounts start at 10,000 requests a second with a 5,000 burst.",
  ],
  [
    "Claude API",
    "Separate limits for requests, input tokens and output tokens per minute, using a token bucket; over the limit means a 429 with retry-after.",
  ],
  [
    "Google Cloud",
    "Rate quotas (per time period), allocation quotas (how much you hold, like VMs) and concurrent quotas.",
  ],
];

export function InTheWild() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Limits in the wild"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {WILD.map(([t, d], i) => (
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
        Limits are usually per key or per user, so one noisy client can&apos;t starve the rest. AI
        APIs count tokens as well as requests, because one huge request can cost more than a
        thousand small ones.
      </p>
      <p>
        A <Term id="quota">quota</Term> is the longer-term cousin: how much you may use in a day or
        month, often tied to a pricing plan. System Design&apos;s module on timeouts, circuit
        breakers and rate limiting covers building limiters across many servers.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What the client should do ------------------------------------------------------------------- */

export function OnA429() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What the client should do"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="on-429"
            prompt="Your app gets 429 Too Many Requests with Retry-After: 30. What should it do?"
            options={[
              {
                id: "loop",
                label: "Retry straight away in a loop until it works",
                feedback:
                  "Every retry is refused and counts against you; you may stay locked out longer.",
              },
              {
                id: "keys",
                label: "Create more API keys and spread requests across them",
                feedback: "Usually against the terms, and the provider can see it's one client.",
              },
              {
                id: "wait",
                label:
                  "Wait at least 30 seconds (plus a little random jitter), then retry, and slow down",
                correct: true,
                feedback:
                  "Exactly what the header asks, and jitter stops all your servers retrying at the same instant.",
              },
              {
                id: "fail",
                label: "Show the user an error and never retry",
                feedback:
                  "429 is temporary; giving up throws away a request that would work in 30 s.",
              },
            ]}
            explanation="Respect Retry-After, add jitter, and reduce your request rate so you stop hitting the limit."
          />
        </div>
      }
    >
      <p>A good limit is half of it; a polite client is the other half.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Limits protect everyone", "From overload and from noisy neighbours."],
  ["Token buckets allow bursts", "Fixed windows double up at the edge."],
  ["429 plus Retry-After", "Say when to come back."],
  ["Show remaining budget", "Headers on every response."],
  ["Clients back off", "Wait, add jitter, slow down."],
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
      <p>Next: making responses faster and cheaper with HTTP caching.</p>
    </StepLayout>
  );
}

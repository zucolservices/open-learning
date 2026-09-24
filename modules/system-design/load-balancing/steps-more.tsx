"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { LbState } from "./state";

/* 4 ─ Health checks and draining ---------------------------------------------------------------- */

const INTERVALS = [5, 10, 30];
const THRESHOLDS = [2, 3, 5];

export function HealthChecks() {
  const [s, set] = useSceneState<LbState>();
  const interval = INTERVALS[s.interval];
  const threshold = THRESHOLDS[s.threshold];
  const detect = interval * threshold;
  const perSecond = 500;
  return (
    <StepLayout
      eyebrow="Health checks"
      title="How fast is a failure noticed?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted text-xs">Check every</span>
              <Segmented
                size="sm"
                value={String(s.interval)}
                options={INTERVALS.map((v, i) => [String(i), `${v} s`] as [string, string])}
                onChange={(v) => set({ interval: Number(v) })}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted text-xs">Unhealthy after</span>
              <Segmented
                size="sm"
                value={String(s.threshold)}
                options={THRESHOLDS.map((v, i) => [String(i), `${v} fails`] as [string, string])}
                onChange={(v) => set({ threshold: Number(v) })}
              />
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">After the server breaks (seconds)</p>
            <div className="relative h-10">
              {Array.from({ length: threshold }, (_, i) => (
                <motion.div
                  key={`${interval}-${i}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-bad absolute top-1 size-3 -translate-x-1/2 rounded-full"
                  style={{ left: `${(((i + 1) * interval) / 150) * 100}%` }}
                  title={`check ${i + 1} fails`}
                />
              ))}
              <motion.div
                initial={false}
                animate={{ width: `${(detect / 150) * 100}%` }}
                className="bg-bad/15 border-bad/40 absolute top-5 left-0 h-3 rounded-sm border"
              />
            </div>
            <div className="text-subtle flex justify-between text-[9px]">
              <span>0</span>
              <span>75</span>
              <span>150 s</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Time to notice</p>
              <p className="font-mono text-lg">{detect} s</p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                detect >= 60 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">
                Requests sent to it meanwhile (at 500/s, 1 of 6 servers)
              </p>
              <p className="font-mono text-lg">
                ≈ {Math.round((detect * perSecond) / 6).toLocaleString("en-US")}
              </p>
            </div>
          </div>
          <p className="text-subtle text-xs">
            AWS&apos;s Application Load Balancer defaults: every 30 s, unhealthy after 2 failures,
            healthy again after 5 successes. Checking often costs a little extra traffic; checking
            rarely costs failed requests.
          </p>
        </div>
      }
    >
      <p>
        Load balancers find broken servers with <Term id="health-check">health checks</Term>: every
        few seconds they ask each server &ldquo;are you OK?&rdquo;, and after a few failures in a
        row they stop sending it traffic.
      </p>
      <p>
        Detection time is roughly interval × failures needed. <em>Passive</em> checks, which watch
        real requests failing, react much faster, as you saw in the simulation.
      </p>
      <p className="text-muted text-sm">
        The reverse matters too. When a server is removed on purpose (for a deploy), connection
        draining lets its in-flight requests finish first: 300 seconds by default on AWS.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Who balances the balancer? ----------------------------------------------------------------- */

const TOPOS: Record<
  LbState["topo"],
  { title: string; text: string; tone: "bad" | "good" | "neutral" }
> = {
  single: {
    title: "One load balancer",
    text: "Every request passes through one box. If it fails, the whole site is down, however many servers sit behind it.",
    tone: "bad",
  },
  pair: {
    title: "Redundant load balancers",
    text: "Two or more share one address, and one takes over if another fails. Cloud load balancers do this for you: they're spread over several machines and zones behind the scenes.",
    tone: "good",
  },
  anycast: {
    title: "Global: DNS or anycast",
    text: "For users worldwide, DNS can hand each user the nearest region's address (Route 53, Traffic Manager), but cached DNS answers slow failover. Anycast announces one IP address from many locations, and the network delivers each user to the nearest (Google Cloud's global load balancer, Cloudflare).",
    tone: "neutral",
  },
};

export function Redundancy() {
  const [s, set] = useSceneState<LbState>();
  const t = TOPOS[s.topo];
  return (
    <StepLayout
      eyebrow="The next weak link"
      title="Who balances the balancer?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.topo}
            options={[
              ["single", "One"],
              ["pair", "Redundant"],
              ["anycast", "Global"],
            ]}
            onChange={(v) => set({ topo: v as LbState["topo"] })}
          />
          <div className="border-line bg-surface flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border p-4">
            <span className="bg-surface-2 rounded-lg px-2 py-1 text-xs">Users</span>
            <div className="flex gap-2">
              <AnimatePresence mode="popLayout">
                {(s.topo === "single"
                  ? ["LB"]
                  : s.topo === "pair"
                    ? ["LB", "LB"]
                    : ["Mumbai", "Frankfurt", "Virginia"]
                ).map((l, i) => (
                  <motion.span
                    key={s.topo + i}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-xs font-semibold",
                      s.topo === "single" ? "border-bad bg-bad/10" : "border-accent bg-accent-soft",
                    )}
                  >
                    {s.topo === "anycast" ? `LB · ${l}` : l}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: s.topo === "anycast" ? 9 : 4 }, (_, i) => (
                <span key={i} className="bg-viz-compute/50 size-4 rounded-sm" />
              ))}
            </div>
          </div>
          <motion.div
            key={s.topo}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              t.tone === "bad"
                ? "border-bad/40 bg-bad/10"
                : t.tone === "good"
                  ? "border-good/40 bg-good/10"
                  : "border-line bg-surface",
            )}
          >
            <p className="font-semibold">{t.title}</p>
            <p className="text-muted mt-1">{t.text}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A load balancer removes the servers as a{" "}
        <Term id="single-point-of-failure">single point of failure</Term>, and becomes one itself.
        Switch between the three set-ups.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: sticky sessions -------------------------------------------------------------- */

export function StickyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Sticky sessions"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="sticky"
            prompt="Brewline's app keeps each user's cart in the memory of whichever server they first reach, so the load balancer uses 'sticky sessions' to send them back there. What's the catch?"
            options={[
              {
                id: "catch",
                label:
                  "Traffic can't be rebalanced, and if that server dies or is replaced, its users lose their carts",
                correct: true,
                feedback:
                  "Right. Move session state to a shared store (such as Redis) or the client, and any server can serve anyone.",
              },
              {
                id: "slow",
                label: "Sticky sessions make every request slower",
                feedback: "The routing itself is cheap. The problem is where the state lives.",
              },
              {
                id: "security",
                label: "It's a security risk to reuse a server",
                feedback: "Not inherently. It's a reliability and balancing problem.",
              },
              {
                id: "none",
                label: "No catch: it's the recommended design",
                feedback:
                  "It's a common crutch, but servers that hold user state can't be added, removed or lost freely.",
              },
            ]}
            explanation="With stickiness on, only a user's first request goes through the balancing algorithm. Keep servers stateless and stickiness becomes unnecessary."
          />
        </div>
      }
    >
      <p>
        A common shortcut with a hidden cost. The <em>twelve-factor</em> app guidelines call it out
        directly.
      </p>
    </StepLayout>
  );
}

/* 7 ─ On each cloud ------------------------------------------------------------------------------ */

const CLOUDS: [string, string, string, string][] = [
  [
    "AWS",
    "Network Load Balancer",
    "Application Load Balancer",
    "Route 53 routing; Global Accelerator",
  ],
  [
    "Google Cloud",
    "Network Load Balancers (proxy or passthrough)",
    "Application Load Balancers (global or regional)",
    "Global anycast Application LB",
  ],
  ["Azure", "Azure Load Balancer", "Application Gateway", "Front Door; Traffic Manager (DNS)"],
  [
    "Open source",
    "HAProxy, NGINX, Envoy (TCP)",
    "NGINX, HAProxy, Envoy, Traefik",
    "DNS-based (e.g. PowerDNS), anycast with BGP",
  ],
];

export function OnEachCloud() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Load balancers you'll meet"
      stage={
        <div className="border-line flex-1 overflow-x-auto rounded-xl border">
          <table className="w-full text-xs">
            <thead className="bg-surface-2 text-muted text-left">
              <tr>
                <th className="px-3 py-2 font-normal" />
                <th className="px-3 py-2 font-normal">Layer 4</th>
                <th className="px-3 py-2 font-normal">Layer 7</th>
                <th className="px-3 py-2 font-normal">Global</th>
              </tr>
            </thead>
            <tbody>
              {CLOUDS.map(([p, l4, l7, g]) => (
                <tr key={p} className="border-line border-t align-top">
                  <td className="px-3 py-2 font-semibold whitespace-nowrap">{p}</td>
                  <td className="px-3 py-2">{l4}</td>
                  <td className="px-3 py-2">{l7}</td>
                  <td className="px-3 py-2">{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    >
      <p>Every platform offers the same three kinds, under different names.</p>
      <p className="text-muted text-sm">
        Defaults differ: AWS&apos;s Application Load Balancer and Envoy start with round robin;
        NGINX with weighted round robin. Check which algorithm yours uses.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["One address, many servers", "A load balancer spreads requests and hides failures."],
  [
    "Layer 4 or layer 7",
    "Connections are fast and simple; reading requests allows smart routing and TLS handling.",
  ],
  [
    "Balance on busyness",
    "Least connections or power of two choices route around slow servers; round robin can't.",
  ],
  [
    "Detect failures quickly",
    "Active checks take interval × threshold; passive checks react in moments.",
  ],
  ["No sticky state", "Keep servers stateless so any server can serve anyone."],
  ["Redundant balancers", "The balancer must not be the new single point of failure."],
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
      <p>Next: adding and removing those servers automatically as traffic changes.</p>
    </StepLayout>
  );
}

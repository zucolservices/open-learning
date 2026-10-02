"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { HeartPulse, Server, Users, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PER_SERVER, simulate, traffic, type Shape } from "./sim";
import type { ScalingState } from "./state";

/* 1 ─ Opening more counters --------------------------------------------------------------------- */

export function Counters() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Opening more counters"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex items-end gap-3">
            {[3, 5, 2, 0].map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex flex-col-reverse gap-0.5">
                  {Array.from({ length: q }, (_, j) => (
                    <Users key={j} className="text-muted size-4" />
                  ))}
                </div>
                <div
                  className={cn(
                    "grid h-12 w-14 place-items-center rounded-lg border text-[10px]",
                    i === 3
                      ? "border-accent bg-accent-soft border-dashed"
                      : "border-line bg-surface",
                  )}
                >
                  {i === 3 ? "opening…" : `Counter ${i + 1}`}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-muted max-w-sm text-center text-xs">
            A supervisor at the entrance sends each person to a counter that&apos;s open and
            working.
          </p>
        </div>
      }
    >
      <p>
        At a railway booking office, when the queues grow, the manager opens another counter. The
        new clerk takes a few minutes to arrive and log in, so the queues keep growing for a while.
        When it&apos;s quiet again, counters close.
      </p>
      <p>
        At the entrance, a supervisor sends each person to an open counter, and stops sending people
        to a counter whose clerk has fallen ill.
      </p>
      <p>
        In the cloud, the manager is <Term id="autoscaling">autoscaling</Term> and the supervisor is
        a <Term id="load-balancer">load balancer</Term>. This module tunes both.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tune the scaling group ⭐ ------------------------------------------------------------------ */

const W = 360;
const H = 130;

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  show,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  show: string;
  onChange(v: number): void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="text-muted w-32 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent flex-1"
      />
      <span className="w-16 text-right font-mono">{show}</span>
    </label>
  );
}

export function TuneScaling() {
  const [s, set] = useSceneState<ScalingState>();
  const load = useMemo(() => traffic(s.shape), [s.shape]);
  const r = useMemo(
    () =>
      simulate(load, { target: s.target, min: s.min, warmup: s.warmup, scheduled: s.scheduled }),
    [load, s.target, s.min, s.warmup, s.scheduled],
  );
  const top = Math.max(...load, ...r.launched.map((n) => n * PER_SERVER)) * 1.05;
  const X = (m: number) => (m / (24 * 60 - 1)) * W;
  const Y = (v: number) => H - (v / top) * (H - 6);
  const step = (vals: number[]) =>
    vals.map((v, m) => `${X(m).toFixed(1)},${Y(v * PER_SERVER).toFixed(1)}`).join(" ");
  return (
    <StepLayout
      eyebrow="Simulation · illustrative numbers"
      title="Tune the scaling group"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.shape}
            options={
              [
                ["office", "A working day"],
                ["spike", "A working day + an evening news spike"],
              ] as [Shape, string][]
            }
            onChange={(v) => set({ shape: v })}
          />
          <svg
            viewBox={`0 0 ${W} ${H + 14}`}
            className="bg-surface-2 w-full rounded-lg"
            role="img"
            aria-label="Traffic over a day against the servers serving it"
          >
            {load.map((v, m) =>
              v > r.serving[m] * PER_SERVER ? (
                <line
                  key={m}
                  x1={X(m)}
                  x2={X(m)}
                  y1={Y(v)}
                  y2={Y(r.serving[m] * PER_SERVER)}
                  className="stroke-bad"
                  strokeWidth="1.6"
                />
              ) : null,
            )}
            <polyline
              points={step(r.launched)}
              fill="none"
              className="stroke-muted"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
            <polyline points={step(r.serving)} fill="none" className="stroke-fg" strokeWidth="1" />
            <polyline
              points={load.map((v, m) => `${X(m).toFixed(1)},${Y(v).toFixed(1)}`).join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.3"
            />
            {[0, 6, 12, 18].map((h) => (
              <text key={h} x={X(h * 60) + 2} y={H + 11} className="fill-muted text-[7px]">
                {String(h).padStart(2, "0")}:00
              </text>
            ))}
          </svg>
          <p className="text-muted -mt-1 flex flex-wrap gap-x-3 text-[10px]">
            <span>
              <span className="text-accent">━</span> traffic
            </span>
            <span>━ capacity of servers serving</span>
            <span>┄ servers paid for (incl. starting)</span>
            <span className="text-bad">┃ overloaded</span>
          </p>
          <div className="flex flex-col gap-1.5">
            <Slider
              label="Target average CPU"
              value={s.target}
              min={30}
              max={90}
              step={5}
              show={`${s.target}%`}
              onChange={(v) => set({ target: v })}
            />
            <Slider
              label="Launch to serving"
              value={s.warmup}
              min={1}
              max={10}
              show={`${s.warmup} min`}
              onChange={(v) => set({ warmup: v })}
            />
            <Slider
              label="Minimum servers"
              value={s.min}
              min={1}
              max={6}
              show={String(s.min)}
              onChange={(v) => set({ min: v })}
            />
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.scheduled}
                onChange={(e) => set({ scheduled: e.target.checked })}
                className="accent-accent"
              />
              Scheduled scaling: at least 8 servers from 08:30 to 18:00
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                r.overloadMinutes ? "border-bad/50 bg-bad/10" : "border-good/50 bg-good/10",
              )}
            >
              <p className="text-muted text-[10px]">Minutes overloaded</p>
              <p className="font-mono text-lg">{r.overloadMinutes}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px]">Server-hours paid for</p>
              <p className="font-mono text-lg">{Math.round(r.serverHours)}</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A <Term id="scaling-group">scaling group</Term> keeps between a minimum and a maximum number
        of servers. With a target-tracking policy you pick a goal, such as average CPU at 50%, and
        it adds or removes servers to stay near it; AWS compares this to a thermostat.
      </p>
      <p>
        Try a high target to save money, then slow the launch time. New servers take minutes to be
        ready (no provider publishes a fixed figure; 3–6 minutes is typical), so a sudden rise
        overloads the group before help arrives. A lower target keeps spare room, at a cost. For a
        rush you know is coming, like 9 a.m. logins, scheduled scaling adds servers in advance.
      </p>
      <p>
        Each cloud words this differently: AWS has target tracking, step and predictive scaling;
        Google&apos;s autoscaler uses an initialization period and slows scale-in with a
        stabilization period; Azure scale sets use threshold rules with a 5-minute cool-down.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When a server gets sick ⭐ ----------------------------------------------------------------- */

const CHECKS = {
  aws: { name: "AWS Application Load Balancer defaults", interval: 30, unhealthy: 2, healthy: 5 },
  gcp: { name: "Google Cloud health check defaults", interval: 5, unhealthy: 2, healthy: 2 },
};

const RPS = 100;
const SERVERS = 4;

export function HealthChecks() {
  const [s, set] = useSceneState<ScalingState>();
  const c = CHECKS[s.checks];
  const out = c.interval * c.unhealthy;
  const back = c.interval * c.healthy;
  const lost = Math.round((RPS / SERVERS) * out);
  const span = Math.max(out, 60) + c.interval;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="When a server gets sick"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.checks}
            options={[
              ["aws", "AWS ALB defaults"],
              ["gcp", "Google Cloud defaults"],
            ]}
            onChange={(v) => set({ checks: v })}
          />
          <div className="flex items-center justify-center gap-3">
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-center text-[11px]">
              <HeartPulse className="text-accent mx-auto size-4" />
              Load balancer
              <p className="text-muted text-[10px]">checks every {c.interval} s</p>
            </div>
            <div className="flex flex-col gap-1">
              {Array.from({ length: SERVERS }, (_, i) => {
                const sick = s.broken && i === 2;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-1.5 rounded border px-2 py-1 text-[11px]",
                      sick ? "border-bad bg-bad/10" : "border-line bg-surface",
                    )}
                  >
                    {sick ? <X className="text-bad size-3.5" /> : <Server className="size-3.5" />}
                    Server {i + 1} {sick && "· returning errors"}
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={() => set({ broken: !s.broken })}
            className={cn(
              "self-center rounded-full px-4 py-1.5 text-xs font-medium",
              s.broken ? "border-line border" : "bg-bad text-white",
            )}
          >
            {s.broken ? "Fix server 3" : "Break server 3"}
          </button>
          {s.broken && (
            <motion.div
              key={s.checks}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2"
            >
              <div className="relative h-10">
                <div className="bg-surface-2 absolute inset-x-0 top-4 h-2 rounded" />
                <motion.div
                  className="bg-bad absolute top-4 left-0 h-2 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: `${(out / span) * 100}%` }}
                  transition={{ duration: 1.2 }}
                />
                {Array.from({ length: Math.floor(span / c.interval) + 1 }, (_, k) => (
                  <span
                    key={k}
                    className={cn(
                      "absolute top-3 size-4 -translate-x-1/2 rounded-full border text-center text-[9px] leading-[14px]",
                      k >= 1 && k <= c.unhealthy
                        ? "border-bad bg-bad text-white"
                        : "border-line bg-surface",
                    )}
                    style={{ left: `${((k * c.interval) / span) * 100}%` }}
                  >
                    {k >= 1 && k <= c.unhealthy ? "✗" : ""}
                  </span>
                ))}
              </div>
              <p className="text-xs">
                Server 3 is taken out of rotation after{" "}
                <span className="font-semibold">
                  {c.unhealthy} failed checks, about {out} seconds
                </span>
                . Until then a quarter of requests reach it: about{" "}
                <span className="font-semibold">
                  {lost.toLocaleString("en-IN")} failed requests
                </span>{" "}
                at {RPS} requests a second. Once fixed, it needs {c.healthy} good checks (about{" "}
                {back >= 60 ? `${(back / 60).toFixed(1)} minutes` : `${back} seconds`}) to return.
              </p>
            </motion.div>
          )}
          <p className="text-muted text-[10px]">
            {c.name}: interval {c.interval} s, out after {c.unhealthy} failures, back after{" "}
            {c.healthy} successes.
          </p>
        </div>
      }
    >
      <p>
        A load balancer sends a small test request, a <Term id="health-check">health check</Term>,
        to every server on a schedule. After a few failures in a row it stops sending real traffic
        there; after a few successes it sends traffic again.
      </p>
      <p>
        The defaults differ a lot. AWS&apos;s load balancer checks every 30 seconds, so a sick
        server keeps receiving users for about a minute; Google&apos;s checks every 5 seconds.
        Faster checks catch problems sooner but can pull a server that was only briefly slow.
      </p>
      <p>
        The scaling group can then replace the sick server, after a grace period that lets new
        servers start up (AWS and Google default to 300 seconds in the console, but 0 when created
        from code). If every server fails, AWS&apos;s load balancer &ldquo;fails open&rdquo; and
        sends traffic to all of them anyway.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Layer 4 or layer 7 -------------------------------------------------------------------------- */

const LB_ROWS: [string, string, string, string][] = [
  [
    "Layer 7 (HTTP)",
    "Application Load Balancer",
    "Application Load Balancer",
    "Application Gateway; Front Door (global)",
  ],
  [
    "Layer 4 (TCP/UDP)",
    "Network Load Balancer",
    "Network Load Balancer (proxy or passthrough)",
    "Azure Load Balancer",
  ],
];

export function Layers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Layer 4 or layer 7"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-sm font-semibold">Layer 7: reads the request</p>
              <ul className="text-muted mt-1 list-disc pl-4 text-xs">
                <li>Routes by path (/api, /images) or hostname</li>
                <li>Ends HTTPS and can add a web application firewall</li>
                <li>Looks at headers and cookies</li>
              </ul>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-sm font-semibold">Layer 4: just passes connections</p>
              <ul className="text-muted mt-1 list-disc pl-4 text-xs">
                <li>Any TCP or UDP traffic, not only web</li>
                <li>Very high throughput, low added delay</li>
                <li>Can keep the client&apos;s own IP address</li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 text-left font-normal" />
                  <th className="py-1 text-left font-normal">AWS</th>
                  <th className="py-1 text-left font-normal">Google Cloud</th>
                  <th className="py-1 text-left font-normal">Azure</th>
                </tr>
              </thead>
              <tbody>
                {LB_ROWS.map((r) => (
                  <tr key={r[0]} className="border-line border-t">
                    {r.map((c, i) => (
                      <td key={i} className={cn("py-1.5 pr-2", i === 0 && "font-medium")}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted text-[10px]">
            Open source: NGINX, HAProxy and Envoy do both. Retired or legacy: Azure Basic Load
            Balancer (retired September 2025), AWS Classic Load Balancer (previous generation).
          </p>
        </div>
      }
    >
      <p>
        The &ldquo;layers&rdquo; come from the OSI model of networking. A layer 4 load balancer sees
        connections (addresses and ports) and passes them on. A layer 7 load balancer reads each web
        request, so it can make smarter decisions, at a little more cost and delay.
      </p>
      <p>
        The System Design track covers how load balancers choose a server. Here, the question is
        which managed product fits. An idle AWS Application Load Balancer costs about $16 a month
        before traffic charges.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which load balancer? ------------------------------------------------------------------------ */

export function WhichBalancer() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which load balancer?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="lb-layer"
            prompt="Layer 4 or layer 7 for each need?"
            categories={[
              { id: "l7", label: "Layer 7" },
              { id: "l4", label: "Layer 4" },
            ]}
            items={[
              {
                id: "path",
                label: "Send /api to one set of servers and /images to another",
                category: "l7",
                why: "Routing by path means reading the HTTP request.",
              },
              {
                id: "udp",
                label: "A multiplayer game server that talks UDP",
                category: "l4",
                why: "Not HTTP at all; layer 4 passes any TCP or UDP traffic.",
              },
              {
                id: "tls",
                label: "End HTTPS at the edge and add a web application firewall",
                category: "l7",
                why: "Inspecting and filtering web requests is a layer 7 job.",
              },
              {
                id: "ip",
                label: "Millions of long-lived TCP connections, keeping each client's IP address",
                category: "l4",
                why: "Layer 4 balancers handle huge connection counts and can preserve the source IP.",
              },
              {
                id: "host",
                label: "One address serving two websites by hostname",
                category: "l7",
                why: "The hostname is in the HTTP request (and TLS handshake), read at layer 7.",
              },
            ]}
            explanation="If you need to understand the web request, choose layer 7. If you just need to spread connections fast, or the traffic isn't HTTP, choose layer 4."
          />
        </div>
      }
    >
      <p>Five needs. Which kind of load balancer fits each?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Scaling lags", "New servers take minutes; keep headroom or schedule known rushes."],
  ["Targets trade cost for safety", "Higher targets save money and overload sooner."],
  ["Check health, mind defaults", "30 s vs 5 s checks decide how long users hit a sick server."],
  ["Layer 7 reads, layer 4 passes", "Pick by what the traffic is and what you need to see."],
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
      <p>Next: the private network all of these servers live in.</p>
    </StepLayout>
  );
}

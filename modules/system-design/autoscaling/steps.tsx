"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MINUTES, PER_SERVER, simulate } from "./sim";
import type { AutoscaleState } from "./state";

/* 1 ─ Any server, any request -------------------------------------------------------------------- */

const SESSIONS: Record<
  AutoscaleState["session"],
  { label: string; where: string; after: string; ok: boolean }
> = {
  memory: {
    label: "Server memory",
    where: "Priya's cart lives in server 2's memory.",
    after:
      "Server 2 was removed by autoscaling, and Priya's cart went with it. She has to start again.",
    ok: false,
  },
  shared: {
    label: "Shared store",
    where:
      "Priya's cart lives in a shared session store (such as Redis) that every server can reach.",
    after:
      "Server 2 was removed; her next request lands on server 1, which reads the cart from the store. Nothing lost.",
    ok: true,
  },
  token: {
    label: "Client token",
    where: "Priya's app holds a signed token with her session; any server can check it.",
    after:
      "Server 2 was removed; any server can verify her token. Nothing lost (keep tokens small, and plan how to revoke them).",
    ok: true,
  },
};

export function Stateless() {
  const [s, set] = useSceneState<AutoscaleState>();
  const x = SESSIONS[s.session];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Any server, any request"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.session}
            options={(Object.keys(SESSIONS) as AutoscaleState["session"][]).map(
              (k) => [k, SESSIONS[k].label] as [string, string],
            )}
            onChange={(v) => set({ session: v as AutoscaleState["session"], removed: false })}
          />
          <div className="border-line bg-surface grid gap-3 rounded-xl border p-4">
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((n) => {
                const gone = s.removed && n === 2;
                return (
                  <motion.div
                    key={n}
                    animate={{ opacity: gone ? 0.2 : 1, scale: gone ? 0.9 : 1 }}
                    className={cn(
                      "w-20 rounded-xl border p-2 text-center text-xs sm:w-24",
                      gone
                        ? "border-line border-dashed"
                        : "border-viz-compute/60 bg-viz-compute/10",
                    )}
                  >
                    Server {n}
                    {s.session === "memory" && n === 2 && !gone && (
                      <span className="bg-viz-data/20 mt-1 block rounded px-1 text-[10px]">
                        🛒 Priya&apos;s cart
                      </span>
                    )}
                    {gone && <span className="text-bad mt-1 block text-[10px]">removed</span>}
                  </motion.div>
                );
              })}
            </div>
            {s.session === "shared" && (
              <div className="border-viz-data/60 bg-viz-data/10 mx-auto rounded-xl border px-3 py-1.5 text-xs">
                Session store · 🛒 Priya&apos;s cart
              </div>
            )}
            {s.session === "token" && (
              <div className="mx-auto rounded-xl border border-dashed px-3 py-1.5 text-xs">
                📱 Priya&apos;s phone · signed token 🛒
              </div>
            )}
            <button
              type="button"
              onClick={() => set({ removed: !s.removed })}
              className="bg-accent text-accent-fg mx-auto rounded-full px-4 py-1.5 text-sm font-medium"
            >
              {s.removed ? "Bring server 2 back" : "Traffic drops: remove server 2"}
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.session + s.removed}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                !s.removed
                  ? "border-line bg-surface"
                  : x.ok
                    ? "border-good/40 bg-good/10"
                    : "border-bad/40 bg-bad/10",
              )}
            >
              {s.removed ? x.after : x.where}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A supermarket opens more checkouts when queues grow and closes them when it&apos;s quiet.
        That only works because any checkout can serve any shopper.
      </p>
      <p>
        Servers are the same. To add and remove them freely, they must be{" "}
        <Term id="stateless">stateless</Term>: nothing a user needs may live only on one server. Try
        each place to keep Priya&apos;s cart, then remove a server.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Survive the lunch rush ⭐ ------------------------------------------------------------------- */

const TARGETS = [0.5, 0.6, 0.7, 0.9];
const WARMUPS = [1, 3, 5, 8];
const WINDOWS = [1, 5, 10];

function Chart({ demand, ready, total }: { demand: number[]; ready: number[]; total: number[] }) {
  const W = 360;
  const H = 150;
  const max = Math.max(...demand, ...total.map((t) => t * PER_SERVER)) * 1.05;
  const x = (m: number) => 28 + (m / (MINUTES - 1)) * (W - 36);
  const y = (v: number) => H - 18 - (v / max) * (H - 26);
  const step = (arr: number[]) =>
    arr
      .map(
        (n, m) =>
          `${m === 0 ? "M" : "L"}${x(m)},${y(n * PER_SERVER)} L${x(m + 1)},${y(n * PER_SERVER)}`,
      )
      .join(" ");
  const line = demand.map((d, m) => `${m === 0 ? "M" : "L"}${x(m)},${y(d)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Traffic against capacity"
    >
      {demand.map((d, m) =>
        d > ready[m] * PER_SERVER ? (
          <rect
            key={m}
            x={x(m)}
            y={10}
            width={W / MINUTES + 0.5}
            height={H - 28}
            fill="var(--bad)"
            opacity={0.18}
          />
        ) : null,
      )}
      <path
        d={step(total)}
        fill="none"
        stroke="var(--viz-compute)"
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.7}
      />
      <path d={step(ready)} fill="none" stroke="var(--viz-compute)" strokeWidth={2} />
      <path d={line} fill="none" stroke="var(--viz-data)" strokeWidth={1.5} />
      {(
        [
          [0, "11:00"],
          [60, "12:00"],
          [120, "13:00"],
          [MINUTES - 1, "14:00"],
        ] as const
      ).map(([m, label]) => (
        <text
          key={m}
          x={x(m)}
          y={H - 4}
          textAnchor={m === MINUTES - 1 ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

export function LunchRush() {
  const [s, set] = useSceneState<AutoscaleState>();
  const { target, warmup, window: win, scheduled } = s;
  const r = useMemo(
    () =>
      simulate({
        target: TARGETS[target],
        warmupMin: WARMUPS[warmup],
        windowMin: WINDOWS[win],
        scheduled,
      }),
    [target, warmup, win, scheduled],
  );
  const tooLate = r.overloadMinutes > 0;
  const flappy = r.scaleIns > 30;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Survive the lunch rush"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Row label="Target CPU">
            <Segmented
              size="sm"
              value={String(target)}
              options={TARGETS.map((t, i) => [String(i), `${t * 100}%`] as [string, string])}
              onChange={(v) => set({ target: Number(v) })}
            />
          </Row>
          <Row label="New server warm-up">
            <Segmented
              size="sm"
              value={String(warmup)}
              options={WARMUPS.map((t, i) => [String(i), `${t} min`] as [string, string])}
              onChange={(v) => set({ warmup: Number(v) })}
            />
          </Row>
          <Row label="Wait before scaling in">
            <Segmented
              size="sm"
              value={String(win)}
              options={WINDOWS.map((t, i) => [String(i), `${t} min`] as [string, string])}
              onChange={(v) => set({ window: Number(v) })}
            />
          </Row>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={scheduled}
              onChange={(e) => set({ scheduled: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Schedule extra servers for lunch (from 12:15)
          </label>

          <div className="border-line bg-surface rounded-xl border p-3">
            <Chart demand={r.demand} ready={r.ready} total={r.total} />
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-viz-data h-0.5 w-4" /> requests/s
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute h-0.5 w-4" /> capacity (ready servers)
              </span>
              <span className="flex items-center gap-1">
                <span className="border-viz-compute w-4 border-t border-dashed" /> incl. warming up
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-bad/30 size-2.5" /> overloaded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Minutes overloaded" value={String(r.overloadMinutes)} bad={tooLate} />
            <Stat
              label="Requests turned away"
              value={
                r.droppedRequests >= 1000
                  ? `${Math.round(r.droppedRequests / 1000)}k`
                  : String(r.droppedRequests)
              }
              bad={tooLate}
            />
            <Stat label="Server-hours (cost)" value={r.serverHours.toFixed(0)} />
            <Stat label="Scale-in events" value={String(r.scaleIns)} bad={flappy} />
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              tooLate || flappy ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            {tooLate
              ? "The spike arrived faster than new servers could warm up. Aim lower on CPU for headroom, warm up faster, or schedule capacity ahead of a known rush."
              : flappy
                ? "No overload, but the fleet keeps shrinking and regrowing with every wobble in traffic. A longer wait before scaling in calms it."
                : "Every request served, without panicking on every wobble. Headroom costs server-hours: that's the trade."}
          </p>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this simulation works</summary>
            <p className="mt-2">
              Three hours, minute by minute. One server handles 100 requests/s flat out. Each minute
              the autoscaler asks for enough servers to run at the target CPU; new ones count only
              after warm-up; servers are removed only if fewer were needed throughout the waiting
              window. Traffic has ±15% noise and a spike that triples it within three minutes.
            </p>
          </details>
        </div>
      }
    >
      <p>
        <Term id="autoscaling">Autoscaling</Term> adds servers when they&apos;re busy and removes
        them when they&apos;re not. Three settings decide how well it works: how busy you let
        servers get, how long a new one takes to be ready, and how long to wait before removing
        servers.
      </p>
      <p>Tune them until the lunch spike causes no overload, without paying for idle servers.</p>
      <p className="text-muted text-sm">
        This is the &ldquo;target tracking&rdquo; style most platforms recommend. Scaling up should
        be quick; scaling down, cautious.
      </p>
    </StepLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted w-36 text-xs">{label}</span>
      {children}
    </div>
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

/* 3 ─ Predict: Kubernetes HPA ------------------------------------------------------------------- */

export function PredictHpa() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="What will Kubernetes do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="hpa"
            prompt="A Kubernetes Horizontal Pod Autoscaler targets 60% CPU. There are 4 pods, averaging 90% CPU. How many pods will it ask for?"
            min={1}
            max={12}
            step={1}
            unit=" pods"
            answer={6}
            tolerance={0}
            explanation="desired = ceil(current × current / target) = ceil(4 × 90 / 60) = 6. Kubernetes checks every 15 seconds and ignores changes within 10% of the target, so it doesn't twitch at every small wobble."
          />
        </div>
      }
    >
      <p>
        Kubernetes&apos; Horizontal Pod Autoscaler uses a simple formula: scale the current count by
        how far the metric is from its target.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The bottleneck moves ---------------------------------------------------------------------- */

const SERVER_COUNTS = [5, 10, 20, 30, 50];
const CONNS_PER_SERVER = 20;
const DB_MAX = 500;

export function BottleneckMoves() {
  const [s, set] = useSceneState<AutoscaleState>();
  const n = SERVER_COUNTS[s.servers];
  const conns = s.pooled ? Math.min(100, n * CONNS_PER_SERVER) : n * CONNS_PER_SERVER;
  const over = conns > DB_MAX;
  return (
    <StepLayout
      eyebrow="Watch out"
      title="The bottleneck moves"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <label className="grid gap-1">
            <span className="flex justify-between text-xs">
              <span className="text-muted">App servers</span>
              <span className="font-mono">{n}</span>
            </span>
            <input
              type="range"
              min={0}
              max={SERVER_COUNTS.length - 1}
              value={s.servers}
              aria-label="App servers"
              onChange={(e) => set({ servers: Number(e.target.value) })}
              className="accent-[var(--accent)]"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.pooled}
              onChange={(e) => set({ pooled: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Put a connection pooler between them and the database
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted">Database connections in use</span>
              <span className="font-mono">
                {conns} / {DB_MAX}
              </span>
            </div>
            <div className="bg-surface-2 mt-2 h-4 overflow-hidden rounded-full">
              <motion.div
                initial={false}
                animate={{ width: `${Math.min(100, (conns / DB_MAX) * 100)}%` }}
                className={cn("h-full", over ? "bg-bad" : "bg-viz-data")}
              />
            </div>
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              over ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
            )}
          >
            {over
              ? `${n} servers × 20 connections = ${n * CONNS_PER_SERVER}, but the database allows ${DB_MAX}. New servers can't connect: autoscaling the app tier just broke the database tier.`
              : s.pooled
                ? "A pooler (such as PgBouncer or a managed database proxy) shares a small, fixed set of database connections among all the app servers."
                : "Fine for now. Keep adding servers."}
          </p>
        </div>
      }
    >
      <p>
        Autoscaling the app servers is easy. But every server also opens connections to the
        database, and the database can&apos;t scale out the same way.
      </p>
      <p className="text-muted text-sm">
        Scaling one tier moves the bottleneck to the next. Always ask: what does each new server put
        pressure on?
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: results day ------------------------------------------------------------------- */

export function KnownSpikeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A spike you can see coming"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="known-spike"
            prompt="Exam results go live at exactly 10:00. Traffic will jump 20× within a minute. New servers take 4 minutes to be ready. What do you do?"
            options={[
              {
                id: "schedule",
                label:
                  "Schedule the extra capacity to be ready before 10:00, and let target tracking handle the rest",
                correct: true,
                feedback:
                  "Right. Reactive scaling can't beat a spike faster than warm-up. Known events call for scheduled (or predictive) scaling.",
              },
              {
                id: "target",
                label: "Lower the target CPU to 20% so it reacts sooner",
                feedback:
                  "It would react to the same spike at the same moment, and the new servers still need 4 minutes.",
              },
              {
                id: "cooldown",
                label: "Shorten the scale-in wait",
                feedback: "That controls removing servers, not adding them.",
              },
              {
                id: "nothing",
                label: "Nothing: autoscaling exists for exactly this",
                feedback:
                  "For gradual changes, yes. A 20× jump in one minute outruns any reactive policy.",
              },
            ]}
            explanation="Autoscaling reacts; it can't predict. Warm-up time decides how fast a spike you can absorb. For known events, scale ahead."
          />
        </div>
      }
    >
      <p>You&apos;ll design exactly this site in the capstone.</p>
    </StepLayout>
  );
}

/* 6 ─ Tools --------------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "AWS EC2 Auto Scaling",
    "Target tracking, step, scheduled and predictive policies. Instance warm-up must be switched on (AWS suggests 300 s to start); the 300 s cooldown only applies to older simple scaling.",
  ],
  [
    "Google Cloud managed instance groups",
    "Autoscaler targets CPU and other signals; an initialisation period (default 60 s) covers warm-up.",
  ],
  ["Azure Virtual Machine Scale Sets", "Autoscale rules on metrics or schedules."],
  [
    "Kubernetes HPA",
    "Checks every 15 s; scales up fast but waits 5 minutes before scaling down; ignores changes within 10%.",
  ],
  ["Cluster Autoscaler · Karpenter", "Add and remove the machines that pods run on."],
  ["KEDA", "Scales on events such as queue length, including down to zero."],
  [
    "Serverless (Lambda, Cloud Run, Functions)",
    "Scales per request. Cold starts hit under 1% of Lambda invocations, from under 100 ms to over a second.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Autoscalers you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Every platform has the same ideas: a target, warm-up, and caution when scaling in.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Stateless first", "Keep sessions in a shared store or the client, so servers can come and go."],
  ["Headroom beats heroics", "A lower CPU target absorbs spikes while new servers warm up."],
  ["Up fast, down slow", "Scale out quickly; wait before scaling in to avoid flapping."],
  ["Schedule the known", "Reactive scaling can't beat a spike faster than warm-up."],
  ["Watch the next tier", "More app servers mean more database connections."],
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
      <p>Next: serving users from close by, with CDNs and the edge.</p>
    </StepLayout>
  );
}

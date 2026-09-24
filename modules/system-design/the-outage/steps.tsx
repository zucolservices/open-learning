"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DELAY, MINUTES, run, type Fixes } from "./model";
import type { OutageState } from "./state";

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

/* 1 ─ Paged at 21:02 ⭐ ---------------------------------------------------------------------------- */

// 20:50 → 21:02, one point per minute (13 points). The cache node restarts at 20:58 (index 8).
const PANELS: {
  id: string;
  title: string;
  unit: string;
  values: number[];
  max: number;
  note: string;
}[] = [
  {
    id: "req",
    title: "Requests/s reaching the API (incl. retries)",
    unit: "/s",
    values: [3000, 3050, 2980, 3020, 3010, 2990, 3040, 3000, 4200, 6900, 7300, 7400, 7350],
    max: 8000,
    note: "Users didn't suddenly arrive: the extra 4,000 a second are retries of failing requests.",
  },
  {
    id: "err",
    title: "Error rate",
    unit: "%",
    values: [0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.2, 0.1, 22, 61, 74, 78, 77],
    max: 100,
    note: "Errors are timeouts from the catalog service, which waits on the database.",
  },
  {
    id: "hit",
    title: "Cache hit ratio",
    unit: "%",
    values: [95, 95, 96, 95, 95, 95, 96, 95, 21, 22, 23, 24, 25],
    max: 100,
    note: "The first thing to move: at 20:58 it fell from 95% to about 20%. The deploy log shows cache node 3 restarted for maintenance then.",
  },
  {
    id: "db",
    title: "Database CPU",
    unit: "%",
    values: [38, 40, 39, 41, 40, 39, 40, 41, 100, 100, 100, 100, 100],
    max: 100,
    note: "Pinned at 100% from 20:58: every cache miss became a database read.",
  },
];

function Spark({ values, max, danger }: { values: number[]; max: number; danger: boolean }) {
  const W = 160;
  const H = 40;
  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => H - 3 - (v / max) * (H - 6);
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-10 w-full" preserveAspectRatio="none" aria-hidden>
      <line x1={x(8)} x2={x(8)} y1={0} y2={H} stroke="var(--viz-meta)" strokeDasharray="2 2" />
      <path
        d={d}
        fill="none"
        stroke={danger ? "var(--bad)" : "var(--viz-data)"}
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function Paged() {
  const [s, set] = useSceneState<OutageState>();
  const picked = PANELS.find((p) => p.id === s.panel);
  return (
    <StepLayout
      eyebrow="Capstone"
      title="Paged at 21:02"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-bad/40 bg-bad/10 rounded-xl border px-4 py-2 text-sm">
            <span className="font-semibold">PAGE · checkout-availability</span>: error budget
            burning about 780× faster than allowed.
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {PANELS.map((p) => {
              const last = p.values[p.values.length - 1];
              const danger = p.id === "hit" ? last < 80 : last > p.values[0] * 1.5;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set({ panel: p.id })}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left",
                    s.panel === p.id
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-muted text-[10px]">{p.title}</span>
                    <span className="font-mono text-xs">
                      {last.toLocaleString("en-IN")}
                      {p.unit}
                    </span>
                  </div>
                  <Spark values={p.values} max={p.max} danger={danger} />
                  <div className="text-subtle flex justify-between text-[8px]">
                    <span>20:50</span>
                    <span>20:58</span>
                    <span>21:02</span>
                  </div>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.panel ?? "none"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {picked
                ? picked.note
                : "Click each panel to read it. The dashed line marks 20:58, when a deploy ran."}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        It&apos;s 9 pm, the evening sale is on, and your phone goes off. Brewline&apos;s checkout is
        failing for most customers. You&apos;re the on-call engineer.
      </p>
      <p>
        Like a doctor in casualty, start with the vital signs. Four dashboards: what changed, and in
        what order?
      </p>
      <p className="text-muted text-sm">
        This capstone uses caching, retries, resilience patterns and observability together. Real
        outages rarely have one cause; problems feed each other.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Checkpoint: first mover -------------------------------------------------------------------- */

export function FirstMover() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What moved first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="first-mover"
            prompt="All four graphs changed around 20:58. Which change most likely started the incident?"
            options={[
              {
                id: "cache",
                label: "The cache hit ratio dropped when cache node 3 restarted",
                correct: true,
                feedback:
                  "Right. A cold cache sends almost every read to the database: the other three graphs follow from that.",
              },
              {
                id: "traffic",
                label: "A sudden surge of users",
                feedback:
                  "The extra requests are retries, which come after errors. Users didn't suddenly arrive.",
              },
              {
                id: "db",
                label: "The database ran out of CPU on its own",
                feedback:
                  "The database is overloaded because of what's sent to it. Why did its load jump?",
              },
              {
                id: "errors",
                label: "A bug started throwing errors",
                feedback:
                  "Errors are timeouts waiting for the database, a symptom rather than the start.",
              },
            ]}
            explanation="Look for the change that others follow from, and check deploy and change logs at that minute: most incidents start with a change."
          />
        </div>
      }
    >
      <p>Correlated graphs don&apos;t say which caused which. Order and mechanism do.</p>
    </StepLayout>
  );
}

/* 3 ─ Follow a failing request -------------------------------------------------------------------- */

const T_FRAMES: {
  title: string;
  text: string;
  spans: [string, number, number, number, boolean][];
  logs: string[];
  tone?: "good" | "bad";
}[] = [
  {
    title: "One page load, three attempts",
    text: "The trace for a failing product page. The web tier called the API, which timed out after 2 s, and was retried at once, twice.",
    spans: [
      ["GET /product/1842", 0, 6100, 0, true],
      ["api attempt 1", 10, 2000, 1, true],
      ["api attempt 2", 2020, 2000, 1, true],
      ["api attempt 3", 4040, 2000, 1, true],
    ],
    logs: [
      "21:02:14.020 WARN web retrying /api/product/1842 attempt=2/3 reason=timeout",
      "21:02:16.040 WARN web retrying /api/product/1842 attempt=3/3 reason=timeout",
    ],
  },
  {
    title: "Inside one attempt",
    text: "The catalog service misses the cache, then waits for a database connection. The pool is empty: every connection is busy with other misses.",
    spans: [
      ["api attempt 1", 0, 2000, 0, true],
      ["cache GET product:1842 (miss)", 5, 1, 1, false],
      ["db pool: wait for connection", 8, 1990, 1, true],
    ],
    logs: [
      "21:02:12.013 INFO catalog cache MISS key=product:1842",
      "21:02:14.001 ERROR catalog db pool exhausted (500/500 busy) waited=1990ms",
    ],
    tone: "bad",
  },
  {
    title: "The same keys, over and over",
    text: "Logs show about 4,000 misses a second for only a few hundred popular products. Every request that misses reads the database itself: a cache stampede.",
    spans: [
      ["cache GET product:1842 (miss)", 0, 1, 0, false],
      ["cache GET product:1842 (miss)", 2, 1, 0, false],
      ["cache GET product:1842 (miss)", 4, 1, 0, false],
    ],
    logs: [
      "21:02:12.013 INFO catalog cache MISS key=product:1842",
      "21:02:12.014 INFO catalog cache MISS key=product:1842",
      "21:02:12.014 INFO catalog cache MISS key=product:1842",
      "… 3,941 more misses for product:1842 this minute",
    ],
  },
  {
    title: "A loop that feeds itself",
    text: "Cold cache → database overloaded → timeouts → immediate retries → even more database load → reads fail, so the cache never warms. The cache node has been healthy since 20:59; the loop keeps the outage going.",
    spans: [],
    logs: [],
    tone: "bad",
  },
];

export function FollowRequest() {
  const [s, set] = useSceneState<OutageState>();
  const step = Math.min(s.tFrame, T_FRAMES.length - 1);
  const f = T_FRAMES[step];
  const span = Math.max(1, ...f.spans.map((x) => x[1] + x[2]));
  return (
    <StepLayout
      eyebrow="Investigate"
      title="Follow a failing request"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface min-h-40 rounded-xl border p-3">
            {f.spans.length ? (
              <div className="space-y-1">
                {f.spans.map(([name, start, dur, depth, bad], i) => (
                  <div key={`${step}${i}`} className="flex items-center gap-2 text-[10px]">
                    <span className="w-40 shrink-0 truncate" style={{ paddingLeft: depth * 8 }}>
                      {name}
                    </span>
                    <span className="bg-surface-2 relative h-3.5 flex-1 rounded">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(1, (dur / span) * 100)}%` }}
                        style={{ left: `${(start / span) * 100}%` }}
                        className={cn(
                          "absolute inset-y-0 rounded",
                          bad ? "bg-bad/60" : "bg-viz-compute/60",
                        )}
                      />
                    </span>
                    <span className="text-muted w-14 shrink-0 text-right font-mono">
                      {dur.toLocaleString("en-IN")} ms
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
                {["Cold cache", "Database overloaded", "Timeouts", "Immediate retries"].map(
                  (n, i) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="border-bad/50 bg-bad/10 rounded-xl border px-2 py-3"
                    >
                      {n}
                      <span className="text-muted block text-[10px]">
                        {i < 3 ? "→" : "↩ back to the database"}
                      </span>
                    </motion.div>
                  ),
                )}
              </div>
            )}
            {f.logs.length > 0 && (
              <div className="border-line mt-3 space-y-0.5 border-t pt-2 font-mono text-[9px]">
                {f.logs.map((l, i) => (
                  <p key={i} className={cn("break-all", /ERROR|WARN/.test(l) && "text-bad")}>
                    {l}
                  </p>
                ))}
              </div>
            )}
          </div>
          <Stepper step={step} count={T_FRAMES.length} onChange={(n) => set({ tFrame: n })} />
          <FrameCaption frameKey={step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Metrics told you <em>what</em> and <em>when</em>. Now traces and logs tell you <em>why</em>.
        Step through one failing request.
      </p>
      <p className="text-muted text-sm">
        This is a <Term id="metastable-failure">metastable failure</Term>: the trigger is over, but
        the system is stuck in a bad state that sustains itself.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: trigger, amplifier, symptom ----------------------------------------------------- */

export function Classify() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Trigger, amplifier or symptom?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="classify"
            prompt="Sort the evidence. A trigger starts it; an amplifier makes it worse and keeps it going; a symptom is what you see."
            categories={[
              { id: "trigger", label: "Trigger" },
              { id: "amp", label: "Amplifier" },
              { id: "symptom", label: "Symptom" },
            ]}
            items={[
              {
                id: "restart",
                label: "Cache node 3 restarted for maintenance",
                category: "trigger",
                why: "The change that set things off.",
              },
              {
                id: "retries",
                label: "Web tier retries 3 times with no delay",
                category: "amp",
                why: "It multiplies load on the overloaded database.",
              },
              {
                id: "stampede",
                label: "Every cache miss reads the database itself",
                category: "amp",
                why: "Thousands of identical reads for the same keys: a stampede.",
              },
              {
                id: "errors",
                label: "78% of requests fail",
                category: "symptom",
                why: "What users see.",
              },
              {
                id: "cpu",
                label: "Database CPU at 100%",
                category: "symptom",
                why: "A consequence of the load.",
              },
              {
                id: "pool",
                label: "Connection pool exhausted",
                category: "symptom",
                why: "Another consequence of the load.",
              },
            ]}
          />
        </div>
      }
    >
      <p>The trigger is usually innocent: restarts happen. The amplifiers are what to fix.</p>
    </StepLayout>
  );
}

/* 5 ─ Stop the outage ⭐ -------------------------------------------------------------------------- */

const FIXES: [keyof Fixes, string, string][] = [
  [
    "shed",
    "Shed load at the database proxy",
    "A config change: reject queries above its capacity, fast.",
  ],
  ["budget", "Turn on a retry budget with backoff", "A feature flag in the web tier."],
  [
    "coalesce",
    "Coalesce cache fills (one read per key)",
    "A code change: needs a build and deploy.",
  ],
  ["replicas", "Add database read replicas", "Provisioning and catching up take time."],
  ["restart", "Restart all app servers", "It's what the last incident did…"],
];

function OutageChart({ minutes }: { minutes: ReturnType<typeof run>["minutes"] }) {
  const W = 360;
  const H = 130;
  const x = (t: number) => 28 + (t / (MINUTES - 1)) * (W - 36);
  const y = (v: number) => H - 18 - v * (H - 30);
  const d = minutes.map((m, i) => `${i === 0 ? "M" : "L"}${x(m.t)},${y(m.userSuccess)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Share of requests succeeding after 21:00"
    >
      <line
        x1={28}
        x2={W - 8}
        y1={y(0.99)}
        y2={y(0.99)}
        stroke="var(--good)"
        strokeDasharray="3 3"
      />
      {minutes.map((m) => (
        <rect
          key={m.t}
          x={x(m.t) - 3}
          y={H - 16}
          width={6}
          height={3}
          fill={m.dbLoad >= m.dbCap * 0.98 ? "var(--bad)" : "var(--good)"}
          opacity={0.7}
        />
      ))}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--fg)"
        strokeWidth={1.6}
        initial={{ d }}
        animate={{ d }}
        transition={{ duration: 0.5 }}
      />
      {[0, 0.5, 1].map((v) => (
        <text key={v} x={24} y={y(v) + 3} textAnchor="end" className="fill-subtle text-[7px]">
          {v * 100}%
        </text>
      ))}
      {[0, 10, 20, 30].map((t) => (
        <text
          key={t}
          x={x(t)}
          y={H - 1}
          textAnchor={t === 30 ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          21:{String(t).padStart(2, "0")}
        </text>
      ))}
    </svg>
  );
}

export function StopIt() {
  const [s, set] = useSceneState<OutageState>();
  const fixes: Fixes = {
    coalesce: s.coalesce,
    budget: s.budget,
    shed: s.shed,
    replicas: s.replicas,
    restart: s.restart,
  };
  const r = useMemo(() => run(fixes), [s.coalesce, s.budget, s.shed, s.replicas, s.restart]); // eslint-disable-line react-hooks/exhaustive-deps
  const rec = r.recoveredAt;
  const msg =
    rec === null
      ? s.restart
        ? "Restarting everything re-emptied the caches and reconnected every server at once: back to square one. The loop is still running."
        : "Still down. The system recovers only when something breaks the loop: less load on the database, so reads succeed and the cache can warm."
      : rec <= 8
        ? `Recovered at 21:${String(rec).padStart(2, "0")}. Quick mitigations broke the loop; the cache warmed within minutes.${s.coalesce ? " Coalescing will stop the next cache restart from doing this again." : " Now schedule the permanent fix (coalescing), so the next cache restart doesn't repeat this."}`
        : `Recovered at 21:${String(rec).padStart(2, "0")}, but customers suffered for a while. Which fixes take effect fastest?`;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Stop the outage"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-1.5">
            {FIXES.map(([k, label, hint]) => (
              <label
                key={k}
                className={cn(
                  "flex items-start gap-2 rounded-xl border px-3 py-1.5",
                  s[k] ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                <input
                  type="checkbox"
                  checked={Boolean(s[k])}
                  onChange={(e) => set({ [k]: e.target.checked })}
                  className="mt-0.5 accent-[var(--accent)]"
                />
                <span className="flex-1">
                  <span className="block text-xs font-medium">{label}</span>
                  <span className="text-muted block text-[10px]">{hint}</span>
                </span>
                <span className="text-muted shrink-0 font-mono text-[10px]">
                  takes effect 21:{String(DELAY[k]).padStart(2, "0")}
                </span>
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <OutageChart minutes={r.minutes} />
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-fg h-px w-4" /> requests succeeding
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-bad/70 h-1 w-3" /> database saturated
              </span>
              <span className="flex items-center gap-1">
                <span className="border-good w-4 border-t border-dashed" /> 99%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Recovered (3 min above 99%)"
              value={rec === null ? "not by 21:30" : `21:${String(rec).padStart(2, "0")}`}
              bad={rec === null || rec > 10}
            />
            <Stat
              label="Requests succeeding, 21:00–21:30"
              value={`${Math.round(r.avgSuccess * 100)}%`}
              bad={r.avgSuccess < 0.85}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.coalesce}${s.budget}${s.shed}${s.replicas}${s.restart}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                rec !== null && rec <= 8 ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {msg}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Choose your actions. Each takes a different time to take effect. The goal: break the loop as
        fast as possible, then make sure it can&apos;t happen again.
      </p>
      <p className="text-muted text-sm">
        Incident rule of thumb: mitigate first (stop the bleeding), diagnose fully later. Model and
        timings are illustrative.
      </p>
    </StepLayout>
  );
}

/* 6 ─ After the incident ------------------------------------------------------------------------- */

export function Afterwards() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="After the fire"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="incident-order"
            prompt="Put the incident response in order."
            items={[
              { id: "declare", label: "Declare an incident and name an incident lead" },
              { id: "mitigate", label: "Mitigate: shed load, enable the retry budget" },
              { id: "confirm", label: "Confirm recovery on the dashboards and SLO" },
              { id: "postmortem", label: "Write a blameless postmortem" },
              {
                id: "fix",
                label: "Ship and track the permanent fixes (coalescing, retry budgets everywhere)",
              },
            ]}
            explanation="Blameless means asking 'how did our system allow this?' rather than 'who pressed the button?'. The cache restart was routine; the real findings are the missing coalescing and the unlimited retries."
          />
        </div>
      }
    >
      <p>
        The outage ends; the learning shouldn&apos;t. That&apos;s what a{" "}
        <Term id="postmortem">blameless postmortem</Term> is for.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Find the first mover",
    "Graphs move together; look for what changed first, and the change log.",
  ],
  ["Traces and logs give the why", "Follow one failing request end to end."],
  ["Break the loop", "Shed load and cap retries so the system can recover itself."],
  ["Don't just restart", "It can reset the recovery you need."],
  [
    "Fix the amplifiers",
    "Coalesce cache fills, budget retries: the next restart becomes a non-event.",
  ],
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
      <p>
        That&apos;s the end of System Design at Scale. You&apos;ve gone from one server to
        multi-region systems, and you can now reason about load, data, failure and trade-offs like a
        systems designer.
      </p>
      <p className="text-muted text-sm">
        Revisit any module to try the other paths; every simulation is there to be broken on
        purpose.
      </p>
    </StepLayout>
  );
}

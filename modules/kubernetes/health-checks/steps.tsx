"use client";

import { motion } from "motion/react";
import { HeartPulse, DoorOpen, GraduationCap } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DB_DOWN, DURATION, START_S, simulate } from "./model";
import type { HealthState, Liveness, Readiness } from "./state";

/* 1 ─ Alive, ready, still training ------------------------------------------------------------- */

export function ThreeQuestions() {
  const rows = [
    {
      icon: HeartPulse,
      t: "Are you alive?",
      d: "If a shopkeeper has collapsed, someone must step in. Liveness: if this fails, restart the container.",
      k: "liveness",
    },
    {
      icon: DoorOpen,
      t: "Are you ready for customers?",
      d: "The owner is fine but restocking shelves: turn the sign to Closed for a while. Readiness: if this fails, stop sending traffic, but don't restart.",
      k: "readiness",
    },
    {
      icon: GraduationCap,
      t: "Still in training?",
      d: "Don't judge a new hire on their first morning. Startup: hold the other checks until the app has finished starting.",
      k: "startup",
    },
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Alive, ready, still training"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(({ icon: Icon, t, d, k }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Kubernetes can only keep an app healthy if it can tell when it isn&apos;t. It asks three
        different questions with <Term id="probe">probes</Term>: small checks the kubelet runs
        against each container every few seconds.
      </p>
      <p>
        Mixing them up is one of the most common ways to make a healthy app fall over. The next step
        shows how.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the restart loop ⭐ ---------------------------------------------------------------------- */

const LIV: [Liveness, string][] = [
  ["none", "None"],
  ["app", "Checks the app"],
  ["deep", "Checks app + database"],
];
const READY: [Readiness, string][] = [
  ["none", "None"],
  ["app", "Checks the app"],
  ["deep", "Checks app + database"],
];

const pct = (t: number) => `${(t / DURATION) * 100}%`;

export function FixLoop() {
  const [s, set] = useSceneState<HealthState>();
  const r = simulate(s.liveness, s.startup, s.readiness);
  const segs = (pick: (x: (typeof r.timeline)[number]) => string) => {
    const out: { from: number; to: number; k: string }[] = [];
    for (const sec of r.timeline) {
      const k = pick(sec);
      const last = out[out.length - 1];
      if (last && last.k === k) last.to = sec.t + 1;
      else out.push({ from: sec.t, to: sec.t + 1, k });
    }
    return out;
  };
  const container = segs((x) => x.phase);
  const traffic = segs((x) => (x.ready ? (x.serving ? "ok" : "err") : "none"));
  const perfect = r.restarts === 0 && r.errorSeconds <= 20 && r.servedSeconds >= 120;
  const verdict =
    r.restarts > 1 && r.servedSeconds === 0
      ? "Restart loop: the liveness probe fails three times while the app is still starting, so the kubelet kills it, again and again. It never finishes starting."
      : r.restarts > 0
        ? "The database outage made the liveness probe fail, so a healthy container was restarted. Restarting can't fix a database; with many pods, everything restarts at once."
        : r.errorSeconds > 60
          ? "No restarts, but users got errors: without a readiness check, the pod received traffic while it was still starting and while the database was down."
          : perfect
            ? "Healthy: no restarts, no traffic while starting, and the pod stepped out of the Service during the outage (after three failed checks, about 20 seconds)."
            : "Better. The readiness check doesn't look at the database, so the pod kept getting requests it couldn't answer during the outage.";
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the restart loop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2">
            {(
              [
                ["Liveness probe", "liveness", LIV],
                ["Readiness probe", "readiness", READY],
              ] as const
            ).map(([label, key, opts]) => (
              <div key={key} className="flex flex-col gap-1 text-xs">
                <span className="text-muted">{label}</span>
                <Segmented
                  size="sm"
                  value={s[key]}
                  options={opts as [string, string][]}
                  onChange={(v) => set({ [key]: v })}
                />
              </div>
            ))}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.startup}
                onChange={(e) => set({ startup: e.target.checked })}
                className="accent-accent"
              />
              Startup probe (up to 30 × 10 s = 300 s to start)
            </label>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-[5rem_1fr] gap-2">
              <div className="flex flex-col gap-1.5 pt-4">
                <span className="text-muted flex h-5 items-center text-[10px]">Container</span>
                <span className="text-muted flex h-5 items-center text-[10px]">Gets traffic</span>
              </div>
              <div className="relative flex flex-col gap-1.5 pt-4">
                <div
                  className="bg-viz-remove/10 border-viz-remove/40 absolute top-0 bottom-0 border-x border-dashed"
                  style={{ left: pct(DB_DOWN[0]), width: pct(DB_DOWN[1] - DB_DOWN[0]) }}
                >
                  <span className="text-viz-remove absolute top-0 left-1 text-[9px] whitespace-nowrap">
                    database down
                  </span>
                </div>
                {(
                  [
                    [
                      container,
                      {
                        starting: "bg-viz-idle/50",
                        up: "bg-viz-compute/70",
                        backoff: "bg-viz-remove/60",
                      },
                      true,
                    ],
                    [traffic, { ok: "bg-good/70", err: "bg-bad", none: "bg-transparent" }, false],
                  ] as [typeof container, Record<string, string>, boolean][]
                ).map(([list, cls, marks], row) => (
                  <div key={row} className="bg-surface-2 relative h-5 overflow-hidden rounded">
                    {list.map((g, i) => (
                      <div
                        key={i}
                        className={cn("absolute top-0 h-5", cls[g.k])}
                        style={{ left: pct(g.from), width: pct(g.to - g.from) }}
                      />
                    ))}
                    {marks &&
                      r.timeline
                        .filter((x) => x.restart)
                        .map((x) => (
                          <span
                            key={x.t}
                            className="text-bad absolute top-0 -translate-x-1/2 text-xs leading-5 font-bold"
                            style={{ left: pct(x.t) }}
                          >
                            ✕
                          </span>
                        ))}
                  </div>
                ))}
              </div>
              <span />
              <div className="text-subtle relative h-3 font-mono text-[9px]">
                <span className="absolute left-0">0 s</span>
                <span
                  className="absolute -translate-x-1/2 whitespace-nowrap"
                  style={{ left: pct(START_S) }}
                >
                  {START_S} s<span className="hidden sm:inline">: app started</span>
                </span>
                <span className="absolute right-0">{DURATION} s</span>
              </div>
            </div>
            <div className="text-muted flex flex-wrap gap-3 text-[9px]">
              <span className="flex items-center gap-1">
                <span className="bg-viz-idle/50 size-2 rounded-sm" />
                starting
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute/70 size-2 rounded-sm" />
                running
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-remove/60 size-2 rounded-sm" />
                restart back-off
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-good/70 size-2 rounded-sm" />
                served
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-bad size-2 rounded-sm" />
                users get errors
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Restarts", r.restarts, r.restarts > 0],
              ["Seconds of errors", r.errorSeconds, r.errorSeconds > 20],
              ["Seconds served", r.servedSeconds, false],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  bad ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l as string}</p>
                <p className="font-mono text-lg font-semibold">{v as number}</p>
              </div>
            ))}
          </div>
          <motion.p
            key={`${s.liveness}-${s.startup}-${s.readiness}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              perfect ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {verdict}
          </motion.p>
        </div>
      }
    >
      <p>
        This app takes 60 seconds to start, and its database goes down for 40 seconds later on. It
        starts with a liveness probe on default settings: a check every 10 seconds, three failures
        and the container is killed. That&apos;s 30 seconds, and the app needs 60.
      </p>
      <p>
        Fix it. Add a <Term id="startup-probe">startup probe</Term>, a{" "}
        <Term id="readiness-probe">readiness probe</Term>, and think about what the{" "}
        <Term id="liveness-probe">liveness probe</Term> should check. The docs warn:
        &ldquo;Incorrect implementation of liveness probes can lead to cascading failures.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Writing a probe ---------------------------------------------------------------------------- */

export function WritingProbe() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Writing a probe"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
            {`containers:
- name: payments-api
  startupProbe:
    httpGet: { path: /healthz, port: 8080 }
    periodSeconds: 10
    failureThreshold: 30      # up to 300 s to start
  livenessProbe:
    httpGet: { path: /healthz, port: 8080 }   # the app itself
  readinessProbe:
    httpGet: { path: /ready, port: 8080 }     # app + what it needs
  lifecycle:
    preStop:
      sleep: { seconds: 5 }   # let traffic drain first`}
          </pre>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="mb-1 font-semibold">Four ways to check</p>
              <p className="text-muted">
                httpGet (a status from 200 to 399), tcpSocket (the port opens), exec (a command
                exits with 0), grpc (the health service says SERVING).
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="mb-1 font-semibold">Defaults</p>
              <p className="text-muted font-mono text-[10px] leading-relaxed">
                initialDelaySeconds 0 · periodSeconds 10 · timeoutSeconds 1 · failureThreshold 3 ·
                successThreshold 1
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Point liveness and startup at the same cheap endpoint that only proves the process works.
        Point readiness at one that also checks what the app needs to serve requests; the docs
        describe exactly that split. With no readiness probe, &ldquo;the kubelet always considers
        the result as Success&rdquo;.
      </p>
      <p>
        Readiness keeps running for the pod&apos;s whole life. When a pod is shutting down it&apos;s
        marked not ready while it gets SIGTERM, so a short preStop sleep is a common way to let
        traffic move away before the app stops.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which probe? ------------------------------------------------------------------------------- */

export function WhichProbe() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which probe?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-probe"
            prompt="Which probe handles each situation?"
            categories={[
              { id: "liveness", label: "Liveness" },
              { id: "readiness", label: "Readiness" },
              { id: "startup", label: "Startup" },
            ]}
            items={[
              {
                id: "cache",
                label: "The app spends four minutes loading a cache every time it starts",
                category: "startup",
                why: "Give it a startup budget so liveness doesn't kill it mid-load.",
              },
              {
                id: "deadlock",
                label: "The process sometimes deadlocks and never answers again",
                category: "liveness",
                why: "Only a restart fixes it.",
              },
              {
                id: "db",
                label: "The database is unreachable for a minute",
                category: "readiness",
                why: "Stop sending traffic until it's back; restarting won't help.",
              },
              {
                id: "busy",
                label: "The app is overloaded and needs a breather from new requests",
                category: "readiness",
                why: "Readiness can take a pod out of rotation temporarily.",
              },
              {
                id: "hang",
                label: "A memory leak makes the process hang after a few days",
                category: "liveness",
                why: "A restart gets it working again.",
              },
              {
                id: "migrate",
                label: "A legacy app needs a long warm-up before its first request",
                category: "startup",
                why: "The startup probe holds the other checks until it's done.",
              },
            ]}
            explanation="Liveness: only things a restart fixes. Readiness: anything that means 'don't send me traffic right now'. Startup: protection for slow starters."
          />
        </div>
      }
    >
      <p>Six situations. Which probe should catch each one?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Liveness restarts", "Check only the app itself; never its dependencies."],
  ["Readiness routes", "Not ready means no traffic, not a restart."],
  ["Startup protects slow starters", "failureThreshold × periodSeconds is the budget."],
  ["Defaults are aggressive", "10 s × 3 failures = killed after 30 s."],
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
      <p>Next: StatefulSets, DaemonSets, Jobs and CronJobs, the other ways to run workloads.</p>
    </StepLayout>
  );
}

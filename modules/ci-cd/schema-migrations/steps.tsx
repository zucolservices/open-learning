"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, lockQueue, type Way } from "./model";
import type { MigrationState } from "./state";

/* 1 ─ Rename a column, live ⭐ -------------------------------------------------------------------- */

const COL_CLS = {
  live: "border-good/50 bg-good/10",
  filling: "border-viz-compute bg-viz-compute/10",
  stale: "border-line bg-surface opacity-60",
  gone: "border-bad/50 bg-bad/5 line-through opacity-40",
};

const COL_LABEL = { live: "in use", filling: "filling up", stale: "stale", gone: "dropped" };

export function RenameLive() {
  const [s, set] = useSceneState<MigrationState>();
  const fs = FRAMES[s.way];
  const frame = Math.min(s.frame, fs.length - 1);
  const f = fs[frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Rename a column, live"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<Way>
              size="sm"
              value={s.way}
              onChange={(way) => set({ way, frame: 0 })}
              options={[
                ["naive", "All at once"],
                ["expand", "Expand and contract"],
              ]}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1.5 text-[10px]">App pods (rolling update)</p>
              <div className="flex gap-1.5">
                {Array.from({ length: 4 }, (_, i) => {
                  const isNew = i < f.pods.neu;
                  const broken = !isNew && f.oldBroken;
                  return (
                    <motion.div
                      key={i}
                      layout
                      className={cn(
                        "flex h-12 flex-1 flex-col items-center justify-center rounded-lg border font-mono text-[10px]",
                        broken
                          ? "border-bad bg-bad/15 text-bad"
                          : isNew
                            ? "border-accent bg-accent-soft"
                            : "border-line bg-surface-2",
                      )}
                    >
                      {isNew ? f.pods.newLabel : f.pods.oldLabel}
                      {broken && <span className="text-[8px]">errors</span>}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1.5 text-[10px]">orders table</p>
              <div className="flex flex-wrap gap-1.5">
                {f.columns.map((c) => (
                  <motion.span
                    key={c.name}
                    layout
                    className={cn(
                      "rounded-md border px-2 py-1 font-mono text-[11px]",
                      COL_CLS[c.state],
                    )}
                  >
                    {c.name}
                    <span className="text-muted ml-1 text-[9px]">{COL_LABEL[c.state]}</span>
                  </motion.span>
                ))}
              </div>
              <p
                className={cn(
                  "mt-2 font-mono text-[10px]",
                  f.rollback === "safe" ? "text-good" : "text-bad",
                )}
              >
                rolling back the app: {f.rollback === "safe" ? "safe" : "not safe"}
              </p>
            </div>
          </div>
          {f.sql && <Code>{f.sql}</Code>}
          <Stepper step={frame} count={fs.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.way}-${frame}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        During a rolling update, old and new versions of the app run at the same time, against one
        database. A <Term id="schema-migration">schema change</Term> that suits only the new version
        breaks the old one. GitLab&apos;s guide is blunt: renaming columns the standard way
        &ldquo;requires downtime&rdquo;.
      </p>
      <p>
        Step through the obvious way, then switch to{" "}
        <Term id="expand-contract">expand and contract</Term>. Danilo Sato describes it as breaking
        a change &ldquo;into three distinct phases: expand, migrate, and contract&rdquo;, and notes
        it lets your code be released in any of those phases.
      </p>
      <p>
        It takes five small releases instead of one, and at every step but the last, rolling back is
        still safe.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The lock queue ------------------------------------------------------------------------------ */

export function LockQueue() {
  const [s, set] = useSceneState<MigrationState>();
  const q = lockQueue(s.lockTimeout ? 5 : null);
  const peak = Math.max(...q.map((x) => x.queued));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The lock queue"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.lockTimeout}
              onChange={(e) => set({ lockTimeout: e.target.checked })}
              className="accent-accent"
            />
            <span className="font-mono">SET lock_timeout = &apos;5s&apos;</span> before the ALTER
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex h-36 items-end gap-[3px]">
              {q.map((x) => (
                <div key={x.second} className="flex h-full flex-1 flex-col justify-end">
                  <motion.div
                    animate={{ height: `${Math.max(2, (x.queued / 900) * 100)}%` }}
                    className={cn("w-full rounded-t-sm", x.blocked ? "bg-bad/70" : "bg-good/40")}
                  />
                </div>
              ))}
            </div>
            <div className="text-muted mt-1 flex justify-between font-mono text-[9px]">
              <span>0 s</span>
              <span>report query ends at 20 s</span>
              <span>30 s</span>
            </div>
            <p className="text-muted mt-1 font-mono text-[10px]">
              bars = requests stuck waiting on the orders table · peak {peak}
            </p>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: a 20-second report query is running; the ALTER arrives at 2 s; 50 requests
            a second touch the table.
          </p>
        </div>
      }
    >
      <p>
        Even an instant change can stall everything. Most ALTER TABLE forms need PostgreSQL&apos;s
        strongest lock, ACCESS EXCLUSIVE. If a slow query is already reading the table, the ALTER
        waits, and every query that arrives after it queues behind the ALTER, not just behind the
        slow query.
      </p>
      <p>
        GoCardless lost about 15 seconds of its API this way during a planned migration. The fix is
        one line: a short <span className="font-mono">lock_timeout</span>, so the migration gives up
        quickly and retries later instead of taking the table hostage.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Migrations in the pipeline ------------------------------------------------------------------ */

const PRACTICES: [string, string][] = [
  [
    "Versioned and automated",
    "Each change is a numbered script in the repository, applied by a tool (Flyway, Liquibase, Alembic, Django, Rails, Prisma, Atlas) that records what ran, in a table such as flyway_schema_history.",
  ],
  [
    "Run once, before the rollout",
    "A separate pipeline step or job, not every app replica on start-up. A Kubernetes Job can occasionally start twice, so migrations must take a lock or be safe to repeat.",
  ],
  [
    "Backward compatible",
    'Redgate\'s rule for Flyway: keep "backwards compatibility between the DB and all versions of the code currently deployed".',
  ],
  [
    "Linted",
    "Squawk, strong_migrations and Atlas lint flag dangerous statements, such as a rename or a lock-heavy index build, in the pull request.",
  ],
  [
    "Big tables, special tools",
    "For huge MySQL tables, gh-ost and pt-online-schema-change copy the table in the background and swap it in.",
  ],
];

export function InPipeline() {
  return (
    <StepLayout
      eyebrow="Practice"
      title="Migrations in the pipeline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PRACTICES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
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
        Database changes go through the pipeline like code: reviewed, versioned, tested in staging
        and applied automatically. A <Term id="backfill">backfill</Term> runs in small batches, so
        no single transaction holds locks for minutes.
      </p>
      <p>
        Even giants get caught. On 27 November 2021 GitHub was degraded for 2 hours 50 minutes when
        the final rename step of a schema migration on a large MySQL table pushed its read replicas
        into a deadlock.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Put the steps in order ---------------------------------------------------------------------- */

export function OrderSteps() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the steps in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="expand-contract-order"
            prompt="Drag the releases into a safe order for replacing the column phone with mobile."
            items={[
              { id: "add", label: "Add the mobile column, empty" },
              { id: "both", label: "Write to both columns; backfill old rows into mobile" },
              { id: "read", label: "Read from mobile" },
              { id: "stop", label: "Stop writing to phone" },
              { id: "drop", label: "Drop the phone column" },
            ]}
            explanation="Expand first, migrate the data and the reads, and contract last. Until the final drop, rolling back one release is always safe."
          />
        </div>
      }
    >
      <p>Five releases, each one safe to roll back except the last.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Two versions, one database", "Every schema change must suit old and new code at once."],
  ["Expand, migrate, contract", "Add, copy and switch, then remove, across several releases."],
  ["Mind the locks", "Short lock_timeout; batch the backfill; build indexes concurrently."],
  ["Migrate in the pipeline", "Versioned scripts, run once, before the rollout."],
  ["Contract is one-way", "After the drop you fix forward."],
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
        Many teams don&apos;t write &ldquo;down&rdquo; migrations at all: once new data has been
        written, undoing a schema change can lose it. Redgate&apos;s own Flyway guidance favours
        backward compatibility over undo scripts.
      </p>
      <p>
        Next: what to do when a release goes wrong anyway, and which things can&apos;t be undone.
      </p>
    </StepLayout>
  );
}

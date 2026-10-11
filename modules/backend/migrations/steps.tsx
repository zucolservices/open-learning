"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EXPAND_CONTRACT, ONE_STEP, TOOLS } from "./model";
import type { MigState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Bridge() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Replacing a bridge without closing the road"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            "Build the new bridge beside the old one",
            "Open both; let traffic use either",
            "Move all traffic to the new one",
            "Close and remove the old bridge",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-muted mr-2 font-mono">{i + 1}</span>
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Nobody demolishes a busy bridge and then starts building the new one. They build alongside,
        move traffic across, and only then remove the old one. Nobody is ever stranded.
      </p>
      <p>
        Database <Term id="migration">migrations</Term> on a live system need the same care. While a
        new version rolls out, old and new code run side by side, and both must work with the
        schema.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function Rename() {
  const [s, set] = useSceneState<MigState>();
  const frames = s.safe ? EXPAND_CONTRACT : ONE_STEP;
  const step = Math.min(s.step, frames.length - 1);
  const f = frames[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Rename a column on a live system"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.safe ? "safe" : "one"}
            onChange={(v) => set({ safe: v === "safe", step: 0 })}
            options={[
              ["one", "Rename in one step"],
              ["safe", "Expand and contract"],
            ]}
          />
          <p className="text-sm font-medium">{f.title}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border p-2 text-xs">
              <p className="text-muted mb-1 text-[10px]">customers table</p>
              <div className="flex flex-wrap gap-1">
                {f.columns.map((c) => (
                  <motion.span
                    layout
                    key={c}
                    className={cn(
                      "rounded border px-1.5 py-0.5 font-mono text-[10.5px]",
                      c === "mobile"
                        ? "border-viz-data bg-viz-data/15"
                        : c === "phone"
                          ? "border-viz-meta bg-viz-meta/15"
                          : "border-line",
                    )}
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="border-line bg-surface rounded-lg border p-2 text-xs">
              <p className="text-muted mb-1 text-[10px]">Running app copies</p>
              {f.apps.map((a, i) => (
                <p key={i} className="font-mono text-[10.5px]">
                  {a}
                </p>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs",
              f.errors ? "border-bad/40 bg-bad/10" : "border-good/50 bg-good/10",
            )}
          >
            <span className="font-mono font-semibold">{f.errors}</span> errors a minute ·{" "}
            <span className="text-muted">{f.note}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => set({ step: step - 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Step back
            </button>
            <button
              type="button"
              disabled={step === frames.length - 1}
              onClick={() => set({ step: step + 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Next step
            </button>
            <span className="text-subtle">
              {step + 1} / {frames.length}
            </span>
          </div>
        </div>
      }
    >
      <p>
        Customers&apos; phone column should be renamed mobile. Step through doing it in one go, then
        with <Term id="expand-contract">expand and contract</Term>. Error counts are illustrative.
      </p>
      <p>
        More steps, more deploys, but no moment when running code and the schema disagree, and a
        safe way back at every stage.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Versioned migrations"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              "migrations/\n  0041_add_mobile_to_customers.sql\n  0042_backfill_mobile.sql\n  0043_drop_phone.sql\n\nschema_history: 0041 ✓  0042 ✓  0043 (pending)"
            }
          </pre>
          {TOOLS.map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each change is a numbered script kept in the repository and reviewed like code. The tool
        records which scripts have run in a history table, so every environment ends up identical.
      </p>
      <p>
        The expand-and-contract pattern is also called parallel change; Danilo Sato described it on
        Martin Fowler&apos;s site in 2014.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Locks ---------------------------------------------------------------------------------------- */

export function Locks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Locks: the hidden danger"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Add a column with a constant default",
              "Instant in PostgreSQL since version 11: no table rewrite.",
            ],
            [
              "Create an index",
              "CREATE INDEX CONCURRENTLY keeps writes flowing, but can't run inside a transaction.",
            ],
            [
              "Set a lock timeout",
              "If a migration can't get its lock quickly, give up and retry rather than queue every query behind it.",
            ],
            [
              "Add NOT NULL to a big table",
              "Backfill first; PostgreSQL 18 can add the constraint as NOT VALID and check it later.",
            ],
            [
              "MySQL",
              "Schema changes commit immediately, so a failed multi-step migration can leave you halfway.",
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
        Some schema changes lock a table while they work. On a large, busy table, a lock that waits
        behind one long query can block every query after it, and the site stops.
      </p>
      <p>Test migrations on a copy of production-sized data before running them for real.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MigCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Expand and contract, in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="backend-migrations"
            prompt="Put the steps for renaming a column on a live system in order."
            items={[
              { id: "add", label: "Add the new column" },
              { id: "both", label: "Deploy code that writes to both columns" },
              { id: "backfill", label: "Backfill old rows in batches" },
              { id: "read", label: "Deploy code that reads the new column" },
              { id: "drop", label: "Stop writing the old column, then drop it" },
            ]}
            explanation="Expand first, migrate data and code while both versions work, and contract only when nothing uses the old column."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Migrations are code", "Versioned, reviewed, in order."],
        ["Old and new code overlap", "The schema must suit both."],
        ["Expand, migrate, contract", "Never rename in one step."],
        ["Mind the locks", "Concurrent indexes, lock timeouts."],
        ["Rehearse on real-sized data", "Before production."],
      ]}
    >
      <p>Next: transactions, and keeping data correct when requests collide.</p>
    </WrapStep>
  );
}

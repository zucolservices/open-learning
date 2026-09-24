"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Code } from "@/toolkit/controls/stepper";
import { cn } from "@/lib/cn";
import { FIXES, TARGETS, health, type FixId } from "./model";
import type { FixState } from "./state";

/* 2 ─ Investigate and fix ⭐ ---------------------------------------------------------------------- */

const EVIDENCE: { id: string; label: string; fixedBy: FixId; body: ReactNode }[] = [
  {
    id: "metadata",
    label: "Table metadata",
    fixedBy: "compact",
    body: (
      <Code>
        {
          "silver.orders\n  data files:      2,104,332\n  average size:    180 KB   (target 128–512 MB)\n  snapshots:       46,118\n  streaming job:   commits every 10 seconds"
        }
      </Code>
    ),
  },
  {
    id: "storage",
    label: "Storage",
    fixedBy: "expire",
    body: (
      <Code>
        {
          "live table data:              2.1 TB\nbucket total:                 6.4 TB\n  files only old snapshots use: 3.4 TB\n  orphan files (no snapshot):   0.9 TB\nsnapshot expiry job:          never run"
        }
      </Code>
    ),
  },
  {
    id: "plan",
    label: "Dashboard query plan",
    fixedBy: "filter",
    body: (
      <Code>
        {
          "SELECT store_id, SUM(amount) FROM gold.orders\nWHERE date_format(order_ts, 'yyyy-MM-dd') = '2026-09-23'\nGROUP BY store_id\n\nBatchScan gold.orders\n  PushedFilters: []\n  files read: 2,104,332 of 2,104,332"
        }
      </Code>
    ),
  },
  {
    id: "stats",
    label: "File statistics",
    fixedBy: "cluster",
    body: (
      <Code>
        {
          "sample of data files: min/max store_id\n  part-00017.parquet   1 … 480\n  part-00018.parquet   1 … 480\n  part-00019.parquet   2 … 480\n  …every file spans (almost) every store"
        }
      </Code>
    ),
  },
  {
    id: "checks",
    label: "Data checks",
    fixedBy: "merge",
    body: (
      <Code>
        {
          "SELECT count(*), count(DISTINCT order_id) FROM silver.orders\n  41,203,118   39,965,021   (3.1% duplicates)\n\nAirflow: silver_orders appends new rows;\n  11 runs this month succeeded on a retry"
        }
      </Code>
    ),
  },
];

function Metric({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        ok ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/5",
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

export function Investigate() {
  const [s, set] = useSceneState<FixState>();
  const on = new Set(s.fixes);
  const h = health(on);
  const ev = EVIDENCE.find((e) => e.id === s.tab) ?? EVIDENCE[0];
  const toggle = (f: FixId) =>
    set({ fixes: on.has(f) ? s.fixes.filter((x) => x !== f) : [...s.fixes, f] });
  const herrings = FIXES.filter((f) => !f.real && on.has(f.id));
  const healthy =
    h.queryS <= TARGETS.queryS &&
    h.storageTB <= TARGETS.storageTB &&
    h.files <= TARGETS.files &&
    h.dupPct === 0 &&
    !h.missing;

  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Investigate and fix"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Metric
              label="Dashboard load"
              value={`${h.queryS.toFixed(1)} s`}
              ok={h.queryS <= TARGETS.queryS}
            />
            <Metric
              label="Monthly bill"
              value={`$${Math.round(h.cost).toLocaleString("en-US")}`}
              ok={h.cost < 2_000}
            />
            <Metric
              label="Stored"
              value={`${h.storageTB.toFixed(1)} TB`}
              ok={h.storageTB <= TARGETS.storageTB}
            />
            <Metric
              label="Data files"
              value={h.files.toLocaleString("en-US")}
              ok={h.files <= TARGETS.files}
            />
            <Metric
              label="Revenue accuracy"
              value={h.missing ? "days missing" : h.dupPct ? `+${h.dupPct}%` : "exact"}
              ok={h.dupPct === 0 && !h.missing}
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5">
              {EVIDENCE.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => set({ tab: e.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition",
                    s.tab === e.id
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {on.has(e.fixedBy) && <CheckCircle2 className="text-good size-3.5" />}
                  {e.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                {ev.body}
                {on.has(ev.fixedBy) && (
                  <p className="text-good mt-1 text-xs">
                    ✓ Addressed by: {FIXES.find((f) => f.id === ev.fixedBy)!.label}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div>
            <p className="text-muted mb-1.5 text-xs">Possible fixes (apply any combination)</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {FIXES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="switch"
                  aria-checked={on.has(f.id)}
                  onClick={() => toggle(f.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left transition",
                    on.has(f.id)
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  <span className="block text-xs font-semibold">{f.label}</span>
                  <span className="text-muted block text-[11px]">{f.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              healthy && herrings.length === 0
                ? "border-good/40 bg-good/10"
                : "border-line bg-surface",
            )}
          >
            {herrings.length > 0 && (
              <ul className="mb-2 grid gap-1">
                {herrings.map((f) => (
                  <li key={f.id} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="text-bad mt-0.5 size-3.5 shrink-0" />
                    {HERRING[f.id]}
                  </li>
                ))}
              </ul>
            )}
            {healthy
              ? herrings.length
                ? "Healthy, but some of your changes aren't pulling their weight: see above."
                : "Healthy again: two-second dashboards, a bill under $500, exact revenue. Five causes, five fixes."
              : `${FIXES.filter((f) => f.real && on.has(f.id)).length} of the causes addressed. Check every piece of evidence: each points to a cause.`}
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative numbers. Real systems vary, but these five problems and their fixes are
            some of the most common in production lakehouses.
          </p>
        </div>
      }
    >
      <p>
        Five pieces of evidence, nine possible fixes. Read each piece of evidence, work out what it
        tells you, and apply the fixes you think address the causes.
      </p>
      <p className="text-muted text-sm">
        Every module in this track is in here somewhere: small files, maintenance, query plans, data
        skipping and idempotent pipelines.
      </p>
    </StepLayout>
  );
}

const HERRING: Partial<Record<FixId, string>> = {
  workers:
    "Doubling the cluster reads the same 2 million files a little faster, at $6,000 a month more. The work itself is the problem.",
  format:
    "Every format has the same failure modes: small files, unexpired snapshots and unskippable data. Migrating costs months and fixes none of them.",
  "partition-store":
    "A second partition column triples the file count: more, smaller files, the opposite of what's needed. Clustering is the fix for store filters.",
  "no-retries":
    "Without retries, duplicates stop, but every failed run now leaves a missing day. Make the job safe to retry instead (MERGE).",
};
